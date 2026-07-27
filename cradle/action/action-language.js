/* Action Language — the cradle's action interpreter.
 * ---------------------------------------------------------------------------
 * MODEL PROVENANCE (design/DEMOS.md §6a — five states, always distinguished)
 *
 *   BOB'S OWN PRIOR WORK, CARRIED FORWARD. This is not a new notation and not
 *   an adoption from Shlaer-Mellor. Action Language descends directly from the
 *   *definition* of an Action Data Flow Diagram — that it is a graph of
 *   actions — expressed as a tree rather than a diagram. See DOMAINS.md §1c.
 *
 *   The history matters because it explains the shape. ADFDs appear nowhere in
 *   the PhD work and nowhere in the Ascom work, for one reason: in the mid-90s
 *   nothing could draw them. Not even BridgePoint, Project Technology's own
 *   CASE tool, could draw an ADFD or record it as the action of a state. Both
 *   responses to that constraint were textual and both kept the semantics:
 *
 *     Ascom, 1995 — ADFDs replaced by actionable pseudocode in TCL. All
 *     modelled behaviour was Moore state models whose actions were TCL over
 *     assumed function calls, e.g. navigate(R1, R2, R3 {id:23}). Domains could
 *     then be simulated without transcription through Recursive Design,
 *     guaranteeing runtime event-model conformance instead.
 *
 *     The PhD — the same need in the adaptation layer, answered by going back
 *     to the ADFD definition and writing the graph in this notation.
 *
 *   MODEL SPECIFIES (parent method, OOA96). Three rules are taken directly:
 *
 *     §9.3  "OOA96 allows for exactly four types of processes on an ADFD:
 *            accessors, event generators, transformations, and tests."
 *     §9.3.1 "An accessor is now the only process type that can access an
 *            object data store."
 *     §9.3.3 "a test or transformation may no longer access an object data
 *            store." A transformation transforms datasets; a test tests
 *            relationships between its inputs.
 *     §9.1  "An ADFD forms one or more directed acyclic graphs; loops on the
 *            ADFD are not permitted."
 *
 *   Table 9.1 gives the accessor forms an architecture must support. The
 *   read/find/write/create/delete family is implemented here. The `create in`
 *   and `create unique in` forms are NOT: they exist to place a non-self-created
 *   instance into a named state of an active object's lifecycle, and the
 *   Capacity store has no lifecycles. Deferred rather than faked.
 *
 *   MY CHOICE. OOA96 orders processes by data availability — a process runs
 *   when its inputs arrive — which leaves sibling order free wherever there is
 *   no dependency. A tree fixes a total order. That is not a departure: any
 *   tree written here is *a* topological sort of the same DAG, and a valid
 *   linearisation of a DAG is a valid execution of it. The acyclicity rule
 *   still bites, but it bites where cycles can actually arise — in the
 *   dependency graph between derived Settings (see capacity.js), not in a tree,
 *   which cannot contain one by construction.
 *
 *   BOB'S OWN PRIOR WORK, AGAIN. `navigate` is from the Ascom TCL and has no
 *   counterpart in the method. OOA96 Table 9.1 is entirely per-object-data-store;
 *   there is no runtime primitive anywhere in it for walking a relationship,
 *   despite relationships being the backbone of the Information Model. Chained
 *   navigation appears only statically, as composition of relationships (§3,
 *   R3 = R1 + R2). The dynamic form is his.
 */

/** Raised for every misuse: a malformed tree, a process type reaching outside
 *  its remit, an unknown relation. Loud, like SemanticsError — a cradle that
 *  quietly tolerates a broken action model demonstrates nothing. */
export class ActionError extends Error {
  constructor(message) {
    super(message);
    this.name = "ActionError";
  }
}

/* ---------------------------------------------------------------------------
 * The store interface
 *
 * An accessor is the only thing that touches this, and it is supplied from
 * outside so the interpreter has no opinion about what is being stored. The
 * Capacity Model passes its Setting store; a test can pass a plain object.
 *
 * Required shape:
 *   read(key)                -> value | undefined
 *   write(key, value)        -> void
 *   has(key)                 -> boolean
 *   keys()                   -> iterable of key
 *   remove(key)              -> void
 *   navigate(from, relation) -> array of keys      (optional; see below)
 * ------------------------------------------------------------------------- */

/** A store backed by a Map, with an optional relation registry so `navigate`
 *  has something to walk. Relations are named (R1, R2, …) after the method's
 *  convention, and each is a function from a key to an array of keys. */
export class MapStore {
  #data = new Map();
  #relations = new Map();

  constructor(entries = {}, relations = {}) {
    for (const [k, v] of Object.entries(entries)) this.#data.set(k, v);
    for (const [name, fn] of Object.entries(relations)) {
      if (typeof fn !== "function") {
        throw new ActionError(`relation ${name} must be a function from key to key[]`);
      }
      this.#relations.set(name, fn);
    }
  }

  read(key) { return this.#data.get(key); }
  write(key, value) { this.#data.set(key, value); }
  has(key) { return this.#data.has(key); }
  keys() { return [...this.#data.keys()]; }
  remove(key) { this.#data.delete(key); }
  snapshot() { return Object.fromEntries(this.#data); }

  navigate(from, relation) {
    const fn = this.#relations.get(relation);
    if (!fn) throw new ActionError(`no such relation: ${relation}`);
    const out = fn(from, this);
    if (out === undefined || out === null) return [];
    return Array.isArray(out) ? out : [out];
  }
}

/* ---------------------------------------------------------------------------
 * The action tree
 *
 * Every node is {kind, …}. `A` builds them. Keeping the tree as plain frozen
 * data rather than class instances means an action model can be serialised,
 * diffed, and inspected without the interpreter present — which is the whole
 * point of a model that some other domain is supposed to be able to read.
 * ------------------------------------------------------------------------- */

const node = (kind, props) => Object.freeze({ kind, ...props });

export const A = {
  /* --- structure ------------------------------------------------------- */

  /** Sequence. The linearisation of the ADFD; see MY CHOICE above. */
  seq: (...body) => node("seq", { body: Object.freeze(body) }),

  /** TEST + control. §9.3.3: a test "is allowed only to test relationships
   *  between its inputs", and produces conditional control output. */
  ifThen: (test, then, otherwise = null) =>
    node("ifThen", { test, then, otherwise }),

  while: (test, body) => node("while", { test, body }),

  /* --- local values ---------------------------------------------------- */

  lit: (value) => node("lit", { value }),
  local: (name) => node("local", { name }),
  let: (name, expr) => node("let", { name, expr }),

  /* --- TRANSFORMATIONS -------------------------------------------------
   * §9.3.3: "A transformation is allowed only to transform datasets." No
   * store access. Includes picking a value out of a set, which is why min/max
   * and pick are here and not among the accessors. */

  add: (a, b) => node("op", { op: "+", a, b }),
  sub: (a, b) => node("op", { op: "-", a, b }),
  mul: (a, b) => node("op", { op: "*", a, b }),
  div: (a, b) => node("op", { op: "/", a, b }),
  min: (a, b) => node("op", { op: "min", a, b }),
  max: (a, b) => node("op", { op: "max", a, b }),
  clamp: (value, lo, hi) => node("clamp", { value, lo, hi }),

  /** Round to `dp` decimal places. Not decoration: a derived measurement is
   *  handed to a renderer, and "minimum readable size: 19.799999999999997pt"
   *  is binary floating point leaking into a user-facing capability. Where a
   *  formula produces a measurement, it should produce one a person could have
   *  stated. */
  round: (value, dp = 0) => node("round", { value, dp }),

  /** Build a composite measurement from named parts. A transformation: it
   *  computes a dataset and touches no store. */
  tuple: (parts) => node("tuple", { parts: Object.freeze({ ...parts }) }),

  /** Pick one part out of a composite. §9.3.3 allows exactly this: a
   *  transformation "also allows for picking a data value out of a set (pick
   *  the largest volume given a set of volumes, for example)". */
  field: (of, name) => node("field", { of, name }),

  /* --- TESTS ------------------------------------------------------------ */

  lt: (a, b) => node("op", { op: "<", a, b }),
  lte: (a, b) => node("op", { op: "<=", a, b }),
  gt: (a, b) => node("op", { op: ">", a, b }),
  gte: (a, b) => node("op", { op: ">=", a, b }),
  eq: (a, b) => node("op", { op: "==", a, b }),
  neq: (a, b) => node("op", { op: "!=", a, b }),
  and: (a, b) => node("op", { op: "&&", a, b }),
  or: (a, b) => node("op", { op: "||", a, b }),
  not: (a) => node("not", { a }),

  /* --- ACCESSORS (OOA96 Table 9.1) --------------------------------------
   * The ONLY nodes permitted to touch a data store. */

  read: (key) => node("read", { key }),

  /* A Capability Setting is a pair: a FULL/PARTIAL/NONE capability, and a
   * measurement that exists only when the capability is PARTIAL. Formulae want
   * one or the other, rarely the pair, so these two accessors save every
   * formula from reaching into the shape by hand. Both are accessors — they
   * touch the store — and are classified as such. */
  measure: (key) => node("measure", { key }),
  capabilityOf: (key) => node("capabilityOf", { key }),

  readWhere: (predicate) => node("readWhere", { predicate }),
  findWhere: (predicate) => node("findWhere", { predicate }),
  write: (key, expr) => node("write", { key, expr }),
  create: (key, expr) => node("create", { key, expr }),
  delete: (key) => node("delete", { key }),
  exists: (key) => node("exists", { key }),

  /** Bob's Ascom primitive. `navigate(from, [R1, R2, R3])` walks the relation
   *  chain from an instance and returns the set of instances found. */
  navigate: (from, relations) =>
    node("navigate", { from, relations: Object.freeze([...relations]) }),

  /* --- EVENT GENERATORS -------------------------------------------------
   * §9.3.2: "An event generator may only generate one type of event and may
   * not access an object data store." */

  generate: (eventType, data = {}) => node("generate", { eventType, data }),

  /* --- external influence ------------------------------------------------
   * Capacity Model, Figure 3: Actions trigger as a result of ExternalInfluences.
   * Reading an influence is not a store access — influences are inputs to the
   * action, arriving with the trigger, in the same way OOA96 §9.1 treats event
   * data as "always available". */

  influence: (name) => node("influence", { name }),
};

/* ---------------------------------------------------------------------------
 * Static checking
 *
 * OOA96 verifies what it can before execution (§6.2 "Static Event Checking").
 * The same instinct applies here: a process type that reaches outside its
 * remit is a modelling error and should be caught when the model is declared,
 * not when a particular branch happens to run.
 * ------------------------------------------------------------------------- */

const ACCESSOR_KINDS = new Set([
  "read", "measure", "capabilityOf", "readWhere", "findWhere",
  "write", "create", "delete", "exists", "navigate",
]);

/** Walk a tree and report which process types it contains. Used both to
 *  validate transformations/tests and to let callers assert an Action's shape. */
export function classify(action) {
  const found = { accessors: [], generators: [], transformations: 0, tests: 0 };
  const walk = (n) => {
    if (!n || typeof n !== "object") return;
    if (ACCESSOR_KINDS.has(n.kind)) found.accessors.push(n.kind);
    if (n.kind === "generate") found.generators.push(n.eventType);
    if (n.kind === "op") {
      if (["+", "-", "*", "/", "min", "max"].includes(n.op)) found.transformations++;
      else found.tests++;
    }
    if (["clamp", "tuple", "field", "round"].includes(n.kind)) found.transformations++;
    for (const key of Object.keys(n)) {
      const v = n[key];
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object" && v.kind) walk(v);
    }
  };
  walk(action);
  return found;
}

/** §9.3.2 — an event generator "may not access an object data store", and may
 *  generate exactly one type of event. Checked at declaration time. */
export function checkEventGenerator(action) {
  const { accessors, generators } = classify(action);
  if (accessors.length) {
    throw new ActionError(
      `event generator accesses a data store (${accessors.join(", ")}); ` +
        `OOA96 §9.3.2 forbids it`,
    );
  }
  if (generators.length !== 1) {
    throw new ActionError(
      `event generator must generate exactly one event, found ${generators.length}`,
    );
  }
  return true;
}

/* ---------------------------------------------------------------------------
 * The interpreter
 * ------------------------------------------------------------------------- */

class Scope {
  #vars = new Map();
  #parent;
  constructor(parent = null) { this.#parent = parent; }
  has(name) { return this.#vars.has(name) || (this.#parent?.has(name) ?? false); }
  get(name) {
    if (this.#vars.has(name)) return this.#vars.get(name);
    if (this.#parent) return this.#parent.get(name);
    throw new ActionError(`undeclared local: ${name}`);
  }
  set(name, value) { this.#vars.set(name, value); }
  child() { return new Scope(this); }
}

/** Result of running an action. `trace` exists for the same reason the
 *  TypeScript port's does: an adaptation you cannot watch decide is an
 *  adaptation you cannot argue about. */
export function run(action, {
  store = new MapStore(),
  influences = {},
  budget = 10000,
} = {}) {
  const trace = [];
  const events = [];
  const ctx = { store, influences, trace, events, steps: 0, budget };
  const value = evaluate(action, new Scope(), ctx, 0);
  return Object.freeze({
    value,
    events: Object.freeze(events),
    trace: Object.freeze(trace),
    store,
  });
}

function evaluate(n, scope, ctx, depth) {
  if (n === null || n === undefined) return null;
  if (++ctx.steps > ctx.budget) {
    throw new ActionError(`action exceeded ${ctx.budget} steps — probable non-termination`);
  }
  if (typeof n !== "object" || !n.kind) {
    throw new ActionError(`not an action node: ${JSON.stringify(n)}`);
  }

  const ev = (x) => evaluate(x, scope, ctx, depth + 1);
  const log = (kind, detail) => ctx.trace.push({ kind, depth, ...detail });

  switch (n.kind) {
    case "lit":
      return n.value;

    case "local":
      return scope.get(n.name);

    case "let": {
      const v = ev(n.expr);
      scope.set(n.name, v);
      log("let", { name: n.name, value: v });
      return v;
    }

    case "seq": {
      const inner = scope.child();
      let last = null;
      log("enter", { action: "seq" });
      for (const step of n.body) last = evaluate(step, inner, ctx, depth + 1);
      log("exit", { action: "seq" });
      return last;
    }

    case "ifThen": {
      const t = ev(n.test);
      log("test", { value: t });
      if (t) return evaluate(n.then, scope.child(), ctx, depth + 1);
      if (n.otherwise) return evaluate(n.otherwise, scope.child(), ctx, depth + 1);
      return null;
    }

    case "while": {
      let last = null;
      while (ev(n.test)) {
        if (++ctx.steps > ctx.budget) {
          throw new ActionError(`while loop exceeded ${ctx.budget} steps`);
        }
        last = evaluate(n.body, scope.child(), ctx, depth + 1);
      }
      return last;
    }

    case "not":
      return !ev(n.a);

    case "op": {
      const a = ev(n.a);
      const b = ev(n.b);
      switch (n.op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/":
          if (b === 0) throw new ActionError("division by zero");
          return a / b;
        case "min": return Math.min(a, b);
        case "max": return Math.max(a, b);
        case "<": return a < b;
        case "<=": return a <= b;
        case ">": return a > b;
        case ">=": return a >= b;
        case "==": return a === b;
        case "!=": return a !== b;
        case "&&": return Boolean(a) && Boolean(b);
        case "||": return Boolean(a) || Boolean(b);
        default: throw new ActionError(`unknown operator: ${n.op}`);
      }
    }

    case "clamp": {
      const v = ev(n.value), lo = ev(n.lo), hi = ev(n.hi);
      if (lo > hi) throw new ActionError(`clamp bounds inverted: ${lo} > ${hi}`);
      return Math.min(hi, Math.max(lo, v));
    }

    case "round": {
      const v = ev(n.value);
      if (typeof v !== "number") throw new ActionError(`round of a ${typeof v}`);
      const factor = 10 ** n.dp;
      return Math.round(v * factor) / factor;
    }

    case "tuple": {
      const out = {};
      for (const [k, v] of Object.entries(n.parts)) out[k] = ev(v);
      return Object.freeze(out);
    }

    case "field": {
      const of = ev(n.of);
      if (of === null || typeof of !== "object") {
        throw new ActionError(`field "${n.name}" of a ${of === null ? "null" : typeof of}`);
      }
      if (!(n.name in of)) {
        throw new ActionError(`no field "${n.name}" in ${JSON.stringify(of)}`);
      }
      return of[n.name];
    }

    /* --- accessors ------------------------------------------------------ */

    case "read": {
      const key = keyOf(n.key, scope, ctx, depth);
      const v = ctx.store.read(key);
      log("read", { key, value: v ?? null });
      return v === undefined ? null : v;
    }

    case "measure": {
      const key = keyOf(n.key, scope, ctx, depth);
      const setting = ctx.store.read(key);
      const v = setting && typeof setting === "object" ? setting.measurement ?? null : null;
      log("measure", { key, value: v });
      return v;
    }

    case "capabilityOf": {
      const key = keyOf(n.key, scope, ctx, depth);
      const setting = ctx.store.read(key);
      const v = setting && typeof setting === "object" ? setting.capability ?? null : null;
      log("capabilityOf", { key, value: v });
      return v;
    }

    case "exists":
      return ctx.store.has(keyOf(n.key, scope, ctx, depth));

    case "readWhere": {
      const out = [];
      for (const k of ctx.store.keys()) {
        if (n.predicate(k, ctx.store.read(k))) out.push(ctx.store.read(k));
      }
      log("readWhere", { count: out.length });
      return out;
    }

    case "findWhere": {
      const out = [];
      for (const k of ctx.store.keys()) {
        if (n.predicate(k, ctx.store.read(k))) out.push(k);
      }
      log("findWhere", { count: out.length });
      return out;
    }

    case "write": {
      const key = keyOf(n.key, scope, ctx, depth);
      const v = ev(n.expr);
      ctx.store.write(key, v);
      log("write", { key, value: v });
      return v;
    }

    case "create": {
      const key = keyOf(n.key, scope, ctx, depth);
      if (ctx.store.has(key)) {
        // OOA96 §8.3 note 3: a create accessor fails only when an instance
        // with the same identifier already exists. That is an analysis error.
        throw new ActionError(`create: ${key} already exists`);
      }
      const v = ev(n.expr);
      ctx.store.write(key, v);
      log("create", { key, value: v });
      return v;
    }

    case "delete": {
      const key = keyOf(n.key, scope, ctx, depth);
      ctx.store.remove(key);
      log("delete", { key });
      return null;
    }

    case "navigate": {
      const from = keyOf(n.from, scope, ctx, depth);
      let current = [from];
      for (const relation of n.relations) {
        const next = [];
        for (const k of current) {
          for (const found of ctx.store.navigate(k, relation)) {
            if (!next.includes(found)) next.push(found);
          }
        }
        current = next;
      }
      log("navigate", { from, relations: n.relations, found: current.length });
      return current;
    }

    /* --- event generator ------------------------------------------------ */

    case "generate": {
      const data = {};
      for (const [k, v] of Object.entries(n.data)) {
        data[k] = v && typeof v === "object" && v.kind ? ev(v) : v;
      }
      const event = Object.freeze({ type: n.eventType, data: Object.freeze(data) });
      ctx.events.push(event);
      log("generate", { eventType: n.eventType });
      return event;
    }

    case "influence": {
      if (!(n.name in ctx.influences)) {
        throw new ActionError(`no such external influence: ${n.name}`);
      }
      const v = ctx.influences[n.name];
      log("influence", { name: n.name, value: v });
      return v;
    }

    default:
      throw new ActionError(`unknown action kind: ${n.kind}`);
  }
}

/** A key may be a literal string or an expression evaluating to one. Letting
 *  it be either is what makes an accessor reusable across instances rather
 *  than hard-wired to one, which is the point of OOA96's "base process"
 *  (§9.2) — the process is defined once and invoked many times. */
function keyOf(key, scope, ctx, depth) {
  if (typeof key === "string") return key;
  const v = evaluate(key, scope, ctx, depth + 1);
  if (typeof v !== "string") throw new ActionError(`key expression gave ${typeof v}, wanted string`);
  return v;
}
