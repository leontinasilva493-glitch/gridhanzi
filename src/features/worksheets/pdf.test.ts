import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWorksheetPdfFilename,
  getPdfCaptureGeometry,
  getPdfHeaderCropHeight,
  getPdfPageSize,
} from "./pdf";

test("buildWorksheetPdfFilename creates a safe useful filename", () => {
  assert.equal(
    buildWorksheetPdfFilename("Family / 我的家人"),
    "family-我的家人-worksheet.pdf",
  );
  assert.equal(buildWorksheetPdfFilename("  "), "chinese-worksheet.pdf");
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
});

test("PDF capture geometry resets every worksheet page to its own origin", () => {
  assert.deepEqual(getPdfCaptureGeometry({ width: 706.4, height: 998.7 }), {
    width: 706,
    height: 999,
    scrollX: 0,
    scrollY: 0,
  });
});

test("PDF header crop stays above the first worksheet row", () => {
  assert.equal(getPdfHeaderCropHeight(1263), 145);
});
