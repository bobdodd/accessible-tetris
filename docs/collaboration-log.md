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

## D14 · decision · Stress-testing the profile model, and the three gaps it found

**2026-07-28.** Bob: "we should 'stress test' the profiling mechanism" — one
fully Deaf user, one deafened man with asymmetric low-register loss in one ear
("typical older blue collar worker in a noisy factory"), and one person with MS:
"double vision, no sense of touch, hand tremors, gets tired easily, poor
kinaesthetics".

The first five exemplars were built to *populate* the model. These three were
built to *break* it, and each found something. Recorded here because a stress
test whose findings get quietly fixed and forgotten has told you nothing.

### 1. Sign language was missing (Deaf)

Table 4 gives `readSignText` the parent **"sight + signLanguageSet"** and then
never defines `signLanguageSet` — it is "a small edited fragment". The first
transcription therefore skipped the whole row. A Deaf profile with no signed
language is not a Deaf profile, so `signLanguageSet` was supplied and
`readSignText` went in exactly as the paper writes it.

It is now the clearest demonstration in the model that **precedence crosses
ontology boundaries while ontology membership stays disjoint**: one parent in
`visual`, one in `language`, and the property itself in `language`. The paper
reached for this and stopped short; it took an exemplar to make the gap visible.

### 2. Laterality is absent — and that is arguably correct

The model has no per-ear or per-eye property anywhere, which at first looked
fatal for asymmetric hearing loss. Working out why it is not was the most useful
thing in the exercise.

**Which ear is damaged is mechanism**, and mechanism is what Table 1 does and
Table 2 rejects: "It is what the user can do, not why she cannot." What a
renderer needs is the functional consequence, and that IS expressible. Added
`binauralHearing` — can the two ears combine? — which is the capability that
decides whether a soundscape may rely on stereo separation at all.

The genuinely interesting part is the asymmetry it forced:

- `azimuthResolution` **does** depend on `binauralHearing`. Left-right
  localisation is built from interaural time and level differences and collapses
  without two working ears.
- `elevationResolution` **deliberately does not**. Elevation cues are monaural,
  filtered by the pinna, so one axis of spatial hearing survives while the other
  does not.

Modelling both as lost would have been easier and wrong, and for a spatialised
audio demonstrator the difference is the whole design.

**The real limit, recorded not hidden:** the model cannot say "put the important
channel on his good side". That needs laterality and laterality is not here.

### 3. Kinaesthesia was missing (MS)

The haptic ontology modelled only the tactile half. Haptics proper is tactile
sensing **and** kinaesthesia — limb position sensed from muscle and joint — and
the two dissociate in both directions. A user with absent touch and partial
proprioception was inexpressible, which is a common MS presentation and matters
far more for input than tactile loss does: not feeling the key is survivable,
not knowing where your hand is without looking is not.

Added as a sibling of `touch`, not a child, because the dissociation runs both
ways. It is now a third parent of `minTargetSize` — acquiring a target needs a
pointing device, a steady hand, *and* knowing where your hand is, and the third
is the one usually forgotten because most people have it and never notice using
it.

### What the model got right without being told

`hapticLanguageSet` is now correctly refused for the MS profile, because its
parent `touch` is NONE and a capability cannot exist beneath one that does not.
Nobody encoded "a person with no tactile sense cannot read Braille" — it fell
out of the precedence hierarchy. That is the hierarchy doing real work.

### MS also settled an earlier argument

C7 records two errors: reading the Values column as a per-property data type,
and then over-correcting into a hard ceiling where a child may not exceed its
parent. This profile is why the second correction was necessary. **Hearing is
FULL and `listeningDuration` is PARTIAL at 15 minutes** — MS fatigue is central,
not sensory. Under the ceiling rule that would have been rejected as incoherent.
It is not incoherent, it is the condition. FULL parents make a child
uninteresting by default, never forbidden.

The paper anticipated exactly this: §8 names "users with spiky profiles, such as
users with Multiple Sclerosis who experience varied and multiple impairments" as
the case stereotype templates handle worst, and Table 3's set is "based upon the
real-life experiences of a person with Multiple Sclerosis". This exemplar is
less a stress test than the model's own motivating example, finally populated.

### CORRECTION, same day: the deafened profile was built wrong

Bob: "Not sure you got my Deafened case correct. The person has lost the lower
register in one ear, but they still have the higher register. So some degree of
binaural hearing still exists."

He is right, and the first build asserted something false about the man. Two
errors, and they compounded:

1. **`usableFrequencyRange` was truncated at 400 Hz.** That says he cannot hear
   bass *at all*. He can — with the good ear. What he has lost is not audibility
   but the *second opinion* on the low end. The range should be wide; the
   impairment shows elsewhere.

2. **`binauralHearing` was treated as uniformly degraded.** Asymmetric loss is
   rarely flat across the spectrum. An ear that has lost only its lower register
   goes on contributing above the crossover, so the two ears keep combining up
   there and stop below.

The fix makes `binauralHearing` carry **a frequency band rather than a scalar** —
PARTIAL now means "the ears combine from 800 Hz up", which is a statement a
renderer can act on. And azimuth resolution went from 75° (near-useless) to 45°
(coarse but real), because the physics is specific: **low frequencies are
localised by interaural TIME difference, high by interaural LEVEL difference**.
Losing the lows in one ear takes out ITD localisation and leaves ILD. Spatial
hearing is impaired unevenly, not abolished.

A second known limit fell out of this and is recorded on the property:
`azimuthResolution` is a single number where his real acuity varies by
frequency. The model can say "coarse overall" and "binaural above 800 Hz"; it
cannot yet say "good above 800 Hz, hopeless below".

**And the part worth keeping for the experience report.** I had written a test
asserting `band.from === 400` — a test whose entire content was my
misunderstanding, phrased as a requirement and passing. It sat one line below a
test that described the same profile correctly. This is C7's lesson arriving a
second time in a single day: **tests confirm the model you built, not the model
you should have built.** Encoding a wrong assumption in an assertion does not
make it right, it makes it durable, and it makes the next reader trust it.

The two errors also share a shape worth naming: both were *over-simplifications
in the direction of severity*. Truncating the range and flattening the binaural
capability each made the man more impaired than he is. That is a specific bias,
not random noise, and it is the one to watch for in profile work — a model that
overstates impairment produces adaptations nobody asked for.

### Bob's answer, and a framing correction that reaches the whole file

I flagged that noise-induced and age-related loss are classically high-frequency
— the 4 kHz notch — and asked whether the lower-register brief was intended.

**His reply questioned the research, and the question is a good one:** "I wonder
what the environment of the male test subject had been. I come from a world of
heavy thumping machinery in factories, not the high pitch whine of modern
machines." The 4 kHz notch comes from studies of broadband continuous industrial
noise. Heavy low-frequency impact noise is a different exposure and impulse noise
damages differently from continuous, so "older blue-collar worker" in 1970 and in
2020 do not describe the same acoustic history. The literature I cited does not
control for that.

**Then the part that mattered more:** "it really doesn't matter, we are recording
what people can do… Note we will be recording what they can hear, not what they
can't. This is capability not disability."

That is a correction to *me*, and it lands on prose rather than data. The
measurements were always positive — `usableFrequencyRange` is the range that
works, `binauralHearing` the band where the ears do combine. The descriptions
were not. I had written "lost the lower register", "worse in one ear",
"impairment", "no usable sight". **Table 1 vocabulary wearing Table 2 clothes.**

A model can be structurally correct and still teach the reader to think in
deficits, because the reader remembers the prose and not the schema. Every
profile description is rewritten to lead with what the person does. The deafened
man now reads: *"Hears across the full range with one ear and the upper register
with both. Follows two concurrent streams, places sound coarsely left and right,
and understands speech best from higher-pitched voices."* Same data, and it
describes a person rather than a casualty. A regression test now rejects deficit
vocabulary in any profile description.

### The CNIB observation, and a property it forced

Bob, from CNIB Library borrowing statistics: **older men consistently chose
female narrators for audiobooks.** A whole population of legally blind heavy
listeners, measured over hours of real listening, with no audiogram involved.

The published intelligibility work does not support the obvious reading —
[Ferguson found male and female talkers about equally intelligible](https://acoustics.org/does-increasing-the-playback-speed-of-mens-and-womens-voices-reduce-their-intelligibility-by-the-same-amount-eric-m-johnson-sarah-hargus-ferguson/)
for older adults with hearing loss, and anecdotally older adults report women's
voices as *harder*. Two mechanisms fit the borrowing data and they are opposites:
either the lower register is reduced and the upper is what remains, or the lower
register is well **preserved** and masks upward into the consonant range, so a
higher-pitched talker escapes it.

**The model does not have to choose, and that is exactly the paper's point.**
Added `intelligibleVoicePitch` (parent `readAudioText`, a frequency range in Hz):
the band of talker fundamental that works. It is silent on mechanism and
directly actionable, because it selects a synthetic voice.

Worth marking for the experience report: this is field data outperforming
literature. Borrowing statistics measure *choice over hours* — listening effort
and fatigue — where an intelligibility test measures *recognition over minutes*.
The first is ecologically valid and the second is controlled, and for deciding
what a system should do, the first was more useful.

## C8 · correction · Knowing a language is not the same as receiving it

**2026-07-28.** Bob: "Do we record which sign languages a person knows? American?
British? Quebec? What about two handed manual as used by deafblind people? And
that reminds me, we do need a deafblind profile."

Three things, and the second exposed a bug I had introduced two commits earlier.

### The bug: signLanguageSet must not depend on sight

I had given `signLanguageSet` the precedence parents `[language, sight]`,
reasoning that sign is received visually. Under `sight: NONE` the model then
**refused to let a DeafBlind person know ASL at all**. That is not a technicality;
it is the model contradicting the most important fact about them. Many DeafBlind
signers have ASL as a first language, learned in childhood as a sighted signer,
and simply receive it hand-over-hand now.

**The paper's own structure had the answer and I had not read it closely
enough.** `language` has no parents at all, while `readFontText` needs sight,
`readAudioText` needs hearing, and `readSignText` needs sight. The model already
separates **knowing** a language from **receiving** it in a modality. I collapsed
the two.

Fixed: `signLanguageSet` is knowledge and depends only on `language`. Added
`readTactileSign` (parents `touch`, `signLanguageSet`) as the tactile counterpart
of Table 4's `readSignText`. Same language, different channel — which is exactly
why the knowledge property could not carry a channel dependency.

*This is a third instance of the same failure mode as C7 and the deafened
profile: over-constraining. Each time I added a restriction that felt
conservative and turned out to make a real person inexpressible. "Sign needs
eyes" sounds obviously true right up to the moment it erases DeafBlind signers.*

### Naming: the enum was sloppy

- **`ISL` removed.** It denotes Irish, Indian AND Israeli Sign Language depending
  on the source. Replaced with `IrishSL`.
- **ASL and LSQ are unrelated languages**, not dialects, and both are in common
  Canadian use. Added `LSF`, `DGS`, `Auslan`, `MaritimeSL`.
- **`SSE` is not a language.** Sign Supported English is manually coded English —
  English word order with signs borrowed — and a renderer must treat it
  differently from ASL grammar. Kept as a value with its status documented,
  because pretending it is a language and pretending it does not exist are both
  wrong.

### hapticLanguageSet was Braille-shaped

It held `["Braille", "HapticMap"]`, which is how a sighted person imagines
tactile reading. Added the two-handed **DeafblindManual** alphabet,
**PrintOnPalm**, **BlockAlphabet** and **Lorm** — which is how a great many
DeafBlind people actually receive text.

The distinction now documented on the property: these are **scripts and codes**,
not languages. A signed language received by touch is `signLanguageSet` plus
`readTactileSign`, because the language is the same one either way.

### The DeafBlind profile, and what it says about the demonstrator

Modelled on Usher syndrome type 1: congenitally Deaf, ASL as a first language,
progressive vision loss in adult life.

Every other exemplar can receive the game through some channel it already has —
audio, or visuals, or both. **This one has neither.** Touch is the whole surface,
and the model states it plainly rather than letting it be discovered late. An
audio-first demonstrator has nothing to offer this person yet, and that is a
finding rather than an embarrassment: precisely what §6a exists to keep visible
instead of quietly designing around.

Recorded on the profile, because one exemplar invites over-reading: most
DeafBlind people are not at this extreme. Residual hearing, residual vision, or
both, are far more common than neither, and the real design question is usually
"which fragment remains". This profile sits at the end of the range on purpose,
to see whether the model degrades cleanly. It does.

### C8b, same exchange: reception is sensory, production is motor

Bob again, immediately after: "If you are going this route you can receive sign
without being able to deliver it. A person with no sense of touch or hand tremors
or both would struggle to deliver two handed manual."

A second axis I had collapsed, and the same shape of error as the first. Having
just separated *knowing* a language from *receiving* it, I had left *producing*
it merged into reception.

**The paper has exactly one production property and never generalises it.**
Table 4 gives `writeFontSet` as the counterpart of `readFontText` and then stops:
there is no production counterpart for sign or for tactile script. So a person
who reads the two-handed manual alphabet on their own hand and cannot spell it
onto someone else's was inexpressible — and that combination is ordinary, not
exotic.

The structural rule, now stated on the properties themselves: **the `read*`
properties depend on senses, the `write*` properties depend on hands.**

| | Receive | Produce |
|---|---|---|
| written | `readFontText` (sight) | `writeFontSet` (keyControl, manualStability) |
| spoken | `readAudioText` (hearing) | — |
| sign | `readSignText` (sight) | `writeSignSet` (manualStability, kinaesthesia) |
| sign, tactile | `readTactileSign` (touch) | `writeSignSet`, Tactile mode |
| tactile script | `hapticLanguageSet` (touch) | `writeTactileSet` (manualStability, touch) |

Two details worth keeping, because both were nearly got wrong:

- **`writeSignSet` deliberately does NOT take `touch` as a parent.** Signing
  visually needs no tactile sense whatever, so gating the whole property on touch
  would forbid a person with absent touch from signing at all. That is precisely
  the over-constraining error of C7 and C8 arriving a third time, and it was
  caught only because the previous two were fresh. The Tactile *mode* does need
  touch, and that is expressed by which values appear in the measurement — not
  by blocking the property.
- **`writeTactileSet` DOES take `touch`.** You cannot place letters on a hand you
  cannot feel. This is Bob's case exactly, and it is now the difference between
  the two production properties rather than a footnote.

`writeFontSet` also gained `manualStability`: CURSIVE and BLOCK are handwriting
and need a steady hand, while SELECT explicitly does not, which is why the modes
belong in the measurement.

A test now builds the case directly — touch intact, hands unsteady — and asserts
three separate facts about one script: knows it, reads it, cannot write it.

**The pattern across C7, C8 and C8b is now unmistakable and belongs in the
experience report.** Three times in two days I added a constraint that felt
conservative and each time it made a real person inexpressible: a hard ceiling
erased tunnel vision with intact colour; `sight` on `signLanguageSet` erased
DeafBlind signers; `touch` on sign production would have erased signers with
neuropathy. The bias is consistent — **an AI modelling disability reaches for
restrictions that sound cautious and are actually erasures** — and it took a
practitioner to catch each one.

44 properties, 10 exemplars, 94 tests.

## N5 · note · "User profiles need to be human not robotic" — issue #8

**2026-07-28.** Bob, flagging a concern for later rather than asking for a fix:

> I'm concerned at the measurement/scales we use for PARTIAL. I/we tend to fall
> back to percentages on things that may not be expressable as a percentage. If
> we were populating these tables with real people then we would be interviewing
> them and I'm not sure percentages would be the reliable measure of their
> abilities even hearing. The measure may need to be more vague or abstract to
> match what real people can tell us… **User profiles need to be human not
> robotic.**

Filed as issue #8 with a full audit. Recorded here because the *shape* of the
observation matters more than the fix.

**The audit.** 10 of 44 properties carry a percentage, and they are precisely the
ones no person can source: `contrastSensitivity`, `manualStability`,
`kinaesthesia`, the six colour and intensity bands, `vibrationDetection`. Sorting
all 44 by how a value would actually be obtained gives five honest categories —
interview, demonstration, tuning in situ, clinical instrument — and one
dishonest one. Nobody reports their kinaesthesia as 25%. That number came from
me, dressed as data.

**The model already supported the fix.** `Discrete` is one of the five intrinsic
types, so an ordinal scale with concrete anchors — "needs black on white",
"needs strong contrast", "prefers more contrast", "no preference" — was
expressible from the start. I reached for `numeric` + `%` out of habit. This is
not a limitation of the model; it is a limitation of the person populating it.

**What makes this different from C7, C8 and C8b.** Those were over-constraints —
restrictions that erased people. This is the opposite failure: **pseudo-precision
that invents people.** A percentage nobody could have told you is a fabrication
with a decimal point, and it is more dangerous than a missing property because
it does not look like a gap. It looks like evidence.

Both failures share a root, which is the useful thing for the experience report:
*an AI populating a model will produce whatever the schema will accept, and a
schema that accepts a number will get a number.* The check that catches it is not
type validation but asking **"who said this, and how would they know?"** — which
is a question about acquisition method, not about data.

**The follow-on idea, worth more than the fix.** Record a measurement's
provenance: self-reported, demonstrated, tuned, instrumented, or inferred from
behaviour. Bob's CNIB borrowing statistics are that fifth kind and were more
useful for design than the controlled intelligibility studies. This would push
`basis` down from the Entity to the individual Setting.

**And a tension in the source paper.** MSIADU'09 rejects Access for All's
functional lists as "unwieldy and unquantifiable" and offers percentages as the
quantification. If the quantification cannot be obtained from the person, that
critique partly rebounds. Inheriting the percentages silently would be the wrong
response; naming it is the interesting one, and it belongs in the write-up.

## S4 · source · The 4 kHz notch and vibration white finger, from Bob's father

**2026-07-28.** I flagged that nine of ten exemplars barely touched the sonic
ontology, and the one that did used a single unbroken band — leaving the paper's
own justification for Composite Property unexercised on a demonstrator whose
premise is audio.

Bob's answer supplied both the missing shape and the reason it is real: *"Let's
use the 4K notch and add another Deafened person and maybe give them another
issue: no sense of touch in their fingers specifically (Industrial White Finger)
which is a condition my father, a coal miner had, so the 4k with automated mining
machines could be a real fit."*

### Why the pairing is exactly right

Both come from the same job. Prolonged broadband machine noise produces the
classic notch near 4 kHz; the vibrating tools that come with that work produce
vibration white finger. Bilateral in both cases, because both ears and both hands
did the same work for the same years. The occupational history is one fact with
two consequences, which is what makes it a better exemplar than two unrelated
conditions bolted together.

### A 4 kHz notch IS the gap

`usableFrequencyRange` is now two bands — 20–3000 and 6000–12000 — with nothing
usable between. That is the paper's own worked justification for Composite
Property finally exercised by a profile rather than only by a test fixture:

> "the usable audio frequency range for a user… described as a collection of
> numeric ranges measured in Hertz, WITH GAPS BETWEEN THE RANGES."

And a gap is a **silent** failure. A single min and max would say 20–12000 and
quietly claim he hears 4 kHz. He does not mishear a cue placed there; he never
receives it. For an audio-first demonstrator that is the sharpest test in the
profile set, and it did not exist until now.

### Two deafened profiles that fail in opposite directions

This is the more interesting result. Both have `hearing: PARTIAL`, and their
design consequences are almost disjoint:

| | asymmetric | notch |
|---|---|---|
| Ears | different | matched |
| `usableFrequencyRange` | one band, 20–8000 | **two bands, gap at 3–6 kHz** |
| `binauralHearing` | 800–8000, narrower than usable | **identical to usable** |
| Localisation | poor (45°) | reasonable (20°) |
| What a renderer must do | simplify the stereo image | move content out of a band |

The binaural relationship is the neat part: with matched ears the two combine
wherever either hears, so the binaural band *equals* the usable band. With
asymmetric loss they differ. Same property, and its relationship to another
property is what distinguishes the two people.

### What the fingers forced

`touch` was described as "contact on the skin" — whole-body, and it made this
person inexpressible. NONE would be false about his back; FULL false about the
only part of him that meets a device. Narrowed to **the hands and fingertips**,
which costs nothing because every dependent property was already a hand task:
Braille, tactile sign, spelling onto a hand, feeling a device vibrate.

Known limit recorded rather than hidden: no body-site granularity, so sensation
in one hand and not the other is still inexpressible. Same shape as the laterality
limit, resolved the same way — carry the functional consequence at the interaction
surface, not the anatomy.

### And the cold

Vibration white finger is *defined* by its cold response, which makes
`ambientTemperature` a capability trigger rather than a comfort setting. That
gives the model a second worked functional dependency on a different influence:
`minTargetSize` goes from 12 mm warm to 19 mm cold.

Arguably a better example than the paper's own. The tremor case depends on how
the device is held, which is a usage choice; this one depends on the weather,
which is not. A cold bus shelter and a warm room are different devices in the
same hands.

*Worth noting for the experience report: the two most useful exemplars in the set
both came from Bob's direct knowledge of people — the CNIB borrowing statistics
and his father's hands. Neither was derivable from the literature, and the second
supplied a functional dependency that is cleaner than the published one.*

44 properties, 11 exemplars, 107 tests.

## C9 · correction · Speech was absent from the model entirely

**2026-07-28.** Bob: "We may not yet have covered speech fully - Do we have
anything for speaking? Language, dialect, accent? I'm trying to catch english as
a second language and Deaf Voice here."

We did not. **The model had no speech production of any kind**, and an asymmetry
that should have been embarrassing: it recorded which SIGNED languages a person
knows and never asked which spoken or written ones. `language` answered only
"understands language at all", which cannot tell a fluent English speaker from
someone managing their third.

### The four skills

`knownLanguages` now holds a collection of languages, each rated on **listening,
speaking, reading, writing** — the standard skills of any language assessment,
chosen because they are what an interviewer actually asks and because they
genuinely dissociate. Bob's two cases are precisely the dissociations:

| | listening | speaking | reading | writing |
|---|---|---|---|---|
| ESL, en-CA | fluent | conversational | fluent | conversational |
| Deaf, en-CA | **none** | basic | **fluent** | **fluent** |

"Knows English" is true of both and useless about either. Tags are BCP 47, so
dialect (en-CA vs en-GB) needs no separate property.

**Accent deliberately has no property.** Accent describes how someone sounds; the
capability is whether they are understood, which is `speechIntelligibility`.
Recording accent would be recording mechanism — Table 1 rather than Table 2.

### The split that matters most

`speechIntelligibility` (understood by people) and `speechRecognisedByMachine`
(understood by ASR) are separate properties, and the separation is the actionable
part:

- **Deaf**: understood by familiar listeners; ASR `NONE`.
- **ESL**: `speech: FULL` — nothing wrong with the voice — understood by most
  listeners, ASR "with frequent corrections".

Automatic speech recognition is trained on a narrow band of voices. A person
their family understands perfectly may be unusable by voice control, and a system
that infers the machine figure from the human one will offer "just talk to it"
and strand them. Recording only one number hides exactly the case that breaks.

Note also that **accent is not a speech impairment**: the ESL speaker's `speech`
is FULL and their intelligibility is still PARTIAL. Collapsing those would have
been the category error the model exists to prevent.

### Why the ESL profile earns its place

It has no sensory or motor limitation whatever, and that is the argument for
including it. **A capability model that only ever describes disabled people has
quietly become a disability model with better manners.** Language proficiency is
ordinary human variation that changes what an interface should do — plain
wording, no idiom, more reading time, a second language where one exists — and it
belongs in the same structure as everything else. There is a test asserting that
this profile's roots are all FULL and that it still carries real information.

### One caution written into the code

Whether a Deaf person speaks is as much personal and cultural as it is
capability, and many fluent signers choose not to. The `deaf` profile speaks a
little; another Deaf profile with `speech: NONE` would be no less complete.
Recorded on the profile so nothing there reads as what a Deaf person is like.

48 properties, 12 exemplars, 114 tests.

## D15 · decision · Alternative access: switch, breath and gaze

**2026-07-28.** Bob: "Now I'm wondering about who we are not describing well.
People who use switches, sip-and-puff, eye-tracking. Please research typical
users of that AT and what profiles we might need." Then, on seeing the proposal:
"Let's build all 3. I find with these things I need to read, pause, think, and
get back to you. Better to have all 3 down on paper first to think about."

Built all three, plus eight properties. Research sources: Burkhart's ASHA
Perspectives paper on switch access, the 2025 state-of-the-science review on
alternative access, OHSU's chapter on AAC in late-stage ALS, and the Frontiers
work on eye tracking with late-stage ALS.

### The shape these three share, and why it is new

**Their limitation is almost entirely OUTPUT.** Sensation intact, cognition
intact, language intact — and every one of the twelve profiles before them varied
a sense. The model had been asked to describe perception fifteen different ways
and had never once been asked to describe someone who perceives everything and
can barely act.

### What the research settled that guesswork would not have

**Switch access turns on a count, not a severity.** Scanning is either *timed*
single-switch or *untimed* two-switch, and Burkhart is explicit that "all timed
methods of switch scanning require a certain level of automaticity of motor
skill." So `switchSites` and `activationTiming` are separate properties that fail
independently: a person who cannot time a movement scans perfectly well **given a
second switch site**. One property called "switch access" would have hidden the
single most useful fact about the user.

**Dwell tolerance is the number that decides usability.** Published thresholds
run 500–1000 ms and cap communication at 5–10 words per minute; users with slow
eye movement may need 2500 ms. A dwell interface built for 500 ms is not slightly
worse for that person, it is unusable.

**ALS spares sensory neurons.** `touch` and `kinaesthesia` stay FULL while nothing
can be moved. A model that assumed paralysis implies numbness would be wrong
about the entire population, and I would have assumed it.

### Two splits the profiles forced

**Gaze control is MOTOR, not visual.** `sight: FULL` with `gazeControl: PARTIAL`
— vision is unaffected by ALS while ocular motility slows, the eyelid droops
across the pupil and the eyes dry. Filing gaze under vision would have said this
person cannot see and taken every visual property down with it.

**The narrowed `touch` paid off a second time.** At C4 sensation is preserved
above the injury and absent below: head and neck feel everything, hands feel
nothing. Whole-body `touch` could not have said that — the same limit the
vibration white finger profile exposed a few hours earlier, hit from the opposite
direction.

### The finding about the demonstrator

**A real-time falling-block game is structurally closed to a single-switch
scanning user.** Scanning takes seconds per selection; the pieces do not wait.
No rendering choice fixes this, because the barrier is not how the game is
presented but that it will not pause. Including these users needs a turn-based or
pausable mode, which is a game design decision and not an adaptation one.

That is the DeafBlind finding again in another domain: the profile set keeps
producing people the demonstrator cannot serve, and §6a says that must stay
visible. Recorded at the head of the alternative-access section, where anyone
reading the profiles meets it before the tables.

### One discipline held throughout

**No profile names a device.** "Uses sip-and-puff" is a configuration choice for
the Preference Model; "produces four distinguishable breath signals" is a
capability. Naming equipment would rebuild exactly the Access for All functional
list the paper spends section 4 rejecting, and there is now a test that fails if
any profile description mentions hardware.

All eight new properties use counts, durations or ordered scales. Not one is a
percentage — issue #8's direction applied at the point of design rather than
retrofitted later.

56 properties, 15 exemplars, 124 tests.

## C10 · correction · The unit of play is not always one person

**2026-07-28.** I concluded from the alternative-access profiles that a real-time
falling-block game is "structurally closed" to a single-switch scanning user.
Bob: "I would expect Tetris as currently considered would be blocked for some
users, though I think we have to consider how severely disabled gamers actually
play: when different or bespoke controls won't help, they sometimes share
controls with a gamer buddy to cover controls or timing they can't manage."

**The finding was not wrong so much as narrow, and narrow in a specific way: it
assumed the unit of play is an individual.** Usually it is. Not always — and the
assumption was completely invisible to me until someone who knows the practice
pointed at it. Xbox ships a Copilot mode that makes two controllers act as one,
for precisely this.

### The paper had the structure; its resolution is the wrong one

The Capacity Model's Entity "is either a user, **or a group of users**", and §8
describes building one: "the settings of the group Entity are created as
functionally dependent upon user settings, with a resolution… defined in Actions
expressing dependence."

But the paper's resolution is "highest common denominator" settings so a group
sharing one machine all have full access — a classroom, where if one student
needs 18pt everyone gets 18pt. That is a merge toward the **most accommodating**
value, and it is right for shared access to a single interface.

Co-pilot play is the opposite. Capability is **divided**, not shared: whatever
either can do, the pair can do. A union, not an accommodation. Same structure,
different resolution, and the paper never anticipated this use of its own
construct.

### The asymmetry that decides everything

Working out what a co-pilot may and may not lend was the substance of this, and
it is not symmetric:

- **Motor capability delegates cleanly.** A buddy's hands are as good as anyone's
  for pressing a button on time. The game cannot tell whose finger arrived.
- **Perceptual capability does not delegate**, at least not in real time. A
  sighted friend describing a falling piece is always describing where it *was*.
  In a turn-based game the same description works perfectly — which is a fact
  about the game, not about the people.
- **Comprehension must not delegate at all.** A buddy who decides what to do is
  not assisting, they are playing, and a model that described that as access
  would be lying.

**So co-piloting rescues the switch-scanning user from a real-time game and would
do nothing whatever for the DeafBlind one.** There is a test asserting exactly
that, because it is the sort of claim that would otherwise soften into "assistive
partnership helps" and stop meaning anything.

### One thing the implementation surfaced

The first merge carried `activationTiming: "needs a slow scan"` into the pair —
true of the primary, false of the pair, since the assistant is using a keyboard
and nobody is scanning. Unmarked, a renderer would obediently slow everything
down for nobody.

Settings beneath a lent capability are now marked `supersededBy` rather than
deleted, because "he needs a slow scan, and with a buddy he does not have to" is
more informative than silence. Same reasoning as C7: a FULL parent makes a child
uninteresting, never forbidden.

*Generalisation worth keeping. Every §6a finding so far has been about what the
model cannot express. This one was about what I could not imagine — an
individualist assumption baked so deep into "user profile" that it never
surfaced as a decision. The model's own Entity said "a user, OR A GROUP OF USERS"
and I had implemented the validation for it without once asking what a group was
for.*

56 properties, 16 exemplars, 130 tests.

## C11 · correction · The model had become hand-centric, and nobody decided that

**2026-07-28.** Bob: "There is more to do with touch. You can't just have
fingers, we need a broader model. We need head mobility — being able to look
around and up/down. We need feet/toes for people who don't have hands/arms who
type with their toes."

Three things, and they were one fault: **every part of the model that touched the
body assumed hands**, and no one had ever decided it should.

### `touch` has now been wrong in both directions

It began as "contact on the skin" — whole body, with no way to say that vibration
white finger takes the fingers and leaves everything else. So I narrowed it to
the hands and fingertips, recorded "no body-site granularity" as a known limit,
and moved on.

**Narrowing was the wrong fix**, and the toe typist proves it: a person who types
with their feet has superb sensation in their toes and, under a hands-only
reading, none worth recording. I traded one inexpressible person for another and
called it a resolution.

The right fix is to say WHERE, which the model could already do — a collection
of `{site, level}` tuples, exactly as `knownLanguages` carries four skills per
language. The convention is the model's own: **list only the sites that differ
from full**, because absence means "not of interest" everywhere else too.

Body sites are a **set**, never a rank — a head is not more than a foot — while
levels are ordered. There is a test for both, because getting that backwards
would be a quiet insult encoded as a schema.

### Naming the effector became compulsory

`keyControl` was FULL/PARTIAL/NONE with no way to say *with what*. A head switch
and a toe are different design problems at the same count, and "PARTIAL" for a
fluent toe typist would have been a falsehood as well as an insult.

`keyControl` and `pointerControl` now carry effector sites, and adding the
measurement forced every existing PARTIAL setting to name its sites — the change
audited the profiles for me.

### `manualStability` → `effectorStability`

The old name assumed hands, which is the same fault in a third place. A foot is
an effector and so is a chin. Renamed in source; the collaboration log keeps the
old name where it appears, because this file records what was said and done and
must not be retro-edited.

### Head mobility is not head control

`headControl` answered "can you direct your head", and Bob's question was "how
far can you turn it". Different question, and asked far less often than it
should be: someone may point precisely within a narrow arc and be unable to look
up at all, and a screen outside that arc is unusable however good the pointing.

`headRange` records four directions rather than two axes, because the limits are
frequently asymmetric. It bites hardest on eye gaze, where the literature is
explicit that a device too high causes eyelid fatigue and one too low is misread
because the upper lid obscures the pupil — both placement problems, and
placement is bounded by this property.

### The toe typist, and what it is careful NOT to say

Nothing in that profile is PARTIAL below the site lists. No reduced dexterity, no
reduced speed, no reduced endurance — `effectorStability` is FULL and stated
explicitly, because the temptation to assume a foot is less steady than a hand is
exactly the bias the profile exists to catch. The only rows differing from the
reference are the ones naming *where*.

The design consequence is still real: feet are further from the screen, larger,
and reach a smaller comfortable area. That is layout and placement, which is what
the site list and `headRange` are for — not a lesser capability.

### And two more tests that outlived their model

Fixing this broke two assertions that encoded the hands-only reading, both
expecting `touch: NONE`. That is the **third** time today a passing test turned
out to be a superseded understanding written down as a requirement (C7, the
deafened frequency range, now this).

The pattern is worth naming precisely, because it is not carelessness: **a test
written at the same moment as the code cannot check the code, only restate it.**
It becomes evidence only later, when someone changes the model and the old
assertion refuses. Both times, that refusal is what surfaced the real change —
which is an argument for keeping tests specific enough to fail rather than
general enough to survive.

57 properties, 17 exemplars, 137 tests.

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
