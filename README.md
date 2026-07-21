# GridHanzi MVP

GridHanzi turns English or Chinese vocabulary lists into editable, printable Chinese writing worksheets for teachers and parents at [gridhanzi.org](https://gridhanzi.org).

## MVP scope

Included routes:

- `/` - vocabulary entry and product explanation
- `/generator` - bilingual worksheet editor and live preview
- `/worksheet/preview` - direct PDF download and physical-print preview (`noindex`)
- `/stroke-order` - Hanzi Writer animation and practice
- `/templates` - searchable library of 20 teacher-ready templates
- `/templates/[slug]` - differentiated SEO landing page for every template
- `/api/worksheet/enrich` - local vocabulary enrichment with optional Gemini fallback

Explicitly excluded from the MVP: accounts, admin, payments, subscriptions, credits, API keys, invite codes, uploads, database-backed CMS pages, and pricing.

## Local development

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

The bundled HSK 1-2 plus curated teaching dictionary contains more than 1,300
offline entries and works without environment variables. Its source and MIT
attribution are documented in
`src/features/worksheets/VOCABULARY-LICENSE.md`. Copy `.env.example` to
`.env.local` only when analytics or Gemini enrichment is needed.

PDF files are generated in the browser with `html2canvas` and `jsPDF`; the
native Print action remains available for physical printers and copy controls.

## Verification

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

## Cloudflare deployment

The tracked `wrangler.jsonc` deploys the `gridhanzi` Worker and preserves the
shared `WORKSHEET_RATE_LIMITER` binding. For Cloudflare Workers Builds, connect
the GitHub repository with `/` as the root directory, leave the build command
empty, and use this deploy command:

```bash
pnpm exec vinext deploy
```

The repository pins pnpm 10.28.0. If the Cloudflare build form requests a
package-manager variable, set `PNPM_VERSION` to `10.28.0`. For a local deploy,
set `NEXT_PUBLIC_APP_URL` for production and run:

```bash
pnpm deploy
```

If Gemini enrichment is enabled, store the key as a Worker secret instead of committing it:

```bash
pnpm exec wrangler secret put GEMINI_API_KEY
```
