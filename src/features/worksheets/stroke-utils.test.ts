import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCumulativeStrokeFrames,
  resolveStrokeCount,
  selectStrokeFrames,
} from "./stroke-utils";

test("buildCumulativeStrokeFrames returns one cumulative frame per stroke", () => {
  assert.deepEqual(buildCumulativeStrokeFrames(["a", "b", "c"]), [
    ["a"],
    ["a", "b"],
    ["a", "b", "c"],
  ]);
});

test("buildCumulativeStrokeFrames limits printable cards without losing order", () => {
  const strokes = Array.from({ length: 12 }, (_, index) => `stroke-${index + 1}`);

  assert.deepEqual(buildCumulativeStrokeFrames(strokes, 8).at(-1), strokes.slice(0, 8));
  assert.equal(buildCumulativeStrokeFrames(strokes, 8).length, 8);
});

test("selectStrokeFrames keeps milestones for compact mode and the final shape", () => {
  const frames = Array.from({ length: 10 }, (_, index) => index + 1);

  assert.deepEqual(selectStrokeFrames(frames, "compact"), [1, 4, 7, 10]);
  assert.deepEqual(selectStrokeFrames(frames, "detailed"), frames);
  assert.deepEqual(selectStrokeFrames(frames, "off"), []);
});

test("loaded character data replaces an unavailable editorial stroke count", () => {
  assert.equal(resolveStrokeCount(2, 0), 2);
  assert.equal(resolveStrokeCount(undefined, 7), 7);
  assert.equal(resolveStrokeCount(0, 0), 0);
});
