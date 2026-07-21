import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

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
  assert.match(navSource, /label: "Templates"/);
  assert.match(navSource, /label: "Stroke Order"/);
  assert.doesNotMatch(navSource, /For Teachers/);
  assert.doesNotMatch(headerSource, /No sign-up required/);
  assert.ok(
    (headerSource.match(/Create Worksheet/g) ?? []).length >= 2,
    "desktop and mobile navigation should both expose the primary action",
  );
});

test("footer topic links open the matching template detail pages", async () => {
  const shellSource = await projectFile(
    "src/features/worksheets/components/site-shell.tsx",
  );

  assert.match(shellSource, /\["Numbers", "\/templates\/numbers"\]/);
  assert.match(shellSource, /\["Colors", "\/templates\/colors"\]/);
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
  assert.match(componentSource, /Make this week.?s Chinese worksheet/);
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
