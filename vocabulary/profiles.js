/* Exemplar user profiles: populations of the Capacity Model.
 * ---------------------------------------------------------------------------
 * WHAT THESE ARE, AND WHAT THEY ARE NOT
 *
 * These are stand-ins. They exist so the cradle has something to adapt to
 * before there is anyone real to adapt to, and they are to be replaced or
 * augmented with lived experience as and when it is available. Every profile
 * records `basis: "exemplar"` in its Entity so that the distinction lives in
 * the data and not only in this comment — a fixture that has quietly become a
 * finding is the failure mode this guards against.
 *
 * They are deliberately NOT personas. There is no name, no age, no occupation
 * and no narrative, because those invite the reader to generalise from a
 * character to a population. What is here is capability values and nothing
 * else, which is the whole argument of the source paper: "It is what the user
 * can do, not why she cannot."
 *
 * MODEL PROVENANCE (design/DEMOS.md §6a)
 *
 *   MODEL SPECIFIES. Profiles are expressed as differences from a reference,
 *   which is the paper's §8 mechanism: "it is possible to say 'Fred is like Jim
 *   except...', and starting with Jim's profile (which is an Instance of each
 *   of the Capability, Capacity, and Preference models) to create Fred's
 *   profile describing only the differences between the users." Each Instance
 *   "adds, modifies, or deletes rows in the Tables".
 *
 *   PARTIAL IMPLEMENTATION, and marked. `variation()` below implements the
 *   add/modify/delete transaction over setting tables. It does NOT implement
 *   the rest of the Adaptation Model (Figure 5): Event Triggers, Instance
 *   Sequences and Sequence No are not here, so profiles cannot yet be composed
 *   in a declared order under a trigger. That is the versioning machinery, and
 *   it is not needed to populate exemplars. Issue #6 tracks the model itself.
 *
 *   The paper's own note on why this matters beyond convenience: "This
 *   mechanism supports standard templates for blind, deaf, or indeed any other
 *   recognizable stereotype, that can then be modified accordingly… it also
 *   leads to effective support for users with spiky profiles, such as users
 *   with Multiple Sclerosis who experience varied and multiple impairments."
 *   The stereotype is the starting point, not the answer.
 */

import { defineCapacity, A } from "../cradle/user/capacity.js";
import { userCapability } from "./user-capability.js";

/**
 * "Fred is like Jim except…" — one Instance applied to a base specification.
 *
 * Operates on the *spec*, before the model is built, because the paper's
 * Instances act on tables of data and only the merged result is the profile.
 * Building the base and then mutating it would be a different thing.
 */
export function variation(base, { entity, add = {}, modify = {}, remove = [], groups, actions, influences } = {}) {
  const settings = { ...base.settings };

  for (const [id, s] of Object.entries(add)) {
    if (settings[id]) {
      throw new Error(`variation adds "${id}", which the base already has — use modify`);
    }
    settings[id] = s;
  }
  for (const [id, s] of Object.entries(modify)) {
    if (!settings[id]) {
      throw new Error(`variation modifies "${id}", which the base does not have — use add`);
    }
    /* A modify replaces the row. Merging would make "value" and "derived"
     * silently coexist, which defineCapacity rejects for good reason. */
    settings[id] = s;
  }
  for (const id of remove) {
    if (!settings[id]) {
      throw new Error(`variation removes "${id}", which the base does not have`);
    }
    delete settings[id];
  }

  const nextGroups = groups ?? base.groups;
  /* A group may not survive its settings. Removing `sight` from a profile
   * should not leave a vision group pointing at nothing. */
  const prunedGroups = {};
  for (const [gid, g] of Object.entries(nextGroups ?? {})) {
    const kept = g.settings.filter((sid) => settings[sid]);
    if (kept.length) prunedGroups[gid] = { ...g, settings: kept };
  }

  return {
    entity: { ...base.entity, ...entity },
    settings,
    groups: prunedGroups,
    actions: actions ?? base.actions ?? {},
    influences: influences ?? base.influences ?? {},
  };
}

/* ---------------------------------------------------------------------------
 * External influences shared by the exemplars
 * ------------------------------------------------------------------------- */

const influences = {
  deviceStability: {
    description:
      "Whether the display is mounted or hand-held. The paper's own worked example of a " +
      "functional dependency: 'the physical stability of the screen also plays a part, so " +
      "that a person with hand tremors may find that the readable size of text depends on " +
      "whether the screen is placed on a Table, or is held in their hand'.",
    values: ["MOUNTED", "HANDHELD"],
    default: "MOUNTED",
  },
  ambientNoise: {
    description:
      "Quiet room, or a bus. Usable azimuth resolution in a quiet room is not usable " +
      "azimuth resolution in traffic, and this demonstrator is audio-first.",
    values: ["QUIET", "NOISY"],
    default: "QUIET",
  },
};

/* ---------------------------------------------------------------------------
 * The reference profile
 *
 * Not "normal" and not "default" — a baseline with no reported limitation,
 * present so the others can be expressed as differences from something. Naming
 * it `reference` rather than `default` is deliberate: a default is what you get
 * if you do not choose, which is exactly the wrong idea here.
 * ------------------------------------------------------------------------- */

export const referenceSpec = {
  entity: {
    id: "reference",
    kind: "user",
    description: "Baseline with no reported limitation. Exists to be differenced against.",
    basis: "exemplar — not derived from any person",
  },
  influences,
  settings: {
    /* visual */
    sight: { value: "FULL" },
    stereo: { value: "FULL" },
    focus: { value: "FULL" },
    focusDuration: { value: 60 },
    tracking: { value: "FULL" },
    trackingDuration: { value: 45 },
    viewRectangle: { value: [{ from: 0, to: 1024 }, { from: 0, to: 768 }] },
    colorLow: { value: 100 },
    colorMedium: { value: 100 },
    colorHigh: { value: 100 },
    intensityLow: { value: 100 },
    intensityMedium: { value: 100 },
    intensityHigh: { value: 100 },
    contrastSensitivity: { value: 100 },

    /* sonic */
    hearing: { value: "FULL" },
    usableFrequencyRange: { value: [{ from: 20, to: 20000 }] },
    azimuthResolution: { value: 5 },
    elevationResolution: { value: 15 },
    concurrentStreams: { value: 3 },
    listeningDuration: { value: 40 },

    /* haptic */
    touch: { value: "FULL" },
    vibrationDetection: { value: 100 },

    /* motor */
    pointerControl: { value: "FULL" },
    keyControl: { value: "FULL" },
    manualStability: { value: 100 },
    minTargetSize: { value: 5 },
    sustainedPress: { value: "FULL" },
    minKeyRepeatDelay: { value: 300 },

    /* language. hapticLanguageSet is deliberately absent: the model says
     * "there is no requirement for there to be a Setting for every Property in
     * the CapabilityTemplate", and Braille is not relevant to this profile. */
    language: { value: "FULL" },
    readFontText: { value: "FULL" },
    readAudioText: { value: "FULL" },
    minReadFontSizeForFont: { value: 11 },
    minInterWordGap: { value: 80 },
    writeFontSet: { value: "BLOCK" },
  },
  groups: {
    seated: {
      description: "At a desk, quiet, mounted display.",
      template: "vision",
      settings: ["sight", "focus", "tracking", "minReadFontSizeForFont", "contrastSensitivity"],
      influencedBy: ["deviceStability"],
    },
    listening: {
      description: "Audio-first play, the demonstrator's primary context.",
      template: "listening",
      settings: [
        "hearing", "usableFrequencyRange", "azimuthResolution",
        "concurrentStreams", "listeningDuration",
      ],
      influencedBy: ["ambientNoise"],
    },
    input: {
      description: "How the user drives the game.",
      template: "input",
      settings: ["pointerControl", "keyControl", "manualStability", "sustainedPress", "minKeyRepeatDelay"],
    },
  },
};

export const reference = defineCapacity(userCapability, referenceSpec);

/* ---------------------------------------------------------------------------
 * The exemplars
 * ------------------------------------------------------------------------- */

/**
 * Blind since birth, no other reported limitation.
 *
 * The interesting part is what is ABSENT. `sight: NONE` makes every property
 * beneath it in the precedence tree moot — "it makes no sense to acquire a
 * setting for 'minReadFontSizeForFont' if the user has no sight" — so those
 * Settings are deleted rather than set to some notional zero. A profile that
 * carried contrastSensitivity: 0 would be asserting something false: not that
 * contrast is irrelevant, but that it was measured and found absent.
 *
 * "Since birth" is recorded in the description only. It changes nothing in the
 * capability model, and that is the correct outcome — capability is what the
 * user can do, and the model has no place to store an aetiology. Where it
 * *would* matter is in the Semantics and Composition layers, since a listener
 * with no visual memory is a different audience for a spatial metaphor than
 * one who lost sight later. That belongs in the metaphor work, not here.
 */
export const blindSinceBirth = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "blind-since-birth",
      description: "No usable sight from birth. No other reported limitation.",
      basis: "exemplar — stands in for lived experience, not derived from any person",
    },
    modify: {
      sight: { value: "NONE" },
      /* Listening carries the whole game, so these are not left at reference
       * values by omission — an experienced screen-reader listener typically
       * separates more concurrent streams and tolerates faster speech than the
       * reference. MY CHOICE, and a testable claim rather than a courtesy. */
      concurrentStreams: { value: 4 },
      minInterWordGap: { value: 40 },
      readFontText: { value: "NONE" },
    },
    add: {
      /* Absent from the reference, so this is an add rather than a modify.
       * The reference has no Setting for hapticLanguageSet at all, which is
       * the model working as intended: "there is no requirement for there to
       * be a Setting for every Property in the CapabilityTemplate". */
      hapticLanguageSet: { value: "Braille" },
    },
    remove: [
      "stereo", "focus", "focusDuration", "tracking", "trackingDuration",
      "viewRectangle",
      "colorLow", "colorMedium", "colorHigh",
      "intensityLow", "intensityMedium", "intensityHigh",
      "contrastSensitivity",
      "minReadFontSizeForFont",
    ],
  }),
);

/** Low vision, contrast. Sight is partial; the limiting factor is how much two
 *  tones must differ before they can be told apart. Colour discrimination is
 *  intact, which is what distinguishes this exemplar from the next. */
export const lowVisionContrast = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "low-vision-contrast",
      description:
        "Partial sight limited by contrast discrimination. Colour perception intact.",
      basis: "exemplar — stands in for lived experience, not derived from any person",
    },
    modify: {
      sight: { value: "PARTIAL" },
      focus: { value: "PARTIAL" },
      focusDuration: { value: 25 },
      tracking: { value: "PARTIAL" },
      trackingDuration: { value: 12 },
      contrastSensitivity: { value: 30 },
      intensityLow: { value: 45 },
      intensityMedium: { value: 45 },
      intensityHigh: { value: 45 },
      minReadFontSizeForFont: { value: 18 },
    },
  }),
);

/** Low vision, colour. Table 2's own subject. Deuteranomaly-shaped: medium
 *  frequency discrimination is the impaired one, and the paper's author reports
 *  exactly this form. Contrast is intact, which is the mirror of the profile
 *  above and the reason both exist. */
export const lowVisionColour = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "low-vision-colour",
      description:
        "Colour discrimination reduced in the green-yellow-red region; contrast intact. " +
        "Modelled as capability per Table 2, not as a diagnosis per Table 1.",
      basis: "exemplar — stands in for lived experience, not derived from any person",
    },
    modify: {
      sight: { value: "PARTIAL" },
      colorLow: { value: 40 },
      colorMedium: { value: 25 },
      colorHigh: { value: 80 },
      intensityMedium: { value: 70 },
    },
  }),
);

/**
 * Keyboard only.
 *
 * Expressed as `pointerControl: NONE` — a capability — rather than as a
 * preference for the keyboard. That is the paper's central argument in §4:
 * "Does the user need a screen reader, or does she simply wish to use one?"
 * A profile recording "prefers keyboard" tells an adaptive system nothing
 * about what happens when only a pointer is offered.
 */
export const keyboardOnly = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "keyboard-only",
      description: "No usable continuous pointing device. Discrete key control intact.",
      basis: "exemplar — stands in for lived experience, not derived from any person",
    },
    modify: {
      pointerControl: { value: "NONE" },
      writeFontSet: { value: "SELECT" },
    },
    remove: ["minTargetSize"],
  }),
);

/**
 * Hand tremor — and the one exemplar that exercises the adaptive machinery.
 *
 * The paper's own example of functional dependency: "the physical stability of
 * the screen also plays a part, so that a person with hand tremors may find
 * that the readable size of text depends on whether the screen is placed on a
 * Table, or is held in their hand".
 *
 * So minReadFontSizeForFont is not a value here. It is a derived, (M)-marked
 * Setting computed from a base size, the user's manual stability, and the
 * External Influence `deviceStability`. This is the whole difference between a
 * static profile and an adaptive one — "only the on-line model is suitable for
 * adaptive systems" — and it is worth noting that Access for All would need
 * two whole contexts to say the same thing, which is the duplication §3
 * criticises.
 *
 * The dependency is mathematical, not merely functional: given the base size
 * and the stability, the effective size follows from a formula, with no need
 * to observe the user. OOA96 §2.3, and the reason it is a formula and not an
 * Action.
 */
export const handTremor = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "hand-tremor",
      description:
        "Tremor under load. Sight and hearing unimpaired; the limitation is stability, " +
        "and it reaches into reading whenever the display is not mounted.",
      basis: "exemplar — stands in for lived experience, not derived from any person",
    },
    modify: {
      manualStability: { value: 35 },
      pointerControl: { value: "PARTIAL" },
      keyControl: { value: "PARTIAL" },
      sustainedPress: { value: "PARTIAL" },
      minKeyRepeatDelay: { value: 900 },
      minTargetSize: { value: 18 },

      /* The (M) attribute. `cite` is not decoration: OOA96 §2.3 requires that
       * "in the description of an attribute that represents a dependent
       * variable, cite the formula or algorithm used to determine the value". */
      minReadFontSizeForFont: {
        derived: {
          reads: ["fontSizeSeated", "manualStability"],
          influences: ["deviceStability"],
          cite:
            "MOUNTED: fontSizeSeated. HANDHELD: fontSizeSeated scaled by " +
            "(1 + (100 - manualStability)/100), clamped to the property range. " +
            "At 35% stability a hand-held display needs roughly 1.65x the mounted size.",
          formula: A.ifThen(
            A.eq(A.influence("deviceStability"), A.lit("HANDHELD")),
            A.clamp(
              A.mul(
                A.read("fontSizeSeated"),
                A.add(
                  A.lit(1),
                  A.div(A.sub(A.lit(100), A.read("manualStability")), A.lit(100)),
                ),
              ),
              A.lit(4),
              A.lit(96),
            ),
            A.read("fontSizeSeated"),
          ),
        },
      },
    },
    add: {
      /* A second Setting for the same Property. This is how the model carries
       * per-context values without duplicating contexts: "the same settings may
       * appear in more than one group… the individual Setting is referenced in
       * every case". */
      fontSizeSeated: { property: "minReadFontSizeForFont", value: 12 },
    },
  }),
);

/** Every exemplar, for iteration in tests and demos. */
export const exemplars = Object.freeze({
  reference,
  blindSinceBirth,
  lowVisionContrast,
  lowVisionColour,
  keyboardOnly,
  handTremor,
});
