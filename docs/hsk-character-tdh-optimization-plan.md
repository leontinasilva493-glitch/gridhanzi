# Hanzi Character TDH Optimization Plan

## Goal

Make every published character route expose character-specific Title, meta Description, H1, and supporting headings. Preserve the existing publication/indexability gates and content evidence boundaries.

## Global constraints

- Scope is the 18 published guides: 的、一、是、在、了、我、你、人、来、去、说、学、经、体、议、爱、年、佛.
- Every SEO title must contain the character, Pinyin, and `Stroke Order`.
- Every meta description must contain the character and Pinyin and explain a character-specific meaning, usage, reading, component, or word-family anchor.
- Every H1 must contain the character and Pinyin and state the page-specific learning intent.
- Keep titles concise enough that the root ` | GridHanzi` suffix does not turn the title into a generic or heavily truncated result; do not enforce an artificial pixel guarantee.
- Route metadata must keep Title and Description aligned across standard metadata, Open Graph, and Twitter.
- English pages remain indexable; untranslated Chinese character pages remain `noindex, follow` and retain their canonical behavior.
- Do not change HSK evidence, character facts, sitemap inclusion, publication status, route scope, or unrelated UI.
- Follow TDD: record focused RED before production changes, then GREEN.

## Approved TDH copy

| Character | Title | H1 | Description |
| --- | --- | --- | --- |
| 的 | 的 (de) Stroke Order, Meaning & Grammar | How to Write 的 (de): Stroke Order, Meaning & Usage | Learn how to write 的 (de), the common possessive and descriptive particle. See its 8 strokes, neutral-tone usage, example words, sentences, and worksheet practice. |
| 一 | 一 (yī) Stroke Order, Meaning & Tone Changes | How to Write 一 (yī): Stroke Order and Tone Changes | Learn how to write 一 (yī), meaning “one.” Follow its single stroke and understand when yī changes to yí or yì in common words and sentences. |
| 是 | 是 (shì) Stroke Order, Meaning & Usage | How to Write 是 (shì): Stroke Order, Meaning & Usage | Learn how to write 是 (shì), meaning “to be” or “correct.” See its 9 strokes and learn identity, question and negation patterns with examples. |
| 在 | 在 (zài) Stroke Order, Meaning & Grammar | How to Write 在 (zài): Location and Ongoing Actions | Learn how to write 在 (zài) and use it for location and ongoing actions. Follow its 6 strokes and practise common grammar patterns and sentences. |
| 了 | 了 (le) Stroke Order, Meaning & Grammar | How to Write 了 (le): Stroke Order and Two Core Uses | Learn how to write 了 (le) and use it for completed actions and changes of state. See its 2 strokes, example sentences and common learner mistakes. |
| 我 | 我 (wǒ) Stroke Order, Meaning & Examples | How to Write 我 (wǒ): Stroke Order, Meaning & Examples | Learn how to write 我 (wǒ), meaning “I” or “me.” Follow its 7 strokes and practise first-person phrases, sentences and printable writing grids. |
| 你 | 你 (nǐ) Stroke Order, Meaning & Examples | How to Write 你 (nǐ): Stroke Order, Meaning & Examples | Learn how to write 你 (nǐ), meaning “you.” See its 7-stroke structure and practise 你好, 你们 and other useful phrases and sentences. |
| 人 | 人 (rén) Stroke Order, Meaning & Examples | How to Write 人 (rén): Stroke Order, Meaning & Examples | Learn how to write 人 (rén), meaning “person” or “people.” Follow its 2 strokes, compare 人 with 入, and practise common words and sentences. |
| 来 | 来 (lái) Stroke Order, Meaning & Direction | How to Write 来 (lái): Stroke Order and Directional Use | Learn how to write 来 (lái), meaning “to come.” Follow its 7 strokes and understand movement toward a speaker or reference point by comparing 来 and 去. |
| 去 | 去 (qù) Stroke Order, Meaning & Direction | How to Write 去 (qù): Stroke Order and Directional Use | Learn how to write 去 (qù), meaning “to go.” See its 5 strokes and understand movement away from a reference point through words and sentences. |
| 说 | 说 (shuō) Stroke Order, Meaning & Readings | How to Write 说 (shuō): Stroke Order, Usage & Readings | Learn how to write 说 (shuō), meaning “to say” or “speak.” See its 9 strokes, everyday speech patterns and the alternate shuì reading in 说服. |
| 学 | 学 (xué) Stroke Order, Meaning & Examples | How to Write 学 (xué): Stroke Order, Meaning & Word Family | Learn how to write 学 (xué), meaning “learn” or “study.” Explore its structure and practise useful words including 学生, 学校 and 学习. |
| 经 | 经 (jīng) Stroke Order, Meaning & Common Words | How to Write 经 (jīng): Stroke Order and Common Words | Learn how to write 经 (jīng) through 已经, 经常, 经过 and 经验. See its 8 strokes, 纟 + 𢀖 structure and example sentences. |
| 体 | 体 (tǐ) Stroke Order, Meaning & Common Words | How to Write 体 (tǐ): Stroke Order and Common Words | Learn how to write 体 (tǐ) through 身体, 体育, 体重 and 整体. Follow its 7 strokes and compare its 亻 + 本 structure with 休. |
| 议 | 议 (yì) Stroke Order, Meaning & Common Words | How to Write 议 (yì): Stroke Order and Discussion Words | Learn how to write 议 (yì) through 会议, 建议, 议论 and 议题. See its 5 strokes, 讠 + 义 structure and meeting-related examples. |
| 爱 | 爱 (ài) Stroke Order, Meaning & Examples | How to Write 爱 (ài): Stroke Order, Meaning & Examples | Learn how to write 爱 (ài), meaning “to love” or “like.” Follow its 10 strokes and practise common words, graded sentences and printable grids. |
| 年 | 年 (nián) Stroke Order, Meaning & Examples | How to Write 年 (nián): Stroke Order, Meaning & Examples | Learn how to write 年 (nián), meaning “year.” Follow its 6 strokes and practise calendar words such as 今年, 明年 and 去年. |
| 佛 | 佛 (fó/fú) Stroke Order, Meaning & Readings | How to Write 佛 (fó/fú): Stroke Order and Readings | Learn how to write 佛 and distinguish fó in Buddhist vocabulary from fú in 仿佛. See its 7 strokes, components, example words and sentences. |

## Task 1 — P0 regression contracts

Own only `src/features/worksheets/stroke-order-characters.test.ts` and `src/features/worksheets/seo.test.ts`.

- Add table-driven tests using hand-checked literal expectations for all 18 approved Title, Description, and H1 values.
- Add contract checks that each published Title contains its character, Pinyin, and `Stroke Order`; Description contains its character and Pinyin; H1 contains its character and Pinyin.
- Add route metadata expectations for standard, Open Graph, and Twitter Title/Description while preserving canonical/noindex behavior.
- Run focused tests and record expected RED failures before production changes.

## Task 2 — P1 character-specific TDH data

Own only `src/features/worksheets/stroke-order-characters.ts`.

- Extend `seo` with required `h1`.
- Apply the approved Title, Description, and H1 copy verbatim to all 18 published entries.
- Keep all teaching facts, HSK evidence, examples, tiers, publication status, relationships, and sitemap behavior unchanged.
- Run the focused character tests and TypeScript check.

## Task 3 — P1/P2 page metadata and headings

Own only `src/app/[locale]/stroke-order/[character]/page.tsx` and `src/features/worksheets/components/stroke-order-character-page.tsx`.

- Render `entry.seo.h1` as the sole H1.
- Keep character styling without reconstructing generic H1 prose.
- Add page-specific Twitter Title/Description aligned with standard and Open Graph metadata.
- Make generic supporting headings naturally character-specific: pronunciation, common writing mistake, and related guides. Avoid keyword stuffing and retain one H1.
- Run focused SEO/presentation tests and TypeScript check.

## Task 4 — Integration verification

- Run the full test suite, TypeScript, and production build.
- Start the production preview and inspect all 18 routes.
- Assert HTTP 200; one H1; Title/Description/H1 contain the route character; standard/OG/Twitter metadata match the approved copy; no console/page errors; no desktop or 390px mobile overflow on representative pages.
- List all modified page links for review.
