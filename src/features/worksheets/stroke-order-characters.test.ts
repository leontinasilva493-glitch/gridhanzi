import assert from "node:assert/strict";
import test from "node:test";

import {
  filterIndexableStrokeOrderCharacters,
  getStrokeOrderCharacter,
  indexableStrokeOrderCharacters,
  strokeOrderCharacters,
} from "./stroke-order-characters";

test("curated stroke-order pages contain complete learning content", () => {
  assert.deepEqual(
    strokeOrderCharacters.map((entry) => entry.character),
    ["爱", "年", "佛"],
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
