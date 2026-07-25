# Accessible Tetris

An exploration of what it means for Tetris to be accessible — design method and interaction modalities, with working examples of techniques: spatial audio, musical sonification, and a first-person listening experience, running in an ordinary web page.

The claim here is deliberately precise. This is **not** "an accessible Tetris game": it is research into what accessibility *means* for a game like this, with a demonstrator showing the techniques in action. The work continues my PhD's rendering case study, which chose Tetris because it is hard, not because it was doable — real-time, animated, built on exactly the kind of proximal, spatial content that screen readers cannot transliterate. The adaptation approach references directly back to the thesis's core: the [CISNA Model of Accessible Adaptive Hypermedia](https://a11ybob.com/research/cisna-model) (Adaptation / Navigation / Semantics / Inventory / External Content), with the game's events at Semantics, the audio metaphors as Inventory, and the player-facing mixing desk as the Adaptation layer in the player's own hands. The original exploratory build (Java + OpenAL, circa 2009) exercised the architecture; the web demonstrator rebuilds it where the Web Audio API finally provides binaural spatial audio worthy of the design.

## The documents

| Document | What it is |
| --- | --- |
| [docs/case-study.md](docs/case-study.md) | The full case study: what Tetris demands of a player, why assistive technology fails at it, the sonic metaphors and adaptive architecture of the PhD implementation, and the design for this web build. Also available as Word: `docs/Accessible Tetris - Case Study.docx`. |
| [design/DESIGN.md](design/DESIGN.md) | The engineering design for the web implementation — architecture, audio stage, psychoacoustic rules, layers, and build phases. |
| [docs/research.md](docs/research.md) | Research notes: what others have said about Tetris and accessibility, the audio-game lineage, accessible game design guidelines and literature, open-source implementations, and the legal landscape for falling-block games. |

## The shape of the thing

- **An abstract game** (grid, tetrominoes, SRS rotation, hold, ghost, scoring) modelled as concurrent state machines, communicating with its user interface only through asynchronous request/answer pairs — so the game can *wait for the interface*, and rendering speed becomes a user accommodation, not a constant.
- **A visual view**: clean SVG Tetris — high contrast, colour-blind-safe, keyboard-operable, `prefers-reduced-motion` respected.
- **A sonic view**: per-piece timbres, HRTF-panned positions, a terrain scan that plays the silhouette as melody, a ghost heard as a converging echo, urgency as heartbeat — organized into three switchable first-person listening views (The Wall, The Well, Mission Control).
- **A capability layer**: the player's mixing desk — independently controllable audio layers with presets from Minimal to Full. The user decides how to experience the game.

## Status

Documents and design first; the demonstrator follows the build order the case study argues for — timbres, then terrain scan, then the spatial stage, then a simple, openly-scoped version of the game that exercises the techniques.

Tetris® is a trademark of The Tetris Company. This is non-commercial accessibility research; no Tetris Company assets are used.
