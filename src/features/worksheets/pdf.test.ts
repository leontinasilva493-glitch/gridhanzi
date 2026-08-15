import assert from "node:assert/strict";
import test from "node:test";

import * as pdfModule from "./pdf";

import {
  buildWorksheetPdfFilename,
  getPdfCaptureGeometry,
  getPdfCaptureGeometryFromPage,
  getPdfHeaderCropHeight,
  getPdfPageSize,
  prepareFlashcardCaptureClone,
  shouldRecomposeWorksheetPdfHeader,
} from "./pdf";

test("buildWorksheetPdfFilename creates a safe useful filename", () => {
  assert.equal(
    buildWorksheetPdfFilename("Family / 我的家人", "worksheet"),
    "family-我的家人-worksheet.pdf",
  );
  assert.equal(
    buildWorksheetPdfFilename("Family / 我的家人", "flashcards"),
    "family-我的家人-flashcards.pdf",
  );
  assert.equal(
    buildWorksheetPdfFilename("  ", "worksheet"),
    "chinese-worksheet.pdf",
  );
  assert.equal(
    buildWorksheetPdfFilename("  ", "flashcards"),
    "chinese-flashcards.pdf",
  );
});

test("getPdfPageSize maps worksheet paper settings to PDF dimensions", () => {
  assert.deepEqual(getPdfPageSize("a4"), {
    format: "a4",
    widthMm: 210,
    heightMm: 297,
  });
  assert.deepEqual(getPdfPageSize("letter"), {
    format: "letter",
    widthMm: 215.9,
    heightMm: 279.4,
  });
  assert.deepEqual(getPdfPageSize("tablet"), {
    format: [192, 256],
    widthMm: 192,
    heightMm: 256,
  });
});

test("PDF capture geometry resets every worksheet page to its own origin", () => {
  assert.deepEqual(getPdfCaptureGeometry({ width: 706.4, height: 998.7 }), {
    width: 706,
    height: 999,
    scrollX: 0,
    scrollY: 0,
  });
});

test("PDF capture geometry prefers unscaled layout size from offset dimensions", () => {
  assert.deepEqual(
    getPdfCaptureGeometryFromPage({
      offsetWidth: 794,
      offsetHeight: 1123,
      getBoundingClientRect() {
        return {
          width: 675.2,
          height: 954.6,
        };
      },
    }),
    {
      width: 794,
      height: 1123,
      scrollX: 0,
      scrollY: 0,
    },
  );
});

test("PDF capture geometry falls back to bounding rect when offset size is unavailable", () => {
  assert.deepEqual(
    getPdfCaptureGeometryFromPage({
      offsetWidth: 0,
      offsetHeight: 0,
      getBoundingClientRect() {
        return {
          width: 706.4,
          height: 998.7,
        };
      },
    }),
    {
      width: 706,
      height: 999,
      scrollX: 0,
      scrollY: 0,
    },
  );
});

test("PDF header crop stays above the first worksheet row", () => {
  assert.equal(getPdfHeaderCropHeight(1263), 145);
});

test("flashcard PDF export skips worksheet header recomposition", () => {
  assert.equal(shouldRecomposeWorksheetPdfHeader("worksheet"), true);
  assert.equal(shouldRecomposeWorksheetPdfHeader("flashcards"), false);
});

test("PDF headers use the loaded Chinese web font with system fallbacks", () => {
  const getPdfHeaderFont = (
    pdfModule as unknown as Record<string, unknown>
  ).getPdfHeaderFont;

  assert.equal(typeof getPdfHeaderFont, "function");
  assert.equal(
    (getPdfHeaderFont as (sizePx: number) => string)(32),
    '500 32px Georgia, "LXGW WenKai GB Medium", "Noto Serif SC", serif',
  );
});

test("PDF export explicitly requests title glyphs before Canvas rendering", async () => {
  const loadPdfHeaderFont = (
    pdfModule as unknown as Record<string, unknown>
  ).loadPdfHeaderFont;
  const calls: Array<{ font: string; text: string }> = [];
  type TestFontSet = {
    load(font: string, text: string): Promise<unknown>;
  };
  const fonts: TestFontSet = {
    async load(font: string, text: string) {
      calls.push({ font, text });
      return [];
    },
  };

  assert.equal(typeof loadPdfHeaderFont, "function");
  await (
    loadPdfHeaderFont as (
      fonts: TestFontSet,
      title: string,
    ) => Promise<void>
  )(fonts, "家庭练习");
  assert.deepEqual(calls, [
    {
      font: '500 32px "LXGW WenKai GB Medium"',
      text: "家庭练习",
    },
  ]);
});

test("PDF export keeps system fallbacks when the web font cannot load", async () => {
  const loadPdfHeaderFont = (
    pdfModule as unknown as Record<string, unknown>
  ).loadPdfHeaderFont as (
    fonts: { load(font: string, text: string): Promise<unknown> },
    title: string,
  ) => Promise<void>;

  await assert.doesNotReject(() =>
    loadPdfHeaderFont(
      {
        async load() {
          throw new Error("font CDN unavailable");
        },
      },
      "家庭练习",
    ),
  );
});

test("prepareFlashcardCaptureClone recursively copies computed styles and preserves capture root overrides", () => {
  type PropertyTuple = [name: string, value: string, priority?: string];
  type FakeNode = {
    style: {
      setProperty(name: string, value: string, priority?: string): void;
      applied: PropertyTuple[];
    };
    children: FakeNode[];
  };

  const createTargetNode = (): FakeNode => {
    const applied: PropertyTuple[] = [];
    return {
      style: {
        applied,
        setProperty(name: string, value: string, priority = "") {
          applied.push([name, value, priority]);
        },
      },
      children: [],
    };
  };

  const rootTarget = createTargetNode();
  const childTarget = createTargetNode();
  rootTarget.children.push(childTarget);

  const rootSource: FakeNode = {
    style: rootTarget.style,
    children: [
      {
        style: childTarget.style,
        children: [],
      },
    ],
  };

  const computedStyles = new Map<object, Record<string, string>>([
    [
      rootSource,
      {
        display: "grid",
        "--card-gap": "12px",
        width: "794px",
        transform: "scale(0.9)",
      },
    ],
    [
      rootSource.children[0]!,
      {
        color: "rgb(20, 37, 63)",
        "font-size": "16px",
      },
    ],
  ]);

  const getComputedStyleForNode = (node: {
    style: { setProperty(name: string, value: string, priority?: string): void };
    children: ArrayLike<unknown>;
  }) => {
    const style = computedStyles.get(node) ?? {};
    const names = Object.keys(style);
    return {
      length: names.length,
      item(index: number) {
        return names[index] ?? null;
      },
      getPropertyValue(name: string) {
        return style[name] ?? "";
      },
      getPropertyPriority(_name: string) {
        return "";
      },
    };
  };

  prepareFlashcardCaptureClone(
    rootSource,
    rootTarget,
    getComputedStyleForNode,
  );

  assert.deepEqual(rootTarget.style.applied, [
    ["display", "grid", ""],
    ["--card-gap", "12px", ""],
    ["width", "794px", ""],
    ["transform", "scale(0.9)", ""],
    ["width", "100%", ""],
    ["height", "100%", ""],
    ["min-height", "0", ""],
    ["margin", "0", ""],
    ["transform", "none", ""],
    ["box-shadow", "none", ""],
  ]);
  assert.deepEqual(childTarget.style.applied, [
    ["color", "rgb(20, 37, 63)", ""],
    ["font-size", "16px", ""],
  ]);
});
