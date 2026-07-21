# HanziSheets Copy Humanization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite HanziSheets public copy so it is direct, specific, and teacher-like while preserving product facts, SEO intent, and all existing behavior.

**Architecture:** Keep copy in its current components and data records; do not introduce a content abstraction or new dependency. Add one source-level regression test that guards the approved wording boundaries, then revise copy in page-sized batches and verify rendered routes.

**Tech Stack:** TypeScript, React 19, Vinext, Node test runner, Playwright browser checks

## Global Constraints

- Do not change layout, styling, component structure, routes, navigation, worksheet behavior, enrichment logic, template vocabulary, profiles, fonts, grids, stroke data, PDF rendering, or print behavior.
- Keep `Chinese Character Practice Sheet Generator`, `Printable Chinese Writing Worksheets`, `Chinese Worksheet Generator`, and `Chinese Stroke Order` in their existing title/H1 surfaces.
- Do not add dependencies or new feature claims.
- Improve existing paired Chinese strings, but do not build new internationalization architecture.
- Preserve all unrelated working-tree changes.

---

### Task 1: Add copy regression guards and humanize the homepage shell

**Files:**
- Create: `src/features/worksheets/copy.test.ts`
- Modify: `src/features/worksheets/components/home-page.tsx`
- Modify: `src/features/worksheets/components/home-workbench.tsx`
- Modify: `src/features/worksheets/components/site-shell.tsx`

**Interfaces:**
- Consumes: existing static JSX copy and Node's `readFile` assertion pattern from `presentation.test.ts`
- Produces: a source-level test that later tasks extend with all approved copy constraints

- [ ] **Step 1: Write the failing copy guard**

Create `copy.test.ts` with `projectFile()` and assertions that the public source does not contain visible uses of `MVP`, `AI-assisted worksheet`, `teacher-ready`, `classroom-ready`, or `Perfect for bilingual families`. Assert that the homepage still contains `Turn any word list into a printable Chinese worksheet.` and the root page still contains `Chinese Character Practice Sheet Generator`.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec tsx --test src/features/worksheets/copy.test.ts`

Expected: FAIL because the existing homepage and generator still contain the banned phrases.

- [ ] **Step 3: Rewrite homepage and shell copy**

Keep the H1. Use these approved replacements as the copy baseline:

```text
Paste a list in English or Chinese. Check the Hanzi and Pinyin, then download a worksheet with tracing and writing grids.
Check the words, then print or download.
Start with an editable word list.
Use the same words to learn, practise, or test.
Plan this week's worksheet in a few minutes.
Use the same vocabulary for practice at home.
```

Replace FAQ references to the MVP with `You can create, edit, preview, and print without an account.` Shorten repeated free/no-account claims in the footer while keeping one clear header-level trust message.

- [ ] **Step 4: Run the focused copy test**

Run: `pnpm exec tsx --test src/features/worksheets/copy.test.ts`

Expected: remaining failures should point only to files handled in Tasks 2-4; homepage and shell assertions pass.

### Task 2: Humanize generator and print-preview status copy

**Files:**
- Modify: `src/features/worksheets/copy.test.ts`
- Modify: `src/features/worksheets/components/generator-client.tsx`
- Modify: `src/features/worksheets/components/print-preview-client.tsx`

**Interfaces:**
- Consumes: existing `localize(locale, english, chinese)` pairs
- Produces: shorter English/Chinese operational messages with unchanged control labels needed by current browser tests

- [ ] **Step 1: Add failing assertions for operational messages**

Assert that generator source contains these exact English messages and does not contain `AI fields completed`, `AI is not configured`, `AI was unavailable`, or `Curated fields loaded`:

```text
Filling in Hanzi and Pinyin…
Words filled in. Check the results.
We filled the words we know. Check any blank rows.
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec tsx --test src/features/worksheets/copy.test.ts`

Expected: FAIL on the new generator assertions.

- [ ] **Step 3: Rewrite operational copy without changing behavior**

Use user-result language for loading, completion, fallback, empty states, and errors. Change `fields completed` to `words ready`. Keep button names such as `Auto-fill missing fields`, `Preview full page`, `Print`, and `Download PDF` unchanged so existing user flows and selectors remain stable. Shorten the print information box to explain when to use Download PDF versus Print. Update the paired Chinese strings to the same meaning.

- [ ] **Step 4: Run the focused test**

Run: `pnpm exec tsx --test src/features/worksheets/copy.test.ts`

Expected: generator and print assertions pass.

### Task 3: Rewrite template library, descriptions, and detail-page copy

**Files:**
- Modify: `src/features/worksheets/copy.test.ts`
- Modify: `src/features/worksheets/components/templates-page.tsx`
- Modify: `src/features/worksheets/components/template-detail-page.tsx`
- Modify: `src/features/worksheets/data.ts`
- Modify: `src/app/[locale]/templates/page.tsx`
- Modify: `src/app/[locale]/templates/[slug]/page.tsx`

**Interfaces:**
- Consumes: `WorksheetTemplate.description` as visible copy, metadata copy, and structured-data copy
- Produces: 20 concrete descriptions while preserving every template slug, entry list, age, level, category, profile, and word count

- [ ] **Step 1: Add failing template-copy assertions**

Assert that template page source contains `Choose an editable word list, then change the words, grid, and paper size.` Assert that detail source contains `What students practise`, does not contain `instead of decorative placeholders`, and does not use the all-caps label `FREE EDITABLE TEMPLATE`. Assert that all template descriptions are non-empty and no two descriptions are identical.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec tsx --test src/features/worksheets/copy.test.ts`

Expected: FAIL on template-library and detail wording.

- [ ] **Step 3: Rewrite the template surfaces**

Use `Editable worksheet` as the detail badge, `What students practise` as the outcomes heading, and plain labels such as `Trace, then write` and `See the stroke order`. Rewrite each description around its actual words, for example:

```text
Numbers: Practise zero to ten, larger number units, and the word for number.
Daily Routine: Practise words for getting up, going to school, eating, and going to bed.
Restaurant Chinese: Practise menu words, tableware, ordering, and paying the bill.
Chinese New Year: Practise words for greetings, family gatherings, food, and festival activities.
```

Apply the same direct style to the other 16 descriptions. Keep template metadata concise and factual; do not append a full feature inventory to every page.

- [ ] **Step 4: Run copy and template tests**

Run: `pnpm exec tsx --test src/features/worksheets/copy.test.ts src/features/worksheets/templates.test.ts`

Expected: PASS.

### Task 4: Humanize stroke-order and SEO descriptions

**Files:**
- Modify: `src/features/worksheets/copy.test.ts`
- Modify: `src/features/worksheets/components/stroke-order-client.tsx`
- Modify: `src/app/[locale]/stroke-order/page.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: current metadata and structured-data objects
- Produces: natural descriptions that retain the approved search phrases and make no new claims

- [ ] **Step 1: Add failing SEO preservation assertions**

Assert that the four approved search phrases remain in their title/H1 source files. Assert that root metadata descriptions do not use `real stroke order` as a repeated promotional phrase and that stroke-order guidance does not repeat the same print CTA sentence twice.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec tsx --test src/features/worksheets/copy.test.ts`

Expected: FAIL on the old metadata descriptions.

- [ ] **Step 3: Rewrite metadata and stroke guidance**

Keep titles unchanged. Describe the actual workflow in one sentence per metadata surface. Tighten stroke guidance to four direct actions: watch, play one stroke, practise in the quiz, and open the character in the worksheet generator. Do not change the control text or Hanzi Writer setup.

- [ ] **Step 4: Run the focused test**

Run: `pnpm exec tsx --test src/features/worksheets/copy.test.ts`

Expected: PASS.

### Task 5: Full verification and rendered-page regression

**Files:**
- Verify only; do not change unrelated files

**Interfaces:**
- Consumes: final source tree and production build
- Produces: evidence that copy changes did not break rendering, controls, routes, SEO titles, or mobile layout

- [ ] **Step 1: Run automated checks**

Run:

```powershell
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

Expected: all commands exit 0.

- [ ] **Step 2: Run the final banned-phrase scan**

Run:

```powershell
rg -n "AI-assisted worksheet|AI fields completed|teacher-ready|classroom-ready|Perfect for bilingual families|instead of decorative placeholders" src/app src/features/worksheets
```

Expected: no visible-copy matches; test descriptions may mention phrases only when asserting their absence.

- [ ] **Step 3: Verify rendered pages**

Start the production server and check `/`, `/generator?template=family`, `/templates`, `/templates/family`, `/stroke-order`, and `/worksheet/preview` at 1440×1000 and 390×844. Confirm HTTP 200, non-empty body, no horizontal overflow, no console errors, and that the generator, template search, stroke-order search, Print, and Download PDF controls still work.

- [ ] **Step 4: Review the final diff**

Run `git diff --check` and `git diff --stat`. Confirm changes are limited to the approved copy files, the copy regression test, and pre-existing user changes that were already present before this task.
