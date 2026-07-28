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
 * RECORD WHAT THEY CAN DO
 *
 * Bob's rule, and it governs the prose here as much as the data: **we record
 * what a person can hear, not what they cannot. This is capability, not
 * disability.**
 *
 * The measurements were always positive — `usableFrequencyRange` is the range
 * that works, `binauralHearing` the band where the ears do combine,
 * `concurrentStreams` how many a listener can follow. The descriptions were
 * not: an earlier draft of these profiles was written in the language of loss —
 * "lost the lower register", "worse in one ear", "no usable sight" — which is
 * Table 1 vocabulary wearing Table 2 clothes. A model can be structurally
 * correct and still tell the reader to think in deficits, and the reader
 * remembers the prose.
 *
 * So each profile below leads with what the person does. Where a capability is
 * genuinely absent the model says NONE and that is a fact, not a verdict; it is
 * never elaborated into a description of what they are missing.
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
  ambientTemperature: {
    description:
      "Cold or warm surroundings. Vibration white finger is defined by its response to " +
      "cold — the fingers blanch, numbness deepens and dexterity drops — so for anyone " +
      "with it this is not a comfort setting but a capability trigger. A cold bus " +
      "shelter and a warm room are different devices in the same hands.",
    values: ["COLD", "WARM"],
    default: "WARM",
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
    description:
      "Full capability across every ontology. Exists to be differenced against, and " +
      "named `reference` rather than `default` on purpose: a default is what you get " +
      "if you do not choose.",
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
      description:
        "Reads Braille, listens closely, and follows more concurrent audio than most. " +
        "Full hearing, touch, language and motor control. No usable sight from birth.",
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
      description:
        "Sees colour fully and reads at 18pt. Distinguishes tones that differ strongly; " +
        "focuses and tracks for short periods.",
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
      description:
        "Full discrete key control, and writes by selection — keyboard, scanning or eye " +
        "tracking. Does not use a continuous pointing device.",
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
        "Full sight, hearing and language. Holds a hand steady to about a third of " +
        "typical, which sets his target size, key delay, and — whenever the display " +
        "is hand-held rather than mounted — the size of type he can read.",
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
        "Signs fluently in ASL, reads print and sign, and has full sight, touch and " +
        "motor control. No usable hearing — the hardest case for an audio-first " +
        "demonstrator, which is why it is here.",
      basis: EXEMPLAR,
    },
    modify: { hearing: { capability: "NONE" } },
    add: {
      readAudioText: { capability: "NONE" },
      signLanguageSet: { capability: "PARTIAL", measurement: ["ASL"] },
      readSignText: { capability: "FULL" },
      /* Receives AND delivers, which is the ordinary case and worth recording
       * explicitly so that the DeafBlind profile's difference is visible. */
      writeSignSet: { capability: "PARTIAL", measurement: ["Visual"] },

      /* English, held asymmetrically — which is the whole reason knownLanguages
       * rates four skills separately. Full literacy, no listening at all, and
       * speech that exists but is not the primary channel.
       *
       * A necessary caution: whether a Deaf person speaks is as much personal
       * and cultural as it is capability, and many fluent signers choose not to.
       * This profile speaks a little; another Deaf profile might have
       * `speech: NONE` and be no less complete. Nothing here should be read as
       * what a Deaf person is like. */
      knownLanguages: {
        capability: "PARTIAL",
        measurement: [
          { tag: "en-CA", listening: "none", speaking: "basic",
            reading: "fluent", writing: "fluent" },
        ],
      },
      speech: { capability: "PARTIAL" },
      speechIntelligibility: { capability: "PARTIAL", measurement: "familiar listeners" },
      /* The combination that matters, and the reason the two properties are
       * separate: people who know him understand him, and automatic speech
       * recognition does not work at all. A system that infers one from the
       * other will offer voice control and strand him. */
      speechRecognisedByMachine: { capability: "NONE" },
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
 * functional consequence is what a renderer needs, and it is expressible.
 *
 * WHAT HE HEARS IS FREQUENCY DEPENDENT, AND SO IS EVERYTHING THAT FOLLOWS. He
 * hears the full range with one ear and the upper register with both, so:
 *
 *   - He HEARS low frequencies, using the good ear. `usableFrequencyRange` is
 *     therefore wide. An earlier draft started it at 400 Hz, which asserted he
 *     cannot hear bass at all. He can; what he cannot do is place it.
 *   - The two ears combine ABOVE the crossover, which is why `binauralHearing`
 *     carries a frequency band rather than a percentage. PARTIAL here means
 *     "binaural from 800 Hz up", a statement a renderer can act on.
 *   - Localisation survives in a specific band. Low frequencies are placed by
 *     interaural TIME difference and high by interaural LEVEL difference, so
 *     ILD localisation keeps working above the crossover. Spatial hearing is
 *     coarse rather than absent, and coarse unevenly.
 *   - Speech is clearest from higher-pitched voices — recorded as
 *     `intelligibleVoicePitch`, from Bob's CNIB Library borrowing data. The
 *     mechanism is unsettled and the model does not need it.
 *
 * `elevationResolution` deliberately does NOT depend on binaural hearing at all:
 * elevation cues are monaural, filtered by the pinna, so that axis survives
 * whatever happens to the other. Modelling both as lost would have been easier
 * and wrong.
 *
 * Two genuine limits, recorded rather than hidden. The model cannot say "put the
 * important channel on his good side" — that needs laterality. And
 * `azimuthResolution` is a single number where his real acuity varies by
 * frequency, so it records the overall figure and `binauralHearing` records
 * where it applies.
 */
export const deafenedAsymmetric = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "deafened-asymmetric",
      description:
        "Hears across the full range with one ear and the upper register with both. " +
        "Follows two concurrent streams, places sound coarsely left and right, and " +
        "understands speech best from higher-pitched voices. Speaks and expects " +
        "speech; does not sign.",
      basis: EXEMPLAR,
    },
    modify: { hearing: { capability: "PARTIAL" } },
    add: {
      /* What he can HEAR, across both ears together. The low end is present —
       * the good ear supplies it — so this is close to full range, with a
       * modest high rolloff for age. What is lost is not audibility but the
       * SECOND opinion on the low end. */
      usableFrequencyRange: {
        capability: "PARTIAL",
        measurement: [{ from: 20, to: 8000 }],
      },
      /* Where the two ears still combine: above the crossover only. Below 800 Hz
       * he is effectively listening with one ear, which is why this is a band
       * and not a percentage. */
      binauralHearing: {
        capability: "PARTIAL",
        measurement: [{ from: 800, to: 8000 }],
      },
      /* Degraded but far from gone. Interaural level differences still work
       * above the crossover, so high-frequency content is placeable; interaural
       * time differences below it are not, so bass is heard but not located.
       * 45 degrees is the overall figure — usable for coarse left/centre/right,
       * useless for anything finer. */
      azimuthResolution: { capability: "PARTIAL", measurement: 45 },
      /* Monaural pinna cue, unaffected by any of the above. This asymmetry
       * between the two axes is the whole point of the exemplar. */
      elevationResolution: { capability: "PARTIAL", measurement: 40 },
      /* Effortful listening: separating streams costs him attention a fully
       * binaural listener spends nothing on, and the cost is worst where the
       * competing sounds are low-pitched. */
      concurrentStreams: { capability: "PARTIAL", measurement: 2 },
      listeningDuration: { capability: "PARTIAL", measurement: 20 },
      readAudioText: { capability: "PARTIAL" },
      minInterWordGap: { capability: "PARTIAL", measurement: 220 },
      /* Bob's CNIB Library observation, made expressible: older men consistently
       * chose female narrators. Recorded as the band of talker pitch that WORKS,
       * which is a capability a renderer can act on by picking a voice — not as
       * a statement about what he cannot hear, and deliberately silent on why. */
      intelligibleVoicePitch: {
        capability: "PARTIAL",
        measurement: { from: 165, to: 300 },
      },
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
        "Hears fully, reads at 20pt in short spells, and works with large targets and " +
        "long key delays. Sees with one eye at a time; locates a hand to within a " +
        "quarter of its usual accuracy. A spiky profile across four ontologies: the " +
        "paper's own example of what stereotype templates handle worst.",
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

/**
 * DeafBlind — Usher syndrome type 1, the shape it usually takes.
 *
 * Congenitally Deaf, so ASL is a first language learned in childhood as a
 * sighted signer; progressive retinitis pigmentosa then narrows and closes the
 * visual field in adult life. The language never changed. The channel did.
 *
 * WHAT THIS FOUND, and it was a bug of mine rather than a gap in the paper.
 * `signLanguageSet` had been given `sight` as a precedence parent, on the
 * reasoning that sign is received visually. Under `sight: NONE` the model then
 * refused to let this person know ASL at all — which is not merely a
 * technicality, it is the model contradicting the most important fact about
 * them.
 *
 * The paper's own structure had the answer already: `language` has no parents,
 * while `readFontText` needs sight, `readAudioText` needs hearing, and
 * `readSignText` needs sight. KNOWING a language and RECEIVING it are separate
 * properties. So `signLanguageSet` is knowledge and lost its sight parent, and
 * `readTactileSign` was added as the tactile counterpart of Table 4's
 * `readSignText`.
 *
 * WHY THIS IS THE HARDEST CASE FOR THE DEMONSTRATOR. Every other exemplar can
 * receive the game through some channel it already has: audio, or visuals, or
 * both. This person has neither. `touch` is the whole of it, and the model says
 * so plainly — which means an audio-first demonstrator has nothing to offer here
 * yet, and that is a finding rather than an embarrassment. It is precisely the
 * kind of thing §6a exists to keep visible instead of quietly designing around.
 *
 * A note on the population, because a single exemplar invites over-reading: most
 * DeafBlind people are not at this extreme. Residual hearing, residual vision,
 * or both, are far more common than neither, and the useful design question is
 * usually "which fragment remains" rather than "what if nothing does". This
 * profile sits at the end of that range on purpose, to see whether the model
 * degrades cleanly. It does.
 */
export const deafBlind = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "deafblind",
      description:
        "Signs ASL fluently and receives it hand-over-hand. Reads Braille and the " +
        "two-handed manual alphabet. Full touch, kinaesthesia and motor control. " +
        "Congenitally Deaf with progressive vision loss in adult life.",
      basis: EXEMPLAR,
    },
    modify: {
      sight: { capability: "NONE" },
      hearing: { capability: "NONE" },
    },
    add: {
      /* Knowledge, not channel. This is the setting that the earlier precedence
       * bug made impossible, and it is the centre of the profile. */
      signLanguageSet: { capability: "PARTIAL", measurement: ["ASL"] },
      /* The channel that works. */
      readTactileSign: { capability: "FULL" },
      /* The channels that do not — recorded explicitly because "cannot see
       * sign" is a different fact from "does not sign", and a system that
       * conflates them will offer an ASL video. */
      readSignText: { capability: "NONE" },
      readFontText: { capability: "NONE" },
      readAudioText: { capability: "NONE" },
      /* Text arrives by touch, in more than one script. */
      hapticLanguageSet: {
        capability: "PARTIAL",
        measurement: ["Braille", "DeafblindManual", "PrintOnPalm"],
      },
      /* Delivers sign in both modes: normally formed for a sighted receiver,
       * and hand-over-hand for another DeafBlind signer. Production is a
       * separate fact from reception and this profile has both. */
      writeSignSet: { capability: "PARTIAL", measurement: ["Visual", "Tactile"] },
      /* And can spell onto another person's hand — which needs steady hands and
       * enough touch to find theirs. Both intact here; see the note below for
       * the case where they are not. */
      writeTactileSet: {
        capability: "PARTIAL",
        measurement: ["Braille", "DeafblindManual", "PrintOnPalm"],
      },
      /* Touch is now the entire input and output surface, so its acuity stops
       * being a detail and becomes the design constraint. */
      vibrationDetection: { capability: "PARTIAL", measurement: 85 },
    },
  }),
);

/**
 * Deafened with a 4 kHz notch, and no tactile sense in the fingers.
 *
 * The textbook occupational pattern, and the one the earlier deafened exemplar
 * deliberately is not. Prolonged broadband machine noise produces a notch
 * centred near 4 kHz — hearing recovers above it — while the vibrating tools
 * that come with the same work produce vibration white finger, which takes
 * sensation from the fingertips and leaves the rest of the body untouched.
 * Bilateral, because both ears and both hands did the same job for the same
 * years.
 *
 * WHY THIS PROFILE EXISTS. Nine of the ten exemplars before it left the sonic
 * ontology almost untouched, and the one that did not used a single unbroken
 * band. That is a poor showing on a demonstrator whose entire premise is audio,
 * and it left the paper's own justification for Composite Property unexercised:
 *
 *     "the usable audio frequency range for a user, which may be described as a
 *      collection of numeric ranges measured in Hertz, WITH GAPS BETWEEN THE
 *      RANGES."
 *
 * A 4 kHz notch IS that gap. `usableFrequencyRange` here is two bands with
 * nothing usable between them, which a single minimum and maximum could not
 * express — and a gap is the case where "put the cue at 4 kHz" fails silently.
 * The listener does not mishear it. They never receive it.
 *
 * THE CONTRAST WITH deafened-asymmetric IS THE POINT. That listener has
 * different ears and localises poorly. This one has matched ears and localises
 * reasonably, but has a hole in the middle of the spectrum that both ears share.
 * Same top-level capability, opposite design consequences: one needs the stereo
 * image simplified, the other needs content moved out of a frequency band.
 *
 * WHAT THE FINGERS FORCED. `touch` was described as "contact on the skin",
 * which is whole-body and made this person inexpressible — NONE would be false
 * about their back, FULL false about the only part that touches a device. It is
 * now narrowed to the hands and fingertips, which costs nothing because every
 * dependent property was already a hand task.
 *
 * AND THE COLD. Vibration white finger is defined by its cold response, so
 * `ambientTemperature` is a genuine capability trigger rather than a comfort
 * setting — a better worked example of functional dependency than the tremor
 * case, because here the environment is part of the diagnosis.
 */
export const deafenedNotch = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "deafened-notch",
      description:
        "Hears below 3 kHz and above 6 kHz with both ears, and places sound reasonably " +
        "well. Follows speech with longer gaps between words and does better with " +
        "higher-pitched voices. Works by sight and sound rather than by feel, using " +
        "large targets that need to be larger still in the cold.",
      basis: EXEMPLAR,
    },
    modify: {
      hearing: { capability: "PARTIAL" },
      /* The fingers, not the body. See the note on `touch` in the schema. */
      touch: { capability: "NONE" },
      pointerControl: { capability: "PARTIAL" },
      /* Grip and fine control, reduced by the same exposure. The percentage is
       * pseudo-precision and issue #8 will replace it with an anchored scale;
       * recorded here in the property's current type rather than inventing a
       * one-off. */
      manualStability: { capability: "PARTIAL", measurement: 55 },
    },
    add: {
      /* THE GAP. Two bands, nothing usable between 3 and 6 kHz — which is
       * exactly where the consonants live, and why speech is the casualty
       * long before volume is. */
      usableFrequencyRange: {
        capability: "PARTIAL",
        measurement: [{ from: 20, to: 3000 }, { from: 6000, to: 12000 }],
      },
      /* Matched ears, so the two combine wherever either works: the binaural
       * band is the usable band. Contrast deafened-asymmetric, where they are
       * different. */
      binauralHearing: {
        capability: "PARTIAL",
        measurement: [{ from: 20, to: 3000 }, { from: 6000, to: 12000 }],
      },
      /* Localisation is largely intact — symmetric loss keeps interaural
       * comparison honest — but degraded inside the notch, where there is
       * nothing to compare. */
      azimuthResolution: { capability: "PARTIAL", measurement: 20 },
      elevationResolution: { capability: "PARTIAL", measurement: 30 },
      concurrentStreams: { capability: "PARTIAL", measurement: 2 },
      listeningDuration: { capability: "PARTIAL", measurement: 25 },
      readAudioText: { capability: "PARTIAL" },
      minInterWordGap: { capability: "PARTIAL", measurement: 260 },
      intelligibleVoicePitch: {
        capability: "PARTIAL",
        measurement: { from: 165, to: 300 },
      },
      /* No vibrotactile sense at the fingers — which is the clinical test for
       * the condition, and rules out haptic feedback as a substitute channel. */
      vibrationDetection: { capability: "NONE" },

      /* The cold-dependent target size. Base first, then the derived value. */
      targetSizeWarm: {
        property: "minTargetSize",
        capability: "PARTIAL",
        measurement: 12,
      },
      minTargetSize: {
        capability: "PARTIAL",
        derived: {
          reads: ["targetSizeWarm"],
          influences: ["ambientTemperature"],
          cite:
            "WARM: targetSizeWarm. COLD: targetSizeWarm x 1.6, rounded, clamped to " +
            "1..40 mm. Vibration white finger blanches and numbs further in cold, so " +
            "the same hand needs a larger target outdoors in winter than indoors.",
          formula: A.ifThen(
            A.eq(A.influence("ambientTemperature"), A.lit("COLD")),
            A.round(
              A.clamp(A.mul(A.measure("targetSizeWarm"), A.lit(1.6)), A.lit(1), A.lit(40)),
              0,
            ),
            A.measure("targetSizeWarm"),
          ),
        },
      },
    },
  }),
);

/**
 * English as an additional language.
 *
 * No sensory or motor limitation whatever, and that is the point. This model is
 * capability, not disability, and a capability model that only ever describes
 * disabled people has quietly become a disability model with better manners.
 * Language proficiency is an ordinary human variation that changes what an
 * interface should do — plain wording, no idiom, longer to read, a second
 * language offered where one exists — and it belongs in the same structure as
 * everything else.
 *
 * WHAT THIS EXERCISES. `knownLanguages` rates listening, speaking, reading and
 * writing separately, because for this speaker they genuinely differ:
 * comprehension runs ahead of production, which is the normal shape of second
 * language acquisition and is invisible to any model that records only "speaks
 * English".
 *
 * AND THE PART THAT SURPRISES SYSTEM DESIGNERS. `speech` is FULL — nothing is
 * wrong with this person's voice — while `speechIntelligibility` and
 * `speechRecognisedByMachine` are both PARTIAL. Accent is not a speech
 * impairment. But automatic speech recognition is trained on a narrow band of
 * voices, so the machine struggles where people do not, and a system that
 * assumes "clear voice therefore voice input works" is wrong in a way it will
 * never be told about.
 *
 * Note also that `speechIntelligibility` sits under a FULL parent and is
 * recorded anyway. That is legitimate — FULL makes a child uninteresting by
 * default, never forbidden — and this is the second profile to need it.
 */
export const secondLanguage = defineCapacity(
  userCapability,
  variation(referenceSpec, {
    entity: {
      id: "second-language",
      description:
        "Native Punjabi speaker, fluent listener and reader of English, conversational " +
        "in speaking and writing it. Full sight, hearing, touch and motor control. " +
        "Understood by most listeners; understood by machines less reliably.",
      basis: EXEMPLAR,
    },
    add: {
      knownLanguages: {
        capability: "PARTIAL",
        measurement: [
          { tag: "pa", listening: "native", speaking: "native",
            reading: "fluent", writing: "conversational" },
          { tag: "en-CA", listening: "fluent", speaking: "conversational",
            reading: "fluent", writing: "conversational" },
        ],
      },
      /* Nothing wrong with the voice. Accent is not a speech impairment, and
       * modelling it as one would be exactly the category error this model
       * exists to avoid. */
      speech: { capability: "FULL" },
      speechIntelligibility: { capability: "PARTIAL", measurement: "most listeners" },
      speechRecognisedByMachine: {
        capability: "PARTIAL",
        measurement: "with frequent corrections",
      },
      /* Reading English is fluent but not native, so text takes longer even
       * though the eyes are fine. A duration property, not a font-size one —
       * the constraint is comprehension, not legibility. */
      readFontText: { capability: "PARTIAL" },
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
  deafBlind,
  deafenedNotch,
  secondLanguage,
});
