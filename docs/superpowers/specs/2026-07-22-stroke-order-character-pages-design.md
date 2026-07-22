# Stroke-order character pages design

## Outcome

Add three indexable English character pages at `/stroke-order/爱`, `/stroke-order/年`, and `/stroke-order/佛`. Each page must help a learner understand and practise one character, then continue into the existing worksheet flow.

Success means every route renders with its own title, description, canonical URL, structured character content, Hanzi Writer animation, cumulative stroke diagrams, Pinyin, meaning, HSK information, example words, and an `Add to worksheet` link. The existing `/stroke-order` lookup page must keep working.

## Approaches considered

### 1. Shared dynamic route backed by curated data — recommended

Create one statically generated `[character]` route and a small typed data module containing the three curated records. Reuse the current stroke-order client and stroke-sequence renderer.

This keeps the pages consistent, makes later characters cheap to add, and keeps content quality explicit instead of generating thin pages automatically.

### 2. Three separate route implementations

Create an individual page file for 爱, 年, and 佛. This is simple initially but duplicates layout, metadata, and interaction code. Copy drift would begin as soon as a fourth character is added.

### 3. Query parameters on the existing lookup page

Use `/stroke-order?character=爱`. This reuses the tool with the least code, but it does not create stable, differentiated canonical pages and cannot provide reliable per-character metadata or a scalable sitemap structure.

## Architecture

### Curated character data

A dedicated worksheet feature module will export exactly three records. Each record owns:

- Hanzi, Pinyin, English meaning, stroke count, radical, traditional form, and character structure;
- HSK 2.0 and/or HSK 3.0 labels with a short learner-facing explanation;
- a concise usage note;
- three or more example words with Pinyin and English meaning;
- one short writing tip grounded in the visible character structure.

The first release remains deliberately curated. No arbitrary Hanzi page is indexable unless a complete record exists.

### Dynamic route

`src/app/[locale]/stroke-order/[character]/page.tsx` will:

- expose the three records through `generateStaticParams`;
- return `notFound()` for unsupported values;
- generate a unique English title, description, canonical URL, Open Graph data, and alternate locale metadata using the existing SEO helper;
- render a reusable character detail page inside the existing public site shell.

### Reused interaction

The current stroke-order client will accept an initial character and an optional locked/detail mode. The hub keeps its search input; a character page opens directly on its own character. Both paths continue to use Hanzi Writer for animation and quiz practice, and `StrokeSequence` for cumulative static diagrams.

The worksheet CTA remains `/generator?words=<character>`, preserving the current enrichment and print flow.

### Page content order

1. Breadcrumb and SEO-focused H1: `<Hanzi> (<Pinyin>): <Meaning> — Stroke Order & Writing Guide`.
2. Compact facts row with HSK, stroke count, radical, structure, and traditional form.
3. Interactive animation and controls.
4. Cumulative stroke-by-stroke diagrams.
5. Meaning and usage explanation.
6. Example-word cards.
7. Writing tip and prominent `Add to worksheet` call to action.
8. Links to the other two curated character pages and back to the stroke-order lookup.

The design borrows the useful information hierarchy from HanziStroke, but uses original concise copy and the existing GridHanzi visual system.

## SEO and indexing

- Add the three canonical paths to the public sitemap.
- Each page is self-canonical and indexable.
- Unsupported dynamic paths return 404 rather than a thin generic page.
- Page metadata targets the exact character plus `stroke order`, `meaning`, and `how to write` without creating multiple pages for keyword variants.
- Add JSON-LD for a learning resource/web page only if it matches the content already rendered; avoid unsupported ratings or practice counts.

## Failure handling

If Hanzi Writer data fails to load, the existing visible error state remains. Static facts, example words, and the worksheet CTA still render, so the page retains useful content. Unsupported characters fail at the route boundary with `notFound()`.

## Verification

- Data tests require complete records for 爱, 年, and 佛.
- SEO/sitemap tests require all three routes and no arbitrary character routes.
- Presentation tests require the dynamic route, metadata, HSK content, example words, stroke sequence, and worksheet CTA.
- Run `pnpm test`, `pnpm exec tsc --noEmit`, and `pnpm build`.
- Start the local app and verify HTTP 200 plus rendered titles/content for all three paths, then visually inspect desktop and mobile layouts.

## Non-goals

- A full Chinese dictionary or arbitrary programmatic character index.
- Audio, example-sentence generation, accounts, saved vocabulary, or learning progress.
- Copying HanziStroke wording, proprietary images, or page chrome.
- Full Chinese-localized body copy in this slice.
