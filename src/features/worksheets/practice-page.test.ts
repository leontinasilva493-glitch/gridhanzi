import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";

import PracticePage, {
  generateMetadata,
} from "../../app/[locale]/practice/page";
import StrokeOrderPage, {
  generateMetadata as generateStrokeOrderMetadata,
} from "../../app/[locale]/stroke-order/page";
import { StrokeOrderLookupClient } from "./components/stroke-order-lookup-client";
import { HandwritingLookupClient } from "./components/handwriting-lookup-client";
import { StrokeOrderCharacterPage } from "./components/stroke-order-character-page";
import { getStrokeOrderCharacter } from "./stroke-order-characters";
import { buildPublicSitemapPaths } from "./seo";

function renderWithLocale(element: React.ReactNode) {
  return renderToStaticMarkup(
    createElement(NextIntlClientProvider, {
      locale: "en",
      messages: {},
      children: element,
    }),
  );
}

test("practice page is a noindex product surface with a localized canonical", async () => {
  const metadata = await generateMetadata({
    params: Promise.resolve({ locale: "en" }),
  });

  assert.equal(metadata.title, "Chinese Character Practice Session");
  assert.deepEqual(metadata.robots, { index: false, follow: true });
  assert.equal(
    metadata.alternates?.canonical,
    "https://gridhanzi.org/practice",
  );
  assert.equal(buildPublicSitemapPaths().includes("/practice"), false);
});

test("practice page opens the requested published character and exposes continuous recommendations", async () => {
  const page = await PracticePage({
    searchParams: Promise.resolve({ character: "学" }),
  });
  const html = renderWithLocale(page);

  assert.match(html, /Practice Chinese Characters/);
  assert.match(html, /Starter 10/);
  assert.match(html, /Everyday core/);
  assert.match(html, /Shape builders/);
  assert.match(html, /href="\/stroke-order\/(?:学|%E5%AD%A6)"/);
  assert.match(html, /href="\/stroke-order\?mode=draw#character-lookup"/);
  assert.match(html, /1 of 10/);
});

test("stroke-order discovery pages link into continuous practice with the current character", async () => {
  const entry = getStrokeOrderCharacter("学");
  assert.ok(entry);

  const hubPage = await (
    StrokeOrderPage as unknown as (props: {
      searchParams: Promise<{ character?: string }>;
    }) => Promise<React.ReactElement>
  )({ searchParams: Promise.resolve({ character: "学" }) });
  const hubHtml = renderWithLocale(hubPage);
  const detailHtml = renderWithLocale(
    createElement(StrokeOrderCharacterPage, { entry, locale: "en" }),
  );

  assert.match(hubHtml, /href="\/practice"/);
  assert.match(hubHtml, /Trace 学 stroke by stroke/);
  assert.match(detailHtml, /href="\/practice\?character=%E5%AD%A6"/);
});

test("stroke-order metadata promises both typed and handwritten lookup", async () => {
  const metadata = await generateStrokeOrderMetadata({
    params: Promise.resolve({ locale: "en" }),
  });

  assert.match(metadata.description ?? "", /draw/i);
  assert.match(metadata.description ?? "", /stroke order/i);
});

test("stroke-order lookup offers typing and handwriting as two explicit input modes", () => {
  const html = renderWithLocale(
    createElement(StrokeOrderLookupClient, { initialCharacter: "永" }),
  );

  assert.match(html, /Type a character/);
  assert.match(html, /Draw a character/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /Show stroke order/);
});

test("handwriting input exposes an accessible private drawing surface and editing controls", () => {
  const html = renderWithLocale(
    createElement(HandwritingLookupClient, {
      onSelectCharacter: () => undefined,
    }),
  );

  assert.match(html, /aria-label="Draw one Simplified Chinese character"/);
  assert.match(html, /Undo last stroke/);
  assert.match(html, /Clear handwriting/);
  assert.match(html, /stays on this device/);
  assert.doesNotMatch(html, /fixed fallback candidates/i);
});

test("a selected handwriting candidate continues to its guide, practice, and worksheet flow", () => {
  const html = renderWithLocale(
    createElement(StrokeOrderLookupClient, { initialCharacter: "学" }),
  );

  assert.match(html, /Selected character/);
  assert.match(html, /Open 学 character guide/);
  assert.match(html, /href="\/practice\?character=%E5%AD%A6"/);
  assert.match(html, /href="\/generator\?words=%E5%AD%A6"/);
});

test("draw-mode links open the handwriting canvas immediately", async () => {
  const page = await StrokeOrderPage({ searchParams: Promise.resolve({ mode: "draw" }) });
  assert.match(renderWithLocale(page), /aria-label="Draw one Simplified Chinese character"/);
});
