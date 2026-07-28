/* Exemplar user profiles: populations of the Capacity Model.
 * ---------------------------------------------------------------------------
 * WHAT THESE ARE, AND WHAT THEY ARE NOT
 *
 * Stand-ins. They exist so the cradle has something to adapt to before there is
 * anyone real to adapt to, and they are to be replaced or augmented with lived
 * experience as and when it is available. Every profile records
 * `basis: "exemplar"` in its Entity so the distinction lives in the data and
 * not only in this comment — a fixture that has quietly become a finding is the
 * failure mode this guards against.
 *
 * Deliberately NOT personas. No name, age, occupation or narrative, because
 * those invite generalising from a character to a population. Capability values
 * and nothing else, which is the paper's own argument: "It is what the user can
 * do, not why she cannot."
 *
 * READING A PROFILE
 *
 * Every Setting is FULL, PARTIAL or NONE, and a measurement appears only
 * against PARTIAL. Two consequences are worth stating because both look like
 * omissions and neither is:
 *
 *   - Most properties are absent from most profiles. A property whose parent is
 *     FULL is not of interest — there is no impairment left to describe — and a
 *     property whose parent is NONE is not of interest either. Only PARTIAL
 *     opens the question. So the reference profile is seven lines.
 *
 *   - Absence beneath a NONE is not the same as zero. The blind exemplar has no
 *     contrastSensitivity setting; it does not have contrastSensitivity: 0%.
 *     Zero would assert that a measurement was taken of something that is not
 *     there.
 *
 * MODEL PROVENANCE (design/DEMOS.md §6a)
 *
 *   MODEL SPECIFIES. Profiles are differences from a reference, which is §8:
 *   "it is possible to say 'Fred is like Jim except...', and starting with
 *   Jim's profile… to create Fred's profile describing only the differences
 *   between the users." Each Instance "adds, modifies, or deletes rows in the
 *   Tables".
 *
 *   PARTIAL IMPLEMENTATION, marked. `variation()` implements the
 *   add/modify/delete transaction over setting tables. It does NOT implement
 *   the rest of the Adaptation Model (Figure 5): Event Triggers, Instance
 *   Sequences and Sequence No are absent, so profiles cannot yet be composed in
 *   a declared order under a trigger. That is versioning machinery and is not
 *   needed to populate exemplars. Issue #6 tracks the model itself.
 */

import { defineCapacity, A } from "../cradle/user/capacity.js";
import { userCapability } from "./user-capability.js";

/** "Fred is like Jim except…" — one Instance applied to a base specification.
 *
 *  Operates on the *spec*, before the model is built, because the paper's
 *  Instances act on tables of data and only the merged result is the profile. */
export function variation(base, { entity, add = {}, modify = {}, remove = [], groups, actions, influences } = {}) {
  const settings = { ...base.settings };

  for (const [id, s] of Object.entries(add)) {
    if (settings[id]) throw new Error(`variation adds "${id}", which the base already has — use modify`);
    settings[id] = s;
  }
  for (const [id, s] of Object.entries(modify)) {
    if (!settings[id]) throw new Error(`variation modifies "${id}", which the base does not have — use add`);
    /* A modify replaces the row rather than merging it, so a capability can
     * drop to NONE without a stale measurement surviving underneath. */
    settings[id] = s;
  }
  for (const id of remove) {
    if (!settings[id]) throw new Error(`variation removes "${id}", which the base does not have`);
    delete settings[id];
  }

  const prunedGroups = {};
  for (const [gid, g] of Object.entries(groups ?? base.groups ?? {})) {
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

const EXEMPLAR = "exemplar — stands in for lived experience, not derived from any person";

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
 * present so the others can be differences from something. Naming it
 * `reference` rather than `default` is deliberate: a default is what you get if
 * you do not choose, which is the wrong idea here.
 *
 * Seven settings, and that is the model working. Every root property is FULL,
 * so nothing beneath any of them is of interest.
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
    sight: { capability: "FULL" },
    hearing: { capability: "FULL" },
    touch: { capability: "FULL" },
    language: { capability: "FULL" },
    pointerControl: { capability: "FULL" },
    keyControl: { capability: "FULL" },
    manualStability: { capability: "FULL" },
  },
  groups: {
    seeing: {
      description: "At a desk, mounted display.",
      template: "vision",
      settings: ["sight"],
      influencedBy: ["deviceStability"],
    },
    listening: {
      description: "Audio-first play, the demonstrator's primary context.",
      template: "listening",
      settings: ["hearing"],
      influencedBy: ["ambientNoise"],
    },
    input: {
      description: "How the user drives the game.",
      template: "input",
      settings: ["pointerControl", "keyControl", "manualStability"],
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
 * One changed line. `sight: NONE` settles every visual property beneath it, and
 * the model enforces that: a setting under a NONE parent may only be NONE.
 * Nothing is zeroed, because zero would be a measurement.
 *
 * "Since birth" changes nothing here, and that is the correct outcome —
 * capability is what the user can do, and the model has no place for aetiology
 * by design. Where it *would* matter is Semantics and Composition, since a
 * listener with no visual memory is a different audience for a spatial metaphor
 * than one who lost sight later. That belongs in the metaphor work.
 *
 * Braille is added even though `language` is FULL and `touch` is FULL, so
 * hapticLanguageSet is not "of interest" by default. That is allowed: FULL
 * parents make a child uninteresting, not forbidden. Knowing which tactile
 * language a reader has is real information, and a model that refused to record
 * it would be enforcing an acquisition heuristic as if it were a law.
 */
export const blindSinceBirth = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "blind-since-birth",
      description: "No usable sight from birth. No other reported limitation.",
      basis: EXEMPLAR,
    },
    modify: { sight: { capability: "NONE" } },
    add: {
      readFontText: { capability: "NONE" },
      hapticLanguageSet: { capability: "PARTIAL", measurement: ["Braille"] },
    },
  }),
);

/**
 * Low vision, contrast.
 *
 * Sight is PARTIAL, which is what opens the visual properties to being asked
 * about at all. The limiting factor is how far two tones must differ before
 * they can be told apart; colour discrimination is intact and is left FULL,
 * which is what distinguishes this exemplar from the next.
 */
export const lowVisionContrast = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "low-vision-contrast",
      description: "Partial sight limited by contrast discrimination. Colour perception intact.",
      basis: EXEMPLAR,
    },
    modify: { sight: { capability: "PARTIAL" } },
    add: {
      focus: { capability: "PARTIAL" },
      focusDuration: { capability: "PARTIAL", measurement: 25 },
      tracking: { capability: "PARTIAL" },
      trackingDuration: { capability: "PARTIAL", measurement: 12 },
      contrastSensitivity: { capability: "PARTIAL", measurement: 30 },
      intensityLow: { capability: "PARTIAL", measurement: 45 },
      intensityMedium: { capability: "PARTIAL", measurement: 45 },
      intensityHigh: { capability: "PARTIAL", measurement: 45 },
      colorLow: { capability: "FULL" },
      colorMedium: { capability: "FULL" },
      colorHigh: { capability: "FULL" },
      readFontText: { capability: "PARTIAL" },
      minReadFontSizeForFont: {
        capability: "PARTIAL",
        measurement: { size: 18, font: "system-sans" },
      },
    },
  }),
);

/**
 * Low vision, colour. Table 2's own subject.
 *
 * Deuteranomaly-shaped: medium frequency discrimination is the impaired one,
 * which is the form the paper's own author reports — "in my case, this results
 * in mild colour blindness that shifts the neutral point within the high,
 * medium, or low frequency ranges… without the dimming that can occur with, for
 * example protanopia". Contrast is intact, the mirror of the profile above,
 * which is why both exist.
 */
export const lowVisionColour = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "low-vision-colour",
      description:
        "Colour discrimination reduced in the green-yellow-red region; contrast intact. " +
        "Modelled as capability per Table 2, not as a diagnosis per Table 1.",
      basis: EXEMPLAR,
    },
    modify: { sight: { capability: "PARTIAL" } },
    add: {
      colorLow: { capability: "PARTIAL", measurement: 40 },
      colorMedium: { capability: "PARTIAL", measurement: 25 },
      colorHigh: { capability: "PARTIAL", measurement: 80 },
      intensityMedium: { capability: "PARTIAL", measurement: 70 },
      contrastSensitivity: { capability: "FULL" },
    },
  }),
);

/**
 * Keyboard only.
 *
 * `pointerControl: NONE` — a capability — rather than a preference for the
 * keyboard. That is the paper's central argument in §4: "Does the user need a
 * screen reader, or does she simply wish to use one?" A profile recording
 * "prefers keyboard" tells an adaptive system nothing about what happens when
 * only a pointer is offered.
 *
 * Note that minTargetSize is not merely omitted but forbidden: its parent is
 * NONE, and the model rejects a capability beneath one that does not exist.
 */
export const keyboardOnly = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "keyboard-only",
      description: "No usable continuous pointing device. Discrete key control intact.",
      basis: EXEMPLAR,
    },
    modify: { pointerControl: { capability: "NONE" } },
    add: {
      writeFontSet: { capability: "PARTIAL", measurement: ["SELECT"] },
    },
  }),
);

/**
 * Hand tremor — the one exemplar that exercises the adaptive machinery.
 *
 * The paper's own example of functional dependency: "the physical stability of
 * the screen also plays a part, so that a person with hand tremors may find
 * that the readable size of text depends on whether the screen is placed on a
 * Table, or is held in their hand".
 *
 * So minReadFontSizeForFont is not a value. It is a derived, (M)-marked
 * measurement computed from a seated baseline, the user's manual stability, and
 * the External Influence `deviceStability`. The capability itself stays
 * declared as PARTIAL: whether this reader can read at all is not a function of
 * how large the type is, and only the measurement is derived.
 *
 * This is the whole difference between a static profile and an adaptive one —
 * "only the on-line model is suitable for adaptive systems" — and Access for
 * All would need two entire contexts to say the same thing, which is the
 * duplication §3 attacks.
 *
 * Sight and language are FULL. minReadFontSizeForFont is still of interest
 * because manualStability is PARTIAL, and that property has both readFontText
 * and manualStability as precedence parents — which is why the second parent
 * was added to the schema.
 */
export const handTremor = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "hand-tremor",
      description:
        "Tremor under load. Sight and hearing unimpaired; the limitation is stability, " +
        "and it reaches into reading whenever the display is not mounted.",
      basis: EXEMPLAR,
    },
    modify: {
      manualStability: { capability: "PARTIAL", measurement: 35 },
      pointerControl: { capability: "PARTIAL" },
      keyControl: { capability: "PARTIAL" },
    },
    add: {
      sustainedPress: { capability: "PARTIAL" },
      minKeyRepeatDelay: { capability: "PARTIAL", measurement: 900 },
      minTargetSize: { capability: "PARTIAL", measurement: 18 },

      /* A second Setting for the same Property, holding the mounted baseline.
       * This is how the model carries per-context values without duplicating
       * contexts: "the same settings may appear in more than one group… the
       * individual Setting is referenced in every case". */
      fontSizeSeated: {
        property: "minReadFontSizeForFont",
        capability: "PARTIAL",
        measurement: { size: 12, font: "system-sans" },
      },

      minReadFontSizeForFont: {
        capability: "PARTIAL",
        derived: {
          reads: ["fontSizeSeated", "manualStability"],
          influences: ["deviceStability"],
          /* OOA96 §2.3 requires the dependent variable's description to "cite
           * the formula or algorithm used to determine the value". */
          cite:
            "MOUNTED: fontSizeSeated.size. HANDHELD: fontSizeSeated.size scaled by " +
            "(1 + (100 - manualStability)/100), clamped to 4..96pt and rounded to 1dp. " +
            "At 35% stability a hand-held display needs 1.65x the mounted size.",
          formula: A.tuple({
            size: A.ifThen(
              A.eq(A.influence("deviceStability"), A.lit("HANDHELD")),
              A.round(
                A.clamp(
                  A.mul(
                    A.field(A.measure("fontSizeSeated"), "size"),
                    A.add(
                      A.lit(1),
                      A.div(A.sub(A.lit(100), A.measure("manualStability")), A.lit(100)),
                    ),
                  ),
                  A.lit(4),
                  A.lit(96),
                ),
                1,
              ),
              A.field(A.measure("fontSizeSeated"), "size"),
            ),
            font: A.field(A.measure("fontSizeSeated"), "font"),
          }),
        },
      },
    },
  }),
);

/* ---------------------------------------------------------------------------
 * Stress-test exemplars
 *
 * The first five were built to populate the model. These three were built to
 * BREAK it, and each found something. What they found is recorded against each
 * profile rather than smoothed over, because a stress test whose findings get
 * quietly fixed and forgotten has told you nothing.
 * ------------------------------------------------------------------------- */

/**
 * Fully Deaf.
 *
 * The hardest case for this demonstrator specifically, because the thing being
 * demonstrated is an audio-first game. `hearing: NONE` settles the entire sonic
 * ontology, and the model enforces it: nothing beneath a NONE parent may exist.
 *
 * WHAT THIS FOUND. Sign language was missing. Table 4 gives `readSignText` the
 * parent "sight + signLanguageSet" but never defines `signLanguageSet`, so the
 * row could not be transcribed and the first pass skipped it. A Deaf profile
 * with no signed language is not a Deaf profile, so the property was added —
 * and `readSignText` then went in exactly as Table 4 writes it. The model
 * reached for this and stopped short; the exemplar is what made the gap visible.
 *
 * Note also what is NOT recorded here: `hapticLanguageSet`. Deaf is not
 * DeafBlind, and Braille is nothing to do with it. The temptation to reach for
 * "the other accessibility thing" is exactly what capability modelling exists to
 * prevent.
 */
export const deaf = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "deaf",
      description:
        "No usable hearing. Signs fluently. No other reported limitation. The hardest " +
        "case for an audio-first demonstrator, which is why it is here.",
      basis: EXEMPLAR,
    },
    modify: { hearing: { capability: "NONE" } },
    add: {
      readAudioText: { capability: "NONE" },
      signLanguageSet: { capability: "PARTIAL", measurement: ["ASL"] },
      readSignText: { capability: "FULL" },
    },
  }),
);

/**
 * Deafened in later life, asymmetric loss.
 *
 * Acquired, not congenital — and the distinction is not decorative. A deafened
 * adult has spoken language, expects speech, and is not a signer; a Deaf signer
 * has a first language that is not English. Both may have `hearing: NONE`, and a
 * system that treats them identically will be wrong about one of them. Here the
 * loss is partial and asymmetric: worse in one ear, and worst in the lower
 * register.
 *
 * WHAT THIS FOUND. The model has no laterality anywhere — no per-ear or per-eye
 * property — and at first that looked fatal for this profile.
 *
 * It is not, and working out why was the most useful thing in this exercise.
 * WHICH ear is damaged is mechanism, and mechanism is what Table 1 does and
 * Table 2 rejects: "It is what the user can do, not why she cannot." The
 * functional consequence is what a renderer needs, and it is expressible —
 * `binauralHearing: PARTIAL` says the two ears no longer combine reliably, and
 * `azimuthResolution` collapses because left-right localisation is built from
 * interaural differences.
 *
 * `elevationResolution` deliberately does NOT collapse with it: elevation cues
 * are monaural, filtered by the pinna, so one axis of spatial hearing survives
 * and the other does not. Modelling both as lost would have been easier and
 * wrong.
 *
 * The genuine limit, recorded rather than hidden: the model cannot say "put the
 * important channel on his good side". That needs laterality, and laterality is
 * not here.
 */
export const deafenedAsymmetric = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "deafened-asymmetric",
      description:
        "Acquired hearing loss in later life after years in a noisy workplace. Worse " +
        "in one ear, and worst in the lower register. Speaks and expects speech; does " +
        "not sign.",
      basis: EXEMPLAR,
    },
    modify: { hearing: { capability: "PARTIAL" } },
    add: {
      /* The two ears no longer combine usefully, but neither is dead. */
      binauralHearing: { capability: "PARTIAL" },
      /* The BINAURAL usable range — what he hears with both ears working
       * together, which is the better ear's range where they differ. The gap is
       * the low end: everything below ~400 Hz is unreliable. */
      usableFrequencyRange: {
        capability: "PARTIAL",
        measurement: [{ from: 400, to: 6000 }],
      },
      /* Localisation is the first casualty of asymmetric loss, well before
       * intelligibility. 75 degrees is barely better than "somewhere to the
       * left", and it makes a spatialised soundscape close to unusable. */
      azimuthResolution: { capability: "PARTIAL", measurement: 75 },
      /* Monaural cue, so it survives. This asymmetry is the whole point. */
      elevationResolution: { capability: "PARTIAL", measurement: 40 },
      /* Effortful listening: separating streams costs him attention that a
       * binaural listener spends nothing on. */
      concurrentStreams: { capability: "PARTIAL", measurement: 1 },
      listeningDuration: { capability: "PARTIAL", measurement: 20 },
      readAudioText: { capability: "PARTIAL" },
      minInterWordGap: { capability: "PARTIAL", measurement: 220 },
    },
  }),
);

/**
 * Multiple Sclerosis.
 *
 * The paper's own subject. Table 3's example set "is based upon the real-life
 * experiences of a person with Multiple Sclerosis", and §8 names MS explicitly
 * as the case that defeats stereotype templates: "users with spiky profiles,
 * such as users with Multiple Sclerosis who experience varied and multiple
 * impairments". So this is less a stress test of the model than the model's own
 * motivating example, finally populated.
 *
 * Double vision is the paper's own gloss on `focus: PARTIAL` — "PARTIAL would
 * suggest blurred/double vision" — and it takes `stereo` to NONE, because
 * diplopia is precisely the failure to fuse two images into one.
 *
 * WHAT THIS FOUND. Kinaesthesia was missing. The haptic ontology modelled only
 * the tactile half, so a user with absent touch but partial proprioception —
 * or the reverse — was inexpressible. Both dissociate in MS, and the second
 * matters far more for input than the first: not feeling the key is survivable,
 * not knowing where your hand is without looking is not.
 *
 * WHAT THIS ALSO SHOWED, and it justifies an earlier correction. Fatigue here is
 * central, not sensory: hearing is FULL and `listeningDuration` is still
 * PARTIAL at 15 minutes. Under the ceiling rule I first wrote — child may not
 * exceed its parent — that combination would have been rejected as incoherent.
 * It is not incoherent, it is MS. FULL parents make a child uninteresting by
 * default, never forbidden, and this profile is why.
 */
export const multipleSclerosis = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "multiple-sclerosis",
      description:
        "Double vision, absent touch, tremor, poor proprioception, and fatigue that " +
        "cuts across all of it. A spiky profile: the paper's own example of what " +
        "stereotype templates handle worst.",
      basis: EXEMPLAR,
    },
    modify: {
      sight: { capability: "PARTIAL" },
      touch: { capability: "NONE" },
      manualStability: { capability: "PARTIAL", measurement: 30 },
      pointerControl: { capability: "PARTIAL" },
      keyControl: { capability: "PARTIAL" },
    },
    add: {
      /* Diplopia: two images, not fused. */
      focus: { capability: "PARTIAL" },
      stereo: { capability: "NONE" },
      /* Fatigue, the defining symptom, expressed everywhere it bites. */
      focusDuration: { capability: "PARTIAL", measurement: 8 },
      tracking: { capability: "PARTIAL" },
      trackingDuration: { capability: "PARTIAL", measurement: 4 },
      /* Hearing is FULL and this is still PARTIAL. See the note above: MS
       * fatigue is not a sensory limit, and the model must allow saying so. */
      listeningDuration: { capability: "PARTIAL", measurement: 15 },
      /* The property this profile forced into existence. */
      kinaesthesia: { capability: "PARTIAL", measurement: 25 },
      sustainedPress: { capability: "PARTIAL" },
      minKeyRepeatDelay: { capability: "PARTIAL", measurement: 1200 },
      minTargetSize: { capability: "PARTIAL", measurement: 28 },
      readFontText: { capability: "PARTIAL" },
      minReadFontSizeForFont: {
        capability: "PARTIAL",
        measurement: { size: 20, font: "system-sans" },
      },
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
  deaf,
  deafenedAsymmetric,
  multipleSclerosis,
});
