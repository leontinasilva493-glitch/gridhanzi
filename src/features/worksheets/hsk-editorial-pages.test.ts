import assert from "node:assert/strict";
import test from "node:test";

import catalog from "./hsk-writing-characters.json";
import { buildPublicSitemapPaths } from "./seo";
import { hskExamGuide, hskWritingCharactersPage } from "./hsk-editorial-pages";

test("official HSK writing-character data preserves the six published groups", () => {
  assert.deepEqual(catalog.groups.map((group) => group.level), ["1-2", "3", "4", "5", "6", "7-9"]);
  assert.deepEqual(catalog.groups.map((group) => group.count), [100, 150, 150, 150, 150, 500]);
  assert.equal(catalog.groups.reduce((total, group) => total + group.characters.length, 0), 1200);
  assert.equal(catalog.sourceUrl.includes("hsk.cn-bj.ufileos.com"), true);
});

test("the two HSK 3.0 editorial routes are indexable sitemap paths", () => {
  const paths = buildPublicSitemapPaths();
  assert.equal(paths.includes("/hsk/3-0-exam-guide"), true);
  assert.equal(paths.includes("/hsk/3-0-writing-characters"), true);
});

test("HSK page metadata names each search intent and avoids a vague promise", () => {
  assert.match(hskExamGuide.title, /HSK 3\.0.*Exam Guide.*Dates.*Syllabus/i);
  assert.match(hskExamGuide.heading, /HSK 3\.0.*2026/);
  assert.match(hskExamGuide.description, /official HSK 3\.0 dates/i);
  assert.match(hskExamGuide.description, /syllabus/i);

  assert.match(hskWritingCharactersPage.title, /HSK 3\.0.*Writing Characters.*Official List/i);
  assert.match(hskWritingCharactersPage.heading, /1,200/);
  assert.match(hskWritingCharactersPage.description, /1,200 HSK 3\.0 writing characters/i);
  assert.match(hskWritingCharactersPage.description, /worksheet/i);
  assert.ok(hskWritingCharactersPage.description.length <= 160);
});
