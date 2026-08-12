import assert from "node:assert/strict";
import test from "node:test";

import { paginateFlashcards } from "./flashcards";
import type { WorksheetEntry } from "./types";

function createEntries(count: number): WorksheetEntry[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `row-${index + 1}`,
    hanzi: `词${index + 1}`,
    pinyin: `ci${index + 1}`,
    english: `word ${index + 1}`,
    status: "complete",
  }));
}

test("paginateFlashcards returns no pages for an empty selection", () => {
  assert.deepEqual(paginateFlashcards([], 6), []);
});

test("paginateFlashcards keeps exact six-card pages intact", () => {
  const entries = createEntries(6);
  const pages = paginateFlashcards(entries, 6);

  assert.equal(pages.length, 1);
  assert.deepEqual(pages[0], entries);
});

test("paginateFlashcards overflows onto a second six-card page without dropping entries", () => {
  const entries = createEntries(7);
  const pages = paginateFlashcards(entries, 6);

  assert.equal(pages.length, 2);
  assert.deepEqual(pages[0], entries.slice(0, 6));
  assert.deepEqual(pages[1], entries.slice(6));
});

test("paginateFlashcards supports nine cards per page", () => {
  const entries = createEntries(10);
  const pages = paginateFlashcards(entries, 9);

  assert.equal(pages.length, 2);
  assert.deepEqual(pages[0], entries.slice(0, 9));
  assert.deepEqual(pages[1], entries.slice(9));
});
