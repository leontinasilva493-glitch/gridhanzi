# Stroke-order Character Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build indexable, useful stroke-order pages for 爱, 年, and 佛 that reuse the current animation and send learners into the worksheet generator.

**Architecture:** A typed curated data module is the only source of indexable characters. One static dynamic route renders a shared server page, while the existing client-side Hanzi Writer component accepts an initial character and page mode. Sitemap and metadata are generated from the same records.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Hanzi Writer 3.7, Node test runner, Vinext.

## Global Constraints

- English SEO body copy only; Hanzi, Pinyin, example words, and Chinese example text remain visible learning content.
- Support exactly `/stroke-order/爱`, `/stroke-order/年`, and `/stroke-order/佛` in this slice.
- Reuse Hanzi Writer, `StrokeSequence`, `PublicPageShell`, `StructuredData`, and `/generator?words=<character>`.
- Unsupported characters return 404 and are absent from the sitemap.
- Add no dependencies and do not copy competitor prose or images.

---

### Task 1: Curated character records

**Files:**
- Create: `src/features/worksheets/stroke-order-characters.ts`
- Create: `src/features/worksheets/stroke-order-characters.test.ts`

**Interfaces:**
- Produces: `StrokeOrderCharacter`, `strokeOrderCharacters`, `getStrokeOrderCharacter(character: string)`.
- Consumers: the dynamic route, detail component, stroke-order client, and sitemap helper.

- [ ] **Step 1: Write the failing data tests**

Assert that the exported records contain exactly `爱`, `年`, and `佛`; every record has Pinyin, meaning, positive stroke count, radical, traditional form, structure, HSK text, usage copy, writing tip, and at least three complete example words. Assert that unknown input returns `undefined`.

- [ ] **Step 2: Run the targeted test and verify failure**

Run: `pnpm test -- src/features/worksheets/stroke-order-characters.test.ts`

Expected: FAIL because `./stroke-order-characters` does not exist.

- [ ] **Step 3: Add the typed records**

Implement these interfaces:

```ts
export interface StrokeOrderExampleWord {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface StrokeOrderCharacter {
  character: "爱" | "年" | "佛";
  pinyin: string;
  meaning: string;
  strokes: number;
  radical: string;
  traditional: string;
  structure: string;
  hsk: Array<{ system: string; level: string; note: string }>;
  usageTitle: string;
  usage: string;
  writingTip: string;
  examples: StrokeOrderExampleWord[];
}
```

Use original concise copy and these facts: 爱 `ài`, 10 strokes, 爫, 愛, top-bottom; 年 `nián`, 6 strokes, 干, 年, top-bottom; 佛 `fó`, 7 strokes, 亻, 佛, left-right. Include the pronunciation note that 佛 is read `fú` in 仿佛.

- [ ] **Step 4: Run the targeted test and verify pass**

Run: `pnpm test -- src/features/worksheets/stroke-order-characters.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the data slice**

```bash
git add src/features/worksheets/stroke-order-characters.ts src/features/worksheets/stroke-order-characters.test.ts
git commit -m "feat: add curated stroke-order character data"
```

### Task 2: Reusable character detail presentation

**Files:**
- Modify: `src/features/worksheets/components/stroke-order-client.tsx`
- Create: `src/features/worksheets/components/stroke-order-character-page.tsx`
- Modify: `src/features/worksheets/presentation.test.ts`

**Interfaces:**
- Consumes: `StrokeOrderCharacter` and `getStrokeOrderCharacter` from Task 1.
- Produces: `StrokeOrderClient({ initialCharacter?, initialInfo?, showSearch?, showGuidance? })` and `StrokeOrderCharacterPage({ entry, locale })`.

- [ ] **Step 1: Write failing presentation assertions**

Require the client source to expose `initialCharacter`, `showSearch`, and `showGuidance`; require the new server component to render `StrokeOrderClient`, `StrokeSequence` through the client, HSK facts, examples, writing tip, related character links, `StructuredData`, and `/generator?words=`.

- [ ] **Step 2: Run the presentation test and verify failure**

Run: `pnpm test -- src/features/worksheets/presentation.test.ts`

Expected: FAIL because the character page component and props do not exist.

- [ ] **Step 3: Make the existing client configurable without changing hub defaults**

Add optional props with defaults:

```ts
type StrokeOrderClientProps = {
  initialCharacter?: string;
  initialInfo?: { pinyin: string; meaning: string; strokes: number };
  showSearch?: boolean;
  showGuidance?: boolean;
};
```

Initialize both input and character from `initialCharacter ?? "永"`. Use `initialInfo` only while the active character equals the initial character. Hide the search control when `showSearch` is false and hide the generic lower guidance cards when `showGuidance` is false. Preserve every existing hub interaction and error state.

- [ ] **Step 4: Add the shared server-rendered page content**

Render the breadcrumb and H1, fact cards, `<StrokeOrderClient initialCharacter={entry.character} initialInfo={entry} showSearch={false} showGuidance={false} />`, usage section, example-word cards, writing tip, worksheet CTA, and links to the other curated characters. Add truthful `LearningResource` and `BreadcrumbList` JSON-LD using the existing `StructuredData` component.

- [ ] **Step 5: Run the presentation test and verify pass**

Run: `pnpm test -- src/features/worksheets/presentation.test.ts`

Expected: PASS, including all pre-existing presentation assertions.

- [ ] **Step 6: Commit the presentation slice**

```bash
git add src/features/worksheets/components/stroke-order-client.tsx src/features/worksheets/components/stroke-order-character-page.tsx src/features/worksheets/presentation.test.ts
git commit -m "feat: add reusable stroke-order character page"
```

### Task 3: Static routes, SEO, and sitemap

**Files:**
- Create: `src/app/[locale]/stroke-order/[character]/page.tsx`
- Modify: `src/features/worksheets/seo.ts`
- Modify: `src/features/worksheets/seo.test.ts`

**Interfaces:**
- Consumes: `strokeOrderCharacters`, `getStrokeOrderCharacter`, `StrokeOrderCharacterPage`, `buildPageSeoMetadata`.
- Produces: three static params, unique per-character metadata, 404 for unsupported characters, and three sitemap paths.

- [ ] **Step 1: Write failing route and sitemap tests**

Update the sitemap test to require `/stroke-order/爱`, `/stroke-order/年`, and `/stroke-order/佛` exactly once. Add source assertions that the dynamic route uses `generateStaticParams`, `generateMetadata`, `notFound`, `buildPageSeoMetadata`, and `StrokeOrderCharacterPage`.

- [ ] **Step 2: Run the SEO test and verify failure**

Run: `pnpm test -- src/features/worksheets/seo.test.ts`

Expected: FAIL because the paths and route are missing.

- [ ] **Step 3: Add routes to the sitemap source**

Import `strokeOrderCharacters` in `seo.ts` and append:

```ts
...strokeOrderCharacters.map(
  (entry) => `/stroke-order/${entry.character}`,
),
```

- [ ] **Step 4: Implement the static dynamic route**

Set `dynamicParams = false`; return the three characters from `generateStaticParams`; use `notFound()` when `getStrokeOrderCharacter` misses; build titles in the form `爱 (ài) Stroke Order, Meaning & How to Write`; use the same path for canonical metadata; render `StrokeOrderCharacterPage`.

- [ ] **Step 5: Run focused tests**

Run: `pnpm test -- src/features/worksheets/stroke-order-characters.test.ts src/features/worksheets/presentation.test.ts src/features/worksheets/seo.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit routes and SEO**

```bash
git add src/app/[locale]/stroke-order/[character]/page.tsx src/features/worksheets/seo.ts src/features/worksheets/seo.test.ts
git commit -m "feat: publish popular Hanzi stroke-order pages"
```

### Task 4: Full verification and visual check

**Files:**
- Modify only if verification exposes a scoped defect in the files above.

**Interfaces:**
- Consumes: the completed feature.
- Produces: test, type, build, HTTP, and visual evidence.

- [ ] **Step 1: Run the full automated suite**

Run: `pnpm test`

Expected: all tests pass.

- [ ] **Step 2: Run TypeScript validation**

Run: `pnpm exec tsc --noEmit`

Expected: exit code 0.

- [ ] **Step 3: Run the production build**

Run: `pnpm build`

Expected: exit code 0 and static outputs for the three character routes.

- [ ] **Step 4: Verify rendered pages locally**

Start the app and request `/stroke-order/%E7%88%B1`, `/stroke-order/%E5%B9%B4`, and `/stroke-order/%E4%BD%9B`. Require HTTP 200, a unique title/H1, HSK text, examples, stroke controls, and a worksheet link for each route. Require an unsupported character path to return 404.

- [ ] **Step 5: Inspect desktop and mobile layouts**

At desktop and narrow mobile widths, confirm no horizontal overflow, stroke diagrams remain readable, CTAs remain visible, and example-word cards wrap cleanly.

- [ ] **Step 6: Check the final diff and working tree**

Run: `git diff --check && git status --short`

Expected: no whitespace errors and only intentional work remains.
