# HanziSheets copy humanization design

Date: 2026-07-21

## Outcome

Make the public copy sound like it was written by someone who understands Chinese teaching and worksheet preparation. Keep the product facts and search intent, but remove promotional filler, repetitive feature lists, implementation language, and formulaic template descriptions.

The smallest acceptable outcome is a copy-only revision across the main public surfaces. No layout, route, worksheet, enrichment, PDF, or stroke-order behavior changes are part of this work.

## Voice

- Direct and practical, with the calm tone of an experienced teacher.
- Specific about what users can enter, check, practise, print, or download.
- Shorter where the existing copy repeats a nearby heading, button, or feature list.
- Honest about automatic completion and fallback behavior without exposing internal model details.
- Natural US/UK English consistency is secondary to clarity; keep the site's existing `practise` wording where it describes learning activity.

## Scope

### Homepage and shell

Keep the homepage H1 and primary search intent. Rewrite supporting copy in the hero, three-step explanation, template introduction, practice modes, teacher section, family section, FAQ, header, and footer. Remove phrases such as `teacher-ready`, `classroom-ready in seconds`, and `perfect for` when a concrete statement can replace them.

### Generator and print preview

Replace model-facing status messages with user-facing results. For example, say that Hanzi and Pinyin are being filled in instead of announcing an AI-assisted worksheet. Make completion, fallback, empty-state, print, PDF, and tablet messages short and actionable. Update both existing English and Chinese strings.

### Templates

Rewrite the template library introduction, empty state, learning-goal cards, and template-detail sections. Each of the 20 template descriptions should say what vocabulary the learner will practise rather than reuse a generic marketing sentence. Do not change template words, age ranges, levels, categories, slugs, or recommended writing profiles.

### Stroke-order page

Keep the `Chinese Stroke Order` keyword and all controls. Tighten the explanatory and practice copy without changing Hanzi Writer behavior.

### SEO and structured data

Keep the validated keyword targets in titles and H1s, including `Chinese character practice sheet`, `Chinese writing worksheets`, `Chinese worksheet generator`, and `Chinese stroke order`. Rewrite descriptions so they read as sentences instead of feature inventories. Keep metadata, Open Graph, and structured-data claims aligned with the visible page.

## Explicit non-goals

- No layout, styling, component, route, or navigation changes.
- No new feature claims.
- No changes to AI prompts, vocabulary resolution, rate limits, or model configuration.
- No changes to worksheet content, profiles, fonts, grids, stroke data, PDF rendering, or print behavior.
- No new internationalization architecture; only improve Chinese strings that already exist beside English copy.

## Verification

- Add or update focused source-level copy tests for the most important banned phrases and user-facing status wording.
- Run the full test suite and TypeScript check.
- Run a clean production build.
- Open the homepage, generator, templates, one template detail page, stroke-order page, and print preview at desktop and mobile widths.
- Confirm no console errors and no broken controls caused by changed labels.

## Success criteria

- Core SEO titles and search terms remain present.
- No visible copy uses `MVP`, `AI-assisted worksheet`, `teacher-ready`, `classroom-ready`, or `Perfect for bilingual families`.
- Automatic completion and fallback messages tell the user what happened and what to check.
- Template descriptions are concrete and do not all follow the same sentence pattern.
- Existing functionality, routes, and layout remain unchanged.
