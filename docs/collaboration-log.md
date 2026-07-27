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

## 2026-07-27 — domains before bridges

### C2 · correction · Bob corrected Claude
**The programme put a bridge before either model it joins had a population.**
`DEMOS.md` had the cradle built with the request/answer bridge in it from the
start. Bob's objection was methodological: to have a bridge you need models with
populations, so each domain must be considered independently and populated well
enough to test on its own terms. Issue #5 is therefore not the next question at
all — it is a bridge question, unanswerable until the domains either side stand
up, and Bob's decision to *assume* it composes for now is safe precisely because
nothing yet depends on the answer.

*Assessment: Claude had the Shlaer-Mellor framing available — the case study says
outright that the five layers are structurally an SM domain chart — and did not
apply it. This is a different failure mode from C1. C1 was missing information;
this was having the information and not drawing the consequence. For the
experience report, that distinction is worth keeping: retrieval and inference
fail separately.*

### D8 · decision · Bob, refined by Claude
**Start with the Render Model and the User/Capability domain.** Bob's call, on
the grounds that representations of modalities and metaphors are where the Tetris
research actually lies, and capability is needed to select modalities correctly.

Claude agreed with both and refined the sequencing in `design/DOMAINS.md`: the
Render Model is the *most* bridge-dependent domain of the eleven, so entering it
directly means starting where least can be tested alone. The refinement is to
enter it the way the thesis itself did, by hand-populating a concrete Application
Model as a fixed point and working backwards to find what would have caused it.

*The method is quoted from the note's own introduction. Claude did not invent it;
it was recovered from the source and applied to a different domain. Recorded as
recovery rather than contribution.*

### D9 · decision · Claude
**Populate the Interaction Model first.** Zero dependencies, smallest, and it
constrains everything downstream, since a metaphor is a choice about how to use a
medium's properties and until those are declared there is nothing to select
against. It also completes the part of the note that trails off into "shown in
XXX", so it is new work and is marked as such. Risk recorded in DOMAINS.md §7:
Claude may be over-weighting this because it aligns with the palette argument
already published in the LinkedIn article, and convergence is satisfying without
being evidence.

### D10 · decision · Bob
**Licensing: all code GPL-3, all documents CC BY-SA.** `LICENSE` (GPL-3.0 full
text) at the root; `docs/LICENSE` and `design/LICENSE` carrying the CC BY-SA 4.0
notice with attribution and the Tetris trademark note.

---

## 2026-07-27 — the user model

### S1 · source · Bob supplied
**"User Capability in an Adaptive World"** (Dodd, Green, Pearson; MSIADU'09,
Beijing). Bob supplied it on noticing that the plan would need the user model.
It turns out to specify most of step 2 outright.

*This is the second time a supplied source has changed the plan materially, and
the pattern from C1 repeats: the published CISNA page and the case study
between them do not mention that the user model is three models with full
information models behind them. The AI was again working with an accurate but
incomplete picture and had no way to know it was incomplete.*

### C3 · correction · the source corrected Claude
**"The Capability Model" is three models.** `DOMAINS.md` and `DEMOS.md` both
treated user profiling as a single domain to be designed. It is Capability
(definitions), Capacity (a user's settings across contexts) and Preference (an
organization of content, not a container of values), each with a published
Shlaer-Mellor information model.

Consequence under §6a: most of step 2 moves from **MY CHOICE** to **MODEL
SPECIFIES**, which raises the bar. Departures now have to be justified rather
than simply made, and "I designed this" would have been a false claim.

### N2 · note · Claude observed
**Two things in the paper matter more for Tetris than they did for its own
worked example.**

*Composite Property with Composition Order*, introduced for usable audio
frequency range as ordered ranges with gaps between them. A listener with
notched hearing loss is expressible; a single min/max is not. That is directly
load-bearing for a sonic demonstrator.

*Functional dependency through Actions.* Settings that change in response to
External Influences, which the paper says is what makes a model adaptive rather
than static. Two Tetris cases fall straight out: listening fatigue, following
the paper's own `focusDuration` / `trackingDuration` pattern for vision; and
environment, since usable azimuth resolution in a quiet room is not usable
azimuth resolution on a bus.

### G3 · gap · Claude identified
**The two Adaptation Model figures do not match** (issue #6). The Render Model
note has Attribute Value Type, Instance Application, Application Order; the
MSIADU'09 paper has Data Type, Instance Sequence, Sequence No. Probably the
same model renamed across time, but *Instance Application* and *Instance
Sequence* are not obviously synonyms, and the Render Model note carries ordering
separately in Application Order, which would be redundant if the container were
already a sequence. Provisionally following the Render Model note because it is
the only source with a worked XML population. Bob wrote both and should confirm.

### N3 · note · Claude observed
**The two papers join up across a gap one of them names.** MSIADU'09 §7 says
that bridging preference and settings across domains "implies that there is a
missing abstract model of the underlying application". The Render Model note
later supplies exactly that, as the Application Model. Worth recording for the
write-up: the earlier paper identifies the hole, the later one fills it.

---

## D11 · decision · Bob decided, Claude agreed and added a reason

**2026-07-27. Adaptation Model vocabulary: follow MSIADU'09** (issue #6, closed).
`Instance Sequence` over `Instance Application`, `Sequence No` over
`Application Order`, `Data Type` over `Attribute Value Type`.

Bob's reasons: it is the later publication, so it is the citable one, and it is
easier for non-modellers to follow, which matters for a cradle meant to be read
and reimplemented.

Claude added a third: **"Application" is overloaded across the two sources.** The
Render Model note uses it for the *Application Model* (rendered content) and for
*Instance Application* (the adaptation mechanism) — unrelated concepts, one
word, one system. In code, `applicationOrder` sitting beside `ApplicationModel`
is a standing invitation to misread. This point was not in Bob's reasoning and
is the strongest of the three.

**Claude also withdrew a claim.** Issue #6 as filed suggested the two models
might differ semantically, because the Render Model's separate `Application
Order` would be redundant if its container were already a sequence. Wrong:
MSIADU'09 carries `Sequence No` in exactly the same way. Both have a container,
an associative instance-to-apply, an explicit ordering attribute, and Instance.
They are isomorphic. *Recorded because the log is worth nothing if it only keeps
the claims that survived.*

## N4 · note · Claude, asked for an opinion on 17-year-old models

Bob asked whether either Adaptation Model is still a good idea, noting the newest
is 17 years old. Assessment:

**The mechanism has aged well, because it was never novel.** Ordered
add/modify/delete applied as transactions is the database-transaction metaphor
the paper explicitly names as its source. The same metaphor underlies event
sourcing (state as an ordered log, folded to a projection), JSON Patch
(RFC 6902, standardised 2013, with the same operation set), git commits, and
JavaScript's own prototype chain, which is literally "Fred is like Jim except".
The honest framing is convergence on a well-established idea, **not prescience**;
claiming the paper anticipated event sourcing would overstate it.

**Recommendation: keep the model, name the correspondences.** Replacing it with
JSON Patch or an event-sourcing library would demonstrate JSON Patch, and the
demonstrator exists to demonstrate CISNA. But a 2026 reader who knows event
sourcing and not Shlaer-Mellor should be able to recognise what they are looking
at, so the code should say so in comments.

**Where the age does show, and it is not the Adaptation Model:** Actions in the
Capacity Model have no defined evaluation order, no cycle handling, and no
declared dependencies. Logged as issue #7 with a proposal to treat functionally
dependent Settings as a derivation graph evaluated in topological order, which
is what reactive systems settled on in the intervening years. That would be a
departure from the paper's "mini program" formulation and would be recorded as
one.

## C4 · correction · Bob corrected Claude, and the method beat the modern import

**2026-07-27.** Claude proposed (issue #7) fixing the unspecified evaluation
order of Capacity-Model Actions by borrowing from reactive systems: declare
reads and writes, evaluate in topological order, reject cycles. Bob's response
was that this is "actually very Shlaer-Mellor", that the method had **Action
Data Flow Diagrams** for exactly this, and that ADFDs were how actions in Moore
state models were described. He asked Claude to research it and check he was not
mis-remembering.

**He was not.** Verified against Wieringa & Saake, *Formal Analysis of the
Shlaer-Mellor Method*, Requirements Engineering (1996) 1:106–131, reproducing
figures from Shlaer & Mellor's *Object Lifecycles* (1991):

- ADFDs describe actions: "an action data flow diagram (ADFD) that is specified
  for each action in each state model and which shows which processes are
  performed during the action" (p.108).
- State models are Moore: "State models in OOA use the Moore convention"
  (Fig. 5 caption, p.114).
- Order is dataflow: Fig. 10 (p.119) shows processes connected by labelled data
  flows over data stores. A process runs when its inputs arrive.

**Why this entry matters more than the others.** Every previous correction was
the human supplying information the AI could not have had (C1, C3) or catching
an over-generalisation (X1). This one is different: Claude reasoned to a
*correct* answer by the wrong route. The proposal was right in substance and
wrong in provenance — presented as importing a modern idea, when the parent
method had specified it in 1988 and the 2009 paper had *lost* it by describing
Actions as "mini programs".

For the demonstrator that distinction is not cosmetic. Under §6a the revised
approach is **MODEL SPECIFIES**, by way of the parent method, rather than MY
CHOICE. Had this gone unchecked, the write-up would have claimed a modern
contribution where there was a restoration, which is the exact failure mode §6a
exists to prevent, arriving from a direction §6a did not anticipate: not
inventing what the model lacked, but failing to notice the model already had it.

*Generalisation for the experience report: an AI trained largely on current
practice will reach for current practice, and will reach for it even when the
domain's own older literature holds the same answer with better provenance. The
answer being right disguises the error. The human's contribution here was not
knowledge Claude lacked access to, but knowing where to look.*

**Also surfaced:** the same paper criticises OOA for allowing an action to change
attributes of any object, "at odds with the object-oriented principle of
encapsulation" (p.120), and proposes a locality restriction, splitting actions
with remote side effects into cooperating local ones. Directly applicable, since
unrestricted cross-object writes are how the Action tangles arise in the first
place.

## C5 · correction · Bob corrected Claude for trusting a critic over the method

**2026-07-27.** Having researched ADFDs (C4), Claude went further and endorsed a
*criticism* found in the same paper: Wieringa & Saake's claim that OOA letting an
action change any object's attributes is "at odds with the object-oriented
principle of encapsulation", together with their proposed locality restriction,
which Claude called "worth adopting".

Bob's response: the authors do not fully understand Shlaer-Mellor. The event
model's run-to-completion semantics is what makes global access safe, so
encapsulation is unnecessary; SM is not the Booch/Rumbaugh model of classes and
objects; it transcodes as naturally to C as to any OO language; and it has an
explicit "is a" subtyping relation without formal polymorphism. He supplied Neil
Lang, *Shlaer-Mellor Object-Oriented Analysis Rules* (ACM SIGSOFT SEN 18(1),
Jan 1993) — Project Technology, i.e. Shlaer and Mellor's own company.

**The primary source contradicts the critique flatly.**

- **Rule 70** requires that cross-object data access be recorded on an **Object
  Access Model**. The method does not forbid it; it gives it a dedicated
  derivative model. The introduction pairs them: the Object Communication Model
  summarises *asynchronous* communication, the Object Access Model summarises
  *synchronous* access. Both first-class deliverables.
- **Rules 35–37** put consistency at action completion: data "self-consistent
  upon completion", relationships made consistent, subtypes and supertypes left
  consistently populated. The action is the unit of consistency, which is exactly
  what makes global access safe without encapsulation.
- **Rule 56** states the dataflow semantics outright: "A process executes when
  all of its data inputs and control inputs are available."
- **Rule 61** gives the four process types: accessors, transformations, event
  generators, tests.

Wieringa & Saake's own stated reason for the restriction was that "communication
is almost trivial to formalize if we require actions to have local effects only"
— a convenience for their formalism. Claude relayed it as a finding about the
method.

**The failure mode, and it is the most instructive one yet.** Claude weighted
source authority by *form* rather than by *provenance*. A peer-reviewed
formalisation paper in Requirements Engineering looks authoritative: formal,
citable, published. But it is an outsider's reconstruction with its own agenda,
and where it disagrees with the method's own normative rules, the method wins.
The tell was visible in the text Claude had already quoted — the authors say "for
these reasons, we will add the restriction" — and Claude quoted that sentence
without registering that a paper *adding* a restriction is not a paper
*documenting* one.

*Generalisation for the experience report: an AI asked to research a method will
find secondary literature more readily than primary, because secondary
literature is more indexed, more recent, and more often open-access. It will
then treat critique as description. The correction required someone who knew the
method well enough to say "that author has misunderstood this", which is
precisely the knowledge that cannot be recovered from a search.*

**Consequence for the build.** The locality restriction is dropped. Functionally
dependent Settings are ADFDs under rules 56, 57, 61; cross-domain access is
permitted and recorded on an Object Access Model per rule 70. §6a state is
**MODEL SPECIFIES**, citable to a normative source.

## S2 · source · Bob, from practice: polymorphic events at Ascom, 1995

**2026-07-27.** First-hand history, not documentation. Bob's team at Ascom needed
polymorphic events in 1995 and improvised: **supertype keys and labels were
allowed to appear in subtype state models**, so state was modelled *only* in the
subtypes. This avoided parallel state models in super and subtype and the work of
knitting them together.

His framing, unprompted: *"for our own benefit and ease of transcoding, not the
method."*

**Why that sentence matters more than the technique.** It is precisely the
distinction Claude failed to make in C5, where Wieringa & Saake's adaptation
("for these reasons, we will add the restriction") was relayed as though it
described the method. Bob applies the label reflexively to his own work. The §6a
three-state discipline is in large part an attempt to write down a habit he
already has, which is worth saying plainly in the experience report: the
discipline was not imported to manage the AI, it was extracted from how the human
already works.

**Convergence with OOA96.** The ooatool technical note on polymorphic events
describes OOA96's mechanism as letting a supertype object define a polymorphic
event "which is mapped to events associated with subtype object lifecycle
models" — supertype label, subtype lifecycle. That is the Ascom improvisation,
reached independently and roughly a year earlier. *Not verified against the OOA96
report itself: ooatool.com fails its TLS handshake, so this rests on the
secondary note. Flagged rather than asserted, given C5.*

**Applicability to this project, and it is immediate.** The Capability Model has
`Property` with five subtypes (Boolean, Discrete, Numeric, Numeric Range, Text)
plus Composite; the Capacity Model mirrors them with matching `Setting` subtypes.
That is exactly the configuration where the super/subtype state question arises.
"Model state only in the subtypes, let supertype labels appear there" is a
production-tested answer, and preferable to Claude reasoning one out.

**Lineage note.** Ascom already appears in this project: DESIGN.md §2 credits the
request/answer bridge rules to "the Ascom lessons". So the telephony discipline
behind the bridge and the Shlaer-Mellor practice behind the models come from the
same workplace and period. Worth drawing out in the write-up, since the case
study currently presents them as separate inheritances.

## X1 · disagreement · Bob corrected Claude's conclusion, not its facts

**2026-07-27.** After C3, Claude concluded that the working practice should be
"asking what else exists before designing anything". Bob rejected the
generalisation:

> "Thinking aloud / creating content without full knowledge often elicits
> discoveries. When you are not encumbered by the baggage of existing knowledge
> and practices you can free-think. Eventually you need to come back to earth
> and reflect, but there is value in the activity so long as you don't overdo
> it."

His evidence is **Sign16**: knowing little sign language, he devised a way of
recording sign *as a performance*, from watching signers communicate. Knowing
the words and grammar well, the idea would not have come. The reframe from
language-with-grammar to performance-to-be-recorded is only reachable from
outside the field.

The correction is accepted, and the finding is narrowed rather than dropped.
Claude had generalised from two instances of one kind of task to all tasks:

- **Generative work benefits from naivety.** Inventing a representation, a
  metaphor, a framing. Prior art narrows the search space; not knowing it lets
  you look where the informed do not. Sign16 and the seven sonic metaphors are
  both this.
- **Reconstructive work is punished by it.** Rebuilding or extending something
  that already has a specified shape. C1 and C3 were both reconstructive: the
  free-thinking produced a plan to discard, not a discovery.

**This project already contains a case that refutes the original conclusion.**
The seven dimensions of audible meaning were derived while writing the LinkedIn
article, in ignorance of the Interaction Model's existence. Arriving
independently at the same structure is worth *more* than deriving it from the
source, because it is corroboration rather than transcription. N1 recorded this
as "convergence rather than a result", which undersold it. Had the source been
read first, that evidence would not exist.

So the practice is not "check first". It is:

1. **Mark the epistemic status of your own reasoning.** The cost of C1 was not
   the thinking, it was that the output read as a settled plan rather than as a
   reading of partial material. The §6a three states apply to Claude's
   reasoning, not only to the model.
2. **Reflect before commitment cost compounds, not before thinking.** Discarding
   a plan is cheap; discarding a populated model with tests is not. The check
   belongs at the point of building on an assumption, which is later and rarer
   than "before designing".

*Recorded as a disagreement because it is one: the facts of C1 and C3 stand, and
the inference drawn from them did not.*

---

## Standing observations for the experience report

Written as they become visible, and expected to change:

- **Naivety is an asset in generative work and a liability in reconstructive
  work.** See X1. The failure mode is not ignorance but *unmarked* ignorance:
  output that reads as settled when it is exploratory.
- **Published summaries are not a substitute for unpublished sources — for
  reconstruction.** C1 and C3 are the instances, both cases of rebuilding
  something with an existing specified shape. This does not generalise to
  invention.
- **The AI is better at finding gaps than at knowing what is missing.** G1, G2
  and G3 were all found by reading sources closely, but only once the sources
  were supplied. Nothing prompted Claude to ask whether a runtime model or a
  user-capability model existed.
- **Independent derivation is evidence; derivation from the source is
  transcription.** The palette and the Interaction Model converged because they
  were arrived at separately. Reading first would have destroyed the
  corroboration.
- **Reframing beats answering.** D3, where the human rejected the question
  rather than the options, and got a better result than either option offered.
