/* The Adaptation Domain: a semantic model of adapting one thing from another.
 * ---------------------------------------------------------------------------
 * THIS DOMAIN KNOWS NOTHING ELSE EXISTS. No capability, no preference, no
 * setting, no user. Its subject matter is adaptation itself, and putting
 * another domain's vocabulary in here would make it that domain's helper
 * rather than a model in its own right. The test is mechanical: this file
 * imports nothing, and its tests run with no user model in scope.
 *
 * ONE INSTANCE OF THE DOMAIN PER APPLICATION, populated with everything
 * adaptable across the whole system. Not one per client. The multiplicity
 * lives in the BRIDGES, which map objects in a client domain to their
 * counterparts here: a Setting over in Capability has a counterpart Row in
 * this domain, and neither model mentions the other.
 *
 * IT DESCRIBES, IT DOES NOT DRIVE (Bob 2026-07-30). Nothing here causes an
 * application to do anything. It says what adapting means, and what the result
 * of an adaptation is. Something else decides when.
 *
 * TABLE AND ROW ARE THIS DOMAIN'S OWN ABSTRACTIONS, and they are ANALYSIS,
 * not storage. Transcoded to a supporting architecture there may be no tables
 * anywhere: JSON objects, arrays, properties, records, rows in an actual
 * database. The model says a Table holds identified Rows and an Instance is a
 * transaction of add, modify and delete over them. How that is represented is
 * the architecture's business, not this model's. In the JavaScript cradle a
 * Table is a plain object keyed by row id, because that is the natural
 * representation here and carries the semantics exactly.
 *
 * VOCABULARY follows MSIADU'09 rather than the Render Model note, per the
 * decision closing issue #6 on 2026-07-27: Instance Sequence over Instance
 * Application, Sequence No over Application Order, Data Type over Attribute
 * Value Type. "Application" is overloaded across the two sources — the Render
 * Model uses it for the Application Model of rendered content AND for the
 * adaptation mechanism, which in code would put applicationOrder beside
 * ApplicationModel as a standing invitation to misread.
 */

export class AdaptationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AdaptationError";
  }
}

/** The types a Trigger Attribute may carry. Deliberately few: this domain
 *  types the values that decide whether a trigger fires, and nothing else. */
export const DATA_TYPES = Object.freeze(["string", "number", "boolean"]);

/** The transaction verbs. Database-style, which is the paper's own framing:
 *  an Instance "adds, modifies, or deletes rows in the Tables". */
export const OPERATIONS = Object.freeze(["add", "modify", "delete"]);

const fail = (msg) => { throw new AdaptationError(msg); };

/* ---------------------------------------------------------------------------
 * Instance — one transaction over rows
 * ------------------------------------------------------------------------- */

/** A transaction of add, modify and delete over identified rows in named
 *  tables. Ordered as declared: an Instance may delete a row an earlier
 *  operation in the same Instance added, and saying so is the author's job.
 *
 *  ADD and MODIFY are distinguished rather than merged into an upsert. A
 *  modify of something absent is almost always a typo, and an add over
 *  something present is almost always a second author who did not know about
 *  the first. Collapsing them hides both. */
export function defineInstance(spec) {
  if (!spec || typeof spec !== "object") fail("defineInstance needs a spec object");
  const { id, description = null, operations } = spec;
  if (!id) fail("an Instance needs an id");
  if (!Array.isArray(operations) || !operations.length) {
    fail(`Instance ${id} has no operations — an empty transaction adapts nothing`);
  }

  const built = operations.map((o, i) => {
    const where = `Instance ${id} operation ${i}`;
    if (!OPERATIONS.includes(o?.op)) {
      fail(`${where}: op "${o?.op}"; expected one of ${OPERATIONS.join(", ")}`);
    }
    if (!o.table) fail(`${where}: no table named`);
    if (!o.row) fail(`${where}: no row identified`);
    if (o.op === "delete" && "value" in o) {
      fail(`${where}: a delete carries no value`);
    }
    if (o.op !== "delete" && !("value" in o)) {
      fail(`${where}: an ${o.op} needs a value`);
    }
    return Object.freeze({
      op: o.op, table: o.table, row: o.row,
      ...(o.op === "delete" ? {} : { value: o.value }),
    });
  });

  return Object.freeze({ id, description, operations: Object.freeze(built) });
}

/* ---------------------------------------------------------------------------
 * Instance Sequence — ordered container
 * ------------------------------------------------------------------------- */

/** An ordered set of Instances. The ordering is carried by Sequence No on the
 *  associative instance-to-apply, not by array position, because the order is
 *  a fact about the model rather than about how somebody happened to write it
 *  down. Two Instances may not share a Sequence No: "these both happen third"
 *  leaves the result undefined, and an undefined result in a mechanism whose
 *  whole job is versioning is not a small thing. */
export function defineInstanceSequence(spec) {
  if (!spec || typeof spec !== "object") fail("defineInstanceSequence needs a spec object");
  const { id, description = null, instances } = spec;
  if (!id) fail("an Instance Sequence needs an id");
  if (!Array.isArray(instances)) fail(`Instance Sequence ${id} needs an instances list`);

  const seen = new Set();
  const built = instances.map((entry, i) => {
    const where = `Instance Sequence ${id} entry ${i}`;
    const instance = entry?.instance;
    if (!instance?.operations) fail(`${where}: no Instance`);
    const sequenceNo = entry.sequenceNo;
    if (typeof sequenceNo !== "number" || !Number.isFinite(sequenceNo)) {
      fail(`${where}: Sequence No must be a number`);
    }
    if (seen.has(sequenceNo)) {
      fail(`${where}: Sequence No ${sequenceNo} is already used in this sequence`);
    }
    seen.add(sequenceNo);
    return Object.freeze({ instance, sequenceNo });
  });

  built.sort((a, b) => a.sequenceNo - b.sequenceNo);
  return Object.freeze({ id, description, instances: Object.freeze(built) });
}

/* ---------------------------------------------------------------------------
 * Event Type and Event Trigger — what names a sequence
 * ------------------------------------------------------------------------- */

export function defineEventType(spec) {
  if (!spec || typeof spec !== "object") fail("defineEventType needs a spec object");
  const { id, triggerAttributeTypes = {} } = spec;
  if (!id) fail("an Event Type needs an id");
  const built = {};
  for (const [name, dataType] of Object.entries(triggerAttributeTypes)) {
    if (!DATA_TYPES.includes(dataType)) {
      fail(`Event Type ${id}: Trigger Attribute Type "${name}" has Data Type ` +
           `"${dataType}"; expected one of ${DATA_TYPES.join(", ")}`);
    }
    built[name] = dataType;
  }
  return Object.freeze({ id, triggerAttributeTypes: Object.freeze(built) });
}

/** An Event Trigger names an Instance Sequence and the Trigger Attribute
 *  values that select it. It does not fire anything: it records that WHEN an
 *  event of this type carries these values, THAT sequence is the one. Deciding
 *  when is somebody else's subject matter. */
export function defineEventTrigger(spec) {
  if (!spec || typeof spec !== "object") fail("defineEventTrigger needs a spec object");
  const { id, eventType, attributes = {}, sequence } = spec;
  if (!id) fail("an Event Trigger needs an id");
  if (!eventType?.triggerAttributeTypes) fail(`Event Trigger ${id} names no Event Type`);
  if (!sequence?.instances) fail(`Event Trigger ${id} names no Instance Sequence`);

  for (const [name, value] of Object.entries(attributes)) {
    const dataType = eventType.triggerAttributeTypes[name];
    if (!dataType) {
      fail(`Event Trigger ${id}: "${name}" is not a Trigger Attribute of Event Type ${eventType.id}`);
    }
    if (typeof value !== dataType) {
      fail(`Event Trigger ${id}: Trigger Attribute "${name}" should be ${dataType}, got ${typeof value}`);
    }
  }
  return Object.freeze({ id, eventType, attributes: Object.freeze({ ...attributes }), sequence });
}

/** Which trigger matches an event, or null. Every declared Trigger Attribute
 *  must match; attributes the trigger does not mention are not consulted. */
export function selectSequence(triggers, eventTypeId, attributes = {}) {
  for (const t of triggers) {
    if (t.eventType.id !== eventTypeId) continue;
    const every = Object.entries(t.attributes)
      .every(([k, v]) => attributes[k] === v);
    if (every) return t.sequence;
  }
  return null;
}

/* ---------------------------------------------------------------------------
 * Applying — what an adaptation RESULTS IN
 * ------------------------------------------------------------------------- */

/** Apply an Instance Sequence to a set of Tables and return the adapted set.
 *
 *  Describing the result of adapting is this domain's subject matter, so this
 *  belongs here. Deciding WHEN to adapt does not, and nothing here does it.
 *
 *  Pure: the input tables are not mutated, so the reference population a
 *  hundred profiles are differences FROM cannot be damaged by resolving one
 *  of them. */
export function applySequence(tables, sequence) {
  if (!tables || typeof tables !== "object") fail("applySequence needs tables");
  if (!sequence?.instances) fail("applySequence needs an Instance Sequence");

  const out = {};
  for (const [name, rows] of Object.entries(tables)) out[name] = { ...rows };

  for (const { instance, sequenceNo } of sequence.instances) {
    for (const op of instance.operations) {
      const where = `Instance ${instance.id} (Sequence No ${sequenceNo})`;
      const table = out[op.table];
      if (!table) fail(`${where}: no such table "${op.table}"`);

      if (op.op === "add") {
        if (op.row in table) {
          fail(`${where}: add "${op.row}" to ${op.table}, which already has it — use modify`);
        }
        table[op.row] = op.value;
      } else if (op.op === "modify") {
        if (!(op.row in table)) {
          fail(`${where}: modify "${op.row}" in ${op.table}, which does not have it — use add`);
        }
        /* REPLACES rather than merges, so a row can lose a part it used to
         * carry. A merge would leave stale fragments underneath a changed
         * value, which is a whole class of quiet wrongness. */
        table[op.row] = op.value;
      } else {
        if (!(op.row in table)) {
          fail(`${where}: delete "${op.row}" from ${op.table}, which does not have it`);
        }
        delete table[op.row];
      }
    }
  }

  for (const name of Object.keys(out)) Object.freeze(out[name]);
  return Object.freeze(out);
}

/** Which rows a sequence touches, per table. The answer to "how much of this
 *  is about this individual, and how much is inherited from the template it
 *  was built from" — read off the sequence, needing nothing recorded
 *  alongside the result. */
export function touchedRows(sequence) {
  const out = {};
  for (const { instance } of sequence.instances) {
    for (const op of instance.operations) {
      (out[op.table] ??= new Set()).add(op.row);
    }
  }
  return Object.freeze(
    Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Object.freeze([...v].sort())])),
  );
}
