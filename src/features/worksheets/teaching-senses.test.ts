import assert from "node:assert/strict";
import test from "node:test";
import { teachingSenses } from "./teaching-senses";
import { filterHskCatalog, toWorksheetEntries } from "./hsk";
import { enrichVocabularyLocally } from "./engine";

test("reviewed teaching senses agree across HSK versions, editor imports and local lookup", () => {
  for (const [hanzi, sense] of Object.entries(teachingSenses)) {
    const matches = filterHskCatalog({ query: hanzi }).filter((entry) => entry.hanzi === hanzi);
    assert.ok(matches.length, hanzi);
    for (const entry of [...matches, ...toWorksheetEntries(matches), ...enrichVocabularyLocally([hanzi])]) {
      assert.equal(entry.pinyin, sense.pinyin, hanzi);
      assert.equal(entry.english, sense.english, hanzi);
    }
  }
});
