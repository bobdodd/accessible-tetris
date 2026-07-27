/* The declared Tetris Concept Ontology.
 * ---------------------------------------------------------------------------
 * CONTENT, not mechanism. `cradle/document/semantics.js` is generic CISNA and
 * knows nothing about Tetris; this file is the vocabulary it scopes. Keeping
 * them apart is the test of whether the cradle is really a reusable framework
 * or just Tetris with extra steps.
 *
 * MY CHOICE (design/DEMOS.md §6a). The note gives the *shape* of a Semantics
 * Layer but no Tetris vocabulary, so every Noun, Verb and Rule below is chosen
 * here. Two principles guided the choice:
 *
 *   1. Nouns are things the game HAS, not things a renderer needs. "Silhouette"
 *      is a Noun because the game genuinely has an accumulated stack;
 *      "TerrainScan" is not, because that is a metaphor for expressing the
 *      silhouette and belongs to Inventory. Getting this boundary wrong would
 *      collapse the layers the whole demonstrator exists to separate.
 *   2. Start small. Only what the first tape needs. Issue #1's mitigation was
 *      that the vocabulary grows as demos require, versioned so tapes cannot
 *      drift from it silently.
 *
 * Deliberately absent so far: Margin, Gap, Column, Level, Ghost, and anything
 * Navigation-layer (issue #4). They arrive when a demo needs them.
 */
import { defineOntology } from "../cradle/document/semantics.js";

/** The seven tetrominoes. Case study §2. */
export const SHAPES = ["I", "O", "T", "S", "Z", "J", "L"];

/** Orientation as compass points, following the case study's
 *  direction-as-direction discussion. Four rotations, no SRS kick states —
 *  DESIGN.md §0 scopes those out and says so rather than smuggling it. */
export const ORIENTATIONS = ["N", "E", "S", "W"];

/** 10 columns; 20 visible rows plus 2 hidden spawn rows. Case study §2. */
export const COLUMNS = 10;
export const VISIBLE_ROWS = 20;
export const HIDDEN_ROWS = 2;

export const tetris = defineOntology({
  id: "tetris",
  version: "0.1.0",

  nouns: {
    PlayingField: {
      describes: "The grid the game happens in.",
      attributes: {
        columns: { type: "int", range: { min: 1, max: 64 } },
        visibleRows: { type: "int", range: { min: 1, max: 64 } },
        hiddenRows: { type: "int", range: { min: 0, max: 8 } },
      },
    },

    FallingTile: {
      describes:
        "The tetromino currently under the player's control. The one Noun " +
        "that is simultaneously game-influenced, user-influenced and " +
        "time-influenced, which is why the case study treats it as the hard case.",
      attributes: {
        shape: { type: "enum", range: SHAPES },
        orientation: { type: "enum", range: ORIENTATIONS },
        /* Column of the piece's origin cell, not its leftmost cell: rotation
         * moves the footprint, and an origin that moves under rotation would
         * make "the piece is at column 4" mean different things before and
         * after a rotate. */
        column: { type: "int", range: { min: 0, max: COLUMNS - 1 } },
        row: { type: "int", range: { min: 0, max: VISIBLE_ROWS + HIDDEN_ROWS - 1 } },
      },
    },

    Silhouette: {
      describes:
        "The accumulated stack of locked tiles: the game's history made " +
        "visible. Case study §5 lists history as a presentation metaphor; here " +
        "it is a Noun because the game has one whether or not anything renders it.",
      attributes: {
        /* Per-column height. Held as a string of digits so a Statement stays a
         * flat, loggable, comparable value; a nested array would make tape
         * diffing and the phase-0 trace pane harder to read for no gain at
         * this size. Revisit if columns ever exceed single digits of height. */
        heights: { type: "string" },
        highest: { type: "int", range: { min: 0, max: VISIBLE_ROWS + HIDDEN_ROWS } },
      },
    },

    Row: {
      describes: "One row of the playing field. Instanced by index.",
      attributes: {
        index: { type: "int", range: { min: 0, max: VISIBLE_ROWS + HIDDEN_ROWS - 1 } },
        complete: { type: "boolean" },
      },
    },

    NextBox: {
      describes: "The upcoming piece, known to the player. Case study §2.",
      attributes: { shape: { type: "enum", range: SHAPES } },
    },

    HoldBox: {
      describes: "The held piece, swappable once per fall. Case study §2.",
      attributes: {
        shape: { type: "enum", range: SHAPES },
        available: { type: "boolean" },
      },
    },

    Score: {
      describes: "Points and lines cleared.",
      attributes: {
        points: { type: "int", range: { min: 0, max: 99999999 } },
        lines: { type: "int", range: { min: 0, max: 999999 } },
      },
    },
  },

  verbs: {
    begin: { describes: "Bring into existence." },
    spawn: { describes: "A new tile enters the field at the hidden rows." },
    move: { describes: "Lateral translation under player control." },
    rotate: { describes: "Change of orientation under player control." },
    descend: { describes: "Downward translation under the game clock." },
    land: {
      describes:
        "Contact with the silhouette or floor. Distinct from lock: a landed " +
        "tile is still movable, and may begin falling again. Case study §2.",
    },
    lock: { describes: "The tile becomes part of the silhouette. Irreversible." },
    clear: { describes: "A complete row is removed." },
    hold: { describes: "The tile is swapped into the hold box." },
    update: { describes: "A value changed." },
  },

  /* The Rules. A Statement is only well-formed if a Rule permits its Verb
   * against its Noun, so this list is the grammar of what can be said about
   * this game. Note what is NOT permitted: nothing may `move` a Silhouette,
   * and nothing may `rotate` a Row. Those are not omissions, they are the
   * point — the ontology refuses to express nonsense. */
  rules: [
    { verb: "begin", noun: "PlayingField", describes: "The field is established." },
    { verb: "spawn", noun: "FallingTile", describes: "A tile enters play." },
    { verb: "move", noun: "FallingTile", describes: "The player moves the tile sideways." },
    { verb: "rotate", noun: "FallingTile", describes: "The player rotates the tile." },
    { verb: "descend", noun: "FallingTile", describes: "The clock advances the tile downward." },
    { verb: "land", noun: "FallingTile", describes: "The tile reaches a resting position." },
    { verb: "lock", noun: "FallingTile", describes: "The tile joins the silhouette." },
    { verb: "update", noun: "Silhouette", describes: "The stack changed shape." },
    { verb: "clear", noun: "Row", describes: "A completed row is removed." },
    { verb: "update", noun: "NextBox", describes: "The upcoming piece changed." },
    { verb: "hold", noun: "HoldBox", describes: "A tile is placed in the hold box." },
    { verb: "update", noun: "HoldBox", describes: "The hold box changed." },
    { verb: "update", noun: "Score", describes: "Points or lines changed." },
  ],
});
