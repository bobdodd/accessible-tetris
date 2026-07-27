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
| `azimuthResolution` | 1–180 deg | hearing | sonic | MY CHOICE. Smallest left-right angular difference the user can reliably distinguish. |
| `concurrentStreams` | 1–8 streams | hearing | sonic | MY CHOICE. How many simultaneous audio streams the user can attend to and still separate. The sonic analogue of Table 3's tracking. |
| `elevationResolution` | 1–180 deg | hearing | sonic | MY CHOICE. Smallest up-down angular difference the user can reliably distinguish. Typically much coarser than azimuth for most listeners. |
| `listeningDuration` | 1–480 min | hearing | sonic | MY CHOICE. Length of time the user can attend to a dense soundscape before experiencing fatigue. The sonic analogue of trackingDuration. |
| `usableFrequencyRange` | collection of range in Hz, lowestToHighest | hearing | sonic | The usable audio frequency range, as a collection of bands with gaps between them. |

### Template: input

MY CHOICE. Motor capability: what the user can do to the device.

| Property | Values (PARTIAL measurement) | Parent | Ontology | Description |
|---|---|---|---|---|
| `keyControl` | — | None | motor | MY CHOICE. Can the user operate discrete keys or switches? |
| `manualStability` | 1–99 % | None | motor | MY CHOICE. Steadiness of the user's hand under load. FULL is no tremor; PARTIAL carries the percentage. |
| `minKeyRepeatDelay` | 1–2000 ms | keyControl, manualStability | motor | MY CHOICE. Minimum delay before a held key should repeat, below which tremor produces unintended repeats. |
| `pointerControl` | — | None | motor | MY CHOICE. Can the user operate a continuous pointing device? NONE is the capability usually described as 'keyboard only' — and describing it as capab… |
| `minTargetSize` | 1–40 mm | pointerControl, manualStability | motor | MY CHOICE. Smallest target the user can reliably acquire with a pointing device. |
| `sustainedPress` | — | keyControl | motor | MY CHOICE. Can the user hold a key down, or chord two keys? NONE is the capability that sticky-keys exists to answer. |

### Template: reading

Table 4 — language-based properties.

| Property | Values (PARTIAL measurement) | Parent | Ontology | Description |
|---|---|---|---|---|
| `language` | — | None | language | Can the user understand language (in any medium)? |
| `hapticLanguageSet` | Braille, HapticMap (one or more) | language, touch | language | Tactile based languages understood by the user. Table 4 gives the parent as Language; MY CHOICE adds touch, since a tactile language depends on touch. |
| `readAudioText` | — | hearing, language | language | MY CHOICE (supplying a parent Table 4 names but does not define). Can the user understand spoken text? |
| `minInterWordGap` | 1–2000 ms | readAudioText | language | Minimum required gap in milliseconds between words required for the user to understand the spoken word. |
| `readFontText` | — | sight, language | language | MY CHOICE (supplying a parent Table 4 names but does not define). |
| `minReadFontSizeForFont` | size: 4–96 pt + font: text | readFontText, manualStability | language | Minimum readable font size for user, in points and per font, when presented on a 1024x768 pixel 15" screen. |
| `writeFontSet` | CURSIVE, BLOCK, SELECT (one or more) | language, keyControl | language | Modes some form of writing text. SELECT means some form of technology e.g. keyboard, scanning, eye tracking etc. |

### Subject ontologies

*"Subject ontologies are disjoint, so individual properties exist in exactly one
ontology."* Precedence, by contrast, crosses them freely — `readFontText` has
parents in both `visual` and `language`, mirroring Table 4's own `readSignText`
with *"sight + signLanguageSet"*.

| Ontology | Nesbitt design space | Properties |
|---|---|---|
| visual | yes | 15 |
| sonic | yes | 6 |
| haptic | yes | 2 |
| motor | no | 6 |
| language | no | 7 |

---

## The profiles

### reference

*Baseline with no reported limitation. Exists to be differenced against.*

**Basis:** exemplar — not derived from any person  
**Entity kind:** user · **Settings recorded:** 7

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `keyControl` | **FULL** | — | None |
| — | `manualStability` | **FULL** | — | None |
| — | `pointerControl` | **FULL** | — | None |

**Not recorded: 29 of 36 properties.**

- **Not of interest** (29), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 17 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### blind-since-birth

*No usable sight from birth. No other reported limitation.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 9

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **NONE** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `hapticLanguageSet` | **PARTIAL** | Braille | language, touch |
| — | `keyControl` | **FULL** | — | None |
| — | `manualStability` | **FULL** | — | None |
| — | `readFontText` | **NONE** | — | sight, language |
| — | `pointerControl` | **FULL** | — | None |

**Not recorded: 27 of 36 properties.**

- **Cannot exist** (12), because a precedence parent is NONE: `stereo`, `focus`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, `intensityHigh`, `contrastSensitivity`, `minReadFontSizeForFont`.

- **Not of interest** (15), because no precedence parent is PARTIAL: `focusDuration`, `tracking`, `trackingDuration`, `usableFrequencyRange`, `azimuthResolution`, `elevationResolution`, `concurrentStreams`, `listeningDuration`, `vibrationDetection`, `minTargetSize`, `sustainedPress`, `minKeyRepeatDelay`, and 3 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### low-vision-contrast

*Partial sight limited by contrast discrimination. Colour perception intact.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 20

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
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
| — | `keyControl` | **FULL** | — | None |
| — | `manualStability` | **FULL** | — | None |
| — | `readFontText` | **PARTIAL** | — | sight, language |
| — | `minReadFontSizeForFont` | **PARTIAL** | size 18, font system-sans | readFontText, manualStability |
| — | `pointerControl` | **FULL** | — | None |
| — | `tracking` | **PARTIAL** | — | focus |
| — | `trackingDuration` | **PARTIAL** | 12 min | tracking |

**Not recorded: 16 of 36 properties.**

- **Not of interest** (16), because no precedence parent is PARTIAL: `stereo`, `viewRectangle`, `nonViewRectangle`, `usableFrequencyRange`, `azimuthResolution`, `elevationResolution`, `concurrentStreams`, `listeningDuration`, `vibrationDetection`, `minTargetSize`, `sustainedPress`, `minKeyRepeatDelay`, and 4 more.

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
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **PARTIAL** | — | None |
| — | `colorHigh` | **PARTIAL** | 80 % | sight |
| — | `colorLow` | **PARTIAL** | 40 % | sight |
| — | `colorMedium` | **PARTIAL** | 25 % | sight |
| — | `contrastSensitivity` | **FULL** | — | sight |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `intensityMedium` | **PARTIAL** | 70 % | sight |
| — | `keyControl` | **FULL** | — | None |
| — | `manualStability` | **FULL** | — | None |
| — | `pointerControl` | **FULL** | — | None |

**Not recorded: 24 of 36 properties.**

- **Not of interest** (24), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `intensityLow`, `intensityHigh`, `usableFrequencyRange`, `azimuthResolution`, `elevationResolution`, and 12 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### keyboard-only

*No usable continuous pointing device. Discrete key control intact.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 8

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `keyControl` | **FULL** | — | None |
| — | `manualStability` | **FULL** | — | None |
| — | `pointerControl` | **NONE** | — | None |
| — | `writeFontSet` | **PARTIAL** | SELECT | language, keyControl |

**Not recorded: 28 of 36 properties.**

- **Cannot exist** (1), because a precedence parent is NONE: `minTargetSize`.

- **Not of interest** (27), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 15 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `manualStability` | — |

### hand-tremor

*Tremor under load. Sight and hearing unimpaired; the limitation is stability, and it reaches into reading whenever the display is not mounted.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 12

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `keyControl` | **PARTIAL** | — | None |
| — | `manualStability` | **PARTIAL** | 35 % | None |
| — | `minKeyRepeatDelay` | **PARTIAL** | 900 ms | keyControl, manualStability |
| `fontSizeSeated` | `minReadFontSizeForFont` | **PARTIAL** | size 12, font system-sans | readFontText, manualStability |
| — | `minReadFontSizeForFont` | **PARTIAL** | *derived — see below* | readFontText, manualStability |
| — | `pointerControl` | **PARTIAL** | — | None |
| — | `minTargetSize` | **PARTIAL** | 18 mm | pointerControl, manualStability |
| — | `sustainedPress` | **PARTIAL** | — | keyControl |

**Not recorded: 25 of 36 properties.**

- **Not of interest** (25), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 13 more.

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

---

## All profiles compared

Only properties recorded in at least one profile appear. A blank cell means the
property is not recorded for that profile — either because a precedence parent is
NONE, or because no parent is PARTIAL and so the question does not arise.

| Property | reference | blindSinceBirth | lowVisionContrast | lowVisionColour | keyboardOnly | handTremor |
|---|---|---|---|---|---|---|
| `hearing` | FULL | FULL | FULL | FULL | FULL | FULL |
| `sight` | FULL | NONE | PARTIAL | PARTIAL | FULL | FULL |
| `colorHigh` |  |  | FULL | PARTIAL 80 % |  |  |
| `colorLow` |  |  | FULL | PARTIAL 40 % |  |  |
| `colorMedium` |  |  | FULL | PARTIAL 25 % |  |  |
| `contrastSensitivity` |  |  | PARTIAL 30 % | FULL |  |  |
| `focus` |  |  | PARTIAL |  |  |  |
| `focusDuration` |  |  | PARTIAL 25 min |  |  |  |
| `language` | FULL | FULL | FULL | FULL | FULL | FULL |
| `touch` | FULL | FULL | FULL | FULL | FULL | FULL |
| `hapticLanguageSet` |  | PARTIAL Braille |  |  |  |  |
| `intensityHigh` |  |  | PARTIAL 45 % |  |  |  |
| `intensityLow` |  |  | PARTIAL 45 % |  |  |  |
| `intensityMedium` |  |  | PARTIAL 45 % | PARTIAL 70 % |  |  |
| `keyControl` | FULL | FULL | FULL | FULL | FULL | PARTIAL |
| `manualStability` | FULL | FULL | FULL | FULL | FULL | PARTIAL 35 % |
| `minKeyRepeatDelay` |  |  |  |  |  | PARTIAL 900 ms |
| `readFontText` |  | NONE | PARTIAL |  |  |  |
| `minReadFontSizeForFont` |  |  | PARTIAL size 18, font system-sans |  |  | PARTIAL size 12, font system-sans; PARTIAL *(M)* |
| `pointerControl` | FULL | FULL | FULL | FULL | NONE | PARTIAL |
| `minTargetSize` |  |  |  |  |  | PARTIAL 18 mm |
| `sustainedPress` |  |  |  |  |  | PARTIAL |
| `tracking` |  |  | PARTIAL |  |  |  |
| `trackingDuration` |  |  | PARTIAL 12 min |  |  |  |
| `writeFontSet` |  |  |  |  | PARTIAL SELECT |  |

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

