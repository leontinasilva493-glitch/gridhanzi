import assert from "node:assert/strict";
import test from "node:test";

import { normalizeWorksheetSnapshot } from "./snapshot";
import { defaultWorksheetSettings } from "./types";

test("normalizes legacy density snapshots into version 2 profiles", () => {
  const compact = normalizeWorksheetSnapshot({
    version: 1,
    entries: [],
    settings: {
      ...defaultWorksheetSettings,
      gridDensity: "compact",
    },
  });
  const large = normalizeWorksheetSnapshot({
    version: 1,
    entries: [],
    settings: {
      ...defaultWorksheetSettings,
      gridDensity: "large",
    },
  });

  assert.equal(compact.version, 2);
  assert.equal(compact.settings.profile, "adult");
  assert.equal(compact.settings.cellSize, 16);
  assert.equal(large.settings.profile, "kids");
  assert.equal(large.settings.cellSize, 24);
});

test("normalizes and clamps version 2 profile settings", () => {
  const normalized = normalizeWorksheetSnapshot({
    version: 2,
    entries: [],
    settings: {
      ...defaultWorksheetSettings,
      profile: "brush",
      cellSize: 100,
      paperSize: "tablet",
    },
  });

  assert.equal(normalized.settings.profile, "brush");
  assert.equal(normalized.settings.cellSize, 45);
  assert.equal(normalized.settings.paperSize, "a4");
  assert.equal(normalized.settings.grid, "tian");
});

test("invalid snapshot input falls back to safe defaults", () => {
  const normalized = normalizeWorksheetSnapshot({
    version: 2,
    entries: "not-an-array",
    settings: {
      profile: "unknown",
      cellSize: -1,
    },
  });

  assert.deepEqual(normalized.entries, []);
  assert.equal(normalized.settings.profile, "kids");
  assert.equal(normalized.settings.cellSize, 22);
});

test("normalizes new practice controls and migrates the legacy stroke toggle", () => {
  const current = normalizeWorksheetSnapshot({
    version: 2,
    entries: [],
    settings: {
      ...defaultWorksheetSettings,
      practiceStrength: "guided",
      extraBlankRows: 1,
      strokeOrderMode: "compact",
    },
  });
  const legacyOff = normalizeWorksheetSnapshot({
    version: 2,
    entries: [],
    settings: {
      ...defaultWorksheetSettings,
      showStrokeOrder: false,
      strokeOrderMode: undefined,
    },
  });
  const invalid = normalizeWorksheetSnapshot({
    version: 2,
    entries: [],
    settings: {
      ...defaultWorksheetSettings,
      practiceStrength: "maximum",
      extraBlankRows: 9,
      strokeOrderMode: "sometimes",
    },
  });

  assert.equal(current.settings.practiceStrength, "guided");
  assert.equal(current.settings.extraBlankRows, 1);
  assert.equal(current.settings.strokeOrderMode, "compact");
  assert.equal(legacyOff.settings.strokeOrderMode, "off");
  assert.equal(invalid.settings.practiceStrength, "balanced");
  assert.equal(invalid.settings.extraBlankRows, 0);
  assert.equal(invalid.settings.strokeOrderMode, "detailed");
});
