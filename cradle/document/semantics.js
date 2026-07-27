/* CISNA Semantics Layer.
 * ---------------------------------------------------------------------------
 * Part of the cradle: the Document Model half. No audio, no game, no rendering.
 *
 * MODEL PROVENANCE (see design/DEMOS.md §6a — three states, always distinguished)
 *
 *   MODEL SPECIFIES. The entities and their relationships come from "Notes on
 *   The Render Model", Figure 6: a Concept Ontology scopes the meaning of
 *   Nouns; Nouns carry Noun Attributes, each with a Noun Attribute Range;
 *   Verbs and Nouns are related through Rules; Statements relate to Rules and
 *   to Notions; Notions carry Notion Attributes. The note also states the
 *   working assumption that "the Concept Ontologies of the Semantics Model
 *   scope the meaning of the Nouns, and that the Nouns together with the Verbs,
 *   drive a rule-based system".
 *
 *   MY CHOICE. The note's worked example is Google Maps: static content,
 *   populated once. It never had to say what a Semantics Layer does in a
 *   real-time system where the content changes many times a second. Two
 *   readings were available for game events, and this module takes the second:
 *
 *     (a) events are a separate mechanism sitting outside the Semantics Layer;
 *     (b) an event IS a Statement — a Rule instantiated against particular
 *         Nouns at a particular moment.
 *
 *   (b) is chosen because the case study already places "the game's abstract
 *   events at the Semantics layer", and because Figure 6 gives Statement both
 *   a relationship to Rule and a relationship to Notion, which is exactly the
 *   shape an event needs: it asserts that something permitted happened, and it
 *   bears on the content elements that express it. Adopting (a) would have put
 *   the most important thing the game produces outside the model that is
 *   supposed to describe it.
 *
 *   NOT YET RESOLVED. Whether Statements accumulate as a history the Render
 *   Model reads, or are consumed and discarded, is issue #5. This module keeps
 *   Statements immutable and hands them on; it does not decide their lifetime.
 *
 * WHY DECLARED, NOT EMERGENT. Issue #1. A demonstrator claiming to express
 * CISNA cannot have an ontology that exists only implicitly in whatever the
 * tapes happen to emit, and if the vocabulary were undeclared the Composition
 * Model's rule sets would become the only place meaning is defined, inverting
 * the model. So an undeclared Noun, Verb or attribute value is an error here,
 * loudly, rather than something that quietly flows through to a renderer.
 */

/** Frozen deeply, so a vocabulary cannot be mutated after declaration.
 *  The ontology is a contract; a contract that can be edited at runtime is a
 *  suggestion. */
function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.getOwnPropertyNames(value)) deepFreeze(value[key]);
  }
  return value;
}

export class SemanticsError extends Error {
  constructor(message) {
    super(message);
    this.name = "SemanticsError";
  }
}

/**
 * Declare a Concept Ontology and the Nouns, Verbs and Rules it scopes.
 *
 * @param {object} spec
 * @param {string} spec.id            Ontology identifier.
 * @param {string} spec.version       Vocabulary version. A tape records the
 *                                    version it was written against, so a tape
 *                                    and a vocabulary cannot drift silently.
 * @param {object} spec.nouns         name -> { describes, attributes }
 *                                    attributes: name -> { type, range?, of? }
 *                                    `range` is the Noun Attribute Range: an
 *                                    array of permitted values, or {min,max}.
 * @param {object} spec.verbs         name -> { describes }
 * @param {Array}  spec.rules         [{ verb, noun, describes }] — the Rules
 *                                    relating Verbs to Nouns. A Statement is
 *                                    only well-formed if a Rule permits it.
 */
export function defineOntology(spec) {
  const { id, version, nouns = {}, verbs = {}, rules = [] } = spec;
  if (!id) throw new SemanticsError("ontology needs an id");
  if (!version) throw new SemanticsError("ontology needs a version");

  for (const [nounName, noun] of Object.entries(nouns)) {
    for (const [attrName, attr] of Object.entries(noun.attributes ?? {})) {
      if (!attr.type) {
        throw new SemanticsError(
          `noun attribute ${nounName}.${attrName} has no type`,
        );
      }
      /* A Noun Attribute whose type is another Noun must name a declared one.
       * This is what makes the ontology a graph rather than a list. */
      if (attr.type === "noun" && !nouns[attr.of]) {
        throw new SemanticsError(
          `noun attribute ${nounName}.${attrName} refers to undeclared noun "${attr.of}"`,
        );
      }
    }
  }

  const ruleIndex = new Map();
  for (const rule of rules) {
    if (!verbs[rule.verb]) {
      throw new SemanticsError(`rule refers to undeclared verb "${rule.verb}"`);
    }
    if (!nouns[rule.noun]) {
      throw new SemanticsError(`rule refers to undeclared noun "${rule.noun}"`);
    }
    ruleIndex.set(`${rule.verb}:${rule.noun}`, rule);
  }

  return deepFreeze({
    id,
    version,
    nouns,
    verbs,
    rules,
    /** Is this Verb permitted against this Noun? */
    permits(verb, noun) {
      return ruleIndex.has(`${verb}:${noun}`);
    },
    ruleFor(verb, noun) {
      return ruleIndex.get(`${verb}:${noun}`);
    },
  });
}

/** Check one attribute value against its declared Noun Attribute Range. */
function checkRange(ontology, nounName, attrName, value) {
  const attr = ontology.nouns[nounName]?.attributes?.[attrName];
  if (!attr) {
    return `undeclared attribute "${attrName}" on noun "${nounName}"`;
  }
  const { type, range } = attr;

  if (type === "enum") {
    if (!range.includes(value)) {
      return `${nounName}.${attrName} = ${JSON.stringify(value)} is outside its range [${range.join(", ")}]`;
    }
    return null;
  }
  if (type === "int") {
    if (!Number.isInteger(value)) return `${nounName}.${attrName} must be an integer`;
    if (range && (value < range.min || value > range.max)) {
      return `${nounName}.${attrName} = ${value} is outside its range ${range.min}..${range.max}`;
    }
    return null;
  }
  if (type === "boolean") {
    return typeof value === "boolean" ? null : `${nounName}.${attrName} must be boolean`;
  }
  if (type === "string" || type === "noun") return null;
  return `unknown attribute type "${type}"`;
}

/**
 * A Statement: a Rule instantiated against a particular Noun at a particular
 * moment. In this demonstrator a game event is a Statement (see MY CHOICE
 * above). Immutable once made.
 *
 * @param {object} ontology  from defineOntology
 * @param {object} spec
 * @param {string} spec.verb     e.g. "move"
 * @param {string} spec.noun     e.g. "FallingTile"
 * @param {string} [spec.of]     instance identity, when more than one instance
 *                               of a Noun can exist (rows, for example)
 * @param {object} [spec.attributes]  attribute values asserted by this Statement
 * @param {number} [spec.at]     logical time. NOT wall-clock: the tape supplies
 *                               it so that runs are reproducible.
 */
export function statement(ontology, spec) {
  const { verb, noun, of = null, attributes = {}, at = null } = spec;

  if (!ontology.verbs[verb]) {
    throw new SemanticsError(`undeclared verb "${verb}"`);
  }
  if (!ontology.nouns[noun]) {
    throw new SemanticsError(`undeclared noun "${noun}"`);
  }
  if (!ontology.permits(verb, noun)) {
    throw new SemanticsError(
      `no rule permits "${verb}" on "${noun}" — add a Rule, or the Statement is not well-formed`,
    );
  }
  const problems = [];
  for (const [attrName, value] of Object.entries(attributes)) {
    const problem = checkRange(ontology, noun, attrName, value);
    if (problem) problems.push(problem);
  }
  if (problems.length) {
    throw new SemanticsError(`statement ${verb} ${noun}: ${problems.join("; ")}`);
  }

  return deepFreeze({
    kind: "statement",
    ontology: ontology.id,
    ontologyVersion: ontology.version,
    verb,
    noun,
    of,
    attributes,
    at,
    /** Human-readable form, used by the phase-0 demo's trace pane. */
    toString() {
      const who = of === null ? noun : `${noun}#${of}`;
      const attrs = Object.entries(attributes)
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join(" ");
      return attrs ? `${verb} ${who} ${attrs}` : `${verb} ${who}`;
    },
  });
}

/**
 * A Notion: a concrete content element the Application Model will present.
 * Figure 6 relates Notions to Nouns and gives them their own attributes.
 *
 * MY CHOICE: Notions are held in a small mutable store rather than being
 * immutable like Statements, because the note describes Notions as *content*
 * that the Render Model populates the Application Model from, and content in a
 * real-time system changes. Statements are the record of what happened;
 * Notions are the current state that record produces.
 */
export class NotionStore {
  constructor(ontology) {
    this.ontology = ontology;
    this.notions = new Map();
  }

  /** key is `Noun` or `Noun#instance`. */
  static key(noun, of = null) {
    return of === null ? noun : `${noun}#${of}`;
  }

  set(noun, of, attributes) {
    if (!this.ontology.nouns[noun]) {
      throw new SemanticsError(`undeclared noun "${noun}"`);
    }
    const problems = [];
    for (const [attrName, value] of Object.entries(attributes)) {
      const problem = checkRange(this.ontology, noun, attrName, value);
      if (problem) problems.push(problem);
    }
    if (problems.length) {
      throw new SemanticsError(`notion ${noun}: ${problems.join("; ")}`);
    }
    const key = NotionStore.key(noun, of);
    const existing = this.notions.get(key);
    const next = {
      kind: "notion",
      noun,
      of,
      attributes: { ...(existing?.attributes ?? {}), ...attributes },
    };
    this.notions.set(key, next);
    return next;
  }

  get(noun, of = null) {
    return this.notions.get(NotionStore.key(noun, of)) ?? null;
  }

  /** All Notions of a given Noun, for rule sets that match on type. */
  allOf(noun) {
    return [...this.notions.values()].filter((n) => n.noun === noun);
  }

  all() {
    return [...this.notions.values()];
  }
}
