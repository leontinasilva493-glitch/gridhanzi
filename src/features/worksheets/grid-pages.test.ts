import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  gridPaperPages,
  getGridPaperPage,
  parseGridQuery,
} from "./grid-pages";
import { buildPublicSitemapPaths } from "./seo";
import { parseGeneratorGridQuery } from "../../app/[locale]/generator/page";
import { generateMetadata as generateGridPaperMetadata } from "../../app/[locale]/grids/[slug]/page";

const projectRoot = process.cwd();

test("defines the three printable grid landing pages with keyword PDFs", () => {
  assert.deepEqual(
    gridPaperPages.map((page) => page.slug),
    ["tian-zi-ge", "mi-zi-ge", "blank"],
  );

  for (const page of gridPaperPages) {
    assert.match(page.title, /Printable|Paper|Practice/);
    assert.ok(page.description.length >= 90, page.slug);
    assert.ok(page.faqs.length >= 3, page.slug);
    assert.match(page.pdfHref, /^\/downloads\/.+\.pdf$/);
  }

  assert.deepEqual(
    gridPaperPages.map((page) => page.title),
    [
      "Free Tian Zi Ge Printable Grid Paper",
      "Free Mi Zi Ge Printable Grid Paper",
      "Blank Hanzi Grid Paper PDF",
    ],
  );
});

test("resolves grid pages and generator grid query values", () => {
  assert.equal(getGridPaperPage("tian-zi-ge")?.grid, "tian");
  assert.equal(getGridPaperPage("mi-zi-ge")?.grid, "mi");
  assert.equal(getGridPaperPage("blank")?.grid, "tian");
  assert.equal(getGridPaperPage("missing"), undefined);

  assert.equal(parseGridQuery("tian-zi-ge"), "tian");
  assert.equal(parseGridQuery("mi-zi-ge"), "mi");
  assert.equal(parseGridQuery("invalid"), undefined);
  assert.equal(parseGeneratorGridQuery({ grid: "tian-zi-ge" }), "tian");
  assert.equal(parseGeneratorGridQuery({ grid: "mi-zi-ge" }), "mi");
  assert.equal(parseGeneratorGridQuery({ grid: "invalid" }), undefined);
});

test("adds the grid hub and its three child pages to the public sitemap", () => {
  const paths = buildPublicSitemapPaths();

  assert.deepEqual(
    paths.filter((pathname) => pathname === "/grids" || pathname.startsWith("/grids/")),
    ["/grids", "/grids/tian-zi-ge", "/grids/mi-zi-ge", "/grids/blank"],
  );
});

test("publishes a real PDF asset for every grid page", async () => {
  for (const page of gridPaperPages) {
    const assetPath = path.join(projectRoot, "public", page.pdfHref.slice(1));
    await access(assetPath);
    const source = await readFile(assetPath);
    assert.equal(source.subarray(0, 5).toString("ascii"), "%PDF-", page.slug);
    assert.ok(source.length > 500, page.slug);
  }
});

test("blank grid metadata describes the real Tian Zi Ge download", async () => {
  const metadata = await generateGridPaperMetadata({
    params: Promise.resolve({ locale: "en", slug: "blank" }),
  });

  assert.equal(metadata.title, "Blank Hanzi Grid Paper PDF");
  assert.match(metadata.description ?? "", /blank Tian Zi Ge/i);
  assert.doesNotMatch(metadata.description ?? "", /plain (?:cell|grid)/i);
});
