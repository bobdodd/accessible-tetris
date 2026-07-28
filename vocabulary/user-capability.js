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
  version: "0.3.0",

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
    /* MY CHOICE, and added because the stress-test profiles demanded it. The
     * model has no laterality anywhere: no per-ear or per-eye properties. For a
     * user with asymmetric hearing loss that looked at first like a fatal gap.
     *
     * It is not, and the reason is the paper's own principle — "It is what the
     * user can do, not why she cannot." WHICH ear is damaged is mechanism, and
     * mechanism is what Table 1 does and Table 2 rejects. What a renderer
     * actually needs to know is the functional consequence: can this listener
     * use two ears together? That drives whether a soundscape may rely on
     * stereo separation at all, or must fold to mono and carry meaning some
     * other way.
     *
     * So laterality stays out and its consequence comes in. That is a real
     * limit — the model cannot say "put the important channel on his left" —
     * and it is recorded here rather than hidden. */
    binauralHearing: {
      ontology: "sonic", precedence: ["hearing"],
      /* The measurement is a frequency range, not a percentage, and that is the
       * whole point. Asymmetric loss is rarely uniform across the spectrum: an
       * ear that has lost its lower register still contributes its higher one,
       * so the two ears go on combining ABOVE some crossover and stop below it.
       * FULL is binaural across the whole audible range; PARTIAL carries the
       * band or bands where both ears still contribute; NONE is genuinely
       * monaural. */
      measurement: {
        type: "composite",
        of: { type: "numericRange", unit: "Hz", min: 0, max: 22050 },
        order: "lowestToHighest",
      },
      description:
        "MY CHOICE. Over which frequencies do the two ears still combine? NONE is " +
        "genuinely monaural listening. PARTIAL carries the bands where binaural " +
        "hearing survives — an ear that has lost only its lower register still " +
        "contributes above the crossover. This is the capability that decides " +
        "whether a spatialised soundscape can carry meaning in stereo, and where.",
    },
    azimuthResolution: {
      ontology: "sonic", precedence: ["hearing", "binauralHearing"],
      measurement: { type: "numeric", min: 1, max: 180, unit: "deg" },
      description:
        "MY CHOICE. Smallest left-right angular difference the user can reliably " +
        "distinguish. Directly bounds how many positions a spatialised soundscape can " +
        "use. Depends on binauralHearing: left-right localisation is built from " +
        "interaural differences, so it degrades as those ears stop combining. " +
        "KNOWN LIMIT: this is one number, but real localisation is frequency " +
        "dependent — low frequencies are localised by interaural TIME difference and " +
        "high by interaural LEVEL difference, so a listener who has lost the lows in " +
        "one ear localises high content far better than low. The model records the " +
        "band in binauralHearing and the overall acuity here, and cannot yet say " +
        "\"good above 800 Hz, hopeless below\".",
    },
    elevationResolution: {
      /* Deliberately NOT dependent on binauralHearing. Elevation cues are
       * monaural — the pinna filters incoming sound differently by angle — so a
       * listener with one working ear keeps whatever elevation discrimination
       * they had, while losing azimuth almost entirely. Getting this wrong
       * would model a monaural listener as having no spatial hearing at all,
       * when in fact one axis survives and the other does not. */
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
      /* NARROWED, deliberately, to the hands and fingertips.
       *
       * An earlier draft read "contact on the skin", which is whole-body and
       * turned out to be unusable. Vibration white finger takes tactile sense
       * from the fingers and leaves it everywhere else, and under a whole-body
       * reading that person is inexpressible: NONE would be false about their
       * back and their feet, FULL would be false about the only part that
       * touches a device.
       *
       * The narrowing costs nothing, because EVERY property that depends on
       * touch is already about hands — reading Braille, receiving tactile sign,
       * spelling onto someone's hand, feeling a device vibrate. Whole-body
       * tactile sense has no consumer here.
       *
       * KNOWN LIMIT, recorded rather than hidden: the model has no body-site
       * granularity, so a person with sensation in one hand and not the other,
       * or in the palm but not the fingertips, is not expressible. Same shape of
       * limit as laterality in hearing, and resolved the same way — the model
       * carries the functional consequence at the interaction surface, not the
       * anatomy. */
      description:
        "MY CHOICE. Tactile perception AT THE HANDS AND FINGERTIPS — the surface that " +
        "meets a device, reads Braille, and finds another person's hand. Deliberately " +
        "not whole-body: every dependent property is a hand task, and conditions such " +
        "as vibration white finger take the fingers while leaving the rest intact.",
    },
    vibrationDetection: {
      ontology: "haptic", precedence: ["touch"], measurement: percent,
      description: "MY CHOICE. Effective detection of device vibration.",
    },
    /* MY CHOICE, added for the MS profile. Haptics is conventionally BOTH
     * tactile sensing (contact on skin) and kinaesthesia (limb position and
     * movement, sensed from muscle and joint). The first draft of this ontology
     * modelled only the tactile half, which meant a user with intact touch but
     * absent proprioception was inexpressible — and that combination is common
     * in MS and in peripheral neuropathy, and it matters enormously for input.
     *
     * It is a separate property and not a sub-type of touch because the two
     * genuinely dissociate in both directions: touch can be lost with
     * proprioception intact, and proprioception lost with touch intact. */
    kinaesthesia: {
      ontology: "haptic", precedence: [], measurement: percent,
      description:
        "MY CHOICE. Can the user tell where their hand is without looking at it? " +
        "The other half of the haptic design space: limb position and movement " +
        "sensed from muscle and joint rather than from skin. NONE means every " +
        "positioning action needs visual confirmation, which is why it ends up " +
        "constraining input far more than tactile loss does.",
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
      ontology: "motor",
      /* Three parents, one of them in another ontology. Acquiring a target
       * needs a pointing device, a steady hand, AND knowing where your hand is
       * — and the third is the one usually forgotten, because most people have
       * it and never notice using it. */
      precedence: ["pointerControl", "manualStability", "kinaesthesia"],
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
      measurement: {
        type: "discrete",
        values: [
          "Braille",
          "DeafblindManual",   /* two-handed manual alphabet, spelled on the hand */
          "PrintOnPalm",       /* block capitals traced on the palm */
          "BlockAlphabet",
          "Lorm",              /* positions and strokes on the hand; mainly European */
          "HapticMap",
        ],
        multiple: true,
      },
      description:
        "Tactile scripts and codes the user reads by touch. Table 4 gives the parent as " +
        "Language; MY CHOICE adds touch, since a tactile script depends on it, and MY " +
        "CHOICE expands the values well past Braille — the two-handed deafblind manual " +
        "alphabet, print-on-palm and Lorm are how a great many DeafBlind people actually " +
        "receive text. Note these are SCRIPTS AND CODES, not languages: a signed " +
        "language received by touch is signLanguageSet plus readTactileSign, because " +
        "the language is the same one either way and only the channel changes.",
    },
    /* MY CHOICE, supplying the second parent Table 4 names but does not define.
     * Table 4 gives readSignText the parent "sight + signLanguageSet", so the
     * fragment assumes a signLanguageSet property exists; this is it. Added
     * because a Deaf profile without sign language is not a Deaf profile, and
     * because the model's own table already reached for it. */
    /* CORRECTED. An earlier draft parented this on sight as well as language,
     * reasoning that sign is received visually. That is wrong, and the DeafBlind
     * case is what exposed it: under `sight: NONE` the model then refused to let
     * a person know ASL at all, when in fact many DeafBlind signers have ASL as
     * a first language and simply receive it hand-over-hand.
     *
     * The paper's own structure already draws the distinction: `language` has no
     * parents at all, while `readFontText` needs sight, `readAudioText` needs
     * hearing, and `readSignText` needs sight. KNOWING a language and RECEIVING
     * it in a modality are separate properties. This one is knowledge; the
     * read* properties are channels. */
    signLanguageSet: {
      ontology: "language", precedence: ["language"],
      measurement: {
        type: "discrete",
        values: [
          "ASL",        /* American Sign Language */
          "LSQ",        /* Langue des signes québécoise */
          "BSL",        /* British Sign Language */
          "Auslan",     /* Australian Sign Language */
          "LSF",        /* Langue des signes française */
          "DGS",        /* Deutsche Gebärdensprache */
          "IrishSL",    /* disambiguated: "ISL" is used for Irish, Indian AND Israeli */
          "MaritimeSL", /* historical, Atlantic Canada */
          "SSE",        /* NOT a language — see below */
        ],
        multiple: true,
      },
      description:
        "MY CHOICE (supplying a parent Table 4 names but does not define). Signed " +
        "languages the user knows, independent of how they receive them. ASL and LSQ " +
        "are the two in common Canadian use and are unrelated languages, not dialects. " +
        "\"ISL\" is deliberately not used: it denotes Irish, Indian and Israeli Sign " +
        "Language in different sources. SSE (Sign Supported English) is included but " +
        "is a manually coded form of English rather than a language in its own right, " +
        "which a renderer must treat differently — English word order with signs " +
        "borrowed, not ASL grammar.",
    },
    /* MY CHOICE, and the DeafBlind profile is what demanded it. Table 4 gives
     * readSignText for the visual channel; there was no tactile equivalent, so a
     * hands-on signer was inexpressible. Same language, different channel — which
     * is precisely why signLanguageSet had to stop depending on sight. */
    readTactileSign: {
      ontology: "language", precedence: ["touch", "signLanguageSet"],
      description:
        "MY CHOICE. Can the user receive sign hand-over-hand? The tactile counterpart " +
        "of Table 4's readSignText, and the primary channel for many DeafBlind signers. " +
        "The language is whatever signLanguageSet says; only the modality differs.",
    },
    /* Table 4 verbatim, including its parent list. This row was skipped in the
     * first transcription precisely because signLanguageSet was undefined; with
     * that supplied it goes in as written, and it is the clearest demonstration
     * in the whole model that precedence crosses ontology boundaries while
     * ontology membership stays disjoint. */
    readSignText: {
      ontology: "language", precedence: ["sight", "signLanguageSet"],
      description: "Can the user read (and see) sign?",
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
    /* MY CHOICE, and the model had no way to say this at all.
     *
     * Prompted by Bob's observation from CNIB Library borrowing statistics:
     * older men consistently chose female narrators for audiobooks. That is
     * behavioural evidence of a capability, gathered across a whole population
     * of heavy listeners over hours of listening — which is a better measure of
     * what works than a word-recognition test over minutes, and it was obtained
     * without a single audiogram.
     *
     * The mechanism is genuinely unsettled. Presbycusis is a sloping HIGH
     * frequency loss, and published intelligibility studies find male and female
     * talkers about equally intelligible for older adults with hearing loss. Two
     * readings fit the borrowing data: either the lower register is reduced, so
     * the upper is what remains; or the lower register is well PRESERVED and
     * masks upward into the consonant range, so a higher-pitched talker escapes
     * it. Same preference, opposite cause.
     *
     * The model does not have to choose, and that is the point: "It is what the
     * user can do, not why she cannot." What a renderer needs is the band of
     * talker pitch that works, and it can act on that immediately by choosing a
     * synthetic voice. */
    intelligibleVoicePitch: {
      ontology: "language", precedence: ["readAudioText"],
      measurement: { type: "numericRange", unit: "Hz", min: 50, max: 500 },
      description:
        "The range of talker fundamental frequency the user understands well. FULL " +
        "means any voice works. PARTIAL carries the band that does — for reference, " +
        "adult male speech centres around 85-180 Hz and adult female around 165-255 Hz. " +
        "Directly actionable: it selects a synthetic voice.",
    },
    minInterWordGap: {
      ontology: "language", precedence: ["readAudioText"],
      measurement: { type: "numeric", min: 1, max: 2000, unit: "ms" },
      description:
        "Minimum required gap in milliseconds between words required for the user to " +
        "understand the spoken word.",
    },
    /* RECEPTION IS SENSORY, PRODUCTION IS MOTOR.
     *
     * This is the structural rule behind the three write* properties, and the
     * paper states only one of them. Table 4 has `writeFontSet` — producing
     * written text — as the counterpart of `readFontText`, and then stops. There
     * is no production counterpart for sign or for tactile script, which leaves
     * a person who can RECEIVE a language but not DELIVER it inexpressible.
     *
     * That combination is ordinary, not exotic. Someone with tremor or absent
     * touch may read two-handed manual on their own hand without difficulty and
     * be quite unable to spell it onto someone else's. The channels are
     * genuinely independent: the read* properties depend on senses, the write*
     * properties depend on hands.
     *
     * So each read* property below has a write* sibling, and they take different
     * parents by design.
     */
    writeFontSet: {
      ontology: "language",
      /* manualStability added: CURSIVE and BLOCK are handwriting and need a
       * steady hand, while SELECT explicitly does not — which is why the modes
       * live in the measurement rather than in separate properties. */
      precedence: ["language", "keyControl", "manualStability"],
      measurement: {
        type: "discrete", values: ["CURSIVE", "BLOCK", "SELECT"], multiple: true,
      },
      description:
        "Modes some form of writing text. SELECT means some form of technology e.g. " +
        "keyboard, scanning, eye tracking etc. Table 4 gives the parent as " +
        "'fontLanguage + eSet', neither of which the fragment defines; MY CHOICE " +
        "substitutes language, keyControl and manualStability.",
    },
    /* MY CHOICE. The production counterpart of readSignText and readTactileSign,
     * which the paper does not have. Both modes are one property because the
     * measurement distinguishes them: signing to a sighted person and signing
     * into someone's hands are the same language with different demands.
     *
     * Note that `touch` is deliberately NOT a parent. Signing visually needs no
     * tactile sense at all, and making touch a precedence parent would forbid a
     * person with absent touch from signing — which is false and is exactly the
     * over-constraining mistake made twice already (C7, C8). Tactile signing
     * does need touch, and that is expressed by which modes appear in the
     * measurement, not by blocking the whole property. */
    writeSignSet: {
      ontology: "language",
      precedence: ["signLanguageSet", "manualStability", "kinaesthesia"],
      measurement: {
        type: "discrete", values: ["Visual", "Tactile"], multiple: true,
      },
      description:
        "MY CHOICE. Modes of sign the user can PRODUCE. Visual is signing to someone " +
        "who watches; Tactile is signing into their hands. Depends on hands and on " +
        "knowing where those hands are, not on the senses that receive sign — a person " +
        "may read sign fluently and deliver it poorly, or the reverse.",
    },
    /* MY CHOICE. Producing a tactile script — spelling the two-handed manual
     * alphabet onto another person's hand, or writing Braille. Touch IS a parent
     * here, unlike writeSignSet: you cannot place letters on a hand you cannot
     * feel. This is Bob's case exactly. */
    writeTactileSet: {
      ontology: "language",
      precedence: ["hapticLanguageSet", "manualStability", "touch"],
      measurement: {
        type: "discrete",
        values: ["Braille", "DeafblindManual", "PrintOnPalm", "BlockAlphabet", "Lorm"],
        multiple: true,
      },
      description:
        "MY CHOICE. Tactile scripts the user can PRODUCE, as distinct from those they " +
        "can read. Spelling onto another person's hand needs a steady hand and enough " +
        "touch to find theirs, so tremor or absent tactile sense can leave someone " +
        "fluent in receiving a script and unable to deliver it.",
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
        "hearing", "binauralHearing", "usableFrequencyRange", "azimuthResolution",
        "elevationResolution", "concurrentStreams", "listeningDuration",
      ],
    },
    input: {
      description: "MY CHOICE. Motor capability: what the user can do to the device.",
      properties: [
        "pointerControl", "keyControl", "manualStability", "minTargetSize",
        "sustainedPress", "minKeyRepeatDelay", "kinaesthesia",
      ],
    },
    reading: {
      description: "Table 4 — language-based properties.",
      properties: [
        "language", "hapticLanguageSet", "signLanguageSet",
        "readSignText", "readTactileSign", "readFontText", "readAudioText",
        "minReadFontSizeForFont", "minInterWordGap", "intelligibleVoicePitch",
        "writeFontSet", "writeSignSet", "writeTactileSet",
      ],
    },
    touchSense: {
      description: "MY CHOICE. The haptic design space, both halves of it.",
      properties: ["touch", "vibrationDetection", "kinaesthesia"],
    },
  },

  templateSets: {
    perceptual: {
      description: "The Nesbitt design spaces.",
      templates: ["vision", "colour", "listening", "touchSense"],
    },
    interaction: {
      description: "Groupings not tied to a design space.",
      templates: ["input", "reading"],
    },
  },
});
