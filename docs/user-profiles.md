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

| Property | Values (PARTIAL measurement) | Parent | What it decides |
|---|---|---|---|
| `sight` | — | None | whether to render visually at all |
| `focus` | — | sight | whether detail, depth and motion may carry meaning — *with `tracking`, `stereo`* |
| `focusDuration` | 1–480 min | focus | how long a session may run before a break is offered — *with `trackingDuration`, `listeningDuration`, `inputDuration`* |
| `nonViewRectangle` | x: 0–8192 px + y: 0–8192 px + w: 1–8192 px + h: 1–8192 px | sight | where on screen content may be placed — *with `viewRectangle`* |
| `stereo` | — | sight | whether detail, depth and motion may carry meaning — *with `focus`, `tracking`* |
| `tracking` | — | focus | whether detail, depth and motion may carry meaning — *with `focus`, `stereo`* |
| `trackingDuration` | 1–480 min | tracking | how long a session may run before a break is offered — *with `focusDuration`, `listeningDuration`, `inputDuration`* |
| `viewRectangle` | x: 0–8192 px + y: 0–8192 px + w: 1–8192 px + h: 1–8192 px | sight | where on screen content may be placed — *with `nonViewRectangle`* |

### Template: colour

Table 2 — capability model of colour-blindness.

| Property | Values (PARTIAL measurement) | Parent | What it decides |
|---|---|---|---|
| `sight` | — | None | whether to render visually at all |
| `colorHigh` | 1–99 % | sight | the visual palette — which hues and tones may carry meaning — *with `colorLow`, `colorMedium`, `intensityLow`, `intensityMedium`, `intensityHigh`, `contrastSensitivity`* |
| `colorLow` | 1–99 % | sight | the visual palette — which hues and tones may carry meaning — *with `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, `intensityHigh`, `contrastSensitivity`* |
| `colorMedium` | 1–99 % | sight | the visual palette — which hues and tones may carry meaning — *with `colorLow`, `colorHigh`, `intensityLow`, `intensityMedium`, `intensityHigh`, `contrastSensitivity`* |
| `contrastSensitivity` | 1–99 % | sight | the visual palette — which hues and tones may carry meaning — *with `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, `intensityHigh`* |
| `intensityHigh` | 1–99 % | sight | the visual palette — which hues and tones may carry meaning — *with `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, `contrastSensitivity`* |
| `intensityLow` | 1–99 % | sight | the visual palette — which hues and tones may carry meaning — *with `colorLow`, `colorMedium`, `colorHigh`, `intensityMedium`, `intensityHigh`, `contrastSensitivity`* |
| `intensityMedium` | 1–99 % | sight | the visual palette — which hues and tones may carry meaning — *with `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityHigh`, `contrastSensitivity`* |

### Template: listening

MY CHOICE. Sonic capability, the design space this demonstrator leans on.

| Property | Values (PARTIAL measurement) | Parent | What it decides |
|---|---|---|---|
| `hearing` | — | None | whether to render aurally at all |
| `binauralHearing` | collection of range in Hz, lowestToHighest | hearing | how a soundscape may be spatialised — *with `azimuthResolution`, `elevationResolution`* |
| `azimuthResolution` | 1–180 deg | hearing, binauralHearing | how a soundscape may be spatialised — *with `elevationResolution`, `binauralHearing`* |
| `concurrentStreams` | 1–8 streams | hearing | how many sounds may play at once |
| `elevationResolution` | 1–180 deg | hearing | how a soundscape may be spatialised — *with `azimuthResolution`, `binauralHearing`* |
| `listeningDuration` | 1–480 min | hearing | how long a session may run before a break is offered — *with `focusDuration`, `trackingDuration`, `inputDuration`* |
| `usableFrequencyRange` | collection of range in Hz, lowestToHighest | hearing | which frequencies a cue may be placed at |

### Template: input

MY CHOICE. Motor capability: what the user can do to the device.

| Property | Values (PARTIAL measurement) | Parent | What it decides |
|---|---|---|---|
| `keyControl` | head, face, mouth, trunk, arms, hands, fingertips, legs, feet, toes (one or more) | None | which input channels are available, and from which body site — *with `pointerControl`, `headControl`, `gazeControl`, `breathControl`, `speech`* |
| `effectorStability` | 1–99 % | None | the smallest a control may be drawn — *with `minTargetSize`, `gazeAccuracy`* |
| `headControl` | — | None | which input channels are available, and from which body site — *with `pointerControl`, `keyControl`, `gazeControl`, `breathControl`, `speech`* |
| `inputDuration` | 1–480 min | None | how long a session may run before a break is offered — *with `focusDuration`, `trackingDuration`, `listeningDuration`* |
| `kinaesthesia` | 1–99 % | None | whether the user needs visual confirmation of where their effector is |
| `minKeyRepeatDelay` | 1–2000 ms | keyControl, effectorStability | how long a selection must be held, and how long before it repeats — *with `sustainedPress`, `dwellTolerance`* |
| `pointerControl` | head, face, mouth, trunk, arms, hands, fingertips, legs, feet, toes (one or more) | None | which input channels are available, and from which body site — *with `keyControl`, `headControl`, `gazeControl`, `breathControl`, `speech`* |
| `minTargetSize` | 1–40 mm | pointerControl, effectorStability, kinaesthesia | the smallest a control may be drawn — *with `effectorStability`, `gazeAccuracy`* |
| `speech` | — | None | which input channels are available, and from which body site — *with `pointerControl`, `keyControl`, `headControl`, `gazeControl`, `breathControl`* |
| `sustainedPress` | — | keyControl | how long a selection must be held, and how long before it repeats — *with `minKeyRepeatDelay`, `dwellTolerance`* |

### Template: alternativeAccess

MY CHOICE. Switch, breath, head and gaze access — the channels used when a hand on a pointing device is not available. Overlaps `input` deliberately: the same Property may appear in many templates.

| Property | Values (PARTIAL measurement) | Parent | What it decides |
|---|---|---|---|
| `keyControl` | head, face, mouth, trunk, arms, hands, fingertips, legs, feet, toes (one or more) | None | which input channels are available, and from which body site — *with `pointerControl`, `headControl`, `gazeControl`, `breathControl`, `speech`* |
| `activationTiming` | cannot reliably time a moving target, needs a slow scan, needs a moderate scan, any scan rate | keyControl | whether scanning must be timed, and how fast it may advance — *with `switchSites`* |
| `breathControl` | 1–4 signals | None | which input channels are available, and from which body site — *with `pointerControl`, `keyControl`, `headControl`, `gazeControl`, `speech`* |
| `gazeControl` | — | sight | which input channels are available, and from which body site — *with `pointerControl`, `keyControl`, `headControl`, `breathControl`, `speech`* |
| `dwellTolerance` | 100–4000 ms | gazeControl | how long a selection must be held, and how long before it repeats — *with `sustainedPress`, `minKeyRepeatDelay`* |
| `gazeAccuracy` | 1–15 deg | gazeControl | the smallest a control may be drawn — *with `minTargetSize`, `effectorStability`* |
| `headControl` | — | None | which input channels are available, and from which body site — *with `pointerControl`, `keyControl`, `gazeControl`, `breathControl`, `speech`* |
| `inputDuration` | 1–480 min | None | how long a session may run before a break is offered — *with `focusDuration`, `trackingDuration`, `listeningDuration`* |
| `simultaneousContacts` | 1–10 points | None | whether chording, multi-touch or hold-and-press may be required — *with `sustainedPress`* |
| `sustainedPress` | — | keyControl | how long a selection must be held, and how long before it repeats — *with `minKeyRepeatDelay`, `dwellTolerance`* |
| `switchSites` | 1–8 sites | keyControl | whether scanning must be timed, and how fast it may advance — *with `activationTiming`* |
| `textEntryRate` | 1–120 wpm | None | how long to allow for text entry, and whether to offer it at all — *with `writeFontSet`, `simultaneousContacts`* |

### Template: reading

Table 4 — language-based properties.

| Property | Values (PARTIAL measurement) | Parent | What it decides |
|---|---|---|---|
| `language` | — | None | whether language may be used at all |
| `hapticLanguageSet` | Braille, DeafblindManual, PrintOnPalm, BlockAlphabet, Lorm, HapticMap (one or more) | language, touch | which script or signed language to present in — *with `signLanguageSet`* |
| `readAudioText` | — | hearing, language | which channels may carry text to the user — *with `readFontText`, `readSignText`, `readTactileSign`* |
| `intelligibleVoicePitch` | range in Hz | readAudioText | how speech synthesis must be paced and voiced — *with `minInterWordGap`* |
| `knownLanguages` | collection of tag: text + listening: none, basic, conversational, fluent, native + speaking: none, basic, conversational, fluent, native + reading: none, basic, conversational, fluent, native + writing: none, basic, conversational, fluent, native, asDeclared | language | which language to present in, and at what complexity |
| `minInterWordGap` | 1–2000 ms | readAudioText | how speech synthesis must be paced and voiced — *with `intelligibleVoicePitch`* |
| `readFontText` | — | sight, language | which channels may carry text to the user — *with `readAudioText`, `readSignText`, `readTactileSign`* |
| `minReadFontSizeForFont` | size: 4–96 pt + font: text | readFontText, effectorStability | the smallest type that may be set |
| `signLanguageSet` | ASL, LSQ, BSL, Auslan, LSF, DGS, IrishSL, MaritimeSL, SSE (one or more) | language | which script or signed language to present in — *with `hapticLanguageSet`* |
| `readSignText` | — | sight, signLanguageSet | which channels may carry text to the user — *with `readFontText`, `readAudioText`, `readTactileSign`* |
| `readTactileSign` | — | touch, signLanguageSet | which channels may carry text to the user — *with `readFontText`, `readAudioText`, `readSignText`* |
| `speechIntelligibility` | familiar listeners, with effort, familiar listeners, most listeners, any listener | speech | whether speech may be accepted as input — *with `speechRecognisedByMachine`* |
| `speechRecognisedByMachine` | only after training on this voice, with frequent corrections, with occasional corrections, reliably | speech | whether speech may be accepted as input — *with `speechIntelligibility`* |
| `writeFontSet` | CURSIVE, BLOCK, SELECT (one or more) | language, keyControl, effectorStability | which modes may accept text, sign or tactile script from the user — *with `writeSignSet`, `writeTactileSet`, `textEntryRate`* |
| `writeSignSet` | Visual, Tactile (one or more) | signLanguageSet, effectorStability, kinaesthesia | which modes may accept text, sign or tactile script from the user — *with `writeFontSet`, `writeTactileSet`* |
| `writeTactileSet` | Braille, DeafblindManual, PrintOnPalm, BlockAlphabet, Lorm (one or more) | hapticLanguageSet, effectorStability, touch | which modes may accept text, sign or tactile script from the user — *with `writeFontSet`, `writeSignSet`* |

### Template: touchSense

MY CHOICE. The haptic design space, both halves of it.

| Property | Values (PARTIAL measurement) | Parent | What it decides |
|---|---|---|---|
| `touch` | collection of site: head, face, mouth, trunk, arms, hands, fingertips, legs, feet, toes + level: none, trace, reduced, full, asDeclared | None | whether haptic feedback may be used, and where — *with `vibrationDetection`* |
| `kinaesthesia` | 1–99 % | None | whether the user needs visual confirmation of where their effector is |
| `vibrationDetection` | 1–99 % | touch | whether haptic feedback may be used, and where — *with `touch`* |

### What the model is for

Every property must name a decision some renderer, input handler or content
selector actually makes. A property that cannot name one is a medical observation
with a schema around it, and does not belong in a model of *interaction*.

**Most properties do not decide alone.** `contrastSensitivity` sets no palette by
itself; it does so with the six colour and intensity bands. The table below groups
properties by the decision they serve, so a system can ask *"what do I need in
order to set the palette"* rather than inspecting properties one at a time and
guessing which combine.

| Decision | Properties needed |
|---|---|
| how a soundscape may be spatialised | `azimuthResolution`, `binauralHearing`, `elevationResolution` |
| how long a selection must be held, and how long before it repeats | `dwellTolerance`, `minKeyRepeatDelay`, `sustainedPress` |
| how long a session may run before a break is offered | `focusDuration`, `inputDuration`, `listeningDuration`, `trackingDuration` |
| how long to allow for text entry, and whether to offer it at all | `simultaneousContacts`, `textEntryRate`, `writeFontSet` |
| how many sounds may play at once | `concurrentStreams` |
| how speech synthesis must be paced and voiced | `intelligibleVoicePitch`, `minInterWordGap` |
| the smallest a control may be drawn | `effectorStability`, `gazeAccuracy`, `minTargetSize` |
| the smallest type that may be set | `minReadFontSizeForFont` |
| the visual palette — which hues and tones may carry meaning | `colorHigh`, `colorLow`, `colorMedium`, `contrastSensitivity`, `intensityHigh`, `intensityLow`, `intensityMedium` |
| where a screen, camera or switch may be placed | `headRange` |
| where on screen content may be placed | `nonViewRectangle`, `viewRectangle` |
| whether chording, multi-touch or hold-and-press may be required | `simultaneousContacts`, `sustainedPress` |
| whether detail, depth and motion may carry meaning | `focus`, `stereo`, `tracking` |
| whether haptic feedback may be used, and where | `touch`, `vibrationDetection` |
| whether language may be used at all | `language` |
| whether scanning must be timed, and how fast it may advance | `activationTiming`, `switchSites` |
| whether speech may be accepted as input | `speechIntelligibility`, `speechRecognisedByMachine` |
| whether the user needs visual confirmation of where their effector is | `kinaesthesia` |
| whether to render aurally at all | `hearing` |
| whether to render visually at all | `sight` |
| which channels may carry text to the user | `readAudioText`, `readFontText`, `readSignText`, `readTactileSign` |
| which frequencies a cue may be placed at | `usableFrequencyRange` |
| which input channels are available, and from which body site | `breathControl`, `gazeControl`, `headControl`, `keyControl`, `pointerControl`, `speech` |
| which language to present in, and at what complexity | `knownLanguages` |
| which modes may accept text, sign or tactile script from the user | `textEntryRate`, `writeFontSet`, `writeSignSet`, `writeTactileSet` |
| which script or signed language to present in | `hapticLanguageSet`, `signLanguageSet` |

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
| motor | no | 18 |
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
| — | `effectorStability` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `pointerControl` | **FULL** | — | None |

**Not recorded: 52 of 59 properties.**

- **Not of interest** (52), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 40 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### blind-since-birth

*Reads Braille, listens closely, and follows more concurrent audio than most. Full hearing, touch, language and motor control. No usable sight from birth.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 9

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **NONE** | — | None |
| — | `effectorStability` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `hapticLanguageSet` | **PARTIAL** | Braille | language, touch |
| — | `readFontText` | **NONE** | — | sight, language |
| — | `pointerControl` | **FULL** | — | None |

**Not recorded: 50 of 59 properties.**

- **Cannot exist** (14), because a precedence parent is NONE: `stereo`, `focus`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, `intensityHigh`, `contrastSensitivity`, `gazeControl`, `readSignText`, `minReadFontSizeForFont`.

- **Not of interest** (36), because no precedence parent is PARTIAL: `focusDuration`, `tracking`, `trackingDuration`, `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, `elevationResolution`, `concurrentStreams`, `listeningDuration`, `vibrationDetection`, `kinaesthesia`, `switchSites`, and 24 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

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
| — | `effectorStability` | **FULL** | — | None |
| — | `focus` | **PARTIAL** | — | sight |
| — | `focusDuration` | **PARTIAL** | 25 min | focus |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `intensityHigh` | **PARTIAL** | 45 % | sight |
| — | `intensityLow` | **PARTIAL** | 45 % | sight |
| — | `intensityMedium` | **PARTIAL** | 45 % | sight |
| — | `readFontText` | **PARTIAL** | — | sight, language |
| — | `minReadFontSizeForFont` | **PARTIAL** | size 18, font system-sans | readFontText, effectorStability |
| — | `pointerControl` | **FULL** | — | None |
| — | `tracking` | **PARTIAL** | — | focus |
| — | `trackingDuration` | **PARTIAL** | 12 min | tracking |

**Not recorded: 39 of 59 properties.**

- **Not of interest** (39), because no precedence parent is PARTIAL: `stereo`, `viewRectangle`, `nonViewRectangle`, `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, `elevationResolution`, `concurrentStreams`, `listeningDuration`, `vibrationDetection`, `kinaesthesia`, `switchSites`, and 27 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

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
| — | `effectorStability` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `intensityMedium` | **PARTIAL** | 70 % | sight |
| — | `pointerControl` | **FULL** | — | None |

**Not recorded: 47 of 59 properties.**

- **Not of interest** (47), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `intensityLow`, `intensityHigh`, `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, and 35 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### keyboard-only

*Full discrete key control, and writes by selection — keyboard, scanning or eye tracking. Does not use a continuous pointing device.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 8

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `effectorStability` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `pointerControl` | **NONE** | — | None |
| — | `writeFontSet` | **PARTIAL** | SELECT | language, keyControl, effectorStability |

**Not recorded: 51 of 59 properties.**

- **Cannot exist** (1), because a precedence parent is NONE: `minTargetSize`.

- **Not of interest** (50), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 38 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### hand-tremor

*Full sight, hearing and language. Holds a hand steady to about a third of typical, which sets his target size, key delay, and — whenever the display is hand-held rather than mounted — the size of type he can read.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 12

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **PARTIAL** | hands, fingertips | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `effectorStability` | **PARTIAL** | 35 % | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `minKeyRepeatDelay` | **PARTIAL** | 900 ms | keyControl, effectorStability |
| `fontSizeSeated` | `minReadFontSizeForFont` | **PARTIAL** | size 12, font system-sans | readFontText, effectorStability |
| — | `minReadFontSizeForFont` | **PARTIAL** | *derived — see below* | readFontText, effectorStability |
| — | `pointerControl` | **PARTIAL** | hands, fingertips | None |
| — | `minTargetSize` | **PARTIAL** | 18 mm | pointerControl, effectorStability, kinaesthesia |
| — | `sustainedPress` | **PARTIAL** | — | keyControl |

**Not recorded: 48 of 59 properties.**

- **Not of interest** (48), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 36 more.

#### Functionally dependent settings

Marked **(M)** for mathematical dependence, per OOA96 §2.3: *"given values of the
attributes in X, the value of Y can be determined by a formula or algorithm"*. The
model requires each one to cite its formula.

| Setting (M) | Reads | External influences | Formula |
|---|---|---|---|
| `minReadFontSizeForFont` | `fontSizeSeated`, `effectorStability` | `deviceStability` | MOUNTED: fontSizeSeated.size. HANDHELD: fontSizeSeated.size scaled by (1 + (100 - effectorStability)/100), clamped to 4..96pt and rounded to 1dp. At 35% stability a hand-held display needs 1.65x the mounted size. |

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
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### deaf

*Signs fluently in ASL, reads print and sign, and has full sight, touch and motor control. No usable hearing — the hardest case for an audio-first demonstrator, which is why it is here.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 15

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **NONE** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `effectorStability` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `readAudioText` | **NONE** | — | hearing, language |
| — | `knownLanguages` | **PARTIAL** | **en-CA** — listening none, speaking basic, reading fluent, writing fluent | language |
| — | `pointerControl` | **FULL** | — | None |
| — | `signLanguageSet` | **PARTIAL** | ASL | language |
| — | `readSignText` | **FULL** | — | sight, signLanguageSet |
| — | `speech` | **PARTIAL** | — | None |
| — | `speechIntelligibility` | **PARTIAL** | familiar listeners | speech |
| — | `speechRecognisedByMachine` | **NONE** | — | speech |
| — | `writeSignSet` | **PARTIAL** | Visual | signLanguageSet, effectorStability, kinaesthesia |

**Not recorded: 44 of 59 properties.**

- **Cannot exist** (8), because a precedence parent is NONE: `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, `elevationResolution`, `concurrentStreams`, `listeningDuration`, `intelligibleVoicePitch`, `minInterWordGap`.

- **Not of interest** (36), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 24 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

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
| — | `effectorStability` | **FULL** | — | None |
| — | `elevationResolution` | **PARTIAL** | 40 deg | hearing |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `readAudioText` | **PARTIAL** | — | hearing, language |
| — | `intelligibleVoicePitch` | **PARTIAL** | 165–300 | readAudioText |
| — | `listeningDuration` | **PARTIAL** | 20 min | hearing |
| — | `minInterWordGap` | **PARTIAL** | 220 ms | readAudioText |
| — | `pointerControl` | **FULL** | — | None |
| — | `usableFrequencyRange` | **PARTIAL** | 20–8000 | hearing |

**Not recorded: 43 of 59 properties.**

- **Not of interest** (43), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 31 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### multiple-sclerosis

*Hears fully, reads at 20pt in short spells, and works with large targets and long key delays. Sees with one eye at a time; locates a hand to within a quarter of its usual accuracy. A spiky profile across four ontologies: the paper's own example of what stereotype templates handle worst.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 19

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **PARTIAL** | hands, fingertips | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **PARTIAL** | — | None |
| — | `effectorStability` | **PARTIAL** | 30 % | None |
| — | `focus` | **PARTIAL** | — | sight |
| — | `focusDuration` | **PARTIAL** | 8 min | focus |
| — | `language` | **FULL** | — | None |
| — | `touch` | **NONE** | — | None |
| — | `kinaesthesia` | **PARTIAL** | 25 % | None |
| — | `listeningDuration` | **PARTIAL** | 15 min | hearing |
| — | `minKeyRepeatDelay` | **PARTIAL** | 1200 ms | keyControl, effectorStability |
| — | `readFontText` | **PARTIAL** | — | sight, language |
| — | `minReadFontSizeForFont` | **PARTIAL** | size 20, font system-sans | readFontText, effectorStability |
| — | `pointerControl` | **PARTIAL** | hands, fingertips | None |
| — | `minTargetSize` | **PARTIAL** | 28 mm | pointerControl, effectorStability, kinaesthesia |
| — | `stereo` | **NONE** | — | sight |
| — | `sustainedPress` | **PARTIAL** | — | keyControl |
| — | `tracking` | **PARTIAL** | — | focus |
| — | `trackingDuration` | **PARTIAL** | 4 min | tracking |

**Not recorded: 40 of 59 properties.**

- **Cannot exist** (4), because a precedence parent is NONE: `vibrationDetection`, `hapticLanguageSet`, `readTactileSign`, `writeTactileSet`.

- **Not of interest** (36), because no precedence parent is PARTIAL: `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, `intensityHigh`, `contrastSensitivity`, `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, and 24 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### deafblind

*Signs ASL fluently and receives it hand-over-hand. Reads Braille and the two-handed manual alphabet. Full touch, kinaesthesia and motor control. Congenitally Deaf with progressive vision loss in adult life.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 16

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **NONE** | — | None |
| — | `sight` | **NONE** | — | None |
| — | `effectorStability` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `hapticLanguageSet` | **PARTIAL** | Braille, DeafblindManual, PrintOnPalm | language, touch |
| — | `readAudioText` | **NONE** | — | hearing, language |
| — | `readFontText` | **NONE** | — | sight, language |
| — | `pointerControl` | **FULL** | — | None |
| — | `signLanguageSet` | **PARTIAL** | ASL | language |
| — | `readSignText` | **NONE** | — | sight, signLanguageSet |
| — | `readTactileSign` | **FULL** | — | touch, signLanguageSet |
| — | `vibrationDetection` | **PARTIAL** | 85 % | touch |
| — | `writeSignSet` | **PARTIAL** | Visual, Tactile | signLanguageSet, effectorStability, kinaesthesia |
| — | `writeTactileSet` | **PARTIAL** | Braille, DeafblindManual, PrintOnPalm | hapticLanguageSet, effectorStability, touch |

**Not recorded: 43 of 59 properties.**

- **Cannot exist** (21), because a precedence parent is NONE: `stereo`, `focus`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, `intensityHigh`, `contrastSensitivity`, `usableFrequencyRange`, `binauralHearing`, `azimuthResolution`, `elevationResolution`, `concurrentStreams`, `listeningDuration`, `gazeControl`, `minReadFontSizeForFont`, `intelligibleVoicePitch`, `minInterWordGap`.

- **Not of interest** (22), because no precedence parent is PARTIAL: `focusDuration`, `tracking`, `trackingDuration`, `kinaesthesia`, `switchSites`, `activationTiming`, `headControl`, `headRange`, `breathControl`, `gazeAccuracy`, `dwellTolerance`, `textEntryRate`, and 10 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

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
| — | `effectorStability` | **PARTIAL** | 55 % | None |
| — | `elevationResolution` | **PARTIAL** | 30 deg | hearing |
| — | `language` | **FULL** | — | None |
| — | `touch` | **PARTIAL** | site fingertips, level none; site hands, level reduced | None |
| — | `readAudioText` | **PARTIAL** | — | hearing, language |
| — | `intelligibleVoicePitch` | **PARTIAL** | 165–300 | readAudioText |
| — | `listeningDuration` | **PARTIAL** | 25 min | hearing |
| — | `minInterWordGap` | **PARTIAL** | 260 ms | readAudioText |
| — | `pointerControl` | **PARTIAL** | hands, fingertips | None |
| `targetSizeWarm` | `minTargetSize` | **PARTIAL** | 12 mm | pointerControl, effectorStability, kinaesthesia |
| — | `minTargetSize` | **PARTIAL** | *derived — see below* | pointerControl, effectorStability, kinaesthesia |
| — | `usableFrequencyRange` | **PARTIAL** | 20–3000, 6000–12000 | hearing |
| — | `vibrationDetection` | **NONE** | — | touch |

**Not recorded: 41 of 59 properties.**

- **Not of interest** (41), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 29 more.

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
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### second-language

*Native Punjabi speaker, fluent listener and reader of English, conversational in speaking and writing it. Full sight, hearing, touch and motor control. Understood by most listeners; understood by machines less reliably.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 12

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `effectorStability` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `knownLanguages` | **PARTIAL** | **pa** — listening native, speaking native, reading fluent, writing conversational; **en-CA** — listening fluent, speaking conversational, reading fluent, writing conversational | language |
| — | `readFontText` | **PARTIAL** | — | sight, language |
| — | `pointerControl` | **FULL** | — | None |
| — | `speech` | **FULL** | — | None |
| — | `speechIntelligibility` | **PARTIAL** | most listeners | speech |
| — | `speechRecognisedByMachine` | **PARTIAL** | with frequent corrections | speech |

**Not recorded: 47 of 59 properties.**

- **Not of interest** (47), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 35 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### switch-scanning

*Full sight, hearing and language. Operates one switch reliably from a single body site, and needs a slow scan to meet it. Speaks, and is understood by people who know him. Works in stretches of about twenty minutes.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 16

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **PARTIAL** | head | None |
| — | `activationTiming` | **PARTIAL** | needs a slow scan | keyControl |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `effectorStability` | **PARTIAL** | 15 % | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `inputDuration` | **PARTIAL** | 20 min | None |
| — | `pointerControl` | **NONE** | — | None |
| — | `simultaneousContacts` | **PARTIAL** | 1 points | None |
| — | `speech` | **PARTIAL** | — | None |
| — | `speechIntelligibility` | **PARTIAL** | familiar listeners | speech |
| — | `speechRecognisedByMachine` | **NONE** | — | speech |
| — | `sustainedPress` | **PARTIAL** | — | keyControl |
| — | `switchSites` | **PARTIAL** | 1 sites | keyControl |
| — | `textEntryRate` | **PARTIAL** | 3 wpm | None |

**Not recorded: 43 of 59 properties.**

- **Cannot exist** (1), because a precedence parent is NONE: `minTargetSize`.

- **Not of interest** (42), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 30 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### eye-gaze-als

*Sees and hears perfectly, reads and writes fluently, and communicates entirely by gaze — holding a fixation for about two and a half seconds to select, within about three degrees. Full sensation throughout. Works in stretches of about fifteen minutes.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 16

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **NONE** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `gazeControl` | **PARTIAL** | — | sight |
| — | `dwellTolerance` | **PARTIAL** | 2500 ms | gazeControl |
| — | `effectorStability` | **NONE** | — | None |
| — | `gazeAccuracy` | **PARTIAL** | 3 deg | gazeControl |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `headControl` | **NONE** | — | None |
| — | `inputDuration` | **PARTIAL** | 15 min | None |
| — | `knownLanguages` | **PARTIAL** | **en-CA** — listening native, speaking none, reading native, writing native | language |
| — | `pointerControl` | **NONE** | — | None |
| — | `simultaneousContacts` | **PARTIAL** | 1 points | None |
| — | `speech` | **NONE** | — | None |
| — | `textEntryRate` | **PARTIAL** | 6 wpm | None |

**Not recorded: 43 of 59 properties.**

- **Cannot exist** (12), because a precedence parent is NONE: `switchSites`, `activationTiming`, `headRange`, `minTargetSize`, `sustainedPress`, `minKeyRepeatDelay`, `speechIntelligibility`, `speechRecognisedByMachine`, `minReadFontSizeForFont`, `writeFontSet`, `writeSignSet`, `writeTactileSet`.

- **Not of interest** (31), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 19 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### sip-and-puff

*Full sight, hearing, language and speech. Points with head position and selects with four distinguishable breath signals. Feels the head and neck normally and the hands not at all. Works in stretches of about forty-five minutes.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 14

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **NONE** | — | None |
| — | `hearing` | **FULL** | — | None |
| — | `breathControl` | **PARTIAL** | 4 signals | None |
| — | `sight` | **FULL** | — | None |
| — | `effectorStability` | **NONE** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **PARTIAL** | site arms, level none; site hands, level none; site fingertips, level none; site trunk, level none; site legs, level none; site feet, level none; site toes, level none | None |
| — | `headControl` | **FULL** | — | None |
| — | `inputDuration` | **PARTIAL** | 45 min | None |
| — | `kinaesthesia` | **NONE** | — | None |
| — | `pointerControl` | **NONE** | — | None |
| — | `simultaneousContacts` | **PARTIAL** | 2 points | None |
| — | `speech` | **FULL** | — | None |
| — | `textEntryRate` | **PARTIAL** | 12 wpm | None |

**Not recorded: 45 of 59 properties.**

- **Cannot exist** (9), because a precedence parent is NONE: `switchSites`, `activationTiming`, `minTargetSize`, `sustainedPress`, `minKeyRepeatDelay`, `minReadFontSizeForFont`, `writeFontSet`, `writeSignSet`, `writeTactileSet`.

- **Not of interest** (36), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 24 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### toe-typist

*Born without arms. Types, points and plays with both feet, with full dexterity and full sensation in the toes. Full sight, hearing, language and speech. Needs the controls within reach of a foot, and nothing else.*

**Basis:** exemplar — stands in for lived experience, not derived from any person  
**Entity kind:** user · **Settings recorded:** 10

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **PARTIAL** | feet, toes | None |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `effectorStability` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **PARTIAL** | site arms, level none; site hands, level none; site fingertips, level none | None |
| — | `pointerControl` | **PARTIAL** | feet, toes | None |
| — | `minTargetSize` | **PARTIAL** | 15 mm | pointerControl, effectorStability, kinaesthesia |
| — | `simultaneousContacts` | **PARTIAL** | 2 points | None |
| — | `textEntryRate` | **PARTIAL** | 30 wpm | None |

**Not recorded: 49 of 59 properties.**

- **Not of interest** (49), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 37 more.

#### Setting groups (contexts)

| Group | Template | Settings | Influenced by |
|---|---|---|---|
| `seeing` | vision | `sight` | `deviceStability` |
| `listening` | listening | `hearing` | `ambientNoise` |
| `input` | input | `pointerControl`, `keyControl`, `effectorStability` | — |

### switch-scanning-with-buddy

*Two people playing one game. The primary sees, hears, understands and decides; the assistant supplies hands and timing. Together they meet a falling piece that neither the primary alone nor any control scheme could.*

**Basis:** exemplar — stands in for lived experience, not derived from any person — a practice, not a person  
**Entity kind:** group · **Settings recorded:** 16

| Setting | Property | Capability | Measurement | Parent |
|---|---|---|---|---|
| — | `keyControl` | **FULL** | — | None |
| — | `activationTiming` | **PARTIAL** | needs a slow scan | keyControl |
| — | `hearing` | **FULL** | — | None |
| — | `sight` | **FULL** | — | None |
| — | `effectorStability` | **FULL** | — | None |
| — | `language` | **FULL** | — | None |
| — | `touch` | **FULL** | — | None |
| — | `inputDuration` | **PARTIAL** | 20 min | None |
| — | `pointerControl` | **FULL** | — | None |
| — | `simultaneousContacts` | **PARTIAL** | 1 points | None |
| — | `speech` | **PARTIAL** | — | None |
| — | `speechIntelligibility` | **PARTIAL** | familiar listeners | speech |
| — | `speechRecognisedByMachine` | **NONE** | — | speech |
| — | `sustainedPress` | **PARTIAL** | — | keyControl |
| — | `switchSites` | **PARTIAL** | 1 sites | keyControl |
| — | `textEntryRate` | **PARTIAL** | 3 wpm | None |

**Not recorded: 43 of 59 properties.**

- **Not of interest** (43), because no precedence parent is PARTIAL: `stereo`, `focus`, `focusDuration`, `tracking`, `trackingDuration`, `viewRectangle`, `nonViewRectangle`, `colorLow`, `colorMedium`, `colorHigh`, `intensityLow`, `intensityMedium`, and 31 more.

#### Who supplies what

Members: `switch-scanning` + `reference`. Primary: `switch-scanning` — whose game it is.

**The assistant lends** (motor capability only — see below):

| Setting | Pair | Why |
|---|---|---|
| `pointerControl` | **FULL** | assistant FULL vs primary NONE |
| `keyControl` | **FULL** | assistant FULL vs primary PARTIAL |
| `effectorStability` | **FULL** | assistant FULL vs primary PARTIAL |

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

| Property | reference | blindSinceBirth | lowVisionContrast | lowVisionColour | keyboardOnly | handTremor | deaf | deafenedAsymmetric | multipleSclerosis | deafBlind | deafenedNotch | secondLanguage | switchScanning | eyeGazeALS | sipAndPuff | toeTypist | switchScanningWithBuddy |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `keyControl` | FULL | FULL | FULL | FULL | FULL | PARTIAL hands, fingertips | FULL | FULL | PARTIAL hands, fingertips | FULL | FULL | FULL | PARTIAL head | NONE | NONE | PARTIAL feet, toes | FULL |
| `activationTiming` |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL needs a slow scan |  |  |  | PARTIAL needs a slow scan |
| `hearing` | FULL | FULL | FULL | FULL | FULL | FULL | NONE | PARTIAL | FULL | NONE | PARTIAL | FULL | FULL | FULL | FULL | FULL | FULL |
| `binauralHearing` |  |  |  |  |  |  |  | PARTIAL 800–8000 |  |  | PARTIAL 20–3000, 6000–12000 |  |  |  |  |  |  |
| `azimuthResolution` |  |  |  |  |  |  |  | PARTIAL 45 deg |  |  | PARTIAL 20 deg |  |  |  |  |  |  |
| `breathControl` |  |  |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 4 signals |  |  |
| `sight` | FULL | NONE | PARTIAL | PARTIAL | FULL | FULL | FULL | FULL | PARTIAL | NONE | FULL | FULL | FULL | FULL | FULL | FULL | FULL |
| `colorHigh` |  |  | FULL | PARTIAL 80 % |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `colorLow` |  |  | FULL | PARTIAL 40 % |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `colorMedium` |  |  | FULL | PARTIAL 25 % |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `concurrentStreams` |  |  |  |  |  |  |  | PARTIAL 2 streams |  |  | PARTIAL 2 streams |  |  |  |  |  |  |
| `contrastSensitivity` |  |  | PARTIAL 30 % | FULL |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `gazeControl` |  |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL |  |  |  |
| `dwellTolerance` |  |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 2500 ms |  |  |  |
| `effectorStability` | FULL | FULL | FULL | FULL | FULL | PARTIAL 35 % | FULL | FULL | PARTIAL 30 % | FULL | PARTIAL 55 % | FULL | PARTIAL 15 % | NONE | NONE | FULL | FULL |
| `elevationResolution` |  |  |  |  |  |  |  | PARTIAL 40 deg |  |  | PARTIAL 30 deg |  |  |  |  |  |  |
| `focus` |  |  | PARTIAL |  |  |  |  |  | PARTIAL |  |  |  |  |  |  |  |  |
| `focusDuration` |  |  | PARTIAL 25 min |  |  |  |  |  | PARTIAL 8 min |  |  |  |  |  |  |  |  |
| `gazeAccuracy` |  |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 3 deg |  |  |  |
| `language` | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL |
| `touch` | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | NONE | FULL | PARTIAL site fingertips, level none; site hands, level reduced | FULL | FULL | FULL | PARTIAL site arms, level none; site hands, level none; site fingertips, level none; site trunk, level none; site legs, level none; site feet, level none; site toes, level none | PARTIAL site arms, level none; site hands, level none; site fingertips, level none | FULL |
| `hapticLanguageSet` |  | PARTIAL Braille |  |  |  |  |  |  |  | PARTIAL Braille, DeafblindManual, PrintOnPalm |  |  |  |  |  |  |  |
| `headControl` |  |  |  |  |  |  |  |  |  |  |  |  |  | NONE | FULL |  |  |
| `inputDuration` |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 20 min | PARTIAL 15 min | PARTIAL 45 min |  | PARTIAL 20 min |
| `readAudioText` |  |  |  |  |  |  | NONE | PARTIAL |  | NONE | PARTIAL |  |  |  |  |  |  |
| `intelligibleVoicePitch` |  |  |  |  |  |  |  | PARTIAL 165–300 |  |  | PARTIAL 165–300 |  |  |  |  |  |  |
| `intensityHigh` |  |  | PARTIAL 45 % |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `intensityLow` |  |  | PARTIAL 45 % |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `intensityMedium` |  |  | PARTIAL 45 % | PARTIAL 70 % |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `kinaesthesia` |  |  |  |  |  |  |  |  | PARTIAL 25 % |  |  |  |  |  | NONE |  |  |
| `knownLanguages` |  |  |  |  |  |  | PARTIAL **en-CA** — listening none, speaking basic, reading fluent, writing fluent |  |  |  |  | PARTIAL **pa** — listening native, speaking native, reading fluent, writing conversational; **en-CA** — listening fluent, speaking conversational, reading fluent, writing conversational |  | PARTIAL **en-CA** — listening native, speaking none, reading native, writing native |  |  |  |
| `listeningDuration` |  |  |  |  |  |  |  | PARTIAL 20 min | PARTIAL 15 min |  | PARTIAL 25 min |  |  |  |  |  |  |
| `minInterWordGap` |  |  |  |  |  |  |  | PARTIAL 220 ms |  |  | PARTIAL 260 ms |  |  |  |  |  |  |
| `minKeyRepeatDelay` |  |  |  |  |  | PARTIAL 900 ms |  |  | PARTIAL 1200 ms |  |  |  |  |  |  |  |  |
| `readFontText` |  | NONE | PARTIAL |  |  |  |  |  | PARTIAL | NONE |  | PARTIAL |  |  |  |  |  |
| `minReadFontSizeForFont` |  |  | PARTIAL size 18, font system-sans |  |  | PARTIAL size 12, font system-sans; PARTIAL *(M)* |  |  | PARTIAL size 20, font system-sans |  |  |  |  |  |  |  |  |
| `pointerControl` | FULL | FULL | FULL | FULL | NONE | PARTIAL hands, fingertips | FULL | FULL | PARTIAL hands, fingertips | FULL | PARTIAL hands, fingertips | FULL | NONE | NONE | NONE | PARTIAL feet, toes | FULL |
| `minTargetSize` |  |  |  |  |  | PARTIAL 18 mm |  |  | PARTIAL 28 mm |  | PARTIAL 12 mm; PARTIAL *(M)* |  |  |  |  | PARTIAL 15 mm |  |
| `signLanguageSet` |  |  |  |  |  |  | PARTIAL ASL |  |  | PARTIAL ASL |  |  |  |  |  |  |  |
| `readSignText` |  |  |  |  |  |  | FULL |  |  | NONE |  |  |  |  |  |  |  |
| `readTactileSign` |  |  |  |  |  |  |  |  |  | FULL |  |  |  |  |  |  |  |
| `simultaneousContacts` |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 1 points | PARTIAL 1 points | PARTIAL 2 points | PARTIAL 2 points | PARTIAL 1 points |
| `speech` |  |  |  |  |  |  | PARTIAL |  |  |  |  | FULL | PARTIAL | NONE | FULL |  | PARTIAL |
| `speechIntelligibility` |  |  |  |  |  |  | PARTIAL familiar listeners |  |  |  |  | PARTIAL most listeners | PARTIAL familiar listeners |  |  |  | PARTIAL familiar listeners |
| `speechRecognisedByMachine` |  |  |  |  |  |  | NONE |  |  |  |  | PARTIAL with frequent corrections | NONE |  |  |  | NONE |
| `stereo` |  |  |  |  |  |  |  |  | NONE |  |  |  |  |  |  |  |  |
| `sustainedPress` |  |  |  |  |  | PARTIAL |  |  | PARTIAL |  |  |  | PARTIAL |  |  |  | PARTIAL |
| `switchSites` |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 1 sites |  |  |  | PARTIAL 1 sites |
| `textEntryRate` |  |  |  |  |  |  |  |  |  |  |  |  | PARTIAL 3 wpm | PARTIAL 6 wpm | PARTIAL 12 wpm | PARTIAL 30 wpm | PARTIAL 3 wpm |
| `tracking` |  |  | PARTIAL |  |  |  |  |  | PARTIAL |  |  |  |  |  |  |  |  |
| `trackingDuration` |  |  | PARTIAL 12 min |  |  |  |  |  | PARTIAL 4 min |  |  |  |  |  |  |  |  |
| `usableFrequencyRange` |  |  |  |  |  |  |  | PARTIAL 20–8000 |  |  | PARTIAL 20–3000, 6000–12000 |  |  |  |  |  |  |
| `vibrationDetection` |  |  |  |  |  |  |  |  |  | PARTIAL 85 % | NONE |  |  |  |  |  |  |
| `writeFontSet` |  |  |  |  | PARTIAL SELECT |  |  |  |  |  |  |  |  |  |  |  |  |
| `writeSignSet` |  |  |  |  |  |  | PARTIAL Visual |  |  | PARTIAL Visual, Tactile |  |  |  |  |  |  |  |
| `writeTactileSet` |  |  |  |  |  |  |  |  |  | PARTIAL Braille, DeafblindManual, PrintOnPalm |  |  |  |  |  |  |  |

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

