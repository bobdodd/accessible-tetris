# Accessible Tetris — Demonstrator programme

**Status:** agreed 2026-07-26. Amends the ordering in [DESIGN.md §8](DESIGN.md);
the scope in §0 and the architecture in §2 stand unchanged.

## 0. What this document adds

DESIGN.md §8 fixes a build order that tests the riskiest metaphors first, which
is the right instinct and is preserved here. What changes is the packaging.

As written, §8 produces throwaway sandboxes: timbres in "a Web Audio sandbox",
the terrain scan against static boards. Each proves a perceptual claim and is
then rebuilt once the abstract game exists at step 4, which means the
architecture, the actual contribution, arrives fifth and is never visible until
it is nearly finished.

This programme keeps the same de-risking sequence but builds a thin CISNA cradle
first, so that every proof-of-concept registers into it as Inventory rather than
standing alone. Nothing is discarded, and the architecture is demonstrable from
the first demo onward.

## 1. Decisions taken

- **One repository.** The demos live here, in `bobdodd/accessible-tetris`,
  alongside the case study they descend from. They share the cradle, so
  splitting them would mean versioning it across repos for no gain.
- **Vanilla JavaScript, and the cradle is the framework.** No third-party
  framework. Where structure is needed, it is written here, small enough to read
  in a sitting. This is deliberate: the cradle is a reference implementation of
  CISNA-style adaptation, and its value is that somebody can read it and
  reimplement the pattern in React, Vue, Svelte or anything else. It is the
  vanilla template for an idea, not a library to depend on. It follows the same
  reasoning as the site's "all my code as readable source, not as compiled
  libraries" principle.
- **Total honesty, written up as research.** These are experiments with
  hypotheses and outcomes, not features with launches. A metaphor that fails is
  published as a failure, with the reasoning, exactly as direction-as-direction
  is reported in the case study. See §6.

## 2. Why the cradle comes first

The argument against is real and worth stating: building a frame around
metaphors that may not work risks investing in infrastructure for an unproven
idea. Two things answer it.

**Keep the cradle thin.** It is an event schema, a renderer registry, a
capability profile, and the request/answer bridge. It contains no audio, no
game rules and no rendering. If a metaphor fails, the metaphor is lost and the
frame is untouched.

**Drive it with a scripted event tape.** A demonstrator does not need a working
Tetris to emit `piece.spawned`, `piece.moved` or `row.cleared`. A hand-written
tape of Semantics-layer events exercises the whole cradle before any game logic
exists, which decouples the modality work from the FSM work entirely. The
abstract game then arrives where §8 puts it, replacing the tape rather than
being a prerequisite for anything.

The tape earns its place beyond sequencing. It is deterministic and repeatable,
so A/B comparison of two timbre sets runs against an identical board and an
identical fall every time. Sandbox demos cannot offer that, and without it any
listening comparison is confounded by the material changing underneath it.

## 3. The cradle

The cradle is **both halves of CISNA**: the five-layer Document Model, and the
Runtime System that realizes it. That pairing comes from *Notes on The Render
Model*, which sets the two side by side (its Figure 11):

| Document Model | Runtime System |
|---|---|
| Adaptation Layer | User Profiling: Event Logging, User Model, User Role Model |
| Semantics Layer | **Render Model** |
| | **Composition Model** |
| Document Inventory | Runtime Inventory |

Three consequences the earlier draft of this document got wrong:

**The Application Model is the output.** The runtime does not render from
Semantics directly. It *populates an Application Model*: Content, collated into
Content Groupings, appearing as Content In Grouping, realized as Presented
Content within an Interaction Space. A populated Application Model is a concrete
realization of the five layers for one specific user and context. The renderers
consume that, not the raw event stream.

**Metaphors specify; they do not hint.** The note is explicit that Grouping
Metaphor and Presentation Metaphor differ from the Presentation Specifications
of Dexter and Amsterdam precisely because specifications are only hints to the
runtime, whereas metaphors specify actual rendering and interaction modalities.
This is load-bearing for the whole project, whose argument is that the metaphor
*is* the interface rather than decoration over it.

**Adaptation is event-triggered instance application.** An Event Type with typed
Trigger Attributes fires an Event Trigger, which names an Instance Application,
whose ordered `instanceToApply` entries apply Instances and change the document
structure. That is a concrete mechanism with an XML form already worked out, not
something to invent.

And one alignment worth recording, because it arrived from the other direction:
the roughly seven dependable dimensions of audible meaning are **Interaction
Properties** of the Sonic Interaction Space in the Interaction Model, and
metaphors select against them. The palette argument from the writing and the
Interaction Model from the thesis turn out to be the same structure.

### What the cradle contains

| Module | Half | Responsibility |
|---|---|---|
| `semantics` | Document | Nouns, Notions, Rules, and the Concept Ontology scoping them. What the game *means*, independent of rendering. Issue #1 decides whether this is a declared schema. |
| `inventory` | Document + Runtime | Media elements and formatted media elements available for use. Split, per the note, into Document Inventory and Runtime Inventory. |
| `adaptation` | Document | Event Types, Event Triggers with typed Trigger Attributes, Instances, and ordered Instance Application. |
| `profiling` | Runtime | User Model, User Role Model, Capability Model, and Event Logging. Capability is the capacity to perceive and act, deliberately not the physical properties of a design space. |
| `composition` | Runtime | Rule sets mapping Notions to metaphors, bridged to Inventory on one side and the Render Model on the other. |
| `render` | Runtime | Populates the Application Model for the active profile. |
| `interaction` | Runtime | Interaction Spaces and their Interaction Properties. The sonic space's properties are the palette. |
| `bridge` | (mechanism) | Async request/answer with rendezvous, per DESIGN.md §2. Its relationship to Render Model population is unresolved: issue #5. |

The bridge rules from DESIGN.md §2 are binding and are the part most likely to
be got wrong under time pressure:

1. The game is always the client of its views; views never open a transaction.
2. Every announcement is a request/answer pair, and the game rendezvous on *all*
   answers before advancing.
3. Views may send indications; key events arrive via the input service as
   indications.
4. A request may be cancelled. Each modality declares `interruptible`.

The game clock bends to the user. That is a property of the cradle, not of the
game, and it should be visible in the very first demo.

**Thin still applies.** This is more parts than the earlier draft, but each is
small: the point is that the CISNA structure is *legible* in the code, since a
reference implementation whose shape does not match the published model
demonstrates nothing. Legible does not mean large.

## 4. Repository layout

```
cradle/          the framework: no audio, no game, no rendering
  document/        the five-layer Document Model (semantics, inventory, adaptation)
  runtime/         the Runtime System (profiling, composition, render, interaction)
  bridge.js        request/answer, rendezvous, cancellation
vocabulary/      declared Concept Ontologies (content, not mechanism)
renderers/       Inventory modules, one per metaphor, each independently switchable
game/            abstract game FSMs (phase 3; replaces the tape)
tapes/           scripted event tapes, the deterministic test material
demos/<slug>/    one directory per demo: page, wiring, and notes.md write-up
test/            plain node tests, no framework
```

Each demo directory is self-contained and publishable on its own. The site
hosts them under `public/demos/<slug>/` in the same pattern as the map
demonstrators, opened in their own window.

## 5. The programme

Every demo states a question it can fail. A demo that cannot fail is not
evidence of anything.

### Phase 0 — the cradle

| Demo | Question | Layer |
|---|---|---|
| **The cradle** | Can an abstract event stream be rendered by pluggable services, with the clock waiting on all of them? | all four |

Its demo surface shows events flowing from a tape, which renderers claimed each
one, how long each took to answer, and the game clock waiting on the slowest.
No audio and no game. This is the most direct illustration of the thesis the
project has: adaptation visible in operation.

### Phase 1 — modality proofs

Each is an Inventory module. These are smoke tests, in the sense the case study
defends: enough to inform the research, not product validation.

| Demo | Question it must answer |
|---|---|
| **Seven voices** | Can a listener learn to identify seven piece timbres? |
| **Terrain scan** | Can a listener sketch the silhouette from the arpeggio? |
| **The stage** | Azimuth, five elevation bands, front and back, and does the subliminal wobble measurably improve front/back discrimination? |
| **Gravity and urgency** | Does approaching water read as descent without instruction, and does the heartbeat read as time pressure? |
| **Braiding** | Does interleave ratio convey relative priority, or merely alternation? |

Order within the phase follows §8: the riskiest first. The stage is the one
most likely to fail outright, since front/back is close to unusable over
headphones and the wobble is an untested descendant of the dancing margins.

### Phase 2 — composition

| Demo | Question |
|---|---|
| **Three views** | Do the Wall, the Well and Mission Control cohere as sustained frames, and does the sonar become native inside the Well as predicted? |
| **The mixing desk** | Can a player hold a useful model of their own soundscape and tune it? Does selection resolve the pitch-polarity collision that retirement would otherwise force? |

The desk is where Adaptation stops being infrastructure and becomes the
user-facing control. It is also the answer to the collision recorded in the
case study: two metaphors that cannot share the pitch channel in one rendering
may sit perfectly well as alternatives the Adaptation layer selects between.

### Phase 3 — the game

| Demo | Question |
|---|---|
| **Abstract game** | Do the FSMs and the bridge hold up when a real game drives them instead of a tape? |
| **Visual view** | (Built first in this phase because it debugs the game, per §8.) |
| **Playable** | Is it a game, played by ear, under the scope of §0? |
| **Training and instrumentation** | Can a listener be taught the vocabulary, and can play be instrumented for quantitative measures? |

## 6. Honesty policy

Treated and written up as research:

- **Every demo carries a `notes.md`**: hypothesis, method, what happened, and
  what it means. Written before the outcome is known, and not revised
  afterwards to match the result.
- **Negative results publish.** A metaphor that fails ships as a demo with its
  failure documented. The case study already does this for
  direction-as-direction, and that failure is the most useful single result in
  it.
- **Claims stay proportionate to evidence.** "Works" means "demonstrates",
  per DESIGN.md §0. Designer introspection is labelled as designer
  introspection, and a sample of one is described as a sample of one.
- **Simplifications are stated, not smuggled**, per §0. The scope list of what
  this game does not implement stays visible in the demos themselves.

## 6a. Working with an unfinished model

The CISNA model and its Render Model come from experimental work of 2009 and
2010 that was stopped before it became a working system. Gaps and internal
conflicts are expected, and one is already known: the Render Model note's
**Navigation section was never written**, and its Interaction Model extension is
referenced as "shown in XXX" against a figure that does not exist (issue #4).

This creates a specific hazard for the demonstrator. If gaps are filled silently
during implementation, the result is a system that appears to demonstrate CISNA
while having quietly invented the parts the model left open, and a demonstration
of a model you designed on the way past proves nothing. Guarding against that
matters more here than anywhere else in the programme.

The discipline, therefore:

- **Three states, always distinguished.** In code comments, in `notes.md`, and
  in any write-up: *the model specifies this*; *the model is silent and this is
  my choice*; *the model says something that does not work, and here is what was
  done instead*. Never let the second or third be read as the first.
- **Conflicts become issues before they become code.** When implementation meets
  an ambiguity, it is logged with the interpretation taken and the reason, and
  the code references the issue. A conflict resolved in passing is a conflict
  lost.
- **The model may be wrong.** It was never finished, so an implementation that
  refuses to work is evidence about the model, not only about the
  implementation. That evidence is a result worth publishing, in the same way
  direction-as-direction is.
- **Retrofitting is not allowed.** Where the demonstrator completes something
  the thesis left open, it is reported as new work completing an open question,
  not as the model having said so all along.

Known live tension, logged as it arises: the async request/answer bridge with
rendezvous (DESIGN.md §2) comes from the PhD Tetris build and the Ascom
telephony lessons, while the Render Model describes rule-based *population* of
an Application Model. One is an interaction discipline, the other a construction
mechanism. Whether they compose cleanly, or disagree about what drives what, is
not yet established.

## 6b. The parent method is a resource, not an authority

§6a governs our relationship to CISNA, which is unfinished. A separate question
is our relationship to **Shlaer-Mellor**, which is not unfinished at all. It is a
complete, published, rigorous method — and we still do not follow all of it.

Bob's ruling: we are not beholden to it, we take what serves and adapt the rest.
Specifically, **Recursive Design is not adopted**, because it would change the
runtime model entirely, and the Architecture domain is promoted to a first-class
domain in the tree. DOMAINS.md §1a carries the reasoning and the consequences.

This adds a fourth state to the three above, and it must not be collapsed into
any of them:

- *the model specifies this*
- *the model is silent and this is my choice*
- *the model says something that does not work, and here is what was done instead*
- **the parent method specifies this, it works, and we have declined it for a
  stated reason**

The fourth is the easiest to misreport, and it can be got wrong in both
directions. Presenting a declined construct as a gap in the method flatters us;
presenting an adopted one as our invention flatters us more. C4 and C5 in the
collaboration log are both instances of getting exactly this wrong, in opposite
directions, within a single day.

## 7. Publishing

Each demo becomes a page under `/adaptation` on a11ybob.com when it works or
when it definitively fails, with the `notes.md` as the basis of the write-up.
The programme therefore produces a series of substantive additions over time
rather than one release, and each is independently linkable and citable.

## 8. Open

- Whether the cradle's event vocabulary should be formally specified (a schema
  file) or emerge from the tape. A schema is more honest to the CISNA claim that
  Semantics carries an ontology; emergence is faster to start.
- Whether phase 1 demos share one page with switchable modules, or take a page
  each. A page each publishes better; one page compares better.
- Evaluation instrumentation is listed in phase 3, but the argument in the case
  study is that instrumenting earlier costs little and makes every phase-1 claim
  checkable rather than merely asserted.
