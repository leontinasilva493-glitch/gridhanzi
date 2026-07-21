import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { worksheetTemplates } from "./data";

const projectFile = (path: string) =>
  readFile(new URL(`../../../${path}`, import.meta.url), "utf8");

test("homepage distributes worksheet search terms across useful copy", async () => {
  const [homeSource, shellSource, homePageSource] = await Promise.all([
    projectFile("src/features/worksheets/components/home-page.tsx"),
    projectFile("src/features/worksheets/components/site-shell.tsx"),
    projectFile("src/app/[locale]/page.tsx"),
  ]);

  assert.match(
    homeSource,
    /Chinese Character Practice Sheet Generator/,
  );
  assert.match(
    homeSource,
    /Create printable Chinese writing worksheets from any English or\s*Chinese vocabulary list\. Check the Hanzi and Pinyin, choose a\s*grid, then download a PDF\./,
  );
  assert.match(
    homePageSource,
    /Create printable Chinese writing worksheets from any English or Chinese vocabulary list\. Add Pinyin, tracing, and writing grids, then download a free PDF\./,
  );
  assert.match(
    homeSource,
    /What can I make with this Chinese writing worksheet generator\?/,
  );
  assert.match(homeSource, /This Chinese worksheet generator turns any English or Chinese vocabulary list/);
  assert.match(homeSource, /Is the printable Chinese worksheet generator free\?/);
  assert.match(
    homeSource,
    /Does the Hanzi practice sheet generator include Pinyin and stroke order\?/,
  );
  assert.match(homePageSource, /"@type": "FAQPage"/);
  assert.match(
    homePageSource,
    /What can I make with this Chinese writing worksheet generator\?/,
  );
  assert.match(homePageSource, /Is the printable Chinese worksheet generator free\?/);
  assert.match(
    homePageSource,
    /Does the Hanzi practice sheet generator include Pinyin and stroke order\?/,
  );
  assert.match(homeSource, /Build from my word list/);
  assert.match(homeSource, /Start with a worksheet/);
  assert.match(homeSource, /Check one character’s stroke order/);
  assert.match(homeSource, /Start with an editable word list/);
  assert.match(homeSource, /Use the same vocabulary for practice at home\./);
  assert.doesNotMatch(
    `${homeSource}\n${shellSource}`,
    /teacher-ready|classroom-ready|Perfect for bilingual families|\bMVP\b|Made to\s+edit/i,
  );
  assert.match(homePageSource, /Chinese Character Practice Sheet Generator/);
});

test("generator and print messages describe user results instead of implementation", async () => {
  const [generatorSource, printSource] = await Promise.all([
    projectFile("src/features/worksheets/components/generator-client.tsx"),
    projectFile("src/features/worksheets/components/print-preview-client.tsx"),
  ]);

  assert.match(generatorSource, /Filling in Hanzi and Pinyin…/);
  assert.match(generatorSource, /Words filled in\. Check the results\./);
  assert.match(
    generatorSource,
    /We filled the words we know\. Check any blank rows\./,
  );
  assert.match(generatorSource, /words ready/);
  assert.doesNotMatch(
    generatorSource,
    /AI-assisted worksheet|AI fields completed|AI is not configured|AI was unavailable|Curated fields loaded/,
  );
  assert.match(
    printSource,
    /Download the PDF for a saved file\. Use Print for printer and copy settings\./,
  );
  assert.match(generatorSource, /Download 3:4 PDF/);
  assert.match(printSource, /Download 3:4 PDF/);
  assert.doesNotMatch(`${generatorSource}\n${printSource}`, /Download for GoodNotes/);
  assert.match(printSource, /fits GoodNotes and other handwriting apps/);
});

test("template pages use concrete teaching copy and distinct descriptions", async () => {
  const [templatesSource, detailSource, metadataSource] = await Promise.all([
    projectFile("src/features/worksheets/components/templates-page.tsx"),
    projectFile("src/features/worksheets/components/template-detail-page.tsx"),
    projectFile("src/app/[locale]/templates/[slug]/page.tsx"),
  ]);

  assert.match(
    templatesSource,
    /Choose an editable word list, then change the words, grid, and paper size\./,
  );
  assert.match(detailSource, /Editable worksheet/);
  assert.match(detailSource, /What students practise/);
  assert.match(detailSource, /Trace, then write/);
  assert.match(detailSource, /See the stroke order/);
  assert.doesNotMatch(
    detailSource,
    /FREE EDITABLE TEMPLATE|Teacher-ready settings|instead of decorative placeholders|Write with confidence/,
  );
  assert.doesNotMatch(metadataSource, /Edit and download .* real stroke order/);

  const descriptions = worksheetTemplates.map((template) =>
    template.description.trim(),
  );
  assert.equal(new Set(descriptions).size, worksheetTemplates.length);
  assert.ok(descriptions.every((description) => description.length >= 55));
});

test("SEO anchors remain while stroke-order guidance stays direct", async () => {
  const [
    layoutSource,
    homePageSource,
    generatorPageSource,
    templatesPageSource,
    strokePageSource,
    strokeClientSource,
  ] = await Promise.all([
    projectFile("src/app/layout.tsx"),
    projectFile("src/app/[locale]/page.tsx"),
    projectFile("src/app/[locale]/generator/page.tsx"),
    projectFile("src/app/[locale]/templates/page.tsx"),
    projectFile("src/app/[locale]/stroke-order/page.tsx"),
    projectFile("src/features/worksheets/components/stroke-order-client.tsx"),
  ]);

  assert.match(homePageSource, /Chinese Character Practice Sheet Generator/);
  assert.match(generatorPageSource, /Chinese Worksheet Generator/);
  assert.match(templatesPageSource, /Printable Chinese Writing Worksheets/);
  assert.match(strokePageSource, /Chinese Stroke Order/);
  assert.doesNotMatch(`${layoutSource}\n${homePageSource}`, /real stroke order/i);
  assert.match(strokeClientSource, /Watch the full animation once\./);
  assert.match(
    strokeClientSource,
    /Use Next stroke to check the direction and shape\./,
  );
  assert.match(
    strokeClientSource,
    /Open the character in the worksheet generator when you are ready to print\./,
  );
  assert.doesNotMatch(strokeClientSource, /Turn \{character\} into/);
});
