/* CISNA / MSIADU Capacity Model.
 * ---------------------------------------------------------------------------
 * Where a specific user's settings live, across multiple contexts.
 *
 * MODEL PROVENANCE (design/DEMOS.md §6a)
 *
 *   MODEL SPECIFIES. Figure 3 of "User Capability in an Adaptive World"
 *   (MSIADU'09): an Entity relates to Capability Templates; Setting has the
 *   same five sub-types as Property and maps directly onto it; Settings are
 *   organised into Setting Groups through Setting In Group; Setting Group
 *   relates to Capability Template and, through Influenced Group, to External
 *   Influence; Action relates to Setting through Setting Access and to
 *   External Influence through Action Trigger.
 *
 *   Four statements from the paper govern the design, and each is easy to get
 *   wrong in a way that looks reasonable:
 *
 *   1. "Settings themselves refine the characteristics of an Entity. An entity
 *      is either a user, or a group of users." So the model is not
 *      user-per-profile. A shared classroom machine is one Entity.
 *
 *   2. "The key difference between <context> and SettingGroup is that the same
 *      settings may appear in more than one group… the individual Setting is
 *      referenced in every case." So a Setting is a first-class value holder
 *      with its own identity, referenced by groups. It is NOT a value stored
 *      inside a context. Copying values into contexts is precisely the
 *      duplication the paper criticises Access for All for.
 *
 *   3. "there is no requirement for there to be a Setting for every Property in
 *      the CapabilityTemplate; this reflects the fact that not all Properties
 *      are necessarily relevant to a specific user in every context". A partial
 *      group is well-formed, not an error.
 *
 *   4. "Functional dependency is expressed through Actions. An Action is a mini
 *      program that can read and write Settings. A single action may access
 *      many Settings. Actions trigger as a result of ExternalInfluences."
 *
 *   MODEL SPECIFIES (parent method) + OUR DECISION. Point 4 says "functionally
 *   dependent". OOA96 chapter 2 separates functional from *mathematical*
 *   dependence, and a Setting computed from other Settings by a stated formula
 *   is the latter: "given values of the attributes in X, the value of Y can be
 *   determined by a formula or algorithm" (§2.3). OOA96 marks such attributes
 *   (M) and requires the description to "cite the formula or algorithm used".
 *
 *   Decision (DOMAINS.md §1b): derived Settings are (M)-marked and declarative.
 *   An Action is reserved for what genuinely processes — conditional branching
 *   on an External Influence, event generation. Most dependencies are formulae
 *   and need no action graph at all.
 *
 *   The (M) dependency graph is checked acyclic, per OOA96 §9.1. This is the
 *   place a cycle can actually arise: a tree of actions cannot contain one, but
 *   "A depends on B depends on A" across Settings can, and would leave the
 *   profile with no defined value.
 */

import { CapabilityError } from "./capability.js";
import { A, run, MapStore, classify, ActionError } from "../action/action-language.js";

export class CapacityError extends Error {
  constructor(message) {
    super(message);
    this.name = "CapacityError";
  }
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.getOwnPropertyNames(value)) deepFreeze(value[key]);
  }
  return value;
}

/* ---------------------------------------------------------------------------
 * Value checking
 *
 * "Regardless of its logical meaning, a Setting is characterized by the data
 * type it holds. Consequently there is a direct mapping between, for example,
 * Boolean Setting and Boolean Property."
 *
 * So the Setting sub-type is not declared; it is derived from the Property.
 * That mapping being direct is what lets this be a check rather than a choice.
 * ------------------------------------------------------------------------- */

export function checkValue(property, value, where, capability = null) {
  const fail = (msg) => {
    throw new CapacityError(`${where}: ${msg} (property ${property.name}, ${property.type})`);
  };

  switch (property.type) {
    case "boolean":
      if (typeof value !== "boolean") fail(`expected a boolean, got ${typeof value}`);
      return value;

    case "discrete":
      if (!property.values.includes(value)) {
        fail(`"${value}" is not one of ${property.values.join(", ")}`);
      }
      return value;

    case "numeric":
      if (typeof value !== "number" || Number.isNaN(value)) {
        fail(`expected a number, got ${JSON.stringify(value)}`);
      }
      if (value < property.min || value > property.max) {
        fail(`${value}${property.unit} is outside ${property.min}..${property.max}${property.unit}`);
      }
      return value;

    case "numericRange": {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        fail("expected {from, to}");
      }
      const { from, to } = value;
      if (typeof from !== "number" || typeof to !== "number") {
        fail("range needs numeric from and to");
      }
      if (from > to) fail(`range inverted: ${from} > ${to}`);
      if (property.min !== null && from < property.min) {
        fail(`range starts below ${property.min}${property.unit}`);
      }
      if (property.max !== null && to > property.max) {
        fail(`range ends above ${property.max}${property.unit}`);
      }
      return Object.freeze({ from, to });
    }

    case "text":
      if (typeof value !== "string") fail(`expected a string, got ${typeof value}`);
      if (property.maxLength !== null && value.length > property.maxLength) {
        fail(`text longer than ${property.maxLength}`);
      }
      return value;

    case "composite":
      /* The paper's example is the usable audio frequency range: "a collection
       * of numeric ranges measured in Hertz, WITH GAPS BETWEEN THE RANGES".
       * The gaps are the point. A listener with notched hearing loss is
       * expressible here and is not expressible as a single min and max, which
       * is why the composite type exists at all. */
      if (!Array.isArray(value) || !value.length) {
        fail("composite value must be a non-empty array of parts");
      }
      /* Each part is checked against the Property it composes. Two shapes are
       * legitimate and both appear in the model:
       *   one composedOf   -> a collection of that type, any length. The
       *                       paper's frequency-range example.
       *   many composedOf  -> a fixed tuple, one part per named Property.
       *                       viewRectangle as horizontal then vertical. */
      if (capability) {
        const parts = property.composedOf;
        if (parts.length > 1 && value.length !== parts.length) {
          fail(`composite expects ${parts.length} parts (${parts.join(", ")}), got ${value.length}`);
        }
        value.forEach((part, i) => {
          const partName = parts.length === 1 ? parts[0] : parts[i];
          const partProperty = capability.properties[partName];
          if (!partProperty) fail(`composes unknown property "${partName}"`);
          checkValue(partProperty, part, `${where} part ${i} (${partName})`, capability);
        });
      }
      return Object.freeze(value.map((v) => Object.freeze({ ...v })));

    default:
      fail(`unknown property type`);
  }
}

/** Apply the CompositionOrder. The paper's example is "ordering the usable
 *  frequency ranges from lowest to highest". */
function applyCompositionOrder(parts, order) {
  const copy = [...parts];
  if (order === "lowestToHighest") return copy.sort((a, b) => a.from - b.from);
  if (order === "highestToLowest") return copy.sort((a, b) => b.from - a.from);
  if (order === "asDeclared") return copy;
  throw new CapacityError(`unknown compositionOrder: ${order}`);
}

/* ---------------------------------------------------------------------------
 * Declaration
 * ------------------------------------------------------------------------- */

/**
 * Declare a Capacity Model against a Capability Model.
 *
 * @param {object} capability  A model from defineCapability().
 * @param {object} spec
 * @param {object} spec.entity     {id, kind: "user"|"group", description}
 * @param {object} spec.settings   Setting id -> {property, value} or {property, derived}
 * @param {object} [spec.groups]   SettingGroup id -> {template, settings, influencedBy}
 * @param {object} [spec.actions]  Action id -> {trigger, reads, writes, body}
 * @param {object} [spec.influences] External Influence name -> {values|type, description}
 */
export function defineCapacity(capability, spec) {
  if (!capability?.properties) {
    throw new CapacityError("defineCapacity needs a capability model as its first argument");
  }
  const { entity, settings, groups = {}, actions = {}, influences = {} } = spec ?? {};

  if (!entity?.id) throw new CapacityError("capacity model needs an entity with an id");
  if (entity.kind !== "user" && entity.kind !== "group") {
    throw new CapacityError(
      `entity kind must be "user" or "group" — the paper: "An entity is either a user, ` +
        `or a group of users"`,
    );
  }
  if (!settings || !Object.keys(settings).length) {
    throw new CapacityError("capacity model needs at least one setting");
  }

  /* --- external influences ---------------------------------------------- */
  const builtInfluences = {};
  for (const [name, inf] of Object.entries(influences)) {
    if (!inf?.description) throw new CapacityError(`influence ${name} needs a description`);
    builtInfluences[name] = Object.freeze({
      name,
      description: inf.description,
      values: inf.values ? Object.freeze([...inf.values]) : null,
      default: inf.default ?? null,
    });
  }

  /* --- settings ---------------------------------------------------------- */
  const builtSettings = {};
  for (const [id, s] of Object.entries(settings)) {
    const propertyName = s?.property ?? id;
    const property = capability.properties[propertyName];
    if (!property) {
      throw new CapacityError(
        `setting ${id} refers to property "${propertyName}", which the capability model ` +
          `does not declare`,
      );
    }

    const hasValue = "value" in (s ?? {});
    const hasDerived = "derived" in (s ?? {});
    if (hasValue === hasDerived) {
      throw new CapacityError(
        `setting ${id} needs exactly one of value or derived — it has ` +
          `${hasValue && hasDerived ? "both" : "neither"}`,
      );
    }

    if (hasValue) {
      let value = checkValue(property, s.value, `setting ${id}`, capability);
      if (property.type === "composite") {
        value = Object.freeze(applyCompositionOrder(value, property.compositionOrder));
      }
      builtSettings[id] = { id, property: propertyName, value, derived: null };
    } else {
      const d = s.derived;
      if (!Array.isArray(d?.reads) || !d.reads.length) {
        throw new CapacityError(
          `derived setting ${id} must declare what it reads — OOA96 §2.3 requires the ` +
            `dependent variable to cite its independent variables`,
        );
      }
      if (!d.formula) {
        throw new CapacityError(
          `derived setting ${id} needs a formula — OOA96 §2.3: "cite the formula or ` +
            `algorithm used to determine the value of the attribute"`,
        );
      }
      if (!d.cite) {
        throw new CapacityError(
          `derived setting ${id} needs a cite: a human-readable statement of the formula. ` +
            `The model requires it and the write-up depends on it`,
        );
      }
      /* (M) attributes are computed, so their formula must not write. A
       * derived Setting that mutates the store is an Action wearing a
       * formula's clothes, and the two are kept apart deliberately. */
      const shape = classify(d.formula);
      const writes = shape.accessors.filter((k) => ["write", "create", "delete"].includes(k));
      if (writes.length) {
        throw new CapacityError(
          `derived setting ${id} writes to the store (${writes.join(", ")}). A mathematically ` +
            `dependent value is computed, not assigned — use an Action instead`,
        );
      }
      builtSettings[id] = {
        id,
        property: propertyName,
        value: null,
        derived: Object.freeze({
          reads: Object.freeze([...d.reads]),
          formula: d.formula,
          cite: d.cite,
          influences: Object.freeze([...(d.influences ?? [])]),
        }),
      };
    }
  }

  /* Every read of a derived setting must name a setting that exists. */
  for (const s of Object.values(builtSettings)) {
    if (!s.derived) continue;
    for (const r of s.derived.reads) {
      if (!builtSettings[r]) {
        throw new CapacityError(`derived setting ${s.id} reads "${r}", which is not declared`);
      }
    }
    for (const i of s.derived.influences) {
      if (!builtInfluences[i]) {
        throw new CapacityError(
          `derived setting ${s.id} uses influence "${i}", which is not declared`,
        );
      }
    }
  }

  /* OOA96 §9.1, applied where cycles can actually occur. */
  detectDerivedCycle(builtSettings);

  /* --- setting groups ---------------------------------------------------- */
  const builtGroups = {};
  for (const [id, g] of Object.entries(groups)) {
    if (g?.template && !capability.templates[g.template]) {
      throw new CapacityError(
        `group ${id} names template "${g.template}", which the capability model does not declare`,
      );
    }
    if (!Array.isArray(g?.settings) || !g.settings.length) {
      throw new CapacityError(`group ${id} needs a settings list`);
    }
    for (const sid of g.settings) {
      if (!builtSettings[sid]) {
        throw new CapacityError(`group ${id} references setting "${sid}", which is not declared`);
      }
    }
    for (const inf of g.influencedBy ?? []) {
      if (!builtInfluences[inf]) {
        throw new CapacityError(
          `group ${id} is influenced by "${inf}", which is not declared`,
        );
      }
    }
    /* Point 3 above: a partial group is well-formed. Deliberately NOT an
     * error, and worth the comment because the instinct is to validate it. */
    builtGroups[id] = {
      id,
      description: g.description ?? "",
      template: g.template ?? null,
      settings: Object.freeze([...g.settings]),
      influencedBy: Object.freeze([...(g.influencedBy ?? [])]),
    };
  }

  /* --- actions ----------------------------------------------------------- */
  const builtActions = {};
  for (const [id, a] of Object.entries(actions)) {
    if (!a?.body) throw new CapacityError(`action ${id} needs a body`);
    if (!a.trigger?.influence) {
      throw new CapacityError(
        `action ${id} needs a trigger — "Actions trigger as a result of ExternalInfluences"`,
      );
    }
    if (!builtInfluences[a.trigger.influence]) {
      throw new CapacityError(
        `action ${id} triggers on "${a.trigger.influence}", which is not declared`,
      );
    }
    const reads = [...(a.reads ?? [])];
    const writes = [...(a.writes ?? [])];
    for (const sid of [...reads, ...writes]) {
      if (!builtSettings[sid]) {
        throw new CapacityError(`action ${id} declares access to "${sid}", which is not declared`);
      }
    }
    /* Setting Access, from Figure 3, made to mean something. Declaring which
     * Settings an Action touches is the textual equivalent of an ADFD's data
     * flows to and from its data stores, and it is the thing that makes an
     * Action inspectable without running it. */
    for (const sid of writes) {
      if (builtSettings[sid].derived) {
        throw new CapacityError(
          `action ${id} writes to derived setting "${sid}". A derived value is computed ` +
            `from its formula; writing it would make the profile inconsistent with itself`,
        );
      }
    }
    builtActions[id] = {
      id,
      description: a.description ?? "",
      trigger: Object.freeze({ influence: a.trigger.influence }),
      reads: Object.freeze(reads),
      writes: Object.freeze(writes),
      body: a.body,
    };
  }

  const model = {
    capability: capability.id,
    entity: Object.freeze({
      id: entity.id,
      kind: entity.kind,
      description: entity.description ?? "",
      /* Provenance of the profile itself. These exemplars stand in for lived
       * experience until lived experience is available; recording that in the
       * data, not only in prose, is what stops a fixture being mistaken for a
       * finding. */
      basis: entity.basis ?? "unspecified",
    }),
    settings: builtSettings,
    groups: builtGroups,
    actions: builtActions,
    influences: builtInfluences,
  };

  return deepFreeze(model);
}

function detectDerivedCycle(settings) {
  const WHITE = 0, GREY = 1, BLACK = 2;
  const colour = new Map(Object.keys(settings).map((k) => [k, WHITE]));
  const stack = [];
  const visit = (id) => {
    colour.set(id, GREY);
    stack.push(id);
    for (const next of settings[id].derived?.reads ?? []) {
      if (colour.get(next) === GREY) {
        const from = stack.indexOf(next);
        throw new CapacityError(
          `derived setting cycle: ${[...stack.slice(from), next].join(" -> ")} ` +
            `(OOA96 §9.1 — loops are not permitted)`,
        );
      }
      if (colour.get(next) === WHITE) visit(next);
    }
    stack.pop();
    colour.set(id, BLACK);
  };
  for (const id of Object.keys(settings)) if (colour.get(id) === WHITE) visit(id);
}

/* ---------------------------------------------------------------------------
 * Resolution
 * ------------------------------------------------------------------------- */

/**
 * Compute every Setting's effective value under a given set of External
 * Influences, running any triggered Actions first and then evaluating derived
 * (M) values in dependency order.
 *
 * The paper's argument for why this must happen at runtime rather than in an
 * offline tool: "only the on-line model is suitable for adaptive systems".
 */
export function resolve(capability, capacity, influences = {}) {
  for (const name of Object.keys(influences)) {
    const declared = capacity.influences[name];
    if (!declared) throw new CapacityError(`undeclared external influence: ${name}`);
    if (declared.values && !declared.values.includes(influences[name])) {
      throw new CapacityError(
        `influence ${name}="${influences[name]}" is not one of ${declared.values.join(", ")}`,
      );
    }
  }

  /* An External Influence that has not been reported this time falls back to
   * its declared default. Without this a profile could only be resolved by a
   * caller who happened to know every influence it depends on, which defeats
   * the point of the influence being external. */
  const effective = {};
  for (const [name, inf] of Object.entries(capacity.influences)) {
    if (inf.default !== null) effective[name] = inf.default;
  }
  Object.assign(effective, influences);

  /* Start from the declared literal values. */
  const values = new Map();
  for (const s of Object.values(capacity.settings)) {
    if (!s.derived) values.set(s.id, s.value);
  }

  const trace = [];
  const events = [];

  /* 1. Actions. "Actions trigger as a result of ExternalInfluences." An action
   *    whose trigger influence has not been reported does not fire — note the
   *    test is against what was actually reported, not the defaults, because a
   *    default is a resting state and not an event. */
  for (const action of Object.values(capacity.actions)) {
    if (!(action.trigger.influence in influences)) continue;

    const before = new Map(values);
    const store = new MapStore(Object.fromEntries(values));
    const result = run(action.body, { store, influences: effective });

    /* An action must not write outside its declared Setting Access. Checking
     * this rather than trusting the body is the same instinct as OOA96's
     * static event checking (§6.2): verify what can be verified. Compared
     * before applying, so a declared write cannot mask an undeclared one. */
    for (const key of store.keys()) {
      const changed = !before.has(key) || store.read(key) !== before.get(key);
      if (changed && !action.writes.includes(key)) {
        throw new CapacityError(
          `action ${action.id} wrote to "${key}", which is not in its declared writes ` +
            `(${action.writes.join(", ") || "none"})`,
        );
      }
    }

    for (const sid of action.writes) {
      const next = store.read(sid);
      if (next === undefined) continue;
      const property = capability.properties[capacity.settings[sid].property];
      values.set(sid, checkValue(property, next, `action ${action.id} writing ${sid}`, capability));
    }
    trace.push({ action: action.id, fired: true, steps: result.trace.length });
    events.push(...result.events);
  }

  /* 2. Derived (M) values, in dependency order. */
  for (const id of derivedOrder(capacity.settings)) {
    const s = capacity.settings[id];
    const store = new MapStore(Object.fromEntries(values));
    const result = run(s.derived.formula, { store, influences: effective });
    const property = capability.properties[s.property];
    values.set(id, checkValue(property, result.value, `derived setting ${id}`, capability));
    trace.push({ derived: id, cite: s.derived.cite, value: result.value });
  }

  return Object.freeze({
    values: Object.freeze(Object.fromEntries(values)),
    trace: Object.freeze(trace),
    events: Object.freeze(events),
  });
}

function derivedOrder(settings) {
  const out = [];
  const seen = new Set();
  const visit = (id) => {
    if (seen.has(id)) return;
    seen.add(id);
    for (const r of settings[id].derived?.reads ?? []) visit(r);
    if (settings[id].derived) out.push(id);
  };
  for (const id of Object.keys(settings).sort()) visit(id);
  return out;
}

/**
 * The effective settings of one Setting Group (context), resolved.
 *
 * A group names the Settings relevant to a context; the same Setting may be
 * named by several groups, and is the same Setting in each.
 */
export function groupValues(capability, capacity, groupId, influences = {}) {
  const group = capacity.groups[groupId];
  if (!group) throw new CapacityError(`no such setting group: ${groupId}`);
  const { values, trace, events } = resolve(capability, capacity, influences);
  const out = {};
  for (const sid of group.settings) out[sid] = values[sid];
  return Object.freeze({ group: groupId, values: Object.freeze(out), trace, events });
}

export { A, ActionError, CapabilityError };
