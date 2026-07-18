import assert from "node:assert/strict";
import test from "node:test";

import { buildCumulativeStrokeFrames } from "./stroke-utils";

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

