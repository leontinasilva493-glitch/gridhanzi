import assert from "node:assert/strict";
import test from "node:test";

import {
  advanceTraceProgress,
  getPointAtProgress,
  isTraceStrokeComplete,
  mapHanziMedianToSurface,
  projectPointToPolyline,
} from "./stroke-trace";

test("pointer projection reports its nearest template position and progress", () => {
  const projection = projectPointToPolyline(
    { x: 50, y: 10 },
    [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ],
  );

  assert.ok(Math.abs(projection.distance - 10) < 0.001);
  assert.ok(Math.abs(projection.progress - 0.5) < 0.001);
  assert.deepEqual(projection.point, { x: 50, y: 0 });
  assert.equal(projection.polylineLength, 100);
});

test("projection progress follows total distance across bent template strokes", () => {
  const projection = projectPointToPolyline(
    { x: 108, y: 50 },
    [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ],
  );

  assert.ok(Math.abs(projection.distance - 8) < 0.001);
  assert.ok(Math.abs(projection.progress - 0.75) < 0.001);
});

test("trace progress pauses when the pointer leaves the template tolerance", () => {
  const projection = projectPointToPolyline(
    { x: 50, y: 50 },
    [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ],
  );

  assert.equal(
    advanceTraceProgress({
      currentProgress: 0.2,
      projection,
      cursorTravel: 30,
      tolerance: 36,
    }),
    0.2,
  );
});

test("trace progress follows pointer speed without jumping far ahead", () => {
  const projection = projectPointToPolyline(
    { x: 80, y: 0 },
    [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ],
  );
  const next = advanceTraceProgress({
    currentProgress: 0.2,
    projection,
    cursorTravel: 10,
    tolerance: 36,
  });

  assert.ok(next > 0.2);
  assert.ok(next <= 0.35, "a 10px cursor move must not jump to 80% completion");
});

test("trace progress never moves backwards", () => {
  const projection = projectPointToPolyline(
    { x: 30, y: 0 },
    [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ],
  );

  assert.equal(
    advanceTraceProgress({
      currentProgress: 0.6,
      projection,
      cursorTravel: 20,
      tolerance: 36,
    }),
    0.6,
  );
});

test("trace completion and marker position use the same template progress", () => {
  const points = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
  ];

  assert.deepEqual(getPointAtProgress(points, 0.25), { x: 25, y: 0 });
  assert.equal(isTraceStrokeComplete(0.95), false);
  assert.equal(isTraceStrokeComplete(0.96), true);
});

test("Hanzi medians map to the padded 300px practice surface", () => {
  const points = mapHanziMedianToSurface([
    [0, -124],
    [1024, 900],
  ]);

  assert.ok(Math.abs(points[0].x - 18) < 0.01);
  assert.ok(Math.abs(points[0].y - 282) < 0.01);
  assert.ok(Math.abs(points[1].x - 282) < 0.01);
  assert.ok(Math.abs(points[1].y - 18) < 0.01);
});
