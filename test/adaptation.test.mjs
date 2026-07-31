/* Tests for the Adaptation Domain.
 *
 * THE IMPORT LIST IS PART OF THE TEST. This file imports the adaptation domain
 * and nothing else. No capability model, no preference model, no profiles. If
 * a test here ever needs one, the domain has stopped being a model of its own
 * subject matter and become a helper for somebody else's, and the failure
 * should be visible at the top of the file rather than buried in an assertion.
 */

import {
  defineInstance, defineInstanceSequence, defineEventType, defineEventTrigger,
  selectSequence, applySequence, touchedRows, AdaptationError, DATA_TYPES, OPERATIONS,
} from "../cradle/adaptation/adaptation.js";

let pass = 0, fail = 0;
const ok = (label, fn) => {
  try { fn(); console.log(`  PASS  ${label}`); pass++; }
  catch (e) { console.log(`  FAIL  ${label}\n        ${e.message}`); fail++; }
};
const eq = (a, b, what) => {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) throw new Error(`${what}: expected ${B}, got ${A}`);
};
const refuses = (fn, fragment) => {
  try { fn(); } catch (e) {
    if (!e.message.includes(fragment)) throw new Error(`refused for the wrong reason: ${e.message}`);
    console.log(`        -> ${e.message}`);
    return;
  }
  throw new Error(`accepted something it should have refused (${fragment})`);
};

/* A reference population in this domain's own terms. Rows are opaque here:
 * the domain has no idea these describe anybody, and that is the point. */
const reference = () => ({
  settings: {
    sight: { capability: "FULL" },
    hearing: { capability: "FULL" },
    touch: { capability: "FULL" },
  },
});

const blind = defineInstance({
  id: "blind-since-birth",
  operations: [
    { op: "modify", table: "settings", row: "sight", value: { capability: "NONE" } },
  ],
});
const alsoDeaf = defineInstance({
  id: "also-deaf",
  operations: [
    { op: "modify", table: "settings", row: "hearing", value: { capability: "NONE" } },
  ],
});

console.log("\nInstance — one transaction over rows:");

ok("an Instance is add, modify and delete over identified rows", () => {
  eq(OPERATIONS, ["add", "modify", "delete"], "verbs");
  eq(blind.operations.length, 1, "one operation");
  eq(blind.operations[0].table, "settings", "names a table");
  eq(blind.operations[0].row, "sight", "identifies a row");
});

ok("an empty transaction is refused", () => {
  refuses(() => defineInstance({ id: "x", operations: [] }), "adapts nothing");
});

ok("a delete carries no value, and an add must", () => {
  refuses(() => defineInstance({ id: "x", operations: [
    { op: "delete", table: "t", row: "r", value: 1 }] }), "a delete carries no value");
  refuses(() => defineInstance({ id: "x", operations: [
    { op: "add", table: "t", row: "r" }] }), "needs a value");
});

console.log("\nInstance Sequence — ordered by Sequence No, not by writing order:");

ok("Sequence No orders it, however it was written down", () => {
  const s = defineInstanceSequence({
    id: "fred",
    instances: [{ instance: alsoDeaf, sequenceNo: 2 }, { instance: blind, sequenceNo: 1 }],
  });
  eq(s.instances.map((i) => i.instance.id), ["blind-since-birth", "also-deaf"], "sorted");
});

/* "These both happen third" leaves the result undefined, and an undefined
 * result in a mechanism whose whole job is versioning is not a small thing. */
ok("two Instances may not share a Sequence No", () => {
  refuses(() => defineInstanceSequence({
    id: "x",
    instances: [{ instance: blind, sequenceNo: 1 }, { instance: alsoDeaf, sequenceNo: 1 }],
  }), "already used in this sequence");
});

console.log("\napplying — what an adaptation results in:");

const fred = defineInstanceSequence({
  id: "fred",
  instances: [{ instance: blind, sequenceNo: 1 }, { instance: alsoDeaf, sequenceNo: 2 }],
});

ok("the sequence applied to the reference gives the adapted result", () => {
  const out = applySequence(reference(), fred);
  eq(out.settings.sight, { capability: "NONE" }, "changed");
  eq(out.settings.hearing, { capability: "NONE" }, "changed");
  eq(out.settings.touch, { capability: "FULL" }, "untouched rows survive");
});

/* A hundred profiles are differences FROM one reference. Resolving any of
 * them must not damage it for the other ninety-nine. */
ok("the reference population is not mutated", () => {
  const tables = reference();
  applySequence(tables, fred);
  eq(tables.settings.sight, { capability: "FULL" }, "still FULL");
});

ok("add over something present, and modify of something absent, are both refused", () => {
  const addExisting = defineInstanceSequence({
    id: "s", instances: [{ sequenceNo: 1, instance: defineInstance({
      id: "i", operations: [{ op: "add", table: "settings", row: "sight", value: {} }] }) }],
  });
  refuses(() => applySequence(reference(), addExisting), "already has it — use modify");

  const modifyMissing = defineInstanceSequence({
    id: "s", instances: [{ sequenceNo: 1, instance: defineInstance({
      id: "i", operations: [{ op: "modify", table: "settings", row: "nope", value: {} }] }) }],
  });
  refuses(() => applySequence(reference(), modifyMissing), "does not have it — use add");
});

ok("a modify REPLACES the row rather than merging into it", () => {
  const tables = { settings: { s: { capability: "PARTIAL", measurement: 12 } } };
  const seq = defineInstanceSequence({
    id: "s", instances: [{ sequenceNo: 1, instance: defineInstance({
      id: "i", operations: [{ op: "modify", table: "settings", row: "s", value: { capability: "NONE" } }] }) }],
  });
  /* The stale measurement must not survive under the changed capability. */
  eq(applySequence(tables, seq).settings.s, { capability: "NONE" }, "replaced");
});

ok("an unknown table is refused rather than created", () => {
  const seq = defineInstanceSequence({
    id: "s", instances: [{ sequenceNo: 1, instance: defineInstance({
      id: "i", operations: [{ op: "add", table: "nope", row: "r", value: 1 }] }) }],
  });
  refuses(() => applySequence(reference(), seq), 'no such table "nope"');
});

console.log("\nreading the sequence — how much of this is the individual:");

/* The question that does NOT need anything recorded alongside the result:
 * the sequence is the answer, because the sequence is the profile. */
ok("touchedRows reports what the sequence adapts", () => {
  eq(touchedRows(fred), { settings: ["hearing", "sight"] }, "two of three rows");
});

console.log("\nEvent Trigger — names a sequence, fires nothing:");

const eventType = defineEventType({
  id: "NEW USER",
  triggerAttributeTypes: { userName: "string" },
});

ok("a Trigger Attribute is typed by its Data Type", () => {
  eq(DATA_TYPES, ["string", "number", "boolean"], "types");
  refuses(() => defineEventType({ id: "E", triggerAttributeTypes: { x: "colour" } }), "expected one of");
  refuses(() => defineEventTrigger({
    id: "T", eventType, attributes: { userName: 42 }, sequence: fred,
  }), "should be string");
});

ok("an attribute the Event Type does not declare is refused", () => {
  refuses(() => defineEventTrigger({
    id: "T", eventType, attributes: { nonesuch: "x" }, sequence: fred,
  }), "is not a Trigger Attribute");
});

ok("selecting matches on every declared attribute", () => {
  const t = defineEventTrigger({
    id: "ET01", eventType, attributes: { userName: "Fred" }, sequence: fred,
  });
  eq(selectSequence([t], "NEW USER", { userName: "Fred" })?.id, "fred", "matched");
  eq(selectSequence([t], "NEW USER", { userName: "Jim" }), null, "no match");
  eq(selectSequence([t], "OTHER", { userName: "Fred" }), null, "wrong event type");
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
