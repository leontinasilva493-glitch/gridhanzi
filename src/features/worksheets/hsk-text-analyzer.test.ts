import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

test("HSK text analysis uses longest matches and exposes version differences", async () => {
  const analyzer = await import("./hsk-text-analyzer").catch(() => null);
  assert.ok(analyzer, "hsk-text-analyzer module should exist");

  const modern = analyzer.analyzeHskText("我喜欢学习中文。", "3.0");
  const classic = analyzer.analyzeHskText("我喜欢学习中文。", "2.0");

  assert.equal(modern.totalHanCharacters, 7);
  assert.equal(modern.matchedHanCharacters, 7);
  assert.equal(modern.coveragePercent, 100);
  assert.deepEqual(
    modern.matchedTerms.map((term) => [term.hanzi, term.level]),
    [["我", "1"], ["喜欢", "1"], ["学习", "1"], ["中文", "1"]],
  );
  assert.equal(
    classic.matchedTerms.find((term) => term.hanzi === "中文")?.level,
    "4",
  );
});

test("HSK text analysis counts repeats and isolates unclassified Hanzi", async () => {
  const analyzer = await import("./hsk-text-analyzer").catch(() => null);
  assert.ok(analyzer, "hsk-text-analyzer module should exist");

  const result = analyzer.analyzeHskText("我爱我，龘！", "2.0");

  assert.equal(result.totalHanCharacters, 4);
  assert.equal(result.matchedHanCharacters, 3);
  assert.equal(result.coveragePercent, 75);
  assert.equal(result.matchedTerms.find((term) => term.hanzi === "我")?.occurrences, 2);
  assert.deepEqual(result.unclassifiedCharacters, [{ character: "龘", occurrences: 1 }]);
});

test("above-target terms and worksheet handoff stay focused", async () => {
  const analyzer = await import("./hsk-text-analyzer").catch(() => null);
  assert.ok(analyzer, "hsk-text-analyzer module should exist");

  const result = analyzer.analyzeHskText("我中文龘", "2.0");
  assert.deepEqual(
    analyzer.getTermsAboveTarget(result, "1").map((term) => term.hanzi),
    ["中文"],
  );
  assert.equal(
    analyzer.buildHskCheckerWorksheetHref(result, "1"),
    "/generator?words=%E4%B8%AD%E6%96%87%2C%E9%BE%98",
  );
});

test("empty and non-Hanzi input returns an honest empty result", async () => {
  const analyzer = await import("./hsk-text-analyzer").catch(() => null);
  assert.ok(analyzer, "hsk-text-analyzer module should exist");

  const result = analyzer.analyzeHskText("Hello, 123!", "3.0");
  assert.equal(result.totalHanCharacters, 0);
  assert.equal(result.coveragePercent, 0);
  assert.deepEqual(result.matchedTerms, []);
  assert.deepEqual(result.unclassifiedCharacters, []);
});

test("the public checker route owns focused TDH, privacy copy, and worksheet links", async () => {
  const route = await import("../../app/[locale]/hsk-level-checker/page").catch(
    () => null,
  );
  assert.ok(route, "hsk-level-checker route should exist");

  const metadata = await route.generateMetadata({
    params: Promise.resolve({ locale: "en" }),
  });
  assert.equal(
    metadata.title,
    "HSK Level Checker for Chinese Text (2.0 & 3.0)",
  );
  assert.match(String(metadata.description), /Paste Chinese text/);
  assert.equal(metadata.openGraph?.title, metadata.title);
  assert.equal(metadata.twitter?.description, metadata.description);

  const componentPath = fileURLToPath(
    new URL("./components/hsk-level-checker-page.tsx", import.meta.url),
  );
  const clientPath = fileURLToPath(
    new URL("./components/hsk-level-checker-client.tsx", import.meta.url),
  );
  const [componentSource, clientSource] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(clientPath, "utf8"),
  ]);
  assert.match(componentSource, /HSK Level Checker for Chinese Text/);
  assert.match(componentSource, /does not predict an official exam score/i);
  assert.match(clientSource, /runs in your browser/i);
  assert.match(clientSource, /buildHskCheckerWorksheetHref/);
  assert.match(clientSource, /href=\{worksheetHref\}/);
});
