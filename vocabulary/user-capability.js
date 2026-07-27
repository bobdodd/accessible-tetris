/* The Capability Model population: what can be known about a person.
 * ---------------------------------------------------------------------------
 * A schema, not a profile. No user appears here. Values live in profiles.js.
 *
 * EVERY property below is FULL / PARTIAL / NONE. Where a property carries a
 * `measurement`, that measurement qualifies the PARTIAL case and only that
 * case. So `focusDuration` is not "a number of minutes": it is FULL (can focus
 * indefinitely), PARTIAL (can focus for N minutes), or NONE (cannot focus at
 * all), and the minutes exist only in the middle.
 *
 * This is what the paper's "Values" column is showing. In Table 3, `focus`
 * reads "FULL PARTIAL NONE" — the scale itself — while `focusDuration` reads
 * "Time in minutes" — the measurement that qualifies PARTIAL. Same column, two
 * different things, and reading it as "each property has a data type" produces
 * a model in which "no contrast perception" is written as 0%, which asserts a
 * measurement of something that is not there.
 *
 * MODEL PROVENANCE (design/DEMOS.md §6a)
 *
 *   MODEL SPECIFIES for Tables 2, 3 and 4 of "User Capability in an Adaptive
 *   World" (MSIADU'09), transcribed with their parents and descriptions.
 *
 *   MY CHOICE for the sonic, haptic and motor groups, and for a few properties
 *   Table 4 names as parents without defining. Both extensions are licensed:
 *
 *     "Property groupings are also identifiable for the sonic and haptic
 *      design spaces, and it is possible to imagine other groupings, not
 *      related to specific design spaces, with use of language one obvious
 *      candidate."
 *
 *     Of Table 4: "A small edited fragment of such a language-based grouping
 *      is shown in Table 4."
 *
 *   An unmarked property is transcription. Every MY CHOICE says so in its own
 *   description, so the distinction survives being read out of context.
 *
 *   ON ONTOLOGIES BEING OPEN. The model "scopes properties first by subject
 *   ontologies SUCH AS visual, sonic, and haptic" — exemplary, not exhaustive,
 *   and the sentence about language groupings confirms it. `motor` and
 *   `language` are not deviations, but they are not Nesbitt design spaces
 *   either, and `designSpace: false` records the difference.
 */

import { defineCapability } from "../cradle/user/capability.js";

/** The paper's percentage idiom, used throughout Table 2: "100% would be no
 *  impairment… A mid-value of 50% would suggest a mild form of colour
 *  blindness." Higher is more able. Note that total absence is NOT 0% — it is
 *  a capability of NONE, and the percentage does not arise. */
const percent = { type: "numeric", min: 1, max: 99, unit: "%" };
const minutes = (max = 480) => ({ type: "numeric", min: 1, max, unit: "min" });

export const userCapability = defineCapability({
  id: "cisna.user-capability",
  version: "0.2.0",

  ontologies: {
    visual: {
      designSpace: true,
      description: "Nesbitt's visual physical design space. What the user can perceive visually.",
    },
    sonic: {
      designSpace: true,
      description:
        "Nesbitt's auditory physical design space. What the user can perceive aurally, and " +
        "the design space this demonstrator carries the most weight in.",
    },
    haptic: {
      designSpace: true,
      description: "Nesbitt's haptic physical design space. What the user can perceive by touch.",
    },
    motor: {
      designSpace: false,
      description:
        "MY CHOICE. Not a Nesbitt display space: what the user can DO to a device rather " +
        "than perceive from one. The paper models input capability throughout — " +
        "writeFontSet's SELECT covers 'keyboard, scanning, eye tracking', and hand tremor " +
        "appears twice as a worked example — but tabulates no such ontology.",
    },
    language: {
      designSpace: false,
      description:
        "The paper's own example of a grouping not tied to a design space, tabulated as " +
        "Table 4.",
    },
  },

  properties: {
    /* --- visual: Table 3 -------------------------------------------------- */

    sight: {
      ontology: "visual",
      precedence: [],
      description:
        "Top-level property for vision. Remaining template properties only of interest " +
        "for PARTIAL sight.",
    },
    stereo: {
      ontology: "visual",
      precedence: ["sight"],
      description: "Stereo vision.",
    },
    focus: {
      ontology: "visual",
      precedence: ["sight"],
      description:
        "Can the user focus on a point? PARTIAL would suggest blurred/double vision. " +
        "Example of NONE would be a user with low vision who can distinguish light and " +
        "dark, but not images.",
    },
    focusDuration: {
      ontology: "visual",
      precedence: ["focus"],
      measurement: minutes(),
      description:
        "Length of time the user can continue to focus on a point (not necessarily the " +
        "same point) before experiencing fatigue. FULL is indefinitely; PARTIAL carries " +
        "the minutes.",
    },
    tracking: {
      ontology: "visual",
      precedence: ["focus"],
      description:
        "Can the user visually track a moving item? This is not a measure of focus (the " +
        "image may be blurred for instance) but it is related: identifying and tracking " +
        "an image.",
    },
    trackingDuration: {
      ontology: "visual",
      precedence: ["tracking"],
      measurement: minutes(),
      description:
        "Length of time the user can continue to track a moving image before experiencing " +
        "fatigue. Assuming tracking a moving image is a greater cognitive load than simply " +
        "watching static images, this value should be less than focusDuration.",
    },
    viewRectangle: {
      ontology: "visual",
      precedence: ["sight"],
      measurement: {
        type: "composite",
        parts: [
          { name: "x", type: "numeric", min: 0, max: 8192, unit: "px" },
          { name: "y", type: "numeric", min: 0, max: 8192, unit: "px" },
          { name: "w", type: "numeric", min: 1, max: 8192, unit: "px" },
          { name: "h", type: "numeric", min: 1, max: 8192, unit: "px" },
        ],
      },
      description:
        "A viewing rectangle within the user's field of vision. Nominally a rectangle " +
        "within a 1024x768 pixel screen on a 15\" laptop mounted at a normal viewing " +
        "distance. Anything less than 1024x768 would typically suggest tunnel vision. " +
        "FULL is the whole field, so the rectangle arises only for PARTIAL.",
    },
    nonViewRectangle: {
      ontology: "visual",
      precedence: ["sight"],
      measurement: {
        type: "composite",
        parts: [
          { name: "x", type: "numeric", min: 0, max: 8192, unit: "px" },
          { name: "y", type: "numeric", min: 0, max: 8192, unit: "px" },
          { name: "w", type: "numeric", min: 1, max: 8192, unit: "px" },
          { name: "h", type: "numeric", min: 1, max: 8192, unit: "px" },
        ],
      },
      description:
        "A rectangle within the user's field of vision NOT readable by the user. Any such " +
        "centrally placed rectangle would suggest either poor or no central vision, " +
        "perhaps only peripheral vision.",
    },

    /* --- visual: Table 2 -------------------------------------------------- */

    colorLow: {
      ontology: "visual", precedence: ["sight"], measurement: percent,
      description:
        "The effective low frequency colour perception of the user. FULL is no impairment; " +
        "NONE is no low-frequency colour perception at all; PARTIAL carries the percentage.",
    },
    colorMedium: {
      ontology: "visual", precedence: ["sight"], measurement: percent,
      description: "The effective medium frequency colour perception of the user.",
    },
    colorHigh: {
      ontology: "visual", precedence: ["sight"], measurement: percent,
      description: "The effective high frequency colour perception of the user.",
    },
    intensityLow: {
      ontology: "visual", precedence: ["sight"], measurement: percent,
      description: "The effective low frequency intensity perception of the user.",
    },
    intensityMedium: {
      ontology: "visual", precedence: ["sight"], measurement: percent,
      description: "The effective medium frequency intensity perception of the user.",
    },
    intensityHigh: {
      ontology: "visual", precedence: ["sight"], measurement: percent,
      description: "The effective high frequency intensity perception of the user.",
    },
    contrastSensitivity: {
      ontology: "visual", precedence: ["sight"], measurement: percent,
      description:
        "MY CHOICE. Effective contrast discrimination. Table 2 models colour and intensity " +
        "per frequency band but has no contrast property, and contrast is the limiting " +
        "capability for many low-vision users. NONE means contrast cannot be perceived at " +
        "all — not 0%, which would claim a measurement of something absent.",
    },

    /* --- sonic: MY CHOICE throughout -------------------------------------- */

    hearing: {
      ontology: "sonic",
      precedence: [],
      description:
        "MY CHOICE. Top-level property for hearing, following the shape of `sight`. " +
        "Remaining sonic properties only of interest for PARTIAL hearing.",
    },
    usableFrequencyRange: {
      ontology: "sonic",
      precedence: ["hearing"],
      measurement: {
        type: "composite",
        of: { type: "numericRange", unit: "Hz", min: 0, max: 22050 },
        order: "lowestToHighest",
      },
      description:
        "The usable audio frequency range, as a collection of bands with gaps between " +
        "them. The paper's own worked justification for Composite Property: 'a collection " +
        "of numeric ranges measured in Hertz, with gaps between the ranges… ordering the " +
        "usable frequency ranges from lowest to highest'. Notched loss is expressible; a " +
        "single min and max could not express it.",
    },
    azimuthResolution: {
      ontology: "sonic", precedence: ["hearing"],
      measurement: { type: "numeric", min: 1, max: 180, unit: "deg" },
      description:
        "MY CHOICE. Smallest left-right angular difference the user can reliably " +
        "distinguish. Directly bounds how many positions a spatialised soundscape can use.",
    },
    elevationResolution: {
      ontology: "sonic", precedence: ["hearing"],
      measurement: { type: "numeric", min: 1, max: 180, unit: "deg" },
      description:
        "MY CHOICE. Smallest up-down angular difference the user can reliably distinguish. " +
        "Typically much coarser than azimuth for most listeners.",
    },
    concurrentStreams: {
      ontology: "sonic", precedence: ["hearing"],
      measurement: { type: "numeric", min: 1, max: 8, unit: "streams" },
      description:
        "MY CHOICE. How many simultaneous audio streams the user can attend to and still " +
        "separate. The sonic analogue of Table 3's tracking.",
    },
    listeningDuration: {
      ontology: "sonic", precedence: ["hearing"],
      measurement: minutes(),
      description:
        "MY CHOICE. Length of time the user can attend to a dense soundscape before " +
        "experiencing fatigue. The sonic analogue of trackingDuration.",
    },

    /* --- haptic: MY CHOICE ------------------------------------------------ */

    touch: {
      ontology: "haptic", precedence: [],
      description: "MY CHOICE. Top-level property for touch perception.",
    },
    vibrationDetection: {
      ontology: "haptic", precedence: ["touch"], measurement: percent,
      description: "MY CHOICE. Effective detection of device vibration.",
    },

    /* --- motor: MY CHOICE, on a licensed extension point ------------------ */

    pointerControl: {
      ontology: "motor", precedence: [],
      description:
        "MY CHOICE. Can the user operate a continuous pointing device? NONE is the " +
        "capability usually described as 'keyboard only' — and describing it as capability " +
        "rather than preference is the paper's whole argument: 'Does the user need a " +
        "screen reader, or does she simply wish to use one?'",
    },
    keyControl: {
      ontology: "motor", precedence: [],
      description: "MY CHOICE. Can the user operate discrete keys or switches?",
    },
    manualStability: {
      ontology: "motor", precedence: [], measurement: percent,
      description:
        "MY CHOICE. Steadiness of the user's hand under load. FULL is no tremor; PARTIAL " +
        "carries the percentage. The paper treats tremor as a capability with consequences " +
        "beyond input: 'the physical stability of the screen also plays a part, so that a " +
        "person with hand tremors may find that the readable size of text depends on " +
        "whether the screen is placed on a Table, or is held in their hand'.",
    },
    minTargetSize: {
      ontology: "motor", precedence: ["pointerControl", "manualStability"],
      measurement: { type: "numeric", min: 1, max: 40, unit: "mm" },
      description:
        "MY CHOICE. Smallest target the user can reliably acquire with a pointing device.",
    },
    sustainedPress: {
      ontology: "motor", precedence: ["keyControl"],
      description:
        "MY CHOICE. Can the user hold a key down, or chord two keys? NONE is the " +
        "capability that sticky-keys exists to answer.",
    },
    minKeyRepeatDelay: {
      ontology: "motor", precedence: ["keyControl", "manualStability"],
      measurement: { type: "numeric", min: 1, max: 2000, unit: "ms" },
      description:
        "MY CHOICE. Minimum delay before a held key should repeat, below which tremor " +
        "produces unintended repeats.",
    },

    /* --- language: Table 4, with its dangling parents supplied ------------- */

    language: {
      ontology: "language", precedence: [],
      description: "Can the user understand language (in any medium)?",
    },
    hapticLanguageSet: {
      ontology: "language", precedence: ["language", "touch"],
      measurement: { type: "discrete", values: ["Braille", "HapticMap"], multiple: true },
      description:
        "Tactile based languages understood by the user. Table 4 gives the parent as " +
        "Language; MY CHOICE adds touch, since a tactile language depends on touch.",
    },
    readFontText: {
      ontology: "language", precedence: ["sight", "language"],
      description:
        "MY CHOICE (supplying a parent Table 4 names but does not define). Can the user " +
        "read written text visually? Parents in two ontologies deliberately, mirroring " +
        "Table 4's own readSignText with 'sight + signLanguageSet'.",
    },
    readAudioText: {
      ontology: "language", precedence: ["hearing", "language"],
      description:
        "MY CHOICE (supplying a parent Table 4 names but does not define). Can the user " +
        "understand spoken text?",
    },
    minReadFontSizeForFont: {
      ontology: "language",
      precedence: ["readFontText", "manualStability"],
      measurement: {
        type: "composite",
        parts: [
          { name: "size", type: "numeric", min: 4, max: 96, unit: "pt" },
          { name: "font", type: "text", maxLength: 64 },
        ],
      },
      description:
        "Minimum readable font size for user, in points and per font, when presented on a " +
        "1024x768 pixel 15\" screen. Table 4's own note on why this property is awkward: " +
        "'there is only one setting allowed per property, yet properties such as font size " +
        "are functionally dependent on context'. MY CHOICE adds manualStability as a second " +
        "parent, because the paper's own example makes the readable size depend on whether " +
        "the display is mounted or held.",
    },
    minInterWordGap: {
      ontology: "language", precedence: ["readAudioText"],
      measurement: { type: "numeric", min: 1, max: 2000, unit: "ms" },
      description:
        "Minimum required gap in milliseconds between words required for the user to " +
        "understand the spoken word.",
    },
    writeFontSet: {
      ontology: "language", precedence: ["language", "keyControl"],
      measurement: {
        type: "discrete", values: ["CURSIVE", "BLOCK", "SELECT"], multiple: true,
      },
      description:
        "Modes some form of writing text. SELECT means some form of technology e.g. " +
        "keyboard, scanning, eye tracking etc. Table 4 gives the parent as " +
        "'fontLanguage + eSet', neither of which the fragment defines; MY CHOICE " +
        "substitutes language and keyControl.",
    },
  },

  /* Capability Templates: "views of Properties that reflect grouping such as
   * those of Tables 1 to 4. The same Property may exist in many templates."
   * The overlap of `sight` between vision and colour is the paper's own
   * example of why that matters. */
  templates: {
    vision: {
      description: "Table 3 — example capability model of vision.",
      properties: [
        "sight", "stereo", "focus", "focusDuration", "tracking", "trackingDuration",
        "viewRectangle", "nonViewRectangle",
      ],
    },
    colour: {
      description: "Table 2 — capability model of colour-blindness.",
      properties: [
        "sight", "colorLow", "colorMedium", "colorHigh",
        "intensityLow", "intensityMedium", "intensityHigh", "contrastSensitivity",
      ],
    },
    listening: {
      description: "MY CHOICE. Sonic capability, the design space this demonstrator leans on.",
      properties: [
        "hearing", "usableFrequencyRange", "azimuthResolution", "elevationResolution",
        "concurrentStreams", "listeningDuration",
      ],
    },
    input: {
      description: "MY CHOICE. Motor capability: what the user can do to the device.",
      properties: [
        "pointerControl", "keyControl", "manualStability", "minTargetSize",
        "sustainedPress", "minKeyRepeatDelay",
      ],
    },
    reading: {
      description: "Table 4 — language-based properties.",
      properties: [
        "language", "hapticLanguageSet", "readFontText", "readAudioText",
        "minReadFontSizeForFont", "minInterWordGap", "writeFontSet",
      ],
    },
  },

  templateSets: {
    perceptual: {
      description: "The Nesbitt design spaces.",
      templates: ["vision", "colour", "listening"],
    },
    interaction: {
      description: "Groupings not tied to a design space.",
      templates: ["input", "reading"],
    },
  },
});
