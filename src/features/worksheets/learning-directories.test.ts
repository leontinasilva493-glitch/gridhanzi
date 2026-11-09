import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { radicals, radicalGuides, pinyinGuides, pinyinChart, normalizePinyin, findRadical, learningWorksheetEntries, learningDirectoryPaths, radicalTitle, radicalDescription, pinyinTitle, pinyinDescription } from "./learning-directories";
import { buildPublicSitemapPaths, hasWorksheetStateQuery } from "./seo";
import { convertWorksheetEntries } from "./traditional";

test("Kangxi directory covers the exact 214 headings and each reviewed example resolves to its family", () => {
  assert.deepEqual(radicals.map(r=>r.id),Array.from({length:214},(_,i)=>i+1));
  assert.deepEqual(Array.from({length:17},(_,i)=>radicals.filter(r=>r.strokes===i+1).length),[6,23,31,34,23,29,20,9,11,8,6,4,4,2,1,2,1]);
  assert.equal(radicalGuides.length,30);
  const lookup=JSON.parse(readFileSync("public/data/character-radicals.json","utf8")) as Record<string,string>;
  assert.equal(Object.keys(lookup).length,9574);
  for(const r of radicals) assert.ok(r.glyph && r.pinyin && r.meaning);
  for(const r of radicalGuides) {
    assert.equal(r.examples.length,3);
    assert.ok(r.shape && r.usage && r.practice);
    for(const e of r.examples) assert.equal(findRadical(lookup[e.character])?.id,r.id,e.character);
  }
  assert.equal(findRadical(lookup["海"])?.glyph,"水");
  assert.notEqual(lookup["肚"],"月");
});

test("pinyin guides use attested tone examples and distinct syllable spellings", () => {
  assert.equal(pinyinGuides.length,30);
  assert.equal(new Set(pinyinChart.map(p=>p.syllable)).size,409);
  for(const p of pinyinGuides) {
    assert.ok(pinyinChart.some(c=>c.syllable===p.slug));
    for(const e of p.examples) assert.equal(normalizePinyin(e.pinyin),p.slug);
  }
  assert.equal(normalizePinyin("nǚ"),"nü");
  assert.notEqual(normalizePinyin("lǜ"),normalizePinyin("lù"));
  assert.ok(pinyinGuides.find(p=>p.slug==="ma")!.examples.some(e=>e.character==="吗"&&e.pinyin==="ma"));
});

test("lesson worksheets keep chosen polyphonic senses and reject unknown lessons", () => {
  assert.equal(learningWorksheetEntries("pinyin:du")!.find(e=>e.hanzi==="都")!.pinyin,"dū");
  assert.equal(learningWorksheetEntries("radical:earth")!.find(e=>e.hanzi==="地")!.pinyin,"dì");
  const ma=learningWorksheetEntries("pinyin:ma")!;
  assert.equal(ma.find(e=>e.hanzi==="吗")!.pinyin,"ma");
  assert.equal(convertWorksheetEntries(ma,"simplified","traditional-tw").find(e=>e.hanzi==="嗎")!.pinyin,"ma");
  for(const key of ["", "pinyin:bad", "pinyin:du:extra", "unknown:ma", ["pinyin:ma", "pinyin:du"]]) assert.equal(learningWorksheetEntries(key),undefined);
  assert.equal(hasWorksheetStateQuery("/generator",{learning:"pinyin:du"}),true);
});

test("all 62 directory paths are indexed once and lesson metadata and teaching sections are distinct", () => {
  assert.equal(learningDirectoryPaths.length,62);
  const sitemap=buildPublicSitemapPaths();
  for(const path of learningDirectoryPaths) assert.equal(sitemap.filter(p=>p===path).length,1);
  const titles=[...radicalGuides.map(radicalTitle),...pinyinGuides.map(pinyinTitle)];
  const descriptions=[...radicalGuides.map(radicalDescription),...pinyinGuides.map(pinyinDescription)];
  assert.equal(new Set(titles).size,60);assert.equal(new Set(descriptions).size,60);
  const paragraphs=[...radicalGuides.flatMap(r=>[r.shape,r.usage,r.practice]),...pinyinGuides.flatMap(p=>[p.sound,p.contrast,p.practice])];
  assert.equal(new Set(paragraphs).size,180);
});
