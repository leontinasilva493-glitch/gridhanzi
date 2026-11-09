# Generator Worker resource regression

## Incident and diagnosis (2026-11-09)

Production generator requests intermittently returned HTTP 503 with Cloudflare Error
1102 (`Worker exceeded resource limits`). A later small serial check also reproduced
1102 on `/generator` without query parameters, so this was not confined to a bad
query string or to the parallel audit. Error 1102 can indicate CPU or memory limits.
The authenticated production log connection was unavailable during diagnosis; do
not claim a measured production CPU/memory breakdown or a specific account limit.

The production build reproduced a concrete source of unnecessary request work:
React server-rendered the entire interactive editor, its desktop and mobile row
layouts, paper pagination, and hundreds of SVG cells. That UI must then hydrate in
the browser and restore browser-local state. A preview-only deferral still produced
203-246 KB template responses, so it did not remove enough request work.

## Change

`GeneratorClient` now server-renders the existing page shell, introduction, workflow,
FAQ, and related links, then mounts the original editor after hydration. The editor
receives the same initial entries and settings. The worksheet renderer, draft
handling, enrichment, preview navigation, and PDF export code paths are unchanged.
No Worker limits, bindings, plan, or analytics configuration changed.

The loading text is localized, contains a JavaScript fallback, and does not create
an automatic popup. Metadata and structured data remain in their existing routes.

## Production-build comparison

Same baseline commit and request matrix, local production Worker bundle:

| Route | Before bytes / SVGs | After bytes / SVGs |
| --- | ---: | ---: |
| `/generator` | 146146 / 146 | 57994 / 19 |
| `/generator?template=pinyin-practice` | 235622 / 237 | 59695 / 19 |
| `/generator?template=hsk-3-campus-life&profile=adult` | 265411 / 294 | 59792 / 19 |
| `/zh/generator` | 144784 / 146 | 56666 / 19 |
| `/generator?words=去` | 93915 / 59 | 57669 / 19 |
| `/generator?script=traditional-tw&template=family` | 288446 / 306 | 60367 / 19 |

The final warm local request matrix took approximately 6-9 ms wall time, versus
9-32 ms before. Local wall time is not Cloudflare CPU time. Raw CPU profiles and
measurements are retained in ignored `artifacts/generator-1102/`.

## Regression checks

Run unit tests, IndexNow tests, TypeScript, and production build. Start a fresh
production server and run `pnpm test:browser`. The new English/Chinese scenarios
assert a full template's server response stays under 80 KB and 24 SVGs, useful
public content remains in HTML, the browser receives the correct initial list,
and edits appear in the live preview. Existing cases cover storage denial,
restoration, enrichment, preview round trips, and actual PDF downloads.

## Release validation

Use the existing GitHub main -> Cloudflare Workers Builds integration. Verify the
build for the exact merged commit and then repeat generator requests on the formal
domain, including baseline English/Chinese, words, templates, HSK, and Traditional
parameters. Record each status and Error 1102 occurrence. Verify a production
browser editing -> full preview -> downloaded PDF flow as well. A finite successful
check establishes the observed release state, not a guarantee against every future
resource event.

## PDF visual acceptance follow-up

Live editor -> preview -> PDF acceptance exposed a separate capture-layout failure:
the visible source grid had `display:grid`, while html2canvas's temporary document
had no external stylesheets and resolved the same cell to `inline` and its row to
`block`. Downloads were valid PDF files but their page layout was wrong. A direct
preview test with cached styles did not expose this, which is why file-download
success alone is insufficient.

The existing computed-style freezing used for flashcards now applies to worksheet
capture clones too. Screen preview and pagination stay unchanged. English desktop
and Chinese mobile regression cases deliberately disable cloned stylesheet links,
then assert that the capture grid retains copied inline styles and a PDF downloads.
Retain visual checks of the downloaded pages after production rollout.
