import assert from "node:assert/strict";
import test from "node:test";
import official from "./hsk-2025-beginner-source.json";
import { hskPracticePacks, getHskPracticeEntries } from "./hsk-practice-sets";
import { cloneTemplateEntries } from "./engine";
import { p1BilingualPaths } from "./p1-learning-pages";
import sitemap from "./sitemap";

test("official beginner source preserves all 500 numbered vocabulary rows and combined counts", () => {
  assert.equal(official.entries.length, 500);
  assert.equal(official.entries.filter(row => row.level === 1).length, 300);
  assert.equal(official.entries.filter(row => row.level === 2).length, 200);
  assert.deepEqual(official.entries.map(row => row.number), Array.from({ length: 500 }, (_, i) => i + 1));
  assert.match(official.sha256, /^[a-f0-9]{64}$/);
  assert.ok(official.entries.every(row => row.pdfPage >= 80 && row.pdfPage <= 92 && row.pinyin && row.hanzi));
});

test("selected packs keep exact level membership, source Pinyin and group boundaries through editor handoff", () => {
  const all = new Set<string>();
  for (const pack of hskPracticePacks) {
    assert.equal(pack.sets.length, 3);
    assert.equal(getHskPracticeEntries(pack.slug)?.length, 30);
    assert.equal(cloneTemplateEntries(pack.slug).length, 30);
    for (const set of pack.sets) {
      const entries = cloneTemplateEntries(pack.slug, "simplified", set.id);
      assert.equal(entries.length, 10);
      assert.deepEqual(entries.map(row => row.hanzi), set.words.map(row => row[0]));
      for (const entry of entries) {
        assert.equal(all.has(entry.hanzi), false, entry.hanzi);
        all.add(entry.hanzi);
        const source = official.entries.find(row => row.hanzi === entry.hanzi && row.level === pack.level);
        assert.ok(source, `${entry.hanzi} belongs to Level ${pack.level}`);
        assert.equal(entry.pinyin, source.pinyin);
        assert.ok(entry.english);
        assert.equal(entry.status, "complete");
      }
    }
    assert.equal(getHskPracticeEntries(pack.slug, "missing"), undefined);
  }
  assert.equal(all.size, 60);
});

test("all six bilingual landing pages have reciprocal sitemap language entries", () => {
  const entries = sitemap();
  assert.equal(p1BilingualPaths.length, 6);
  for (const path of p1BilingualPaths) {
    for (const prefix of ["", "/zh"]) {
      const matches = entries.filter(entry => entry.url === `https://gridhanzi.org${prefix}${path}`);
      assert.equal(matches.length, 1);
      assert.deepEqual(matches[0].alternates?.languages, {
        en: `https://gridhanzi.org${path}`, zh: `https://gridhanzi.org/zh${path}`, "x-default": `https://gridhanzi.org${path}`,
      });
    }
  }
});
