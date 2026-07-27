/* The Capability Model population: what can be known about a person.
 * ---------------------------------------------------------------------------
 * This is a schema, not a profile. No user appears here. Values live in
 * profiles.js against the Capacity Model.
 *
 * MODEL PROVENANCE (design/DEMOS.md §6a) — mixed, and marked per group below.
 *
 *   MODEL SPECIFIES for Tables 2, 3 and 4 of "User Capability in an Adaptive
 *   World" (MSIADU'09), transcribed with their values, parents and
 *   descriptions.
 *
 *   MY CHOICE for the sonic, haptic and motor groups, and for a handful of
 *   properties Table 4 names as parents without defining. The paper licenses
 *   both extensions explicitly:
 *
 *     "Property groupings are also identifiable for the sonic and haptic
 *      design spaces, and it is possible to imagine other groupings, not
 *      related to specific design spaces, with use of language one obvious
 *      candidate."
 *
 *     Of Table 4: "A small edited fragment of such a language-based grouping
 *      is shown in Table 4."
 *
 *   So the shape of an extension is sanctioned; the specific properties are
 *   mine and are marked as such. An unmarked property is transcription.
 *
 *   ON ONTOLOGIES BEING OPEN. The paper says the model "scopes properties
 *   first by subject ontologies SUCH AS visual, sonic, and haptic" — an
 *   exemplary list, and the sentence about language groupings confirms it.
 *   `motor` and `language` are therefore not deviations. They are, however,
 *   not Nesbitt design spaces either, and `designSpace: false` records that so
 *   the difference survives into the write-up.
 *
 *   ON PRECEDENCE CROSSING ONTOLOGIES. Table 4's readSignText has parent
 *   "sight + signLanguageSet" — one parent in the visual ontology, one in
 *   language. That is correct and is not a contradiction of ontology
 *   disjointness: a Property sits in exactly one ontology and in any number of
 *   precedence trees. readFontText below does the same thing deliberately.
 */

import { defineCapability } from "../cradle/user/capability.js";

const PARTIAL_SCALE = ["FULL", "PARTIAL", "NONE"];

/** The paper's percentage idiom, used throughout Table 2: "100% would be no
 *  impairment. 0% would suggest some form of colour blindness. A mid-value of
 *  50% would suggest a mild form of colour blindness." Higher is more able. */
const percentage = (description, precedence, ontology = "visual") => ({
  ontology,
  type: "numeric",
  min: 0,
  max: 100,
  unit: "%",
  precedence,
  description,
});

export const userCapability = defineCapability({
  id: "cisna.user-capability",
  version: "0.1.0",

  ontologies: {
    visual: {
      designSpace: true,
      description:
        "Nesbitt's visual physical design space. What the user can perceive visually.",
    },
    sonic: {
      designSpace: true,
      description:
        "Nesbitt's auditory physical design space. What the user can perceive aurally. " +
        "The design space this demonstrator carries the most weight in.",
    },
    haptic: {
      designSpace: true,
      description: "Nesbitt's haptic physical design space. What the user can perceive by touch.",
    },
    motor: {
      designSpace: false,
      description:
        "MY CHOICE. Not a Nesbitt display space: what the user can DO to a device rather " +
        "than perceive from one. The paper licenses groupings 'not related to specific " +
        "design spaces' and models input capability throughout (writeFontSet's SELECT " +
        "value covers 'keyboard, scanning, eye tracking'; hand tremors appear twice as a " +
        "worked example), but tabulates no such ontology. This supplies one.",
    },
    language: {
      designSpace: false,
      description:
        "The paper's own example of a grouping not tied to a design space, tabulated as " +
        "Table 4: 'it is possible to imagine other groupings, not related to specific " +
        "design spaces, with use of language one obvious candidate'.",
    },
  },

  properties: {
    /* --- visual: Table 3, "Example capability model of vision" ----------- */

    sight: {
      ontology: "visual",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: [],
      description:
        "Top-level property for vision. Remaining properties only of interest for " +
        "PARTIAL sight.",
    },
    stereo: {
      ontology: "visual",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: ["sight"],
      description: "Stereo vision.",
    },
    focus: {
      ontology: "visual",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: ["sight"],
      description:
        "Can the user focus on a point? PARTIAL would suggest blurred/double vision. " +
        "Example of NONE would be a user with low vision who can distinguish light and " +
        "dark, but not images.",
    },
    focusDuration: {
      ontology: "visual",
      type: "numeric",
      min: 0,
      max: 480,
      unit: "min",
      precedence: ["focus"],
      description:
        "Length of time the user can continue to focus on a point (not necessarily the " +
        "same point) before experiencing fatigue.",
    },
    tracking: {
      ontology: "visual",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: ["focus"],
      description:
        "Can the user visually track a moving item? This is not a measure of focus (the " +
        "image may be blurred for instance) but it is related: identifying and tracking " +
        "an image.",
    },
    trackingDuration: {
      ontology: "visual",
      type: "numeric",
      min: 0,
      max: 480,
      unit: "min",
      precedence: ["tracking"],
      description:
        "Length of time the user can continue to track a moving image before experiencing " +
        "fatigue. Assuming that tracking a moving image is a greater cognitive load than " +
        "simply watching static images, this value should be less than focusDuration.",
    },

    /* Table 3 gives viewRectangle and nonViewRectangle as "x, y, w, h in
     * pixels". MY CHOICE: modelled as a Composite Property over two Numeric
     * Range parts rather than four numbers, because a rectangle IS a
     * horizontal extent and a vertical extent, and Numeric Range is one of the
     * model's five intrinsic types. Encoding four scalars into a Text property
     * would put structure inside a string, which is what first normal form
     * exists to prevent (OOA96 §2.1.1: "the domain underlying each attribute
     * consists of atomic values only"). */
    viewExtentH: {
      ontology: "visual",
      type: "numericRange",
      unit: "px",
      min: 0,
      max: 8192,
      precedence: ["sight"],
      description: "MY CHOICE. Horizontal extent of a viewing rectangle. A part, not used alone.",
    },
    viewExtentV: {
      ontology: "visual",
      type: "numericRange",
      unit: "px",
      min: 0,
      max: 8192,
      precedence: ["sight"],
      description: "MY CHOICE. Vertical extent of a viewing rectangle. A part, not used alone.",
    },
    viewRectangle: {
      ontology: "visual",
      type: "composite",
      composedOf: ["viewExtentH", "viewExtentV"],
      compositionOrder: "asDeclared",
      precedence: ["sight"],
      description:
        "A viewing rectangle within the user's field of vision. Nominally a rectangle " +
        "within a 1024x768 pixel screen on a 15\" laptop mounted at a normal viewing " +
        "distance from the user. Anything less than 1024x768 would typically suggest " +
        "tunnel vision.",
    },
    nonViewRectangle: {
      ontology: "visual",
      type: "composite",
      composedOf: ["viewExtentH", "viewExtentV"],
      compositionOrder: "asDeclared",
      precedence: ["sight"],
      description:
        "A rectangle within the user's field of vision not readable by the user. Any such " +
        "centrally placed rectangle would suggest either poor or no central vision, " +
        "perhaps only peripheral vision.",
    },

    /* --- visual: Table 2, "Capability model of colour-blindness" --------- */

    colorLow: percentage(
      "The effective low frequency colour perception of the user. 100% would be no " +
        "impairment. 0% would suggest some form of colour blindness. A mid-value of 50% " +
        "would suggest a mild form of colour blindness.",
      ["sight"],
    ),
    colorMedium: percentage(
      "The effective medium frequency colour perception of the user.",
      ["sight"],
    ),
    colorHigh: percentage(
      "The effective high frequency colour perception of the user.",
      ["sight"],
    ),
    intensityLow: percentage(
      "The effective low frequency intensity perception of the user. 100% would be no " +
        "impairment. Non-zero would suggest some form of colour blindness.",
      ["sight"],
    ),
    intensityMedium: percentage(
      "The effective medium frequency intensity perception of the user.",
      ["sight"],
    ),
    intensityHigh: percentage(
      "The effective high frequency intensity perception of the user.",
      ["sight"],
    ),

    /* MY CHOICE. Table 2 models colour and intensity per frequency band but
     * has no property for contrast sensitivity, which is the capability the
     * "low vision (contrast)" exemplar turns on. Modelled in the paper's own
     * percentage idiom rather than as a diagnosis, per "It is what the user
     * can do, not why she cannot." */
    contrastSensitivity: percentage(
      "MY CHOICE. The effective contrast discrimination of the user. 100% would be no " +
        "impairment; a low value means adjacent tones must differ more before the user " +
        "can tell them apart. Distinct from intensity perception, which Table 2 models " +
        "per frequency band.",
      ["sight"],
    ),

    /* --- sonic: MY CHOICE throughout ------------------------------------- */

    hearing: {
      ontology: "sonic",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: [],
      description:
        "MY CHOICE. Top-level property for hearing, following the shape of `sight` in " +
        "Table 3. Remaining sonic properties only of interest for PARTIAL hearing.",
    },
    usableFrequencyBand: {
      ontology: "sonic",
      type: "numericRange",
      unit: "Hz",
      min: 0,
      max: 22050,
      precedence: ["hearing"],
      description:
        "MY CHOICE. One contiguous band of usable hearing. A part of usableFrequencyRange, " +
        "not used alone.",
    },
    /* MODEL SPECIFIES for the structure: this composite is the paper's own
     * worked example of why Composite Property exists — "the usable audio
     * frequency range for a user, which may be described as a collection of
     * numeric ranges measured in Hertz, WITH GAPS BETWEEN THE RANGES.
     * Formalization by the CompositionOrder element allows for a natural order
     * to be applied to the composition, for example ordering the usable
     * frequency ranges from lowest to highest." The gaps are the point: a
     * listener with notched loss is expressible, and would not be by a single
     * min and max. */
    usableFrequencyRange: {
      ontology: "sonic",
      type: "composite",
      composedOf: ["usableFrequencyBand"],
      compositionOrder: "lowestToHighest",
      precedence: ["hearing"],
      description:
        "The usable audio frequency range for a user, as a collection of bands with gaps " +
        "between them, ordered lowest to highest. The paper's own example of a Composite " +
        "Property.",
    },
    azimuthResolution: {
      ontology: "sonic",
      type: "numeric",
      min: 1,
      max: 180,
      unit: "deg",
      precedence: ["hearing"],
      description:
        "MY CHOICE. The smallest left-right angular difference the user can reliably " +
        "distinguish. Directly bounds how many positions a spatialised soundscape can use.",
    },
    elevationResolution: {
      ontology: "sonic",
      type: "numeric",
      min: 1,
      max: 180,
      unit: "deg",
      precedence: ["hearing"],
      description:
        "MY CHOICE. The smallest up-down angular difference the user can reliably " +
        "distinguish. Typically much coarser than azimuth for most listeners.",
    },
    concurrentStreams: {
      ontology: "sonic",
      type: "numeric",
      min: 1,
      max: 8,
      unit: "streams",
      precedence: ["hearing"],
      description:
        "MY CHOICE. How many simultaneous audio streams the user can attend to and still " +
        "separate. The sonic analogue of Table 3's tracking.",
    },
    listeningDuration: {
      ontology: "sonic",
      type: "numeric",
      min: 0,
      max: 480,
      unit: "min",
      precedence: ["concurrentStreams"],
      description:
        "MY CHOICE. Length of time the user can attend to a dense soundscape before " +
        "experiencing fatigue. The sonic analogue of trackingDuration, and by the same " +
        "reasoning it should fall as concurrentStreams rises.",
    },

    /* --- haptic: MY CHOICE ------------------------------------------------ */

    touch: {
      ontology: "haptic",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: [],
      description: "MY CHOICE. Top-level property for touch perception.",
    },
    vibrationDetection: {
      ontology: "haptic",
      type: "numeric",
      min: 0,
      max: 100,
      unit: "%",
      precedence: ["touch"],
      description: "MY CHOICE. Effective detection of device vibration. 100% is no impairment.",
    },

    /* --- motor: MY CHOICE, on a licensed extension point ------------------ */

    pointerControl: {
      ontology: "motor",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: [],
      description:
        "MY CHOICE. Can the user operate a continuous pointing device? NONE is the " +
        "capability behind what is usually described as 'keyboard only' — and note that " +
        "describing it as capability rather than preference is the whole argument of §5: " +
        "'Does the user need a screen reader, or does she simply wish to use one?'",
    },
    keyControl: {
      ontology: "motor",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: [],
      description: "MY CHOICE. Can the user operate discrete keys or switches?",
    },
    manualStability: {
      ontology: "motor",
      type: "numeric",
      min: 0,
      max: 100,
      unit: "%",
      precedence: [],
      description:
        "MY CHOICE. Steadiness of the user's hand under load. 100% is no tremor. The " +
        "paper treats hand tremor as a capability with consequences beyond input: 'the " +
        "physical stability of the screen also plays a part, so that a person with hand " +
        "tremors may find that the readable size of text depends on whether the screen is " +
        "placed on a Table, or is held in their hand'.",
    },
    minTargetSize: {
      ontology: "motor",
      type: "numeric",
      min: 1,
      max: 40,
      unit: "mm",
      precedence: ["pointerControl"],
      description:
        "MY CHOICE. Smallest target the user can reliably acquire with a pointing device.",
    },
    sustainedPress: {
      ontology: "motor",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: ["keyControl"],
      description:
        "MY CHOICE. Can the user hold a key down, or chord two keys? NONE is the " +
        "capability that sticky-keys exists to answer.",
    },
    minKeyRepeatDelay: {
      ontology: "motor",
      type: "numeric",
      min: 0,
      max: 2000,
      unit: "ms",
      precedence: ["keyControl", "manualStability"],
      description:
        "MY CHOICE. Minimum delay before a held key should repeat, below which tremor " +
        "produces unintended repeats. Precedence crosses no ontology boundary here, but " +
        "does take two parents.",
    },

    /* --- language: Table 4, with its dangling parents supplied ------------ */

    language: {
      ontology: "language",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: [],
      description: "Can the user understand language (in any medium)?",
    },
    hapticLanguageSet: {
      ontology: "language",
      type: "discrete",
      values: ["Braille", "HapticMap"],
      precedence: ["language"],
      description: "Tactile based languages understood by the user.",
    },

    /* MY CHOICE. Table 4 names readFontText and readAudioText as parents but,
     * being "a small edited fragment", does not define them. Supplied here in
     * the same idiom so the precedence trees close. readFontText deliberately
     * takes parents in two ontologies — sight (visual) and language — which is
     * exactly what Table 4's readSignText does with "sight + signLanguageSet",
     * and demonstrates that precedence crosses ontology boundaries while
     * ontology membership stays disjoint. */
    readFontText: {
      ontology: "language",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: ["sight", "language"],
      description:
        "MY CHOICE (supplying a parent Table 4 names but does not define). Can the user " +
        "read written text visually?",
    },
    readAudioText: {
      ontology: "language",
      type: "discrete",
      values: PARTIAL_SCALE,
      precedence: ["hearing", "language"],
      description:
        "MY CHOICE (supplying a parent Table 4 names but does not define). Can the user " +
        "understand spoken text?",
    },
    minReadFontSizeForFont: {
      ontology: "language",
      type: "numeric",
      min: 4,
      max: 96,
      unit: "pt",
      precedence: ["readFontText"],
      description:
        "Minimum readable font size for user defined in points when presented on a " +
        "1024x768 pixel 15\" screen. Table 4 notes the difficulty this property exposes: " +
        "'font size is also a property in Access for All. The problem with this approach " +
        "is that there is only one setting allowed per property, yet properties such as " +
        "font size are functionally dependent on context'.",
    },
    minInterWordGap: {
      ontology: "language",
      type: "numeric",
      min: 0,
      max: 2000,
      unit: "ms",
      precedence: ["readAudioText"],
      description:
        "Minimum required gap in milliseconds between words required for the user to " +
        "understand the spoken word.",
    },
    writeFontSet: {
      ontology: "language",
      type: "discrete",
      values: ["CURSIVE", "BLOCK", "SELECT"],
      precedence: ["language", "keyControl"],
      description:
        "Modes some form of writing text. SELECT means some form of technology e.g. " +
        "keyboard, scanning, eye tracking etc. Table 4 gives the parent as " +
        "'fontLanguage + eSet', neither of which the fragment defines; MY CHOICE " +
        "substitutes language and keyControl, which is what the values actually depend on.",
    },
  },

  /* Capability Templates: "views of Properties that reflect grouping such as
   * those of Tables 1 to 4. The same Property may exist in many templates."
   * The overlap between `vision` and `colour` below is the paper's own example
   * of why that matters. */
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
