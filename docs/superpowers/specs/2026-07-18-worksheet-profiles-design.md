# HanziSheets Worksheet Profiles Design

**Date:** 2026-07-18

**Status:** Approved design, awaiting implementation plan

**Scope:** Sheet profiles, layout calculation, preview, PDF, print, and template integration

## 1. Outcome

Replace the current `Large / Standard / Compact` density selector with four
purpose-driven worksheet profiles:

- Kids
- Adult
- Tablet
- Brush

The implementation must produce consistent results across the generator's live
preview, full-page preview, PDF export, physical print, homepage examples, and
template thumbnails.

The smallest acceptable outcome is:

1. Users choose who or what medium the sheet is for.
2. The selected profile applies a useful default cell size and layout.
3. Users may adjust the cell size only within the profile's safe range.
4. No vocabulary is lost or duplicated during profile switching or pagination.
5. Preview, PDF, and print use the same resolved layout.

## 2. Product Vocabulary

Three concepts remain independent:

- **Template:** vocabulary content such as Family, Numbers, or HSK 1.
- **Profile:** the learner or writing medium: Kids, Adult, Tablet, or Brush.
- **Mode:** the learning task: Learn, Practice, or Test.

A profile changes presentation and output behavior. It must not alter the
worksheet vocabulary, translations, title, student name, date, or selected
learning task.

## 3. Scope Boundary

Tablet means a 3:4 digital worksheet PDF designed for import into GoodNotes,
Notability, or another annotation application and writing with Apple Pencil or
another stylus.

This version does not include in-browser handwriting, pointer-event drawing,
stroke grading, undo, clear, or saved handwriting. Those capabilities require a
separate canvas subsystem and are outside this change.

All four profiles continue to support Learn, Practice, and Test modes. Brush
Test mode uses fewer, larger answer grids.

## 4. Profile Specifications

| Profile | Default size | Safe range | Step | Default grid | Output |
| --- | ---: | ---: | ---: | --- | --- |
| Kids | 22 mm | 20–24 mm | 1 mm | Tian Zi Ge | A4 / US Letter |
| Adult | 14 mm | 12–16 mm | 1 mm | Tian Zi Ge | A4 / US Letter |
| Tablet | 112 px | 96–128 px | 8 px | Tian Zi Ge | 3:4 digital PDF |
| Brush | 40 mm | 35–45 mm | 5 mm | Mi Zi Ge | A4 / US Letter |

### 4.1 Practice-cell allocation

The layout engine fills the available width instead of hard-coding a total
number of columns.

- Kids reserves one model cell and two trace cells. Every remaining cell is
  blank, with a minimum of three blank cells.
- Adult reserves one model cell and one trace cell. Every remaining cell is
  blank, with a minimum of five blank cells.
- Tablet reserves one model cell and one trace cell. Every remaining cell is
  writable, with a minimum of four writable cells.
- Brush uses exactly four centered cells: one model, one trace, and two blank
  practice cells.

At the default A4 normal-margin layout, Kids should resolve to approximately
eight cells and Adult to approximately twelve cells. Exact counts may differ on
US Letter and narrow margins, but all profile minimums must remain valid.

### 4.2 Profile presentation

- Kids uses clearly visible guides and the strongest trace opacity.
- Adult uses lighter guides and a lower trace opacity.
- Tablet uses screen-safe line weights and no print-only visual assumptions.
- Brush uses stronger outer borders, subtle internal guides, generous
  whitespace, and a note recommending suitable brush paper.

## 5. Architecture

### 5.1 Data model

Add:

```ts
type WorksheetProfile = "kids" | "adult" | "tablet" | "brush";

interface WorksheetProfilePreset {
  id: WorksheetProfile;
  defaultSize: number;
  minSize: number;
  maxSize: number;
  step: number;
  unit: "mm" | "px";
  defaultGrid: GridStyle;
  pageFormats: PageFormat[];
  practicePattern: PracticePattern;
}
```

`WorksheetSettings` gains:

- `profile`
- `cellSize`
- a page format that supports `tablet` in addition to A4 and US Letter

`gridDensity` is removed after snapshot migration.

### 5.2 Central profile registry

Create `src/features/worksheets/profiles.ts` as the only source of truth for:

- profile labels and descriptions;
- default, minimum, maximum, step, and unit;
- default grid style;
- compatible page formats;
- practice-cell rules;
- trace and guide presentation tokens;
- recommended writing-tool copy.

Components must not repeat these values.

### 5.3 Pure layout resolver

Replace `DENSITY_LAYOUTS` with a pure resolver:

```ts
resolveWorksheetLayout({
  profile,
  mode,
  cellSize,
  pageFormat,
  printMargin,
  showPinyin,
  showStrokeOrder,
  entries,
  strokeCounts,
}): WorksheetLayoutSpec
```

`WorksheetLayoutSpec` contains:

- physical or logical page dimensions;
- usable width and height;
- resolved cell size;
- horizontal and vertical gaps;
- practice cells per row;
- rows or weighted units per page;
- practice-cell pattern;
- stroke-frame size and frames per row;
- header, context, and footer measurements;
- total page count and page contents.

Every consumer uses this resolved object. No renderer independently decides
column counts or pagination.

### 5.4 Pagination

Practice pagination:

- splits entries into Han-character units;
- keeps normal multi-character words together when they fit;
- splits only when a word exceeds remaining page capacity;
- derives page capacity from measured layout metrics.

Learn pagination:

- accounts for actual stroke-frame rows;
- allows stroke frames to use a profile-specific size separate from the
  handwriting cell size;
- never clips characters with more than 8 or 16 strokes.

Test pagination:

- derives prompt count and answer-grid size from the selected profile;
- preserves one answer cell per Han character;
- supports large Brush answer cells without overflow.

## 6. Rendering

`WorksheetPaper` remains the common entry point, but its responsibilities are
reduced:

1. load and cache stroke data;
2. call the shared layout resolver;
3. render the resolved pages.

Profile-specific differences are expressed through the layout specification,
CSS custom properties, and `data-profile`, not four duplicated worksheet
components.

Recommended CSS properties include:

```css
--worksheet-cell-size
--worksheet-cell-gap
--worksheet-row-gap
--worksheet-guide-color
--worksheet-guide-width
--worksheet-trace-medium
--worksheet-trace-light
```

Physical print profiles use millimetres. Tablet uses logical pixels and a 3:4
page aspect ratio.

## 7. Generator Experience

### 7.1 Profile selector

Place the profile selector before Mode and Grid controls.

- Desktop: four equal profile cards in one row where space permits.
- Mobile: a two-by-two card grid.
- Each card shows profile name, writing tool, and default size.
- The selected card has a clear border, background, and check indicator.

### 7.2 Size control

After profile selection, display:

- a labelled slider;
- current numeric value and unit;
- minimum and maximum labels;
- a Reset to recommended action.

The slider cannot produce values outside the selected profile's safe range.

### 7.3 Atomic switching

Switching profiles performs one state update.

Preserve:

- vocabulary entries and ordering;
- title, name, and date;
- Learn, Practice, or Test mode;
- Pinyin and stroke-order visibility where compatible;
- difficulty.

Apply from the new profile:

- default size;
- default grid;
- compatible page format;
- profile presentation tokens.

If switching from Tablet to another profile, use the user's previous A4 or US
Letter choice when available; otherwise use A4.

### 7.4 Transition

- Crossfade only the on-screen preview wrapper for 150 ms.
- Do not animate the printable `.hs-paper` nodes.
- Respect `prefers-reduced-motion`.
- Keep the current preview page when it remains valid.
- Clamp to the final valid page when page count decreases.
- Do not reload vocabulary enrichment or already loaded stroke data.

## 8. Live Preview and Full Preview

The compact live preview must use the selected Mode and Profile. It may render
only the first resolved page or a bounded subset, but it cannot substitute
Practice mode for Learn or Test.

The full preview displays:

- profile name;
- page format;
- resolved page count;
- profile-specific primary action.

For Tablet:

- primary action: `Download for GoodNotes`;
- physical Print remains secondary or hidden;
- page format is `Tablet 3:4`.

For print profiles:

- primary action remains PDF download;
- physical Print remains available.

`Show answers` becomes an answer-visibility setting and does not change Mode.

## 9. PDF and Print

### 9.1 Page formats

Support:

- A4 portrait: 210 × 297 mm;
- US Letter portrait: 215.9 × 279.4 mm;
- Tablet portrait: 3:4 logical page.

The Tablet PDF may use a custom jsPDF page size that preserves the 3:4 ratio.
Its rendered capture must remain sharp enough for stylus annotation without
creating excessive browser memory use.

### 9.2 Consistency

The PDF exporter and browser print stylesheet consume the same layout metrics
used by preview.

Fixed percentage header cropping must be replaced or verified against
profile-specific header measurements so that different profile rows cannot be
cropped.

## 10. Template Integration

Add `recommendedProfile` to `WorksheetTemplate`.

Initial recommendations:

- templates explicitly aimed at ages 4–8: Kids;
- HSK and Teens & Adults templates: Adult;
- ambiguous all-age topic templates: Adult unless manually classified;
- no existing content template defaults to Tablet or Brush unless it is
  intentionally curated for that medium.

Template links pass `profile` to the generator. Template thumbnails and detail
page examples render using the recommended profile.

Do not create indexable SEO pages for every Template × Profile × Mode
combination. Existing template pages remain canonical content pages.

## 11. Snapshot Migration

Upgrade worksheet snapshots to version 2.

Normalize version 1 values:

- `standard` → Kids, 22 mm;
- `compact` → Adult, 16 mm;
- `large` → Kids, 24 mm.

Unknown or malformed profile and size values fall back to the Kids default.
Size values are clamped to the selected profile's safe range.

Snapshot parsing must validate settings instead of trusting a TypeScript cast.

## 12. File-Level Change Plan

- `types.ts`: profile, page format, settings, snapshot v2.
- `profiles.ts`: central profile registry and helpers.
- `layout.ts`: physical layout resolver and profile-aware pagination.
- `worksheet-paper.tsx`: consume `WorksheetLayoutSpec`; correct compact preview.
- `generator-client.tsx`: profile cards, size slider, atomic switching.
- `print-preview-client.tsx`: profile display, Tablet action, answer visibility.
- `pdf.ts`: Tablet page size and profile-safe capture/header handling.
- `print.ts`: profile and page-format data attributes.
- `globals.css`: profile variables, physical sizes, Tablet ratio, print rules.
- `data.ts`: template recommendations.
- `worksheet-miniature.tsx`: profile-aware thumbnails.
- template and homepage components: pass and display profile information.
- generator route: validate `profile` and optional size query parameters.
- tests: profile, layout, migration, PDF, print, and switch coverage.

## 13. Verification

### 13.1 Unit tests

- registry defaults and range boundaries for all four profiles;
- size clamping and invalid-value fallback;
- resolved practice patterns;
- all entries preserved exactly once after pagination;
- multi-character word grouping;
- Learn stroke rows beyond 8 and 16 strokes;
- Test answer-cell allocation;
- snapshot v1 migration and v2 normalization;
- A4, US Letter, and Tablet PDF sizes.

### 13.2 Layout matrix

Exercise:

- four profiles;
- three modes;
- minimum, default, and maximum size;
- A4 and US Letter where supported;
- normal and narrow margins;
- Pinyin on and off;
- stroke order on and off.

Every case must satisfy:

- no horizontal overflow;
- no vertical clipping;
- no lost or duplicated characters;
- minimum practice pattern preserved;
- preview page count equals exported page count.

### 13.3 Visual and end-to-end checks

- desktop and mobile profile selector;
- profile switching without vocabulary loss;
- live preview accurately represents all three modes;
- first and final pages of multi-page worksheets;
- PDF export for Kids, Adult, Tablet, and Brush;
- physical-size measurement of 22 mm, 14 mm, and 40 mm sample cells;
- reduced-motion behavior;
- existing test suite, TypeScript check, and production build.

## 14. Rollout

Implementation order:

1. profile registry, types, and snapshot normalization;
2. pure layout resolver and unit tests;
3. worksheet rendering and accurate compact preview;
4. generator selector and switching behavior;
5. PDF, print, and Tablet format;
6. template, homepage, and thumbnail integration;
7. full visual, PDF, and build verification.

The change is complete only when all consumers use the shared layout result and
the old `GridDensity` behavior is no longer reachable.
