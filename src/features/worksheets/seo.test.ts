import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { worksheetTemplates } from "./data";
import { strokeOrderCharacters } from "./stroke-order-characters";
import {
  buildPublicSitemapPaths,
  buildStrokeOrderSitemapPaths,
  toAbsoluteUrl,
} from "./seo";
import * as worksheetSeo from "./seo";
import GeneratorPage, {
  generateMetadata as generateGeneratorMetadata,
} from "../../app/[locale]/generator/page";
import sitemap from "../../app/sitemap";
import robots from "../../app/robots";
import { generateMetadata as generateStrokeOrderMetadata } from "../../app/[locale]/stroke-order/[character]/page";
import { generateMetadata as generateTemplatesMetadata } from "../../app/[locale]/templates/page";

const projectRoot = process.cwd();

test("buildPublicSitemapPaths includes every differentiated template page", () => {
  const paths = buildPublicSitemapPaths();

  assert.ok(paths.includes("/"));
  assert.ok(paths.includes("/generator"));
  assert.ok(paths.includes("/english-to-chinese-writing-practice"));
  assert.ok(paths.includes("/templates"));
  assert.ok(paths.includes("/grids"));
  assert.ok(paths.includes("/grids/tian-zi-ge"));
  assert.ok(paths.includes("/grids/mi-zi-ge"));
  assert.ok(paths.includes("/grids/blank"));
  assert.ok(paths.includes("/stroke-order"));
  assert.ok(paths.includes("/for-teachers"));
  assert.ok(paths.includes("/chinese-slang/niu-lai"));
  for (const template of worksheetTemplates) {
    assert.ok(paths.includes(`/templates/${template.slug}`), template.slug);
  }
  assert.equal(new Set(paths).size, paths.length);
});

test("worksheet acquisition pages publish distinct search-result promises", async () => {
  const templatesMetadata = await generateTemplatesMetadata({
    params: Promise.resolve({ locale: "en" }),
  });
  assert.deepEqual(
    templatesMetadata.title,
    {
      absolute: "Free Printable Chinese Writing Worksheets (PDF) | GridHanzi",
    },
  );

  const expectedTemplates = {
    "pinyin-practice": {
      seoTitle: "Hanzi and Pinyin Practice Worksheet - Free Printable",
      h1: "Hanzi and Pinyin Practice Worksheet",
    },
    "top-100-chinese-characters": {
      seoTitle: "Top 100 Chinese Characters to Practice - Printable List",
      h1: "100 Chinese Characters to Practice",
    },
    "blank-tianzige-grid": {
      seoTitle: "Tian Zi Ge Beginner Worksheet - 18 Editable Hanzi",
      h1: "Tian Zi Ge Beginner Character Worksheet",
    },
    "blank-mi-zi-ge-grid": {
      seoTitle: "Mi Zi Ge Beginner Worksheet - 18 Editable Hanzi",
      h1: "Mi Zi Ge Beginner Character Worksheet",
    },
  } as const;

  for (const [slug, expected] of Object.entries(expectedTemplates)) {
    const template = worksheetTemplates.find((candidate) => candidate.slug === slug);
    assert.ok(template, slug);
    assert.equal(template.seoTitle, expected.seoTitle, slug);
    assert.equal(template.h1, expected.h1, slug);
  }
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

test("the indexable Chinese generator localizes search metadata and application schema", async () => {
  const metadata = await generateGeneratorMetadata({
    params: Promise.resolve({ locale: "zh" }),
  });

  assert.equal(metadata.title, "在线汉字字帖生成器");
  assert.equal(
    metadata.description,
    "输入中文或英文词汇，生成带汉字、拼音、描红格和空白练习格的可打印中文练习纸。",
  );
  assert.equal(metadata.openGraph?.title, "在线汉字字帖生成器");
  assert.equal(
    metadata.openGraph?.description,
    "输入中文或英文词汇，生成带汉字、拼音、描红格和空白练习格的可打印中文练习纸。",
  );

  const page = await GeneratorPage({
    params: Promise.resolve({ locale: "zh" }),
    searchParams: Promise.resolve({}),
  } as Parameters<typeof GeneratorPage>[0] & {
    params: Promise<{ locale: string }>;
  });
  const children = (page as unknown as {
    props: {
      children: Array<{
        props: {
          data: Array<{
            name?: string;
            description?: string;
            url?: string;
            featureList?: string[];
          }>;
        };
      }>;
    };
  }).props.children;
  const application = children[0]?.props.data[0];

  assert.equal(application?.name, "GridHanzi 在线汉字字帖生成器");
  assert.equal(
    application?.description,
    "输入中文或英文词汇，生成可编辑的汉字、拼音、描红格、书写格、笔顺提示和 PDF 字帖。",
  );
  assert.equal(application?.url, "https://gridhanzi.org/zh/generator");
  assert.deepEqual(application?.featureList, [
    "编辑汉字、拼音和英文释义",
    "描红、书写练习和默写测试模式",
    "田字格和米字格",
    "可选拼音和笔顺提示",
    "A4、US Letter 和平板 PDF 格式",
  ]);
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
    "src/app/[locale]/grids/page.tsx",
    "src/app/[locale]/grids/[slug]/page.tsx",
    "src/app/[locale]/stroke-order/page.tsx",
    "src/app/[locale]/for-teachers/page.tsx",
  ];
  for (const route of routes) {
    const source = await readFile(path.join(projectRoot, route), "utf8");
    assert.match(source, /buildPageSeoMetadata/, route);
  }
});

test("stroke-order sitemap paths exclude a synthetic draft entry", () => {
  const paths = buildStrokeOrderSitemapPaths([
    ...strokeOrderCharacters,
    { character: "草稿", publicationStatus: "draft" as const },
  ]);

  assert.equal(paths.includes("/stroke-order/草稿"), false);
  assert.deepEqual(
    paths,
    strokeOrderCharacters.map((entry) => `/stroke-order/${entry.character}`),
  );
});

test("curated Hanzi pages have static routes and unique sitemap entries", async () => {
  const characterPaths = buildPublicSitemapPaths().filter((pathname) =>
    pathname.startsWith("/stroke-order/"),
  );
  assert.deepEqual(characterPaths, [
    "/stroke-order/爱",
    "/stroke-order/年",
    "/stroke-order/佛",
    "/stroke-order/的",
    "/stroke-order/一",
    "/stroke-order/是",
    "/stroke-order/在",
    "/stroke-order/了",
    "/stroke-order/我",
    "/stroke-order/你",
    "/stroke-order/人",
    "/stroke-order/来",
    "/stroke-order/去",
    "/stroke-order/说",
    "/stroke-order/学",
    "/stroke-order/经",
    "/stroke-order/体",
    "/stroke-order/议",
    "/stroke-order/牛",
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

test("character routes publish approved standard, Open Graph, and Twitter metadata", async () => {
  const approvedMetadata = [
    ["\u7684", "\u7684 (de) Stroke Order, Meaning & Grammar", "Learn how to write \u7684 (de), the common possessive and descriptive particle. See its 8 strokes, neutral-tone usage, example words, sentences, and worksheet practice."],
    ["\u4f60", "\u4f60 (n\u01d0) Stroke Order, Meaning & Examples", "Learn how to write \u4f60 (n\u01d0), meaning \u201cyou.\u201d See its 7-stroke structure and practise \u4f60\u597d, \u4f60\u4eec and other useful phrases and sentences."],
    ["\u7ecf", "\u7ecf (j\u012bng) Stroke Order, Meaning & Common Words", "Learn how to write \u7ecf (j\u012bng) through \u5df2\u7ecf, \u7ecf\u5e38, \u7ecf\u8fc7 and \u7ecf\u9a8c. See its 8 strokes, \u7e9f + \u{22016} structure and example sentences."],
    ["\u4f5b", "\u4f5b (f\u00f3/f\u00fa) Stroke Order, Meaning & Readings", "Learn how to write \u4f5b and distinguish f\u00f3 in Buddhist vocabulary from f\u00fa in \u4eff\u4f5b. See its 7 strokes, components, example words and sentences."],
    ["\u725b", "\u725b (ni\u00fa) Stroke Order, Meaning & Slang Use", "Learn how to write \u725b (ni\u00fa), meaning cow or ox, and why it can mean \u201cawesome\u201d in Chinese slang. Follow its 4 strokes, common words and the \u725b\u6765 meme context."],
  ] as const;

  for (const [character, title, description] of approvedMetadata) {
    const metadata = await generateStrokeOrderMetadata({
      params: Promise.resolve({ locale: "zh", character }),
    });

    assert.equal(metadata.twitter?.title, title, `${character} Twitter title`);
    assert.equal(metadata.twitter?.description, description, `${character} Twitter description`);
    assert.equal(metadata.title, title, `${character} title`);
    assert.equal(metadata.description, description, `${character} description`);
    assert.equal(metadata.openGraph?.title, title, `${character} Open Graph title`);
    assert.equal(metadata.openGraph?.description, description, `${character} Open Graph description`);
    assert.equal(
      metadata.alternates?.canonical,
      `https://gridhanzi.org/zh/stroke-order/${character}`,
      `${character} canonical`,
    );
    assert.deepEqual(metadata.robots, { index: false, follow: true }, `${character} Chinese noindex`);
  }
});

test("the 牛来 route aligns TDH across metadata channels and keeps untranslated Chinese noindex", async () => {
  const route = await import("../../app/[locale]/chinese-slang/niu-lai/page").catch(
    () => ({}),
  );
  const generateMetadata = (route as {
    generateMetadata?: (props: {
      params: Promise<{ locale: string }>;
    }) => Promise<import("next").Metadata>;
  }).generateMetadata;

  assert.equal(typeof generateMetadata, "function");
  const english = await generateMetadata!({
    params: Promise.resolve({ locale: "en" }),
  });
  const chinese = await generateMetadata!({
    params: Promise.resolve({ locale: "zh" }),
  });

  const title = "牛来 (Niu Lai) Meaning & Chinese Movie Meme";
  const description =
    "Understand 牛来 (Niú Lái), the 2026 Chinese animated-film meme. Learn its literal meaning, why it went viral, overseas reactions, and how 牛 and 来 work in Chinese.";
  assert.equal(english.title, title);
  assert.equal(english.description, description);
  assert.equal(english.openGraph?.title, title);
  assert.equal(english.openGraph?.description, description);
  assert.equal(english.twitter?.title, title);
  assert.equal(english.twitter?.description, description);
  assert.equal(
    english.alternates?.canonical,
    "https://gridhanzi.org/chinese-slang/niu-lai",
  );
  assert.equal(english.robots, undefined);
  assert.equal(
    chinese.alternates?.canonical,
    "https://gridhanzi.org/zh/chinese-slang/niu-lai",
  );
  assert.deepEqual(chinese.robots, { index: false, follow: true });
});
