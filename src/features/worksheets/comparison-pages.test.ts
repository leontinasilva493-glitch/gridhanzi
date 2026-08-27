import assert from "node:assert/strict";
import test from "node:test";

import {
  comparisonPages,
  getComparisonPage,
  getComparisonPagesForCharacter,
} from "./comparison-pages";

const expectedSlugs = [
  "的-得-地", "不-没", "来-去", "在-再", "上-下", "好-坏", "人-入", "牛-午",
] as const;

test("comparison collection publishes the eight approved intent-owned pages", () => {
  assert.deepEqual(comparisonPages.map((page) => page.slug), expectedSlugs);
  assert.equal(new Set(comparisonPages.map((page) => page.title)).size, 8);
  assert.equal(new Set(comparisonPages.map((page) => page.description)).size, 8);
  assert.equal(new Set(comparisonPages.map((page) => page.intro)).size, 8);
  assert.equal(getComparisonPage("上-下")?.title, "上 vs 下: Meaning, Direction & Time");
  assert.equal(getComparisonPage("来-去")?.title, "来 vs 去: Direction and Usage");
  assert.equal(getComparisonPage("人-入")?.title, "人 vs 入: Stroke Order Differences");
  assert.equal(getComparisonPage("牛-午")?.title, "牛 vs 午: How to Tell Them Apart");
});

test("each comparison page has enough differentiated teaching material", () => {
  for (const page of comparisonPages) {
    assert.ok(page.items.length >= 2, `${page.slug} compared items`);
    assert.ok(page.items.every((item) => item.examples.length >= 3), `${page.slug} examples`);
    assert.ok(page.mistakes.length >= 3, `${page.slug} mistakes`);
    assert.ok(page.memoryTips.length >= 2, `${page.slug} memory tips`);
    assert.ok(page.faqs.length >= 2, `${page.slug} FAQs`);
    assert.ok(page.worksheetWords.length >= 4, `${page.slug} practice words`);
    assert.ok(page.relatedSlugs.length >= 2, `${page.slug} related comparisons`);
  }
});

test("comparison lookup and character backlinks are explicit", () => {
  assert.equal(getComparisonPage("不-没")?.heading, "不 vs 没: how to choose the right Chinese negative");
  assert.equal(getComparisonPage("unknown"), undefined);
  assert.deepEqual(
    getComparisonPagesForCharacter("地").map((page) => page.slug),
    ["的-得-地"],
  );
  assert.deepEqual(
    getComparisonPagesForCharacter("来").map((page) => page.slug),
    ["来-去"],
  );
});
