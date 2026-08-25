import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPublicHskWorksheetHref,
  filterPublicHskEntries,
  getHskPublicEntries,
  selectVisiblePublicHskEntries,
  summarizePublicHskEntries,
  togglePublicHskSelection,
} from "./hsk-public-utils";
import {
  getHskPublicPage,
  getHskPublicPageFromRoute,
  getHskPublicPath,
  hskPublicPages,
} from "./hsk-pages";

test("public HSK pages expose six distinct system and level combinations", () => {
  assert.equal(hskPublicPages.length, 6);
  assert.deepEqual(
    hskPublicPages.map((page) => `${page.system}:${page.level}`),
    ["2.0:1", "3.0:1", "2.0:2", "3.0:2", "2.0:3", "3.0:3"],
  );
  assert.equal(new Set(hskPublicPages.map((page) => page.intro)).size, 6);
  assert.equal(new Set(hskPublicPages.map((page) => page.description)).size, 6);
});

test("public HSK page lookup rejects unknown route combinations", () => {
  assert.equal(getHskPublicPage("2.0", "1")?.title, "HSK 2.0 Level 1 Vocabulary List");
  assert.equal(getHskPublicPage("3.0", "7-9"), undefined);
  assert.equal(getHskPublicPage("4.0", "1"), undefined);
});

test("a public HSK list contains only the requested system and level", () => {
  const entries = getHskPublicEntries("3.0", "2");

  assert.ok(entries.length > 0);
  assert.ok(entries.every((entry) => entry.system === "3.0" && entry.level === "2"));
});

test("public HSK search matches Hanzi, untoned Pinyin, and English", () => {
  const entries = getHskPublicEntries("2.0", "1");

  assert.ok(filterPublicHskEntries(entries, "爱").some((entry) => entry.hanzi === "爱"));
  assert.ok(filterPublicHskEntries(entries, "xue sheng").some((entry) => entry.hanzi === "学生"));
  assert.ok(filterPublicHskEntries(entries, "teacher").some((entry) => entry.hanzi === "老师"));
});

test("public HSK search normalizes toned, untoned, partial, and padded Pinyin", () => {
  const entries = getHskPublicEntries("2.0", "1");

  for (const query of ["xué sheng", "xue sheng", "  XUE SHENG  "]) {
    assert.ok(
      filterPublicHskEntries(entries, query).some(
        (entry) => entry.hanzi === "学生",
      ),
      query,
    );
  }
  assert.ok(
    filterPublicHskEntries(entries, "xue").some(
      (entry) => entry.hanzi === "学生",
    ),
  );
});

test("public HSK summaries count words and distinct Hanzi", () => {
  const entries = getHskPublicEntries("2.0", "1").filter((entry) =>
    ["爱", "爱好"].includes(entry.hanzi),
  );

  assert.deepEqual(summarizePublicHskEntries(entries), {
    wordCount: entries.length,
    uniqueHanziCount: new Set(entries.flatMap((entry) => Array.from(entry.hanzi))).size,
  });
});

test("featured character links are exact standalone members of their displayed level", () => {
  for (const page of hskPublicPages) {
    const exactCharacters = new Set(
      getHskPublicEntries(page.system, page.level)
        .filter((entry) => Array.from(entry.hanzi).length === 1)
        .map((entry) => entry.hanzi),
    );
    for (const character of page.featuredCharacters) {
      assert.ok(exactCharacters.has(character), `${page.system} Level ${page.level} must contain ${character}`);
    }
  }
});

test("public HSK paths use dot-free system slugs while preserving display versions", () => {
  assert.deepEqual(hskPublicPages.map(getHskPublicPath), [
    "/hsk/2-0/level-1",
    "/hsk/3-0/level-1",
    "/hsk/2-0/level-2",
    "/hsk/3-0/level-2",
    "/hsk/2-0/level-3",
    "/hsk/3-0/level-3",
  ]);
  assert.equal(getHskPublicPageFromRoute("2-0", "level-1")?.system, "2.0");
  assert.equal(getHskPublicPageFromRoute("2.0", "level-1"), undefined);
});

test("public HSK selection toggles one id without mutating the current set", () => {
  const current = new Set(["2.0:1:一"]);
  const added = togglePublicHskSelection(current, "2.0:1:二");
  const removed = togglePublicHskSelection(added, "2.0:1:一");

  assert.deepEqual([...current], ["2.0:1:一"]);
  assert.deepEqual([...added], ["2.0:1:一", "2.0:1:二"]);
  assert.deepEqual([...removed], ["2.0:1:二"]);
});

test("public HSK bulk selection adds at most the first 50 visible entries", () => {
  const entries = getHskPublicEntries("3.0", "1").slice(0, 55);
  const selected = selectVisiblePublicHskEntries(
    new Set(["persisted-selection"]),
    entries,
  );

  assert.equal(selected.size, 51);
  assert.ok(selected.has("persisted-selection"));
  assert.ok(selected.has(entries[49].id));
  assert.equal(selected.has(entries[50].id), false);
});

test("public HSK worksheet links use selected words or preserve the chosen level", () => {
  const entries = getHskPublicEntries("2.0", "1").filter((entry) =>
    ["一", "二"].includes(entry.hanzi),
  );

  assert.equal(
    buildPublicHskWorksheetHref(entries, "2.0", "1"),
    "/generator?words=%E4%B8%80%2C%E4%BA%8C",
  );
  assert.equal(
    buildPublicHskWorksheetHref([], "3.0", "2"),
    "/generator?hskSystem=3.0&hskLevel=2",
  );
});
