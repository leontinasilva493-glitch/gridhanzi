import assert from "node:assert/strict";
import test from "node:test";
import { teachingSenses } from "./teaching-senses";
import { filterHskCatalog, toWorksheetEntries } from "./hsk";
import { enrichVocabularyLocally } from "./engine";
import { templatePinyin } from "./template-pinyin";
import { worksheetTemplates } from "./data";
import { createTemplatePreviewSnapshot } from "./template-packs";
import { normalizeWorksheetSnapshot } from "./snapshot";

test("quantity questions and beginner classifiers use the intended readings", () => {
  const entries = enrichVocabularyLocally(["万", "几", "吗", "个"]);
  assert.deepEqual(entries.map(({ pinyin, english }) => ({ pinyin, english })), [
    { pinyin: "wàn", english: "ten thousand; 10,000" },
    { pinyin: "jǐ", english: "how many; a few" },
    { pinyin: "ma", english: "yes/no question particle" },
    { pinyin: "gè", english: "general classifier for people and things" },
  ]);
});

test("beginner template snapshots preserve corrected senses and explicit teacher edits", () => {
  for (const slug of ["numbers", "family", "chinese-first-characters"]) {
    const template = worksheetTemplates.find((item) => item.slug === slug)!;
    for (const paper of ["a4", "letter"] as const) {
      const snapshot = createTemplatePreviewSnapshot(template, paper);
      assert.deepEqual(snapshot.entries, template.entries);
      for (const entry of snapshot.entries) {
        const sense = teachingSenses[entry.hanzi];
        if (sense) {
          assert.equal(entry.pinyin, sense.pinyin);
          assert.equal(entry.english, sense.english);
        }
      }
      snapshot.entries[0] = { ...snapshot.entries[0], hanzi: "几", pinyin: "jī", english: "small table (teacher-selected context)" };
      const restored = normalizeWorksheetSnapshot(JSON.parse(JSON.stringify(snapshot)));
      assert.deepEqual(restored.entries, snapshot.entries);
      assert.equal(restored.settings.paperSize, paper);
    }
  }
});

test("reviewed teaching senses agree across HSK versions, editor imports and local lookup", () => {
  const worksheetOnlySenses = new Set(["口", "木", "火", "田", "上"]);
  for (const [hanzi, sense] of Object.entries(teachingSenses)) {
    const matches = filterHskCatalog({ query: hanzi }).filter((entry) => entry.hanzi === hanzi);
    if (!worksheetOnlySenses.has(hanzi)) assert.ok(matches.length, hanzi);
    for (const entry of [...matches, ...toWorksheetEntries(matches), ...enrichVocabularyLocally([hanzi])]) {
      assert.equal(entry.pinyin, sense.pinyin, hanzi);
      assert.equal(entry.english, sense.english, hanzi);
    }
  }
});

test("single-character worksheet defaults keep tones and beginner meanings", () => {
  const entries = enrichVocabularyLocally(["口", "木", "火", "田", "上"]);
  assert.deepEqual(entries.map(({ pinyin, english }) => ({ pinyin, english })), [
    { pinyin: "kǒu", english: "mouth; opening" },
    { pinyin: "mù", english: "wood; tree" },
    { pinyin: "huǒ", english: "fire" },
    { pinyin: "tián", english: "field" },
    { pinyin: "shàng", english: "up; above; previous" },
  ]);
});

test("template-only stroke and beginner action labels keep reviewed tone marks", () => {
  const entries = enrichVocabularyLocally(["横", "竖", "撇", "说", "读", "买", "卖"]);
  assert.deepEqual(entries.map(({ pinyin }) => pinyin), [
    templatePinyin["横"], templatePinyin["竖"], templatePinyin["撇"],
    templatePinyin["说"], templatePinyin["读"], templatePinyin["买"], templatePinyin["卖"],
  ]);
});

test("template entries do not regress to untoned Pinyin outside the neutral-tone allowlist", () => {
  const neutralToneWords = new Set(["的", "了", "们", "地", "着", "么", "吗"]);
  const tone = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/u;
  const untoned = worksheetTemplates.flatMap((template) =>
    template.entries
      .filter((entry) => entry.pinyin && !tone.test(entry.pinyin))
      .map((entry) => entry.hanzi),
  );
  assert.ok(untoned.every((value) => neutralToneWords.has(value)), untoned.join(", "));
});

test("template overlay keeps the result word on its ordinary reading", () => {
  assert.equal(enrichVocabularyLocally(["结果"])[0]?.pinyin, "jié guǒ");
});
