import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectFile = (path: string) =>
  readFile(new URL(`../../../${path}`, import.meta.url), "utf8");

test("homepage workbench keeps one primary action and a low-emphasis example", async () => {
  const source = await projectFile(
    "src/features/worksheets/components/home-workbench.tsx",
  );

  assert.match(source, /useState\(""\)/);
  assert.match(source, /Use a family example/);
  assert.match(source, /\{!value\.trim\(\) \? \(/);
  assert.match(source, /tab-separated spreadsheet rows/);
  assert.doesNotMatch(source, /Try Family words/);
  assert.doesNotMatch(source, /Paste from spreadsheet/);
  assert.match(source, /useLocale\(\)/);
  assert.match(source, /localize\(locale,/);
  assert.match(source, /t\("Mixed list", "混合词表"\)/);
  assert.match(source, /t\("Build my worksheet", "生成我的字帖"\)/);
});

test("mobile vocabulary cards expose visible localized reorder actions", async () => {
  const source = await projectFile(
    "src/features/worksheets/components/generator-client.tsx",
  );

  assert.match(source, /t\("Reorder or remove", "调整顺序或删除"\)/);
  assert.match(source, /t\("Move up", "上移"\)/);
  assert.match(source, /t\("Move down", "下移"\)/);
  assert.match(source, /t\("Delete", "删除"\)/);
});

test("generator exposes recoverable local draft controls", async () => {
  const source = await projectFile(
    "src/features/worksheets/components/generator-client.tsx",
  );

  assert.match(source, /Restore worksheet/);
  assert.match(source, /Discard/);
  assert.match(source, /Saved locally/);
  assert.match(source, /Clear saved draft/);
  assert.match(source, /xl:max-h-\[calc\(100vh-10rem\)\] xl:overflow-y-auto/);
});

test("generator exposes a lazy-loaded HSK picker with version-aware copy", async () => {
  const [generatorSource, pickerSource, pickerStateSource] = await Promise.all([
    projectFile("src/features/worksheets/components/generator-client.tsx"),
    projectFile("src/features/worksheets/components/hsk-picker.tsx"),
    projectFile("src/features/worksheets/hsk-picker-state.ts"),
  ]);

  assert.match(generatorSource, /<HskPicker/);
  assert.match(pickerSource, /Choose from HSK/);
  assert.match(pickerSource, /dynamic import\("\.\.\/hsk"\)|import\("\.\.\/hsk"\)/);
  assert.match(pickerSource, /HSK 3\.0.*2026.*global trials/);
  assert.match(pickerSource, /Select filtered/);
  assert.match(pickerSource, /Add selected to worksheet/);
  assert.match(pickerStateSource, /gridhanzi:hsk-picker:v1/);
  assert.match(generatorSource, /openOnMount=\{hasInitialHskSelection\}/);
  assert.match(pickerSource, /resolveInitialHskPickerState/);
  assert.match(pickerSource, /if \(openOnMount\) \{\s*setIsOpen\(true\);[\s\S]*void ensureCatalogLoaded\(\);/);
});

test("generator and preview expose flashcard output controls through a shared renderer", async () => {
  const [generatorSource, previewSource, rendererSource, flashcardSource] =
    await Promise.all([
      projectFile("src/features/worksheets/components/generator-client.tsx"),
      projectFile("src/features/worksheets/components/print-preview-client.tsx"),
      projectFile("src/features/worksheets/components/worksheet-renderer.tsx"),
      projectFile("src/features/worksheets/components/flashcard-paper.tsx"),
    ]);

  assert.match(generatorSource, /Output/);
  assert.match(generatorSource, /Flashcards/);
  assert.match(generatorSource, /Cards per page/);
  assert.match(generatorSource, /Show English/);
  assert.match(generatorSource, /Show Pinyin/);
  assert.match(rendererSource, /WorksheetRenderer/);
  assert.match(rendererSource, /settings\.output === "flashcards"/);
  assert.match(previewSource, /snapshot\.settings\.output === "worksheet"/);
  assert.match(flashcardSource, /hs-flashcard-grid/);
  assert.match(flashcardSource, /hs-flashcard-cut-line/);
  assert.match(flashcardSource, /Array\.from\(\{ length: settings\.flashcardsPerPage \}/);
  assert.match(flashcardSource, /aria-hidden=\{slotEntry === null\}/);
  assert.match(flashcardSource, /data-last-row=\{String\(row === rows - 1\)\}/);
  assert.match(flashcardSource, /data-last-col=\{String\(column === columns - 1\)\}/);
});

test("template directory leads with real printable outcomes", async () => {
  const source = await projectFile(
    "src/features/worksheets/components/templates-page.tsx",
  );

  assert.match(source, /See what you can print/);
  assert.match(source, /For first characters/);
  assert.match(source, /For HSK review/);
  assert.match(source, /For everyday vocabulary/);
  assert.match(source, /showcaseTemplates/);
  assert.match(source, /<WorksheetCardPreview/);
});

test("worksheet practice glyphs use the approved Kaiti stack without synthetic bold", async () => {
  const [css, worksheetSource, previewSource, layoutSource, packageSource] =
    await Promise.all([
      projectFile("src/app/globals.css"),
      projectFile(
        "src/features/worksheets/components/worksheet-paper.tsx",
      ),
      projectFile(
        "src/features/worksheets/components/print-preview-client.tsx",
      ),
      projectFile("src/app/layout.tsx"),
      projectFile("package.json"),
    ]);

  assert.match(
    css,
    /^@import url\("https:\/\/cdn\.jsdelivr\.net\/npm\/lxgw-wenkai-gb-web@1\.522\.0\/style\.css"\);/,
  );
  assert.doesNotMatch(layoutSource, /lxgw-wenkai-gb-web/);
  assert.doesNotMatch(packageSource, /lxgw-wenkai-gb-web/);
  assert.doesNotMatch(
    layoutSource,
    /next\/font|Inter\(|Libre_Baskerville|Noto_Serif_SC/,
  );
  assert.match(layoutSource, /className="font-sans antialiased"/);
  assert.match(
    css,
    /--font-sans-ui:[^;]*"Segoe UI"[^;]*sans-serif;/,
  );
  assert.match(
    css,
    /--font-hanzi-practice:[^;]*"KaiTi"[^;]*"STKaiti"[^;]*"Kaiti SC"[^;]*"LXGW WenKai GB"[^;]*"Noto Serif SC"[^;]*serif;/,
  );
  assert.doesNotMatch(css, /--font-hanzi-practice-tw:/);
  assert.doesNotMatch(
    css,
    /\.hs-paper\[data-character-standard="traditional-tw"\][^{]*\{[\s\S]*?--font-hanzi-practice:/,
  );
  assert.match(
    css,
    /\.hs-grid-cell\s*\{[^}]*container-type:\s*inline-size;[^}]*font-family:\s*var\(--font-hanzi-practice\);[^}]*font-weight:\s*400;[^}]*font-synthesis:\s*none;/,
  );
  assert.match(
    css,
    /\.hs-grid-glyph\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*overflow:\s*visible;/,
  );
  assert.match(
    css,
    /\.hs-grid-glyph text\s*\{[^}]*fill:\s*currentColor;[^}]*font-family:\s*var\(--font-hanzi-practice\);[^}]*font-size:\s*68px;[^}]*font-weight:\s*400;/,
  );
  assert.match(
    css,
    /\.hs-hanzi-context\s*\{[^}]*font-family:\s*var\(--font-hanzi-practice\);[^}]*font-synthesis:\s*none;/,
  );
  assert.match(worksheetSource, /hs-hanzi-context/);
  assert.match(worksheetSource, /hs-grid-glyph/);
  assert.match(
    worksheetSource,
    /<svg[^>]*className="hs-grid-glyph"[^>]*viewBox="0 0 100 100"/,
  );
  assert.match(
    worksheetSource,
    /<text[^>]*x="50"[^>]*y="50"[^>]*textAnchor="middle"[^>]*dominantBaseline="central"/,
  );
  assert.doesNotMatch(
    worksheetSource,
    /<span className="hs-grid-glyph/,
  );
  assert.match(
    worksheetSource,
    /<svg[^>]*className="hs-grid-guide"[^>]*viewBox="0 0 100 100"/,
  );
  assert.match(
    worksheetSource,
    /<rect[^>]*className="hs-grid-outline"/,
  );
  assert.match(
    worksheetSource,
    /className="hs-grid-guide-lines"/,
  );
  assert.equal(
    worksheetSource.match(/<GridGuide grid=\{grid\} \/>/g)?.length,
    2,
    "both text cells and stroke-order cells need the same inline SVG grid",
  );
  assert.doesNotMatch(worksheetSource, /hs-grid-frame/);
  assert.doesNotMatch(worksheetSource, /text-\[clamp\(/);
  assert.doesNotMatch(
    worksheetSource,
    /cell\.kind === "model"[^,\n]*(?:&&|\?)\s*"font-bold"/,
  );
  assert.match(
    css,
    /\.hs-grid-guide\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*pointer-events:\s*none;/,
  );
  assert.match(
    css,
    /\.hs-grid-outline\s*\{[^}]*fill:\s*none;[^}]*stroke:\s*var\(--hs-grid-frame-color\);[^}]*stroke-width:\s*var\(--hs-grid-frame-width\);/,
  );
  assert.match(
    css,
    /\.hs-grid-guide-lines\s*\{[^}]*fill:\s*none;[^}]*stroke:\s*#dfe0e2;[^}]*stroke-dasharray:\s*3 3;/,
  );
  assert.match(
    css,
    /\.hs-paper\[data-background="false"\]\s+\.hs-grid-guide-lines\s*\{[^}]*display:\s*none;/,
  );
  assert.doesNotMatch(css, /\.hs-grid-cell::before|\.hs-grid-cell::after/);
  assert.doesNotMatch(css, /\.hs-grid-cell\[data-grid="mi"\][^{]*background-image/);
  assert.match(previewSource, /className="hs-print-layout grid /);
  assert.match(
    css,
    /@media print\s*\{[\s\S]*?\.hs-print-layout\s*\{[^}]*display:\s*block !important;[^}]*min-height:\s*0 !important;/,
  );
});

test("template detail vocabulary card can shrink on mobile", async () => {
  const source = await projectFile(
    "src/features/worksheets/components/template-detail-page.tsx",
  );

  assert.match(
    source,
    /className="mt-8 grid min-w-0 gap-5 lg:grid-cols-\[1\.25fr_0\.75fr\]"/,
  );
  assert.match(
    source,
    /className="hs-card grid min-w-0 gap-8 p-5 sm:grid-cols-\[1\.1fr_0\.9fr\] sm:p-7"/,
  );
  assert.match(
    source,
    /className="min-w-0"[\s\S]*?className="mt-4 max-w-full overflow-x-auto/,
  );
});

test("HSK workflow links stay additive across teachers, templates, details, and stroke-order pages", async () => {
  const [
    teachersSource,
    templatesSource,
    detailSource,
    strokeSource,
  ] = await Promise.all([
    projectFile("src/features/worksheets/components/for-teachers-page.tsx"),
    projectFile("src/features/worksheets/components/templates-page.tsx"),
    projectFile("src/features/worksheets/components/template-detail-page.tsx"),
    projectFile("src/features/worksheets/components/stroke-order-character-page.tsx"),
  ]);

  assert.match(teachersSource, /hskPickerHref = "\/generator\?hskSystem=2\.0&hskLevel=1"/);
  assert.match(teachersSource, /Choose an HSK list/);
  assert.match(templatesSource, /hskPickerHref = "\/generator\?hskSystem=2\.0&hskLevel=1"/);
  assert.match(templatesSource, /Choose by HSK version/);
  assert.match(detailSource, /template\.category === "hsk"/);
  assert.match(detailSource, /Choose HSK 2\.0 or 3\.0 list/);
  assert.match(strokeSource, /\/generator\?words=/);
  assert.match(strokeSource, /hskPickerHref = "\/generator\?hskSystem=2\.0&hskLevel=1"/);
  assert.match(strokeSource, /Browse HSK lists/);
});

test("curated stroke-order pages combine practice with useful character content", async () => {
  const [clientSource, pageSource, hubSource] = await Promise.all([
    projectFile("src/features/worksheets/components/stroke-order-client.tsx"),
    projectFile(
      "src/features/worksheets/components/stroke-order-character-page.tsx",
    ).catch(() => ""),
    projectFile("src/app/[locale]/stroke-order/page.tsx"),
  ]);

  assert.match(clientSource, /initialCharacter/);
  assert.match(clientSource, /showSearch/);
  assert.match(clientSource, /showGuidance/);
  assert.match(clientSource, /<StrokeSequence character=\{character\}/);

  assert.match(pageSource, /StrokeOrderCharacterPage/);
  assert.match(pageSource, /StructuredData/);
  assert.match(pageSource, /"@type": "LearningResource"/);
  assert.match(pageSource, /"@type": "BreadcrumbList"/);
  assert.match(pageSource, /<StrokeOrderClient/);
  assert.match(pageSource, /showSearch=\{false\}/);
  assert.match(pageSource, /showGuidance=\{false\}/);
  assert.match(pageSource, /entry\.hsk\.map/);
  assert.match(pageSource, /entry\.examples\.map/);
  assert.match(pageSource, /entry\.writingTip/);
  assert.match(pageSource, /strokeOrderCharacters\.filter/);
  assert.match(pageSource, /\/generator\?words=/);
  assert.match(pageSource, /Add .* to a worksheet/);
  assert.doesNotMatch(pageSource, /bg-white px-6 text-\[#172b49\]/);

  assert.match(hubSource, /strokeOrderCharacters\.map/);
  assert.match(hubSource, /Popular character guides/);
  assert.match(hubSource, /href=\{`\/stroke-order\/\$\{entry\.character\}`\}/);
});
