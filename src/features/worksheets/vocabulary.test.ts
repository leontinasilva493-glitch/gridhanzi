import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

type VocabularyRecord = {
  hanzi: string;
  pinyin: string;
  english: string;
};

const vocabulary = readFile(
  new URL("./hsk-vocabulary.json", import.meta.url),
  "utf8",
).then((source) => JSON.parse(source) as VocabularyRecord[]);

test("high-frequency HSK records use the teaching sense and pronunciation", async () => {
  const records = new Map(
    (await vocabulary).map((record) => [record.hanzi, record]),
  );
  const expected: VocabularyRecord[] = [
    {
      hanzi: "不一会儿",
      pinyin: "bù yíhuìr",
      english: "in a little while",
    },
    { hanzi: "假", pinyin: "jiǎ", english: "false; fake" },
    { hanzi: "草", pinyin: "cǎo", english: "grass" },
    { hanzi: "船", pinyin: "chuán", english: "boat; ship" },
    { hanzi: "句", pinyin: "jù", english: "sentence; phrase" },
    { hanzi: "打", pinyin: "dǎ", english: "to hit; to play; to make" },
    { hanzi: "见过", pinyin: "jiàn guò", english: "to have seen" },
    { hanzi: "加", pinyin: "jiā", english: "to add" },
    { hanzi: "包", pinyin: "bāo", english: "bag; to wrap; to include" },
    { hanzi: "读", pinyin: "dú", english: "to read" },
    { hanzi: "画", pinyin: "huà", english: "to draw; picture" },
  ];

  for (const record of expected) {
    assert.deepEqual(records.get(record.hanzi), record);
  }
});

test("display pinyin never leaks numeric tone suffixes", async () => {
  const invalid = (await vocabulary).filter((record) =>
    /\d/u.test(record.pinyin),
  );

  assert.deepEqual(invalid, []);
});

test("compact meanings never default to a surname or variant entry", async () => {
  const invalid = (await vocabulary).filter((record) =>
    /^surname\b|variant of/iu.test(record.english),
  );

  assert.deepEqual(invalid, []);
});

test("common standalone words do not use proper-noun or rare readings", async () => {
  const records = new Map(
    (await vocabulary).map((record) => [record.hanzi, record]),
  );
  const expected: VocabularyRecord[] = [
    { hanzi: "白", pinyin: "bái", english: "white" },
    { hanzi: "比", pinyin: "bǐ", english: "to compare; than" },
    { hanzi: "都", pinyin: "dōu", english: "all; both" },
    { hanzi: "过", pinyin: "guò", english: "to pass; to cross" },
    { hanzi: "还", pinyin: "hái", english: "still; also" },
    { hanzi: "教", pinyin: "jiāo", english: "to teach" },
    { hanzi: "那", pinyin: "nà", english: "that; then" },
    { hanzi: "鸟", pinyin: "niǎo", english: "bird" },
    { hanzi: "日", pinyin: "rì", english: "day; sun" },
    { hanzi: "也", pinyin: "yě", english: "also; too" },
    { hanzi: "坐", pinyin: "zuò", english: "to sit" },
  ];

  for (const record of expected) {
    assert.deepEqual(records.get(record.hanzi), record);
  }
});
