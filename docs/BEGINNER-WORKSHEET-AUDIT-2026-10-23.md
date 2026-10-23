# Beginner worksheet correction audit — 2026-10-23

## Scope and status

Local implementation only; not pushed or deployed. This is a targeted default
sense correction, not a teacher-certified or exhaustive HSK review.

## Reproduced issues

| Entry | Previous local default | Corrected standalone default |
| --- | --- | --- |
| 万 | wàn / used in 俟 | wàn / ten thousand; 10,000 |
| 几 | jī / small table | jǐ / how many; a few |
| 吗 | má / (coll.) what? | ma / yes/no question particle |
| 个 | gě / used in 自个儿 | gè / general classifier for people and things |
| 在 | zài / to exist; to be alive | zài / at; in; to be located at |

Exact-entry overlays are shared by templates, HSK catalogue and local enrichment.
Explicit worksheet edits survive snapshot serialization and normalization.
Compound words are not changed by substring replacement.

## Export finding

The pinned external Hanzi Writer data source can time out after five seconds.
The UI permits a degraded worksheet and warns that stroke guides are missing.
This can change pagination, so a page-count match alone is not acceptance.
The pack-generation script now retries failed guides up to three times and
refuses to replace a PDF if guides remain unavailable. Live dynamic exports
retain the existing warning and fallback behavior.

## Analytics

Download events now use effective preview settings (including changed paper
size), rather than stale snapshot settings. Preview-open is a navigation action,
not proof of completed rendering. Static-pack clicks are not saved-file success.
No live GA4 delivery or attribution was verified in this run.

## Checks

- Unit tests: 329 passed (release review rerun).
- TypeScript: passed.
- Production build: passed.
- Browser suite: 47/48 initially; remaining case selected two status messages.
  Narrowed the assertion to the draft-removal message; targeted rerun 1/1 passed.
- PDF evidence and browser logs: artifacts/p0/ (local, ignored).

## Remaining work

- Full sourced item-by-item HSK 1, School and Greetings review.
- Public source/license/data-processing explanation based on actual implementation.
- Live crawl/indexing and GA4 checks after account/resource confirmation where needed.
- Real teacher/parent task studies and consented public examples.
- Production acceptance after separately authorized release.

The full Family pack exposed the fixed 60-second overall export deadline.
Exports now receive max(60 seconds, 8 seconds per page), capped at 180 seconds.
Per-stage timeouts and cancellation remain intact. This is not a speed claim.

Final six-pack check: Numbers 5/5 pages, Family 16/16, First Characters 7/7 (A4/Letter). All match complete-stroke browser previews. First/last PDF pages rendered for visual review. Final teaching-sense focused tests: 7/7. Post-deadline-change PDF browser tests: 3/3.
