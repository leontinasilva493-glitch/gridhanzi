import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { StructuredData } from "./components/structured-data";

const entity = { "@context": "https://schema.org", "@type": "WebSite", name: "GridHanzi" };

function scripts(data: object | object[]) {
  const html = renderToStaticMarkup(StructuredData({ data }));
  return [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]!);
}

test("each JSON-LD entity has its own object document for Safari", () => {
  const second = { ...entity, "@type": "Organization" };
  assert.deepEqual(scripts([entity, second]).map((json) => JSON.parse(json)), [entity, second]);
});

test("single JSON-LD objects preserve their fields", () => {
  assert.deepEqual(scripts(entity).map((json) => JSON.parse(json)), [entity]);
});

test("empty structured data emits no JSON-LD document", () => {
  assert.deepEqual(scripts([]), []);
});

test("structured data cannot close its script tag", () => {
  const data = { ...entity, name: "</script><script>alert(1)</script>" };
  const [json] = scripts(data);
  assert.ok(json && !json.includes("<"));
  assert.deepEqual(JSON.parse(json), data);
});
