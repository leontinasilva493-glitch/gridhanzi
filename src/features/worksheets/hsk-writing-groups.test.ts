import assert from "node:assert/strict";
import test from "node:test";

import {
  getHskWritingGroupBySlug,
  hskWritingGroupPages,
  hskWritingGroupPaths,
} from "./hsk-writing-groups";
import { buildPublicSitemapPaths } from "./seo";

test("HSK 3.0 writing group pages preserve the 6 official syllabus groups and exact counts", () => {
  assert.deepEqual(
    hskWritingGroupPages.map((group) => [group.slug, group.count, group.cumulative]),
    [
      ["level-1-2", 100, 100],
      ["level-3", 150, 250],
      ["level-4", 150, 400],
      ["level-5", 150, 550],
      ["level-6", 150, 700],
      ["level-7-9", 500, 1200],
    ],
  );

  for (const group of hskWritingGroupPages) {
    assert.equal(group.characters.length, group.count);
    assert.equal(getHskWritingGroupBySlug(group.slug)?.path, group.path);
    const batchedChars = group.batches.flatMap((batch) => batch.characters);
    assert.deepEqual(batchedChars, group.characters);
    for (const batch of group.batches) {
      assert.ok(batch.characters.length > 0 && batch.characters.length <= 30);
      assert.ok(batch.worksheetHref.startsWith("/generator?words="));
    }
  }
});

test("all 6 HSK 3.0 writing group pages have unique metadata and are indexed once in the sitemap", () => {
  assert.equal(new Set(hskWritingGroupPages.map((g) => g.title)).size, 6);
  assert.equal(new Set(hskWritingGroupPages.map((g) => g.description)).size, 6);
  assert.equal(new Set(hskWritingGroupPages.map((g) => g.heading)).size, 6);

  const sitemapPaths = buildPublicSitemapPaths();
  for (const path of hskWritingGroupPaths) {
    assert.equal(sitemapPaths.filter((item) => item === path).length, 1, path);
  }
});
