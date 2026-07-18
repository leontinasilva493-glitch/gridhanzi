import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPracticeCells,
  getLearnStrokeRowCount,
  getTestAnswerCharacters,
  paginateLearnUnits,
  paginatePracticeEntries,
  paginateTestEntries,
  resolveWorksheetLayout,
  splitEntryIntoCharacterUnits,
} from "./layout";
import {
  defaultWorksheetSettings,
  type WorksheetEntry,
  type WorksheetProfile,
  type WorksheetSettings,
} from "./types";

test("defaults to the Kids Practice worksheet", () => {
  assert.equal(defaultWorksheetSettings.mode, "write");
  assert.equal(defaultWorksheetSettings.profile, "kids");
  assert.equal(defaultWorksheetSettings.cellSize, 22);
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

function settings(
  profile: WorksheetProfile,
  overrides: Partial<WorksheetSettings> = {},
): WorksheetSettings {
  const defaults = {
    kids: { cellSize: 22, paperSize: "a4" as const },
    adult: { cellSize: 14, paperSize: "a4" as const },
    tablet: { cellSize: 112, paperSize: "tablet" as const },
    brush: { cellSize: 40, paperSize: "a4" as const },
  }[profile];
  return {
    ...defaultWorksheetSettings,
    profile,
    ...defaults,
    ...overrides,
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

test("default profiles resolve to approved columns and page capacities", () => {
  assert.deepEqual(
    [
      resolveWorksheetLayout(settings("kids")),
      resolveWorksheetLayout(settings("adult")),
      resolveWorksheetLayout(settings("tablet")),
      resolveWorksheetLayout(settings("brush")),
    ].map(({ practiceColumns, rowsPerPage }) => ({
      practiceColumns,
      rowsPerPage,
    })),
    [
      { practiceColumns: 8, rowsPerPage: 8 },
      { practiceColumns: 12, rowsPerPage: 12 },
      { practiceColumns: 6, rowsPerPage: 5 },
      { practiceColumns: 4, rowsPerPage: 5 },
    ],
  );
});

test("Kids practice has one model, two trace, and five blank cells", () => {
  const cells = buildPracticeCells(
    "家",
    resolveWorksheetLayout(settings("kids")),
  );

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

test("Adult, Tablet, and Brush preserve their teaching patterns", () => {
  const adult = buildPracticeCells(
    "学",
    resolveWorksheetLayout(settings("adult")),
  );
  const tablet = buildPracticeCells(
    "学",
    resolveWorksheetLayout(settings("tablet")),
  );
  const brush = buildPracticeCells(
    "学",
    resolveWorksheetLayout(settings("brush")),
  );

  assert.equal(adult.length, 12);
  assert.equal(tablet.length, 6);
  assert.equal(brush.length, 4);
  assert.deepEqual(
    adult.slice(0, 2).map((cell) => cell.kind),
    ["model", "trace"],
  );
  assert.deepEqual(brush.map((cell) => cell.kind), [
    "model",
    "trace",
    "blank",
    "blank",
  ]);
});

test("practice pagination keeps normal words together and preserves every character", () => {
  const entries = [
    entry("家庭", "family"),
    entry("妈妈", "mother"),
    entry("爸爸", "father"),
    entry("姐姐", "sister"),
    entry("妹妹", "younger-sister"),
  ];
  const pages = paginatePracticeEntries(
    entries,
    resolveWorksheetLayout(settings("kids")),
  );

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
    resolveWorksheetLayout(settings("kids")),
  );

  assert.deepEqual(pages.map((page) => page.length), [8, 2]);
  assert.deepEqual(
    pages.flat().map((unit) => unit.character),
    ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
  );
  assert.equal(pages[1]?.[0]?.showContext, true);
});

test("test worksheets use profile-aware prompt capacities", () => {
  const entries = Array.from({ length: 21 }, (_, index) =>
    entry("家", `row-${index}`),
  );

  assert.deepEqual(
    paginateTestEntries(
      entries,
      resolveWorksheetLayout(settings("kids")),
    ).map((page) => page.length),
    [8, 8, 5],
  );
  assert.deepEqual(
    paginateTestEntries(
      entries,
      resolveWorksheetLayout(settings("adult")),
    ).map((page) => page.length),
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
  const pages = paginateLearnUnits(
    units,
    counts,
    true,
    resolveWorksheetLayout(settings("kids")),
  );

  assert.deepEqual(pages.map((page) => page.length), [4, 1]);
  assert.deepEqual(
    pages.flat().map((unit) => unit.character),
    ["一", "二", "三", "四", "五"],
  );
});
