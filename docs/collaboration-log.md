# Collaboration log

Evidence for the experience report on working with an AI as a research
assistant rather than as an analysis-and-summary tool.

**Why this file exists.** A claim that an AI acted as a first-class collaborator
is worth nothing unless a reader can check it. This log records what was
decided, who decided it, on what reasoning, and — where it is known — whether
the decision turned out to be right. It is written as work happens, because the
interesting entries are the corrections, and corrections do not survive
reconstruction: they get smoothed into a narrative where the right answer was
reached without the wrong one first.

**Roles.** *Bob* sets direction, supplies domain knowledge and the research
history, and holds the final say. *Claude* is asked to make reasoned calls
rather than defer everything upward, and to disagree where it has grounds.
Neither role is decorative, and this log should be able to show that either way
— including where the AI was a liability.

**Honesty rules for this file.** Entries are added as things happen and are not
revised afterwards to look better. Wrong calls stay in. Where an entry is
written after the fact, it says so. Attribution is accurate: a decision Claude
made is not later described as Bob's, and vice versa.

**Categories.** `decision` (a call taken), `correction` (someone was wrong and
was put right), `disagreement` (a position pushed back on), `gap` (something the
source material does not answer).

---

## 2026-07-26 — programme design

### D1 · decision · Claude proposed, Bob accepted
**Build the CISNA cradle first, before any modality proof-of-concept.**
`DESIGN.md` §8 already fixed a de-risking order that tested the riskiest
metaphors first. Claude proposed keeping that order but changing the packaging,
because §8 as written produced throwaway sandboxes and left the architecture —
the actual contribution — arriving fifth and invisible until nearly finished.
Bob accepted, and his framing of the framework question (below) strengthened it.
*Outcome: open.*

### D2 · decision · Claude proposed, Bob accepted
**Drive the cradle with a scripted event tape.** A demonstrator does not need a
working Tetris to emit `piece.spawned`. This decoupled the modality work from
the FSM work entirely and is what made D1 practical rather than merely tidy. The
second reason emerged while writing it up: a tape is deterministic, so A/B
comparison of two timbre sets runs against an identical board and an identical
fall. Without that, any listening comparison is confounded by the material
changing underneath it. *Outcome: open.*

### D3 · decision · Bob
**Vanilla, and if a framework is needed we write a trivial one ourselves.**
Claude had asked vanilla-or-framework as a straight either/or. Bob's answer
reframed it: the cradle *is* the framework, and its value is that somebody can
read it and reimplement the pattern in React or Vue. That is a stronger position
than the question allowed for, and it changed the cradle from scaffolding into a
deliverable. *Recorded as a case where the human's answer was better than the
options offered.*

### D4 · decision · Bob
**Total honesty; treat and write up as research.** Negative results publish.
Claude had raised this as a question with a recommendation; Bob's answer was
unequivocal and became `DEMOS.md` §6.

---

## 2026-07-26 — the runtime model

### C1 · correction · Bob corrected Claude
**Claude had planned a cradle that was only half of CISNA.** The plan treated
the five layers as the whole model. Bob pointed out that there is a runtime
model that goes with the CISNA tree, and that the cradle is essentially both.
Claude had read the published CISNA page and the case study and had *not*
inferred this; the plan would have been built wrong and would have had to be
redone once the omission surfaced.

Bob then supplied *Notes on The Render Model*, which pairs the Document Model
with a Runtime System: Adaptation with User Profiling, Semantics with the Render
Model, plus a Composition Model, with Inventory split into Document and Runtime.

Three things in the plan were wrong as a direct result:
- Renderers were to consume the event stream. In fact the runtime populates an
  **Application Model**, and renderers consume that.
- Metaphors had been treated as one mechanism among several. The note is
  explicit that metaphors *specify* rendering where Dexter/Amsterdam
  Presentation Specifications only *hint* — which is this project's own argument
  stated in the model's vocabulary.
- Adaptation had been modelled as capability-driven selection. It is
  event-triggered ordered **instance application**, with a worked XML form.

*Assessment for the experience report: this is the clearest case so far of the
limits of working from published summaries. The public CISNA page describes the
five layers accurately and does not mention the runtime, so no amount of careful
reading of available sources would have produced the right architecture. The
correction required the human's memory of unpublished work.*

### G1 · gap · Claude identified
**The Render Model note is unfinished.** Its Navigation section is a heading
with no content, and the Interaction Model extension points at a figure
described as "shown in XXX" that was never drawn. Logged as issue #4. Matters
because Tetris has real Navigation-layer traversal (tile, silhouette, next,
hold) and the maps rotor is a Navigation-layer construct.

### G2 · gap · Claude identified
**The bridge and the Render Model may not compose.** The request/answer bridge
has the game driving and views answering, with the clock waiting on rendezvous.
The Render Model has events driving population, and nothing in it ever waits for
a renderer. Suspicion recorded in issue #5: the 2009/10 model was built for
content that is populated then presented, whereas Tetris needs content populated
then continuously updated under time pressure. *Unresolved; flagged before
writing code rather than discovered during it.*

### D5 · decision · Bob
**Expect inaccuracies and conflicts in the 2009/10 work.** Bob warned that the
work was experimental and stopped before it was a working system. Claude
proposed, and Bob accepted, the §6a discipline: three states always
distinguished (*the model specifies this* / *the model is silent and this is my
choice* / *the model says something that does not work*), conflicts logged as
issues before they become code, and no retrofitting of completed gaps as though
the model had said so all along. The hazard being guarded against is a
demonstrator that appears to prove CISNA while having quietly invented the
missing parts.

---

## 2026-07-27 — semantics

### D6 · decision · Claude
**Declare the event vocabulary rather than let it emerge from the tape**
(issue #1, closed). Reasoning: the note's Semantics Layer carries a Concept
Ontology scoping the meaning of Nouns; if the vocabulary were undeclared, the
Composition Model's rule sets would become the only place meaning is defined,
inverting the model; and an undeclared vocabulary cannot be audited, which
matters when the collaboration itself is under examination. Mitigated by
starting small and versioning the vocabulary so a tape records what it was
written against. *Outcome: open.*

### D7 · decision · Claude
**A game event is a Statement.** Figure 6 gives Statement a relationship to
Rule and to Notion, which is the shape an event needs: it asserts that something
permitted happened, and it bears on the content that expresses it. The
alternative was to treat events as a mechanism outside the Semantics Layer,
which would have put the most important thing the game produces outside the
model that is supposed to describe it. The note's worked example was static
content and never had to answer this. *Recorded in `cradle/document/semantics.js`
under MY CHOICE. Outcome: open — reversible if the Render Model turns out to
need Statements to be something else.*

### N1 · note · Claude observed
**The palette and the Interaction Model are the same structure.** The roughly
seven dependable dimensions of audible meaning, arrived at while writing the
LinkedIn article, are Interaction Properties of the Sonic Interaction Space in
the Render Model note's Interaction Model, and metaphors select against them.
Two independent routes to one structure. Worth noting for the write-up as
convergence rather than as a result.

---

## Standing observations for the experience report

Written as they become visible, and expected to change:

- **Published summaries are not a substitute for unpublished sources.** C1 is
  the strongest instance: correct public documentation was insufficient, and the
  gap was invisible from inside.
- **The AI is better at finding gaps than at knowing what is missing.** G1 and
  G2 were both found by reading the source closely, but only once the source was
  supplied. Nothing prompted Claude to ask whether a runtime model existed.
- **Reframing beats answering.** D3 is a case where the human rejected the
  question rather than the options, and got a better result than either option
  offered.
