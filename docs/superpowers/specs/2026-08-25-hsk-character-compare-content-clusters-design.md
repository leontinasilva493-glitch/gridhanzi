# HSK, Character, and Comparison Content Clusters Design

## Goal

Publish a tightly curated set of differentiated acquisition pages that turn
GridHanzi's existing HSK catalogue, stroke-order guides, templates, grids, and
worksheet generator into three connected learning paths: browse an HSK level,
study a character, and resolve a high-value character or grammar confusion.

## Scope

This release adds 34 English-indexable public pages in priority order.

### P0

- HSK hub: `/hsk`
- HSK level pages: `/hsk/2.0/level-1`, `/hsk/3.0/level-1`
- Character guides: `好`, `不`, `没`, `有`, `上`, `下`, `大`, `小`, `家`, `水`

### P1

- Comparison hub: `/compare`
- Comparison pages: `的-得-地`, `不-没`, `来-去`, `在-再`, `上-下`

### P2

- HSK level pages: `/hsk/2.0/level-2`, `/hsk/3.0/level-2`,
  `/hsk/2.0/level-3`, `/hsk/3.0/level-3`
- Character guides: `书`, `吃`, `喝`, `二`, `再`, `得`, `地`, `坏`
- Comparison pages: `好-坏`, `人-入`, `牛-午`

Textbook pages, additional trend pages, account features, quiz-builder work,
and bulk dictionary expansion are out of scope.

## Architecture

### HSK content domain

`hsk-pages.ts` owns the seven public page descriptors and filters the existing
source-labelled `hskCatalog` without copying its data. A small client component
receives only the selected level's entries and performs Hanzi/Pinyin/English
search locally. Search results remain on the canonical page; query strings are
not added to the sitemap.

The HSK hub is a Server Component. Level routes use static params and server
metadata, then render a server editorial shell around the client list browser.
Each descriptor has unique title, H1, description, introduction, level focus,
version note, and study plan. Shared page structure is allowed; shared
substantive prose is not.

### Character expansion domain

`stroke-order-character-expansion.ts` owns the 18 new complete character
entries. It imports only the `StrokeOrderCharacter` type and exports data to
the existing publication-gated character module. This keeps the established
route, schema, hub, sitemap, and animation consumers unchanged while avoiding
another large inline block in `stroke-order-characters.ts`.

Every entry must contain accurate character facts, explicit HSK evidence,
unique search metadata, unique learning purpose, component explanation,
reading/use notes, four vocabulary examples, three graded sentences, one
writing mistake, one confusable distinction, one writing tip, and curated
related characters.

### Comparison content domain

`comparison-pages.ts` owns eight reviewed pages. Each page supplies:

- unique TDH and a 30-second summary;
- two or three comparison items with distinct role, meaning, pattern, and
  examples;
- a literal side-by-side comparison table;
- page-specific memory tips and common corrections;
- visible FAQs;
- a worksheet word list and explicitly related comparison slugs.

The detail component renders `LearningResource`, `BreadcrumbList`, and visible
FAQ content. The hub groups pages by grammar, direction, and visual/form
confusion. It does not generate arbitrary pair routes.

## Content differentiation rules

1. No two published pages may share normalized Title, Description, H1,
   introduction/summary, main teaching explanation, mistake guidance, or
   memory guidance.
2. Structural labels such as “Common mistakes” may repeat; substantive copy
   beneath them may not.
3. Character examples and every graded sentence must contain the character
   being taught, except a comparison's deliberately incorrect example.
4. HSK claims must be exact standalone rows or explicitly labelled
   word-family evidence from the versioned local catalogue.
5. Comparison pages must explain a real decision rule, not only list two
   dictionary definitions.
6. HSK pages must expose the real level list and distinct level/version
   guidance; they may not be thin links to the generator.
7. Content-incomplete records must fail closed and remain absent from routes,
   lookup, hubs, related links, and sitemap output.

## Internal-link graph

- Header/footer and stroke-order hub link to `/hsk` and `/compare`.
- HSK hub links to every level page, Generator, HSK templates, Stroke Order,
  Compare, Grids, and For Teachers.
- HSK level pages link visible character entries to published character guides
  when available and link to the matching Generator level query and HSK
  worksheet template.
- Character pages render explicitly curated comparison links when their
  character appears in a comparison.
- Comparison pages link to every published character guide they discuss,
  related comparisons, `/hsk`, `/stroke-order`, and a prefilled Generator
  worksheet.
- HSK template details and the HSK picker expose crawlable links back to the
  public HSK directory.
- The teacher page links to HSK lists and comparison lessons as lesson-planning
  resources.

No page receives a broad “all links everywhere” block.

## SEO and indexing

- English HSK, character, and comparison pages are indexable and enter the
  single public sitemap authority.
- Untranslated Chinese locale variants are `noindex, follow` and stay out of
  the sitemap.
- Every route has a self-canonical, aligned standard/Open Graph/Twitter Title
  and Description, one H1, and matching structured data.
- HSK pages use `CollectionPage` plus `BreadcrumbList`.
- Character pages retain `LearningResource` plus `BreadcrumbList`.
- Comparison pages use `LearningResource` plus `BreadcrumbList`; FAQ markup is
  omitted because FAQ rich results are not a growth target.
- No `priority`, synthetic `lastModified`, or `changeFrequency` is added.

## Visual direction

Reuse GridHanzi's editorial paper, navy ink, cinnabar accent, serif display,
Kaiti Hanzi, restrained cards, and generous whitespace. HSK pages use a
compact library/catalogue layout with visible counts and searchable rows.
Comparison pages use an editorial split-column treatment with a strong
side-by-side rule table. New pages must remain recognizable as GridHanzi and
must not introduce gradient-heavy generic landing-page styling.

## Performance and accessibility

- Routes remain Server Components except the HSK search list.
- Only the filtered level entries cross the Server-to-Client boundary.
- Long lists use `content-visibility: auto` and semantic table/list markup.
- Links remain real crawlable anchors; controls have accessible labels.
- Each page has exactly one H1 and a logical H2/H3 hierarchy.
- Desktop and 390px layouts must have no horizontal overflow.

## Verification

- Strict RED/GREEN tests for page descriptors, publication gates, uniqueness,
  routes, metadata, sitemap, rendered sections, structured data, and internal
  links.
- Full `pnpm.cmd test` and `pnpm.cmd exec tsc --noEmit`.
- `pnpm.cmd build` must list HSK and Compare routes.
- Tabbit QA checks the hubs and representative P0/P1/P2 pages on desktop and
  390px mobile for HTTP 200, one H1, TDH, canonical, index/noindex, internal
  links, console errors, and overflow.

## Release boundary

The deliverable is a local production build and local review URLs. Do not
push, merge, publish, deploy, submit sitemaps, or request indexing in this
task.
