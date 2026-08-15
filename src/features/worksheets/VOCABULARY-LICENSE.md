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
