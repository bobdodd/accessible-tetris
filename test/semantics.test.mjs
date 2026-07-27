import { tetris } from "../vocabulary/tetris.js";
import { statement, NotionStore, SemanticsError } from "../cradle/document/semantics.js";

let pass = 0, fail = 0;
const ok = (label, fn) => { try { fn(); console.log(`  PASS  ${label}`); pass++; } catch (e) { console.log(`  FAIL  ${label}\n        ${e.message}`); fail++; } };
const throws = (label, fn) => { try { fn(); console.log(`  FAIL  ${label} (expected a throw)`); fail++; } catch (e) { if (e instanceof SemanticsError) { console.log(`  PASS  ${label}\n        -> ${e.message}`); pass++; } else { console.log(`  FAIL  ${label} (wrong error: ${e.message})`); fail++; } } };

console.log(`ontology: ${tetris.id} v${tetris.version}  nouns=${Object.keys(tetris.nouns).length} verbs=${Object.keys(tetris.verbs).length} rules=${tetris.rules.length}\n`);

console.log("well-formed statements:");
ok("spawn a T piece", () => {
  const s = statement(tetris, { verb: "spawn", noun: "FallingTile", attributes: { shape: "T", orientation: "N", column: 4, row: 21 }, at: 0 });
  if (String(s) !== 'spawn FallingTile shape="T" orientation="N" column=4 row=21') throw new Error("toString: " + s);
});
ok("clear row 3", () => statement(tetris, { verb: "clear", noun: "Row", of: 3, attributes: { index: 3, complete: true }, at: 7 }));
ok("statements are frozen", () => {
  const s = statement(tetris, { verb: "descend", noun: "FallingTile", attributes: { row: 18 } });
  try { s.verb = "nope"; } catch { /* strict-mode throw is fine too */ }
  if (s.verb !== "descend") throw new Error("statement was mutable");
});

console.log("\nthe ontology refuses nonsense:");
throws("undeclared verb", () => statement(tetris, { verb: "juggle", noun: "FallingTile" }));
throws("undeclared noun", () => statement(tetris, { verb: "move", noun: "Spaceship" }));
throws("no rule permits move on Silhouette", () => statement(tetris, { verb: "move", noun: "Silhouette" }));
throws("no rule permits rotate on Row", () => statement(tetris, { verb: "rotate", noun: "Row", of: 2 }));
throws("shape outside its range", () => statement(tetris, { verb: "spawn", noun: "FallingTile", attributes: { shape: "Q" } }));
throws("column outside its range", () => statement(tetris, { verb: "move", noun: "FallingTile", attributes: { column: 99 } }));
throws("undeclared attribute", () => statement(tetris, { verb: "move", noun: "FallingTile", attributes: { velocity: 3 } }));

console.log("\nnotion store:");
ok("set and read a notion", () => {
  const store = new NotionStore(tetris);
  store.set("FallingTile", null, { shape: "S", orientation: "N", column: 2, row: 20 });
  store.set("FallingTile", null, { row: 19 });
  const n = store.get("FallingTile");
  if (n.attributes.row !== 19 || n.attributes.shape !== "S") throw new Error("merge failed: " + JSON.stringify(n.attributes));
});
ok("instanced notions are separate", () => {
  const store = new NotionStore(tetris);
  store.set("Row", 1, { index: 1, complete: false });
  store.set("Row", 2, { index: 2, complete: true });
  if (store.allOf("Row").length !== 2) throw new Error("expected 2 rows");
});
throws("notion range is enforced too", () => new NotionStore(tetris).set("Score", null, { points: -5 }));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
