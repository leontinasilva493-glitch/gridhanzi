import assert from "node:assert/strict";
import test from "node:test";

import { indexableStrokeOrderCharacters } from "./stroke-order-characters";
import {
  filterStrokeOrderDictionary,
  getStrokeOrderDictionaryFacets,
  toStrokeOrderDictionaryEntries,
} from "./stroke-order-dictionary";

const entries = toStrokeOrderDictionaryEntries(indexableStrokeOrderCharacters);

test("dictionary projects only reviewed fields and keeps every published guide", () => {
  assert.equal(entries.length, indexableStrokeOrderCharacters.length);
  assert.equal(new Set(entries.map((entry) => entry.character)).size, entries.length);
  assert.deepEqual(Object.keys(entries[0] ?? {}).sort(), [
    "character", "meaning", "pinyin", "radical", "strokes",
  ]);
  assert.equal(entries[0]?.character, "爱");
});

test("dictionary searches Hanzi, toned and untoned Pinyin, and English meanings", () => {
  for (const query of ["爱", "ài", "ai", "love"]) {
    assert.ok(filterStrokeOrderDictionary(entries, { query, radical: "", strokes: null })
      .some((entry) => entry.character === "爱"), query);
  }
  for (const query of ["shéi", "shei"]) {
    assert.ok(filterStrokeOrderDictionary(entries, { query, radical: "", strokes: null })
      .some((entry) => entry.character === "谁"), query);
  }
});

test("dictionary combines query, radical, and stroke count without changing Pinyin browse order", () => {
  const who = entries.find((entry) => entry.character === "谁");
  assert.ok(who);
  assert.deepEqual(filterStrokeOrderDictionary(entries, {
    query: "who", radical: who.radical, strokes: who.strokes,
  }).map((entry) => entry.character), ["谁"]);
  assert.deepEqual(filterStrokeOrderDictionary(entries, {
    query: "who", radical: who.radical, strokes: who.strokes + 1,
  }), []);
  assert.deepEqual(filterStrokeOrderDictionary(entries, {
    query: "", radical: "", strokes: null,
  }), entries);
  assert.deepEqual(getStrokeOrderDictionaryFacets(entries).strokeCounts,
    [...new Set(entries.map((entry) => entry.strokes))].sort((a, b) => a - b));
});
