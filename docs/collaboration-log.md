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

**~~Convergence~~ TRANSMISSION with OOA96. Corrected 2026-07-27.** This entry
first recorded the Ascom improvisation as convergent evolution — the same shape
"reached independently and roughly a year earlier" than OOA96. **That was wrong,
and Bob corrected it:** Sally Shlaer was a consultant to his team at Ascom, as
was Kennedy-Carter in the UK, who became the method's primary evangelists after
Shlaer effectively retired with cancer.

So the 1995 work was not parallel invention. It was done *with the author of the
method*, during the window in which OOA96 was being settled — the report is
dated 960109, months after the Ascom need arose. Whether the idea travelled from
Shlaer to the team, from the team's problem into the report, or both, it is one
lineage and not two.

Verified against the report itself, §5.7: supertype S has no lifecycle model
while subtypes T, U, V do; the sender labels the event with the supertype's key
letter and true recipients use their own; a polymorphic event table maps between
them; and "the state model (if any) of the supertype object plays no role in the
routing of a polymorphic event." §5.7.3 then argues against an instance having
multiple state models — the parallel-state-model problem Bob said they were
avoiding.

*Second-order lesson for the experience report, and it compounds C5. There I
over-trusted a secondary source. Here I reached for "independent convergence" —
a satisfying, publishable-sounding explanation — when the mundane one was
transmission through a named consultant. Both errors share a root: reconstructing
history from documents alone, with no access to who was in the room. The
correction was not available in any text.*

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

## S3 · source · The OOA96 report itself (Shlaer & Lang, 1996)

**2026-07-27.** Bob supplied the primary source Claude could not fetch:
*Shlaer-Mellor Method: The OOA96 Report*, Version 1.0, Sally Shlaer and Neil
Lang, Project Technology, 960109. It supersedes portions of *Object Lifecycles*
and is described by its authors as "a mathematical system, built up of axioms,
definitions, and theorems." Three questions in this project are now settled from
it rather than inferred.

**1. Cycles. §9.1, verbatim:** "**ADFDs are directed acyclic graphs.** An ADFD
forms one or more directed acyclic graphs; loops on the ADFD are not permitted.
This was implied but not made explicit in OOA91. We do so now because this rule
was sometimes overlooked by new users of the method."

Rejecting cyclic Action graphs (issue #7) is therefore not a design decision
taken here. It is a rule of the formalism, and one the method's authors had to
state explicitly because practitioners kept missing it.

**2. Process types, tightened since Lang 1993. §9.3:** "OOA96 allows for exactly
four types of processes on an ADFD: accessors, event generators, transformations,
and tests." But §9.3.1 adds "an accessor is now the **only** process type that
can access an object data store", and §9.3.3 "a test or transformation may no
longer access an object data store."

Lang's 1993 rules 66 and 69 permitted transformations and tests to access their
own object's store. OOA96 withdraws that. Note carefully what this is *not*: it
is not the locality restriction wrongly endorsed in C5. Cross-object access
remains entirely legitimate; it is simply routed through accessors. The
constraint is on *process type*, not on *which object's data*.

**3. Dependence has three kinds, and MSIADU'09 may name the wrong one.**
Chapter 2 distinguishes functional dependence (§2.1), stochastic dependence
(§2.2), and mathematical dependence (§2.3): "An attribute Y is said to be
mathematically dependent on a set of attributes X if and only if, given values of
the attributes in X, the value of Y can be determined by a formula or algorithm."
Mathematically dependent attributes are marked **(M)** on the Information Model,
and the attribute description must "cite the formula or algorithm used to
determine the value."

*User Capability in an Adaptive World* describes Settings as **functionally**
dependent, realised through Actions. But a Setting computed from other Settings
by a stated formula is, in OOA96's vocabulary, **mathematically** dependent —
"a stronger form of dependency… We do not need access to instances in the world
being modeled." Open question for Bob, raised not assumed: does the Capacity
Model want (M)-marked derived Settings with cited formulae for the simple cases,
reserving ADFDs for Actions that genuinely process? The paper predates neither
concept, so this may be loose usage or may be deliberate.

**4. Wormholes — bearing directly on the bridge (issue #5). §9.5.2:** "we use the
wormhole symbol — a double-walled bubble — to indicate a transfer of control
between two domains", whose process description must state "what the calling
domain (server or client) expects the other domain to do (stated in the semantic
world of the caller)" and "any return communication required by the caller."
Critically: "the appearance of a wormhole on an ADFD does not prescribe whether
the communication between the domains is implemented via a synchronous or an
asynchronous mechanism."

And §5.5 forecloses the alternative: "Events generated in an action in a domain
must be received by an instance in the same domain. It is no longer permitted to
generate an event that is intended for an object in another domain."

This matters for the cradle. The CISNA layers are domains, so inter-layer
communication is wormholes, not events — and the request/answer bridge with its
rendezvous is a wormhole whose return communication is declared. The
sync/async-agnosticism of the construct is exactly the property the bridge needs.

## D12 · decision · Not beholden to Shlaer-Mellor; the Architecture domain becomes first-class

**2026-07-27.** Two constructs adopted from OOA96 on Bob's instruction —
mathematical dependence `(M)` for derived Settings (§2.3), and wormholes for
cross-domain communication (§9.5.2) — and with them a governing principle that
matters more than either.

**Bob's ruling, verbatim:** "we are not beholden to Shlaer-Mellor, and we take
from it as we need and adapt as required. If we were following it, Recursive
Design would completely change our runtime model."

**And his own methodological move**, which he notes he never made in practice
with Shlaer-Mellor itself: the Architecture and RD domains become **first-class
domains in the domain tree**, rather than the canonical arrangement in which the
Architecture domain is the translator consuming every other domain's models.

**Why it is load-bearing.** In canonical SM the Architecture domain's specialness
*is* the translation mechanism. Demote it to a peer and translation stops being
the organising principle, which is what permits a runtime interpreter instead of
a compiler — what the cradle already is. It also makes sense of CISNA carrying
both a Document Model and a Runtime System: the Runtime System *is* the
Architecture domain, modelled rather than built. And it is the same move as the
peer-relationships deviation published with CISNA in 2008, stated from the other
side.

Recorded in DOMAINS.md §1a and §1b, with a fourth §6a state added in DEMOS.md
§6b for "the parent method specifies this, it works, and we have declined it for
a stated reason".

**Worth marking for the experience report.** This is the first entry in this log
that is a positive methodological contribution from Bob rather than a correction
of mine, and it arrived immediately after two corrections in a row. The sequence
is itself the finding: three rounds of me getting the provenance wrong (C4 wrong
route, C5 wrong source authority, S2 wrong historical mechanism) forced the
question of what our relationship to the parent method actually *is* — at which
point Bob answered it with a rule that had been implicit in his practice since
2008 but never written down. The corrections were not friction on the way to the
work. They produced the governing principle.

*Generalisation: the value of the human's corrections was not that they fixed
three errors. It was that being made to justify a borrowing three times surfaced
a policy for borrowing. An AI that had been right the first time would not have
prompted it.*

## C6 · correction · I mistook the notation for the semantics; Action Language *is* the ADFD

**2026-07-27.** After three exchanges arguing that the Capacity Model's Actions
should "be ADFDs", Bob supplied the history that makes the argument moot.

**There are no ADFDs in his PhD work. There are none in the Ascom work either.**

**Why: tooling.** In the mid-90s nothing could draw them. Not even BridgePoint —
Project Technology's own CASE tool, from Shlaer and Mellor's own company — could
draw ADFDs or record them as the actions of states. A method's flagship process
construct that its own flagship tool could not represent.

**What Ascom did instead.** Replaced ADFDs with actionable pseudocode: fragments
of **TCL**, so that all modelled behaviour was Moore state models with actions
written in TCL syntax over assumed function calls. Bob's example:

    navigate(R1, R2, R3 {id:23})

— navigate from object instance 23 through relations R1, R2 and R3, returning the
set of object instances found. This let them **simulate domains without
transcribing through Recursive Design**, guaranteeing runtime event-model
conformance instead. Bob built the simulator.

**What the PhD did instead.** Needing the same thing for the adaptation layer, he
went back to the *definition* of an ADFD — that it is a **graph of actions** —
and described that graph in his own notation. **This is the origin of Action
Language.** In his words: "I didn't lose ADFDs, I changed the syntax to describe
them, and in a more generalizable way."

### The error, and it is a new species

C4 was the wrong route to a right answer. C5 was trusting a critic over the
method. S2 was inventing convergence where there was transmission. This one is
different again: **I mistook the notation for the semantics.**

I spent the thread arguing we should "adopt ADFDs", treating the diagram as the
thing to be adopted. The diagram was never the thing. The graph of actions is the
thing, and the boxes-and-arrows form was one way to write it down — a way that
was, in practice, unwritable for want of a tool. Bob had already carried the
semantics forward twice, under two different constraints, in two different
syntaxes. I was proposing to import a construct that this project has been
running an implementation of for years.

*Generalisation for the experience report, and it is the sharpest one yet: an AI
researching a method through its literature will find the method's diagrams,
because diagrams are what published papers preserve. It will not find what
practitioners did when the diagrams proved undrawable, because that lives in
tooling constraints, internal practice and memory. The literature records what a
method meant to be; only the people record what it was like to use. I had
reconstructed an idealised Shlaer-Mellor that nobody could actually practise in
1995, and recommended we adopt it.*

### What this settles

Action Language is not a candidate notation for ADFDs. It **is** the ADFD, in
generalised syntax, with direct descent. So the cradle's action notation is not a
decision to be taken; it is already made, already implemented, and already
running on the site at `/playgrounds/action-language`, with the ActionLanguage IR
in Paradise as its working descendant.

**§6a status: neither MODEL SPECIFIES nor MY CHOICE — this is Bob's own prior
work.** A category the three states did not anticipate, and now a fifth alongside
the parent-method state added as §6b. Reporting Action Language as an adoption
from Shlaer-Mellor would misattribute his contribution to the method; reporting
it as new work for this demonstrator would misdate it by twenty years.

### Verified gap in the port

Read `a11ybob/src/lib/action-language/` directly. The TypeScript port implements
the generalised core: `seq`, `declare-var`, `assign`, `read-var`, `read-const`,
`print`, `if-then-else`, `while`, `seq-return`, `literal`, `add`, `subtract`,
`lt`, `eq`, `declare-function`, `call`.

Against OOA96 §9.3's four process types it already covers two — **transformations**
(arithmetic and expressions) and **tests** (`lt`, `eq`, `if-then-else` yielding
conditional control). Absent are the two that reach outside the action:
**accessors** and **event generators**. That is the correct absence for a
general-purpose port and exactly what the cradle must add:

| To add | Source | Note |
|---|---|---|
| `navigate(R…, {id})` — relationship traversal returning an instance set | **Bob's Ascom practice** | OOA96 has no such accessor. Table 9.1 is entirely per-object-data-store; chained navigation appears only statically as composition (§3, `R3 = R1 + R2`). He added the dynamic form. |
| Accessor forms: `read`, `read where`, `find where`, `write`, `write where`, `create`, `create unique`, `create in`, `create unique in`, `delete`, `delete where` | OOA96 Table 9.1 | The minimum set any architecture must support. |
| Event generation | OOA96 §9.3.2 | One event type per generator; may not access a data store. |

Note that the method's own accessor table lacks the primitive Bob's practice
found indispensable. Worth stating plainly in the write-up rather than smoothing
over: relationships are the backbone of the Information Model, and OOA96 gives no
runtime way to walk them.

## D13 · decision · Capability and Capacity Models built and populated

**2026-07-27.** Bob: extend Action Language as needed, then "a working
capability model that we can populate with exemplars to test with:
blind-since-birth no other disability, Low vision (contrast), low vision
(colour). Perhaps keyboard only and someone with hand tremors? … to later
replace or augment with lived experience as and when available."

Built: `cradle/action/action-language.js` (the four OOA96 process types plus
`navigate`), `cradle/user/capability.js` (Figure 2), `cradle/user/capacity.js`
(Figure 3), `vocabulary/user-capability.js` (the schema), `vocabulary/profiles.js`
(six exemplars). 44 tests, all passing; 57 across the repo.

### §6a states, so the write-up cannot blur them

**MODEL SPECIFIES.** Tables 2, 3 and 4 transcribed with their values, parents
and descriptions. Ontology disjointness. Precedence as acquisition order. The
Composite Property with CompositionOrder — the frequency-range-with-gaps case is
the paper's own justification for the type and is tested as such. Settings as
first-class referenced values rather than per-context copies. Partial groups
being well-formed. Profiles as differences from a reference (§8, "Fred is like
Jim except…").

**MY CHOICE, on extension points the paper opens explicitly.**

- *A `motor` subject ontology.* The paper scopes ontologies "such as visual,
  sonic, and haptic" — an exemplary list — and says outright that "it is
  possible to imagine other groupings, not related to specific design spaces,
  with use of language one obvious candidate", tabulating that one as Table 4.
  Motor capability is modelled throughout the paper (writeFontSet's SELECT
  covers "keyboard, scanning, eye tracking"; hand tremors appear twice as
  worked examples) but never given an ontology. This supplies one, flagged
  `designSpace: false` because it is not a Nesbitt display space and the
  distinction should survive.
- *`contrastSensitivity`.* Table 2 models colour and intensity per frequency
  band but has no contrast property, and contrast is the whole of one requested
  exemplar. Written in the paper's percentage idiom.
- *Table 4's dangling parents.* `readFontText` and `readAudioText` are named as
  parents by Table 4 but not defined in what the paper calls "a small edited
  fragment". Supplied so the precedence trees close. `readFontText` takes
  parents in two ontologies deliberately, mirroring Table 4's own
  `readSignText` ("sight + signLanguageSet") — precedence crosses ontologies
  while membership stays disjoint, and there is a test for it.
- *`viewRectangle` as a Composite of two Numeric Ranges.* Table 3 gives it as
  "x, y, w, h in pixels". A rectangle is a horizontal extent and a vertical
  extent, and Numeric Range is one of the five intrinsic types; encoding four
  scalars into a Text property would put structure inside a string, which is
  what first normal form exists to prevent (OOA96 §2.1.1).
- *The sonic and haptic groups entirely.* "Property groupings are also
  identifiable for the sonic and haptic design spaces" — said, not tabulated.

**Two modelling choices worth defending rather than assuming.**

*The blind exemplar removes settings beneath sight rather than zeroing them.*
`contrastSensitivity: 0` would assert something false — not that contrast is
irrelevant, but that it was measured and found absent. Precedence exists to say
"do not ask", and absence is how the model says it.

*"Since birth" changes nothing in the profile, and that is correct.* Capability
is what the user can do; the model has no place for aetiology, by design. Where
it would matter is in Semantics and Composition — a listener with no visual
memory is a different audience for a spatial metaphor than one who lost sight
later — and that belongs in the metaphor work, not here.

### On what the exemplars are

Every Entity records `basis: "exemplar — stands in for lived experience, not
derived from any person"`, in the data rather than only in a comment. They are
deliberately not personas: no name, age, occupation or narrative, because those
invite generalisation from a character to a population. Capability values and
nothing else, which is the paper's own argument.

Bob's framing — "to later replace or augment with lived experience as and when
available" — is the honest position and is what makes the fixtures usable now
without their becoming a claim. Recorded here because it is exactly the kind of
qualification that erodes silently between a repo and a conference paper.

## C7 · correction · Capability is FULL/PARTIAL/NONE, not a data type per property

**2026-07-27.** Bob, on reading the first build: "what are you doing with
capability? … Capability is a hierarchy of properties whose value can be full,
partial, none. For partial we need an extra field with the measurement value. If
you cannot perceive contrast the value is just none."

**He is right and D13 was built on a misreading.** I had taken the "Values"
column of Tables 2, 3 and 4 to mean that each Property has one of five data
types, so `contrastSensitivity` became a percentage in which 0% meant no
perception at all. That is not the model.

The column is showing two different things depending on the row:

| Table | Row | "Values" | What it is |
|---|---|---|---|
| 3 | `focus` | FULL PARTIAL NONE | the capability scale itself |
| 3 | `focusDuration` | Time in minutes | the measurement qualifying PARTIAL |
| 2 | `colorLow` | Percentage | the measurement qualifying PARTIAL |
| 4 | `writeFontSet` | CURSIVE BLOCK SELECT | the measurement qualifying PARTIAL |

So `focusDuration` is not "a number of minutes". It is FULL (can focus
indefinitely), PARTIAL (for N minutes), or NONE (cannot focus at all), and the
minutes exist only in the middle case. And a user who cannot perceive contrast
has contrast **NONE** — not 0%, which asserts that a measurement was taken of
something that is not there.

### The second error, caught while fixing the first

Having understood the scale, I made a child's capability a hard ceiling under
its parents: NONE < PARTIAL < FULL, child ≤ min(parents). That breaks
immediately. Someone with tunnel vision has PARTIAL sight and may have perfectly
FULL colour perception; a Braille reader has FULL language and a very specific
hapticLanguageSet.

The paper's sentence is "Remaining template properties only of interest for
PARTIAL sight" — a statement about **which questions are worth asking**, not a
logical implication. So: NONE propagates strictly (a capability cannot exist
beneath one that does not), FULL does not propagate at all (it merely makes the
children uninteresting by default), and PARTIAL is where the detail lives. Both
readings are now tested, the tunnel-vision case explicitly.

### Why this one is worth the space

The first four corrections were about provenance — right answer, wrong route
(C4); critic mistaken for method (C5); convergence that was transmission (S2);
notation mistaken for semantics (C6). **This is the first that is simply wrong
about what the model says**, and it survived a full build, 44 passing tests, and
a confident write-up. Tests do not catch a misread specification: they encode
the misreading and then confirm it.

What made it findable was Bob reading the *output* rather than the code — the
schema said `contrastSensitivity: percentage`, and that was visibly not a
capability. The lesson for the experience report is narrow and useful: when an
AI transcribes a specification, the artefact to review is the transcription
against the source, not the tests against the transcription. Every test I wrote
passed against the wrong model.

*Second generalisation, less comfortable: I had the paper open and quoted it
accurately throughout. Quoting a source correctly is no evidence of having
understood its structure, and fluent citation is exactly what makes a
misreading hard to spot.*

### What changed

Rewritten: `capability.js` (properties have no type; `measurement` types the
PARTIAL case; `impliedCapability` and `isOfInterest` replace the ceiling),
`capacity.js` (a Setting is `{capability, measurement}`, with the pairing rules
enforced), `user-capability.js` (36 properties re-expressed),
`profiles.js` (all six exemplars). Action Language gained `measure`,
`capabilityOf`, `tuple` and `field`.

The reference profile is now **seven settings**, all FULL, and blind-since-birth
is **one changed line**. That compression is the clearest evidence the shape is
now right: under the previous misreading the reference profile needed
thirty-odd values, because every property demanded one.

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
