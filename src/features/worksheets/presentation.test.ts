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
