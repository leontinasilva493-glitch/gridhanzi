# HSK vocabulary data attribution

## Bundled derivatives

`hsk-catalog.json` was generated on 2026-08-12 from the compact
`complete.min.json` dataset in
[drkameleon/complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary),
pinned to [the v1.4 tag](https://github.com/drkameleon/complete-hsk-vocabulary/tree/v1.4)
and commit `7ac65bf1a6387d35f1ade478906172a19311c7f9`. The generator verifies the
source file against SHA-256
`52d8e64ba65a6db4a38ea34302c6de5df53cdb5145254b25edcbf93b80676434`
before writing output.

The derivative retains only:

- the upstream `o1` through `o6` classifications, represented as HSK 2.0
  levels 1 through 6;
- the upstream `n1` through `n7` classifications, represented as HSK 3.0
  levels 1 through 6 and level 7-9;
- simplified Hanzi, the first Pinyin form, and the first English meaning; and
- curated theme slugs derived from this project's existing `hsk-3-*`
  worksheet memberships.

Each retained classification becomes one stable entry with the identifier
`<system>:<level>:<hanzi>`. Theme slugs are GridHanzi editorial groupings, not
official HSK categories.

The older `hsk-vocabulary.json` file is a compact derivative of the same
repository's inclusive HSK 1-2 material. It retains simplified Hanzi, Pinyin,
and the first English meaning for the original local vocabulary lookup.

## Official alignment references

HSK naming and exam-status terminology should be checked against the official
[Chinese Test Service HSK page](https://www.chinesetest.cn/HSK) and its
[HSK 3.0 trial notice](https://www.chinesetest.cn/notice).

The bundled files are third-party derivatives. The HSK classifications are
collected by the upstream project, while dictionary forms and English
definitions are third-party enrichment (the upstream project cites
CC-CEDICT). The English definitions are not official Chinese Test Service
definitions, and inclusion does not imply endorsement by Chinese Test
Service.

## Upstream MIT license

MIT License

Copyright (c) 2026 Yanis Zafirópulos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Teaching-sense review (2026-09-23)

`teaching-senses.ts` selects nine everyday teaching senses independently of
upstream dictionary order: 东西、先生、便宜、妻子、地方、多少、意思、着、更.
The overlay is shared by catalog browsing, import, local completion and catalog
regeneration. It does not change level membership or remove alternative senses
from the upstream source. This is a targeted review, not a certification of all
HSK definitions.

References for the distinction between dictionary senses:
- National Academy for Educational Research, [shopping vocabulary](https://coct.naer.edu.tw/file/files/02_%E8%B3%BC%E7%89%A9%E5%8E%BB.pdf): 東西 as dōngxi / thing; stuff.
- Ministry of Education, [便宜](https://dict.revised.moe.edu.tw/dictView.jsp?ID=25367): inexpensive pián yi versus convenient biàn yí.
- The pinned upstream CC-CEDICT-derived forms remain the source of alternative readings.

Pinyin uses standard Mandarin worksheet readings, including neutral syllables;
selecting Taiwan character forms does not imply a regional pronunciation conversion.

## Targeted beginner corrections (2026-10-23)

The shared default overlay now selects 万 wàn (ten thousand), 几 jǐ
(how many / a few), 吗 ma (yes/no question particle), 个 gè (general
classifier), and 在 zài (at / in / located at). These apply to exact standalone
entries, not substring replacements inside compound words. They do not erase
alternative dictionary readings or override explicit worksheet edits.

Scope: targeted software-assisted correction of beginner defaults, not teacher
certification or a complete HSK review. Numbers, Family and First Characters
were inspected as a first batch; a full sourced item-by-item review of HSK 1,
School and Greetings remains pending. Family relationship glosses are concise
labels, not exhaustive definitions of Chinese kinship distinctions.

Reference: Ministry of Education, 萬 (ten times one thousand):
https://dict.revised.moe.edu.tw/dictView.jsp?ID=11519&la=1&powerMode=0
Alternative readings remain available in the upstream dictionary. Neutral-tone
吗 is intentional; 个 may be neutral in phrases, but its standalone default is gè.

## Follow-up pass (2026-10-23, local)

Read-through scope: all 150 displayed HSK 2.0 Level 1 entries, 18 School
entries, and 15 Greetings entries. This is a software-assisted context pass,
not independent teacher certification or a claim that every gloss was checked
against an external dictionary.

Additional default corrections: 看 kàn, 读 dú, 听 tīng; 同学 classmate,
哪 which, 叫 to be called, 回 return, 太 too/very, 字 written character,
热 hot, 本 book classifier, 月 month/moon, 点 o'clock/point/a little.
Course-specific choices are kept separately: 早 as a greeting, 本子 as
notebook, 考试 as exam, and 点 as dot stroke in stroke lessons.

Dictionary comparison references:
- https://www.mdbg.net/chinese/dictionary?wdqb=同学
- https://www.mdbg.net/chinese/dictionary?wdqb=哪
- https://www.mdbg.net/chinese/dictionary?wdqb=听
- https://www.mdbg.net/chinese/dictionary?wdqb=早

Remaining semantic cautions: a short gloss is not a complete definition;
classifier usage, kinship distinctions and neutral-tone conventions need
context. No changes to the three ready-made pack word lists were required
by this follow-up. Public /sources notes disclose review limits and server-side
auto-completion instead of claiming browser-only processing.
