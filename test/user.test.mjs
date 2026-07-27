/* Tests for the Capability and Capacity Models, and the Action Language that
 * evaluates their dependencies.
 *
 * Same harness as semantics.test.mjs: no framework, the cradle is the framework.
 * Roughly half of these assert that the models REFUSE something — a capability
 * beneath one that does not exist, a measurement against FULL, a precedence
 * cycle. A capability model that accepts anything describes nobody. */

import { defineCapability, CapabilityError, propertiesOf, ofInterest,
         isOfInterest, impliedCapability, CAPABILITY }
  from "../cradle/user/capability.js";
import { defineCapacity, resolve, groupValues, CapacityError }
  from "../cradle/user/capacity.js";
import { A, run, MapStore, ActionError, checkEventGenerator, classify }
  from "../cradle/action/action-language.js";
import { userCapability } from "../vocabulary/user-capability.js";
import { exemplars, reference, blindSinceBirth, lowVisionContrast,
         lowVisionColour, keyboardOnly, handTremor } from "../vocabulary/profiles.js";

let pass = 0, fail = 0;
const ok = (label, fn) => {
  try { fn(); console.log(`  PASS  ${label}`); pass++; }
  catch (e) { console.log(`  FAIL  ${label}\n        ${e.message}`); fail++; }
};
const throws = (label, Kind, fn) => {
  try { fn(); console.log(`  FAIL  ${label} (expected a throw)`); fail++; }
  catch (e) {
    if (e instanceof Kind) { console.log(`  PASS  ${label}\n        -> ${e.message.split("\n")[0]}`); pass++; }
    else { console.log(`  FAIL  ${label} (wrong error: ${e.name}: ${e.message})`); fail++; }
  }
};
const eq = (a, b, what) => {
  if (a !== b) throw new Error(`${what}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
};
const near = (a, b, what, tol = 1e-9) => {
  if (Math.abs(a - b) > tol) throw new Error(`${what}: expected ~${b}, got ${a}`);
};

const props = Object.keys(userCapability.properties).length;
console.log(`capability: ${userCapability.id} v${userCapability.version}  ` +
  `ontologies=${Object.keys(userCapability.ontologies).length} properties=${props} ` +
  `templates=${Object.keys(userCapability.templates).length}\n`);

/* ------------------------------------------------------------------ */
console.log("Action Language — the four process types (OOA96 §9.3):");

ok("transformation computes without a store", () =>
  eq(run(A.mul(A.add(A.lit(2), A.lit(3)), A.lit(4))).value, 20, "arithmetic"));

ok("test yields conditional control", () =>
  eq(run(A.ifThen(A.lt(A.lit(1), A.lit(2)), A.lit("yes"), A.lit("no"))).value, "yes", "branch"));

ok("accessor is the only thing that reaches the store", () => {
  const store = new MapStore({ a: 10 });
  eq(run(A.seq(A.write("b", A.add(A.read("a"), A.lit(5))), A.read("b")), { store }).value, 15, "read-back");
});

ok("tuple and field compose and decompose a measurement", () => {
  const r = run(A.field(A.tuple({ size: A.lit(12), font: A.lit("serif") }), "size"));
  eq(r.value, 12, "field");
});

ok("event generator produces exactly one event", () => {
  const r = run(A.generate("FontSizeChanged", { to: A.lit(18) }));
  eq(r.events.length, 1, "count");
  eq(r.events[0].data.to, 18, "data");
});

throws("event generator may not touch a data store (§9.3.2)", ActionError, () =>
  checkEventGenerator(A.seq(A.read("x"), A.generate("E1"))));

throws("event generator must generate exactly one event", ActionError, () =>
  checkEventGenerator(A.seq(A.generate("E1"), A.generate("E2"))));

ok("classify reports an action's shape without running it", () => {
  const shape = classify(A.seq(A.write("x", A.add(A.lit(1), A.lit(2))), A.generate("E1")));
  eq(shape.accessors.length, 1, "accessors");
  eq(shape.generators.length, 1, "generators");
});

console.log("\nnavigate — Bob's Ascom primitive, absent from OOA96 Table 9.1:");

ok("walks a chain of relations and returns the instance set", () => {
  const store = new MapStore(
    { "23": "batch", t1: "tank1", t2: "tank2", h1: "heater1", h2: "heater2" },
    { R1: (f) => (f === "23" ? ["t1", "t2"] : []),
      R2: (f) => (f === "t1" ? ["h1"] : f === "t2" ? ["h2"] : []) },
  );
  eq(run(A.navigate("23", ["R1", "R2"]), { store }).value.join(","), "h1,h2", "found");
});

ok("de-duplicates instances reached by more than one path", () => {
  const store = new MapStore({ a: 1, b: 1, c: 1 }, { R1: () => ["b", "c"], R2: () => ["a"] });
  eq(run(A.navigate("a", ["R1", "R2"]), { store }).value.length, 1, "deduped");
});

throws("an unknown relation is an error, not an empty set", ActionError, () =>
  run(A.navigate("a", ["R99"]), { store: new MapStore({ a: 1 }) }));

throws("runaway actions are stopped", ActionError, () =>
  run(A.while(A.lit(true), A.lit(1)), { budget: 500 }));

/* ------------------------------------------------------------------ */
console.log("\nCapability Model — every property is FULL / PARTIAL / NONE:");

ok("the scale is the model, not a per-property data type", () => {
  eq(CAPABILITY.join(","), "NONE,PARTIAL,FULL", "scale");
  /* focus carries no measurement at all — Table 3 gives its Values column as
   * the scale itself. focusDuration carries minutes, which qualify PARTIAL. */
  eq(userCapability.properties.focus.measurement, null, "focus has no measurement");
  eq(userCapability.properties.focusDuration.measurement.unit, "min", "focusDuration unit");
});

throws("declaring a property `type` is refused outright", CapabilityError, () =>
  defineCapability({
    id: "x", version: "1",
    ontologies: { visual: { description: "d" } },
    properties: { a: { ontology: "visual", type: "numeric", description: "d" } },
  }));

ok("subject ontologies are disjoint: every property has exactly one", () => {
  const counts = new Map();
  for (const o of Object.values(userCapability.ontologies)) {
    for (const p of o.properties) counts.set(p, (counts.get(p) ?? 0) + 1);
  }
  for (const [p, n] of counts) if (n !== 1) throw new Error(`${p} is in ${n} ontologies`);
  eq(counts.size, props, "every property placed");
});

ok("precedence may cross ontology boundaries (Table 4's readSignText pattern)", () => {
  const p = userCapability.properties.readFontText;
  eq(p.ontology, "language", "own ontology");
  const parents = p.precedence.map((n) => userCapability.properties[n].ontology);
  if (!parents.includes("visual")) throw new Error("expected a visual parent");
  if (!parents.includes("language")) throw new Error("expected a language parent");
});

ok("acquisition order puts every precedence parent before its children", () => {
  const at = new Map(userCapability.acquisitionOrder.map((n, i) => [n, i]));
  for (const [name, p] of Object.entries(userCapability.properties)) {
    for (const parent of p.precedence) {
      if (at.get(parent) >= at.get(name)) throw new Error(`${parent} comes after ${name}`);
    }
  }
});

console.log("\n'only of interest for PARTIAL sight' — read literally:");

ok("FULL parents make children uninteresting", () => {
  const all = { sight: "FULL", language: "FULL", hearing: "FULL" };
  if (isOfInterest(userCapability, "colorLow", (p) => all[p])) {
    throw new Error("colorLow should not be asked when sight is FULL");
  }
});

ok("NONE parents make children uninteresting too", () => {
  const none = { sight: "NONE" };
  if (isOfInterest(userCapability, "colorLow", (p) => none[p])) {
    throw new Error("colorLow should not be asked when sight is NONE");
  }
});

ok("PARTIAL is where the questions live", () => {
  const partial = { sight: "PARTIAL" };
  if (!isOfInterest(userCapability, "colorLow", (p) => partial[p])) {
    throw new Error("colorLow should be asked when sight is PARTIAL");
  }
});

ok("only NONE propagates — FULL is a heuristic, not an implication", () => {
  eq(impliedCapability(userCapability, "colorLow", () => "NONE"), "NONE", "NONE forces");
  eq(impliedCapability(userCapability, "colorLow", () => "FULL"), null, "FULL does not force");
  /* Tunnel vision is the case that breaks a strict ceiling: PARTIAL sight with
   * entirely FULL colour perception is coherent and must stay expressible. */
  eq(impliedCapability(userCapability, "colorLow", () => "PARTIAL"), null, "PARTIAL frees");
});

ok("an acquisition wizard is ofInterest() in a loop", () => {
  const asked = ofInterest(userCapability, { sight: "NONE", hearing: "FULL", language: "FULL",
                                             touch: "FULL", pointerControl: "FULL",
                                             keyControl: "FULL", manualStability: "FULL" });
  if (asked.includes("colorLow")) throw new Error("must not ask about colour with no sight");
  if (asked.includes("minReadFontSizeForFont")) throw new Error("the paper's own example");
  if (!asked.includes("sight")) throw new Error("root properties are always asked");
});

ok("propertiesOf returns one ontology in acquisition order", () => {
  const sonic = propertiesOf(userCapability, "sonic");
  eq(sonic[0], "hearing", "hearing first");
});

throws("a property in an undeclared ontology is refused", CapabilityError, () =>
  defineCapability({
    id: "x", version: "1",
    ontologies: { visual: { description: "d" } },
    properties: { p: { ontology: "olfactory", description: "d" } },
  }));

throws("a precedence cycle is refused", CapabilityError, () =>
  defineCapability({
    id: "x", version: "1",
    ontologies: { v: { description: "d" } },
    properties: {
      a: { ontology: "v", description: "d", precedence: ["b"] },
      b: { ontology: "v", description: "d", precedence: ["a"] },
    },
  }));

throws("a numeric measurement without a unit is refused", CapabilityError, () =>
  defineCapability({
    id: "x", version: "1",
    ontologies: { v: { description: "d" } },
    properties: { a: { ontology: "v", description: "d",
                       measurement: { type: "numeric", min: 0, max: 1 } } },
  }));

throws("a composed collection without a CompositionOrder is refused", CapabilityError, () =>
  defineCapability({
    id: "x", version: "1",
    ontologies: { s: { description: "d" } },
    properties: { a: { ontology: "s", description: "d",
                       measurement: { type: "composite", of: { type: "numericRange", unit: "Hz" } } } },
  }));

/* ------------------------------------------------------------------ */
console.log("\nCapacity Model — a measurement qualifies PARTIAL and nothing else:");

ok("all six exemplars build", () => {
  eq(Object.keys(exemplars).length, 6, "count");
  for (const [name, p] of Object.entries(exemplars)) {
    if (!p.entity.basis.startsWith("exemplar")) throw new Error(`${name} records no basis`);
  }
});

ok("the reference profile is seven settings, and that is the model working", () => {
  eq(Object.keys(reference.settings).length, 7, "settings");
  for (const s of Object.values(reference.settings)) {
    eq(s.capability, "FULL", `${s.id}`);
    eq(s.measurement, null, `${s.id} measurement`);
  }
});

throws("a measurement against FULL is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: { sight: { capability: "PARTIAL" },
                contrastSensitivity: { capability: "FULL", measurement: 80 } },
  }));

throws("a measurement against NONE is refused — nothing there to measure", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: { sight: { capability: "PARTIAL" },
                contrastSensitivity: { capability: "NONE", measurement: 0 } },
  }));

throws("PARTIAL without its measurement is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: { sight: { capability: "PARTIAL" },
                contrastSensitivity: { capability: "PARTIAL" } },
  }));

ok("PARTIAL without a measurement is fine when the property declares none", () => {
  const m = defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: { sight: { capability: "PARTIAL" }, focus: { capability: "PARTIAL" } },
  });
  eq(m.settings.focus.measurement, null, "blurred vision needs no number");
});

throws("a capability beneath a NONE parent is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: { sight: { capability: "NONE" },
                colorLow: { capability: "PARTIAL", measurement: 50 } },
  }));

ok("a capability beneath a FULL parent is allowed — extra detail, not a contradiction", () => {
  const m = defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: {
      language: { capability: "FULL" }, touch: { capability: "FULL" },
      hapticLanguageSet: { capability: "PARTIAL", measurement: ["Braille"] },
    },
  });
  eq(m.settings.hapticLanguageSet.measurement[0], "Braille", "braille recorded");
});

ok("the composite carries gaps — the paper's reason for the type", () => {
  const notched = defineCapacity(userCapability, {
    entity: { id: "notched", kind: "user", basis: "exemplar — test fixture" },
    settings: {
      hearing: { capability: "PARTIAL" },
      usableFrequencyRange: {
        capability: "PARTIAL",
        measurement: [{ from: 6000, to: 12000 }, { from: 100, to: 2000 }],
      },
    },
  });
  const bands = notched.settings.usableFrequencyRange.measurement;
  eq(bands.length, 2, "two bands");
  /* CompositionOrder lowestToHighest applied on declaration, so the
   * out-of-order declaration comes back sorted, with the gap intact. */
  eq(bands[0].from, 100, "sorted");
  eq(bands[1].from, 6000, "gap between 2000 and 6000 preserved");
});

ok("a composite tuple checks every named part", () => {
  eq(lowVisionContrast.settings.minReadFontSizeForFont.measurement.size, 18, "size");
  eq(lowVisionContrast.settings.minReadFontSizeForFont.measurement.font, "system-sans", "font");
});

throws("a composite tuple missing a part is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: {
      sight: { capability: "PARTIAL" }, language: { capability: "FULL" },
      manualStability: { capability: "FULL" }, readFontText: { capability: "PARTIAL" },
      minReadFontSizeForFont: { capability: "PARTIAL", measurement: { size: 14 } },
    },
  }));

throws("a discrete measurement outside its list is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: { language: { capability: "FULL" }, keyControl: { capability: "FULL" },
                writeFontSet: { capability: "PARTIAL", measurement: ["SEMAPHORE"] } },
  }));

throws("an entity that is neither user nor group is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "robot" }, settings: { sight: { capability: "FULL" } },
  }));

throws("two settings for one property disagreeing on capability is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: {
      sight: { capability: "PARTIAL" },
      a: { property: "contrastSensitivity", capability: "PARTIAL", measurement: 30 },
      b: { property: "contrastSensitivity", capability: "NONE" },
    },
  }));

throws("a derived setting that writes is refused — that is an Action", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: {
      sight: { capability: "PARTIAL" },
      contrastSensitivity: { capability: "PARTIAL", measurement: 50 },
      colorLow: {
        capability: "PARTIAL",
        derived: { reads: ["contrastSensitivity"], cite: "bad",
                   formula: A.seq(A.write("contrastSensitivity", A.lit(10)), A.lit(50)) },
      },
    },
  }));

throws("a derived setting must be PARTIAL — only measurements derive", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: {
      sight: { capability: "PARTIAL" },
      contrastSensitivity: { capability: "PARTIAL", measurement: 50 },
      colorLow: { capability: "FULL",
                  derived: { reads: ["contrastSensitivity"], cite: "c", formula: A.lit(50) } },
    },
  }));

throws("a cycle between derived settings is refused (OOA96 §9.1)", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: {
      sight: { capability: "PARTIAL" },
      colorLow: { capability: "PARTIAL",
                  derived: { reads: ["colorHigh"], cite: "c", formula: A.measure("colorHigh") } },
      colorHigh: { capability: "PARTIAL",
                   derived: { reads: ["colorLow"], cite: "c", formula: A.measure("colorLow") } },
    },
  }));

/* ------------------------------------------------------------------ */
console.log("\nthe exemplars say what they should:");

ok("blind-since-birth is one changed line, and nothing is zeroed", () => {
  eq(blindSinceBirth.settings.sight.capability, "NONE", "sight");
  for (const gone of ["focus", "tracking", "colorLow", "contrastSensitivity",
                      "minReadFontSizeForFont", "viewRectangle"]) {
    if (blindSinceBirth.settings[gone]) throw new Error(`${gone} should not be recorded at all`);
  }
  eq(blindSinceBirth.settings.readFontText.capability, "NONE", "cannot read visually");
  eq(blindSinceBirth.settings.hearing.capability, "FULL", "hearing untouched");
  eq(blindSinceBirth.settings.hapticLanguageSet.measurement[0], "Braille", "braille");
});

ok("the two low-vision exemplars differ in the right dimension", () => {
  eq(lowVisionContrast.settings.contrastSensitivity.measurement, 30, "contrast impaired");
  eq(lowVisionContrast.settings.colorMedium.capability, "FULL", "colour intact");
  eq(lowVisionColour.settings.colorMedium.measurement, 25, "colour impaired");
  eq(lowVisionColour.settings.contrastSensitivity.capability, "FULL", "contrast intact");
});

ok("keyboard-only is a capability, not a preference", () => {
  eq(keyboardOnly.settings.pointerControl.capability, "NONE", "pointer");
  eq(keyboardOnly.settings.keyControl.capability, "FULL", "keys");
  eq(keyboardOnly.settings.writeFontSet.measurement[0], "SELECT", "writes by selection");
});

console.log("\nfunctional dependency — the paper's own worked example:");

ok("hand tremor: mounted display uses the seated size", () => {
  const { settings } = resolve(userCapability, handTremor, { deviceStability: "MOUNTED" });
  eq(settings.minReadFontSizeForFont.measurement.size, 12, "mounted");
});

ok("hand tremor: hand-held display needs a larger size", () => {
  const { settings, trace } = resolve(userCapability, handTremor, { deviceStability: "HANDHELD" });
  near(settings.minReadFontSizeForFont.measurement.size, 19.8, "handheld");
  eq(settings.minReadFontSizeForFont.measurement.font, "system-sans", "font carried through");
  if (!trace.find((t) => t.derived === "minReadFontSizeForFont")?.cite) {
    throw new Error("the (M) formula was not cited in the trace");
  }
});

ok("the capability stays declared while the measurement derives", () => {
  eq(handTremor.settings.minReadFontSizeForFont.capability, "PARTIAL", "declared");
  eq(handTremor.settings.minReadFontSizeForFont.measurement, null, "no stored value");
});

ok("influences fall back to their declared default", () =>
  eq(resolve(userCapability, handTremor).settings.minReadFontSizeForFont.measurement.size, 12,
     "default is MOUNTED"));

throws("an undeclared influence is refused", CapacityError, () =>
  resolve(userCapability, handTremor, { gravity: "HIGH" }));

throws("an influence value outside its list is refused", CapacityError, () =>
  resolve(userCapability, handTremor, { deviceStability: "FLOATING" }));

ok("a profile with nothing to derive resolves unchanged", () => {
  const { settings, trace } = resolve(userCapability, reference);
  eq(settings.sight.capability, "FULL", "sight");
  eq(trace.length, 0, "no derivation, no actions");
});

console.log("\nsetting groups — contexts that share settings:");

ok("a group resolves only its own settings", () => {
  const { settings } = groupValues(userCapability, reference, "listening");
  eq(Object.keys(settings).length, 1, "one setting");
  if ("sight" in settings) throw new Error("sight is not in the listening group");
});

ok("a group survives its profile losing settings", () => {
  const g = keyboardOnly.groups.input;
  for (const sid of g.settings) {
    if (!keyboardOnly.settings[sid]) throw new Error(`dangling reference: ${sid}`);
  }
});

throws("a group naming an unknown setting is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: { sight: { capability: "FULL" } },
    groups: { g: { settings: ["sight", "nonesuch"] } },
  }));

/* ------------------------------------------------------------------ */
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
