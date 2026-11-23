import assert from "node:assert/strict";
import test from "node:test";
import {
  createPdfExportGuard,
  getPdfExportFailureStage,
  PDF_EXPORT_TIMEOUT_MS,
  PdfExportError,
} from "./pdf-export-guard";

const visible = { isHidden: () => false };

test("the export watchdog has a one-minute idle window", () => {
  assert.equal(PDF_EXPORT_TIMEOUT_MS, 60_000);
});

test("cancellation releases a stalled export and prevents subsequent work", async () => {
  const controller = new AbortController();
  const guard = createPdfExportGuard(controller.signal, undefined, visible);
  const waiting = assert.rejects(guard.wait(new Promise(() => {})), { name: "AbortError" });
  controller.abort();
  await waiting;
  assert.throws(() => guard.check(), { name: "AbortError" });
});

test("a stalled dependency is bounded by its stage timeout and reports its stage", async (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"] });
  const guard = createPdfExportGuard(undefined, 1_000, visible);
  const waiting = guard.wait(new Promise(() => {}), 100, "Dependency timed out", "tools");
  t.mock.timers.tick(100);
  await assert.rejects(waiting, (error: unknown) => {
    assert.ok(error instanceof PdfExportError);
    assert.equal(error.message, "Dependency timed out");
    assert.equal(getPdfExportFailureStage(error), "tools");
    return true;
  });
});

test("no progress within the idle window rejects even a late resolved result", async (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"] });
  const guard = createPdfExportGuard(undefined, 1_000, visible);
  await guard.wait(Promise.resolve("first page"));
  t.mock.timers.tick(900);
  const waiting = assert.rejects(guard.wait(new Promise(() => {}), 500), /worksheet is safe/);
  t.mock.timers.tick(100);
  await waiting;
  await assert.rejects(guard.wait(Promise.resolve("late page")), (error: unknown) => {
    assert.equal(getPdfExportFailureStage(error), "timeout");
    return true;
  });
});

test("reported progress keeps a slow but working export alive", async (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"] });
  const guard = createPdfExportGuard(undefined, 1_000, visible);
  for (let page = 0; page < 5; page += 1) {
    t.mock.timers.tick(900);
    guard.check();
    guard.progress();
  }
  assert.doesNotThrow(() => guard.check());
});

test("time spent in a hidden tab does not count towards the watchdog", async (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"] });
  let hidden = true;
  const guard = createPdfExportGuard(undefined, 1_000, { isHidden: () => hidden });
  let settled = false;
  const waiting = guard.wait(new Promise(() => {}), 500).catch((error: unknown) => {
    settled = true;
    return error;
  });
  t.mock.timers.tick(5_000);
  await Promise.resolve();
  assert.equal(settled, false, "A hidden tab must not time out a capture");
  hidden = false;
  t.mock.timers.tick(1_000);
  const error = await waiting;
  assert.ok(error instanceof PdfExportError);
});

test("a completed stage removes its timeout and cancellation listener", async (t) => {
  t.mock.timers.enable({ apis: ["Date", "setTimeout"] });
  const controller = new AbortController();
  const guard = createPdfExportGuard(controller.signal, undefined, visible);
  assert.equal(await guard.wait(Promise.resolve(42), 100), 42);
  controller.abort();
  t.mock.timers.tick(100);
});

test("unknown errors are reported without exposing their message", () => {
  assert.equal(getPdfExportFailureStage(new Error("private detail")), "unknown");
  assert.equal(getPdfExportFailureStage(new PdfExportError("x", "capture")), "capture");
});
