import assert from "node:assert/strict";
import test from "node:test";

const approvedFirstBatch = [
  "\u7684", "\u4e00", "\u662f", "\u5728", "\u4e86", "\u6211", "\u4f60", "\u4eba",
  "\u6765", "\u53bb", "\u8bf4", "\u5b66", "\u7ecf", "\u4f53", "\u8bae",
] as const;

const trendingCharacter = "\u725b";

const contentClusterCharacters = [
  "好", "不", "没", "有", "上", "下", "大", "小", "家", "水",
  "书", "吃", "喝", "二", "再", "得", "地", "坏",
] as const;

const firstBatchTiers: Record<
  (typeof approvedFirstBatch)[number],
  StrokeOrderLearningTier
> = {
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
  strokeOrderLearningTiers,
  type StrokeOrderCharacter,
  type StrokeOrderLearningTier,
} from "./stroke-order-characters";

test("published character order contains the existing guides plus the approved first batch", () => {
  assert.deepEqual(strokeOrderCharacters.map((entry) => entry.character), [
    "\u7231", "\u5e74", "\u4f5b", ...approvedFirstBatch, trendingCharacter,
    ...contentClusterCharacters,
  ]);
});

test("content-cluster guides expose exact HSK evidence and differentiated teaching copy", () => {
  const expectedLevels: Record<(typeof contentClusterCharacters)[number], string[]> = {
    好: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    不: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    没: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    有: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    上: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    下: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    大: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    小: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    家: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    水: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    书: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    吃: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    喝: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    二: ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
    再: ["HSK 2.0 Level 2", "HSK 3.0 Level 1"],
    得: ["HSK 2.0 Level 2", "HSK 3.0 Level 2"],
    地: ["HSK 2.0 Level 3", "HSK 3.0 Level 1"],
    坏: ["HSK 2.0 Level 3", "HSK 3.0 Level 1"],
  };

  const titles = new Set<string>();
  const usageTitles = new Set<string>();
  for (const character of contentClusterCharacters) {
    const entry = getStrokeOrderCharacter(character);
    assert.ok(entry, `${character} is published`);
    assert.deepEqual(
      entry.hsk.map((card) => `${card.system} ${card.level}`),
      expectedLevels[character],
      `${character} exact HSK levels`,
    );
    assert.ok(entry.hsk.every((card) => card.evidenceKind === "standalone"));
    assert.ok(entry.examples.length >= 4, `${character} vocabulary examples`);
    assert.equal(entry.exampleSentences.length, 3, `${character} graded sentences`);
    titles.add(entry.seo.title);
    usageTitles.add(entry.usageTitle);
  }
  assert.equal(titles.size, contentClusterCharacters.length);
  assert.equal(usageTitles.size, contentClusterCharacters.length);
});

test("source-bound HSK cards preserve literal per-system evidence anchors", () => {
  const expected: Record<
    string,
    Array<{
      system: string;
      level: string;
      evidenceKind: "standalone" | "word-family";
      note: string;
    }>
  > = {
    "\u725b": [
      {
        system: "HSK 2.0",
        level: "Level 2",
        evidenceKind: "word-family",
        note: "Word-family anchor: \u725b\u5976 is listed at Level 2; this is not a standalone-character level claim.",
      },
      {
        system: "HSK 3.0",
        level: "Level 1",
        evidenceKind: "word-family",
        note: "Word-family anchor: \u725b\u5976 is listed at Level 1; this is not a standalone-character level claim.",
      },
      {
        system: "HSK 3.0",
        level: "Level 3",
        evidenceKind: "standalone",
        note: "Exact \u725b (ni\u00fa) record is listed at Level 3.",
      },
    ],
    "\u4f5b": [
      {
        system: "HSK 3.0",
        level: "Level 6",
        evidenceKind: "word-family",
        note: "Reading-specific Level 6 evidence: 佛教 supports fó and Buddhism, while standalone 佛 (fú) and 仿佛 (fǎngfú) mean seemingly; this is not a general standalone fó level claim.",
      },
    ],
    "\u7ecf": [
      { system: "HSK 2.0", level: "Level 2", evidenceKind: "word-family", note: "Word-family anchor: 已经 is listed at Level 2; this is not a standalone-character level claim." },
      { system: "HSK 3.0", level: "Level 2", evidenceKind: "word-family", note: "Word-family anchors: 经常 and 经过 are listed at Level 2; this is not a standalone-character level claim." },
    ],
    "\u4f53": [
      { system: "HSK 2.0", level: "Level 2", evidenceKind: "word-family", note: "Word-family anchor: 身体 is listed at Level 2; this is not a standalone-character level claim." },
      { system: "HSK 3.0", level: "Level 1", evidenceKind: "word-family", note: "Word-family anchor: 身体 is listed at Level 1; this is not a standalone-character level claim." },
    ],
    "\u8bae": [
      { system: "HSK 2.0", level: "Level 3", evidenceKind: "word-family", note: "Word-family anchor: 会议 is listed at Level 3; this is not a standalone-character level claim." },
      { system: "HSK 3.0", level: "Level 3", evidenceKind: "word-family", note: "Word-family anchor: 会议 is listed at Level 3; this is not a standalone-character level claim." },
    ],
    "\u8bf4": [
      { system: "HSK 2.0", level: "Level 1", evidenceKind: "word-family", note: "Word-family anchor: 说话 is listed at Level 1; it does not establish an official standalone level for everyday shuō." },
      { system: "HSK 3.0", level: "Level 1", evidenceKind: "word-family", note: "Word-family anchor: 说话 is listed at Level 1; the standalone shuì record is not evidence for everyday shuō." },
    ],
    "\u5b66": [
      { system: "HSK 2.0", level: "Level 1", evidenceKind: "word-family", note: "Word-family anchor: student and school vocabulary is listed at Level 1; this is not a standalone-character level claim." },
      { system: "HSK 3.0", level: "Level 1", evidenceKind: "standalone", note: "Exact 学 (xué) record is listed at Level 1." },
    ],
  };

  for (const [character, cards] of Object.entries(expected)) {
    assert.deepEqual(getStrokeOrderCharacter(character)?.hsk, cards, character);
  }
});

test("every HSK card declares standalone or word-family evidence", () => {
  for (const entry of strokeOrderCharacters) {
    for (const card of entry.hsk) {
      assert.ok(
        ["standalone", "word-family"].includes(
          (card as { evidenceKind?: string }).evidenceKind ?? "",
        ),
        `${entry.character} ${card.system} ${card.level}`,
      );
    }
  }
});

test("JSON-LD educational levels include standalone evidence and omit word-family-only evidence", async () => {
  const data = await import("./stroke-order-characters");
  const getEducationalLevels = (data as typeof data & {
    getStrokeOrderEducationalLevels?: (
      entry: Pick<StrokeOrderCharacter, "hsk">,
    ) => string[];
  }).getStrokeOrderEducationalLevels;
  const buildLearningResource = (data as typeof data & {
    buildStrokeOrderLearningResourceData?: (
      entry: StrokeOrderCharacter,
      pageUrl: string,
    ) => Record<string, unknown>;
  }).buildStrokeOrderLearningResourceData;
  const standaloneGuide = getStrokeOrderCharacter("\u7684");
  const wordFamilyGuide = getStrokeOrderCharacter("\u7ecf");

  assert.equal(typeof getEducationalLevels, "function");
  assert.equal(typeof buildLearningResource, "function");
  assert.ok(standaloneGuide);
  assert.ok(wordFamilyGuide);
  assert.deepEqual(getEducationalLevels!(standaloneGuide), [
    "HSK 2.0 Level 1",
    "HSK 3.0 Level 1",
  ]);
  assert.deepEqual(getEducationalLevels!(wordFamilyGuide), []);
  assert.deepEqual(
    buildLearningResource!(standaloneGuide, "https://gridhanzi.org/stroke-order/的")
      .educationalLevel,
    ["HSK 2.0 Level 1", "HSK 3.0 Level 1"],
  );
  assert.equal(
    Object.hasOwn(
      buildLearningResource!(wordFamilyGuide, "https://gridhanzi.org/stroke-order/经"),
      "educationalLevel",
    ),
    false,
  );
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

test("every graded sentence contains the character taught by its guide", () => {
  for (const entry of strokeOrderCharacters) {
    for (const sentence of entry.exampleSentences) {
      assert.ok(
        sentence.hanzi.includes(entry.character),
        `${entry.character} ${sentence.learningLabel}: ${sentence.hanzi}`,
      );
    }
  }
});

test("了 records the two strokes without assigning the hook to stroke one", () => {
  const entry = getStrokeOrderCharacter("了");

  assert.ok(entry);
  assert.equal(entry.radical, "亅");
  assert.deepEqual(entry.components, [
    {
      character: "了",
      explanation:
        "Stroke 1 is 横撇: a short horizontal that turns into a left-falling stroke. Stroke 2 is 弯钩: a vertical stroke that curves into the finishing hook.",
    },
  ]);
  assert.equal(
    entry.writingTip,
    "Write stroke 1 as a compact 横撇, turning from the short horizontal into a left fall. Begin stroke 2 separately, draw the vertical curve, and finish with a small 弯钩.",
  );
  assert.doesNotMatch(entry.components[0].explanation, /stroke 1[^.]*hook/i);
  assert.doesNotMatch(entry.writingTip, /first stroke[^.]*hook/i);
});

test("经 records simplified 纟 plus 𢀖 and contrasts 轻 by its left component", () => {
  const entry = getStrokeOrderCharacter("经");

  assert.ok(entry);
  assert.deepEqual(entry.components, [
    {
      character: "纟",
      explanation: "The silk radical is narrow and forms three compact left-side strokes.",
    },
    {
      character: "𢀖",
      explanation:
        "The simplified right component 𢀖 supplies the taller structure and grounded base.",
    },
  ]);
  assert.equal(
    entry.confusableCharacter.guidance,
    "经 and 轻 share the right component 𢀖; they differ on the left: 经 has 纟, while 轻 has 车.",
  );
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
    ["爱", "年", "佛", ...approvedFirstBatch, trendingCharacter, ...contentClusterCharacters],
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
    assert.ok(entry.examples.length >= 4, `${entry.character} example words`);

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
  assert.equal(getStrokeOrderCharacter("牛")?.pinyin, "niú");
  assert.equal(getStrokeOrderCharacter("永"), undefined);
});

test("牛 and 来 expose an explicit 牛来 context without treating the title as HSK vocabulary", () => {
  for (const character of ["牛", "来"] as const) {
    const entry = getStrokeOrderCharacter(character) as
      | (StrokeOrderCharacter & {
          trendContext?: { title: string; summary: string; href: string; linkLabel: string };
        })
      | undefined;

    assert.ok(entry, `${character} is published`);
    assert.equal(entry.trendContext?.href, "/chinese-slang/niu-lai");
    assert.match(entry.trendContext?.title ?? "", /牛来/);
    assert.match(entry.trendContext?.summary ?? "", /not an HSK|not a standard|film title/i);
  }
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

  assert.deepEqual(strokeOrderLearningTiers, [
    "High-frequency",
    "Beginner",
    "Advanced",
    "Foundation",
  ]);
  assert.deepEqual(groups.map((group) => group.tier), strokeOrderLearningTiers);
  assert.ok(
    indexableStrokeOrderCharacters.every((entry) =>
      strokeOrderLearningTiers.includes(entry.learningTier),
    ),
  );
  assert.deepEqual(
    groups.flatMap((group) => group.entries.map((entry) => entry.character)).sort(),
    indexableStrokeOrderCharacters.map((entry) => entry.character).sort(),
  );
  assert.throws(
    () =>
      groupByTier!([
        {
          ...indexableStrokeOrderCharacters[0],
          learningTier: "Advanced typo",
        } as unknown as StrokeOrderCharacter,
      ]),
    /Unknown stroke-order learning tier: Advanced typo/,
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

test("published character guides expose the approved character-specific search metadata", () => {
  const approvedSeo = [
    ["\u7684", "de", "de", "\u7684 (de) Stroke Order, Meaning & Grammar", "How to Write \u7684 (de): Stroke Order, Meaning & Usage", "Learn how to write \u7684 (de), the common possessive and descriptive particle. See its 8 strokes, neutral-tone usage, example words, sentences, and worksheet practice."],
    ["\u4e00", "y\u012b", "y\u012b", "\u4e00 (y\u012b) Stroke Order, Meaning & Tone Changes", "How to Write \u4e00 (y\u012b): Stroke Order and Tone Changes", "Learn how to write \u4e00 (y\u012b), meaning \u201cone.\u201d Follow its single stroke and understand when y\u012b changes to y\u00ed or y\u00ec in common words and sentences."],
    ["\u662f", "sh\u00ec", "sh\u00ec", "\u662f (sh\u00ec) Stroke Order, Meaning & Usage", "How to Write \u662f (sh\u00ec): Stroke Order, Meaning & Usage", "Learn how to write \u662f (sh\u00ec), meaning \u201cto be\u201d or \u201ccorrect.\u201d See its 9 strokes and learn identity, question and negation patterns with examples."],
    ["\u5728", "z\u00e0i", "z\u00e0i", "\u5728 (z\u00e0i) Stroke Order, Meaning & Grammar", "How to Write \u5728 (z\u00e0i): Location and Ongoing Actions", "Learn how to write \u5728 (z\u00e0i) and use it for location and ongoing actions. Follow its 6 strokes and practise common grammar patterns and sentences."],
    ["\u4e86", "le", "le", "\u4e86 (le) Stroke Order, Meaning & Grammar", "How to Write \u4e86 (le): Stroke Order and Two Core Uses", "Learn how to write \u4e86 (le) and use it for completed actions and changes of state. See its 2 strokes, example sentences and common learner mistakes."],
    ["\u6211", "w\u01d2", "w\u01d2", "\u6211 (w\u01d2) Stroke Order, Meaning & Examples", "How to Write \u6211 (w\u01d2): Stroke Order, Meaning & Examples", "Learn how to write \u6211 (w\u01d2), meaning \u201cI\u201d or \u201cme.\u201d Follow its 7 strokes and practise first-person phrases, sentences and printable writing grids."],
    ["\u4f60", "n\u01d0", "n\u01d0", "\u4f60 (n\u01d0) Stroke Order, Meaning & Examples", "How to Write \u4f60 (n\u01d0): Stroke Order, Meaning & Examples", "Learn how to write \u4f60 (n\u01d0), meaning \u201cyou.\u201d See its 7-stroke structure and practise \u4f60\u597d, \u4f60\u4eec and other useful phrases and sentences."],
    ["\u4eba", "r\u00e9n", "r\u00e9n", "\u4eba (r\u00e9n) Stroke Order, Meaning & Examples", "How to Write \u4eba (r\u00e9n): Stroke Order, Meaning & Examples", "Learn how to write \u4eba (r\u00e9n), meaning \u201cperson\u201d or \u201cpeople.\u201d Follow its 2 strokes, compare \u4eba with \u5165, and practise common words and sentences."],
    ["\u6765", "l\u00e1i", "l\u00e1i", "\u6765 (l\u00e1i) Stroke Order, Meaning & Direction", "How to Write \u6765 (l\u00e1i): Stroke Order and Directional Use", "Learn how to write \u6765 (l\u00e1i), meaning \u201cto come.\u201d Follow its 7 strokes and understand movement toward a speaker or reference point by comparing \u6765 and \u53bb."],
    ["\u53bb", "q\u00f9", "q\u00f9", "\u53bb (q\u00f9) Stroke Order, Meaning & Direction", "How to Write \u53bb (q\u00f9): Stroke Order and Directional Use", "Learn how to write \u53bb (q\u00f9), meaning \u201cto go.\u201d See its 5 strokes and understand movement away from a reference point through words and sentences."],
    ["\u8bf4", "shu\u014d", "shu\u014d", "\u8bf4 (shu\u014d) Stroke Order, Meaning & Readings", "How to Write \u8bf4 (shu\u014d): Stroke Order, Usage & Readings", "Learn how to write \u8bf4 (shu\u014d), meaning \u201cto say\u201d or \u201cspeak.\u201d See its 9 strokes, everyday speech patterns and the alternate shu\u00ec reading in \u8bf4\u670d."],
    ["\u5b66", "xu\u00e9", "xu\u00e9", "\u5b66 (xu\u00e9) Stroke Order, Meaning & Examples", "How to Write \u5b66 (xu\u00e9): Stroke Order, Meaning & Word Family", "Learn how to write \u5b66 (xu\u00e9), meaning \u201clearn\u201d or \u201cstudy.\u201d Explore its structure and practise useful words including \u5b66\u751f, \u5b66\u6821 and \u5b66\u4e60."],
    ["\u7ecf", "j\u012bng", "j\u012bng", "\u7ecf (j\u012bng) Stroke Order, Meaning & Common Words", "How to Write \u7ecf (j\u012bng): Stroke Order and Common Words", "Learn how to write \u7ecf (j\u012bng) through \u5df2\u7ecf, \u7ecf\u5e38, \u7ecf\u8fc7 and \u7ecf\u9a8c. See its 8 strokes, \u7e9f + \u{22016} structure and example sentences."],
    ["\u4f53", "t\u01d0", "t\u01d0", "\u4f53 (t\u01d0) Stroke Order, Meaning & Common Words", "How to Write \u4f53 (t\u01d0): Stroke Order and Common Words", "Learn how to write \u4f53 (t\u01d0) through \u8eab\u4f53, \u4f53\u80b2, \u4f53\u91cd and \u6574\u4f53. Follow its 7 strokes and compare its \u4ebb + \u672c structure with \u4f11."],
    ["\u8bae", "y\u00ec", "y\u00ec", "\u8bae (y\u00ec) Stroke Order, Meaning & Common Words", "How to Write \u8bae (y\u00ec): Stroke Order and Discussion Words", "Learn how to write \u8bae (y\u00ec) through \u4f1a\u8bae, \u5efa\u8bae, \u8bae\u8bba and \u8bae\u9898. See its 5 strokes, \u8ba0 + \u4e49 structure and meeting-related examples."],
    ["\u7231", "\u00e0i", "\u00e0i", "\u7231 (\u00e0i) Stroke Order, Meaning & Examples", "How to Write \u7231 (\u00e0i): Stroke Order, Meaning & Examples", "Learn how to write \u7231 (\u00e0i), meaning \u201cto love\u201d or \u201clike.\u201d Follow its 10 strokes and practise common words, graded sentences and printable grids."],
    ["\u5e74", "ni\u00e1n", "ni\u00e1n", "\u5e74 (ni\u00e1n) Stroke Order, Meaning & Examples", "How to Write \u5e74 (ni\u00e1n): Stroke Order, Meaning & Examples", "Learn how to write \u5e74 (ni\u00e1n), meaning \u201cyear.\u201d Follow its 6 strokes and practise calendar words such as \u4eca\u5e74, \u660e\u5e74 and \u53bb\u5e74."],
    ["\u4f5b", "f\u00f3", "f\u00f3/f\u00fa", "\u4f5b (f\u00f3/f\u00fa) Stroke Order, Meaning & Readings", "How to Write \u4f5b (f\u00f3/f\u00fa): Stroke Order and Readings", "Learn how to write \u4f5b and distinguish f\u00f3 in Buddhist vocabulary from f\u00fa in \u4eff\u4f5b. See its 7 strokes, components, example words and sentences."],
    ["\u725b", "ni\u00fa", "ni\u00fa", "\u725b (ni\u00fa) Stroke Order, Meaning & Slang Use", "How to Write \u725b (ni\u00fa): Stroke Order, Meaning & Slang", "Learn how to write \u725b (ni\u00fa), meaning cow or ox, and why it can mean \u201cawesome\u201d in Chinese slang. Follow its 4 strokes, common words and the \u725b\u6765 meme context."],
  ] as const;

  for (const [character, pinyin, displayPinyin, title, h1, description] of approvedSeo) {
    const entry = getStrokeOrderCharacter(character);

    assert.ok(entry, `${character} is published`);
    assert.equal(entry.pinyin, pinyin, `${character} primary Pinyin`);
    assert.equal(entry.seo.title, title, `${character} title`);
    assert.equal(entry.seo.description, description, `${character} description`);
    assert.equal(entry.seo.h1, h1, `${character} H1`);
    assert.ok(entry.seo.title.includes(character), `${character} title character`);
    assert.ok(entry.seo.title.includes(displayPinyin), `${character} title Pinyin`);
    assert.ok(entry.seo.title.includes("Stroke Order"), `${character} title stroke order`);
    assert.ok(entry.seo.description.includes(character), `${character} description character`);
    assert.ok(entry.seo.description.includes(pinyin), `${character} description Pinyin`);
    assert.ok(entry.seo.h1.includes(character), `${character} H1 character`);
    assert.ok(entry.seo.h1.includes(displayPinyin), `${character} H1 Pinyin`);
  }
});

test("every published character guide provides a character-specific SEO H1", () => {
  for (const entry of strokeOrderCharacters) {
    assert.equal(typeof entry.seo.h1, "string", `${entry.character} H1 exists`);
  }
});

test("经 SEO keeps the approved supplementary-plane component glyph", () => {
  const description = getStrokeOrderCharacter("经")?.seo.description;

  assert.ok(description);
  assert.match(description, /纟 \+ 𢀖 structure/);
  assert.doesNotMatch(description, /∁6|\\u22016/);
});
