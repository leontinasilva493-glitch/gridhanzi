# HSK, Character, and Comparison Content Clusters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 34 differentiated, indexable HSK, character, and comparison pages with a curated internal-link network and no thin programmatic routes.

**Architecture:** Add static descriptor modules for HSK and comparison pages, keep interaction limited to a small HSK search client, and add complete character records through a separate expansion data module consumed by the existing publication gate. Reuse the existing App Router metadata, page shell, structured-data component, sitemap authority, and character route.

**Tech Stack:** TypeScript, React 19 Server Components, Next.js-compatible Vinext App Router, Tailwind CSS, `next-intl`, Node test runner, Tabbit Browser.

**Spec:** `docs/superpowers/specs/2026-08-25-hsk-character-compare-content-clusters-design.md`

## Global Constraints

- Add exactly the page inventory in the spec and no arbitrary route generator.
- Preserve HSK catalogue licensing and source boundaries.
- English pages index; untranslated Chinese variants remain `noindex, follow`.
- Reuse existing visual language and dependencies.
- HSK, character, and comparison substantive prose must remain unique.
- Follow strict TDD for every behavior change.
- Do not push, merge, publish, or deploy.

---

### Task 1: HSK public-page model and search contract

**Files:**
- Create: `src/features/worksheets/hsk-pages.ts`
- Create: `src/features/worksheets/hsk-public-utils.ts`
- Create: `src/features/worksheets/hsk-pages.test.ts`

**Interfaces:**
- Produces: `HskPublicPage`, `hskPublicPages`, `getHskPublicPage(system, level)`, `getHskPublicEntries(page)`, `filterPublicHskEntries(entries, query)`, `summarizePublicHskEntries(entries)`.

- [ ] **Step 1: Write the failing descriptor and search tests**

```ts
assert.deepEqual(
  hskPublicPages.map((page) => page.pathname),
  [
    "/hsk/2-0/level-1", "/hsk/3-0/level-1",
    "/hsk/2-0/level-2", "/hsk/3-0/level-2",
    "/hsk/2-0/level-3", "/hsk/3-0/level-3",
  ],
);
assert.equal(filterPublicHskEntries(entries, "ai")[0].hanzi, "爱");
assert.equal(new Set(hskPublicPages.map((page) => page.intro)).size, 6);
```

- [ ] **Step 2: Run RED**

Run: `node --import tsx --test src/features/worksheets/hsk-pages.test.ts`
Expected: FAIL because the public HSK modules do not exist.

- [ ] **Step 3: Implement typed descriptors and pure filtering**

```ts
export interface HskPublicPage {
  system: HskSystem;
  level: Extract<HskLevel, "1" | "2" | "3">;
  pathname: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  levelFocus: string;
  versionNote: string;
  studySteps: readonly [string, string, string];
  templateSlug: string;
}

export function filterPublicHskEntries(
  entries: readonly HskCatalogEntry[],
  query: string,
): HskCatalogEntry[];
```

- [ ] **Step 4: Run GREEN**

Run: `node --import tsx --test src/features/worksheets/hsk-pages.test.ts`
Expected: PASS.

### Task 2: P0/P2 HSK routes and rendered experience

**Files:**
- Create: `src/features/worksheets/components/hsk-directory-page.tsx`
- Create: `src/features/worksheets/components/hsk-level-page.tsx`
- Create: `src/features/worksheets/components/hsk-level-browser.tsx`
- Create: `src/app/[locale]/hsk/page.tsx`
- Create: `src/app/[locale]/hsk/[system]/[level]/page.tsx`
- Modify: `src/features/worksheets/presentation.test.ts`
- Modify: `src/features/worksheets/seo.test.ts`

**Interfaces:**
- Consumes Task 1 descriptors and filtering.
- Produces static HSK hub/detail routes and aligned metadata.

- [ ] **Step 1: Write failing real-render and metadata tests**

```ts
assert.equal(generateStaticParams().length, 6);
assert.equal(metadata.alternates?.canonical, "https://gridhanzi.org/hsk/3-0/level-1");
assert.equal(renderedH1Count, 1);
assert.match(html, /Search Hanzi, Pinyin, or English/);
assert.match(html, /Open HSK 3\.0 Level 1 in the worksheet picker/);
```

- [ ] **Step 2: Run RED**

Run: `node --import tsx --test src/features/worksheets/hsk-pages.test.ts src/features/worksheets/presentation.test.ts src/features/worksheets/seo.test.ts`
Expected: FAIL for absent HSK routes/components.

- [ ] **Step 3: Implement Server Component pages and the isolated client browser**

Use `generateStaticParams`, `dynamicParams = false`, `buildPageSeoMetadata`,
`StructuredData`, and a client component receiving only one level's entries.
Render all filtered rows and apply `[content-visibility:auto]` to row cards.

- [ ] **Step 4: Run GREEN**

Run the Step 2 command. Expected: PASS.

### Task 3: P0 character expansion

**Files:**
- Create: `src/features/worksheets/stroke-order-character-expansion.ts`
- Modify: `src/features/worksheets/stroke-order-characters.ts`
- Modify: `src/features/worksheets/stroke-order-characters.test.ts`
- Modify: `src/features/worksheets/seo.test.ts`

**Interfaces:**
- Produces `expandedStrokeOrderCharacters: StrokeOrderCharacter[]`.
- Existing lookup, hub, route, related-link, schema, and sitemap consumers remain unchanged.

- [ ] **Step 1: Add failing contracts for `好 不 没 有 上 下 大 小 家 水`**

```ts
const p0 = ["好", "不", "没", "有", "上", "下", "大", "小", "家", "水"];
for (const character of p0) {
  const entry = getStrokeOrderCharacter(character);
  assert.ok(entry);
  assert.equal(entry.examples.length >= 4, true);
  assert.deepEqual(entry.exampleSentences.map((item) => item.learningLabel),
    ["Starter", "Developing", "Stretch"]);
}
```

- [ ] **Step 2: Run RED**

Run: `node --import tsx --test src/features/worksheets/stroke-order-characters.test.ts src/features/worksheets/seo.test.ts`
Expected: FAIL because the ten guides are absent.

- [ ] **Step 3: Write ten complete records with literal source-bound HSK cards**

Use standalone HSK 2.0 and HSK 3.0 Level 1 cards for every P0 character.
Write unique TDH, grammar/usage, examples, sentences, mistakes, confusables,
and writing tips; do not derive prose by replacement.

- [ ] **Step 4: Run GREEN**

Run the Step 2 command. Expected: PASS.

### Task 4: P1 comparison model

**Files:**
- Create: `src/features/worksheets/comparison-pages.ts`
- Create: `src/features/worksheets/comparison-pages.test.ts`

**Interfaces:**
- Produces: `ComparisonPage`, `comparisonPages`, `getComparisonPage(slug)`, `getComparisonPagesForCharacter(character)`.

- [ ] **Step 1: Write failing page inventory and uniqueness tests**

```ts
assert.deepEqual(comparisonPages.map((page) => page.slug), [
  "的-得-地", "不-没", "来-去", "在-再", "上-下",
  "好-坏", "人-入", "牛-午",
]);
assert.equal(new Set(comparisonPages.map((page) => page.summary)).size, 8);
assert.ok(comparisonPages.every((page) => page.mistakes.length >= 3));
```

- [ ] **Step 2: Run RED**

Run: `node --import tsx --test src/features/worksheets/comparison-pages.test.ts`
Expected: FAIL because the module is absent.

- [ ] **Step 3: Implement eight reviewed comparison records**

Each record must provide literal comparison items, rules, examples, memory
tips, corrections, FAQs, worksheet words, related slugs, and unique metadata.

- [ ] **Step 4: Run GREEN**

Run the Step 2 command. Expected: PASS.

### Task 5: P1/P2 comparison routes and character backlinks

**Files:**
- Create: `src/features/worksheets/components/comparison-directory-page.tsx`
- Create: `src/features/worksheets/components/comparison-detail-page.tsx`
- Create: `src/app/[locale]/compare/page.tsx`
- Create: `src/app/[locale]/compare/[slug]/page.tsx`
- Modify: `src/features/worksheets/components/stroke-order-character-page.tsx`
- Modify: `src/features/worksheets/presentation.test.ts`
- Modify: `src/features/worksheets/seo.test.ts`

**Interfaces:**
- Consumes Task 4 lookup and character relationships.
- Produces the comparison hub, eight static routes, and explicit character backlinks.

- [ ] **Step 1: Write failing rendered route/link/schema tests**

```ts
assert.equal(generateStaticParams().length, 8);
assert.match(html, /30-second rule/);
assert.match(html, /Common corrections/);
assert.match(html, /href="\/generator\?words=/);
assert.deepEqual(schemaTypes, ["LearningResource", "BreadcrumbList"]);
```

- [ ] **Step 2: Run RED**

Run: `node --import tsx --test src/features/worksheets/comparison-pages.test.ts src/features/worksheets/presentation.test.ts src/features/worksheets/seo.test.ts`
Expected: FAIL for absent comparison routes/components/backlinks.

- [ ] **Step 3: Implement the editorial comparison experience**

Render semantic tables on desktop with a mobile-safe stacked fallback, visible
correct/incorrect examples, curated character links, related comparisons, and
a prefilled Generator CTA.

- [ ] **Step 4: Run GREEN**

Run the Step 2 command. Expected: PASS.

### Task 6: P2 character expansion

**Files:**
- Modify: `src/features/worksheets/stroke-order-character-expansion.ts`
- Modify: `src/features/worksheets/stroke-order-characters.test.ts`
- Modify: `src/features/worksheets/seo.test.ts`

**Interfaces:**
- Adds complete records for `书 吃 喝 二 再 得 地 坏` to the existing expansion export.

- [ ] **Step 1: Write failing contracts for all eight P2 guides**

Assert exact HSK cards: Level 1 for `书 吃 喝 二`; HSK 2.0 Level 2 and HSK
3.0 Level 1 for `再`; Level 2 for `得`; HSK 2.0 Level 3 and HSK 3.0 Level 1
for `地` and `坏`.

- [ ] **Step 2: Run RED**

Run: `node --import tsx --test src/features/worksheets/stroke-order-characters.test.ts src/features/worksheets/seo.test.ts`
Expected: FAIL for absent P2 records.

- [ ] **Step 3: Implement eight complete differentiated records**

Teach `得` readings and complement use, `地` particle vs earth reading,
`再` future repetition, `坏` antonym/quality, and distinct concrete word
families for `书 吃 喝 二`.

- [ ] **Step 4: Run GREEN**

Run the Step 2 command. Expected: PASS.

### Task 7: Cross-cluster navigation, sitemap, and SEO operations

**Files:**
- Modify: `src/features/worksheets/seo.ts`
- Modify: `src/features/worksheets/components/site-shell.tsx`
- Modify: `src/app/[locale]/stroke-order/page.tsx`
- Modify: `src/features/worksheets/components/hsk-picker.tsx`
- Modify: `src/features/worksheets/components/template-detail-page.tsx`
- Modify: `src/features/worksheets/components/for-teachers-page.tsx`
- Modify: `src/features/worksheets/navigation.test.ts`
- Modify: `src/features/worksheets/presentation.test.ts`
- Modify: `src/features/worksheets/seo.test.ts`
- Modify: `docs/SEO.md`

**Interfaces:**
- Sitemap consumes `hskPublicPages`, `comparisonPages`, and the expanded character collection.

- [ ] **Step 1: Write failing sitemap and explicit-link tests**

```ts
assert.equal(paths.filter((path) => path.startsWith("/hsk/")).length, 6);
assert.equal(paths.filter((path) => path.startsWith("/compare/")).length, 8);
assert.match(headerSource, /href="\/hsk"/);
assert.match(headerSource, /href="\/compare"/);
```

- [ ] **Step 2: Run RED**

Run: `node --import tsx --test src/features/worksheets/navigation.test.ts src/features/worksheets/presentation.test.ts src/features/worksheets/seo.test.ts`
Expected: FAIL for missing public paths and links.

- [ ] **Step 3: Implement only the curated link graph from the spec**

Update route ownership and indexing policy in `docs/SEO.md`. Keep Chinese
locale HSK/Compare routes out of the sitemap.

- [ ] **Step 4: Run GREEN**

Run the Step 2 command. Expected: PASS.

### Task 8: Integration verification and local review

**Files:**
- No production files unless a task-related defect is reproduced by a failing test.

- [ ] **Step 1: Run the full automated gates**

Run in parallel:

```powershell
pnpm.cmd test
pnpm.cmd exec tsc --noEmit
```

Expected: zero failures and exit code 0.

- [ ] **Step 2: Build production output**

Run: `pnpm.cmd build`
Expected: exit code 0 and HSK/Compare routes listed.

- [ ] **Step 3: Start production preview**

Run: `pnpm.cmd start`
Expected: local server on port 3000 or the first available documented port.

- [ ] **Step 4: Use Tabbit for desktop and 390px review**

Inspect `/hsk`, representative HSK 2.0/3.0 levels, P0/P2 characters,
`/compare`, all eight comparison pages, `/generator`, `/templates/hsk-1`,
`/grids`, `/for-teachers`, and `/sitemap.xml`. Assert HTTP 200, one H1,
character-specific/route-specific TDH, self-canonical, expected robots,
required internal links, no console/page errors, and no horizontal overflow.

- [ ] **Step 5: Report local URLs and preserve the branch**

Do not push or deploy. Report exact verification counts, build warnings, local
preview port, all 34 new page links, and representative modified core links.
