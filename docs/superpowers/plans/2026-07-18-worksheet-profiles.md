# Worksheet Profiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace density presets with Kids, Adult, Tablet, and Brush worksheet profiles whose physical layout is shared by preview, PDF, print, and template thumbnails.

**Architecture:** A central profile registry defines safe values and presentation defaults. A pure layout resolver converts profile, page, margin, mode, and cell size into a `WorksheetLayoutSpec`; all renderers consume that result. Tablet exports a 3:4 annotation-ready PDF and does not add an in-browser drawing canvas.

**Tech Stack:** TypeScript, React 19, Vinext/Next App Router, Tailwind CSS, Hanzi Writer, html2canvas-pro, jsPDF, Node test runner.

## Global Constraints

- Keep Template, Profile, and Mode as independent concepts.
- Profiles are `kids`, `adult`, `tablet`, and `brush`.
- Modes remain Learn, Practice, and Test for every profile.
- Kids: 22 mm default, 20–24 mm range, 1 mm step.
- Adult: 14 mm default, 12–16 mm range, 1 mm step.
- Tablet: 112 px default, 96–128 px range, 8 px step, 3:4 PDF.
- Brush: 40 mm default, 35–45 mm range, 5 mm step.
- Do not add dependencies.
- Do not add in-browser handwriting.
- Preserve entries and content settings during profile switches.
- Existing public template URLs remain canonical; do not generate profile combinations.

---

### Task 1: Profile Registry and Snapshot Model

**Files:**
- Create: `src/features/worksheets/profiles.ts`
- Create: `src/features/worksheets/profiles.test.ts`
- Create: `src/features/worksheets/snapshot.ts`
- Create: `src/features/worksheets/snapshot.test.ts`
- Modify: `src/features/worksheets/types.ts`

**Interfaces:**
- Produces: `worksheetProfilePresets`, `getWorksheetProfilePreset()`, `clampWorksheetCellSize()`, `normalizeWorksheetSnapshot()`.
- Consumes: existing grid, mode, entry, margin, and worksheet setting types.

- [ ] **Step 1: Write failing profile tests**

```ts
test("profile presets expose approved defaults and safe ranges", () => {
  assert.deepEqual(worksheetProfilePresets.kids.size, {
    default: 22,
    min: 20,
    max: 24,
    step: 1,
    unit: "mm",
  });
  assert.equal(worksheetProfilePresets.brush.defaultGrid, "mi");
});

test("cell size clamps and snaps inside the selected profile", () => {
  assert.equal(clampWorksheetCellSize("adult", 9), 12);
  assert.equal(clampWorksheetCellSize("tablet", 117), 120);
  assert.equal(clampWorksheetCellSize("brush", 99), 45);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `pnpm test`

Expected: FAIL because `profiles.ts` and the new exports do not exist.

- [ ] **Step 3: Implement profile and setting types**

```ts
export type WorksheetProfile = "kids" | "adult" | "tablet" | "brush";
export type PaperSize = "a4" | "letter" | "tablet";

export interface WorksheetSettings {
  profile: WorksheetProfile;
  cellSize: number;
  mode: WorksheetMode;
  grid: GridStyle;
  showPinyin: boolean;
  showStrokeOrder: boolean;
  paperSize: PaperSize;
  difficulty: WorksheetDifficulty;
  printMargin: PrintMargin;
  title: string;
  studentName: string;
  date: string;
}
```

- [ ] **Step 4: Implement registry and clamping**

```ts
export const worksheetProfilePresets = {
  kids: { size: { default: 22, min: 20, max: 24, step: 1, unit: "mm" }, defaultGrid: "tian" },
  adult: { size: { default: 14, min: 12, max: 16, step: 1, unit: "mm" }, defaultGrid: "tian" },
  tablet: { size: { default: 112, min: 96, max: 128, step: 8, unit: "px" }, defaultGrid: "tian" },
  brush: { size: { default: 40, min: 35, max: 45, step: 5, unit: "mm" }, defaultGrid: "mi" },
} as const;
```

- [ ] **Step 5: Add snapshot migration tests and implementation**

```ts
test("normalizes legacy density snapshots into version 2 profiles", () => {
  const normalized = normalizeWorksheetSnapshot({
    version: 1,
    entries: [],
    settings: { ...legacySettings, gridDensity: "compact" },
  });
  assert.equal(normalized.settings.profile, "adult");
  assert.equal(normalized.settings.cellSize, 16);
});
```

Map `standard → kids/22`, `compact → adult/16`, and `large → kids/24`.
Validate profile and size at runtime and return a version 2 snapshot.

- [ ] **Step 6: Run tests and commit**

Run: `pnpm test`

Expected: PASS.

Commit: `feat: add worksheet profile model`

### Task 2: Shared Physical Layout Resolver

**Files:**
- Modify: `src/features/worksheets/layout.ts`
- Modify: `src/features/worksheets/layout.test.ts`

**Interfaces:**
- Consumes: `WorksheetSettings`, `WorksheetProfilePreset`, entries, and stroke counts.
- Produces: `resolveWorksheetLayout()`, profile-aware `buildPracticeCells()`, and pagination functions.

- [ ] **Step 1: Replace density tests with failing profile-layout tests**

```ts
test("default profile sizes resolve to useful A4 column counts", () => {
  assert.equal(resolveWorksheetLayout(settings("kids")).practiceColumns, 8);
  assert.equal(resolveWorksheetLayout(settings("adult")).practiceColumns, 12);
  assert.equal(resolveWorksheetLayout(settings("brush")).practiceColumns, 4);
  assert.equal(resolveWorksheetLayout(settings("tablet")).practiceColumns, 6);
});

test("practice patterns preserve each profile teaching minimum", () => {
  assert.deepEqual(
    buildPracticeCells("家", resolveWorksheetLayout(settings("kids")))
      .slice(0, 3)
      .map((cell) => cell.kind),
    ["model", "trace", "trace"],
  );
  assert.deepEqual(
    buildPracticeCells("家", resolveWorksheetLayout(settings("brush")))
      .map((cell) => cell.kind),
    ["model", "trace", "blank", "blank"],
  );
});
```

- [ ] **Step 2: Run and verify RED**

Run: `pnpm test`

Expected: FAIL because the resolver API is missing.

- [ ] **Step 3: Implement page and profile metrics**

Use:

```ts
const PAGE_METRICS = {
  a4: { width: 210, height: 297, unit: "mm" },
  letter: { width: 215.9, height: 279.4, unit: "mm" },
  tablet: { width: 834, height: 1112, unit: "px" },
} as const;
```

Normal margins are 11 mm or 40 px; narrow margins are 7 mm or 28 px. Resolve
columns using `floor((usableWidth + gap) / (cellSize + gap))`, except Brush,
which is fixed at four centered cells.

- [ ] **Step 4: Implement layout-driven pagination**

`WorksheetLayoutSpec` includes page metrics, margins, cell and gap sizes,
practice columns, rows per page, test entries per page, stroke cell size, and
stroke frames per row.

Practice uses resolved rows per page. Learn accounts for writing and actual
stroke-frame rows. Test uses profile capacities: Kids 8, Adult 10, Tablet 6,
Brush 4.

- [ ] **Step 5: Run tests and commit**

Run: `pnpm test`

Expected: all pagination and profile tests PASS.

Commit: `feat: resolve worksheet layouts by profile`

### Task 3: Unified Worksheet Rendering

**Files:**
- Modify: `src/features/worksheets/components/worksheet-paper.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/features/worksheets/print.ts`
- Modify: `src/features/worksheets/print.test.ts`

**Interfaces:**
- Consumes: `resolveWorksheetLayout()` and normalized settings.
- Produces: profile-accurate compact and full page rendering.

- [ ] **Step 1: Add failing paper-attribute tests**

```ts
assert.deepEqual(getWorksheetPaperAttributes(settings, true), {
  "data-paper-size": "tablet",
  "data-print-margin": "normal",
  "data-background": "true",
  "data-profile": "tablet",
  "data-cell-size": "112",
});
```

- [ ] **Step 2: Run and verify RED**

Run: `pnpm test`

Expected: FAIL because profile attributes are absent.

- [ ] **Step 3: Render every mode through the shared layout**

Remove the compact-preview branch that substitutes Practice for Learn and Test.
Compact preview renders the first resolved page of the selected mode. Use
layout-derived columns and centered percentage widths so preview scales while
printed physical size remains correct.

- [ ] **Step 4: Add profile CSS**

Use `data-profile` for guide color, trace opacity, and border weight. Add the
Tablet 3:4 page aspect ratio and keep print nodes free from transitions.

- [ ] **Step 5: Run tests and commit**

Run: `pnpm test`

Expected: PASS.

Commit: `feat: render profile-aware worksheet pages`

### Task 4: Generator Profile Switching

**Files:**
- Modify: `src/features/worksheets/components/generator-client.tsx`
- Modify: `src/app/[locale]/generator/page.tsx`

**Interfaces:**
- Consumes: profile registry and normalized worksheet settings.
- Produces: profile cards, bounded size slider, and atomic switching.

- [ ] **Step 1: Add route/profile helper tests**

Test a pure `parseWorksheetProfile()` helper with valid and invalid query
values before wiring the page.

- [ ] **Step 2: Run and verify RED**

Run: `pnpm test`

Expected: FAIL because `parseWorksheetProfile()` is missing.

- [ ] **Step 3: Implement profile cards and slider**

Use four cards in a desktop row and a mobile two-by-two grid. Switching profile
preserves content and Mode but applies default size, grid, and compatible page
format in one `setSettings()` call.

- [ ] **Step 4: Add preview crossfade**

Apply a 150 ms opacity transition to a non-print wrapper keyed by profile and
respect `prefers-reduced-motion`. Do not key or remount the stroke-data loader.

- [ ] **Step 5: Run tests and commit**

Run: `pnpm test && pnpm exec tsc --noEmit`

Expected: PASS with no type errors.

Commit: `feat: add worksheet profile switching`

### Task 5: Preview, PDF, and Print Output

**Files:**
- Modify: `src/features/worksheets/components/print-preview-client.tsx`
- Modify: `src/features/worksheets/pdf.ts`
- Modify: `src/features/worksheets/pdf.test.ts`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `PaperSize` including `tablet`, profile settings, and resolved pages.
- Produces: Tablet 3:4 PDFs and answer visibility independent of Mode.

- [ ] **Step 1: Write failing Tablet PDF tests**

```ts
assert.deepEqual(getPdfPageSize("tablet"), {
  format: [153.6, 204.8],
  widthMm: 153.6,
  heightMm: 204.8,
});
```

- [ ] **Step 2: Run and verify RED**

Run: `pnpm test`

Expected: FAIL because Tablet PDF size is unsupported.

- [ ] **Step 3: Add Tablet PDF and preview controls**

Add custom jsPDF format. Show `Tablet 3:4` in the toolbar. Use `Download for
GoodNotes` as Tablet's primary copy and hide the physical Print button.

- [ ] **Step 4: Separate answer visibility**

Do not set `mode: "quiz"` when answers are hidden. Pass an
`answerVisibility` flag to rendering so model, trace, and stroke-order content
can be hidden without changing layout.

- [ ] **Step 5: Run tests and commit**

Run: `pnpm test && pnpm exec tsc --noEmit`

Expected: PASS.

Commit: `feat: export tablet worksheet PDFs`

### Task 6: Template and Homepage Integration

**Files:**
- Modify: `src/features/worksheets/types.ts`
- Modify: `src/features/worksheets/data.ts`
- Modify: `src/features/worksheets/templates.test.ts`
- Modify: `src/features/worksheets/components/worksheet-miniature.tsx`
- Modify: `src/features/worksheets/components/template-detail-page.tsx`
- Modify: `src/features/worksheets/components/templates-page.tsx`
- Modify: `src/features/worksheets/components/home-page.tsx`

**Interfaces:**
- Consumes: `recommendedProfile` and profile-aware `WorksheetMiniature`.
- Produces: profile-aware template previews and generator links.

- [ ] **Step 1: Write failing recommendation tests**

```ts
for (const template of worksheetTemplates) {
  assert.ok(["kids", "adult", "tablet", "brush"].includes(template.recommendedProfile));
}
assert.equal(getTemplateBySlug("family")?.recommendedProfile, "kids");
assert.equal(getTemplateBySlug("hsk-1")?.recommendedProfile, "adult");
```

- [ ] **Step 2: Run and verify RED**

Run: `pnpm test`

Expected: FAIL because recommendations are absent.

- [ ] **Step 3: Add recommendations and profile-aware links**

Age 4–8 templates use Kids. HSK and Teens & Adults use Adult. Ambiguous topic
templates use Adult unless manually marked Kids. Existing templates do not
default to Tablet or Brush.

- [ ] **Step 4: Run tests and commit**

Run: `pnpm test && pnpm exec tsc --noEmit`

Expected: PASS.

Commit: `feat: recommend profiles for worksheet templates`

### Task 7: Full Verification and Review

**Files:**
- Modify only if verification exposes a tested defect.

**Interfaces:**
- Consumes: complete implementation.
- Produces: verified release candidate.

- [ ] **Step 1: Run automated verification**

Run:

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

Expected: all tests pass, TypeScript exits 0, production build exits 0.

- [ ] **Step 2: Run source and diff review**

Run:

```bash
git diff --check
git status --short
git diff --stat origin/main...HEAD
rg -n "GridDensity|gridDensity|Large · 6|Standard · 8|Compact · 10" src
```

Expected: no whitespace errors and no reachable legacy density UI or types.

- [ ] **Step 3: Perform browser and PDF checks**

Verify desktop and mobile generator layouts, all four profile switches, all
three modes, A4/Letter/Tablet page ratios, page counts, and one exported PDF per
profile. Confirm no character loss and no visible clipping.

- [ ] **Step 4: Final commit**

Commit only verified fixes, then report commits, files changed, tests, build,
visual checks, and residual risks.
