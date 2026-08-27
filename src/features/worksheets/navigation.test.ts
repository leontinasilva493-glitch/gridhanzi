import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { buildPublicSitemapPaths } from "./seo";

const projectPath = (path: string) =>
  fileURLToPath(new URL(`../../../${path}`, import.meta.url));

const projectFile = (path: string) => readFile(projectPath(path), "utf8");

test("primary navigation stays task-based and keeps a responsive worksheet CTA", async () => {
  const shellSource = await projectFile(
    "src/features/worksheets/components/site-shell.tsx",
  );
  const navStart = shellSource.indexOf("const navItems");
  const navEnd = shellSource.indexOf("] as const;", navStart);
  const navSource = shellSource.slice(navStart, navEnd);
  const headerSource = shellSource.slice(0, shellSource.indexOf("export function HanziSiteFooter"));

  assert.match(navSource, /label: "Worksheet Maker"/);
  assert.match(navSource, /label: "HSK Lists"/);
  assert.match(navSource, /label: "Compare"/);
  assert.match(headerSource, /label: "Templates"/);
  assert.match(headerSource, /label: "Stroke Order"/);
  assert.match(headerSource, /label: "Printable Grids"/);
  assert.doesNotMatch(navSource, /For Teachers/);
  assert.doesNotMatch(headerSource, /No sign-up required/);
  assert.ok(
    (headerSource.match(/Create Worksheet/g) ?? []).length >= 2,
    "desktop and mobile navigation should both expose the primary action",
  );
});

test("template navigation stays second-level and points to the category page anchors", async () => {
  const shellSource = await projectFile(
    "src/features/worksheets/components/site-shell.tsx",
  );
  const templateStart = shellSource.indexOf("const templateMenuLinks");
  const templateEnd = shellSource.indexOf("] as const;", templateStart);
  const templateSource = shellSource.slice(templateStart, templateEnd);

  for (const [label, href] of [
    ["All Templates", "/templates"],
    ["Quick Start", "/templates#quick-start"],
    ["HSK Worksheets", "/templates#hsk-worksheets"],
    ["Writing Basics", "/templates#writing-basics"],
    ["Everyday Words", "/templates#everyday-words"],
  ]) {
    assert.match(templateSource, new RegExp(`\\["${label}", "${href}"\\]`));
  }

  assert.doesNotMatch(templateSource, /First Characters/);
  assert.doesNotMatch(templateSource, /Top 100 Characters/);
  assert.doesNotMatch(templateSource, /HSK 3 Daily Life/);
  assert.doesNotMatch(templateSource, /Basic Strokes/);
});

test("stroke order navigation stays compact and links to the tool plus basics", async () => {
  const shellSource = await projectFile(
    "src/features/worksheets/components/site-shell.tsx",
  );
  const strokeStart = shellSource.indexOf("const strokeOrderMenuLinks");
  const strokeEnd = shellSource.indexOf("] as const;", strokeStart);
  const strokeSource = shellSource.slice(strokeStart, strokeEnd);

  assert.match(strokeSource, /\["Stroke Order Tool", "\/stroke-order"\]/);
  assert.match(
    strokeSource,
    /\["Practice Sheets", "\/templates\/stroke-order-practice"\]/,
  );
  assert.match(strokeSource, /\["Basic Strokes", "\/templates\/basic-strokes"\]/);
  assert.match(strokeSource, /\["Radicals", "\/templates\/radicals"\]/);
});

test("template category page carries the detailed third-level worksheet links", async () => {
  const templatesPageSource = await projectFile(
    "src/features/worksheets/components/templates-page.tsx",
  );

  for (const [title, id] of [
    ["Quick Start", "quick-start"],
    ["HSK Worksheets", "hsk-worksheets"],
    ["Writing Basics", "writing-basics"],
    ["Everyday Words", "everyday-words"],
  ]) {
    assert.match(templatesPageSource, new RegExp(`title: "${title}"`));
    assert.match(templatesPageSource, new RegExp(`id: "${id}"`));
  }

  for (const slug of [
    "chinese-first-characters",
    "top-100-chinese-characters",
    "top-200-chinese-characters",
    "blank-tianzige-grid",
    "blank-mi-zi-ge-grid",
    "hsk-3-campus-life",
    "hsk-3-exams-grades",
    "hsk-4",
    "hsk-5",
    "basic-strokes",
    "pinyin-practice",
    "stroke-order-practice",
    "family",
    "chinese-numbers-1-100",
    "chinese-measure-words",
    "common-chinese-verbs",
    "food-drinks",
    "travel",
  ]) {
    assert.match(templatesPageSource, new RegExp(`"${slug}"`));
  }
});

test("footer topic links open the matching template detail pages", async () => {
  const shellSource = await projectFile(
    "src/features/worksheets/components/site-shell.tsx",
  );

  assert.match(shellSource, /\["Numbers", "\/templates\/numbers"\]/);
  assert.match(shellSource, /\["Colors", "\/templates\/colors"\]/);
  assert.match(shellSource, /\["HSK Vocabulary", "\/hsk"\]/);
  assert.match(shellSource, /\["Character Comparisons", "\/compare"\]/);
});

test("worksheet preview exists for locale routes and remains excluded from search", async () => {
  const previewPath = projectPath(
    "src/app/[locale]/worksheet/preview/page.tsx",
  );
  const [previewSource, robotsSource] = await Promise.all([
    readFile(previewPath, "utf8"),
    projectFile("src/app/robots.ts"),
  ]);

  assert.ok(existsSync(previewPath));
  assert.match(previewSource, /index:\s*false/);
  assert.match(previewSource, /follow:\s*false/);
  assert.doesNotMatch(robotsSource, /"\/worksheet\/preview"/);
  assert.doesNotMatch(robotsSource, /"\/zh\/worksheet\/preview"/);
  assert.equal(buildPublicSitemapPaths().includes("/worksheet/preview"), false);
});

test("homepage teacher section describes working tools and links to the full guide", async () => {
  const homeSource = await projectFile(
    "src/features/worksheets/components/home-page.tsx",
  );

  assert.match(homeSource, /Use one list for lessons, practice, and review/);
  assert.match(homeSource, /href="\/for-teachers"/);
  assert.doesNotMatch(
    homeSource,
    /Coming soon|CSV import|Saved vocabulary lists|School header & logo/,
  );
});

test("homepage task entries link to the three core destinations", async () => {
  const homeSource = await projectFile(
    "src/features/worksheets/components/home-page.tsx",
  );

  assert.match(
    homeSource,
    /<TaskLink[\s\S]*?href="\/generator"[\s\S]*?title="Build from my word list"/,
  );
  assert.match(
    homeSource,
    /<TaskLink[\s\S]*?href="\/templates"[\s\S]*?title="Start with a worksheet"/,
  );
  assert.match(
    homeSource,
    /<TaskLink[\s\S]*?href="\/stroke-order"[\s\S]*?title="Check one character’s stroke order"/,
  );
  assert.doesNotMatch(homeSource, /<Step icon=/);
});

test("blank grid acquisition links route users to the printable grid pages", async () => {
  const [homeSource, templatesSource, generatorSource] = await Promise.all([
    projectFile("src/features/worksheets/components/home-page.tsx"),
    projectFile("src/features/worksheets/components/templates-page.tsx"),
    projectFile("src/features/worksheets/components/generator-client.tsx"),
  ]);

  assert.match(homeSource, /href="\/grids"[\s\S]*?printable Hanzi grid PDFs/i);
  assert.match(templatesSource, /href="\/grids"[\s\S]*?Blank grid PDFs/i);
  assert.match(generatorSource, /href="\/grids"[\s\S]*?printable grid PDFs/i);
});

test("English-input practice receives contextual links from the acquisition journey", async () => {
  const [homeSource, generatorSource, teacherSource] = await Promise.all([
    projectFile("src/features/worksheets/components/home-page.tsx"),
    projectFile("src/features/worksheets/components/generator-client.tsx"),
    projectFile("src/features/worksheets/components/for-teachers-page.tsx"),
  ]);

  assert.match(
    homeSource,
    /href="\/english-to-chinese-writing-practice"[\s\S]*?English to Chinese writing practice/i,
  );
  assert.match(
    generatorSource,
    /href="\/english-to-chinese-writing-practice"[\s\S]*?English to Chinese writing practice/i,
  );
  assert.match(
    teacherSource,
    /href="\/english-to-chinese-writing-practice"[\s\S]*?English to Chinese writing practice/i,
  );
});

test("homepage tool chooser links each major search intent to its canonical route", async () => {
  const homeSource = await projectFile(
    "src/features/worksheets/components/home-page.tsx",
  );

  assert.match(homeSource, /Choose the Right Chinese Writing Tool/);
  for (const route of [
    "/generator",
    "/templates",
    "/grids",
    "/hsk",
    "/stroke-order",
    "/english-to-chinese-writing-practice",
  ]) {
    assert.match(homeSource, new RegExp(`href="${route}"`), route);
  }
});

test("teacher landing page is public, specific, and limited to current features", async () => {
  const routePath = projectPath("src/app/[locale]/for-teachers/page.tsx");
  const componentPath = projectPath(
    "src/features/worksheets/components/for-teachers-page.tsx",
  );

  assert.ok(existsSync(routePath), "/for-teachers route should exist");
  assert.ok(existsSync(componentPath), "teacher landing page component should exist");

  const [routeSource, componentSource] = await Promise.all([
    readFile(routePath, "utf8"),
    readFile(componentPath, "utf8"),
  ]);

  assert.match(routeSource, /Chinese Worksheets for Teachers/);
  assert.match(
    componentSource,
    /Chinese Worksheets for Teachers, Made from Your Word List/,
  );
  assert.match(componentSource, /Learn, practise, and test/);
  assert.match(componentSource, /Classroom word lists/);
  assert.match(componentSource, /href="\/generator"/);
  assert.match(componentSource, /href="\/templates"/);
  assert.match(
    componentSource,
    /hs-display[^"\n]*!text-white[^"\n]*">\s*Keep the final check/,
  );
  assert.doesNotMatch(
    componentSource,
    /Coming soon|class management|subscription|saved vocabulary lists/i,
  );
  assert.ok(buildPublicSitemapPaths().includes("/for-teachers"));
});

test("generator HSK query parser keeps valid values, falls back safely, and only marks explicit URLs", async () => {
  const moduleUrl = pathToFileURL(
    projectPath("src/app/[locale]/generator/page.tsx"),
  ).href;
  const { parseGeneratorHskQuery } = (await import(moduleUrl)) as {
    parseGeneratorHskQuery: (query: {
      hskSystem?: string;
      hskLevel?: string;
    }) => {
      hasExplicitSelection: boolean;
      system?: "2.0" | "3.0";
      level?: "1" | "2" | "3" | "4" | "5" | "6" | "7-9";
    };
  };

  assert.deepEqual(
    parseGeneratorHskQuery({ hskSystem: "2.0", hskLevel: "6" }),
    { hasExplicitSelection: true, system: "2.0", level: "6" },
  );
  assert.deepEqual(
    parseGeneratorHskQuery({ hskSystem: "3.0", hskLevel: "7-9" }),
    { hasExplicitSelection: true, system: "3.0", level: "7-9" },
  );
  assert.deepEqual(
    parseGeneratorHskQuery({ hskSystem: "3.0", hskLevel: "9" }),
    { hasExplicitSelection: true, system: "3.0", level: "1" },
  );
  assert.deepEqual(
    parseGeneratorHskQuery({ hskSystem: "2.0", hskLevel: "7-9" }),
    { hasExplicitSelection: true, system: "2.0", level: "1" },
  );
  assert.deepEqual(
    parseGeneratorHskQuery({ hskSystem: "4.0", hskLevel: "2" }),
    { hasExplicitSelection: true, system: "2.0", level: "1" },
  );
  assert.deepEqual(parseGeneratorHskQuery({ hskSystem: "3.0" }), {
    hasExplicitSelection: true,
    system: "3.0",
    level: "1",
  });
  assert.deepEqual(parseGeneratorHskQuery({ hskSystem: "2.0" }), {
    hasExplicitSelection: true,
    system: "2.0",
    level: "1",
  });
  assert.deepEqual(parseGeneratorHskQuery({ hskLevel: "5" }), {
    hasExplicitSelection: true,
    system: "2.0",
    level: "1",
  });
  assert.deepEqual(parseGeneratorHskQuery({}), { hasExplicitSelection: false });
});
