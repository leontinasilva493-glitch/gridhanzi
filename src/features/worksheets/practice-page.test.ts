import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";

import PracticePage, {
  generateMetadata,
} from "../../app/[locale]/practice/page";
import StrokeOrderPage from "../../app/[locale]/stroke-order/page";
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
  assert.match(html, /1 of 10/);
});

test("stroke-order discovery pages link into continuous practice with the current character", () => {
  const entry = getStrokeOrderCharacter("学");
  assert.ok(entry);

  const hubHtml = renderWithLocale(createElement(StrokeOrderPage));
  const detailHtml = renderWithLocale(
    createElement(StrokeOrderCharacterPage, { entry, locale: "en" }),
  );

  assert.match(hubHtml, /href="\/practice"/);
  assert.match(detailHtml, /href="\/practice\?character=%E5%AD%A6"/);
});
