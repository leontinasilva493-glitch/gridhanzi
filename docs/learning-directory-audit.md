# Radical and pinyin content audit — 2026-11-10

## Scope and conclusions

Reviewed the full 214-heading radical reference, 30 radical lessons, 30 pinyin lessons, 409 reference spellings, and all 183 displayed lesson-example bindings (90 radical + 93 pinyin after adding 麻). Checked readings in their stated senses, example-family classification, visual-form instructions, worksheet handoff, metadata and contextual links. This is source-based editorial/software review, not independent teacher certification.

The original 60 details had distinct metadata and substantive teaching paragraphs. The material issue was that some radical headings inherited a general dictionary's word reading instead of a radical-specific reading. Several English labels also needed educational context. These were corrected without changing established lesson slugs or the Title/H1 format.

## Corrected heading choices

| Heading | Previous reading / label | Reviewed reading / label |
|---|---|---|
| 丨 (#2) | shù — line | gǔn — vertical line |
| 丶 (#3) | diǎn — dot | zhǔ — dot |
| 儿 (#10) | ér — legs | rén — legs; human form |
| 凵 (#17) | qiǎn — open box | kǎn — open box |
| 卜 (#25) | bo — divination | bǔ — divination |
| 厂 (#27) | chǎng — cliff | hǎn — cliff |
| 子 (#39) | zi — child | zǐ — child |
| 宀 (#40) | gài / mián — roof | mián — roof |
| 尢 (#43) | yóu — lame | wāng — bent-legged form |
| 干 (#51) | gàn — dry | gān — shield; dry |
| 广 (#53) | guǎng — dotted cliff | yǎn — shelter |
| 斗 (#68) | dòu — dipper | dǒu — dipper; measure |
| 疋 (#103) | pǐ — bolt of cloth | shū — foot (radical) |
| 艮 (#138) | gěn — stopping | gèn — stopping |
| 長 (#168) | zhǎng — long | cháng — long |
| 頁 (#181) | yè — leaf | yè — head (radical); page (word) |
| 鬲 (#193) | gé — cauldron | lì — ancient cooking vessel |
| 黽 (#205) | miǎn — frog | mǐn — frog form (radical) |

The 18 heading choices above do not mean every former reading is invalid in all contexts. Expanded notes distinguish word readings, stroke names and regional radical-table conventions. Twenty-three headings now have such notes, including 爿, 虫, 夕, 疒 and 隶. The glossary also clarifies 襾 as cover and 走 as walk with a historical run sense. Simplified and component aliases such as 门/門, 马/馬 and 攵/攴 are recognised; ambiguous 阝 and 月 shapes are not blindly reassigned.

## Other fixes

- ma now includes 妈 mā, 麻 má, 马 mǎ, 骂 mà and 吗 ma, giving an actual second-tone example as well as neutral tone. All five selected readings carry into the worksheet.
- 本 in the ben lesson is labelled as a book classifier, matching 一本书 in its exercise; 矮 is explicitly short in height. The ge articulation note adds a useful g/k contrast.
- Corrected the existing water-component guide: 氵 has two dots followed by a rising stroke. Removed instructions incorrectly calling its middle stroke rising and its lowest stroke falling.
- Character-to-pinyin links consider the lesson's actual examples as well as a character guide's default reading. 地 now links to both de and di; 都 can link to du even when its general guide starts with dōu.
- All 30 pinyin details now have links to related syllables chosen for initial/final/tone comparison. Radical details link to a published standalone radical-character guide when one exists.
- Empty radical queries no longer accidentally resolve to the first radical because an empty variant string matched.

## Sources and limits

- [MOE radical-reading table](https://dict.mini.moe.edu.tw/SearchIndex/RadicalsTable).
- [Hong Kong Education Bureau, radicals and components](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/second-lang/Radicals.pdf), Kangxi table on PDF pages 2–7. References differ in some regional or historical readings; they were compared rather than copied wholesale.
- [MOE 疋, shū versus pǐ](https://dict.revised.moe.edu.tw/dictView.jsp?ID=9068&la=0&powerMode=0).
- [MOE 艮, gèn versus gěn](https://dict.revised.moe.edu.tw/dictView.jsp?ID=4096&la=1&powerMode=0).
- [MOE 黽 radical reading](https://dict.revised.moe.edu.tw/dictView.jsp?ID=1474&la=0&powerMode=0) and [historical frog sense](https://dict.variants.moe.edu.tw/dictView.jsp?ID=78014).
- [MOE 頁 reading/sense history](https://dict.variants.moe.edu.tw/dictView.jsp?ID=-50182).
- Existing Unicode numbering, Make Me a Hanzi classification and Pinyin.info spelling-reference sources remain recorded in `public/data/README.txt` and the original directory review. Lesson senses deliberately retain qiē for cutting, dì for ground, dū for capital and neutral ma for the question particle.

## Actual HTTP graph and metadata audit

Scope: homepage, stroke-order hub, dictionary, 62 new learning routes, 150 character guides and four related component guides: **219 pages**. Count incoming links by distinct source page and separate body links from navigation/footer. This is a scoped audit, not a full-domain orphan census.

| Metric | Before | After (local production) |
|---|---:|---:|
| Detail pages | 60 | 60 |
| Maximum homepage click depth for details | 2 | 2 |
| Detail pages with zero incoming links | 0 | 0 |
| Detail pages linked only by navigation/footer | 0 | 0 |
| Duplicate Title / Description / H1 / canonical in 219 pages | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| Pinyin details without a character-guide body backlink | 2 (di, ji) | 1 (ji) |

The ji lesson has no example with a published standalone guide among the current 150; it uses explicitly labelled stroke lookup links and has hub/related-syllable links. It is reachable in two clicks and is not an orphan. No thin character pages were created solely to fill that gap.

The 180 substantive teaching sections remain exact-duplicate-free. Four-word shingles were also compared to identify near-copying; this is supporting evidence, not a prediction of search-engine quality classification. Shared navigation and worksheet instructions were excluded from this editorial-paragraph comparison.

## Verification and review links

- 351 unit tests, TypeScript and production build passed.
- HTTP checks confirmed 214 displayed radical readings/labels, 23 context notes, all five ma examples and the corrected water-component explanation.
- The existing 62-route HTTP suite passed for metadata uniqueness, sitemap inclusion, homepage/hub links, invalid 404s and noindex boundaries.
- Focused browser workflow passed for lookup, mobile width, contextual worksheet readings and preview persistence.
- Evidence: `artifacts/learning-audit/{before,local,live}-graph.json`, link CSVs, summary JSON, source snapshots and test/build logs; `artifacts/learning-hubs` retains focused browser and HTTP evidence.

Review [radicals](https://gridhanzi.org/radicals), [child radical](https://gridhanzi.org/radicals/child), [roof radical](https://gridhanzi.org/radicals/roof), [ma](https://gridhanzi.org/pinyin/ma), [di](https://gridhanzi.org/pinyin/di), and the [water component](https://gridhanzi.org/components/water-shui). The complete 60-detail URL inventory remains in [learning-directories-review.md](learning-directories-review.md).
