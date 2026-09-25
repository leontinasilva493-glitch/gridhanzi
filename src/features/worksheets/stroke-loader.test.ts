import assert from "node:assert/strict";
import test from "node:test";
import { createStrokeLoader, withDeadline } from "./stroke-loader";

test("one hanging character does not block successes, and can be retried", async () => {
  let attempts = 0;
  const load = createStrokeLoader(async (char) => {
    if (char === "你" && ++attempts === 1) return new Promise<string[]>(() => {});
    return [char];
  }, 10);
  assert.deepEqual(await Promise.all([load("你"), load("好")]), [null, ["好"]]);
  assert.deepEqual(await load("你"), ["你"]);
});
test("successful and in-flight loads are shared across previews", async () => {
  let requests = 0;
  const load = createStrokeLoader(async () => { requests++; return ["stroke"]; });
  await Promise.all([load("好"), load("好")]);
  await load("好");
  assert.equal(requests, 1);
});
test("rejections, synchronous throws, and module timeouts safely degrade", async () => {
  const load = createStrokeLoader(() => { throw new Error("offline"); });
  assert.equal(await load("你"), null);
  assert.equal(await withDeadline(new Promise(() => {}), null, 5), null);
  assert.equal(await withDeadline(Promise.reject(new Error("chunk failed")), null), null);
});

test("timed-out requests are aborted so a long worksheet can retry", async () => {
  let aborted = 0;
  const load = createStrokeLoader((_character, signal) => new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => { aborted++; reject(new Error("aborted")); });
  }), 5);
  assert.deepEqual(await Promise.all([load("你"), load("好")]), [null, null]);
  assert.equal(aborted, 2);
});
