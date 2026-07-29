# GridHanzi SEO Operations Guide

This document is the source of truth for public indexing, page targeting,
metadata, sitemap scope, and post-deploy SEO checks for
`https://gridhanzi.org`.

## Search intent by route

Each route owns one primary intent so public pages do not compete with each
other.

| Route | Primary search intent |
| --- | --- |
| `/` | Chinese Character Practice Sheet Generator |
| `/generator` | Chinese Worksheet Generator |
| `/english-to-chinese-writing-practice` | English to Chinese Writing Practice |
| `/templates` | Printable Chinese Writing Worksheets |
| `/templates/[slug]` | `[Topic] Chinese Writing Worksheet` |
| `/stroke-order` | Chinese Stroke Order |
| `/for-teachers` | Chinese Worksheets for Teachers |
| `/zh/generator` | 中文汉字字帖生成器 |

Keep the homepage canonical at `/`. Do not create a duplicate keyword path
such as `/chinese-character-practice-sheet-generator`.

## Indexing policy

Index pages only when they contain differentiated public value.

### Index

- The English homepage, generator, template library, stroke-order tool, and
  teacher page.
- `/english-to-chinese-writing-practice`, because it is a differentiated
  editable worksheet workflow for English-input vocabulary searches.
- Every curated template detail page with its own vocabulary, metadata,
  learning goal, teaching tip, and practice activity.
- `/zh/generator`, because it has a Chinese interface and an English alternate.

### Do not index

- `/worksheet/preview` and `/zh/worksheet/preview`: transient browser state,
  controlled with page-level `noindex` metadata and omitted from the sitemap.
- Untranslated Chinese marketing routes: use `noindex, follow` and omit them
  from the sitemap until the visible content is translated and differentiated.
- `/api/*`: block in `robots.txt`.
- Query-string combinations such as `?words=`, `?template=`, `?mode=`, and
  `?profile=`: never add them to the sitemap.
- Account, dashboard, checkout, admin, or other private routes if they are
  introduced later.

Do not add `/worksheet/preview` to `robots.txt` while relying on its meta
`noindex`; crawlers need to read the page metadata to see that directive.

## Metadata rules

Every indexable route must provide:

- A unique, descriptive Title and Meta Description.
- A self-referencing absolute canonical URL.
- One visible H1 that matches the page's primary intent.
- `og:title`, `og:description`, `og:url`, and an absolute `og:image`.
- A Twitter large-image card.
- Structured data that matches visible page content.

The shared Open Graph image is `/og-gridhanzi.png` at 1200 x 630. Template
pages may receive their own social images later, but must keep a valid generic
fallback.

Avoid keyword-density targets. Use the primary phrase in the Title and H1,
then write naturally about Hanzi, Pinyin, tracing, writing grids, printable
PDFs, teachers, parents, and learners where those concepts help the visitor.

## Structured data

- Homepage: `Organization`, `WebSite`, and `WebApplication`.
- Template detail: `LearningResource` and `BreadcrumbList`.
- FAQ markup may remain when the visible questions and answers match it, but
  it is not treated as a growth target because general education sites do not
  normally receive Google FAQ rich results.
- Validate changed markup with Google Rich Results Test and Schema.org
  Validator after deployment.

## Internal linking

- Homepage featured-template cards link to `/templates/[slug]` with a
  descriptive worksheet label.
- Template detail pages link to the generator only after explaining the list,
  learning goal, teaching use, and practice activity.
- Related-template links should remain topic-aware and crawlable `<a href>`
  links.
- Do not add unrelated external links only to satisfy an audit score.

## Sitemap policy

`src/app/sitemap.ts` is the only sitemap authority. It contains canonical,
indexable URLs only and emits English/Chinese alternates for the generator.

- Do not emit `priority` or `changeFrequency`.
- Add `lastModified` only when it represents a real content modification,
  never the current build time.
- When adding a public route, make its index/noindex decision explicit and add
  a sitemap test in the same change.

## Performance budgets

Before optimization, production HTML measured about 1,147 KB with 2,117 SVG
elements on `/`, and 956 KB with 1,795 SVG elements on `/templates`. Full
worksheet SVG previews must therefore stay out of listing cards.

The verified 2026-07-22 production build reduced those pages to:

| Route | HTML | SVG elements |
| --- | ---: | ---: |
| `/` | 176.1 KB | 110 |
| `/templates` | 84.2 KB | 8 |

The same rendered checks confirmed an absolute canonical and one `og:image`
on both pages.

Release budgets:

- Homepage HTML: below 250 KB when measured uncompressed.
- Template-list HTML: below 300 KB when measured uncompressed.
- Homepage SVG elements: below 200.
- Template-list SVG elements: below 100.
- Core Web Vitals targets: LCP below 2.5 s, INP below 200 ms, CLS below 0.1.

Measure HTML and metadata from a production build, not only from source code.
New sites may not have enough field data for a Core Web Vitals report; use
PageSpeed Insights laboratory data until Search Console reports real users.

## Required release checks

Run locally:

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

After deployment, check:

1. `/`, `/generator`, `/templates`, one template detail page,
   `/english-to-chinese-writing-practice`, `/stroke-order`, `/for-teachers`,
   and `/zh/generator` return 200.
2. Each page has the intended Title, H1, canonical, robots directive, and
   `og:image`.
3. `/sitemap.xml` includes only the approved URLs.
4. `/robots.txt` allows public pages and blocks `/api/`.
5. `https://www.gridhanzi.org/*` redirects once to the matching path on
   `https://gridhanzi.org/*`.

## Google Search Console owner steps

These actions require the site owner's Google account and cannot be completed
by a source-code deployment alone.

1. Open Google Search Console and add the Domain property `gridhanzi.org`.
2. Complete DNS verification if Google has not already verified the property.
3. Open **Sitemaps**, enter `sitemap.xml`, and submit it.
4. Use **URL Inspection** for these initial URLs:
   - `https://gridhanzi.org/`
   - `https://gridhanzi.org/generator`
   - `https://gridhanzi.org/english-to-chinese-writing-practice`
   - `https://gridhanzi.org/templates`
   - `https://gridhanzi.org/templates/family`
   - `https://gridhanzi.org/templates/hsk-1`
   - `https://gridhanzi.org/stroke-order`
   - `https://gridhanzi.org/for-teachers`
   - `https://gridhanzi.org/zh/generator`
5. For each URL, run **Test live URL** and then **Request indexing** when the
   live test succeeds.
6. Review Page Indexing, Sitemaps, Core Web Vitals, HTTPS, and Manual Actions
   after Google has recrawled the site.

## Measurement cadence

Use Search Console as the ranking source of truth. Compare 28-day periods for:

- Clicks, impressions, CTR, and average position by query and page.
- Homepage queries around the primary generator phrase.
- Template-page impressions for topic-specific worksheet phrases.
- Pages that are discovered but not indexed.
- Mobile Core Web Vitals groups.

Do not rewrite pages from a single day of data. Prioritize pages with sustained
impressions and low CTR, or pages whose useful content is not being indexed.
