import assert from "node:assert/strict";
import test from "node:test";

import {
  getStrokeOrderCharacter,
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
