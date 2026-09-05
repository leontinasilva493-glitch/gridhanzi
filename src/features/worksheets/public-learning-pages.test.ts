import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { getStrokeOrderCharacter } from "./stroke-order-characters";

test("stroke-order rules provide eight distinct principles and reviewed exceptions", async () => {
  const content = await import("./stroke-order-rules").catch(() => null);
  assert.ok(content, "stroke-order-rules module should exist");

  assert.equal(content.strokeOrderRules.length, 8);
  assert.ok(content.strokeOrderExceptions.length >= 3);
  assert.equal(
    new Set(content.strokeOrderRules.map((rule) => rule.explanation)).size,
    content.strokeOrderRules.length,
  );
  assert.equal(
    new Set(content.strokeOrderRules.map((rule) => rule.practice)).size,
    content.strokeOrderRules.length,
  );
  for (const rule of content.strokeOrderRules) {
    assert.ok(rule.examples.length >= 2, rule.slug);
    for (const example of rule.examples) {
      if (example.guideCharacter) {
        assert.ok(getStrokeOrderCharacter(example.guideCharacter), example.guideCharacter);
      }
    }
  }
});

test("the stroke-order rules route owns distinct TDH and links to real practice paths", async () => {
  const route = await import("../../app/[locale]/chinese-stroke-order-rules/page").catch(() => null);
  assert.ok(route, "stroke-order rules route should exist");
  const metadata = await route.generateMetadata({ params: Promise.resolve({ locale: "en" }) });
  assert.equal(metadata.title, "Chinese Stroke Order Rules with Examples");
  assert.match(String(metadata.description), /core Chinese stroke order rules/);
  assert.equal(metadata.openGraph?.title, metadata.title);
  assert.equal(metadata.twitter?.description, metadata.description);

  const componentSource = await readFile(
    fileURLToPath(new URL("./components/stroke-order-rules-page.tsx", import.meta.url)),
    "utf8",
  );
  assert.match(componentSource, /Chinese Stroke Order Rules/);
  assert.match(componentSource, /href="\/stroke-order"/);
  assert.match(componentSource, /href="\/chinese-character-components"/);
  assert.match(componentSource, /href="\/templates\/basic-strokes"/);
});

test("component collection launches six differentiated semantic and phonetic guides", async () => {
  const content = await import("./character-components").catch(() => null);
  assert.ok(content, "character-components module should exist");

  assert.deepEqual(
    content.characterComponentPages.map((page) => page.slug),
    ["water-shui", "person-ren", "hand-shou", "mouth-kou", "qing-phonetic", "ma-phonetic"],
  );
  assert.deepEqual(new Set(content.characterComponentPages.map((page) => page.kind)), new Set(["meaning", "sound"]));

  for (const field of ["title", "description", "heading", "intro", "reliability", "practicePrompt"] as const) {
    const values: string[] = content.characterComponentPages.map((page) => page[field]);
    assert.equal(new Set(values).size, content.characterComponentPages.length, field);
  }

  for (const page of content.characterComponentPages) {
    assert.ok(page.description.length >= 90 && page.description.length <= 160, page.slug);
    assert.equal(page.examples.length, 6, page.slug);
    assert.equal(page.writingTips.length, 3, page.slug);
    assert.equal(content.getCharacterComponentPage(page.slug), page);
    for (const example of page.examples) {
      if (example.guideCharacter) {
        assert.ok(getStrokeOrderCharacter(example.guideCharacter), `${page.slug}:${example.guideCharacter}`);
      }
    }
  }
  assert.equal(content.getCharacterComponentPage("unknown"), undefined);
});

test("component hub and detail routes publish page-specific metadata and static paths", async () => {
  const [hub, detail] = await Promise.all([
    import("../../app/[locale]/chinese-character-components/page").catch(() => null),
    import("../../app/[locale]/components/[slug]/page").catch(() => null),
  ]);
  assert.ok(hub, "component hub route should exist");
  assert.ok(detail, "component detail route should exist");

  const [hubMetadata, waterMetadata, qingMetadata] = await Promise.all([
    hub.generateMetadata({ params: Promise.resolve({ locale: "en" }) }),
    detail.generateMetadata({ params: Promise.resolve({ locale: "en", slug: "water-shui" }) }),
    detail.generateMetadata({ params: Promise.resolve({ locale: "en", slug: "qing-phonetic" }) }),
  ]);
  assert.equal(hubMetadata.title, "Chinese Character Components: Meaning & Sound Clues");
  assert.notEqual(waterMetadata.title, qingMetadata.title);
  assert.notEqual(waterMetadata.description, qingMetadata.description);
  assert.equal(waterMetadata.openGraph?.title, waterMetadata.title);
  assert.equal(qingMetadata.twitter?.description, qingMetadata.description);
  assert.equal(detail.generateStaticParams().length, 6);

  const detailSource = await readFile(
    fileURLToPath(new URL("./components/character-component-detail-page.tsx", import.meta.url)),
    "utf8",
  );
  for (const href of ["/chinese-character-components", "/chinese-stroke-order-rules", "/generator", "/templates/radicals"]) {
    assert.ok(detailSource.includes(`href=\"${href}\"`), href);
  }
});
