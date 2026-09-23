import assert from "node:assert/strict";
import test from "node:test";
import { reviewWorksheetEntries } from "./review";
import type { WorksheetEntry } from "./types";

test("export review retains the original positions and names of unmatched words", () => {
  const entries: WorksheetEntry[] = [
    { id: "1", hanzi: "苹果", pinyin: "píngguǒ", english: "apple", status: "complete" },
    { id: "2", hanzi: "", pinyin: "", english: "computer science", status: "complete" },
    { id: "3", hanzi: "善良", pinyin: "  ", english: "kindness", status: "complete" },
  ];
  const result = reviewWorksheetEntries(entries);
  assert.deepEqual(result.ready.map((entry) => entry.id), ["1"]);
  assert.deepEqual(result.pending.map(({ index, missing }) => ({ index, missing })), [
    { index: 1, missing: ["hanzi", "pinyin"] },
    { index: 2, missing: ["pinyin"] },
  ]);
  assert.equal(entries.length, 3);
  assert.equal(result.pending[0]?.entry.english, "computer science");
});
