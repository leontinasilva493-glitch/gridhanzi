import assert from "node:assert/strict";
import test from "node:test";

const approvedFirstBatch = [
  "\u7684", "\u4e00", "\u662f", "\u5728", "\u4e86", "\u6211", "\u4f60", "\u4eba",
  "\u6765", "\u53bb", "\u8bf4", "\u5b66", "\u7ecf", "\u4f53", "\u8bae",
] as const;

const firstBatchTiers: Record<(typeof approvedFirstBatch)[number], string> = {
  "\u7684": "High-frequency", "\u4e00": "High-frequency", "\u662f": "High-frequency",
  "\u5728": "High-frequency", "\u4e86": "High-frequency", "\u6211": "High-frequency",
  "\u4f60": "Beginner", "\u4eba": "Beginner", "\u6765": "Beginner", "\u53bb": "Beginner",
  "\u8bf4": "Beginner", "\u5b66": "Beginner", "\u7ecf": "Advanced", "\u4f53": "Advanced",
  "\u8bae": "Advanced",
};

import {
  filterIndexableStrokeOrderCharacters,
  getStrokeOrderCharacter,
  indexableStrokeOrderCharacters,
  strokeOrderCharacters,
} from "./stroke-order-characters";

test("published character order contains the existing guides plus the approved first batch", () => {
  assert.deepEqual(strokeOrderCharacters.map((entry) => entry.character), [
    "\u7231", "\u5e74", "\u4f5b", ...approvedFirstBatch,
  ]);
});

test("source-bound HSK cards preserve literal per-system word-family anchors", () => {
  const expected: Record<string, Array<{ system: string; level: string; note: string }>> = {
    "\u7ecf": [
      { system: "HSK 2.0", level: "Level 2", note: "Word-family anchor: 已经 is listed at Level 2; this is not a standalone-character level claim." },
      { system: "HSK 3.0", level: "Level 2", note: "Word-family anchors: 经常 and 经过 are listed at Level 2; this is not a standalone-character level claim." },
    ],
    "\u4f53": [
      { system: "HSK 2.0", level: "Level 2", note: "Word-family anchor: 身体 is listed at Level 2; this is not a standalone-character level claim." },
      { system: "HSK 3.0", level: "Level 1", note: "Word-family anchor: 身体 is listed at Level 1; this is not a standalone-character level claim." },
    ],
    "\u8bae": [
      { system: "HSK 2.0", level: "Level 3", note: "Word-family anchor: 会议 is listed at Level 3; this is not a standalone-character level claim." },
      { system: "HSK 3.0", level: "Level 3", note: "Word-family anchor: 会议 is listed at Level 3; this is not a standalone-character level claim." },
    ],
    "\u8bf4": [
      { system: "HSK 2.0", level: "Level 1", note: "Word-family anchor: 说话 is listed at Level 1; it does not establish an official standalone level for everyday shuō." },
      { system: "HSK 3.0", level: "Level 1", note: "Word-family anchor: 说话 is listed at Level 1; the standalone shuì record is not evidence for everyday shuō." },
    ],
    "\u5b66": [
      { system: "HSK 2.0", level: "Level 1", note: "Word-family anchor: student and school vocabulary is listed at Level 1; this is not a standalone-character level claim." },
      { system: "HSK 3.0", level: "Level 1", note: "Exact 学 (xué) record is listed at Level 1." },
    ],
  };

  for (const [character, cards] of Object.entries(expected)) {
    assert.deepEqual(getStrokeOrderCharacter(character)?.hsk, cards, character);
  }
});

test("every approved first-batch guide has its assigned tier and four vocabulary examples", () => {
  for (const character of approvedFirstBatch) {
    const entry = getStrokeOrderCharacter(character);
    assert.ok(entry, `${character} is published`);
    assert.equal(entry.learningTier, firstBatchTiers[character], `${character} tier`);
    assert.ok(entry.examples.length >= 4, `${character} vocabulary examples`);
  }
});

test("complete guides meet the full content contract and link to complete related guides", () => {
  for (const entry of strokeOrderCharacters) {
    assert.equal(entry.publicationStatus, "complete", entry.character);
    assert.ok(entry.importance.trim().length > 30, `${entry.character} importance`);
    assert.ok(entry.components.length > 0, `${entry.character} components`);
    assert.ok(entry.readingNotes.trim().length > 30, `${entry.character} reading notes`);
    assert.ok(entry.useNotes.trim().length > 30, `${entry.character} use notes`);
    assert.ok(entry.commonMistake.trim().length > 30, `${entry.character} common mistake`);
    assert.ok(entry.confusableCharacter.guidance.trim().length > 30, `${entry.character} confusable guidance`);
    assert.ok(entry.relatedCharacters.length > 0, `${entry.character} related guides`);
    for (const related of entry.relatedCharacters) assert.ok(getStrokeOrderCharacter(related), `${entry.character} links to ${related}`);
  }
});

test("every complete guide has one Starter, Developing, and Stretch sentence", () => {
  for (const entry of strokeOrderCharacters) {
    assert.deepEqual(entry.exampleSentences.map((sentence) => sentence.learningLabel).sort(), [
      "Developing", "Starter", "Stretch",
    ], `${entry.character} graded sentences`);
  }
});

test("priority guides preserve their required reading and usage distinctions", () => {
  const requiredCopy: Array<[string, RegExp]> = [
    ["\u7684", /neutral-tone|d[ií]|d[eě]|possessive|modification/i],
    ["\u4e00", /dictionary tone|fourth tone|first|second|third/i],
    ["\u5728", /location|progressive|verb/i], ["\u4e86", /completed|change-of-state|sentence-final/i],
    ["\u8bf4", /shu[oō]|shu[iu]|everyday|default/i], ["\u6765", /speaker|reference point|direction/i],
    ["\u53bb", /speaker|reference point|direction/i],
  ];
  for (const [character, expression] of requiredCopy) {
    const entry = getStrokeOrderCharacter(character);
    assert.ok(entry, `${character} is published`);
    assert.match(`${entry.readingNotes} ${entry.useNotes} ${entry.usage}`, expression, character);
  }
});

test("SEO and substantive teaching fields remain unique across published guides", () => {
  const normalize = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();
  const fields = ["importance", "readingNotes", "useNotes", "usage", "writingTip", "commonMistake"] as const;
  for (const field of fields) {
    const values = strokeOrderCharacters.map((entry) => normalize(entry[field]));
    assert.equal(new Set(values).size, values.length, `${field} is not duplicated`);
  }
  for (const values of [
    strokeOrderCharacters.map((entry) => normalize(entry.seo.title)),
    strokeOrderCharacters.map((entry) => normalize(entry.seo.description)),
    strokeOrderCharacters.map((entry) => normalize(entry.confusableCharacter.guidance)),
  ]) assert.equal(new Set(values).size, values.length, "published copy is not duplicated");
});

test("curated stroke-order pages contain complete learning content", () => {
  assert.deepEqual(
    strokeOrderCharacters.map((entry) => entry.character),
    ["爱", "年", "佛", ...approvedFirstBatch],
  );

  for (const entry of strokeOrderCharacters) {
    assert.ok(entry.pinyin.length > 0, `${entry.character} pinyin`);
    assert.ok(entry.meaning.length > 0, `${entry.character} meaning`);
    assert.ok(entry.strokes > 0, `${entry.character} stroke count`);
    assert.ok(entry.radical.length > 0, `${entry.character} radical`);
    assert.ok(entry.traditional.length > 0, `${entry.character} traditional`);
    assert.ok(entry.structure.length > 0, `${entry.character} structure`);
    assert.ok(entry.hsk.length > 0, `${entry.character} HSK information`);
    assert.ok(entry.usageTitle.length > 0, `${entry.character} usage title`);
    assert.ok(entry.usage.length >= 80, `${entry.character} usage copy`);
    assert.ok(entry.writingTip.length >= 60, `${entry.character} writing tip`);
    assert.ok(entry.examples.length >= 3, `${entry.character} example words`);

    for (const example of entry.examples) {
      assert.ok(example.hanzi.includes(entry.character) || entry.character === "佛");
      assert.ok(example.pinyin.length > 0);
      assert.ok(example.meaning.length > 0);
    }
  }
});

test("character lookup exposes only curated indexable entries", () => {
  assert.equal(getStrokeOrderCharacter("爱")?.pinyin, "ài");
  assert.equal(getStrokeOrderCharacter("年")?.pinyin, "nián");
  assert.equal(getStrokeOrderCharacter("佛")?.pinyin, "fó");
  assert.equal(getStrokeOrderCharacter("永"), undefined);
});

test("complete guides expose the publishing and learning-content contract", () => {
  for (const entry of strokeOrderCharacters) {
    assert.equal(entry.publicationStatus, "complete", entry.character);
    assert.ok(entry.learningTier.length > 0, `${entry.character} learning tier`);
    assert.ok(entry.importance.length > 0, `${entry.character} importance`);
    assert.ok(entry.components.length > 0, `${entry.character} components`);
    assert.ok(
      entry.components.every(
        (component) =>
          component.character.length > 0 && component.explanation.length > 0,
      ),
      `${entry.character} component explanations`,
    );
    assert.ok(entry.readingNotes.length > 0, `${entry.character} reading notes`);
    assert.ok(entry.useNotes.length > 0, `${entry.character} use notes`);
    assert.ok(entry.exampleSentences.length >= 3, `${entry.character} sentences`);
    assert.ok(
      entry.exampleSentences.every(
        (sentence) =>
          sentence.hanzi.length > 0 &&
          sentence.pinyin.length > 0 &&
          sentence.meaning.length > 0,
      ),
      `${entry.character} sentence details`,
    );
    assert.ok(entry.commonMistake.length > 0, `${entry.character} common mistake`);
    assert.ok(
      entry.confusableCharacter.character.length > 0 &&
        entry.confusableCharacter.guidance.length > 0,
      `${entry.character} confusable character guidance`,
    );
    assert.ok(entry.relatedCharacters.length > 0, `${entry.character} related characters`);
    assert.ok(entry.seo.title.length > 0, `${entry.character} SEO title`);
    assert.ok(entry.seo.description.length > 0, `${entry.character} SEO description`);
  }

  assert.equal(
    new Set(strokeOrderCharacters.map((entry) => entry.seo.title)).size,
    strokeOrderCharacters.length,
  );
  assert.equal(
    new Set(strokeOrderCharacters.map((entry) => entry.seo.description)).size,
    strokeOrderCharacters.length,
  );
});

test("publication filter keeps synthetic drafts out of indexable collections", () => {
  const published = filterIndexableStrokeOrderCharacters([
    ...strokeOrderCharacters,
    { character: "草稿", publicationStatus: "draft" as const },
  ]);

  assert.deepEqual(published, indexableStrokeOrderCharacters);
  assert.equal(published.some((entry) => entry.character === "草稿"), false);
});

test("related characters resolve to other indexable guides", () => {
  for (const entry of indexableStrokeOrderCharacters) {
    for (const relatedCharacter of entry.relatedCharacters) {
      assert.notEqual(relatedCharacter, entry.character);
      assert.ok(
        indexableStrokeOrderCharacters.some(
          (candidate) => candidate.character === relatedCharacter,
        ),
        `${entry.character} related guide ${relatedCharacter}`,
      );
    }
  }
});

test("tier grouping includes every indexable guide exactly once in learner-path order", async () => {
  const data = await import("./stroke-order-characters");
  const groupByTier = (data as typeof data & {
    groupStrokeOrderCharactersByTier?: (entries: typeof indexableStrokeOrderCharacters) => Array<{
      tier: string;
      entries: typeof indexableStrokeOrderCharacters;
    }>;
  }).groupStrokeOrderCharactersByTier;

  assert.equal(typeof groupByTier, "function");
  const groups = groupByTier!(indexableStrokeOrderCharacters);

  assert.deepEqual(groups.map((group) => group.tier), [
    "High-frequency",
    "Beginner",
    "Advanced",
    "Foundation",
  ]);
  assert.deepEqual(
    groups.flatMap((group) => group.entries.map((entry) => entry.character)).sort(),
    indexableStrokeOrderCharacters.map((entry) => entry.character).sort(),
  );
});

test("explicit related characters resolve defensively without broad guide discovery", async () => {
  const data = await import("./stroke-order-characters");
  const resolveRelated = (data as typeof data & {
    getRelatedStrokeOrderCharacters?: (entry: Pick<typeof indexableStrokeOrderCharacters[number], "relatedCharacters">) => typeof indexableStrokeOrderCharacters;
  }).getRelatedStrokeOrderCharacters;

  assert.equal(typeof resolveRelated, "function");
  assert.deepEqual(
    resolveRelated!({ relatedCharacters: ["我", "not-a-guide"] }).map(
      (entry) => entry.character,
    ),
    ["我"],
  );
});

test("character lookup accepts URL-encoded route parameters", () => {
  assert.equal(getStrokeOrderCharacter("%E7%88%B1")?.character, "爱");
  assert.equal(getStrokeOrderCharacter("%E5%B9%B4")?.character, "年");
  assert.equal(getStrokeOrderCharacter("%E4%BD%9B")?.character, "佛");
  assert.equal(getStrokeOrderCharacter("%not-valid"), undefined);
});

test("佛 explains its alternate reading in 仿佛", () => {
  const entry = getStrokeOrderCharacter("佛");

  assert.ok(entry);
  assert.match(`${entry.usage} ${entry.examples.map((word) => word.pinyin).join(" ")}`, /fú/);
  assert.ok(entry.examples.some((word) => word.hanzi === "仿佛"));
});
