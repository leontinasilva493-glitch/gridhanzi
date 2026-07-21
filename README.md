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

Copy `wrangler.example.jsonc` to `wrangler.jsonc`, choose a unique Worker name, set `NEXT_PUBLIC_APP_URL` for production, then run:

```bash
pnpm deploy
```

If Gemini enrichment is enabled, store the key as a Worker secret instead of committing it:

```bash
pnpm exec wrangler secret put GEMINI_API_KEY
```
