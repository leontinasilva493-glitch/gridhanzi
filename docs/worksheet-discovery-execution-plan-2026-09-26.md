# Worksheet discovery and indexing execution plan

Date: 2026-09-26. Work branch: `research/hanzistroke-worksheet-study`.

## Goal and page ownership

- `/` and `/generator`: make a worksheet from the visitor's own words.
- `/templates`: find and download a finished worksheet or open an editable template. Keep its URL, Title, Description, and H1.
- `/templates/[slug]`: explain a specific word set and offer a full preview, a PDF when a checked pack exists, and editing.
- `/grids`: blank writing paper. `/hsk`: version-specific vocabulary. `/stroke-order`: character lookup and curated writing guides.
- Do not create a second `/worksheets` hub or mass-merge HSK and character pages from keyword variants alone.

## Evidence available now

The owner's `gridhanzi.org-Coverage-Valid-2026-09-26/表格.csv` contains 49 URLs listed as indexed. On 2026-09-26, the live sitemap contained 127 canonical URLs. After percent-decoding paths and normalizing trailing slashes, all 49 indexed URLs appeared in the sitemap, leaving 78 current sitemap URLs absent from that indexed export:

| Current sitemap section | URLs absent from indexed export |
| --- | ---: |
| Template details | 30 |
| Stroke-order character guides | 18 |
| Versioned HSK levels | 12 |
| Grid-paper hub and details | 4 |
| Component detail guides | 6 |
| Other public pages | 8 |

The 78-URL difference happens to equal the separately reported totals of 76 "Discovered - currently not indexed" and 2 "Crawled - currently not indexed." The status of any individual URL cannot be assigned from those totals. The indexed export also has no query, click, impression, or non-indexed-reason columns.

The complete URL-level difference is recorded in [indexing-gap-2026-09-26.md](./indexing-gap-2026-09-26.md).

Priority examples absent from the indexed export: `/grids`, all three `/grids/[slug]` pages, `/templates/chinese-first-characters`, `/templates/numbers`, `/templates/hsk-1`, `/stroke-order/爱`, and several HSK 2.0/3.0 level pages. The indexed export does include `/`, `/generator`, `/templates`, `/stroke-order`, `/hsk`, and `/templates/family`.

Live spot checks returned HTTP 200 and a self-referencing canonical, with no `robots` noindex meta tag, for `/grids`, `/grids/blank`, `/grids/tian-zi-ge`, `/templates/chinese-first-characters`, `/templates/numbers`, `/templates/hsk-1`, and `/hsk/2-0/level-1`. These checks do not establish Googlebot's last crawl, canonical choice, or indexing reason.

## Ordered work

1. **Current iteration:** Separate template preview from editing; put three clear routes on `/templates`; provide checked A4 and US Letter starter PDFs for first characters, numbers, and family; link blank-paper visitors back to filled worksheets. Keep existing SEO-bearing titles, paths, and canonical behavior.
2. **Indexing diagnosis:** Obtain the affected-URL export for "Discovered - currently not indexed" and the Search performance query-by-page export. Match each URL to this sitemap difference. Use URL Inspection on the important current pages, then inspect crawl statistics and any observed server errors. Fix only demonstrated technical or discovery gaps.
3. **Stroke-order discovery:** Retain the existing `Chinese Stroke Order` Title/H1 and curated character titles. Review the query-to-page distribution, then add relevant contextual links only where a useful path is actually missing. The homepage already links to `/stroke-order`, and that hub links to its published guides.
4. **HSK and expansion:** Evaluate same-query overlap and content similarity before any merge, redirect, or new page. Pinyin syllable directories are a separate product decision from single-character stroke-order pages.
5. **Distribution:** Share complete, checked resources with relevant education directories or communities after the assets are ready. Link counts and third-party difficulty scores are comparison signals, not delivery quotas.

## Acceptance and measurement

- Preview shows the complete selected template without replacing an existing user draft. Editing opens that template in the generator. Fixed-pack PDF links point to real A4 and US Letter files.
- Every PDF is checked for accurate Hanzi, Pinyin, stroke guides, page breaks, readable print size, and filename. Keep a full-page visual review for each pack and format.
- Compare two non-overlapping 28-day periods, segmenting Google non-brand worksheet/stroke-order queries and ChatGPT referrals. Track dynamic PDF export success separately from fixed-PDF link clicks; a click alone does not prove file save.
- Important current pages should be indexed or have a specific, documented reason and next action. Do not chase 100% indexing of all known URLs.

## Regenerating the six checked PDF assets

From this worktree, run `pnpm.cmd build`, then `pnpm.cmd start --port 4340` in a separate terminal. Set `PLAYWRIGHT_MODULE` to an installed Playwright package if it is not available in the project, and run `node scripts/generate-ready-to-print-pdfs.mjs`. The script downloads A4 and US Letter versions of the three packs from the app's actual print preview into `public/downloads/worksheets/`. Rebuild after regeneration so the production preview serves the new static files. The script creates the assets; visual and vocabulary checks remain a separate release step.

## Required data for URL-specific changes

The owner-provided indexed CSV supports a priority list. It does not support deleting any of the 78 URLs, assigning them to the 76 discovered group, or diagnosing HSK keyword cannibalization. Get the non-indexed affected-URL export and query-by-page performance data before those decisions.
