# Taiwan Traditional optimization plan

## P0 — Scheme B foundation (implemented locally)

- Add one worksheet-level character standard: Simplified or Traditional (Taiwan).
- Use phrase-aware Taiwan conversion for input, templates, HSK, AI, local fallback, worksheets, flashcards, drafts, preview, print, and PDF capture.
- Preserve row IDs, Pinyin, English meanings, completion status, and legacy Simplified drafts.
- Apply `zh-Hant-TW` semantics and a Taiwan-first practice-font fallback stack.
- Keep the existing canonical generator routes; the `script` query is tool state, not a new indexable page.

## P1 — Taiwan learning layer

- Add an optional Pinyin / Zhuyin display mode after a verified pronunciation dataset is selected.
- Add TOCFL vocabulary selection alongside HSK, with source/version/provenance labels.
- Run a teacher-reviewed terminology pass for high-frequency Taiwan classroom and technology words.
- Add automated visual/PDF fixtures for `愛、學、體、臺` and explicit missing-stroke-data fallbacks.

## P2 — Regional expansion

- Add Hong Kong Traditional only as a separate standard, paired with Cantonese/Jyutping where supported.
- Create differentiated Taiwan acquisition pages only after Zhuyin/TOCFL content is substantial enough to avoid thin duplicates.
- Measure script selection, conversion edits, PDF completion, and retry/fallback rates before expanding the matrix.

## Product boundary

P0 provides Taiwan Traditional character forms, phrase-aware Taiwan word choices, and the existing Pinyin. It does not claim Taiwan pronunciation, Zhuyin, TOCFL alignment, or Taiwan Ministry of Education stroke-order certification.
