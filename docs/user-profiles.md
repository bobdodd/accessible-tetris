# User capability profiles

Generated from the live models by `docs/tools/render-profiles.mjs`. Do not edit by
hand: re-run the script instead. The tables follow the presentation of Tables 1 to 4
in *User Capability in an Adaptive World* (Dodd, Green & Pearson, MSIADU'09,
[doi:10.1145/1631097.1631110](https://doi.org/10.1145/1631097.1631110)).

## What these profiles are, and what they are not

They are **stand-ins**. They exist so the cradle has something to adapt to before
there is anyone real to adapt to, and they are to be replaced or augmented with
lived experience as and when it is available. Every profile records its basis in
the data rather than only in prose, so a fixture cannot quietly become a finding.

They are deliberately **not personas**. There is no name, age, occupation or
narrative, because those invite a reader to generalise from a character to a
population. What is recorded is capability and nothing else, which is the source
paper's own argument: *"It is what the user can do, not why she cannot."*

## How to read a capability

Every property is **FULL**, **PARTIAL** or **NONE**. A measurement appears against
PARTIAL and against nothing else.

| Value | Means | Measurement |
|---|---|---|
| `FULL` | The capability is unimpaired. | None — there is nothing left to qualify. |
| `PARTIAL` | The capability exists but is limited. | Required, where the property declares one. |
| `NONE` | The capability is absent. | None — there is nothing there to measure. |

So a user who cannot perceive contrast has `contrastSensitivity: NONE`. Writing 0%
would claim that a measurement was taken of something that is not there.

### Why most properties are missing from most profiles

The paper attaches a rule to the top of every table: *"Remaining template
properties only of interest for PARTIAL sight."* Read literally, and it is meant
literally, that says a child property is worth asking about only when its parent is
PARTIAL. A FULL parent leaves no impairment to describe; a NONE parent leaves
nothing to describe either.

Two consequences run through every table below:

- **NONE propagates.** A capability cannot exist beneath one that does not. The
  model refuses `colorLow: PARTIAL` under `sight: NONE`.
- **FULL does not propagate.** It makes children *uninteresting*, not forbidden.
  Someone with tunnel vision has PARTIAL sight and may have entirely FULL colour
  perception, and a Braille reader has FULL language with a very specific
  `hapticLanguageSet`. Recording either is extra detail, not a contradiction.

This is why the reference profile below is seven lines and the blind exemplar is
one line different from it.

---

## The Capability Model

The schema: what *can* be known about a person. It holds no user data. The
`Values` column shows the measurement that qualifies PARTIAL, or `—` where PARTIAL
needs no further detail — `focus` is PARTIAL for blurred or double vision and that
is the whole statement.

### Template: vision

Table 3 — example capability model of vision.

| Property | Values (PARTIAL measurement) | Parent | Ontology | Description |
|---|---|---|---|---|
| `sight` | — | None | visual | Top-level property for vision. Remaining template properties only of interest for PARTIAL sight. |
| `focus` | — | sight | visual | Can the user focus on a point? PARTIAL would suggest blurred/double vision. |
| `focusDuration` | 1–480 min | focus | visual | Length of time the user can continue to focus on a point (not necessarily the same point) before experiencing fatigue. |
| `nonViewRectangle` | x: 0–8192 px + y: 0–8192 px + w: 1–8192 px + h: 1–8192 px | sight | visual | A rectangle within the user's field of vision NOT readable by the user. |
| `stereo` | — | sight | visual | Stereo vision. |
| `tracking` | — | focus | visual | Can the user visually track a moving item? This is not a measure of focus (the image may be blurred for instance) but it is related: identifying and t… |
| `trackingDuration` | 1–480 min | tracking | visual | Length of time the user can continue to track a moving image before experiencing fatigue. |
| `viewRectangle` | x: 0–8192 px + y: 0–8192 px + w: 1–8192 px + h: 1–8192 px | sight | visual | A viewing rectangle within the user's field of vision. Nominally a rectangle within a 1024x768 pixel screen on a 15" laptop mounted at a normal viewin… |

### Template: colour

Table 2 — capability model of colour-blindness.

| Property | Values (PARTIAL measurement) | Parent | Ontology | Description |
|---|---|---|---|---|
| `sight` | — | None | visual | Top-level property for vision. Remaining template properties only of interest for PARTIAL sight. |
| `colorHigh` | 1–99 % | sight | visual | The effective high frequency colour perception of the user. |
| `colorLow` | 1–99 % | sight | visual | The effective low frequency colour perception of the user. FULL is no impairment; NONE is no low-frequency colour perception at all; PARTIAL carries t… |
| `colorMedium` | 1–99 % | sight | visual | The effective medium frequency colour perception of the user. |
| `contrastSensitivity` | 1–99 % | sight | visual | MY CHOICE. Effective contrast discrimination. Table 2 models colour and intensity per frequency band but has no contrast property, and contrast is the… |
| `intensityHigh` | 1–99 % | sight | visual | The effective high frequency intensity perception of the user. |
| `intensityLow` | 1–99 % | sight | visual | The effective low frequency intensity perception of the user. |
| `intensityMedium` | 1–99 % | sight | visual | The effective medium frequency intensity perception of the user. |

### Template: listening

MY CHOICE. Sonic capability, the design space this demonstrator leans on.

| Property | Values (PARTIAL measurement) | Parent | Ontology | Description |
|---|---|---|---|---|
| `hearing` | — | None | sonic | MY CHOICE. Top-level property for hearing, following the shape of `sight`. Remaining sonic properties only of interest for PARTIAL hearing. |
| `binauralHearing` | collection of range in Hz, lowestToHighest | hearing | sonic | MY CHOICE. Over which frequencies do the two ears still combine? NONE is genuinely monaural listening. |
| `azimuthResolution` | 1–180 deg | hearing, binauralHearing | sonic | MY CHOICE. Smallest left-right angular difference the user can reliably distinguish. |
| `concurrentStreams` | 1–8 streams | hearing | sonic | MY CHOICE. How many simultaneous audio streams the user can attend to and still separate. The sonic analogue of Table 3's tracking. |
| `elevationResolution` | 1–180 deg | hearing | sonic | MY CHOICE. Smallest up-down angular difference the user can reliably distinguish. Typically much coarser than azimuth for most listeners. |
| `listeningDuration` | 1–480 min | hearing | sonic | MY CHOICE. Length of time the user can attend to a dense soundscape before experiencing fatigue. The sonic analogue of trackingDuration. |
| `usableFrequencyRange` | collection of range in Hz, lowestToHighest | hearing | sonic | The usable audio frequency range, as a collection of bands with gaps between them. |

### Template: input

MY CHOICE. Motor capability: what the user can do to the device.

| Property | Values (PARTIAL measurement) | Parent | Ontology | Description |
|---|---|---|---|---|
| `keyControl` | — | None | motor | MY CHOICE. Can the user operate discrete keys or switches? |
| `headControl` | — | None | motor | MY CHOICE. Can the user direct head position deliberately, for head pointing or head switches? Preserved in high cervical injury well below the level… |
| `inputDuration` | 1–480 min | None | motor | MY CHOICE. How long the user can sustain deliberate input before fatigue forces a break. |
| `kinaesthesia` | 1–99 % | None | haptic | MY CHOICE. Can the user tell where their hand is without looking at it? The other half of the haptic design space: limb position and movement sensed f… |
| `manualStability` | 1–99 % | None | motor | MY CHOICE. Steadiness of the user's hand under load. FULL is no tremor; PARTIAL carries the percentage. |
| `minKeyRepeatDelay` | 1–2000 ms | keyControl, manualStability | motor | MY CHOICE. Minimum delay before a held key should repeat, below which tremor produces unintended repeats. |
| `pointerControl` | — | None | motor | MY CHOICE. Can the user operate a continuous pointing device WITH A HAND? NONE is the capability usually described as 'keyboard only' — and describing… |
| `minTargetSize` | 1–40 mm | pointerControl, manualStability, kinaesthesia | motor | MY CHOICE. Smallest target the user can reliably acquire with a pointing device. |
| `speech` | — | None | motor | MY CHOICE. Can the user produce spoken output at all? Independent of whether anyone or anything understands it, which is speechIntelligibility and spe… |
| `sustainedPress` | — | keyControl | motor | MY CHOICE. Can the user hold a key down, or chord two keys? NONE is the capability that sticky-keys exists to answer. |

### Template: alternativeAccess

MY CHOICE. Switch, breath, head and gaze access — the channels used when a hand on a pointing device is not available. Overlaps `input` deliberately: the same Property may appear in many templates.

| Property | Values (PARTIAL measurement) | Parent | Ontology | Description |
|---|---|---|---|---|
| `keyControl` | — | None | motor | MY CHOICE. Can the user operate discrete keys or switches? |
| `activationTiming` | cannot reliably time a moving target, needs a slow scan, needs a moderate scan, any scan rate | keyControl | motor | MY CHOICE. Can the user activate a switch at the moment a scan reaches the item they want? Ordered least to most capable. |
| `breathControl` | 1–4 signals | None | motor | MY CHOICE. How many distinguishable breath signals the user can produce on demand — sip and puff, each optionally hard and soft, so up to four. |
| `gazeControl` | — | sight | motor | MY CHOICE. Can the user direct their gaze deliberately at a target? A MOTOR capability that depends on sight but is not sight: in late-stage ALS visio… |
| `dwellTolerance` | 100–4000 ms | gazeControl | motor | MY CHOICE. How long the user can hold a fixation steady enough to confirm a selection. |
| `gazeAccuracy` | 1–15 deg | gazeControl | motor | MY CHOICE. The angular error within which the user can place their gaze. Sets the minimum on-screen target size directly. |
| `headControl` | — | None | motor | MY CHOICE. Can the user direct head position deliberately, for head pointing or head switches? Preserved in high cervical injury well below the level… |
| `inputDuration` | 1–480 min | None | motor | MY CHOICE. How long the user can sustain deliberate input before fatigue forces a break. |
| `sustainedPress` | — | keyControl | motor | MY CHOICE. Can the user hold a key down, or chord two keys? NONE is the capability that sticky-keys exists to answer. |
| `switchSites` | 1–8 sites | keyControl | motor | MY CHOICE. How many independent body sites the user can operate a switch from, reliably and repeatably — head, hand, foot, knee, chin, eyebrow. |

### Template: reading

Table 4 — language-based properties.

| Property | Values (PARTIAL measurement) | Parent | Ontology | Description |
|---|---|---|---|---|
| `language` | — | None | language | Can the user understand language (in any medium)? |
| `hapticLanguageSet` | Braille, DeafblindManual, PrintOnPalm, BlockAlphabet, Lorm, HapticMap (one or more) | language, touch | language | Tactile scripts and codes the user reads by touch. Table 4 gives the parent as Language; MY CHOICE adds touch, since a tactile script depends on it, a… |
| `readAudioText` | — | hearing, language | language | MY CHOICE (supplying a parent Table 4 names but does not define). Can the user understand spoken text? |
| `intelligibleVoicePitch` | range in Hz | readAudioText | language | The range of talker fundamental frequency the user understands well. FULL means any voice works. |
| `knownLanguages` | collection of tag: text + listening: none, basic, conversational, fluent, native + speaking: none, basic, conversational, fluent, native + reading: none, basic, conversational, fluent, native + writing: none, basic, conversational, fluent, native, asDeclared | language | language | The spoken and written languages the user knows, each with the four standard skills rated separately. |
| `minInterWordGap` | 1–2000 ms | readAudioText | language | Minimum required gap in milliseconds between words required for the user to understand the spoken word. |
| `readFontText` | — | sight, language | language | MY CHOICE (supplying a parent Table 4 names but does not define). |
| `minReadFontSizeForFont` | size: 4–96 pt + font: text | readFontText, manualStability | language | Minimum readable font size for user, in points and per font, when presented on a 1024x768 pixel 15" screen. |
| `signLanguageSet` | ASL, LSQ, BSL, Auslan, LSF, DGS, IrishSL, MaritimeSL, SSE (one or more) | language | language | MY CHOICE (supplying a parent Table 4 names but does not define). Signed languages the user knows, independent of how they receive them. |
| `readSignText` | — | sight, signLanguageSet | language | Can the user read (and see) sign? |
| `readTactileSign` | — | touch, signLanguageSet | language | MY CHOICE. Can the user receive sign hand-over-hand? The tactile counterpart of Table 4's readSignText, and the primary channel for many DeafBlind sig… |
| `speechIntelligibility` | familiar listeners, with effort, familiar listeners, most listeners, any listener | speech | language | How readily the user's speech is understood by other people. Ordered least to most capable. |
| `speechRecognisedByMachine` | only after training on this voice, with frequent corrections, with occasional corrections, reliably | speech | language | MY CHOICE. Whether automatic speech recognition can transcribe this user. |
| `writeFontSet` | CURSIVE, BLOCK, SELECT (one or more) | language, keyControl, manualStability | language | Modes some form of writing text. SELECT means some form of technology e.g. keyboard, scanning, eye tracking etc. |
| `writeSignSet` | Visual, Tactile (one or more) | signLanguageSet, manualStability, kinaesthesia | language | MY CHOICE. Modes of sign the user can PRODUCE. Visual is signing to someone who watches; Tactile is signing into their hands. |
| `writeTactileSet` | Braille, DeafblindManual, PrintOnPalm, BlockAlphabet, Lorm (one or more) | hapticLanguageSet, manualStability, touch | language | MY CHOICE. Tactile scripts the user can PRODUCE, as distinct from those they can read. |

### Template: touchSense

MY CHOICE. The haptic design space, both halves of it.

| Property | Values (PARTIAL measurement) | Parent | Ontology | Description |
|---|---|---|---|---|
| `touch` | — | None | haptic | MY CHOICE. Tactile perception AT THE HANDS AND FINGERTIPS — the surface that meets a device, reads Braille, and finds another person's hand. |
| `kinaesthesia` | 1–99 % | None | haptic | MY CHOICE. Can the user tell where their hand is without looking at it? The other half of the haptic design space: limb position and movement sensed f… |
| `vibrationDetection` | 1–99 % | touch | haptic | MY CHOICE. Effective detection of device vibration. |

### Subject ontologies

*"Subject ontologies are disjoint, so individual properties exist in exactly one
ontology."* Precedence, by contrast, crosses them freely — `readFontText` has
parents in both `visual` and `language`, mirroring Table 4's own `readSignText`
with *"sight + signLanguageSet"*.

| Ontology | Nesbitt design space | Properties |
|---|---|---|
| visual | yes | 15 |
| sonic | yes | 7 |
| haptic | yes | 3 |
| motor | no | 15 |
| language | no | 16 |

---

## The profiles

### reference

*Full capability across every ontology. Exists to be differenced against, and named `reference` rather than `default` on purpose: a default is what you get if you do not choose.*

**Basis:** exemplar — not derived from any person  
**Entity kind:** user · **Settings recorded:** 7

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `manualStability` | **FULL** | — | None |
| — | `pointerControl` | **FULL** | — | None |

**Not recorded: 49 of 56 properties.**

- **Not of interest** (49), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 37 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### blind-since-birth

*Reads Braille, listens closely, and follows more concurrent audio than most. Full hearing, touch, language and motor control. No usable sight from birth.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 9

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **NONE** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `hapticLanguageSet` | **PARTIAL** | Braille | language, touch |
| — | `manualStability` | **FULL** | — | None |
| — | `readFontText` | **NONE** | — | sight, language |
| — | `pointerControl` | **FULL** | — | None |

**Not recorded: 47 of 56 properties.**

- **Cannot exist** (14), because a precedence parent is NONE: `stereo`, `focus`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, `intensityHigh`, `contrastSensitivity`, `gazeControl`, `readSignText`, `minReadFontSizeForFont`.

- **Not of interest** (33), because no precedence parent is PARTIAL: `focusDuration`, `tracking`, `trackingDuration`, `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, `elevationResolution`, `concurrentStreams`, `listeningDuration`, `vibrationDetection`, `kinaesthesia`, `switchSites`, and 21 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### low-vision-contrast

*Sees colour fully and reads at 18pt. Distinguishes tones that differ strongly; focuses and tracks for short periods.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 20

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **PARTIAL** | — | None |
| — | `colorHigh` | **FULL** | — | sight |
| — | `colorLow` | **FULL** | — | sight |
| — | `colorMedium` | **FULL** | — | sight |
| — | `contrastSensitivity` | **PARTIAL** | 30 % | sight |
| — | `focus` | **PARTIAL** | — | sight |
| — | `focusDuration` | **PARTIAL** | 25 min | focus |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `intensityHigh` | **PARTIAL** | 45 % | sight |
| — | `intensityLow` | **PARTIAL** | 45 % | sight |
| — | `intensityMedium` | **PARTIAL** | 45 % | sight |
| — | `manualStability` | **FULL** | — | None |
| — | `readFontText` | **PARTIAL** | — | sight, language |
| — | `minReadFontSizeForFont` | **PARTIAL** | size 18, font system-sans | readFontText, manualStability |
| — | `pointerControl` | **FULL** | — | None |
| — | `tracking` | **PARTIAL** | — | focus |
| — | `trackingDuration` | **PARTIAL** | 12 min | tracking |

**Not recorded: 36 of 56 properties.**

- **Not of interest** (36), because no precedence parent is PARTIAL: `stereo`, `viewRectangle`, `nonViewRectangle`, `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, `elevationResolution`, `concurrentStreams`, `listeningDuration`, `vibrationDetection`, `kinaesthesia`, `switchSites`, and 24 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### low-vision-colour

*Colour discrimination reduced in the green-yellow-red region; contrast intact. Modelled as capability per Table 2, not as a diagnosis per Table 1.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 12

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **PARTIAL** | — | None |
| — | `colorHigh` | **PARTIAL** | 80 % | sight |
| — | `colorLow` | **PARTIAL** | 40 % | sight |
| — | `colorMedium` | **PARTIAL** | 25 % | sight |
| — | `contrastSensitivity` | **FULL** | — | sight |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `intensityMedium` | **PARTIAL** | 70 % | sight |
| — | `manualStability` | **FULL** | — | None |
| — | `pointerControl` | **FULL** | — | None |

**Not recorded: 44 of 56 properties.**

- **Not of interest** (44), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `intensityLow`, `intensityHigh`, `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, and 32 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### keyboard-only

*Full discrete key control, and writes by selection — keyboard, scanning or eye tracking. Does not use a continuous pointing device.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 8

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `manualStability` | **FULL** | — | None |
| — | `pointerControl` | **NONE** | — | None |
| — | `writeFontSet` | **PARTIAL** | SELECT | language, keyControl, manualStability |

**Not recorded: 48 of 56 properties.**

- **Cannot exist** (1), because a precedence parent is NONE: `minTargetSize`.

- **Not of interest** (47), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 35 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### hand-tremor

*Full sight, hearing and language. Holds a hand steady to about a third of typical, which sets his target size, key delay, and — whenever the display is hand-held rather than mounted — the size of type he can read.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 12

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **PARTIAL** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `manualStability` | **PARTIAL** | 35 % | None |
| — | `minKeyRepeatDelay` | **PARTIAL** | 900 ms | keyControl, manualStability |
| `fontSizeSeated` | `minReadFontSizeForFont` | **PARTIAL** | size 12, font system-sans | readFontText, manualStability |
| — | `minReadFontSizeForFont` | **PARTIAL** | *derived — see below* | readFontText, manualStability |
| — | `pointerControl` | **PARTIAL** | — | None |
| — | `minTargetSize` | **PARTIAL** | 18 mm | pointerControl, manualStability, kinaesthesia |
| — | `sustainedPress` | **PARTIAL** | — | keyControl |

**Not recorded: 45 of 56 properties.**

- **Not of interest** (45), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 33 more.

#### Functionally dependent settings

Marked **(M)** for mathematical dependence, per OOA96 §2.3: *"given values of the
attributes in X, the value of Y can be determined by a formula or algorithm"*. The
model requires each one to cite its formula.

| Setting (M) | Reads | External influences | Formula |
|---|---|---|---|
| `minReadFontSizeForFont` | `fontSizeSeated`, `manualStability` | `deviceStability` | MOUNTED: fontSizeSeated.size. HANDHELD: fontSizeSeated.size scaled by (1 + (100 - manualStability)/100), clamped to 4..96pt and rounded to 1dp. At 35% stability a hand-held display needs 1.65x the mounted size. |

**Resolved against `deviceStability`:**

| `deviceStability` | `minReadFontSizeForFont` |
|---|---|
| MOUNTED | size 12, font system-sans |
| HANDHELD | size 19.8, font system-sans |

One profile, two answers, no duplicated context. Access for All would need two
whole `<context>` blocks to say this, which is the duplication the paper's §3
criticises.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### deaf

*Signs fluently in ASL, reads print and sign, and has full sight, touch and motor control. No usable hearing — the hardest case for an audio-first demonstrator, which is why it is here.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 15

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **NONE** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `readAudioText` | **NONE** | — | hearing, language |
| — | `knownLanguages` | **PARTIAL** | **en-CA** — listening none, speaking basic, reading fluent, writing fluent | language |
| — | `manualStability` | **FULL** | — | None |
| — | `pointerControl` | **FULL** | — | None |
| — | `signLanguageSet` | **PARTIAL** | ASL | language |
| — | `readSignText` | **FULL** | — | sight, signLanguageSet |
| — | `speech` | **PARTIAL** | — | None |
| — | `speechIntelligibility` | **PARTIAL** | familiar listeners | speech |
| — | `speechRecognisedByMachine` | **NONE** | — | speech |
| — | `writeSignSet` | **PARTIAL** | Visual | signLanguageSet, manualStability, kinaesthesia |

**Not recorded: 41 of 56 properties.**

- **Cannot exist** (8), because a precedence parent is NONE: `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, `elevationResolution`, `concurrentStreams`, `listeningDuration`, `intelligibleVoicePitch`, `minInterWordGap`.

- **Not of interest** (33), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 21 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### deafened-asymmetric

*Hears across the full range with one ear and the upper register with both. Follows two concurrent streams, places sound coarsely left and right, and understands speech best from higher-pitched voices. Speaks and expects speech; does not sign.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 16

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **PARTIAL** | — | None |
| — | `binauralHearing` | **PARTIAL** | 800–8000 | hearing |
| — | `azimuthResolution` | **PARTIAL** | 45 deg | hearing, binauralHearing |
| — | `sight` | **FULL** | — | None |
| — | `concurrentStreams` | **PARTIAL** | 2 streams | hearing |
| — | `elevationResolution` | **PARTIAL** | 40 deg | hearing |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `readAudioText` | **PARTIAL** | — | hearing, language |
| — | `intelligibleVoicePitch` | **PARTIAL** | 165–300 | readAudioText |
| — | `listeningDuration` | **PARTIAL** | 20 min | hearing |
| — | `manualStability` | **FULL** | — | None |
| — | `minInterWordGap` | **PARTIAL** | 220 ms | readAudioText |
| — | `pointerControl` | **FULL** | — | None |
| — | `usableFrequencyRange` | **PARTIAL** | 20–8000 | hearing |

**Not recorded: 40 of 56 properties.**

- **Not of interest** (40), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 28 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### multiple-sclerosis

*Hears fully, reads at 20pt in short spells, and works with large targets and long key delays. Sees with one eye at a time; locates a hand to within a quarter of its usual accuracy. A spiky profile across four ontologies: the paper's own example of what stereotype templates handle worst.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 19

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **PARTIAL** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **PARTIAL** | — | None |
| — | `focus` | **PARTIAL** | — | sight |
| — | `focusDuration` | **PARTIAL** | 8 min | focus |
| — | `language` | **FULL** | — | None |
| — | `touch` | **NONE** | — | None |
| — | `kinaesthesia` | **PARTIAL** | 25 % | None |
| — | `listeningDuration` | **PARTIAL** | 15 min | hearing |
| — | `manualStability` | **PARTIAL** | 30 % | None |
| — | `minKeyRepeatDelay` | **PARTIAL** | 1200 ms | keyControl, manualStability |
| — | `readFontText` | **PARTIAL** | — | sight, language |
| — | `minReadFontSizeForFont` | **PARTIAL** | size 20, font system-sans | readFontText, manualStability |
| — | `pointerControl` | **PARTIAL** | — | None |
| — | `minTargetSize` | **PARTIAL** | 28 mm | pointerControl, manualStability, kinaesthesia |
| — | `stereo` | **NONE** | — | sight |
| — | `sustainedPress` | **PARTIAL** | — | keyControl |
| — | `tracking` | **PARTIAL** | — | focus |
| — | `trackingDuration` | **PARTIAL** | 4 min | tracking |

**Not recorded: 37 of 56 properties.**

- **Cannot exist** (4), because a precedence parent is NONE: `vibrationDetection`, `hapticLanguageSet`, `readTactileSign`, `writeTactileSet`.

- **Not of interest** (33), because no precedence parent is PARTIAL: `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, `intensityHigh`, `contrastSensitivity`, `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, and 21 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### deafblind

*Signs ASL fluently and receives it hand-over-hand. Reads Braille and the two-handed manual alphabet. Full touch, kinaesthesia and motor control. Congenitally Deaf with progressive vision loss in adult life.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 16

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **NONE** | — | None |
| — | `sight` | **NONE** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `hapticLanguageSet` | **PARTIAL** | Braille, DeafblindManual, PrintOnPalm | language, touch |
| — | `readAudioText` | **NONE** | — | hearing, language |
| — | `manualStability` | **FULL** | — | None |
| — | `readFontText` | **NONE** | — | sight, language |
| — | `pointerControl` | **FULL** | — | None |
| — | `signLanguageSet` | **PARTIAL** | ASL | language |
| — | `readSignText` | **NONE** | — | sight, signLanguageSet |
| — | `readTactileSign` | **FULL** | — | touch, signLanguageSet |
| — | `vibrationDetection` | **PARTIAL** | 85 % | touch |
| — | `writeSignSet` | **PARTIAL** | Visual, Tactile | signLanguageSet, manualStability, kinaesthesia |
| — | `writeTactileSet` | **PARTIAL** | Braille, DeafblindManual, PrintOnPalm | hapticLanguageSet, manualStability, touch |

**Not recorded: 40 of 56 properties.**

- **Cannot exist** (21), because a precedence parent is NONE: `stereo`, `focus`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, `intensityHigh`, `contrastSensitivity`, `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, `elevationResolution`, `concurrentStreams`, `listeningDuration`, `gazeControl`, `minReadFontSizeForFont`, `intelligibleVoicePitch`, `minInterWordGap`.

- **Not of interest** (19), because no precedence parent is PARTIAL: `focusDuration`, `tracking`, `trackingDuration`, `kinaesthesia`, `switchSites`, `activationTiming`, `headControl`, `breathControl`, `gazeAccuracy`, `dwellTolerance`, `inputDuration`, `minTargetSize`, and 7 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### deafened-notch

*Hears below 3 kHz and above 6 kHz with both ears, and places sound reasonably well. Follows speech with longer gaps between words and does better with higher-pitched voices. Works by sight and sound rather than by feel, using large targets that need to be larger still in the cold.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 19

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **PARTIAL** | — | None |
| — | `binauralHearing` | **PARTIAL** | 20–3000, 6000–12000 | hearing |
| — | `azimuthResolution` | **PARTIAL** | 20 deg | hearing, binauralHearing |
| — | `sight` | **FULL** | — | None |
| — | `concurrentStreams` | **PARTIAL** | 2 streams | hearing |
| — | `elevationResolution` | **PARTIAL** | 30 deg | hearing |
| — | `language` | **FULL** | — | None |
| — | `touch` | **NONE** | — | None |
| — | `readAudioText` | **PARTIAL** | — | hearing, language |
| — | `intelligibleVoicePitch` | **PARTIAL** | 165–300 | readAudioText |
| — | `listeningDuration` | **PARTIAL** | 25 min | hearing |
| — | `manualStability` | **PARTIAL** | 55 % | None |
| — | `minInterWordGap` | **PARTIAL** | 260 ms | readAudioText |
| — | `pointerControl` | **PARTIAL** | — | None |
| `targetSizeWarm` | `minTargetSize` | **PARTIAL** | 12 mm | pointerControl, manualStability, kinaesthesia |
| — | `minTargetSize` | **PARTIAL** | *derived — see below* | pointerControl, manualStability, kinaesthesia |
| — | `usableFrequencyRange` | **PARTIAL** | 20–3000, 6000–12000 | hearing |
| — | `vibrationDetection` | **NONE** | — | touch |

**Not recorded: 38 of 56 properties.**

- **Cannot exist** (3), because a precedence parent is NONE: `hapticLanguageSet`, `readTactileSign`, `writeTactileSet`.

- **Not of interest** (35), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 23 more.

#### Functionally dependent settings

Marked **(M)** for mathematical dependence, per OOA96 §2.3: *"given values of the
attributes in X, the value of Y can be determined by a formula or algorithm"*. The
model requires each one to cite its formula.

| Setting (M) | Reads | External influences | Formula |
|---|---|---|---|
| `minTargetSize` | `targetSizeWarm` | `ambientTemperature` | WARM: targetSizeWarm. COLD: targetSizeWarm x 1.6, rounded, clamped to 1..40 mm. Vibration white finger blanches and numbs further in cold, so the same hand needs a larger target outdoors in winter than indoors. |

**Resolved against `ambientTemperature`:**

| `ambientTemperature` | `minTargetSize` |
|---|---|
| COLD | 19 |
| WARM | 12 |

One profile, two answers, no duplicated context. Access for All would need two
whole `<context>` blocks to say this, which is the duplication the paper's §3
criticises.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### second-language

*Native Punjabi speaker, fluent listener and reader of English, conversational in speaking and writing it. Full sight, hearing, touch and motor control. Understood by most listeners; understood by machines less reliably.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 12

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `knownLanguages` | **PARTIAL** | **pa** — listening native, speaking native, reading fluent, writing conversational; **en-CA** — listening fluent, speaking conversational, reading fluent, writing conversational | language |
| — | `manualStability` | **FULL** | — | None |
| — | `readFontText` | **PARTIAL** | — | sight, language |
| — | `pointerControl` | **FULL** | — | None |
| — | `speech` | **FULL** | — | None |
| — | `speechIntelligibility` | **PARTIAL** | most listeners | speech |
| — | `speechRecognisedByMachine` | **PARTIAL** | with frequent corrections | speech |

**Not recorded: 44 of 56 properties.**

- **Not of interest** (44), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 32 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### switch-scanning

*Full sight, hearing and language. Operates one switch reliably from a single body site, and needs a slow scan to meet it. Speaks, and is understood by people who know him. Works in stretches of about twenty minutes.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 14

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **PARTIAL** | — | None |
| — | `activationTiming` | **PARTIAL** | needs a slow scan | keyControl |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `inputDuration` | **PARTIAL** | 20 min | None |
| — | `manualStability` | **PARTIAL** | 15 % | None |
| — | `pointerControl` | **NONE** | — | None |
| — | `speech` | **PARTIAL** | — | None |
| — | `speechIntelligibility` | **PARTIAL** | familiar listeners | speech |
| — | `speechRecognisedByMachine` | **NONE** | — | speech |
| — | `sustainedPress` | **PARTIAL** | — | keyControl |
| — | `switchSites` | **PARTIAL** | 1 sites | keyControl |

**Not recorded: 42 of 56 properties.**

- **Cannot exist** (1), because a precedence parent is NONE: `minTargetSize`.

- **Not of interest** (41), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 29 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### eye-gaze-als

*Sees and hears perfectly, reads and writes fluently, and communicates entirely by gaze — holding a fixation for about two and a half seconds to select, within about three degrees. Full sensation throughout. Works in stretches of about fifteen minutes.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 14

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **NONE** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `gazeControl` | **PARTIAL** | — | sight |
| — | `dwellTolerance` | **PARTIAL** | 2500 ms | gazeControl |
| — | `gazeAccuracy` | **PARTIAL** | 3 deg | gazeControl |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `headControl` | **NONE** | — | None |
| — | `inputDuration` | **PARTIAL** | 15 min | None |
| — | `knownLanguages` | **PARTIAL** | **en-CA** — listening native, speaking none, reading native, writing native | language |
| — | `manualStability` | **NONE** | — | None |
| — | `pointerControl` | **NONE** | — | None |
| — | `speech` | **NONE** | — | None |

**Not recorded: 42 of 56 properties.**

- **Cannot exist** (11), because a precedence parent is NONE: `switchSites`, `activationTiming`, `minTargetSize`, `sustainedPress`, `minKeyRepeatDelay`, `speechIntelligibility`, `speechRecognisedByMachine`, `minReadFontSizeForFont`, `writeFontSet`, `writeSignSet`, `writeTactileSet`.

- **Not of interest** (31), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 19 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### sip-and-puff

*Full sight, hearing, language and speech. Points with head position and selects with four distinguishable breath signals. Feels the head and neck normally and the hands not at all. Works in stretches of about forty-five minutes.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 12

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **NONE** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `breathControl` | **PARTIAL** | 4 signals | None |
| — | `sight` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **NONE** | — | None |
| — | `headControl` | **FULL** | — | None |
| — | `inputDuration` | **PARTIAL** | 45 min | None |
| — | `kinaesthesia` | **NONE** | — | None |
| — | `manualStability` | **NONE** | — | None |
| — | `pointerControl` | **NONE** | — | None |
| — | `speech` | **FULL** | — | None |

**Not recorded: 44 of 56 properties.**

- **Cannot exist** (12), because a precedence parent is NONE: `vibrationDetection`, `switchSites`, `activationTiming`, `minTargetSize`, `sustainedPress`, `minKeyRepeatDelay`, `hapticLanguageSet`, `readTactileSign`, `minReadFontSizeForFont`, `writeFontSet`, `writeSignSet`, `writeTactileSet`.

- **Not of interest** (32), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 20 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### switch-scanning-with-buddy

*Two people playing one game. The primary sees, hears, understands and decides; the assistant supplies hands and timing. Together they meet a falling piece that neither the primary alone nor any control scheme could.*

**Basis:** exemplar — stands in for lived experience, not derived from any person — a practice, not a person  
**Entity kind:** group · **Settings recorded:** 14

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `activationTiming` | **PARTIAL** | needs a slow scan | keyControl |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `inputDuration` | **PARTIAL** | 20 min | None |
| — | `manualStability` | **FULL** | — | None |
| — | `pointerControl` | **FULL** | — | None |
| — | `speech` | **PARTIAL** | — | None |
| — | `speechIntelligibility` | **PARTIAL** | familiar listeners | speech |
| — | `speechRecognisedByMachine` | **NONE** | — | speech |
| — | `sustainedPress` | **PARTIAL** | — | keyControl |
| — | `switchSites` | **PARTIAL** | 1 sites | keyControl |

**Not recorded: 42 of 56 properties.**

- **Not of interest** (42), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 30 more.

#### Who supplies what

Members: `switch-scanning` + `reference`. Primary: `switch-scanning` — whose game it is.

**The assistant lends** (motor capability only — see below):

| Setting | Pair | Why |
|---|---|---|
| `pointerControl` | **FULL** | assistant FULL vs primary NONE |
| `keyControl` | **FULL** | assistant FULL vs primary PARTIAL |
| `manualStability` | **FULL** | assistant FULL vs primary PARTIAL |

**Superseded** — true of the primary alone, and a renderer must not act on them
for the pair, because the assistant supplies the capability they hang beneath:

| Setting | Superseded by |
|---|---|
| `switchSites` | `keyControl` |
| `activationTiming` | `keyControl` |
| `sustainedPress` | `keyControl` |

**What a co-pilot cannot lend.** Motor capability delegates cleanly — the game
cannot tell whose finger arrived. Perception does not, at least not in real time: a
buddy describing a falling piece is always describing where it *was*. And
comprehension must not, because a buddy who decides what to do is not assisting,
they are playing.

So co-piloting rescues this player from a real-time game and would do nothing
whatever for `deafblind`.

---

## All profiles compared

Only properties recorded in at least one profile appear. A blank cell means the
property is not recorded for that profile — either because a precedence parent is
NONE, or because no parent is PARTIAL and so the question does not arise.

| Property | reference | blindSinceBirth | lowVisionContrast | lowVisionColour | keyboardOnly | handTremor | deaf | deafenedAsymmetric | multipleSclerosis | deafBlind | deafenedNotch | secondLanguage | switchScanning | eyeGazeALS | sipAndPuff | switchScanningWithBuddy |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `keyControl` | FULL | FULL | FULL | FULL | FULL | PARTIAL | FULL | FULL | PARTIAL | FULL | FULL | FULL | PARTIAL | NONE | NONE | FULL |
| `activationTiming` |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL needs a slow scan |  |  | PARTIAL needs a slow scan |
| `hearing` | FULL | FULL | FULL | FULL | FULL | FULL | NONE | PARTIAL | FULL | NONE | PARTIAL | FULL | FULL | FULL | FULL | FULL |
| `binauralHearing` |  |  |  |  |  |  |  | PARTIAL 800–8000 |  |  | PARTIAL 20–3000, 6000–12000 |  |  |  |  |  |
| `azimuthResolution` |  |  |  |  |  |  |  | PARTIAL 45 deg |  |  | PARTIAL 20 deg |  |  |  |  |  |
| `breathControl` |  |  |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 4 signals |  |
| `sight` | FULL | NONE | PARTIAL | PARTIAL | FULL | FULL | FULL | FULL | PARTIAL | NONE | FULL | FULL | FULL | FULL | FULL | FULL |
| `colorHigh` |  |  | FULL | PARTIAL 80 % |  |  |  |  |  |  |  |  |  |  |  |  |
| `colorLow` |  |  | FULL | PARTIAL 40 % |  |  |  |  |  |  |  |  |  |  |  |  |
| `colorMedium` |  |  | FULL | PARTIAL 25 % |  |  |  |  |  |  |  |  |  |  |  |  |
| `concurrentStreams` |  |  |  |  |  |  |  | PARTIAL 2 streams |  |  | PARTIAL 2 streams |  |  |  |  |  |
| `contrastSensitivity` |  |  | PARTIAL 30 % | FULL |  |  |  |  |  |  |  |  |  |  |  |  |
| `gazeControl` |  |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL |  |  |
| `dwellTolerance` |  |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 2500 ms |  |  |
| `elevationResolution` |  |  |  |  |  |  |  | PARTIAL 40 deg |  |  | PARTIAL 30 deg |  |  |  |  |  |
| `focus` |  |  | PARTIAL |  |  |  |  |  | PARTIAL |  |  |  |  |  |  |  |
| `focusDuration` |  |  | PARTIAL 25 min |  |  |  |  |  | PARTIAL 8 min |  |  |  |  |  |  |  |
| `gazeAccuracy` |  |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 3 deg |  |  |
| `language` | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL |
| `touch` | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | NONE | FULL | NONE | FULL | FULL | FULL | NONE | FULL |
| `hapticLanguageSet` |  | PARTIAL Braille |  |  |  |  |  |  |  | PARTIAL Braille, DeafblindManual, PrintOnPalm |  |  |  |  |  |  |
| `headControl` |  |  |  |  |  |  |  |  |  |  |  |  |  | NONE | FULL |  |
| `inputDuration` |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 20 min | PARTIAL 15 min | PARTIAL 45 min | PARTIAL 20 min |
| `readAudioText` |  |  |  |  |  |  | NONE | PARTIAL |  | NONE | PARTIAL |  |  |  |  |  |
| `intelligibleVoicePitch` |  |  |  |  |  |  |  | PARTIAL 165–300 |  |  | PARTIAL 165–300 |  |  |  |  |  |
| `intensityHigh` |  |  | PARTIAL 45 % |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `intensityLow` |  |  | PARTIAL 45 % |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `intensityMedium` |  |  | PARTIAL 45 % | PARTIAL 70 % |  |  |  |  |  |  |  |  |  |  |  |  |
| `kinaesthesia` |  |  |  |  |  |  |  |  | PARTIAL 25 % |  |  |  |  |  | NONE |  |
| `knownLanguages` |  |  |  |  |  |  | PARTIAL **en-CA** — listening none, speaking basic, reading fluent, writing fluent |  |  |  |  | PARTIAL **pa** — listening native, speaking native, reading fluent, writing conversational; **en-CA** — listening fluent, speaking conversational, reading fluent, writing conversational |  | PARTIAL **en-CA** — listening native, speaking none, reading native, writing native |  |  |
| `listeningDuration` |  |  |  |  |  |  |  | PARTIAL 20 min | PARTIAL 15 min |  | PARTIAL 25 min |  |  |  |  |  |
| `manualStability` | FULL | FULL | FULL | FULL | FULL | PARTIAL 35 % | FULL | FULL | PARTIAL 30 % | FULL | PARTIAL 55 % | FULL | PARTIAL 15 % | NONE | NONE | FULL |
| `minInterWordGap` |  |  |  |  |  |  |  | PARTIAL 220 ms |  |  | PARTIAL 260 ms |  |  |  |  |  |
| `minKeyRepeatDelay` |  |  |  |  |  | PARTIAL 900 ms |  |  | PARTIAL 1200 ms |  |  |  |  |  |  |  |
| `readFontText` |  | NONE | PARTIAL |  |  |  |  |  | PARTIAL | NONE |  | PARTIAL |  |  |  |  |
| `minReadFontSizeForFont` |  |  | PARTIAL size 18, font system-sans |  |  | PARTIAL size 12, font system-sans; PARTIAL *(M)* |  |  | PARTIAL size 20, font system-sans |  |  |  |  |  |  |  |
| `pointerControl` | FULL | FULL | FULL | FULL | NONE | PARTIAL | FULL | FULL | PARTIAL | FULL | PARTIAL | FULL | NONE | NONE | NONE | FULL |
| `minTargetSize` |  |  |  |  |  | PARTIAL 18 mm |  |  | PARTIAL 28 mm |  | PARTIAL 12 mm; PARTIAL *(M)* |  |  |  |  |  |
| `signLanguageSet` |  |  |  |  |  |  | PARTIAL ASL |  |  | PARTIAL ASL |  |  |  |  |  |  |
| `readSignText` |  |  |  |  |  |  | FULL |  |  | NONE |  |  |  |  |  |  |
| `readTactileSign` |  |  |  |  |  |  |  |  |  | FULL |  |  |  |  |  |  |
| `speech` |  |  |  |  |  |  | PARTIAL |  |  |  |  | FULL | PARTIAL | NONE | FULL | PARTIAL |
| `speechIntelligibility` |  |  |  |  |  |  | PARTIAL familiar listeners |  |  |  |  | PARTIAL most listeners | PARTIAL familiar listeners |  |  | PARTIAL familiar listeners |
| `speechRecognisedByMachine` |  |  |  |  |  |  | NONE |  |  |  |  | PARTIAL with frequent corrections | NONE |  |  | NONE |
| `stereo` |  |  |  |  |  |  |  |  | NONE |  |  |  |  |  |  |  |
| `sustainedPress` |  |  |  |  |  | PARTIAL |  |  | PARTIAL |  |  |  | PARTIAL |  |  | PARTIAL |
| `switchSites` |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 1 sites |  |  | PARTIAL 1 sites |
| `tracking` |  |  | PARTIAL |  |  |  |  |  | PARTIAL |  |  |  |  |  |  |  |
| `trackingDuration` |  |  | PARTIAL 12 min |  |  |  |  |  | PARTIAL 4 min |  |  |  |  |  |  |  |
| `usableFrequencyRange` |  |  |  |  |  |  |  | PARTIAL 20–8000 |  |  | PARTIAL 20–3000, 6000–12000 |  |  |  |  |  |
| `vibrationDetection` |  |  |  |  |  |  |  |  |  | PARTIAL 85 % | NONE |  |  |  |  |  |
| `writeFontSet` |  |  |  |  | PARTIAL SELECT |  |  |  |  |  |  |  |  |  |  |  |
| `writeSignSet` |  |  |  |  |  |  | PARTIAL Visual |  |  | PARTIAL Visual, Tactile |  |  |  |  |  |  |
| `writeTactileSet` |  |  |  |  |  |  |  |  |  | PARTIAL Braille, DeafblindManual, PrintOnPalm |  |  |  |  |  |  |

---

## What is still missing

- **No sonic exemplar.** The demonstrator is audio-first, and the composite
  frequency-range-with-gaps is implemented and tested — notched loss, usable below
  2 kHz and above 6 kHz — but no profile uses it. A profile with high-frequency
  loss would exercise the sonic ontology the way `hand-tremor` exercises the motor
  one.
- **No Preference Model.** Figure 4 of the paper is not built. Capability and
  preference are deliberately separate models, and only the first two are here.
- **The Adaptation Model is partial.** Profiles are differences from a reference,
  which is the paper's §8 mechanism, but Event Triggers, Instance Sequences and
  Sequence No (Figure 5) are not implemented, so profiles cannot yet be composed in
  a declared order under a trigger.
- **Lived experience.** These are stand-ins. Everything above is a hypothesis about
  what would matter, held until someone can say otherwise.

