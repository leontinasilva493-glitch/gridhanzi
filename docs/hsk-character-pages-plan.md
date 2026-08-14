# HSK Character Pages Expansion Plan

## Objective

Expand GridHanzi's curated stroke-order learning path with 15 differentiated,
indexable character guides while reusing the existing HSK 2.0/3.0 picker,
Hanzi/Pinyin/English search, selection count, unique-Hanzi count, and page
estimate already present in the worksheet generator.

## Global constraints

- Work on branch `agent/hsk-character-pages` in the isolated worktree.
- Preserve the existing HSK catalogue and picker behavior; do not create a
  second 15,960-row browser or duplicate its filtering/state logic.
- Add exactly these first-batch characters, preserving the existing `爱`, `年`,
  and `佛`: `的`, `一`, `是`, `在`, `了`, `我`, `你`, `人`, `来`, `去`, `说`,
  `学`, `经`, `体`, `议`.
- Classify the new batch as high-frequency (`的`, `一`, `是`, `在`, `了`, `我`),
  beginner (`你`, `人`, `来`, `去`, `说`, `学`), and advanced (`经`, `体`, `议`).
- Every indexable guide must have unique metadata and differentiated visible
  learning content: importance, component explanation, reading/use notes,
  HSK notes, at least four vocabulary examples, at least three example
  sentences, one common mistake, one writing tip, and related-character links.
- Do not invent etymology, unsupported frequency percentages, rankings,
  mnemonic stories, or official HSK claims. HSK notes may describe exact
  standalone records or verified word-family appearances from the existing
  versioned catalogue. Keep the existing trial/version caveat.
- Only content-complete entries may generate routes, appear in the hub, resolve
  from lookup, or enter the sitemap. Draft entries must be excluded from all
  four.
- Keep untranslated Chinese character pages `noindex, follow`; do not make them
  indexable in this plan.
- Reuse the existing editorial red/ink/paper visual system and current
  components. Do not redesign unrelated pages or add dependencies.
- Follow strict TDD: add a focused failing test, run it and confirm the expected
  failure, implement the minimum behavior, then rerun the focused test.
- Do not push, merge, publish, or deploy. The final deliverable is a local
  production build plus local review URLs.

## Task 1: Content model and publication gate

**Owned files**

- `src/features/worksheets/stroke-order-characters.ts`
- `src/features/worksheets/stroke-order-characters.test.ts`
- `src/features/worksheets/seo.ts`
- `src/features/worksheets/seo.test.ts`
- route/hub imports only where required to consume the indexable collection

**Requirements**

1. Extend the character content model with typed fields for learning tier,
   importance, component explanations, reading/use notes, example sentences,
   common mistakes, confusable-character guidance, related characters, and a
   publication status.
2. Export a filtered indexable collection and make lookup, static params, hub
   cards, related links, and sitemap use it.
3. Add a test-only draft fixture or exported pure filtering function so tests
   prove drafts are absent from lookup and sitemap without publishing a real
   draft page.
4. Preserve all three existing guides and adapt them to the complete model.
5. Tests must prove content completeness, route/sitemap exclusion for drafts,
   unique metadata/content identity, and valid related-character targets.

**Verification**

- `pnpm.cmd test -- src/features/worksheets/stroke-order-characters.test.ts src/features/worksheets/seo.test.ts`

## Task 2: Curated first-batch content

**Owned files**

- `src/features/worksheets/stroke-order-characters.ts`
- `src/features/worksheets/stroke-order-characters.test.ts`

**Requirements**

1. Add the exact 15-character first batch and no other new characters.
2. Each entry must satisfy the publication gate and use accurate simplified,
   traditional, Pinyin, stroke-count, radical, and structure facts.
3. Each page's importance, usage, writing guidance, reading notes, examples,
   sentences, common mistake, and confusable guidance must be written for that
   character rather than produced by token substitution.
4. For `的`, `了`, `在`, and `说`, distinguish important grammatical or reading
   roles. For `来`/`去`, explain the speaker-relative direction contrast. For
   `经`, `体`, and `议`, teach their word-family value rather than pretending
   each is a common standalone beginner word.
5. HSK notes must stay source-bounded. Use these verified catalogue anchors:
   `的/一/是/在/了/我/你/人/来/去` have exact HSK 2.0 and 3.0 Level 1
   standalone rows; `说话` and the `学` word family begin at Level 1; `已经`
   begins at HSK 2.0 Level 2; `身体` begins at HSK 2.0 Level 2; `会议` begins
   at HSK 2.0/3.0 Level 3. Do not infer more than these anchors support.

**Verification**

- `pnpm.cmd test -- src/features/worksheets/stroke-order-characters.test.ts`

## Task 3: Differentiated page and hub experience

**Owned files**

- `src/features/worksheets/components/stroke-order-character-page.tsx`
- `src/app/[locale]/stroke-order/page.tsx`
- related presentation/SEO tests

**Requirements**

1. Render the new differentiated fields in a readable editorial sequence:
   character importance, components, readings/use, HSK context, vocabulary,
   graded sentences, common mistake/confusable distinction, writing tip,
   printable worksheet CTA, and curated related links.
2. Preserve the working stroke animation and current shared page shell.
3. Upgrade the stroke-order hub to group curated guides by high-frequency,
   beginner, and advanced learning paths. Add clear links to the existing HSK
   picker rather than duplicating it.
4. Keep related links limited to explicitly curated relationships. Avoid showing
   every character on every detail page.
5. Maintain accessible headings, crawlable links, responsive layouts, and the
   existing paper/editorial visual language.
6. Tests must assert the user-visible sections and grouped hub behavior through
   meaningful rendered/source contracts already used in this repository.

**Verification**

- `pnpm.cmd test -- src/features/worksheets/presentation.test.ts src/features/worksheets/seo.test.ts`

## Task 4: Integration verification and local review

**Requirements**

1. Run the complete test suite and TypeScript check.
2. Run a production build.
3. Start the local app and use browser automation to inspect `/generator`,
   `/stroke-order`, and representative high-frequency, beginner, and advanced
   character pages at desktop and mobile widths.
4. Verify the generator's HSK 2.0/3.0 filters, Hanzi/Pinyin/English search,
   selection count, unique-Hanzi count, and estimated-page count remain usable.
5. Check for browser console errors, horizontal overflow, missing headings,
   broken related links, and absent sitemap entries.
6. Produce the complete local review URL list for all 15 new pages plus the
   generator and stroke-order hub.

**Verification**

- `pnpm.cmd test`
- `pnpm.cmd exec tsc --noEmit`
- `pnpm.cmd build`
- browser automation report with screenshots
