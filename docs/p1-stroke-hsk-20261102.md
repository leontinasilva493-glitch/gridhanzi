# P1 stroke and HSK implementation acceptance — 2026-11-02

Local review branch: `feat/p1-stroke-hsk-20261102`. The acceptance results below were captured before commit, push, PR or deployment. Release status must be verified separately against GitHub and Cloudflare.

## Delivered in priority order

1. `/templates/hsk-3-0-level-1-writing`: 30 selected official Level 1 vocabulary entries, three ten-word groups.
2. `/chinese-basic-strokes`: eight illustrated stroke families, directions, character lookup and worksheet handoff.
3. `/chinese-stroke-order-mistakes`: ten specific correction cases, character lookup and worksheet handoff. Not a measured ranking of user errors.
4. `/hsk/3-0-vs-2-0`: separates classic HSK, the 2021 standard, the 2025 exam syllabus and the retained community catalogue.
5. `/hsk/3-0-handwriting-requirements`: separates vocabulary, reading and writing lists; preserves official combined writing groups.
6. `/templates/hsk-3-0-level-2-writing`: 30 selected entries introduced at Level 2, three ten-word groups.

All six have English and Chinese content, reciprocal language metadata and sitemap entries. Existing stroke, HSK and template hubs link to them. No new popups, accounts, grading, progress tracking or backend services.

## Source verification

- Official November 2025 exam syllabus: https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf
- PDF SHA-256: `d8b6646599bc9a0c9616a4cb06d4b37461f8792f70a3171016d00fcd8eda09ad`.
- Beginner vocabulary: printed pages 77–89, physical PDF pages 80–92; sequential entries 1–500. Level 1: 300; Level 2: 200 additional, 500 cumulative. Retained source row numbers, Pinyin and physical PDF page references in `hsk-2025-beginner-source.json`.
- Reproduction: extract PDF text with pypdf using `---PDF PAGE N---` boundaries, then run `node scripts/extract-hsk-beginner-source.mjs artifacts/p1-research/official-hsk-2025.txt artifacts/p1-research/official-hsk-2025.pdf` from the repository root. Downloaded research files are ignored local evidence, not bundled website assets.
- All 60 selected words checked against the exact level and source Pinyin. English cues are teaching glosses, not official translations. These selections are not complete levels or the official writing-character inventory.
- Existing community catalogue retained, with explicit source/version notices. Its 506 Level 1 rows are not presented as the current exam count.
- Corrected existing writing source metadata: printed 374–381 corresponds to physical PDF 377–384. Writing groups remain unchanged: 100,150,150,150,150,500 = 1,200.
- Current CTI launch notice: https://old.chinesetest.cn/gonewcontent.do?flag=kdnew&id=51336883. Exam December 13, 2026; registration closes 24:00 Beijing Time November 16 (paper) / December 3 (computer).
- Stroke illustration source/scope: https://github.com/chanind/hanzi-writer-data. Diagrams are original directional teaching illustrations, not normative calligraphy samples.

## Verification

- `pnpm.cmd test`: 333 passed, zero failed.
- `pnpm.cmd exec tsc --noEmit --incremental false`: passed.
- `pnpm.cmd build`: passed, fresh Vinext production server at `http://127.0.0.1:4339`.
- `pnpm.cmd test:browser`: 48/48 existing regression scenarios passed. Includes storage failures, export retry, editor/preview round trips and mobile behavior.
- `node scripts/p1-content-regression.mjs`: 14 page/flow checks passed. Twelve bilingual pages checked for HTTP 200, one H1, self canonical, Chinese alternates, valid JSON-LD and no viewport overflow; group switching and ten-word membership verified. Also tested invalid group 404, Level 2 travel → quiz → real PDF → editor resume, and Level 1 people → stroke-guided preview. Paid enrichment deliberately unavailable in QA.
- Manually inspected desktop stroke illustration layout, 375px Chinese template layout and generated A4 quiz PDF. Found and fixed an overlong print title, rebuilt and reran P1 flows; corrected PDF title is fully visible.
- Evidence: ignored `artifacts/p1-unit.log`, `artifacts/p1-build.log`, `artifacts/p1-browser.log`, `artifacts/p1-content/results.json`, screenshots and `hsk-level-2-travel-quiz.pdf`.
- Scope limits: local Chromium and generated PDF checked; no physical printer or real mobile device test. No production release or search indexing claim.

## Repeat browser checks (PowerShell, repository root)

Use a fresh production build and `pnpm.cmd start --host 127.0.0.1 --port 4339`, then in a second terminal:

```powershell
$env:PLAYWRIGHT_MODULE='C:\Users\胡天天\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\playwright'
$env:QA_BASE_URL='http://127.0.0.1:4339'
pnpm.cmd test:browser
node scripts/p1-content-regression.mjs
```

Success: `48/48 browser scenarios passed` and `PASS 14 P1 page and handoff checks`.


## Review refinement (2026-11-02)

- Shortened four English guide search titles (including brand: at most 60 characters) and descriptions (at most 160). Preserved descriptive on-page H1s and Chinese metadata.
- Replaced the identical three-guide footer list with one contextual link inside the relevant explanation and one reasoned next-step recommendation per guide. Stroke pages lead to movement/order/correction resources; HSK pages lead to edition, exam or writing-range resources.
- Level 1 now has group-specific recognition prompts with optional reveal explanations before copying. Level 2 has group-specific word contrasts and full-word recall tasks. Modules follow the selected ten-word group and link to the appropriate trace/quiz editor mode. No grading or stored answers.
- Practice-pack related links explain when to move up, review an earlier level or consult the official writing range; edition selection is linked beside the source/version notice.
- Fresh checks: 333 unit tests passed; TypeScript and production build passed; P1 browser script passed all 14 page/flow checks, including concise rendered metadata, contextual links, mobile width, lesson switching, answer reveal and correct group/mode handoff. Inspected 375px screenshots of both new teaching modules.
- Existing browser regression rerun after the refinement: 48/48 scenarios passed (`artifacts/p1-review-browser.log`).
- Review URLs remain local at `http://127.0.0.1:4339`; add `/zh` before each path to inspect Chinese. No GitHub or production write.
