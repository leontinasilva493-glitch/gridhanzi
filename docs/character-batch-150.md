# Daily-life character guides: 126 to 150

## Selection and source boundaries

Reviewed 2026-11-09. These 24 additions cover time, location, movement, transport, and shopping. They complete useful contrasts and word families alongside the existing 126 guides. Selection uses overseas teaching relevance, not measured search volume or keyword difficulty. No popularity ranking or institutional endorsement is claimed.

Primary vocabulary evidence: the University of Manchester Confucius Institute's [HSK resource directory](https://www.confuciusinstitute.manchester.ac.uk/study/testing/hsk/hsk-learning-resources/) and its published PDFs:

- [HSK 1 vocabulary](https://hummedia.manchester.ac.uk/schools/salc/centres/confucius/hsk/vocabularylists/hsk-level-1-vocabulary-list.pdf)
- [HSK 2 vocabulary](https://hummedia.manchester.ac.uk/schools/salc/centres/confucius/hsk/vocabularylists/hsk-level-2-vocabulary-list.pdf)
- [HSK 3 vocabulary](https://hummedia.manchester.ac.uk/schools/salc/centres/confucius/hsk/vocabularylists/hsk-level-3-vocabulary-list.pdf)

These are the older six-level HSK 2.0 resources, not the new HSK 3.0 syllabus. Each source word also matches the local HSK 2.0 catalogue. Compound evidence is labelled word-family, not a standalone character-level assignment. For 站, use the standalone HSK 3 entry: the university and local catalogue disagree about the level of 火车站, so that compound is not used to assign this guide's HSK level.

Shape/radical cross-check: [Make Me a Hanzi dictionary](https://github.com/skishore/makemeahanzi/blob/master/dictionary.txt). Stroke counts were checked against all 24 actual [Hanzi Writer 2.0.1 data files](https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/), including equal stroke/median counts; individual asset hashes are retained in local release evidence. Readings and meanings were chosen for the stated context rather than using the first dictionary sense.

| Character | Default reading | Source word | PDF level | Strokes |
|---|---|---|---:|---:|
| 今 | jīn | 今天 | 1 | 4 |
| 明 | míng | 明天 | 1 | 8 |
| 昨 | zuó | 昨天 | 1 | 9 |
| 时 | shí | 时候 | 1 | 7 |
| 分 | fēn | 分钟 | 1 | 4 |
| 点 | diǎn | 点 | 1 | 9 |
| 前 | qián | 前面 | 1 | 9 |
| 后 | hòu | 后面 | 1 | 6 |
| 里 | lǐ | 里 | 1 | 7 |
| 外 | wài | 外 | 2 | 5 |
| 左 | zuǒ | 左边 | 2 | 5 |
| 右 | yòu | 右边 | 2 | 5 |
| 开 | kāi | 开 | 1 | 4 |
| 关 | guān | 关 | 3 | 6 |
| 回 | huí | 回 | 1 | 6 |
| 出 | chū | 出 | 2 | 5 |
| 进 | jìn | 进 | 2 | 7 |
| 走 | zǒu | 走 | 2 | 7 |
| 坐 | zuò | 坐 | 1 | 7 |
| 站 | zhàn | 站 | 3 | 10 |
| 买 | mǎi | 买 | 1 | 6 |
| 卖 | mài | 卖 | 2 | 8 |
| 钱 | qián | 钱 | 1 | 10 |
| 本 | běn | 本 | 1 | 5 |

## Content review

- Each addition has its own learning reason, visual-form explanation, reading note, usage explanation, writing tip, contrast, four example words/phrases and three original sentences. No invented etymologies are used to explain the visible shapes.
- Repeated usage and mistake sections are omitted. Descriptions highlight the actual character's form or usage; Title and H1 keep the established consistent format.
- Explicit boundaries: 分 fēn/fèn; 买 mǎi versus 卖 mài; 今 jīn versus 进 jìn; 后 uses 後 for after/behind but 后 for queen; 里 uses 裡/裏 for inside but unchanged 里 for distance.
- 左 and 右 have different opening stroke order; 回 closes the outer enclosure last; 本 adds its short lower line after the 木-shaped strokes.
- No independent teacher sign-off or promise of search-engine indexing is claimed.

## Internal links and keyword roles

The HTTP audit checks the homepage, stroke-order hub, dictionary, generator, grids hub, templates hub, Thank You article, School Classroom template, Greetings template, and every published character guide. It is a scoped graph, not a whole-domain orphan census. Indegree counts distinct source pages; navigation/footer links are separated from body links. Depth is the shortest path from the homepage within this graph.

| Metric | Before | After, local production |
|---|---:|---:|
| Audited pages | 135 | 159 |
| Character guides | 126 | 150 |
| Maximum character click depth from homepage | 2 | 2 |
| Dictionary body links to distinct guides in server HTML | 24 | 150 |
| Guides with a body link back to dictionary | 0 | 150 |

All 150 guides have body incoming links and are reachable within two clicks. Every new guide additionally has a contextual incoming link from a previously published character guide, verified in the data test. Explicit bidirectional teaching pairs cover time words, opposites, visible forms and useful compounds. Duplicate and self-links are removed; unpublished targets are not rendered.

The dictionary keeps its searchable, paginated cards and adds an accessible expandable full index rendered on the server. It does not require JavaScript or loading more cards to expose every guide link. Character pages keep their lookup and worksheet actions and add a contextual dictionary return link.

Homepage keyword ownership stays Chinese Character Worksheet Generator; /grids owns printable blank grid paper, /stroke-order owns the interactive lookup, /chinese-stroke-order-dictionary owns browsing, and individual guides own character-specific stroke-order intent. The homepage already has descriptive body links to the generator, grids, templates, HSK and stroke-order hubs. No homepage Title/H1 changes or keyword-density stuffing are needed for this expansion. The stroke hub also links to stroke rules, components, basic strokes and mistakes articles.

## Verification

- 344 unit tests, TypeScript and production build passed again after merging main at a49ff86 (the existing bookmark reminder release). All 150 HTTP checks and the focused browser workflow also passed against a fresh build of that integrated version.
- HTTP checks on all 150 local production guides: unique Title, Description, H1 and canonical, exactly one H1, and each new explanatory paragraph rendered once.
- Sitemap: 150 character guides. Hub links include all additions; sampled Chinese variants retain noindex.
- Browser: full 150-link index expands, 买 search returns one actual result, guide opens, 390px layout has no horizontal overflow, dictionary return link exists, worksheet CTA carries 买 into the generator, and 后's traditional-form boundary is visible. No page errors or failed local JS assets observed.
- Local browser stroke fixtures reuse the downloaded data files; production browser checks use public network resources.
- Local evidence: artifacts/batch150/{before,local}-links.csv, graph JSON, local-tdh.csv, screenshots, source verification.json, test and build logs. These are ignored artifacts, not product routes.
