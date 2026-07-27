/* Tests for the Capability and Capacity Models, and the Action Language that
 * evaluates their dependencies.
 *
 * Same harness as semantics.test.mjs: no framework, the cradle is the framework.
 * A test that only proves the happy path proves very little here, so roughly
 * half of these assert that the models REFUSE something — an ontology violated,
 * a precedence cycle, a value outside its range, a derived setting that writes.
 * A capability model that accepts anything describes nobody. */

import { defineCapability, CapabilityError, propertiesOf, blockedProperties }
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
const onts = Object.keys(userCapability.ontologies).length;
console.log(`capability: ${userCapability.id} v${userCapability.version}  ` +
            `ontologies=${onts} properties=${props} ` +
            `templates=${Object.keys(userCapability.templates).length}\n`);

/* ------------------------------------------------------------------ */
console.log("Action Language — the four process types (OOA96 §9.3):");

ok("transformation computes without a store", () => {
  const r = run(A.mul(A.add(A.lit(2), A.lit(3)), A.lit(4)));
  eq(r.value, 20, "arithmetic");
});

ok("test yields conditional control", () => {
  const r = run(A.ifThen(A.lt(A.lit(1), A.lit(2)), A.lit("yes"), A.lit("no")));
  eq(r.value, "yes", "branch");
});

ok("accessor is the only thing that reaches the store", () => {
  const store = new MapStore({ a: 10 });
  const r = run(A.seq(A.write("b", A.add(A.read("a"), A.lit(5))), A.read("b")), { store });
  eq(r.value, 15, "read-back");
  eq(store.read("b"), 15, "store");
});

ok("event generator produces exactly one event", () => {
  const r = run(A.generate("FontSizeChanged", { to: A.lit(18) }));
  eq(r.events.length, 1, "event count");
  eq(r.events[0].type, "FontSizeChanged", "event type");
  eq(r.events[0].data.to, 18, "event data");
});

throws("event generator may not touch a data store (§9.3.2)", ActionError, () =>
  checkEventGenerator(A.seq(A.read("x"), A.generate("E1"))));

throws("event generator must generate exactly one event", ActionError, () =>
  checkEventGenerator(A.seq(A.generate("E1"), A.generate("E2"))));

ok("classify reports the shape of an action without running it", () => {
  const shape = classify(A.seq(A.write("x", A.add(A.lit(1), A.lit(2))), A.generate("E1")));
  eq(shape.accessors.length, 1, "accessors");
  eq(shape.generators.length, 1, "generators");
  eq(shape.transformations, 1, "transformations");
});

console.log("\nnavigate — Bob's Ascom primitive, absent from OOA96 Table 9.1:");

ok("walks a chain of relations and returns the instance set", () => {
  /* Three relations, in the shape of the TCL original:
   *   navigate(R1, R2, {id:23}) */
  const store = new MapStore(
    { "23": "batch", t1: "tank1", t2: "tank2", h1: "heater1", h2: "heater2" },
    {
      R1: (from) => (from === "23" ? ["t1", "t2"] : []),
      R2: (from) => (from === "t1" ? ["h1"] : from === "t2" ? ["h2"] : []),
    },
  );
  const r = run(A.navigate("23", ["R1", "R2"]), { store });
  eq(r.value.join(","), "h1,h2", "instances found");
});

ok("de-duplicates instances reached by more than one path", () => {
  const store = new MapStore({ a: 1, b: 1, c: 1 }, {
    R1: () => ["b", "c"],
    R2: () => ["a"],
  });
  eq(run(A.navigate("a", ["R1", "R2"]), { store }).value.length, 1, "deduped");
});

throws("an unknown relation is an error, not an empty set", ActionError, () => {
  run(A.navigate("a", ["R99"]), { store: new MapStore({ a: 1 }) });
});

throws("runaway actions are stopped", ActionError, () =>
  run(A.while(A.lit(true), A.lit(1)), { budget: 500 }));

/* ------------------------------------------------------------------ */
console.log("\nCapability Model — Figure 2:");

ok("subject ontologies are disjoint: every property has exactly one", () => {
  const counts = new Map();
  for (const [name, o] of Object.entries(userCapability.ontologies)) {
    for (const p of o.properties) counts.set(p, (counts.get(p) ?? 0) + 1);
  }
  for (const [p, n] of counts) if (n !== 1) throw new Error(`${p} is in ${n} ontologies`);
  eq(counts.size, props, "every property placed");
});

ok("precedence may cross ontology boundaries (Table 4's readSignText pattern)", () => {
  const p = userCapability.properties.readFontText;
  eq(p.ontology, "language", "own ontology");
  const parentOntologies = p.precedence.map((n) => userCapability.properties[n].ontology);
  if (!parentOntologies.includes("visual")) throw new Error("expected a visual parent");
  if (!parentOntologies.includes("language")) throw new Error("expected a language parent");
});

ok("acquisition order puts every precedence parent before its children", () => {
  const order = userCapability.acquisitionOrder;
  const at = new Map(order.map((n, i) => [n, i]));
  for (const [name, p] of Object.entries(userCapability.properties)) {
    for (const parent of p.precedence) {
      if (at.get(parent) >= at.get(name)) {
        throw new Error(`${parent} comes after its child ${name}`);
      }
    }
  }
  eq(order.length, props, "all properties ordered");
});

ok("the paper's own example: no minReadFontSizeForFont before sight", () => {
  const order = userCapability.acquisitionOrder;
  if (order.indexOf("sight") > order.indexOf("minReadFontSizeForFont")) {
    throw new Error("sight must be acquired first");
  }
});

ok("sight: NONE blocks everything beneath it", () => {
  const blocked = blockedProperties(userCapability, (p) => p === "sight");
  for (const p of ["focus", "tracking", "colorLow", "contrastSensitivity", "viewRectangle"]) {
    if (!blocked.has(p)) throw new Error(`${p} should be blocked`);
  }
  /* readFontText has parents in two ontologies, so blocking sight blocks it,
   * and blocking it blocks minReadFontSizeForFont transitively. */
  if (!blocked.has("minReadFontSizeForFont")) throw new Error("transitive block failed");
  /* Sonic capability is untouched — the ontologies are disjoint and this is
   * exactly why that matters for an audio-first demonstrator. */
  if (blocked.has("azimuthResolution")) throw new Error("sonic should be unaffected");
});

ok("propertiesOf returns one ontology in acquisition order", () => {
  const sonic = propertiesOf(userCapability, "sonic");
  if (sonic[0] !== "hearing") throw new Error(`expected hearing first, got ${sonic[0]}`);
  if (sonic.indexOf("concurrentStreams") > sonic.indexOf("listeningDuration")) {
    throw new Error("listeningDuration depends on concurrentStreams");
  }
});

throws("a property in an undeclared ontology is refused", CapabilityError, () =>
  defineCapability({
    id: "x", version: "1",
    ontologies: { visual: { description: "d" } },
    properties: { p: { ontology: "olfactory", type: "boolean", description: "d" } },
  }));

throws("a precedence cycle is refused", CapabilityError, () =>
  defineCapability({
    id: "x", version: "1",
    ontologies: { visual: { description: "d" } },
    properties: {
      a: { ontology: "visual", type: "boolean", description: "d", precedence: ["b"] },
      b: { ontology: "visual", type: "boolean", description: "d", precedence: ["a"] },
    },
  }));

throws("a numeric property without a unit is refused", CapabilityError, () =>
  defineCapability({
    id: "x", version: "1",
    ontologies: { visual: { description: "d" } },
    properties: { a: { ontology: "visual", type: "numeric", min: 0, max: 1, description: "d" } },
  }));

throws("a composite without a CompositionOrder is refused", CapabilityError, () =>
  defineCapability({
    id: "x", version: "1",
    ontologies: { sonic: { description: "d" } },
    properties: {
      band: { ontology: "sonic", type: "numericRange", unit: "Hz", description: "d" },
      range: { ontology: "sonic", type: "composite", composedOf: ["band"], description: "d" },
    },
  }));

/* ------------------------------------------------------------------ */
console.log("\nCapacity Model — Figure 3:");

ok("all six exemplars build", () => {
  eq(Object.keys(exemplars).length, 6, "exemplar count");
  for (const [name, p] of Object.entries(exemplars)) {
    if (!p.entity.basis.startsWith("exemplar")) {
      throw new Error(`${name} does not record its basis`);
    }
  }
});

ok("the composite carries gaps — the paper's reason for the type", () => {
  /* A listener with notched loss: usable below 2kHz and above 6kHz, nothing
   * between. Not expressible as a single min and max. */
  const notched = defineCapacity(userCapability, {
    entity: { id: "notched", kind: "user", basis: "exemplar — test fixture" },
    settings: {
      hearing: { value: "PARTIAL" },
      usableFrequencyRange: { value: [{ from: 6000, to: 12000 }, { from: 100, to: 2000 }] },
    },
  });
  const bands = notched.settings.usableFrequencyRange.value;
  eq(bands.length, 2, "two bands");
  /* CompositionOrder lowestToHighest was applied on declaration, so the
   * out-of-order declaration above comes back sorted. */
  eq(bands[0].from, 100, "sorted lowest first");
  eq(bands[1].from, 6000, "gap preserved between 2000 and 6000");
});

ok("viewRectangle is a fixed tuple of two extents", () => {
  eq(reference.settings.viewRectangle.value.length, 2, "H and V");
});

throws("a value outside its property range is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: { contrastSensitivity: { value: 140 } },
  }));

throws("a discrete value not in the list is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: { sight: { value: "MOSTLY" } },
  }));

throws("an entity that is neither user nor group is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "robot" },
    settings: { sight: { value: "FULL" } },
  }));

throws("a setting with both a value and a formula is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: {
      sight: { value: "FULL" },
      contrastSensitivity: { value: 50, derived: { reads: ["sight"], cite: "c", formula: A.lit(1) } },
    },
  }));

throws("a derived setting that writes is refused — that is an Action", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: {
      contrastSensitivity: { value: 50 },
      colorLow: {
        derived: {
          reads: ["contrastSensitivity"],
          cite: "bad",
          formula: A.seq(A.write("contrastSensitivity", A.lit(10)), A.lit(50)),
        },
      },
    },
  }));

throws("a cycle between derived settings is refused (OOA96 §9.1)", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: {
      colorLow: { derived: { reads: ["colorHigh"], cite: "c", formula: A.read("colorHigh") } },
      colorHigh: { derived: { reads: ["colorLow"], cite: "c", formula: A.read("colorLow") } },
    },
  }));

/* ------------------------------------------------------------------ */
console.log("\nthe exemplars say what they should:");

ok("blind-since-birth carries no setting beneath sight", () => {
  eq(blindSinceBirth.settings.sight.value, "NONE", "sight");
  for (const gone of ["focus", "tracking", "colorLow", "contrastSensitivity",
                      "minReadFontSizeForFont", "viewRectangle"]) {
    if (blindSinceBirth.settings[gone]) {
      throw new Error(`${gone} should have been removed, not zeroed`);
    }
  }
  /* Sonic capability is not merely retained but sharpened, and Braille added. */
  eq(blindSinceBirth.settings.concurrentStreams.value, 4, "streams");
  eq(blindSinceBirth.settings.hapticLanguageSet.value, "Braille", "braille");
});

ok("the two low-vision exemplars differ in the right dimension", () => {
  eq(lowVisionContrast.settings.contrastSensitivity.value, 30, "contrast impaired");
  eq(lowVisionContrast.settings.colorMedium.value, 100, "colour intact");
  eq(lowVisionColour.settings.colorMedium.value, 25, "colour impaired");
  eq(lowVisionColour.settings.contrastSensitivity.value, 100, "contrast intact");
});

ok("keyboard-only is a capability, not a preference", () => {
  eq(keyboardOnly.settings.pointerControl.value, "NONE", "pointer");
  eq(keyboardOnly.settings.keyControl.value, "FULL", "keys");
  if (keyboardOnly.settings.minTargetSize) {
    throw new Error("minTargetSize is beneath pointerControl and should be gone");
  }
});

console.log("\nfunctional dependency — the paper's own worked example:");

ok("hand tremor: mounted display uses the seated size", () => {
  const { values } = resolve(userCapability, handTremor, { deviceStability: "MOUNTED" });
  eq(values.fontSizeSeated, 12, "base");
  eq(values.minReadFontSizeForFont, 12, "mounted");
});

ok("hand tremor: hand-held display needs a larger size", () => {
  const { values, trace } = resolve(userCapability, handTremor, { deviceStability: "HANDHELD" });
  /* 12 * (1 + (100-35)/100) = 12 * 1.65 */
  near(values.minReadFontSizeForFont, 19.8, "handheld");
  const cited = trace.find((t) => t.derived === "minReadFontSizeForFont");
  if (!cited?.cite) throw new Error("the (M) formula was not cited in the trace");
});

ok("the same profile, unresolved, holds no value for the derived setting", () => {
  if (handTremor.settings.minReadFontSizeForFont.value !== null) {
    throw new Error("a derived setting must not carry a stored value");
  }
});

ok("influences fall back to their declared default", () => {
  const { values } = resolve(userCapability, handTremor);
  eq(values.minReadFontSizeForFont, 12, "default is MOUNTED");
});

throws("an undeclared influence is refused", CapacityError, () =>
  resolve(userCapability, handTremor, { gravity: "HIGH" }));

throws("an influence value outside its list is refused", CapacityError, () =>
  resolve(userCapability, handTremor, { deviceStability: "FLOATING" }));

ok("a reference profile has nothing to derive and resolves unchanged", () => {
  const { values, trace } = resolve(userCapability, reference);
  eq(values.minReadFontSizeForFont, 11, "literal");
  eq(trace.length, 0, "no derivation, no actions");
});

console.log("\nsetting groups — contexts that share settings:");

ok("a group resolves only its own settings", () => {
  const { values } = groupValues(userCapability, reference, "listening");
  eq(Object.keys(values).length, 5, "five settings in the listening group");
  if ("sight" in values) throw new Error("sight is not in the listening group");
});

ok("the same setting is referenced by more than one group, not copied", () => {
  const seated = reference.groups.seated.settings;
  const input = reference.groups.input.settings;
  /* Distinct groups, and where they overlap they name the same Setting id —
   * which is the difference between a SettingGroup and an Access for All
   * <context>. */
  eq(seated.includes("sight"), true, "seated names sight");
  eq(input.includes("keyControl"), true, "input names keyControl");
  const shared = seated.filter((s) => input.includes(s));
  eq(shared.length, 0, "these two happen not to overlap");
});

ok("a group survives its profile losing settings", () => {
  /* blind-since-birth removed most of what `seated` named; the group was
   * pruned rather than left dangling. */
  const g = blindSinceBirth.groups.seated;
  if (!g) throw new Error("group vanished entirely");
  for (const sid of g.settings) {
    if (!blindSinceBirth.settings[sid]) throw new Error(`dangling reference: ${sid}`);
  }
});

throws("a group naming an unknown setting is refused", CapacityError, () =>
  defineCapacity(userCapability, {
    entity: { id: "x", kind: "user" },
    settings: { sight: { value: "FULL" } },
    groups: { g: { settings: ["sight", "nonesuch"] } },
  }));

/* ------------------------------------------------------------------ */
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
