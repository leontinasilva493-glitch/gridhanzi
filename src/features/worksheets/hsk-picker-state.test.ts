import assert from "node:assert/strict";
import test from "node:test";

import {
  createHskPickerState,
  parseHskPickerState,
  resolveInitialHskPickerState,
} from "./hsk-picker-state";

test("round-trips a persisted HSK picker selection", () => {
  const persisted = createHskPickerState({
    system: "3.0",
    level: "7-9",
    query: "ai",
    theme: "hsk-3-campus-life",
    selectedIds: ["3.0:7-9:爱", "3.0:7-9:学习"],
  });

  const parsed = parseHskPickerState(JSON.stringify(persisted), {
    validIds: new Set(["3.0:7-9:爱", "3.0:7-9:学习"]),
    validThemes: new Set(["hsk-3-campus-life"]),
  });

  assert.deepEqual(parsed, persisted);
});

test("sanitizes malformed HSK picker values and drops unknown ids", () => {
  const parsed = parseHskPickerState(
    JSON.stringify({
      system: "9.9",
      level: "999",
      query: 123,
      theme: "unknown-theme",
      selectedIds: ["2.0:1:一", "missing", 42],
    }),
    {
      validIds: new Set(["2.0:1:一"]),
      validThemes: new Set(["hsk-3-campus-life"]),
    },
  );

  assert.equal(parsed.system, "2.0");
  assert.equal(parsed.level, "1");
  assert.equal(parsed.query, "");
  assert.equal(parsed.theme, "");
  assert.deepEqual(parsed.selectedIds, ["2.0:1:一"]);
});

test("switches invalid levels back to the first valid band for a system", () => {
  const parsed = parseHskPickerState(
    JSON.stringify({
      system: "2.0",
      level: "7-9",
      query: "family",
      theme: "",
      selectedIds: [],
    }),
  );

  assert.equal(parsed.system, "2.0");
  assert.equal(parsed.level, "1");
  assert.equal(parsed.query, "family");
});

test("explicit HSK query state overrides persisted filters and selection", () => {
  const persisted = JSON.stringify(
    createHskPickerState({
      system: "3.0",
      level: "7-9",
      query: "campus",
      theme: "hsk-3-campus-life",
      selectedIds: ["3.0:7-9:学习"],
    }),
  );

  const resolved = resolveInitialHskPickerState({
    persistedRaw: persisted,
    hasExplicitSelection: true,
    initialSystem: "2.0",
    initialLevel: "4",
  });

  assert.deepEqual(
    resolved,
    createHskPickerState({
      system: "2.0",
      level: "4",
      query: "",
      theme: "",
      selectedIds: [],
    }),
  );
});

test("persisted HSK state still loads when the generator URL has no explicit HSK query", () => {
  const persisted = JSON.stringify(
    createHskPickerState({
      system: "3.0",
      level: "6",
      query: "health",
      theme: "hsk-3-health",
      selectedIds: ["3.0:6:健康"],
    }),
  );

  const resolved = resolveInitialHskPickerState({
    persistedRaw: persisted,
    hasExplicitSelection: false,
  });

  assert.deepEqual(
    resolved,
    createHskPickerState({
      system: "3.0",
      level: "6",
      query: "health",
      theme: "hsk-3-health",
      selectedIds: ["3.0:6:健康"],
    }),
  );
});
