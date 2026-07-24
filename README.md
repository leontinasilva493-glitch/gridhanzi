# GridHanzi

GridHanzi turns English or Chinese vocabulary lists into editable, printable
Chinese writing worksheets for teachers, parents, and learners at
[gridhanzi.org](https://gridhanzi.org).

## What This Project Is

The app helps users paste a vocabulary list, review Hanzi, Pinyin, and English
meanings, choose writing grids and practice modes, then print or download a
worksheet PDF. It is built as a public acquisition site plus a usable worksheet
generator, not as an account-based SaaS dashboard.

## Product Scope

Included routes:

- `/` - vocabulary entry and product explanation.
- `/generator` - bilingual worksheet editor and live preview.
- `/worksheet/preview` - direct PDF download and physical-print preview
  (`noindex`).
- `/stroke-order` - Hanzi Writer animation and practice.
- `/stroke-order/[character]` - curated single-character stroke-order pages.
- `/templates` - searchable library of 20 teacher-ready templates.
- `/templates/[slug]` - differentiated SEO landing page for every template.
- `/for-teachers` - teacher workflow and classroom use cases.
- `/zh/generator` - Chinese-language generator route.
- `/api/worksheet/enrich` - local vocabulary enrichment with optional Gemini
  fallback.

Explicitly excluded from the MVP: accounts, admin, payments, subscriptions,
credits, API keys, invite codes, uploads, database-backed CMS pages, and
pricing.

## Tech Stack

- Next.js App Router through Vinext.
- React 19.
- TypeScript.
- Tailwind CSS.
- Hanzi Writer for stroke-order animation.
- `html2canvas-pro` and `jsPDF` for browser PDF output.
- Cloudflare Workers deployment through `wrangler` and `vinext`.

## Local Development

Install dependencies:

```bash
pnpm install
```

Run the local dev server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

The bundled HSK 1-2 plus curated teaching dictionary contains more than 1,300
offline entries and works without environment variables. Its source and MIT
attribution are documented in
`src/features/worksheets/VOCABULARY-LICENSE.md`.

Copy `.env.example` to `.env.local` only when analytics or Gemini enrichment is
needed.

## Verification

Run these checks before committing or deploying:

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

The latest verified run passed:

- `pnpm test` - 106 tests passed.
- `pnpm exec tsc --noEmit` - passed.
- `pnpm build` - passed.

Public indexing rules, route keyword ownership, metadata requirements,
performance budgets, and the post-deploy Search Console checklist are
documented in [`docs/SEO.md`](docs/SEO.md).

## Deployment

Production:

```text
https://gridhanzi.org
```

GitHub:

```text
https://github.com/leontinasilva493-glitch/gridhanzi
```

Cloudflare Worker:

```text
gridhanzi
```

The tracked `wrangler.jsonc` deploys the `gridhanzi` Worker and preserves the
shared `WORKSHEET_RATE_LIMITER` binding.

For Cloudflare Workers Builds, connect the GitHub repository with `/` as the
root directory, leave the build command empty, and use this deploy command:

```bash
pnpm exec vinext deploy
```

The repository pins pnpm 10.28.0. If the Cloudflare build form requests a
package-manager variable, set `PNPM_VERSION` to `10.28.0`.

For a local deploy, set `NEXT_PUBLIC_APP_URL` for production and run:

```bash
pnpm deploy
```

If Gemini enrichment is enabled, store the key as a Worker secret instead of
committing it:

```bash
pnpm exec wrangler secret put GEMINI_API_KEY
```

## Environment Variables

Public app settings:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_DESCRIPTION`
- `NEXT_PUBLIC_APP_LOGO`
- `NEXT_PUBLIC_DEFAULT_LOCALE`

Analytics:

- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
- `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `NEXT_PUBLIC_PLAUSIBLE_SRC`

Worksheet enrichment:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `WORKSHEET_MIN_INTERVAL_MS`

## Recent Changes

### 2026-07-24

- Optimized P0 SEO surfaces without adding duplicate keyword pages.
- Strengthened `/generator` for the `chinese worksheet generator` intent.
- Added `/generator` WebApplication and FAQ structured data.
- Added visible generator workflow, settings, examples, and FAQ sections.
- Strengthened `/templates` with a `Chinese Character Practice Sheet
  Templates` section.
- Changed template cards so the primary CTA opens the editable generator.
- Added a homepage three-step practice sheet workflow section.
- Added Microsoft Clarity analytics support.
- Commit pushed to `origin/main`:
  `0abef4f feat: optimize worksheet SEO and analytics`.

### 2026-07-22 to 2026-07-23

- Adopted the red-gold GridHanzi brand identity.
- Published curated stroke-order character pages.
- Reduced heavy SVG output on listing pages.
- Documented SEO route ownership, indexing policy, performance budgets, and
  release checks in `docs/SEO.md`.

## SEO Ownership

Each public route owns one primary search intent:

| Route | Primary search intent |
| --- | --- |
| `/` | Chinese Character Practice Sheet Generator |
| `/generator` | Chinese Worksheet Generator |
| `/templates` | Printable Chinese Writing Worksheets |
| `/templates/[slug]` | `[Topic] Chinese Writing Worksheet` |
| `/stroke-order` | Chinese Stroke Order |
| `/for-teachers` | Chinese Worksheets for Teachers |
| `/zh/generator` | 中文生成器 |

Do not create duplicate keyword paths such as
`/chinese-character-practice-sheet-generator` or
`/chinese-worksheet-generator`. New SEO pages should be useful, indexable only
when differentiated, and validated with Search Console data over a 28-day
window.
