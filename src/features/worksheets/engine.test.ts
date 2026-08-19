import assert from "node:assert/strict";
import test from "node:test";

import { localVocabularySize } from "./data";

import {
  cloneTemplateEntries,
  containsUnsupportedInputScript,
  enrichVocabularyLocally,
  getWorksheetEntriesPerPage,
  getTemplateBySlug,
  MAX_VOCABULARY_CHARS,
  MAX_VOCABULARY_ROW_CHARS,
  normalizeVocabularyValues,
  paginateWorksheetEntries,
  parseVocabularyInput,
  WORKSHEET_ENTRIES_PER_PAGE,
} from "./engine";

test("parseVocabularyInput trims lines and removes blank rows", () => {
  assert.deepEqual(
    parseVocabularyInput(" family \n\n妈妈\n father, 爸爸 "),
    ["family", "妈妈", "father, 爸爸"],
  );
});

test("detects unsupported writing systems without flagging English or Hanzi", () => {
  assert.equal(containsUnsupportedInputScript("family\n妈妈"), false);
  assert.equal(containsUnsupportedInputScript("café, mother"), false);
  assert.equal(containsUnsupportedInputScript("こんにちは"), true);
  assert.equal(containsUnsupportedInputScript("안녕하세요"), true);
  assert.equal(containsUnsupportedInputScript("Привет"), true);
});

test("enrichVocabularyLocally resolves English, Chinese, and mixed rows", () => {
  assert.deepEqual(enrichVocabularyLocally(["family", "妈妈", "father, 爸爸"]), [
    {
      id: "row-1",
      hanzi: "家庭",
      pinyin: "jiātíng",
      english: "family",
      status: "complete",
    },
    {
      id: "row-2",
      hanzi: "妈妈",
      pinyin: "māma",
      english: "mother",
      status: "complete",
    },
    {
      id: "row-3",
      hanzi: "爸爸",
      pinyin: "bàba",
      english: "father",
      status: "complete",
    },
  ]);
});

test("enrichVocabularyLocally supports common mixed-list separators", () => {
  const rows = [
    "father - 爸爸",
    "爸爸 / father",
    "father: 爸爸",
    "爸爸（father）",
  ];

  for (const entry of enrichVocabularyLocally(rows)) {
    assert.equal(entry.hanzi, "爸爸");
    assert.equal(entry.pinyin, "bàba");
    assert.equal(entry.english, "father");
    assert.equal(entry.status, "complete");
  }
});

test("the offline dictionary contains at least 500 unique teaching terms", () => {
  assert.ok(localVocabularySize >= 500, `expected 500+, received ${localVocabularySize}`);
});

test("enrichVocabularyLocally parses labelled and spreadsheet-style mixed rows", () => {
  const rows = [
    "Chinese: 妈妈 | Pinyin: māma | English: mother",
    "爸爸；bàba；father",
    "teacher → 老师",
    "学生\tstudent",
  ];

  assert.deepEqual(
    enrichVocabularyLocally(rows).map(({ hanzi, english, status }) => ({
      hanzi,
      english,
      status,
    })),
    [
      { hanzi: "妈妈", english: "mother", status: "complete" },
      { hanzi: "爸爸", english: "father", status: "complete" },
      { hanzi: "老师", english: "teacher", status: "complete" },
      { hanzi: "学生", english: "student", status: "complete" },
    ],
  );
});

test("unknown English sentences remain editable when AI is unavailable", () => {
  const [entry] = enrichVocabularyLocally(["The quick brown fox"]);

  assert.equal(entry?.english, "The quick brown fox");
  assert.equal(entry?.hanzi, "");
  assert.equal(entry?.status, "needs-review");
});

test("normalizeVocabularyValues rejects oversized input before enrichment", () => {
  assert.deepEqual(normalizeVocabularyValues("a".repeat(MAX_VOCABULARY_CHARS + 1)), {
    ok: false,
    error: `Keep the worksheet input under ${MAX_VOCABULARY_CHARS} characters.`,
  });

  assert.deepEqual(
    normalizeVocabularyValues(["a".repeat(MAX_VOCABULARY_ROW_CHARS + 1)]),
    {
      ok: false,
      error: `Keep each row under ${MAX_VOCABULARY_ROW_CHARS} characters.`,
    },
  );
});

test("normalizeVocabularyValues preserves valid rows without silent truncation", () => {
  assert.deepEqual(normalizeVocabularyValues([" family ", "妈妈"]), {
    ok: true,
    values: ["family", "妈妈"],
  });
});

test("enrichVocabularyLocally preserves unknown values for manual editing", () => {
  assert.deepEqual(enrichVocabularyLocally(["宇宙飞船", "astronaut"]), [
    {
      id: "row-1",
      hanzi: "宇宙飞船",
      pinyin: "",
      english: "",
      status: "needs-review",
    },
    {
      id: "row-2",
      hanzi: "",
      pinyin: "",
      english: "astronaut",
      status: "needs-review",
    },
  ]);
});

test("getTemplateBySlug returns the curated family template", () => {
  const family = getTemplateBySlug("family");

  assert.equal(family?.title, "Family");
  assert.equal(family?.entries.length, 24);
  assert.equal(family?.entries[0]?.hanzi, "家庭");
});

test("enrichVocabularyLocally converts rows to Taiwan Traditional", () => {
  const entries = enrichVocabularyLocally(
    ["老师", "软件", "自行车"],
    "traditional-tw",
  );

  assert.deepEqual(entries.map((entry) => entry.hanzi), [
    "老師",
    "軟體",
    "腳踏車",
  ]);
});

test("enrichVocabularyLocally resolves Taiwan Traditional input through the local dictionary", () => {
  const [entry] = enrichVocabularyLocally(["媽媽"], "traditional-tw");

  assert.equal(entry?.hanzi, "媽媽");
  assert.equal(entry?.pinyin, "māma");
  assert.equal(entry?.english, "mother");
  assert.equal(entry?.status, "complete");
});

test("cloneTemplateEntries returns Taiwan Traditional template rows", () => {
  const entries = cloneTemplateEntries("family", "traditional-tw");

  assert.ok(entries.some((entry) => entry.hanzi === "爺爺"));
  assert.ok(entries.some((entry) => entry.hanzi === "兒子"));
});

test("getTemplateBySlug returns undefined for unknown slugs", () => {
  assert.equal(getTemplateBySlug("not-a-template"), undefined);
});

test("paginateWorksheetEntries keeps every row in printable page order", () => {
  const entries = getTemplateBySlug("family")?.entries ?? [];
  const pages = paginateWorksheetEntries(
    entries,
    WORKSHEET_ENTRIES_PER_PAGE,
  );

  assert.equal(pages.length, 6);
  assert.deepEqual(
    pages.flat().map((entry) => entry.hanzi),
    entries.map((entry) => entry.hanzi),
  );
  assert.equal(pages[5]?.length, 4);
});

test("stroke-order worksheets reserve enough vertical space for every row", () => {
  assert.equal(getWorksheetEntriesPerPage(true), 3);
  assert.equal(getWorksheetEntriesPerPage(false), 4);
});
