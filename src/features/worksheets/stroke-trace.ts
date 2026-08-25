export type TracePoint = {
  x: number;
  y: number;
};

export type TraceProjection = {
  point: TracePoint;
  distance: number;
  progress: number;
  polylineLength: number;
};

const HANZI_DATA_SIZE = 1024;
const HANZI_DATA_TOP = 900;
const COMPLETE_PROGRESS = 0.96;

export function projectPointToPolyline(
  pointer: TracePoint,
  polyline: readonly TracePoint[],
): TraceProjection {
  if (polyline.length === 0) {
    return {
      point: pointer,
      distance: Number.POSITIVE_INFINITY,
      progress: 0,
      polylineLength: 0,
    };
  }

  if (polyline.length === 1) {
    return {
      point: polyline[0],
      distance: distance(pointer, polyline[0]),
      progress: 0,
      polylineLength: 0,
    };
  }

  const segmentLengths: number[] = [];
  let polylineLength = 0;
  for (let index = 1; index < polyline.length; index += 1) {
    const segmentLength = distance(polyline[index - 1], polyline[index]);
    segmentLengths.push(segmentLength);
    polylineLength += segmentLength;
  }

  let bestPoint = polyline[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestDistanceAlong = 0;
  let distanceBeforeSegment = 0;

  for (let index = 1; index < polyline.length; index += 1) {
    const start = polyline[index - 1];
    const end = polyline[index];
    const segmentLength = segmentLengths[index - 1];
    const segmentLengthSquared = segmentLength * segmentLength;
    const amount =
      segmentLengthSquared === 0
        ? 0
        : clamp(
            ((pointer.x - start.x) * (end.x - start.x) +
              (pointer.y - start.y) * (end.y - start.y)) /
              segmentLengthSquared,
            0,
            1,
          );
    const projected = {
      x: start.x + (end.x - start.x) * amount,
      y: start.y + (end.y - start.y) * amount,
    };
    const projectedDistance = distance(pointer, projected);

    if (projectedDistance < bestDistance) {
      bestDistance = projectedDistance;
      bestPoint = projected;
      bestDistanceAlong = distanceBeforeSegment + segmentLength * amount;
    }
    distanceBeforeSegment += segmentLength;
  }

  return {
    point: bestPoint,
    distance: bestDistance,
    progress: polylineLength === 0 ? 0 : bestDistanceAlong / polylineLength,
    polylineLength,
  };
}

export function advanceTraceProgress({
  currentProgress,
  projection,
  cursorTravel,
  tolerance,
}: {
  currentProgress: number;
  projection: TraceProjection;
  cursorTravel: number;
  tolerance: number;
}) {
  if (
    projection.distance > tolerance ||
    projection.progress <= currentProgress ||
    projection.progress < currentProgress - 0.02
  ) {
    return currentProgress;
  }

  const travelProgress =
    projection.polylineLength === 0
      ? 0
      : (Math.max(0, cursorTravel) / projection.polylineLength) * 1.2;
  const maximumProgress = currentProgress + travelProgress + 0.02;
  return clamp(Math.min(projection.progress, maximumProgress), currentProgress, 1);
}

export function getPointAtProgress(
  polyline: readonly TracePoint[],
  progress: number,
): TracePoint {
  if (polyline.length === 0) return { x: 0, y: 0 };
  if (polyline.length === 1 || progress <= 0) return polyline[0];
  if (progress >= 1) return polyline.at(-1)!;

  const lengths = [0];
  for (let index = 1; index < polyline.length; index += 1) {
    lengths.push(lengths[index - 1] + distance(polyline[index - 1], polyline[index]));
  }
  const totalLength = lengths.at(-1) ?? 0;
  if (totalLength === 0) return polyline[0];
  const targetLength = totalLength * progress;

  for (let index = 1; index < polyline.length; index += 1) {
    if (lengths[index] < targetLength) continue;
    const segmentLength = lengths[index] - lengths[index - 1];
    const amount = segmentLength === 0 ? 0 : (targetLength - lengths[index - 1]) / segmentLength;
    return {
      x: polyline[index - 1].x + (polyline[index].x - polyline[index - 1].x) * amount,
      y: polyline[index - 1].y + (polyline[index].y - polyline[index - 1].y) * amount,
    };
  }

  return polyline.at(-1)!;
}

export function isTraceStrokeComplete(progress: number) {
  return progress >= COMPLETE_PROGRESS;
}

export function mapHanziMedianToSurface(
  median: readonly (readonly number[])[],
  size = 300,
  padding = 18,
): TracePoint[] {
  const scale = (size - padding * 2) / HANZI_DATA_SIZE;
  return median
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y))
    .map(([x, y]) => ({
      x: padding + x * scale,
      y: padding + (HANZI_DATA_TOP - y) * scale,
    }));
}

function distance(first: TracePoint, second: TracePoint) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
