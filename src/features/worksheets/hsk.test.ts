import assert from "node:assert/strict";
import test from "node:test";

import {
  filterHskCatalog,
  summarizeHskSelection,
  toWorksheetEntries,
} from "./hsk";
import { defaultWorksheetSettings } from "./types";

test("filterHskCatalog restricts results to one HSK system", () => {
  const results = filterHskCatalog({ system: "2.0" });

  assert.ok(results.length > 0);
  assert.ok(results.every((entry) => entry.system === "2.0"));
});

test("filterHskCatalog restricts results to one level", () => {
  const results = filterHskCatalog({ system: "3.0", level: "7-9" });

  assert.ok(results.length > 0);
  assert.ok(results.every((entry) => entry.level === "7-9"));
});

test("filterHskCatalog finds a Hanzi query", () => {
  const results = filterHskCatalog({ query: "爱" });

  assert.ok(results.some((entry) => entry.hanzi === "爱"));
});

test("filterHskCatalog matches Pinyin without requiring tone marks", () => {
  const results = filterHskCatalog({ query: "fang jian" });

  assert.ok(
    results.some(
      (entry) => entry.hanzi === "房间" && entry.pinyin === "fáng jiān",
    ),
  );
});

test("filterHskCatalog finds an English meaning", () => {
  const results = filterHskCatalog({ query: "university student" });

  assert.ok(
    results.some(
      (entry) =>
        entry.hanzi === "大学生" && entry.english === "university student",
    ),
  );
});

test("filterHskCatalog exposes existing HSK 3 template membership as a curated theme", () => {
  const results = filterHskCatalog({
    system: "3.0",
    theme: "hsk-3-campus-life",
  });

  assert.ok(results.some((entry) => entry.hanzi === "大学生"));
  assert.ok(
    results.every((entry) => entry.themes.includes("hsk-3-campus-life")),
  );
});

test("catalogue entries use exact stable IDs for each system and level", () => {
  const oldEntry = filterHskCatalog({ system: "2.0", level: "1", query: "爱" })
    .find((entry) => entry.hanzi === "爱");
  const newEntry = filterHskCatalog({ system: "3.0", level: "1", query: "爱" })
    .find((entry) => entry.hanzi === "爱");

  assert.equal(oldEntry?.id, "2.0:1:爱");
  assert.equal(newEntry?.id, "3.0:1:爱");
});

test("toWorksheetEntries creates complete worksheet rows", () => {
  const source = filterHskCatalog({ system: "2.0", level: "1", query: "爱" })
    .filter((entry) => entry.hanzi === "爱");

  assert.deepEqual(toWorksheetEntries(source), [
    {
      id: "2.0:1:爱",
      hanzi: "爱",
      pinyin: "ài",
      english: "to love; to be fond of; to like",
      status: "complete",
    },
  ]);
});

test("summarizeHskSelection counts words, unique Hanzi, and estimated pages", () => {
  const entries = [
    ...filterHskCatalog({ system: "2.0", level: "1", query: "爱" })
      .filter((entry) => entry.hanzi === "爱"),
    ...filterHskCatalog({ system: "2.0", level: "3", query: "爱好" })
      .filter((entry) => entry.hanzi === "爱好"),
  ];

  const summary = summarizeHskSelection(entries, defaultWorksheetSettings);

  assert.equal(summary.wordCount, 2);
  assert.equal(summary.uniqueHanziCount, 2);
  assert.ok(summary.estimatedPageCount > 0);
});
