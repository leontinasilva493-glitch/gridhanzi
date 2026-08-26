import assert from "node:assert/strict";
import test from "node:test";

import { indexableStrokeOrderCharacters } from "./stroke-order-characters";
import {
  addRecentPracticeCharacter,
  buildPracticeHref,
  buildPracticeQueue,
  getNextPracticeIndex,
  getPracticeCharacter,
  getPracticeGroup,
  practiceGroups,
  resolveInitialPracticeCharacter,
} from "./practice-session";

test("practice recommendations only contain unique characters with published guide pages", () => {
  const publishedCharacters = new Set(
    indexableStrokeOrderCharacters.map((entry) => entry.character),
  );
  const recommendedCharacters = practiceGroups.flatMap(
    (group) => group.characters,
  );

  assert.equal(getPracticeGroup("starter").characters.length, 10);
  assert.equal(
    new Set(recommendedCharacters).size,
    recommendedCharacters.length,
  );
  assert.deepEqual(
    recommendedCharacters.filter(
      (character) => !publishedCharacters.has(character),
    ),
    [],
  );
});

test("practice session navigation wraps in both directions", () => {
  assert.equal(getNextPracticeIndex(0, 10, 1), 1);
  assert.equal(getNextPracticeIndex(9, 10, 1), 0);
  assert.equal(getNextPracticeIndex(0, 10, -1), 9);
  assert.equal(getNextPracticeIndex(3, 0, 1), 0);
});

test("a selected recommendation starts the queue without dropping its group", () => {
  assert.deepEqual(buildPracticeQueue("starter", "学"), [
    "学",
    "一",
    "人",
    "我",
    "你",
    "来",
    "去",
    "年",
    "爱",
    "牛",
  ]);
});

test("a custom Hanzi can lead a ten-character starter session", () => {
  assert.deepEqual(buildPracticeQueue("starter", "永"), [
    "永",
    "一",
    "人",
    "我",
    "你",
    "来",
    "去",
    "学",
    "年",
    "爱",
  ]);
});

test("recent practice keeps the newest unique characters within the limit", () => {
  assert.deepEqual(
    addRecentPracticeCharacter(["我", "你", "人"], "你", 3),
    ["你", "我", "人"],
  );
  assert.deepEqual(
    addRecentPracticeCharacter(["我", "你", "人"], "学", 3),
    ["学", "我", "你"],
  );
});

test("practice character input accepts published Hanzi and falls back safely", () => {
  assert.equal(resolveInitialPracticeCharacter(" 学习 "), "学");
  assert.equal(resolveInitialPracticeCharacter("永远"), "永");
  assert.equal(resolveInitialPracticeCharacter("A"), "一");
  assert.equal(resolveInitialPracticeCharacter(undefined), "一");
  assert.equal(getPracticeCharacter("学")?.pinyin, "xué");
});

test("character guide links enter practice with the selected Hanzi", () => {
  assert.equal(buildPracticeHref("学"), "/practice?character=%E5%AD%A6");
});
