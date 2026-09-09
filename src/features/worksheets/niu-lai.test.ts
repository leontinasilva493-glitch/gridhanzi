import assert from "node:assert/strict";
import test from "node:test";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";

test("the 牛来 guide preserves the film-title, language, source, and update boundaries", async () => {
  const dataModule = await import("./niu-lai").catch(() => ({}));
  const guide = (dataModule as {
    niuLaiGuide?: {
      seo: { title: string; description: string; h1: string };
      reviewedAt: string;
      quickAnswer: string;
      sources: Array<{ href: string }>;
    };
  }).niuLaiGuide;

  assert.ok(guide, "牛来 guide data exists");
  assert.equal(guide.seo.title, "牛来 (Niu Lai) Meaning & Chinese Movie Meme");
  assert.equal(
    guide.seo.description,
    "Understand 牛来 (Niú Lái), the 2026 Chinese animated-film meme. Learn its literal meaning, why it went viral, overseas reactions, and how 牛 and 来 work in Chinese.",
  );
  assert.equal(
    guide.seo.h1,
    "What Does 牛来 (Niú Lái) Mean? The Chinese Movie Meme Explained",
  );
  assert.equal(guide.reviewedAt, "2026-08-17");
  assert.match(guide.quickAnswer, /film title/i);
  assert.match(guide.quickAnswer, /not (?:a )?standard/i);
  assert.match(guide.quickAnswer, /not (?:an )?HSK/i);
  assert.doesNotMatch(JSON.stringify(guide), /global sensation|official English title/i);
  assert.ok(guide.sources.length >= 5);
  assert.ok(guide.sources.some((source) => source.href.includes("bjnews.com.cn")));
  assert.ok(guide.sources.some((source) => source.href.includes("reddit.com/r/boxoffice")));
});

test("the rendered 牛来 page exposes differentiated learning content and safe structured data", async () => {
  const pageModule = await import("./components/niu-lai-page").catch(() => ({}));
  const NiuLaiPage = (pageModule as {
    NiuLaiPage?: ComponentType<{ locale: string }>;
  }).NiuLaiPage;
  assert.equal(typeof NiuLaiPage, "function");

  const html = renderToStaticMarkup(
    createElement(NextIntlClientProvider, {
      locale: "en",
      messages: {},
      children: createElement(NiuLaiPage!, { locale: "en" }),
    }),
  );

  const h1s = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/g) ?? [];
  assert.equal(h1s.length, 1);
  assert.match(h1s[0], /牛来.*Niú Lái.*Chinese Movie Meme Explained/);
  assert.match(html, /牛来了/);
  assert.match(html, /The Bull Arrives/);
  assert.match(html, /emerging overseas meme/i);
  assert.match(html, /href="\/stroke-order\/牛"/);
  assert.match(html, /href="\/stroke-order\/来"/);
  assert.match(html, /https:\/\/www\.bjnews\.com\.cn/);
  assert.match(html, /https:\/\/www\.reddit\.com\/r\/boxoffice/);
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 2);
  const structuredData = scripts.map((script) => JSON.parse(script[1])) as Array<{ "@type": string }>;
  assert.deepEqual(
    structuredData.map((entry) => entry["@type"]),
    ["Article", "BreadcrumbList"],
  );
  assert.equal(structuredData.some((entry) => entry["@type"] === "Movie"), false);
  const breadcrumbs = structuredData[1] as unknown as {
    itemListElement: Array<{ item: string }>;
  };
  assert.deepEqual(
    breadcrumbs.itemListElement.map((item) => item.item),
    ["https://gridhanzi.org/", "https://gridhanzi.org/chinese-slang/niu-lai"],
  );
});
