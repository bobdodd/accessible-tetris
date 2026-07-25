# Accessible Tetris

An accessible version of the classic game of Tetris, rendered in sound as richly as in pixels — spatial audio, musical sonification, and a first-person listening experience — running in an ordinary web page.

This project continues research begun in my PhD, which used Tetris as a case study in adapting user-interface content to user capability. The game was chosen to be difficult: real-time, animated, and built on exactly the kind of proximal, spatial content that screen readers cannot transliterate. The original implementation (Java + OpenAL, circa 2009) proved the architecture; this project rebuilds it on the modern web platform, where the Web Audio API finally provides binaural spatial audio worthy of the design.

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

Documents and design first; implementation follows the build order the case study argues for — timbres, then terrain scan, then the spatial stage, then the game.

Tetris® is a trademark of The Tetris Company. This is non-commercial accessibility research; no Tetris Company assets are used.
