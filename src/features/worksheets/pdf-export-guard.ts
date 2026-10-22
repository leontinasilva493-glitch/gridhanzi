export const PDF_EXPORT_TIMEOUT_MS = 60_000;

export function createPdfExportGuard(signal?: AbortSignal, timeoutMs = PDF_EXPORT_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  const check = () => {
    if (signal?.aborted) throw new DOMException("PDF export cancelled.", "AbortError");
    if (Date.now() >= deadline) {
      throw new Error("The PDF took too long to prepare. Your worksheet is safe; use Print or try again.");
    }
  };

  return {
    check,
    async wait<T>(promise: Promise<T>, stageTimeoutMs = timeoutMs, message = "The PDF took too long to prepare. Use Print or try again."): Promise<T> {
      // Attach handlers even if already cancelled, so a late rejection is handled.
      return new Promise<T>((resolve, reject) => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const cleanUp = () => {
          clearTimeout(timer);
          signal?.removeEventListener("abort", abort);
        };
        const abort = () => {
          cleanUp();
          reject(new DOMException("PDF export cancelled.", "AbortError"));
        };
        promise.then((value) => {
          cleanUp();
          try { check(); resolve(value); } catch (error) { reject(error); }
        }, (error: unknown) => { cleanUp(); reject(error); });
        try { check(); } catch (error) { reject(error); return; }
        signal?.addEventListener("abort", abort, { once: true });
        timer = setTimeout(() => {
          cleanUp();
          try { check(); reject(new Error(message)); } catch (error) { reject(error); }
        }, Math.min(stageTimeoutMs, Math.max(0, deadline - Date.now())));
      });
    },
  };
}
