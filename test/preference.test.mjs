/* Tests for the Preference Model and the accessors that read it.
 *
 * Same harness as the others: no framework, the cradle is the framework.
 *
 * The load-bearing tests here are the ones asserting what the model does NOT
 * do. A preference model that clamped a choice to what capability suggested
 * would be the medical model wearing a different hat, so "an unwelcome choice
 * is accepted" gets as much attention as "an invalid type is refused".
 */

import { definePreference, statePreferences, inferPreference, stated, hasPreference,
         provenanceOf, valueOf, rankOf, PreferenceError, PREFERENCE_KINDS }
  from "../cradle/user/preference.js";
import { A, run, classify } from "../cradle/action/action-language.js";

let pass = 0, fail = 0;
const ok = (label, fn) => {
  try { fn(); console.log(`  PASS  ${label}`); pass++; }
  catch (e) { console.log(`  FAIL  ${label}\n        ${e.message}`); fail++; }
};
const eq = (a, b, what) => {
  const A_ = JSON.stringify(a), B_ = JSON.stringify(b);
  if (A_ !== B_) throw new Error(`${what}: expected ${B_}, got ${A_}`);
};
const refuses = (fn, fragment) => {
  try { fn(); } catch (e) {
    if (!e.message.includes(fragment)) {
      throw new Error(`refused for the wrong reason: ${e.message}`);
    }
    console.log(`        -> ${e.message.split("\n")[0]}`);
    return;
  }
  throw new Error(`accepted something it should have refused (${fragment})`);
};

const model = definePreference({
  id: "test.preference", version: "1",
  categories: {
    designSpace: { description: "Which sense carries meaning." },
    modality: { description: "Which interaction channel." },
    perception: { description: "How it is presented." },
    tooling: { description: "Which software, configured how." },
  },
  preferences: {
    channelOrder: {
      category: "designSpace", kind: "ranked",
      domain: ["audio", "visual", "tactile"],
      description: "Sensory channels, most preferred first.",
    },
    inputOrder: {
      category: "modality", kind: "ranked",
      domain: ["keyboard", "pointer", "speech", "switch", "gaze"],
      description: "Input channels, most preferred first.",
    },
    readFontSize: {
      category: "perception", kind: "valued",
      measurement: { type: "numeric", min: 4, max: 96, unit: "pt" },
      qualifies: "minReadFontSizeForFont",
      description: "Preferred reading size.",
    },
    screenReader: {
      category: "tooling", kind: "valued",
      measurement: { type: "text" },
      description: "Which screen reader.",
    },
  },
});

console.log("\nthe schema — four categories, one key space:");

ok("all four categories are reachable the same way", () => {
  eq(Object.keys(model.categories).sort(),
     ["designSpace", "modality", "perception", "tooling"], "categories");
  for (const name of ["channelOrder", "inputOrder", "readFontSize", "screenReader"]) {
    const p = model.preferences[name];
    if (!p) throw new Error(`${name} missing`);
    if (!PREFERENCE_KINDS.includes(p.kind)) throw new Error(`${name} has no valid kind`);
  }
});

ok("a preference records which capability it sits beside, where there is one", () => {
  eq(model.preferences.readFontSize.qualifies, "minReadFontSizeForFont", "paired");
  eq(model.preferences.channelOrder.qualifies, null, "design space pairs with nothing single");
});

ok("an undeclared category is refused", () => {
  refuses(() => definePreference({
    id: "x", version: "1",
    categories: { a: { description: "d" } },
    preferences: { p: { category: "nope", kind: "valued", measurement: { type: "text" }, description: "d" } },
  }), "which is not declared");
});

ok("a ranked preference needs a domain worth ordering", () => {
  refuses(() => definePreference({
    id: "x", version: "1",
    categories: { a: { description: "d" } },
    preferences: { p: { category: "a", kind: "ranked", domain: ["only"], description: "d" } },
  }), "at least two");
});

console.log("\nstating preferences — validate the TYPE, never the CHOICE:");

ok("a ranked order may be PARTIAL — no view is not an error", () => {
  const p = statePreferences(model, {
    entity: { id: "u" }, values: { channelOrder: ["audio", "tactile"] },
  });
  eq(valueOf(p, "channelOrder"), ["audio", "tactile"], "kept as given");
  eq(rankOf(p, "channelOrder", "audio"), 0, "most preferred");
  eq(rankOf(p, "channelOrder", "visual"), null, "unranked reads as no view");
});

ok("an order cannot list the same thing twice", () => {
  refuses(() => statePreferences(model, {
    entity: { id: "u" }, values: { channelOrder: ["audio", "audio"] },
  }), "same thing twice");
});

ok("an order cannot name something outside its domain", () => {
  refuses(() => statePreferences(model, {
    entity: { id: "u" }, values: { channelOrder: ["telepathy"] },
  }), "is not one of");
});

ok("an undeclared preference is refused", () => {
  refuses(() => statePreferences(model, {
    entity: { id: "u" }, values: { nonesuch: 3 },
  }), "not declared in the preference model");
});

ok("a value of the wrong TYPE is refused", () => {
  refuses(() => statePreferences(model, {
    entity: { id: "u" }, values: { readFontSize: "banana" },
  }), "expected a number");
});

/* The one that matters most. A capability model may well suggest this person
 * needs 18pt. Wanting 6pt is a decision, not an error, and the model must take
 * it. Bob's cellphone case is the standing argument: the chosen handset had
 * neither the largest keys nor the largest text. */
ok("a choice the capability model would not have suggested is ACCEPTED", () => {
  const p = statePreferences(model, {
    entity: { id: "u" }, values: { readFontSize: 6 },
  });
  eq(valueOf(p, "readFontSize"), 6, "taken as given");
});

ok("but a value off the scale entirely is still refused", () => {
  refuses(() => statePreferences(model, {
    entity: { id: "u" }, values: { readFontSize: 400 },
  }), "outside 4..96");
});

console.log("\nthe accessors — choosing by preference, or by rule:");

const prefs = statePreferences(model, {
  entity: { id: "u" },
  values: { channelOrder: ["audio", "tactile"], readFontSize: 18 },
});

/* The canonical shape. Preference-wins is STRUCTURAL: there is no branch in
 * which capability overrides a stated preference, because the capability side
 * is only reached when nothing was stated. */
const choose = A.ifThen(
  A.stated("readFontSize"),
  A.preferred("readFontSize"),
  A.lit(12),                       // stands in for a selection rule
);

ok("a stated preference wins", () => {
  eq(run(choose, { preferences: prefs }).value, 18, "preference");
});

ok("with nothing stated, the selection rule decides", () => {
  eq(run(choose, { preferences: null }).value, 12, "rule");
  eq(run(choose, {}).value, 12, "absent preferences are the resting state, not an error");
});

ok("an unstated preference reads null rather than throwing", () => {
  eq(run(A.preferred("screenReader"), { preferences: prefs }).value, null, "null");
  eq(run(A.stated("screenReader"), { preferences: prefs }).value, false, "not stated");
});

ok("rankOf distinguishes unranked from last", () => {
  eq(run(A.rankOf("channelOrder", A.lit("audio")), { preferences: prefs }).value, 0, "first");
  eq(run(A.rankOf("channelOrder", A.lit("tactile")), { preferences: prefs }).value, 1, "second");
  eq(run(A.rankOf("channelOrder", A.lit("visual")), { preferences: prefs }).value, null, "no view");
});

ok("preference reads classify as OOA96 accessors", () => {
  const found = classify(A.seq(
    A.preferred("readFontSize"), A.stated("readFontSize"),
    A.rankOf("channelOrder", A.lit("audio")),
  ));
  for (const k of ["preferred", "stated", "rankOf"]) {
    if (!found.accessors.includes(k)) throw new Error(`${k} not classified as an accessor`);
  }
});

console.log("\ninferred preferences — high-level choices imply low-level ones:");

/* A person who puts audio ahead of vision has, in effect, said something about
 * speech rate they never typed in. Inferring it is not the system deciding what
 * they want; it is the system following through on what they already said. */
const inferRate = A.ifThen(
  A.eq(A.rankOf("channelOrder", A.lit("audio")), A.lit(0)),
  A.prefer("readFontSize", A.lit(22)),
  A.lit(null),
);

ok("an inference fills a gap, and says it was inferred", () => {
  const p = statePreferences(model, {
    entity: { id: "u" }, values: { channelOrder: ["audio", "tactile"] },
  });
  const r = run(inferRate, { preferences: p, inferPreference, ruleId: "audio-first" });
  eq(valueOf(r.preferences, "readFontSize"), 22, "inferred value");
  eq(provenanceOf(r.preferences, "readFontSize"), "inferred", "provenance");
  eq(r.preferences.provenance.readFontSize.by, "audio-first", "which rule");
  eq(hasPreference(r.preferences, "readFontSize"), true, "there is a value");
  eq(stated(r.preferences, "readFontSize"), false, "but the person did not say it");
});

/* The one that keeps this honest. */
ok("an inference NEVER overwrites what the person actually said", () => {
  const p = statePreferences(model, {
    entity: { id: "u" }, values: { channelOrder: ["audio"], readFontSize: 30 },
  });
  const r = run(inferRate, { preferences: p, inferPreference, ruleId: "audio-first" });
  eq(valueOf(r.preferences, "readFontSize"), 30, "the person's value stands");
  eq(provenanceOf(r.preferences, "readFontSize"), "stated", "still theirs");
});

ok("the overruled inference is recorded rather than discarded", () => {
  const p = statePreferences(model, {
    entity: { id: "u" }, values: { channelOrder: ["audio"], readFontSize: 30 },
  });
  const r = run(inferRate, { preferences: p, inferPreference, ruleId: "audio-first" });
  eq(r.preferences.overruled, [{ preference: "readFontSize", wouldHaveBeen: 22, by: "audio-first" }],
     "what the rule would have chosen is kept");
});

ok("hasPreference and stated answer different questions", () => {
  const p = statePreferences(model, { entity: { id: "u" }, values: { channelOrder: ["audio"] } });
  const r = run(inferRate, { preferences: p, inferPreference, ruleId: "audio-first" });
  /* A SELECTION RULE fires on hasPreference: nothing stated AND nothing
   * inferred, so something must decide. An INFERENCE tests stated, so it does
   * not tread on the person. Collapsing the two would make an inference
   * overwrite itself on every pass. */
  eq(hasPreference(r.preferences, "readFontSize"), true, "a value exists");
  eq(stated(r.preferences, "readFontSize"), false, "the person did not state it");
});

ok("an inferred value is validated exactly as a stated one", () => {
  const p = statePreferences(model, { entity: { id: "u" }, values: { channelOrder: ["audio"] } });
  refuses(() => run(
    A.prefer("readFontSize", A.lit(400)),
    { preferences: p, inferPreference, ruleId: "r" },
  ), "outside 4..96");
  refuses(() => run(
    A.prefer("nonesuch", A.lit(1)),
    { preferences: p, inferPreference, ruleId: "r" },
  ), "not declared in the preference model");
});

ok("inferring without a preference set is refused, not silently dropped", () => {
  refuses(() => run(A.prefer("readFontSize", A.lit(12)), { inferPreference }),
    "no preference set was supplied");
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
