import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { worksheetTemplates } from "./data";
import * as worksheetSeo from "./seo";
import sitemap from "../../app/sitemap";
import robots from "../../app/robots";

const { buildPublicSitemapPaths, toAbsoluteUrl } = worksheetSeo;
const projectRoot = process.cwd();

test("buildPublicSitemapPaths includes every differentiated template page", () => {
  const paths = buildPublicSitemapPaths();

  assert.ok(paths.includes("/"));
  assert.ok(paths.includes("/generator"));
  assert.ok(paths.includes("/english-to-chinese-writing-practice"));
  assert.ok(paths.includes("/templates"));
  assert.ok(paths.includes("/stroke-order"));
  assert.ok(paths.includes("/for-teachers"));
  for (const template of worksheetTemplates) {
    assert.ok(paths.includes(`/templates/${template.slug}`), template.slug);
  }
  assert.equal(new Set(paths).size, paths.length);
});

test("toAbsoluteUrl normalizes base and path slashes", () => {
  assert.equal(
    toAbsoluteUrl("https://example.com/", "/templates/family"),
    "https://example.com/templates/family",
  );
});

test("sitemap submits only canonical, indexable language pages", () => {
  const entries = sitemap();
  const expectedUrls = [
    ...buildPublicSitemapPaths().map((pathname) =>
      toAbsoluteUrl("https://gridhanzi.org", pathname),
    ),
    "https://gridhanzi.org/zh/generator",
  ];

  assert.deepEqual(
    entries.map((entry) => entry.url),
    expectedUrls,
  );
  for (const entry of entries) {
    assert.equal("priority" in entry, false);
    assert.equal("changeFrequency" in entry, false);
    assert.doesNotMatch(entry.url, /\/api\/|\/worksheet\/preview/);
  }

  const generatorEntries = entries.filter((entry) =>
    entry.url.endsWith("/generator"),
  );
  assert.equal(generatorEntries.length, 2);
  for (const entry of generatorEntries) {
    assert.deepEqual(entry.alternates?.languages, {
      en: "https://gridhanzi.org/generator",
      zh: "https://gridhanzi.org/zh/generator",
      "x-default": "https://gridhanzi.org/generator",
    });
  }

  assert.equal(
    entries.some((entry) => entry.url === "https://gridhanzi.org/zh"),
    false,
  );
  assert.equal(
    entries.some((entry) => entry.url.includes("/zh/templates")),
    false,
  );
});

test("page metadata self-canonicalizes indexable pages and noindexes untranslated Chinese routes", () => {
  const buildPageSeoMetadata = (
    worksheetSeo as typeof worksheetSeo & {
      buildPageSeoMetadata?: (
        baseUrl: string,
        pathname: string,
        locale: string,
        options?: { chineseIndexable?: boolean },
      ) => {
        alternates?: { canonical?: string; languages?: Record<string, string> };
        robots?: { index?: boolean; follow?: boolean };
        openGraph?: {
          url?: string;
          siteName?: string;
          type?: string;
          images?: Array<{
            url?: string;
            width?: number;
            height?: number;
            alt?: string;
          }>;
        };
      };
    }
  ).buildPageSeoMetadata;

  assert.equal(typeof buildPageSeoMetadata, "function");
  if (!buildPageSeoMetadata) return;

  const englishTemplates = buildPageSeoMetadata(
    "https://gridhanzi.org/",
    "/templates",
    "en",
  ) as ReturnType<typeof buildPageSeoMetadata> & {
    openGraph?: {
      url?: string;
      siteName?: string;
      type?: string;
      images?: Array<{
        url?: string;
        width?: number;
        height?: number;
        alt?: string;
      }>;
    };
  };
  assert.equal(
    englishTemplates.alternates?.canonical,
    "https://gridhanzi.org/templates",
  );
  assert.equal(englishTemplates.alternates?.languages, undefined);
  assert.equal(englishTemplates.robots, undefined);
  assert.equal(
    englishTemplates.openGraph?.url,
    "https://gridhanzi.org/templates",
  );
  assert.equal(englishTemplates.openGraph?.siteName, "GridHanzi");
  assert.equal(englishTemplates.openGraph?.type, "website");
  assert.deepEqual(englishTemplates.openGraph?.images, [
    {
      url: "https://gridhanzi.org/og-gridhanzi.png",
      width: 1200,
      height: 630,
      alt: "GridHanzi Chinese character practice sheet generator",
    },
  ]);

  const chineseTemplates = buildPageSeoMetadata(
    "https://gridhanzi.org",
    "/templates",
    "zh",
  );
  assert.equal(
    chineseTemplates.alternates?.canonical,
    "https://gridhanzi.org/zh/templates",
  );
  assert.deepEqual(chineseTemplates.robots, { index: false, follow: true });

  const chineseGenerator = buildPageSeoMetadata(
    "https://gridhanzi.org",
    "/generator",
    "zh",
    { chineseIndexable: true },
  );
  assert.equal(
    chineseGenerator.alternates?.canonical,
    "https://gridhanzi.org/zh/generator",
  );
  assert.equal(chineseGenerator.robots, undefined);
  assert.deepEqual(chineseGenerator.alternates?.languages, {
    en: "https://gridhanzi.org/generator",
    zh: "https://gridhanzi.org/zh/generator",
    "x-default": "https://gridhanzi.org/generator",
  });
});

test("robots lets crawlers read preview noindex while blocking APIs", () => {
  const rules = robots().rules;

  assert.deepEqual(rules, {
    userAgent: "*",
    allow: "/",
    disallow: ["/api/"],
  });
});

test("route metadata owns canonicals instead of inheriting the homepage URL", async () => {
  const rootLayout = await readFile(
    path.join(projectRoot, "src/app/layout.tsx"),
    "utf8",
  );
  assert.doesNotMatch(rootLayout, /alternates:\s*{\s*canonical:/);
  assert.doesNotMatch(rootLayout, /hrefLang=|rel="alternate"/);

  const routes = [
    "src/app/[locale]/page.tsx",
    "src/app/[locale]/generator/page.tsx",
    "src/app/[locale]/english-to-chinese-writing-practice/page.tsx",
    "src/app/[locale]/templates/page.tsx",
    "src/app/[locale]/templates/[slug]/page.tsx",
    "src/app/[locale]/stroke-order/page.tsx",
    "src/app/[locale]/for-teachers/page.tsx",
  ];
  for (const route of routes) {
    const source = await readFile(path.join(projectRoot, route), "utf8");
    assert.match(source, /buildPageSeoMetadata/, route);
  }
});

test("curated Hanzi pages have static routes and unique sitemap entries", async () => {
  const characterPaths = buildPublicSitemapPaths().filter((pathname) =>
    pathname.startsWith("/stroke-order/"),
  );
  assert.deepEqual(characterPaths, [
    "/stroke-order/爱",
    "/stroke-order/年",
    "/stroke-order/佛",
  ]);

  const routeSource = await readFile(
    path.join(
      projectRoot,
      "src/app/[locale]/stroke-order/[character]/page.tsx",
    ),
    "utf8",
  ).catch(() => "");

  assert.match(routeSource, /generateStaticParams/);
  assert.match(routeSource, /generateMetadata/);
  assert.match(routeSource, /getStrokeOrderCharacter/);
  assert.match(routeSource, /notFound\(\)/);
  assert.match(routeSource, /buildPageSeoMetadata/);
  assert.match(routeSource, /StrokeOrderCharacterPage/);
});
