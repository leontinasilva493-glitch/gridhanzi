import assert from "node:assert/strict";
import test from "node:test";

import {
  addRecentHandwritingCharacter,
  extractHanziLookupMatches,
  normalizeCanvasPoint,
  resolveStrokeOrderLookupCharacter,
  sanitizeHandwritingMatches,
  simplifyHandwritingStroke,
  shouldRequestHandwritingRecognition,
  toHanziLookupStrokes,
} from "./handwriting-input";

test("canvas points are normalized to a stable 1000-unit writing surface", () => {
  assert.deepEqual(
    normalizeCanvasPoint({
      clientX: 175,
      clientY: 250,
      bounds: { left: 50, top: 100, width: 250, height: 300 },
    }),
    { x: 500, y: 500 },
  );

  assert.deepEqual(
    normalizeCanvasPoint({
      clientX: 20,
      clientY: 450,
      bounds: { left: 50, top: 100, width: 250, height: 300 },
    }),
    { x: 0, y: 1000 },
  );
});

test("stroke simplification preserves corners while removing redundant samples", () => {
  const simplified = simplifyHandwritingStroke(
    [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
      { x: 40, y: 0 },
      { x: 60, y: 0 },
      { x: 60, y: 20 },
      { x: 60, y: 40 },
    ],
    2,
  );

  assert.deepEqual(simplified, [
    { x: 0, y: 0 },
    { x: 60, y: 0 },
    { x: 60, y: 40 },
  ]);
});

test("candidate cleanup keeps unique Han characters in score order", () => {
  assert.deepEqual(
    sanitizeHandwritingMatches(
      ["十", "+", "十", "卜", "A", "千", "中国", "𠀀"],
      3,
    ),
    ["十", "卜", "千"],
  );
});

test("recent handwriting choices are unique, newest first, and bounded", () => {
  assert.deepEqual(
    addRecentHandwritingCharacter(["你", "好", "学"], "好", 3),
    ["好", "你", "学"],
  );
  assert.deepEqual(
    addRecentHandwritingCharacter(["你", "好", "学"], "中", 3),
    ["中", "你", "好"],
  );
});

test("stroke-order lookup restores one Han character and rejects other input", () => {
  assert.equal(resolveStrokeOrderLookupCharacter(" 学 "), "学");
  assert.equal(resolveStrokeOrderLookupCharacter("中文"), "中");
  assert.equal(resolveStrokeOrderLookupCharacter("ABC"), "永");
  assert.equal(resolveStrokeOrderLookupCharacter(undefined), "永");
});

test("WASM lookup results are validated before becoming candidate buttons", () => {
  assert.deepEqual(
    extractHanziLookupMatches([
      { hanzi: "十", score: 0.91 },
      { hanzi: "+", score: 0.82 },
      { hanzi: "卜", score: 0.71 },
      { hanzi: "十", score: 0.61 },
      null,
      { hanzi: "千" },
    ]),
    ["十", "卜", "千"],
  );
  assert.deepEqual(extractHanziLookupMatches({ matches: [] }), []);
});

test("responsive canvas strokes are scaled into the recognizer's 256-unit input space", () => {
  assert.deepEqual(
    toHanziLookupStrokes([
      [
        { x: 250, y: 500 },
        { x: 750, y: 500 },
      ],
      [
        { x: 500, y: 250 },
        { x: 500, y: 750 },
      ],
    ]),
    [
      [
        [64, 128],
        [192, 128],
      ],
      [
        [128, 64],
        [128, 192],
      ],
    ],
  );
});

test("an empty candidate result is not requested again until strokes change", () => {
  assert.equal(shouldRequestHandwritingRecognition("ready", 2, 1), true);
  assert.equal(shouldRequestHandwritingRecognition("ready", 2, 2), false);
  assert.equal(shouldRequestHandwritingRecognition("loading", 2, 1), false);
  assert.equal(shouldRequestHandwritingRecognition("ready", 0, -1), false);
});
