import assert from "node:assert/strict";
import test from "node:test";
import { createPdfExportGuard } from "./pdf-export-guard";

test("cancellation releases a stalled export and prevents subsequent work", async () => {
  const controller = new AbortController();
  const guard = createPdfExportGuard(controller.signal);
  const waiting = assert.rejects(guard.wait(new Promise(() => {})), { name: "AbortError" });
  controller.abort();
  await waiting;
  assert.throws(() => guard.check(), { name: "AbortError" });
});

test("a stalled dependency is bounded by its stage timeout", async (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"] });
  const guard = createPdfExportGuard(undefined, 1_000);
  const waiting = assert.rejects(guard.wait(new Promise(() => {}), 100, "Dependency timed out"), /Dependency timed out/);
  t.mock.timers.tick(100);
  await waiting;
});

test("the overall deadline spans stages and rejects even a late resolved result", async (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"] });
  const guard = createPdfExportGuard(undefined, 1_000);
  await guard.wait(Promise.resolve("first page"));
  t.mock.timers.tick(900);
  const waiting = assert.rejects(guard.wait(new Promise(() => {}), 500), /worksheet is safe/);
  t.mock.timers.tick(100);
  await waiting;
  await assert.rejects(guard.wait(Promise.resolve("late page")), /worksheet is safe/);
});

test("a completed stage removes its timeout and cancellation listener", async (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"] });
  const controller = new AbortController();
  const guard = createPdfExportGuard(controller.signal);
  assert.equal(await guard.wait(Promise.resolve(42), 100), 42);
  controller.abort();
  t.mock.timers.tick(100);
});
