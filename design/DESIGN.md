# Accessible Tetris — Engineering Design

The design reference for the web build. The reasoning behind every decision here is in [the case study](../docs/case-study.md); this document states the decisions, for building against.

## 0. Scope: a demonstrator, not a product

What we are building is a **demonstrator of adaptation techniques**, referencing directly back to the CISNA Model — not a claim of a finished accessible Tetris (case study §1 and §12). Consequences for everything below:

- **A simple version of the game, scoped openly.** All seven pieces, movement, rotation, lock, line clears, hold, ghost, scoring. Simplifications are stated, not smuggled: basic rotation (no SRS kick tables), no T-spin scoring, simple randomizer acceptable for v1. Fidelity upgrades are possible later; they are not the point.
- **The techniques are the deliverable**: the abstract-game/async-bridge architecture, the sonic metaphors as selectable Inventory, the three listening views, the capability-driven Adaptation layer (the mixing desk). Each must remain individually inspectable and switchable — the demonstrator's job is to make the CISNA layers visible in operation.
- **CISNA mapping is structural**: game events (and their ontology) = Semantics over External Content; metaphor implementations = Inventory; view/metaphor selection by capability = Adaptation. UI copy and docs in the demo reference the layers by name.
- Claims stay exploratory: "works" means "demonstrates", pending co-design and evaluation (§8).

## 1. Platform and constraints

- **Vanilla JavaScript**, no framework, no build step required to run. One page.
- **Web Audio API** with `PannerNode` (`panningModel: "HRTF"`) for all spatialized sources.
- **Headphones assumed** for the spatial experience; the game must remain playable (visual view + non-spatial audio fallback) without them.
- Assumes stereo hearing across musical registers for the sonic view; every element of the soundscape is user-controllable (see §6) — the user decides how to experience the game.
- No licensed Tetris assets, no Korobeiniki. The functional audio is the soundtrack.

## 2. Architecture

Three layers, mirroring the case study's domain chart:

```
   ┌───────────────────────────────┐
   │        ABSTRACT GAME          │  grid 10×22 (2 hidden), 7 pieces,
   │  Game FSM  +  FallingTile FSM │  rotation (see Scope), hold, ghost, scoring
   └──────────────┬────────────────┘
                  │  async request/answer bridge (Promise-based)
        ┌─────────┴─────────┐
   ┌────┴─────┐        ┌────┴─────┐
   │ VISUAL   │        │ SONIC    │   each renders all/some/none of the game,
   │ VIEW     │        │ VIEW     │   per the active capability profile
   └────┬─────┘        └────┬─────┘
        └─────────┬─────────┘
   ┌──────────────┴────────────────┐
   │   CAPABILITY / PREFERENCES    │  profiles, presets, the mixing desk
   └───────────────────────────────┘
```

**The bridge rules** (from the Ascom lessons):
1. The game is always the client of its views; views never open a transaction.
2. Every announcement is a request/answer pair; the game rendezvous on *all* answers before advancing.
3. Views may send indications (key events arrive via the input service as indications).
4. A request may be cancelled (the `X:` pattern) — used by hard drop when the current announcement's modality permits interruption; otherwise updates serialize. Each modality declares `interruptible: true/false`.

**The game clock bends to the user.** Rendering may delay the fall. All five timeouts are parameters of the capability profile: per-row dwell, lock delay, next-piece delay, auto-repeat rate, key dwell. (Reference points from the PhD build: 300 ms visual dwell vs 4000 ms sonic dwell.)

**State machines.** `Game` and `FallingTile` as explicit FSMs with the case study's event discipline (`I:` indication, `R:/A:` request/answer, `D:` immediate internal decision, transactions). The final stylized Falling Tile model (docs/figures/fig-falling-tile-state-model.png) is the specification; meta-states with concurrent/serialized options become per-announcement strategy selection at runtime.

## 3. The audio stage

Listener at the origin. All angles are azimuth (0° = ahead), elevation as HRTF Y.

- **The Wall** (default, key `1`): the 10 columns on an equidistant frontal arc, hard left to hard right (~±70° at the extremes). Row height → coarse elevation + fine pitch. The falling piece is a spatialized source on the arc.
- **The Well** (key `2`): plan view; columns keep their azimuth (muscle memory transfers), piece footprint laid out in the horizontal plane, gap depth per column delivered as sonar return time.
- **Mission Control** (key `3`): fixed stations, none at 0°/180° — HELD −40° behind, NEXT +40° behind, LEVEL −30° front-below, SCORE/LINES +30° front-below. A snapshot view; nothing here needs real-time update.
- View switch: short 3-D earcon, no pause by default, pause-on-switch available as a setting.

**The wobble.** Slow irregular figure-eight oscillation of the listener orientation; two incommensurate frequencies (~0.3 Hz and ~0.47 Hz), amplitude 2–4°, so the pattern never repeats and stays subliminal. Purpose: give HRTF the micro-head-movement cues that resolve front/back on headphones.

## 4. The sonic palette

| Element | Sound | Category |
|---|---|---|
| Piece identity | Per-tetromino timbre: I sine, O pad, T pluck, S/Z detuned pair, J/L mirrored mallets | Ambient |
| Horizontal position | Azimuth pan on the arc | Ambient |
| Descent | Slow pitch fall / low-pass close + waterfall-style approach | Ambient |
| Rotation | 4-step harmonic motif (root/third/fifth/octave) | Event |
| Ghost | Piece's own timbre: quiet, heavy reverb, panned to landing column; echo delay shrinks with distance-to-land, converging on contact | Ambient (subtle) |
| Terrain scan | L→R arpeggio of the 10 columns; pan = where, pitch = height; consonance = flatness | On-demand + auto after lock |
| Lock timeout | Accelerating tick, distinct from heartbeat | Event |
| Urgency | Heartbeat at fall tempo; stack danger shifts scale major→minor pentatonic, adds sub-bass | Ambient |
| Line clear | Horizontal sweep; harmonic stacking by count (unison/octave/chord/full arpeggio for 4); then terrain replay + a beat of silence | Event |
| Next / Held | Identifying timbre from their fixed stations | On-demand |
| Level/score/lines | Pitch-mapped tone, rhythmic count, escalating phrase at their stations | On-demand |

All pitch material on a pentatonic scale (major; minor under danger).

## 5. Psychoacoustic rules (hard constraints)

1. **X-axis is king** — the primary game dimension (columns) always maps to azimuth (~1–2° resolution).
2. **Elevation is coarse** — design to ~5 bands, never 20. Rows 1–20 → zones Ground/Lower/Middle/Upper/Sky (4 rows each), each with a timbral signature; fine height rides on pitch.
3. **Redundant coding** for anything critical: elevation + pitch + brightness + tempo. No single channel bears critical information alone.
4. **No pure front/back placements**; offset everything ≥30° from the median plane, no two sources on the same cone of confusion.
5. **Wobble always on** while spatial audio is active.

## 6. The mixing desk

Independently controllable layers, each with on/off, volume, density, spatial spread:

```
L0 CORE      piece position + identity (always on)
L1 GHOST     landing echo
L2 TERRAIN   silhouette scan
L3 QUEUE     next + held
L4 SCORING   lines, score, level
L5 TENSION   heartbeat, urgency, danger
L6 EVENTS    locks, clears, game over
```

Presets: **Minimal** (0,6) · **Standard** (0,1,5,6) · **Full** (0–6) · **Custom** (the desk). Per-cue weighting for the height cluster (elevation/pitch/brightness/tempo). Profiles persist (localStorage); the People/Capabilities/Preferences model from the PhD build is the schema starting point.

## 7. Visual view

Classic SVG rendering: playfield, ghost, next, hold, score. High-contrast and colour-blind-safe palettes (shape-coded pieces, not colour-only); `prefers-reduced-motion` honoured (no ripple effects); complete keyboard operation per the Guidelines' key expectations plus remapping; ARIA live region announcing piece/major events for screen-reader users playing with partial vision. The visual view is a peer of the sonic view, not the primary.

## 8. Build order

1. **Timbres** — the 7 voices in a Web Audio sandbox; A/B until identities are learnable.
2. **Terrain scan** — static boards played as audio; test: can a listener sketch the silhouette?
3. **Stage** — coordinate system, PannerNode layout, the wobble; front/back discrimination test.
4. **Abstract game** — FSMs + bridge, headless, unit-tested against the Scope §0 rule subset (fidelity upgrades tracked, not assumed).
5. **Views** — visual first (it debugs the game), then sonic layer by layer.
6. **Desk + presets**, training mode, then evaluation instrumentation (event log for quantitative measures).

Each phase produces something independently testable; the riskiest metaphors get tested first.
