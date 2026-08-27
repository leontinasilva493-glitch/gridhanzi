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
    /Free Chinese Character Worksheet Generator/,
  );
  assert.match(
    homeSource,
    /Use this free Chinese character worksheet generator to turn your own\s*English or Chinese word list into printable practice sheets\. Edit the\s*Hanzi and Pinyin, choose tracing, Tian Zi Ge, Mi Zi Ge, or blank\s*writing grids/,
  );
  assert.match(
    homePageSource,
    /Use this free Chinese character worksheet generator to turn English or Chinese word lists into editable Hanzi, Pinyin, tracing, and writing-grid PDFs\./,
  );
  assert.match(
    homeSource,
    /What can I make with this Chinese character worksheet generator\?/,
  );
  assert.match(homeSource, /Hanzi grid paper/);
  assert.match(homeSource, /Is the printable Chinese worksheet generator free\?/);
  assert.match(
    homeSource,
    /Does the Hanzi practice sheet generator include Pinyin and stroke order\?/,
  );
  assert.match(homePageSource, /"@type": "FAQPage"/);
  assert.match(
    homePageSource,
    /What can I make with this Chinese character worksheet generator\?/,
  );
  assert.match(homePageSource, /Is the printable Chinese worksheet generator free\?/);
  assert.match(
    homePageSource,
    /Does the Hanzi practice sheet generator include Pinyin and stroke order\?/,
  );
  assert.match(homeSource, /Build from my word list/);
  assert.match(homeSource, /Start with a worksheet/);
  assert.match(homeSource, /Check one character’s stroke order/);
  assert.match(homeSource, /Start with a Chinese worksheet template/);
  assert.match(homeSource, /How to Use the Chinese Character Worksheet Generator/);
  assert.match(homeSource, /Choose a Chinese character practice mode/);
  assert.match(homeSource, /Print Chinese character practice sheets for home/);
  assert.doesNotMatch(
    `${homeSource}\n${shellSource}`,
    /teacher-ready|classroom-ready|Perfect for bilingual families|\bMVP\b|Made to\s+edit/i,
  );
  assert.match(homePageSource, /Chinese Character Worksheet Generator/);
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
  const [
    templatesSource,
    detailSource,
    metadataSource,
    previewSource,
    homeSource,
    templatesRouteSource,
  ] = await Promise.all([
    projectFile("src/features/worksheets/components/templates-page.tsx"),
    projectFile("src/features/worksheets/components/template-detail-page.tsx"),
    projectFile("src/app/[locale]/templates/[slug]/page.tsx"),
    projectFile("src/features/worksheets/components/worksheet-card-preview.tsx").catch(
      () => "",
    ),
    projectFile("src/features/worksheets/components/home-page.tsx"),
    projectFile("src/app/[locale]/templates/page.tsx"),
  ]);

  assert.match(
    templatesSource,
    /Choose a ready-made topic, Pinyin, or HSK worksheet, then edit the\s*Hanzi, grid, and paper size before saving a PDF/,
  );
  assert.match(detailSource, /Editable worksheet/);
  assert.match(detailSource, /What students practise/);
  assert.match(detailSource, /template\.learningGoal/);
  assert.match(detailSource, /template\.teachingTip/);
  assert.match(detailSource, /template\.practiceActivity/);
  assert.match(detailSource, /"@type": "BreadcrumbList"/);
  assert.match(detailSource, /"@type": "ListItem"/);
  assert.match(detailSource, /Trace, then write/);
  assert.match(detailSource, /See the stroke order/);
  assert.doesNotMatch(
    detailSource,
    /FREE EDITABLE TEMPLATE|Teacher-ready settings|instead of decorative placeholders|Write with confidence/,
  );
  assert.doesNotMatch(metadataSource, /Edit and download .* real stroke order/);
  assert.match(previewSource, /WorksheetCardPreview/);
  assert.doesNotMatch(previewSource, /WorksheetPaper|WorksheetMiniature|<svg/);
  assert.match(templatesSource, /WorksheetCardPreview/);
  assert.doesNotMatch(templatesSource, /WorksheetMiniature/);
  assert.match(homeSource, /worksheetTemplates\.slice\(0, 8\)/);
  assert.match(homeSource, /href=\{`\/templates\/\$\{template\.slug\}`\}/);
  assert.match(templatesRouteSource, /toWorksheetTemplateSummary/);

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
    strokePageSource,
    strokeClientSource,
  ] = await Promise.all([
    projectFile("src/app/layout.tsx"),
    projectFile("src/app/[locale]/page.tsx"),
    projectFile("src/app/[locale]/generator/page.tsx"),
    projectFile("src/app/[locale]/stroke-order/page.tsx"),
    projectFile("src/features/worksheets/components/stroke-order-client.tsx"),
  ]);

  assert.match(homePageSource, /Chinese Character Worksheet Generator/);
  assert.match(generatorPageSource, /Chinese Worksheet Generator from Your Word List/);
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
