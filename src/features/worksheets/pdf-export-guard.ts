/** No visible progress for this long means the export is stuck. */
export const PDF_EXPORT_TIMEOUT_MS = 60_000;

export type PdfExportStage = "fonts" | "assets" | "tools" | "capture" | "compose" | "save" | "timeout";

/** Error with an allowlisted stage for aggregate analytics; never contains worksheet data. */
export class PdfExportError extends Error {
  readonly stage: PdfExportStage;

  constructor(message: string, stage: PdfExportStage) {
    super(message);
    this.name = "PdfExportError";
    this.stage = stage;
  }
}

export function getPdfExportFailureStage(error: unknown): PdfExportStage | "unknown" {
  return error instanceof PdfExportError ? error.stage : "unknown";
}

type PdfExportGuardOptions = {
  /** Hidden tabs throttle rendering, so their time does not count towards a timeout. */
  isHidden?: () => boolean;
};

function defaultIsHidden() {
  return typeof document !== "undefined" && document.visibilityState === "hidden";
}

/**
 * Watchdog for a browser PDF export. The export fails only when no progress is
 * reported for `idleTimeoutMs` while the page is visible; slow devices that keep
 * finishing pages are never rejected merely for taking longer overall.
 */
export function createPdfExportGuard(
  signal?: AbortSignal,
  idleTimeoutMs = PDF_EXPORT_TIMEOUT_MS,
  { isHidden = defaultIsHidden }: PdfExportGuardOptions = {},
) {
  let deadline = Date.now() + idleTimeoutMs;
  const pauseWhileHidden = () => {
    if (!isHidden()) return false;
    deadline = Math.max(deadline, Date.now() + idleTimeoutMs);
    return true;
  };
  const check = () => {
    if (signal?.aborted) throw new DOMException("PDF export cancelled.", "AbortError");
    if (pauseWhileHidden()) return;
    if (Date.now() >= deadline) {
      throw new PdfExportError(
        "The PDF took too long to prepare. Your worksheet is safe; use Print or try again.",
        "timeout",
      );
    }
  };

  return {
    check,
    /** Records completed work, such as a finished page, and restarts the idle window. */
    progress() {
      deadline = Date.now() + idleTimeoutMs;
    },
    async wait<T>(
      promise: Promise<T>,
      stageTimeoutMs = idleTimeoutMs,
      message = "The PDF took too long to prepare. Use Print or try again.",
      stage: PdfExportStage = "timeout",
    ): Promise<T> {
      // Attach handlers even if already cancelled, so a late rejection is handled.
      return new Promise<T>((resolve, reject) => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        let stageDeadline = Date.now() + stageTimeoutMs;
        const cleanUp = () => {
          clearTimeout(timer);
          signal?.removeEventListener("abort", abort);
        };
        const abort = () => {
          cleanUp();
          reject(new DOMException("PDF export cancelled.", "AbortError"));
        };
        const arm = () => {
          timer = setTimeout(onTimer, Math.max(0, Math.min(stageDeadline, deadline) - Date.now()));
        };
        function onTimer() {
          if (pauseWhileHidden()) {
            stageDeadline = Math.max(stageDeadline, Date.now() + stageTimeoutMs);
            arm();
            return;
          }
          cleanUp();
          try {
            check();
            reject(new PdfExportError(message, stage));
          } catch (error) {
            reject(error);
          }
        }
        promise.then((value) => {
          cleanUp();
          try { check(); resolve(value); } catch (error) { reject(error); }
        }, (error: unknown) => { cleanUp(); reject(error); });
        try { check(); } catch (error) { reject(error); return; }
        signal?.addEventListener("abort", abort, { once: true });
        arm();
      });
    },
  };
}
