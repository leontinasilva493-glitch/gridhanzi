const content = `# GridHanzi

> GridHanzi helps teachers, parents, and learners create printable Chinese character worksheets and study character stroke order.

Worksheets combine Hanzi, Pinyin, tracing, and writing grids. Users can edit vocabulary, print worksheets, and download PDFs. Public guides and curated templates provide learning context.

## Worksheet tools

- [Worksheet generator](https://gridhanzi.org/generator): Create and edit Chinese writing worksheets from a vocabulary list.
- [Chinese-language generator](https://gridhanzi.org/zh/generator): 中文汉字字帖生成器。
- [English to Chinese writing practice](https://gridhanzi.org/english-to-chinese-writing-practice): Start a worksheet from English vocabulary.
- [Worksheet templates](https://gridhanzi.org/templates): Browse curated worksheet topics.
- [Writing grids](https://gridhanzi.org/grids): Explore printable Chinese writing grid formats.
- [For teachers](https://gridhanzi.org/for-teachers): Classroom worksheet workflows.

## Character and vocabulary guides

- [Stroke order](https://gridhanzi.org/stroke-order): Look up Chinese characters and explore stroke-order animation.
- [Stroke-order rules](https://gridhanzi.org/chinese-stroke-order-rules): Learn common writing rules and exceptions.
- [Character components](https://gridhanzi.org/chinese-character-components): Explore meaning and sound components.
- [HSK vocabulary](https://gridhanzi.org/hsk): Browse vocabulary by HSK system and level.
- [HSK level checker](https://gridhanzi.org/hsk-level-checker): Check Chinese text against supported HSK vocabulary lists.

## Optional

- [Homepage](https://gridhanzi.org/): Product overview.
- [Sitemap](https://gridhanzi.org/sitemap.xml): Canonical public URLs for search discovery.
- [Robots rules](https://gridhanzi.org/robots.txt): Crawler access directives.

This file describes public resources. It does not grant access permissions or override robots.txt. Worksheet previews and practice-session pages are not part of the indexed public guide collection.
`;

export function GET(): Response {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
