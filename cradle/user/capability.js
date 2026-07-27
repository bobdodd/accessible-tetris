/* CISNA / MSIADU Capability Model.
 * ---------------------------------------------------------------------------
 * Part of the cradle: the User Profiling half of the Runtime System.
 *
 * MODEL PROVENANCE (design/DEMOS.md §6a)
 *
 *   MODEL SPECIFIES. Every element and relationship here is Figure 2 of
 *   "User Capability in an Adaptive World" (Dodd, Green & Pearson, MSIADU'09,
 *   doi:10.1145/1631097.1631110): a Subject Ontology scopes many Properties;
 *   Property has five intrinsic sub-types (Boolean, Discrete, Numeric, Text,
 *   Numeric Range); a Composite Property collects Properties under a
 *   Composition Order; Precedence describes a hierarchy of importance over
 *   Properties; Properties are grouped into Capability Templates through
 *   Property In Template, and Templates into Template Sets through Template
 *   In Set.
 *
 *   The two hard rules are the paper's own:
 *
 *     "Subject ontologies are disjoint, so individual properties exist in
 *      exactly one ontology."
 *
 *     "Properties are assumed to have a natural hierarchy of importance
 *      described by the Precedence element… it makes no sense to acquire a
 *      setting for 'minReadFontSizeForFont' if the user has no sight. As is
 *      clear from the 'parent columns', Properties may sometimes appear in
 *      multiple precedence trees."
 *
 *   Note what precedence is NOT. It is not the ontology hierarchy and it does
 *   not respect ontology boundaries — Table 4's readSignText has parents in
 *   both sight and signLanguageSet. A Property sits in exactly one ontology and
 *   in any number of precedence trees. Conflating the two would collapse the
 *   distinction the model is built on.
 *
 *   WHAT THIS MODEL IS NOT. It holds no user data. It is the schema: what can
 *   be known about a person, not what is known about anyone. Values live in the
 *   Capacity Model (capacity.js). The paper is unambiguous that these are
 *   separate models and this module keeps them separate.
 *
 *   THE DEFINITION THAT GOVERNS. "It is what the user can do, not why she
 *   cannot." A property that names a diagnosis rather than an ability is
 *   modelled wrongly, however convenient. The paper's own worked comparison
 *   (Tables 1 and 2, colour-blindness etiologically then as capability) is the
 *   reference for the distinction, and its verdict on the functional
 *   alternative is that "a model of specific solutions for specific conditions
 *   is unwieldy and unquantifiable".
 */

export class CapabilityError extends Error {
  constructor(message) {
    super(message);
    this.name = "CapabilityError";
  }
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.getOwnPropertyNames(value)) deepFreeze(value[key]);
  }
  return value;
}

/** The five intrinsic data types of Figure 2, plus composite.
 *
 *  The paper: "Five intrinsic data types are suggested in Figure 2, covering
 *  Boolean values, numbers, numeric ranges, text, and discrete lists of
 *  alternative values (e.g. FULL, PARTIAL, NONE)." */
export const PROPERTY_TYPES = Object.freeze([
  "boolean",
  "discrete",
  "numeric",
  "numericRange",
  "text",
  "composite",
]);

/* ---------------------------------------------------------------------------
 * Declaration
 * ------------------------------------------------------------------------- */

/**
 * Declare a Capability Model.
 *
 * @param {object} spec
 * @param {string} spec.id
 * @param {string} spec.version
 * @param {object} spec.ontologies   Subject Ontologies, keyed by name.
 * @param {object} spec.properties   Properties, keyed by name.
 * @param {object} [spec.templates]  Capability Templates, keyed by name.
 * @param {object} [spec.templateSets] Template Sets, keyed by name.
 */
export function defineCapability(spec) {
  if (!spec || typeof spec !== "object") {
    throw new CapabilityError("defineCapability needs a spec object");
  }
  const { id, version, ontologies, properties, templates = {}, templateSets = {} } = spec;
  if (!id) throw new CapabilityError("capability model needs an id");
  if (!version) throw new CapabilityError("capability model needs a version");
  if (!ontologies || !Object.keys(ontologies).length) {
    throw new CapabilityError("capability model needs at least one subject ontology");
  }
  if (!properties || !Object.keys(properties).length) {
    throw new CapabilityError("capability model needs at least one property");
  }

  const ontologyNames = new Set(Object.keys(ontologies));
  const propertyNames = new Set(Object.keys(properties));

  /* --- ontologies ------------------------------------------------------- */
  const builtOntologies = {};
  for (const [name, o] of Object.entries(ontologies)) {
    if (!o || typeof o !== "object") {
      throw new CapabilityError(`ontology ${name} must be an object`);
    }
    if (!o.description) {
      throw new CapabilityError(`ontology ${name} needs a description`);
    }
    builtOntologies[name] = {
      name,
      description: o.description,
      /* The paper scopes ontologies to Nesbitt's physical design spaces, but
       * says explicitly that other groupings are possible: "it is possible to
       * imagine other groupings, not related to specific design spaces, with
       * use of language one obvious candidate". `designSpace` records which
       * kind this is, so the distinction survives into the write-up. */
      designSpace: o.designSpace ?? false,
      properties: [],
    };
  }

  /* --- properties ------------------------------------------------------- */
  const built = {};
  for (const [name, p] of Object.entries(properties)) {
    if (!p || typeof p !== "object") {
      throw new CapabilityError(`property ${name} must be an object`);
    }
    if (!PROPERTY_TYPES.includes(p.type)) {
      throw new CapabilityError(
        `property ${name} has type "${p.type}"; expected one of ${PROPERTY_TYPES.join(", ")}`,
      );
    }
    if (!p.ontology) {
      throw new CapabilityError(`property ${name} declares no subject ontology`);
    }
    if (!ontologyNames.has(p.ontology)) {
      throw new CapabilityError(
        `property ${name} is in ontology "${p.ontology}", which is not declared`,
      );
    }
    if (!p.description) {
      throw new CapabilityError(`property ${name} needs a description`);
    }

    const prop = {
      name,
      ontology: p.ontology,
      type: p.type,
      description: p.description,
      /* Precedence parents. The paper's "parent" column. Zero, one, or many —
       * "Properties may sometimes appear in multiple precedence trees". */
      precedence: Object.freeze([...(p.precedence ?? [])]),
    };

    switch (p.type) {
      case "discrete":
        if (!Array.isArray(p.values) || p.values.length < 2) {
          throw new CapabilityError(
            `discrete property ${name} needs a values list of at least two alternatives`,
          );
        }
        prop.values = Object.freeze([...p.values]);
        break;

      case "numeric":
        if (typeof p.min !== "number" || typeof p.max !== "number") {
          throw new CapabilityError(`numeric property ${name} needs numeric min and max`);
        }
        if (p.min > p.max) {
          throw new CapabilityError(`numeric property ${name} has min > max`);
        }
        if (!p.unit) {
          /* The paper's numeric properties are always dimensioned — percentage,
           * minutes, points, milliseconds, Hertz. A bare number in a user
           * profile is the kind of thing that survives one context and breaks
           * in the next. */
          throw new CapabilityError(`numeric property ${name} needs a unit`);
        }
        prop.min = p.min;
        prop.max = p.max;
        prop.unit = p.unit;
        break;

      case "numericRange":
        if (!p.unit) throw new CapabilityError(`numericRange property ${name} needs a unit`);
        prop.unit = p.unit;
        prop.min = p.min ?? null;
        prop.max = p.max ?? null;
        break;

      case "text":
        prop.maxLength = p.maxLength ?? null;
        break;

      case "boolean":
        break;

      case "composite":
        /* "A Property may also be a CompositeProperty. This deals with
         * properties such as the usable audio frequency range for a user,
         * which may be described as a collection of numeric ranges measured in
         * Hertz, with gaps between the ranges. Formalization by the
         * CompositionOrder element allows for a natural order to be applied to
         * the composition, for example ordering the usable frequency ranges
         * from lowest to highest." */
        if (!Array.isArray(p.composedOf) || !p.composedOf.length) {
          throw new CapabilityError(`composite property ${name} needs composedOf`);
        }
        if (!p.compositionOrder) {
          throw new CapabilityError(
            `composite property ${name} needs a compositionOrder (the model's ` +
              `CompositionOrder element; "lowest to highest" is the paper's example)`,
          );
        }
        prop.composedOf = Object.freeze([...p.composedOf]);
        prop.compositionOrder = p.compositionOrder;
        break;
    }

    built[name] = prop;
    builtOntologies[p.ontology].properties.push(name);
  }

  /* --- referential integrity -------------------------------------------- */
  for (const prop of Object.values(built)) {
    for (const parent of prop.precedence) {
      if (!propertyNames.has(parent)) {
        throw new CapabilityError(
          `property ${prop.name} has precedence parent "${parent}", which is not declared`,
        );
      }
    }
    if (prop.type === "composite") {
      for (const part of prop.composedOf) {
        if (!propertyNames.has(part)) {
          throw new CapabilityError(
            `composite property ${prop.name} composes "${part}", which is not declared`,
          );
        }
      }
    }
  }

  /* Precedence must be acyclic, or acquisition order is undefined and the
   * "no point asking X before Y" reasoning has no fixed point. This is the
   * same constraint OOA96 §9.1 places on an ADFD, arrived at independently:
   * a dependency graph you can walk in a cycle is not a dependency graph. */
  detectCycle(built, (p) => p.precedence, "precedence");

  /* Composition must also be acyclic, and a composite may not compose itself. */
  detectCycle(
    built,
    (p) => (p.type === "composite" ? p.composedOf : []),
    "composition",
  );

  /* --- templates -------------------------------------------------------- */
  const builtTemplates = {};
  for (const [name, t] of Object.entries(templates)) {
    if (!Array.isArray(t?.properties) || !t.properties.length) {
      throw new CapabilityError(`template ${name} needs a properties list`);
    }
    for (const p of t.properties) {
      if (!propertyNames.has(p)) {
        throw new CapabilityError(`template ${name} lists "${p}", which is not declared`);
      }
    }
    builtTemplates[name] = {
      name,
      description: t.description ?? "",
      /* "The same Property may exist in many templates, again reflecting the
       * overlaps of Tables 1 to 4." So no uniqueness constraint across
       * templates — only within one. */
      properties: Object.freeze([...new Set(t.properties)]),
    };
  }

  const builtSets = {};
  for (const [name, s] of Object.entries(templateSets)) {
    if (!Array.isArray(s?.templates) || !s.templates.length) {
      throw new CapabilityError(`template set ${name} needs a templates list`);
    }
    for (const t of s.templates) {
      if (!builtTemplates[t]) {
        throw new CapabilityError(`template set ${name} lists template "${t}", which is not declared`);
      }
    }
    builtSets[name] = {
      name,
      description: s.description ?? "",
      templates: Object.freeze([...s.templates]),
    };
  }

  const model = {
    id,
    version,
    ontologies: builtOntologies,
    properties: built,
    templates: builtTemplates,
    templateSets: builtSets,
  };

  /* Attach the derived views before freezing, so callers cannot mutate them
   * and cannot recompute them inconsistently. */
  model.acquisitionOrder = Object.freeze(acquisitionOrder(built));

  return deepFreeze(model);
}

/* ---------------------------------------------------------------------------
 * Derived views
 * ------------------------------------------------------------------------- */

function detectCycle(properties, edgesOf, label) {
  const WHITE = 0, GREY = 1, BLACK = 2;
  const colour = new Map(Object.keys(properties).map((k) => [k, WHITE]));
  const stack = [];

  const visit = (name) => {
    colour.set(name, GREY);
    stack.push(name);
    for (const next of edgesOf(properties[name])) {
      if (colour.get(next) === GREY) {
        const from = stack.indexOf(next);
        throw new CapabilityError(
          `${label} cycle: ${[...stack.slice(from), next].join(" -> ")}`,
        );
      }
      if (colour.get(next) === WHITE) visit(next);
    }
    stack.pop();
    colour.set(name, BLACK);
  };

  for (const name of Object.keys(properties)) {
    if (colour.get(name) === WHITE) visit(name);
  }
}

/**
 * The order in which a Property's setting may sensibly be acquired: every
 * precedence parent before its children.
 *
 * This is the practical payoff of the Precedence element, and it is the
 * paper's own argument for having it — "it makes no sense to acquire a setting
 * for 'minReadFontSizeForFont' if the user has no sight". An acquisition
 * wizard walks this list; so does a validator asking whether a profile is
 * coherent.
 */
export function acquisitionOrder(properties) {
  const out = [];
  const seen = new Set();
  const visit = (name) => {
    if (seen.has(name)) return;
    seen.add(name);
    for (const parent of properties[name].precedence) visit(parent);
    out.push(name);
  };
  /* Sorted for determinism: two runs of the same model must produce the same
   * order, or a diff of two profiles becomes unreadable. */
  for (const name of Object.keys(properties).sort()) visit(name);
  return out;
}

/**
 * Properties whose acquisition is pointless given what is already known.
 *
 * A parent property answered with a "nothing here" value makes its children
 * moot. Which values mean that is not universal — NONE for sight, 0 for a
 * percentage — so the caller supplies the test.
 *
 * MY CHOICE, and flagged as such: the paper states the principle and gives the
 * example, but does not formalise what makes a parent value blocking. Deciding
 * that in the model rather than per-call would be inventing a rule the model
 * does not have.
 */
export function blockedProperties(model, isExhausted) {
  const blocked = new Set();
  for (const name of model.acquisitionOrder) {
    const prop = model.properties[name];
    if (prop.precedence.some((p) => blocked.has(p) || isExhausted(p))) {
      blocked.add(name);
    }
  }
  return blocked;
}

/** Every property in an ontology, in acquisition order. */
export function propertiesOf(model, ontology) {
  if (!model.ontologies[ontology]) {
    throw new CapabilityError(`no such subject ontology: ${ontology}`);
  }
  return model.acquisitionOrder.filter((n) => model.properties[n].ontology === ontology);
}
