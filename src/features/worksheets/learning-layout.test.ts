import assert from "node:assert/strict";
import test from "node:test";
import { buildLearnUnits, paginateLearnUnits, resolveWorksheetLayout } from "./layout";
import { defaultWorksheetSettings, type WorksheetEntry } from "./types";

const entry = (id: string, hanzi: string): WorksheetEntry => ({ id, hanzi, pinyin: "test", english: "test", status: "complete" });

test("optional unique teaching removes duplicate characters without changing source words", () => {
  const entries = [entry("mother", "妈妈"), entry("study", "学习"), entry("school", "学校")];
  assert.equal(buildLearnUnits(entries).length, 6);
  assert.deepEqual(buildLearnUnits(entries, true).map((unit) => unit.character), ["妈", "学", "习", "校"]);
  assert.equal(entries[0]?.hanzi, "妈妈");
});

test("a word that fits on one page remains together; oversized words still paginate", () => {
  const layout = { ...resolveWorksheetLayout(defaultWorksheetSettings), learnPageWeight: 3 };
  const units = buildLearnUnits([entry("a", "天地"), entry("b", "学习"), entry("long", "一二三四五")]);
  const pages = paginateLearnUnits(units, new Map(), "off", layout, 0, true);
  assert.deepEqual(pages.slice(0, 2).map((page) => page.map((unit) => unit.character).join("")), ["天地", "学习一"]);
  assert.equal(pages.flat().length, units.length);
  assert.ok(pages.every((page) => page.length <= 3));
  const positions = pages.flatMap((page, index) => page.filter((unit) => unit.entryId === "b").map(() => index));
  assert.equal(new Set(positions).size, 1);
});
