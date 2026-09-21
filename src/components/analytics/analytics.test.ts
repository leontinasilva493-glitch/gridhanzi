import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
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
  assert.match(googleAnalyticsSource, /gtag\('config','\$\{measurementId\}'\)/);
});
