import assert from "node:assert/strict";
import test from "node:test";

import {
  clampWorksheetCellSize,
  getWorksheetProfilePreset,
  parseWorksheetProfile,
  worksheetProfilePresets,
} from "./profiles";

test("profile presets expose the approved defaults and safe ranges", () => {
  assert.deepEqual(worksheetProfilePresets.kids.size, {
    default: 22,
    min: 20,
    max: 24,
    step: 1,
    unit: "mm",
  });
  assert.deepEqual(worksheetProfilePresets.adult.size, {
    default: 14,
    min: 12,
    max: 16,
    step: 1,
    unit: "mm",
  });
  assert.deepEqual(worksheetProfilePresets.tablet.size, {
    default: 112,
    min: 96,
    max: 128,
    step: 8,
    unit: "px",
  });
  assert.deepEqual(worksheetProfilePresets.brush.size, {
    default: 40,
    min: 35,
    max: 45,
    step: 5,
    unit: "mm",
  });
  assert.equal(worksheetProfilePresets.brush.defaultGrid, "mi");
});

test("cell size clamps and snaps inside the selected profile", () => {
  assert.equal(clampWorksheetCellSize("adult", 9), 12);
  assert.equal(clampWorksheetCellSize("adult", 14.4), 14);
  assert.equal(clampWorksheetCellSize("tablet", 117), 120);
  assert.equal(clampWorksheetCellSize("brush", 99), 45);
  assert.equal(clampWorksheetCellSize("kids", Number.NaN), 22);
});

test("profile parsing accepts only supported values", () => {
  assert.equal(parseWorksheetProfile("kids"), "kids");
  assert.equal(parseWorksheetProfile("tablet"), "tablet");
  assert.equal(parseWorksheetProfile("unknown"), "kids");
  assert.equal(parseWorksheetProfile(undefined), "kids");
  assert.equal(getWorksheetProfilePreset("adult").label, "Adult");
});
