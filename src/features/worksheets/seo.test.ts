import assert from "node:assert/strict";
import test from "node:test";

import { worksheetTemplates } from "./data";
import { buildPublicSitemapPaths, toAbsoluteUrl } from "./seo";

test("buildPublicSitemapPaths includes every differentiated template page", () => {
  const paths = buildPublicSitemapPaths();

  assert.ok(paths.includes("/"));
  assert.ok(paths.includes("/generator"));
  assert.ok(paths.includes("/templates"));
  assert.ok(paths.includes("/stroke-order"));
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
