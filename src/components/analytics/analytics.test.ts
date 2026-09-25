import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { GoogleAnalytics } from "./google-analytics";
import { Clarity } from "./clarity";
import { Plausible } from "./plausible";
import { fileURLToPath } from "node:url";

const componentFile = (path: string) =>
  readFile(fileURLToPath(new URL(path, import.meta.url)), "utf8");

test("GA4 uses the production measurement ID and precedes other analytics in the document head", async () => {
  const [analyticsSource, layoutSource, googleAnalyticsSource] =
    await Promise.all([
      componentFile("./index.tsx"),
      componentFile("../../app/layout.tsx"),
      componentFile("./google-analytics.tsx"),
    ]);

  assert.match(analyticsSource, /DEFAULT_GOOGLE_ANALYTICS_ID = "G-GQR6DKVGGN"/);
  assert.ok(
    analyticsSource.indexOf("<GoogleAnalytics") <
      analyticsSource.indexOf("<Clarity"),
    "GA4 should render before other analytics scripts",
  );
  assert.match(layoutSource, /<head>\s*<Analytics \/>\s*<\/head>/);
  assert.match(
    googleAnalyticsSource,
    /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=/,
  );
  assert.match(googleAnalyticsSource, /gtag\('config'/);
});

test("analytics makes no external requests on localhost or preview hosts; production loads once", () => {
  const scripts = [GoogleAnalytics({ measurementId: "G-TEST" }), Clarity({ projectId: "test" }), Plausible({ domain: "gridhanzi.org" })];
  for (const hostname of ["localhost", "127.0.0.1", "preview.workers.dev", "gridhanzi.org.evil.test", "gridhanzi.org", "www.gridhanzi.org"]) {
    const inserted: unknown[] = [];
    const sandbox = vm.createContext({ window: { location: { hostname } }, document: {
      createElement: () => ({ setAttribute() {} }),
      head: { appendChild: (script: unknown) => inserted.push(script) },
      getElementsByTagName: () => [{ parentNode: { insertBefore: (script: unknown) => inserted.push(script) } }],
    } });
    for (let pass = 0; pass < 2; pass++) for (const script of scripts) {
      vm.runInContext(script!.props.dangerouslySetInnerHTML.__html, sandbox);
    }
    assert.equal(inserted.length, ["gridhanzi.org", "www.gridhanzi.org"].includes(hostname) ? 3 : 0, hostname);
  }
});
