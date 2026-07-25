# Tetris, Accessibility, and Accessible Game Design — Research Notes

*Reference notes gathered July 2026 for the Accessible Tetris project. Web sources verified at time of writing; each section closes with what the material means for this project.*

---

## 1. Tetris as an object of study

Tetris is one of the most-studied video games in cognitive science, and the findings bear directly on what an accessible rendering must preserve.

**Epistemic action.** Kirsh and Maglio's landmark study, [On Distinguishing Epistemic from Pragmatic Action](https://onlinelibrary.wiley.com/doi/abs/10.1207/s15516709cog1804_1) (*Cognitive Science*, 1994; [PDF](https://adrenaline.ucsd.edu/kirsh/Articles/CogsciJournal/DistinguishingEpi_prag.pdf); see also [Some Epistemic Benefits of Action: Tetris, a Case Study](https://escholarship.org/uc/item/6sh2w26v)), used Tetris to distinguish *pragmatic* actions (which advance the goal) from *epistemic* actions (which change the mental task). Their key observation: expert players physically rotate pieces on screen rather than rotating them mentally — using the world as its own model because external rotation is cheaper than internal simulation.

*Implication for us:* an accessible Tetris must keep epistemic action cheap. A blind player cannot glance-and-rotate, so every rotation must immediately re-present the fit information (our musical sonar re-scans on rotation — that re-scan **is** the epistemic action's payoff, restored in another design space). Any design that makes the player *ask* for fit information after every rotation has re-imposed the internal-simulation cost the experts' behaviour shows players avoid.

**Visuospatial load.** Emily Holmes and colleagues have shown that playing Tetris shortly after trauma reduces subsequent intrusive memories, precisely because the game *consumes visuospatial working-memory resources* that would otherwise consolidate visual imagery ([Oxford, 2017](https://www.ox.ac.uk/news/2017-03-28-tetris-used-prevent-post-traumatic-stress-symptoms); the original ["cognitive vaccine" study](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2978094/); [Cambridge follow-up with healthcare workers](https://www.cam.ac.uk/research/news/tetris-gameplay-treatment-helps-reduce-traumatic-flashbacks-for-frontline-healthcare-workers); a [2025 multi-lab replication](https://online.ucpress.edu/collabra/article/11/1/130791/207825/Evidence-That-Tetris-Reduces-Immediate-but-Not) confirming immediate but not longer-term effects).

*Implication for us:* this is independent experimental confirmation of the case study's central claim — Tetris is an intensely *visuospatial* task. A sonic rendering is not translating decoration; it is re-housing the game's entire cognitive substance in another modality. It also raises a genuinely open research question: does *audio* Tetris load spatial working memory the way visual Tetris does? Nobody appears to have asked.

**The Tetris effect** — the game's well-known intrusion into imagery and hypnagogic thought — is further evidence of how deeply its pattern-matching engages spatial cognition.

---

## 2. Prior work on accessible Tetris specifically

The direct prior art is thin, which is itself a finding: Tetris is routinely cited as an example of a game that is *hard* to make accessible, and most attempts have either simplified the game or moved it out of real time.

- **[A Tetris Game for the Visually Impaired Utilizing Sound](https://www.researchgate.net/publication/258832013_A_Tetris_Game_for_the_Visual_Impaired_Utilizing_Sound)** (also [on Academia.edu](https://www.academia.edu/5190925/A_Tetris_Game_for_the_Visual_Impaired_Utilizing_Sound)) — the closest academic relative. Notably, it made the game tractable by *simplifying the rules*: reportedly supporting only one kind of piece and using sound to locate holes. That is a legitimate experiment and an instructive contrast: our position (inherited from the PhD work) is that the *full* game must survive adaptation — a one-piece Tetris is not Tetris, in the same way the maps project refused to drop features for blind users. The paper validates the problem and the sonification instinct while marking exactly the compromise we refuse.
- **[Sightlence](https://www.diva-portal.org/smash/get/diva2:817303/FULLTEXT01.pdf)** (Mathias Nordvall) — a haptic translation of **Pong** for deafblind players, communicating the whole game state through game-pad vibration. Not Tetris, but the nearest serious exploration of the *haptic* design space for a real-time arcade game, and a demonstration that full-state translation into a low-bandwidth channel is possible when the game is simple enough. Tetris's five concurrent channels are a different order of problem — which is why the haptic view remained out of scope in the PhD work and remains so here. ([Overview coverage](https://newatlas.com/haptic-tech-vr-wearables-games-sightlence/35616/).)
- **[Inverse Tetris with Braille output](https://forum.audiogames.net/viewtopic.php?id=13329)** (AudioGames.net forum) — a community project driving individual dots of a braille terminal as a 20×4 pixel display. A wonderful reminder that refreshable braille is a *graphical* device if you squint — though its resolution and refresh rate make real-time Tetris marginal.
- **[Audio Game Hub](https://www.audiogames.net/db.php?id=Audio+Game+Hub)** — the AUT-built mini-game collection includes **Blocks**, a Tetris-styled arrangement game playable entirely by audio; the associated research thesis, [“Nobody makes games for us”](https://www.academia.edu/45114892/_Nobody_makes_games_for_us_An_investigation_into_the_independent_design_of_audio_games_through_the_development_of_the_Audio_Game_Hub_and_Blind_Cricket), documents the design process and reports 130,000+ downloads across the Hub and Blind Cricket — evidence of real demand.
- **VI-Bowling / VI-Tennis** (Folmer et al.) — not Tetris, but the canonical demonstrations of translating Wii-era motion games into vibrotactile + audio form; frequently cited as the methodological template for "same game, different channel" adaptations.

*Implication for us:* nobody has published a **full-rules, real-time, spatial-audio Tetris**. The niche the PhD work aimed at in 2009 is still open in 2026.

---

## 3. The audio-game lineage

The tradition our sonic view joins:

- **[Real Sound: Kaze no Regret](https://en.wikipedia.org/wiki/Real_Sound:_Kaze_no_Regret)** (Warp/Kenji Eno, Sega Saturn 1997) — the first major commercial audio-only game, created after Eno's correspondence with blind fans; designed to give sighted and blind players *equal* access. ([Kill Screen's history of games for the blind](https://www.killscreen.com/real-sound-audiogames-blindness-shadow-history-gaming/) is a good survey of this neglected lineage.)
- **Papa Sangre / The Nightjar** (Somethin' Else, iOS 2010–11) — binaural audio-only navigation and survival; proved a mainstream audience will play in the dark.
- **[The Vale: Shadow of the Crown](https://audiomob.com/blog/six-of-the-best-audio-only-and-audio-first-video-games)** (Falling Squirrel, 2021) — modern audio-first action RPG, developed with the CNIB as consulting partner; the contemporary reference for audio combat design.
- **[AudioGames.net](https://www.audiogames.net/)** — the community's hub and database since the early 2000s; its [forum](https://forum.audiogames.net/) is where an accessible Tetris will actually be judged. [Perkins maintains a curated list](https://www.perkins.org/resource/audio-games-for-blind-low-vision-gamers/) as well.
- Recent research direction: agentic overlays such as [GamerAstra](https://arxiv.org/html/2506.22937v1) attempt to make *existing* inaccessible games playable via AI interpretation — the modern descendant of the transliteration approach the PhD case study critiques. The contrast is worth citing: retrofitted interpretation versus native abstract-model rendering.

**Mainstream milestones** — the bar for "accessible by design" in commercial games:

- **[The Last of Us Part II](https://www.playstation.com/en-us/games/the-last-of-us-part-ii/accessibility/)** (Naughty Dog, 2020) — 60+ accessibility settings; the first blockbuster completable start-to-finish without sight ([blind accessibility review](https://caniplaythat.com/2020/06/18/the-last-of-us-2-review-blind-accessibility/)).
- **[Forza Motorsport's Blind Driving Assists](https://news.xbox.com/en-us/2023/04/27/forza-motorsport-accessibility-features-blind-driving/)** (2023) — real-time racing steered by layered audio cues, developed with blind consultant Brandon Cole ([Kotaku called it a breakthrough](https://kotaku.com/forza-motorsport-xbox-blind-accessibility-options-race-1850829331)). The closest mainstream analogue to our problem: continuous spatial steering under time pressure, delivered entirely in sound.
- **[Celeste's Assist Mode](https://gameaccessibilityguidelines.com/celeste-assist-mode/)** (2018) — the design-pattern citation for *player-controlled difficulty as accessibility*: game speed, invincibility, stamina — presented respectfully and without judgement.

*Implication for us:* Forza validates layered real-time audio steering; Celeste validates our mixing-desk/preset philosophy (player-defined information density *is* player-defined difficulty); TLOU2 set the expectation that full completion, not a side-mode, is the goal.

---

## 4. Accessible game design in general

**Guidelines and frameworks:**

- **[Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/)** — the practitioner standard: basic/intermediate/advanced best practices across motor, cognitive, vision, hearing, and speech.
- **[AbleGamers' Accessible Player Experiences (APX)](https://accessible.games/certified-apx-practitioner-course/)** — pattern-based design approach ("access patterns" and "challenge patterns"), with certification.
- **Xbox Accessibility Guidelines (XAGs)** — Microsoft's testable per-platform specifications.
- **[CVAA](https://ablegamers.org/cvaa/)** — the US 21st Century Communications and Video Accessibility Act applies to communication functionality in games (chat, invites, and their UIs); the [IGDA GASIG demystifier](https://igda-gasig.org/what-and-why/demystifying-cvaa/) is the clearest practitioner summary. Our game has no communication features, so CVAA is context rather than obligation.
- **[IGDA Game Accessibility SIG](https://igda-gasig.org/how/for-developers-researchers/)** — the long-running hub connecting research and practice; good bibliography.

**The research corpus:**

- **[Yuan, Folmer & Harris, "Game accessibility: a survey"](https://www.cse.unr.edu/~fredh/papers/journal/29-gaas/paper.pdf)** (*UAIS*, 2011) — the canonical survey. Its interaction model — a player must be able to (1) **receive stimuli**, (2) **determine responses**, (3) **provide input** — remains the cleanest frame for analysing any game's barriers. Tetris under this model: stimulus is near-purely visual (barrier 1 for blind players), response determination is high-load spatial reasoning under time pressure (barrier 2, and the one simplified variants dodge), input is simple keys (barrier 3 is comparatively mild — and where switch-access adaptations focus).
- **Grammenos, Savidis & Stephanidis — [universally accessible games](https://link.springer.com/article/10.1007/s10209-010-0189-5)** (FORTH; *Access Invaders*, *Game Over!*, *Terrestrial Invaders*) — "unified design" of games that adapt to player abilities rather than shipping segregated special versions. This is the same thesis as the PhD case study's abstract-game-plus-views architecture, arrived at independently in the same era; their term **parallel game universes** (differently-rendered but concurrently playable versions of one game) is precisely our Visual View / Sonic View peering.
- **[Accessibility in video games: a systematic review](https://link.springer.com/article/10.1007/s10209-018-0628-2)** (*UAIS*, 2019) and **[Game accessibility for visually impaired people: a review](https://link.springer.com/article/10.1007/s00500-024-09827-4)** (2024) — the field's growth curve; the persistent finding across both: vision receives the most research attention yet real-time action genres remain the least solved.
- **[Sonification and interaction design in computer games for visually impaired individuals](https://link.springer.com/article/10.1007/s11042-022-11984-3)** (*Multimedia Tools and Applications*, 2022) — contemporary treatment of the sonification-strategy space our metaphor library sits in.

**Sonification theory** (the older foundations, already threaded through the PhD's metaphor review): Gaver's auditory icons (everyday-sound metaphors) versus Blattner/Brewster's earcons (abstract musical motifs) — our palette deliberately uses both, waterfall-gravity being an auditory icon, the rotation motif an earcon; Walker's *Mappings and Metaphors in Auditory Displays* (ACM TAP, 2005) for experimentally-grounded polarity and scaling of data-to-sound mappings; Pirhonen/Brewster on gestural-plus-audio evaluation method.

*Implication for us:* the design already conforms to the main guideline families' spirit; the specific items to self-audit against before release are GAG's advanced vision section and the XAG audio-cue specifications. The Yuan/Folmer/Harris triad gives the evaluation structure: measure each barrier separately.

---

## 5. Open-source and public-domain Tetris implementations

Directory: [osgameclones.com/tetris](https://osgameclones.com/tetris/) and the [Tetris Wiki fan-games list](https://tetris.wiki/List_of_fan_games). Notable implementations:

| Project | Platform / language | Licence | Notes |
| --- | --- | --- | --- |
| **NullpoMino** | Java (Slick2D/Swing) | BSD | The most complete open implementation of Guideline behaviour — modes, SRS, netplay. Best reference for *rule correctness*. |
| **[Quadrapassel](https://en.linuxadictos.com/linux-versions-of-tetris.html)** | Vala / GNOME | GPL-2 | Desktop-integrated; the GNOME accessibility stack applies to its chrome but not its board. |
| **KBlocks** | C++ / KDE | GPL | Same story on the KDE side. |
| **tint / bastet / [vitetris](https://www.victornils.net/tetris/)** | C, terminal | GPL / BSD | Terminal implementations; vitetris notable for two-player and netplay. Terminal games are *incidentally* screen-reader-hostile (cell-painted "graphics"). |
| **Techmino** | Lua / LÖVE | open source | Modern multi-platform stacker with extensive modes. |
| **[tetromino](https://github.com/d-e-s-o/tetromino)**, **[andrewrk/tetris](https://github.com/andrewrk/tetris)**, [many more](https://github.com/topics/tetris-clone) | Rust, Zig, JS… | various | The long tail; useful as implementation references only. |

Two observations. First, **none of these projects treats accessibility as a design goal** — across the entire open-source stacker ecosystem, the sonic channel is decorative. The gap the PhD work identified is still unfilled in open source. Second, the healthiest use of these projects for us is as *behavioural references* (SRS kick tables, lock-delay semantics, 7-bag randomiser) — NullpoMino especially — not as codebases to extend, since our architecture (abstract game + async view bridge) is the point of the project.

---

## 6. The legal landscape

**[Tetris Holding, LLC v. Xio Interactive, Inc.](https://en.wikipedia.org/wiki/Tetris_Holding,_LLC_v._Xio_Interactive,_Inc.)** (D.N.J., May 2012) is the controlling US precedent on Tetris clones. Xio's *Mino* copied Tetris's look wholesale, arguing everything copied was unprotectable rules. Judge Wolfson held ([case brief](https://www.studicata.com/case-briefs/case/tetris-holding-llc-v-xio-interactive-inc); [Loeb & Loeb summary](https://www.loeb.com/en/insights/publications/2012/06/tetris-holding-llc-v-xio-interactive-inc)):

- **Game mechanics and rules are ideas — not copyrightable.** Falling tetrominoes, rotation, line-clearing, 10×20 wells as *rules* are free.
- **The audiovisual *expression* of those rules is protected** — and Mino's piece colours, shading, borders, board proportions, and animations were "akin to literal copying". Trade dress (the distinctive look) compounded it.
- The case is now routinely cited for look-and-feel protection in games generally.

Alongside copyright: **Tetris® is a registered trademark** of The Tetris Company, and the company has historically been vigorous about both marks and clones.

*Implications for us — worth stating precisely:*

1. Implementing the falling-blocks *mechanics* is lawful; that is settled by Xio itself.
2. Our project's entire purpose is to produce a **different expression** — the sonic rendering is original by construction, and our visual view should be deliberately original too (own palette, own proportions, own piece styling; shape-coding for colour-blind players already pushes us away from the canonical colours).
3. The **name** is the residual exposure: "Accessible Tetris" uses the mark nominatively to describe research about the game. For a published *playable* build, a distinct name with a descriptive subtitle ("*⟨Name⟩* — an accessible falling-blocks study, after Tetris") is the prudent path; scholarly commentary (the case study) sits comfortably under nominative use.
4. Non-commercial research framing, no Tetris Company assets, no Korobeiniki — all already our position.

---

## 7. Reception of novel interfaces: what the record says

*(Added after a second research pass, July 2026, on how novel UI approaches actually land with users.)*

The evidence on whether users welcome novel interaction approaches is genuinely two-sided, and the dividing line is not the novelty itself.

**When it lands well.** Evaluations of audio games designed with their audiences report strong reception — a binaural game study with blind children recorded interest ratings of 9.3/10 and usability 8.1/10 ([Accessible Games for Blind Children, Empowered by Binaural Sound](https://www.academia.edu/12039177/Accessible_Games_for_Blind_Children_Empowered_by_Binaural_Sound)); [navigational audio games measurably improved spatial-contextual learning](https://www.researchgate.net/publication/276171223_Navigational_audio_games_An_effective_approach_toward_improving_spatial_contextual_learning_for_blind_people), and racing-game sonification work (sound sliders for speed/trajectory, advance turn indicators) prefigured what Forza later shipped commercially ([sonification and interaction design review](https://link.springer.com/article/10.1007/s11042-022-11984-3)). A recurring pattern: novel audio interfaces are received *best* when the novelty demonstrably pays — entertainment plus transferable orientation-and-mobility skill — and when a training pathway exists. The field has even developed its own evaluation instruments ([usability + accessibility + gameplay heuristics for audiogames](https://www.researchgate.net/publication/304189432_Usability_Accessibility_and_Gameplay_Heuristics_to_Evaluate_Audiogames_for_Users_Who_are_Blind)), a sign of a maturing practice.

**When it fails.** The assistive-technology literature is blunt about the base rate: [roughly 30–40% of assistive devices are abandoned](https://pubmed.ncbi.nlm.nih.gov/10171664/), and the classic predictors (Phillips & Zhao, and [subsequent work](https://link.springer.com/chapter/10.1007/978-3-319-94274-2_77)) are *lack of user involvement in selection*, poor device performance, easy procurement (no investment), and failure to track changing needs; technology-acceptance modelling adds that perceived usefulness dominates adoption. Translated to novel game UIs: users do not reject novelty — they reject novelty *imposed without their voice, under-trained, or under-performing*. The [Audio Game Hub research](https://www.academia.edu/45114892/_Nobody_makes_games_for_us_An_investigation_into_the_independent_design_of_audio_games_through_the_development_of_the_Audio_Game_Hub_and_Blind_Cricket) reads the same from the community side: the resentment in "nobody makes games for us" is about exclusion from the making, not an appetite for conventional interfaces.

*Implication for us:* the seven-metaphor palette is exactly the kind of novelty this literature is about. The predictors say its fate hinges on: co-design (voice in selection), the training mode (the sonar's "once you get the idea" is a warning as much as a success), per-metaphor switchability (so a user's rejection of one metaphor doesn't abandon the whole), and honest performance measurement. All four are now commitments; the literature explains *why* they are the load-bearing ones.

## 8. Adapting timing and difficulty: modes, stigma, and the manual/automated split

**Timing adaptation is now codified practice.** The [Game Accessibility Guidelines include a specific guideline to "include an option to adjust the game speed"](https://gameaccessibilityguidelines.com/include-an-option-to-adjust-the-game-speed/) — "issues with precise timing can be alleviated very effectively with a choice of game speed (slowing the entire game down into slow motion)" — and AbleGamers' APX has a challenge pattern literally named [Slow It Down](https://accessible.games/accessible-player-experiences/challenge-patterns/slow-it-down/). Shipped examples: [Celeste's Assist Mode game-speed setting at 50–100% in 10% steps](https://celeste.ink/wiki/Assist_Mode); [Forza Horizon 5 permits 40–100%](https://gameaccess.info/forza-horizon-5-controls-and-motor-accessibility-settings/). Time dilation — the 2009 exploration's most radical-looking accommodation — is now an industry pattern with a name.

**The stigma discourse is real and instructive.** The 2019 [Sekiro "easy mode" debate](https://www.hollywoodreporter.com/news/general-news/sekiro-difficulty-easy-modes-games-1199676/) put player attitudes on display: part of the community treats difficulty as identity and reads accommodation as dilution. The accessibility community's answers matter to us: Ian Hamilton's distinction that [difficulty is about the balance between ability and barrier — accessibility is about avoiding *mismatches*](https://www.pcgamer.com/accessibility-means-more-than-just-an-easy-mode/); Steve Spohn's reframing that disabled players want [an *equal* mode, not an easy one](https://www.digitaltrends.com/gaming/sekiro-shadows-die-twice-accessiblity-equal-mode/). And the framing lesson is concrete: Celeste [changed its Assist Mode language](https://www.vice.com/en/article/celeste-assist-mode-change-and-accessibility/) after players heard the original wording as gatekeeping — the *copy* around an accommodation carries as much stigma or dignity as the mechanism.

**Player motivations research grounds the stakes.** Beeston, Power, Cairns and Barlet's studies of [players with disabilities](https://arxiv.org/abs/1805.11352) and the follow-on ["Enabled Players"](https://journals.sagepub.com/doi/abs/10.1177/1555412019893877) found that what disabled players value most is *feeling enabled — being on a level footing — playing the same games as everyone else*, not merely playing. This cuts in two directions for an accessible Tetris: it supports full-rules adaptation (same game, not a special game), and it warns that an audio version experienced as "the special version" would miss the very thing players say they want. The social meaning of an adaptation is part of its accessibility.

**Automated adaptation is the under-researched path.** The dynamic-difficulty-adjustment literature is mature on engagement — [Hunicke's foundational case](https://dl.acm.org/doi/10.1145/1178477.1178573) and the Hamlet system, [a 2018 review](https://onlinelibrary.wiley.com/doi/10.1155/2018/5681652), [ongoing method surveys](https://www.mdpi.com/2813-2084/3/2/12) — but strikingly thin on disability: DDA research optimizes flow for typical players, and little work applies it to accessibility. The industry's accessibility wins have come almost entirely from *player-controlled settings* (assist modes, speed sliders, remapping) rather than automatic adaptation. This maps precisely onto the 2009 case study's manual-versus-automated split — and the record suggests the manual path won for a reason the abandonment literature explains: automated adaptation removes exactly the user control and voice whose absence predicts rejection. The automated path remains open as research, with the same caution the case study attached to it in 2009.

## 9. What this changes or confirms for the project

**Confirmed by the literature:**

- The **full-game principle**. The one clear academic predecessor simplified Tetris to make it audible. Grammenos's unified-design school and the maps project's feature-parity rule both say the same thing: adaptation must not amputate. Our design carries the whole rule set.
- The **layered/preset mixing desk** — independently validated by Celeste's assist mode (difficulty as player-controlled configuration) and by Forza's layered cue system (concurrent audio streams with player-tunable verbosity).
- **Spatial audio as a viable real-time channel** — Forza's Blind Driving Assists are proof at commercial scale, in a harder real-time domain than ours.
- **Training modes matter** — recurrent finding from Audio Game Hub research through Forza's development; our musical-sonar field note ("it works — once you get the idea") said the same in 2009.

**Sharpened by the literature:**

- **Epistemic action framing** (Kirsh & Maglio) gives us the theoretical language for why the sonar must re-scan on rotation *without being asked* — preserving cheap epistemic action is a design requirement, not a nicety.
- **Evaluation design**: Yuan/Folmer/Harris's receive/determine/input triad structures what to measure; Holmes's work suggests a genuinely novel research question (does audio Tetris load spatial working memory like visual Tetris?) that could interest collaborators beyond accessibility.
- **Naming decision** to make before any playable release (see §6.3).

**Added by the second pass (reception and adaptation):**

- **Time dilation is legitimized** — GAG's game-speed guideline and APX's "Slow It Down" pattern make the 2009 build's 300→4000 ms accommodation an instance of a now-codified pattern, with Celeste (50–100%) and Forza Horizon 5 (40–100%) as shipped precedents. Speed belongs in the demonstrator as a visible, first-class percentage setting, not a buried timeout.
- **Framing language is part of the design** — Celeste's assist-mode wording change is the citable precedent: the mixing desk, presets, and speed settings must be presented in neutral, empowering copy, never as diminished ways to play.
- **"Level footing" is the metric that matters** — Beeston/Power/Cairns: disabled players value playing the *same* game as everyone else. Full-rules adaptation supports that; a "special version" feel would defeat it, whatever the rendering quality.
- **Novelty survives by voice, training, and switchability** — the AT-abandonment predictors (user involvement, training, performance, changing needs) name exactly why co-design, the training mode, and per-metaphor toggles are load-bearing.
- **The automated-adaptation gap** — DDA-for-accessibility is under-researched; the manual path (player-controlled settings) won in practice. The case study's 2009 skepticism about the automated approach reads as prescient, and the gap is a possible future research direction from a working demonstrator.

**Open niche, confirmed:** no full-rules, real-time, spatial-audio Tetris exists in the academic record, the audio-games community, or the open-source ecosystem. The project has the field to itself — which also means no prior art to lean on where our metaphors get hard.

---

*Compiled July 2026. Companion to [the case study](case-study.md) and [the engineering design](../design/DESIGN.md).*
