import assert from "node:assert/strict";
import test from "node:test";
import { reviewWorksheetEntries } from "./review";
import { defaultWorksheetSettings, type WorksheetEntry } from "./types";

test("export review retains the original positions and names of unmatched words", () => {
  const entries: WorksheetEntry[] = [
    { id: "1", hanzi: "苹果", pinyin: "píngguǒ", english: "apple", status: "complete" },
    { id: "2", hanzi: "", pinyin: "", english: "computer science", status: "complete" },
    { id: "3", hanzi: "善良", pinyin: "  ", english: "kindness", status: "complete" },
  ];
  const result = reviewWorksheetEntries(entries);
  assert.deepEqual(result.ready.map((entry) => entry.id), ["1", "3"]);
  assert.deepEqual(result.pending.map(({ index, missing }) => ({ index, missing })), [
    { index: 1, missing: ["hanzi"] },
  ]);
  assert.equal(entries.length, 3);
  assert.equal(result.pending[0]?.entry.english, "computer science");
});

const hanziOnly: WorksheetEntry = { id: "hanzi", hanzi: "你好", pinyin: "", english: "", status: "needs-review" };
test("writing, learning and Hanzi-only flashcards keep optional fields empty", () => {
  for (const settings of [
    { ...defaultWorksheetSettings, mode: "write" as const },
    defaultWorksheetSettings,
    { ...defaultWorksheetSettings, output: "flashcards" as const, flashcardShowEnglish: false, flashcardShowPinyin: false },
  ]) {
    const review = reviewWorksheetEntries([hanziOnly], settings);
    assert.equal(review.ready.length, 1);
    assert.equal(review.pending.length, 0);
    if (settings.output === "flashcards") assert.equal(review.warnings.length, 0);
  }
});
test("quizzes require a clue, and hidden Pinyin cannot serve as that clue", () => {
  const settings = { ...defaultWorksheetSettings, mode: "quiz" as const };
  assert.equal(reviewWorksheetEntries([hanziOnly], settings).pending.length, 1);
  const withPinyin = { ...hanziOnly, pinyin: "nǐ hǎo" };
  assert.equal(reviewWorksheetEntries([withPinyin], settings).ready.length, 1);
  assert.equal(reviewWorksheetEntries([withPinyin], { ...settings, showPinyin: false }).pending.length, 1);
  assert.equal(reviewWorksheetEntries([{ ...hanziOnly, english: "hello" }], settings).ready.length, 1);
});
