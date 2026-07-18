import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPracticeCells,
  getDensityLayout,
  getLearnStrokeRowCount,
  getTestAnswerCharacters,
  paginateLearnUnits,
  paginatePracticeEntries,
  paginateTestEntries,
  splitEntryIntoCharacterUnits,
} from "./layout";
import { defaultWorksheetSettings, type WorksheetEntry } from "./types";

test("defaults to the standard Practice worksheet", () => {
  assert.equal(defaultWorksheetSettings.mode, "write");
  assert.equal(defaultWorksheetSettings.gridDensity, "standard");
});

function entry(
  hanzi: string,
  id = `entry-${hanzi}`,
  english = "meaning",
): WorksheetEntry {
  return {
    id,
    hanzi,
    pinyin: "pīnyīn",
    english,
    status: "complete",
  };
}

test("splits a multi-character word into ordered Hanzi units", () => {
  const units = splitEntryIntoCharacterUnits(entry("家庭"));

  assert.deepEqual(
    units.map((unit) => unit.character),
    ["家", "庭"],
  );
  assert.equal(units[0]?.showContext, true);
  assert.equal(units[1]?.showContext, false);
  assert.equal(units[0]?.word, "家庭");
});

test("ignores punctuation while preserving Han character order", () => {
  assert.deepEqual(
    splitEntryIntoCharacterUnits(entry("你，好！")).map(
      (unit) => unit.character,
    ),
    ["你", "好"],
  );
});

test("density presets expose the approved columns and page capacities", () => {
  assert.deepEqual(getDensityLayout("large"), {
    columns: 6,
    rowsPerPage: 7,
  });
  assert.deepEqual(getDensityLayout("standard"), {
    columns: 8,
    rowsPerPage: 8,
  });
  assert.deepEqual(getDensityLayout("compact"), {
    columns: 10,
    rowsPerPage: 10,
  });
});

test("standard practice has one model, two trace, and five blank cells", () => {
  const cells = buildPracticeCells("家", "standard");

  assert.deepEqual(
    cells.map((cell) => cell.kind),
    [
      "model",
      "trace",
      "trace",
      "blank",
      "blank",
      "blank",
      "blank",
      "blank",
    ],
  );
  assert.deepEqual(
    cells.map((cell) => cell.value),
    ["家", "家", "家", "", "", "", "", ""],
  );
});

test("large and compact practice preserve three teaching cells", () => {
  assert.equal(buildPracticeCells("学", "large").length, 6);
  assert.equal(buildPracticeCells("学", "compact").length, 10);
  assert.deepEqual(
    buildPracticeCells("学", "compact")
      .slice(0, 3)
      .map((cell) => cell.kind),
    ["model", "trace", "trace"],
  );
});

test("practice pagination keeps normal words together and preserves every character", () => {
  const entries = [
    entry("家庭", "family"),
    entry("妈妈", "mother"),
    entry("爸爸", "father"),
    entry("姐姐", "sister"),
    entry("妹妹", "younger-sister"),
  ];
  const pages = paginatePracticeEntries(entries, "standard");

  assert.deepEqual(pages.map((page) => page.length), [8, 2]);
  assert.deepEqual(
    pages.flat().map((unit) => unit.character),
    ["家", "庭", "妈", "妈", "爸", "爸", "姐", "姐", "妹", "妹"],
  );
  assert.equal(pages[1]?.[0]?.showContext, true);
  assert.deepEqual(
    pages.flat().filter((unit) => unit.showContext).map((unit) => unit.entryNumber),
    [1, 2, 3, 4, 5],
  );
});

test("practice pagination splits a word only when it exceeds a page", () => {
  const pages = paginatePracticeEntries(
    [entry("一二三四五六七八九十", "numbers")],
    "standard",
  );

  assert.deepEqual(pages.map((page) => page.length), [8, 2]);
  assert.deepEqual(
    pages.flat().map((unit) => unit.character),
    ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
  );
  assert.equal(pages[1]?.[0]?.showContext, true);
});

test("test worksheets paginate ten vocabulary prompts per page", () => {
  const entries = Array.from({ length: 21 }, (_, index) =>
    entry("家", `row-${index}`),
  );

  assert.deepEqual(
    paginateTestEntries(entries).map((page) => page.length),
    [10, 10, 1],
  );
});

test("test prompts allocate one writing cell per Han character", () => {
  assert.deepEqual(getTestAnswerCharacters(entry("图书馆")), ["图", "书", "馆"]);
  assert.deepEqual(getTestAnswerCharacters(entry("你，好！")), ["你", "好"]);
});

test("learn stroke rows preserve frames beyond eight and sixteen strokes", () => {
  assert.equal(getLearnStrokeRowCount(0), 0);
  assert.equal(getLearnStrokeRowCount(1), 1);
  assert.equal(getLearnStrokeRowCount(8), 1);
  assert.equal(getLearnStrokeRowCount(9), 2);
  assert.equal(getLearnStrokeRowCount(16), 2);
  assert.equal(getLearnStrokeRowCount(17), 3);
});

test("learn pagination uses real stroke-row weight without losing units", () => {
  const units = ["一", "二", "三", "四", "五"].flatMap((hanzi, index) =>
    splitEntryIntoCharacterUnits(entry(hanzi, `simple-${index}`)),
  );
  const counts = new Map(units.map((unit) => [unit.character, 5]));
  const pages = paginateLearnUnits(units, counts, true);

  assert.deepEqual(pages.map((page) => page.length), [4, 1]);
  assert.deepEqual(
    pages.flat().map((unit) => unit.character),
    ["一", "二", "三", "四", "五"],
  );
});
