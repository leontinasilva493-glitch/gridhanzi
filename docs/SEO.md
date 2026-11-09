# GridHanzi SEO Operations Guide

This document is the source of truth for public indexing, page targeting,
metadata, sitemap scope, and post-deploy SEO checks for
`https://gridhanzi.org`.

## Search intent by route

Each route owns one primary intent so public pages do not compete with each
other.

| Route | Primary search intent |
| --- | --- |
| `/` | Chinese Character Worksheet Generator |
| `/generator` | Chinese Worksheet Generator from Your Word List |
| `/english-to-chinese-writing-practice` | English to Chinese Writing Practice |
| `/templates` | Printable Chinese Writing Worksheets |
| `/templates/[slug]` | `[Topic] Chinese Writing Worksheet` |
| `/grids` | Free Chinese grid paper PDF directory: Tian Zi Ge, Mi Zi Ge, and blank writing paper |
| `/grids/tian-zi-ge` | Tian Zi Ge printable practice paper |
| `/grids/mi-zi-ge` | Mi Zi Ge printable practice paper |
| `/grids/blank` | Blank Chinese writing practice paper for dictation and independent copying |
| `/stroke-order` | Chinese stroke order with typed or private handwriting lookup |
| `/chinese-stroke-order-dictionary` | Browse curated Hanzi by reading, meaning, radical, and stroke count before opening a writing guide |
| `/stroke-order/[character]` | Curated character stroke order, meaning, and usage |
| `/chinese-stroke-order-rules` | Chinese stroke order rules and exceptions |
| `/chinese-character-components` | Chinese character meaning and sound components |
| `/components/[slug]` | One curated component family and writing pattern |
| `/hsk-level-checker` | HSK level checker for Chinese text |
| `/hsk/[system]/[level]` | Version-specific HSK vocabulary and writing practice |
| `/hsk/3-0-exam-guide` | Official HSK 3.0 exam dates, source notes, and version FAQ |
| `/hsk/3-0-writing-characters` | Official HSK 3.0 writing-character groups and focused practice selection |
| `/practice` | Continuous on-screen character practice product surface (`noindex`) |
| `/chinese-slang/niu-lai` | Niu Lai meaning and Chinese movie meme context |
| `/shenzhen-in-chinese` | Shenzhen in Chinese: 深圳, Mandarin Pinyin, character meanings, examples, and writing practice |
| `/thank-you-in-chinese` | Thank you in Chinese: 谢谢, Mandarin pronunciation, usage, and writing practice |
| `/for-teachers` | Chinese Worksheets for Teachers |
| `/zh/generator` | 中文汉字字帖生成器 |

Keep the homepage canonical at `/`. Do not create a duplicate keyword path
such as `/chinese-character-practice-sheet-generator`.

## 2026-07-30 MVP template validation set

Competitor sitemap checks showed active expansion around HSK scenario
worksheets, printable grid sheets, and high-frequency character practice. The
first GridHanzi validation batch stays inside the existing
`/templates/[slug]` system so every page remains an editable worksheet rather
than a thin article page.

Track these pages in Google Search Console for 2-4 weeks by page and query:

| Route | Validation intent |
| --- | --- |
| `/templates/hsk-3-campus-life` | HSK 3 campus life Chinese worksheet |
| `/templates/hsk-3-health` | HSK 3 health Chinese worksheet |
| `/templates/hsk-3-shopping-money` | HSK 3 shopping and money worksheet |
| `/templates/hsk-3-technology` | HSK 3 technology Chinese worksheet |
| `/templates/hsk-3-exams-grades` | HSK 3 exam and grade writing worksheet |
| `/templates/hsk-3-apartment-home` | HSK 3 home and apartment worksheet |
| `/templates/hsk-3-office-teamwork` | HSK 3 workplace Chinese worksheet |
| `/templates/top-100-chinese-characters` | Top 100 Chinese characters writing practice |
| `/templates/blank-tianzige-grid` | Printable Tian Zi Ge practice paper |
| `/templates/chinese-first-characters` | First Chinese characters worksheet |

Expand only after impressions appear. If HSK 3 scenario pages receive
impressions, split the same structure into HSK 4 and HSK 5 scenarios. If the
Top 100 page receives impressions, test Top 200/300 or a small single-character
worksheet cluster instead of launching thousands of dictionary-style pages.

## Indexing policy

Index pages only when they contain differentiated public value.

### Index

- The English homepage, generator, template library, stroke-order tool, and
  teacher page.
- `/english-to-chinese-writing-practice`, because it is a differentiated
  editable worksheet workflow for English-input vocabulary searches.
- Every curated template detail page with its own vocabulary, metadata,
  learning goal, teaching tip, and practice activity.
- The three printable grid detail pages and their directory, each with a
  distinct paper or selection intent and a working PDF download.
- Curated English character guides and the sourced `/chinese-slang/niu-lai`
  explainer, because each has differentiated language-learning value.
- The English stroke-order dictionary, because it offers combined search and
  browse filters across reviewed character guides rather than another single-
  character lookup. Keep its stated coverage aligned with the published set.
- The HSK text checker, advanced HSK list pages, stroke-order rules guide,
  component hub, and six reviewed component guides. Their utilities and
  editorial fields provide value beyond a generated dictionary record.
- The HSK 3.0 exam guide and official writing-character list. The writing list
  preserves the published combined 1–2 and 7–9 groups and links to the official
  syllabus PDF.
- `/zh/generator`, because it has a Chinese interface and an English alternate.

### Do not index

- `/practice` and `/zh/practice`: interactive continuous-practice surfaces
  that support the indexed stroke-order hub and character guides. Keep them
  `noindex, follow` and out of the sitemap until they earn differentiated
  search intent beyond the existing stroke-order routes.
- `/worksheet/preview` and `/zh/worksheet/preview`: transient browser state,
  controlled with page-level `noindex` metadata and omitted from the sitemap.
- Untranslated Chinese marketing routes: use `noindex, follow` and omit them
  from the sitemap until the visible content is translated and differentiated.
- `/api/*`: block in `robots.txt`.
- Query-string combinations such as `?words=`, `?template=`, `?mode=`, and
  `?profile=`: never add them to the sitemap or IndexNow submissions.
  Generator state keys (`words`, `template`, `practiceSet`, `mode`, `profile`,
  `difficulty`, `auto`, `hskSystem`, `hskLevel`, `script`, `grid`, `resume`)
  explicitly emit `noindex, follow` on both `/generator` and `/zh/generator`.
  Stroke lookup state (`character`, `mode`) also emits `noindex, follow`.
  Key presence includes empty/repeated values and historical case variants.
  Canonicals continue to point to the query-free page; query values stay out
  of metadata. The query is preserved for editing rather than redirected away.
- Tracking-only parameters such as `utm_source`, `gclid`, `fbclid`, and `ref`
  do not disable indexing. Base generators and differentiated public content
  retain their existing indexing decisions. State-key rules are route-specific,
  not a global ban on every URL with a query string.
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
- Character detail: `LearningResource` and `BreadcrumbList`.
- `/shenzhen-in-chinese`: `LearningResource` and `BreadcrumbList`; keep common
  character senses distinct from claims about the place-name etymology.
- `/thank-you-in-chinese`: `LearningResource` and `BreadcrumbList`; describe
  the neutral-tone pronunciation of the second 谢 as the usual conversational reading.
- `/chinese-slang/niu-lai`: `Article` and `BreadcrumbList`. Keep the page's
  reviewed date and visible sources aligned with the markup; do not use
  `Movie` markup unless the site becomes a maintained film-data authority.
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
   `/shenzhen-in-chinese`, `/thank-you-in-chinese`, and `/zh/generator` return 200.
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

## Discovery file encoding and structure

- `/sitemap.xml` is served by `src/app/sitemap.xml/route.ts`, using the shared
  entry builder in `src/features/worksheets/sitemap.ts`.
- Use UTF-8 XML, an explicit charset, escaped XML values, and absolute URLs.
  Chinese path segments use percent encoding; this is URL encoding, not mojibake.
- Preserve reciprocal English/Chinese generator alternates. Keep transient,
  untranslated, and noindex routes out of the sitemap.
- Do not invent lastmod dates. Google ignores priority and changefreq.
  The optional priority field now describes editorial navigation tiers only:
  1.0 homepage, 0.9 core generators, 0.8 hubs/tools, 0.7 topic/detail pages.
  These values are not measured SEO authority or a Google ranking signal.
- A CSS processing instruction loads `/sitemap.css` for a numbered, responsive
  browser view of the XML. Source indentation alone does not fix browsers that
  render XML with XHTML alternates as unformatted text. Crawlers still receive
  the same XML for every user agent, without HTML content negotiation.
- Run `python scripts/sitemap-browser-check.py` against a local preview
  (defaults to port 4338; override `QA_BASE_URL`) to verify desktop/mobile layout.
- `/llms.txt` is an optional Markdown directory for other consumers, not a
  Google Search requirement or a crawler permission grant. `/llm.txt` is not
  maintained; use the plural filename.
- Production robots.txt can include Cloudflare-managed content before the app's
  rules. Local edits cannot remove that injected section. Review it separately
  in Cloudflare if crawler access policy needs to change.

References: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
and [Google AI optimization guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

## Sources and review scope

/sources owns vocabulary provenance, review scope, stroke/character boundaries and input-processing explanations. It is linked from the public footer and included in the sitemap.


## P1 stroke and HSK learning pages (2026-11-02)

- `/chinese-basic-strokes` owns stroke direction and common stroke families; `/chinese-stroke-order-mistakes` owns specific correction cases. General sequencing rules remain at `/chinese-stroke-order-rules`; character queries use `/stroke-order?character=...`.
- `/hsk/3-0-vs-2-0` owns edition selection and vocabulary counts; `/hsk/3-0-handwriting-requirements` owns the distinction between vocabulary, reading and writing lists. The existing official character browser remains `/hsk/3-0-writing-characters`.
- `/templates/hsk-3-0-level-1-writing` and `/templates/hsk-3-0-level-2-writing` each own a 30-word teaching selection from the November 2025 exam syllabus, divided into three editable ten-word sets. They do not claim full syllabus coverage or official mock questions.
- These six pages have fully translated English and Chinese main content, self canonicals, reciprocal en/zh/x-default alternates and both language URLs in the sitemap. Other untranslated Chinese routes keep their existing noindex policy.
- Editor query parameters and preview snapshots remain private workflow state; no new generator query URL or preview URL is submitted to the sitemap.
- The existing community vocabulary catalogue is retained and explicitly separated from the 2025 exam syllabus. Do not infer official exam counts from its 506 Level 1 rows.


## Automatic IndexNow notifications

Each push/merge to `main` starts `.github/workflows/indexnow.yml`. It waits for the successful `Workers Builds: gridhanzi` check on that exact commit, verifies the production ownership file, reads the live sitemap and submits its public URLs to Bing's IndexNow endpoint. The initial site has 160 sitemap URLs; each successful release submits the full current list, covering new and updated pages without maintaining a fragile changed-page cache. This does not detect deleted URLs or replace sitemap crawling.

- Ownership verification: root `public/indexnow-key.txt`, served unchanged as UTF-8 text at `/indexnow-key.txt`; no Cloudflare credential or private application key is reused. Keep this dedicated verification value stable.
- Submission runs in GitHub Actions after deployment, never in a visitor's browser. Only this repository's `main` can submit automatically. Forks and superseded commits skip.
- Sitemap URLs are deduplicated and restricted to `https://gridhanzi.org`; API, preview, practice-session, query and fragment URLs are excluded. Generator landing pages and the published Chinese learning pages remain eligible. Sitemap indexes are not supported by this initial script and fail explicitly if introduced later.
- Maximum 10,000 URLs per API batch. Network errors, HTTP 429 and server failures have bounded retries; invalid ownership or rejected payloads fail visibly.
- HTTP 200 means received; HTTP 202 means received with key validation pending. Neither confirms indexing or ranking. Other statuses are errors.
- The Actions summary and `indexnow-receipts-*` artifact retain results for 30 days. A failed IndexNow job does not roll back an otherwise successful website deployment.

Local commands from the repository root:

```powershell
pnpm.cmd test:indexnow
pnpm.cmd indexnow:check
```

The second command is read-only preflight against production. It checks the deployed key and sitemap and does not submit. Manual submission uses `pnpm.cmd indexnow:submit`; recovery can instead use GitHub → Actions → Submit production pages to IndexNow → Run workflow → main. Do not rerun a received submission just because the search index has not refreshed.

Protocol reference: https://www.indexnow.org/documentation
