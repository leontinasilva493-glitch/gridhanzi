import type { PaperSize, WorksheetOutput } from "./types";
import { createPdfExportGuard, PdfExportError } from "./pdf-export-guard";

export type PdfExportProgress = {
  current: number;
  total: number;
  stage?: "preparing" | "pages" | "saving";
};

export type DownloadWorksheetPdfOptions = {
  pages: HTMLElement[];
  paperSize: PaperSize;
  output?: WorksheetOutput;
  title: string;
  studentName?: string;
  date?: string;
  locale?: string;
  onProgress?: (progress: PdfExportProgress) => void;
  signal?: AbortSignal;
};

type StylePropertyWriter = {
  setProperty(name: string, value: string, priority?: string): void;
};

/** Minimal CSSStyleSheet shape, so style collection can be tested without a browser. */
export type PdfStyleSheetSource = {
  href: string | null;
  readonly cssRules: ArrayLike<{ cssText: string }>;
};

export type PdfCaptureStyles = {
  /** Same-origin rules read from the live CSSOM, including client-navigation styles. */
  cssText: string;
  /** Cross-origin sheets whose rules cannot be read, such as the web-font CDN. */
  externalHrefs: string[];
};

export function buildWorksheetPdfFilename(
  title: string,
  output: WorksheetOutput = "worksheet",
): string {
  const slug = title
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const suffix = output === "flashcards" ? "flashcards" : "worksheet";

  return slug ? `${slug}-${suffix}.pdf` : `chinese-${suffix}.pdf`;
}

export function getPdfPageSize(paperSize: PaperSize) {
  if (paperSize === "letter") {
    return { format: "letter" as const, widthMm: 215.9, heightMm: 279.4 };
  }
  if (paperSize === "tablet") {
    return {
      format: [192, 256] as [number, number],
      widthMm: 192,
      heightMm: 256,
    };
  }
  return { format: "a4" as const, widthMm: 210, heightMm: 297 };
}

export function getPdfCaptureGeometry({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return {
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
    scrollX: 0,
    scrollY: 0,
  };
}

export function getPdfCaptureGeometryFromPage(page: {
  offsetWidth: number;
  offsetHeight: number;
  getBoundingClientRect(): { width: number; height: number };
}) {
  const rect = page.getBoundingClientRect();
  return getPdfCaptureGeometry({
    width: page.offsetWidth > 0 ? page.offsetWidth : rect.width,
    height: page.offsetHeight > 0 ? page.offsetHeight : rect.height,
  });
}

export function getPdfHeaderCropHeight(canvasHeight: number) {
  return Math.max(1, Math.round(canvasHeight * 0.115));
}

export function getPdfHeaderCropHeightForPage(
  page: {
    getBoundingClientRect(): { top: number; height: number };
    querySelector(selector: string): { getBoundingClientRect(): { top: number; bottom: number } } | null;
  },
  canvasHeight: number,
) {
  const pageRect = page.getBoundingClientRect();
  const headerRect = page.querySelector("header")?.getBoundingClientRect();
  if (!headerRect || pageRect.height <= 0) return 0;

  const firstContentRect = page.querySelector(".hs-hanzi-context")?.getBoundingClientRect();
  const headerRatio = (headerRect.bottom - pageRect.top) / pageRect.height;
  const contentRatio = firstContentRect
    ? (firstContentRect.top - pageRect.top) / pageRect.height - 0.002
    : headerRatio;
  return Math.max(1, Math.round(canvasHeight * Math.min(headerRatio, contentRatio)));
}

export function shouldRecomposeWorksheetPdfHeader(
  output: WorksheetOutput = "worksheet",
) {
  return output === "worksheet";
}

export function shouldClearPdfHeader(
  output: WorksheetOutput = "worksheet",
  pageIndex = 0,
) {
  return shouldRecomposeWorksheetPdfHeader(output) && pageIndex === 0;
}

export function getPdfHeaderFont(sizePx: number): string {
  return `500 ${Math.round(sizePx)}px Georgia, "LXGW WenKai GB Medium", "Noto Serif SC", serif`;
}

export async function loadPdfHeaderFont(
  fonts: { load(font: string, text: string): Promise<unknown> },
  title: string,
): Promise<void> {
  try {
    await fonts.load('500 32px "LXGW WenKai GB Medium"', title);
  } catch {
    // Canvas will continue through the declared system-font fallbacks.
  }
}

const PDF_ASSET_TIMEOUT_MS = 8_000;
/** Loading the PDF libraries; a stalled CDN or chunk request fails visibly. */
const PDF_TOOLS_TIMEOUT_MS = 15_000;
/** One isolated page normally captures in about a second, even on slower laptops. */
const PDF_CAPTURE_TIMEOUT_MS = 30_000;
/** Capture-document fonts are best effort: system fallbacks keep the export usable. */
const PDF_CAPTURE_FONT_TIMEOUT_MS = 3_000;

function applyPdfCaptureRootOverrides(targetStyle: StylePropertyWriter) {
  targetStyle.setProperty("width", "100%");
  targetStyle.setProperty("height", "100%");
  targetStyle.setProperty("min-height", "0");
  targetStyle.setProperty("margin", "0");
  targetStyle.setProperty("transform", "none");
  targetStyle.setProperty("box-shadow", "none");
}

/**
 * Reads the page's CSS from the live CSSOM. Copying rule text instead of
 * stylesheet links keeps styles that client navigation inserted without links.
 */
export function collectPdfCaptureStyles(sheets: ArrayLike<PdfStyleSheetSource>): PdfCaptureStyles {
  const cssParts: string[] = [];
  const externalHrefs: string[] = [];
  for (let index = 0; index < sheets.length; index += 1) {
    const sheet = sheets[index];
    if (!sheet) continue;
    try {
      const rules = sheet.cssRules;
      for (let ruleIndex = 0; ruleIndex < rules.length; ruleIndex += 1) {
        const rule = rules[ruleIndex];
        if (rule?.cssText) cssParts.push(rule.cssText);
      }
    } catch {
      // Cross-origin rules are unreadable; load the same stylesheet by URL instead.
      if (sheet.href && !externalHrefs.includes(sheet.href)) externalHrefs.push(sheet.href);
    }
  }
  return { cssText: cssParts.join("\n"), externalHrefs };
}

type PdfExportGuard = ReturnType<typeof createPdfExportGuard>;

/** Best-effort wait that still honours cancellation and the export watchdog. */
async function waitOptional(guard: PdfExportGuard, promise: Promise<unknown>, timeoutMs: number) {
  try {
    await guard.wait(promise, timeoutMs);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    guard.check();
  }
}

/**
 * html2canvas clones the whole owner document for every capture. Capturing in a
 * small dedicated document avoids re-cloning the full preview (all pages, editor
 * controls and help) once per page, which made exports slow enough to time out.
 */
async function createPdfCaptureFrame(
  width: number,
  height: number,
  guard: PdfExportGuard,
) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  frame.dataset.gridhanziPdfCapture = "true";
  Object.assign(frame.style, {
    position: "fixed",
    top: "0",
    left: "-100000px",
    width: `${width}px`,
    height: `${height}px`,
    border: "0",
    opacity: "0",
    pointerEvents: "none",
  });
  document.body.append(frame);

  const frameDocument = frame.contentDocument;
  if (!frameDocument) {
    frame.remove();
    throw new PdfExportError("Unable to prepare the worksheet PDF pages.", "capture");
  }
  frameDocument.open();
  frameDocument.write("<!doctype html><html><head><meta charset=\"utf-8\"></head><body></body></html>");
  frameDocument.close();

  const sourceRoot = document.documentElement;
  frameDocument.documentElement.lang = sourceRoot.lang;
  frameDocument.documentElement.dir = sourceRoot.dir;
  frameDocument.documentElement.className = sourceRoot.className;
  const rootStyle = sourceRoot.getAttribute("style");
  if (rootStyle) frameDocument.documentElement.setAttribute("style", rootStyle);
  frameDocument.body.className = document.body.className;
  Object.assign(frameDocument.body.style, { margin: "0", background: "#ffffff" });

  const styles = collectPdfCaptureStyles(document.styleSheets as unknown as ArrayLike<PdfStyleSheetSource>);
  const style = frameDocument.createElement("style");
  style.dataset.gridhanziPdfStyles = "true";
  style.textContent = styles.cssText;
  frameDocument.head.append(style);

  const linkLoads = styles.externalHrefs.map((href) => new Promise<void>((resolve) => {
    const link = frameDocument.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.crossOrigin = "anonymous";
    link.addEventListener("load", () => resolve(), { once: true });
    link.addEventListener("error", () => resolve(), { once: true });
    frameDocument.head.append(link);
  }));
  if (linkLoads.length) {
    await waitOptional(guard, Promise.all(linkLoads), PDF_ASSET_TIMEOUT_MS);
  }

  return {
    frameDocument,
    mount(page: HTMLElement) {
      const geometry = getPdfCaptureGeometryFromPage(page);
      const host = frameDocument.createElement("div");
      Object.assign(host.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: `${geometry.width}px`,
        height: `${geometry.height}px`,
        overflow: "hidden",
        background: "#ffffff",
      });
      host.dataset.gridhanziPdfCapture = "true";
      const clonedPage = frameDocument.importNode(page, true) as HTMLElement;
      applyPdfCaptureRootOverrides(clonedPage.style);
      host.append(clonedPage);
      frameDocument.body.append(host);
      return { geometry, host };
    },
    dispose() {
      frame.remove();
    },
  };
}

async function waitForCaptureFonts(frameDocument: Document, host: HTMLElement, guard: PdfExportGuard) {
  // Layout requests the web-font subsets used by this page.
  host.getBoundingClientRect();
  const fonts = (frameDocument as Document & { fonts?: FontFaceSet }).fonts;
  if (!fonts || fonts.status === "loaded") return;
  await waitOptional(guard, fonts.ready, PDF_CAPTURE_FONT_TIMEOUT_MS);
}

function createPdfHeaderCanvas({
  width,
  height,
  title,
  studentName,
  date,
  locale,
}: {
  width: number;
  height: number;
  title: string;
  studentName: string;
  date: string;
  locale: string;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to prepare the worksheet PDF header.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#17233a";
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.font = getPdfHeaderFont(width * 0.037);
  context.fillText(title, width / 2, height * 0.47);

  context.font = `500 ${Math.round(width * 0.014)}px Arial, sans-serif`;
  context.textAlign = "left";
  context.fillText(`${locale.startsWith("zh") ? "姓名：" : "Name:"} ${studentName}`, width * 0.052, height * 0.78);
  context.fillText(`${locale.startsWith("zh") ? "日期：" : "Date:"} ${date}`, width * 0.716, height * 0.78);

  context.strokeStyle = "#8f9297";
  context.lineWidth = Math.max(1, width * 0.001);
  context.beginPath();
  context.moveTo(width * 0.052, height * 0.9);
  context.lineTo(width * 0.62, height * 0.9);
  context.moveTo(width * 0.716, height * 0.9);
  context.lineTo(width * 0.948, height * 0.9);
  context.stroke();

  return canvas;
}

async function waitForWorksheetAssets(pages: HTMLElement[], title: string, guard: PdfExportGuard) {
  if (typeof document !== "undefined" && "fonts" in document) {
    const fontMessage = "Worksheet fonts did not finish loading. Try the PDF download again.";
    await guard.wait(loadPdfHeaderFont(document.fonts, title), PDF_ASSET_TIMEOUT_MS, fontMessage, "fonts");
    await guard.wait(document.fonts.ready, PDF_ASSET_TIMEOUT_MS, fontMessage, "fonts");
  }

  const deadline = Date.now() + 8_000;
  while (
    pages.some((page) => page.querySelector('[data-stroke-loading="true"]')) &&
    Date.now() < deadline
  ) {
    await guard.wait(new Promise((resolve) => setTimeout(resolve, 120)));
  }
  if (pages.some((page) => page.querySelector('[data-stroke-loading="true"]'))) {
    throw new PdfExportError("Stroke-order assets are still loading. Try the PDF download again.", "assets");
  }
}

export async function downloadWorksheetPdf({
  pages,
  paperSize,
  output = "worksheet",
  title,
  studentName = "",
  date = "",
  locale = "en",
  onProgress,
  signal,
}: DownloadWorksheetPdfOptions): Promise<void> {
  if (pages.length === 0) {
    throw new PdfExportError("No worksheet pages are ready to export.", "capture");
  }

  const guard = createPdfExportGuard(signal);
  guard.check();
  onProgress?.({ current: 0, total: pages.length, stage: "preparing" });
  await waitForWorksheetAssets(pages, title, guard);
  guard.progress();

  const [{ default: html2canvas }, { jsPDF }] = await guard.wait(Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]), PDF_TOOLS_TIMEOUT_MS, "PDF tools could not finish loading. Use Print or try again.", "tools");
  guard.check();
  guard.progress();
  const size = getPdfPageSize(paperSize);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: size.format,
    compress: true,
    putOnlyUsedFonts: true,
  });
  let documentHeaderCanvas: HTMLCanvasElement | null = null;
  const firstGeometry = getPdfCaptureGeometryFromPage(pages[0]!);
  const captureFrame = await createPdfCaptureFrame(firstGeometry.width, firstGeometry.height, guard);

  const capturePage = async (page: HTMLElement) => {
    const { geometry, host } = captureFrame.mount(page);
    try {
      await waitForCaptureFonts(captureFrame.frameDocument, host, guard);
      return await guard.wait(html2canvas(host, {
        backgroundColor: "#ffffff",
        scale: Math.min(2, window.devicePixelRatio || 1.5),
        useCORS: true,
        logging: false,
        width: geometry.width,
        height: geometry.height,
        x: 0,
        y: 0,
        windowWidth: geometry.width,
        windowHeight: geometry.height,
        scrollX: geometry.scrollX,
        scrollY: geometry.scrollY,
        onclone: (clonedDocument, clonedHost) => {
          guard.check();
          for (const sibling of clonedDocument.body.children) {
            if (sibling !== clonedHost && sibling instanceof HTMLElement) {
              sibling.style.display = "none";
            }
          }
          clonedDocument.body.style.margin = "0";
          clonedHost.style.top = "0";
          clonedHost.style.left = "0";
        },
      }), PDF_CAPTURE_TIMEOUT_MS, "This page took too long to prepare. Try the PDF download again.", "capture");
    } finally {
      host.remove();
    }
  };

  try {
    // Animation frames stop in background tabs. A task yield also lets layout settle.
    await guard.wait(new Promise<void>((resolve) => setTimeout(resolve, 0)));
    for (let index = 0; index < pages.length; index += 1) {
      guard.check();
      const page = pages[index];
      if (!page) continue;

      onProgress?.({ current: index + 1, total: pages.length, stage: "pages" });
      const canvas = await capturePage(page);
      guard.check();

      let exportCanvas = canvas;
      if (shouldRecomposeWorksheetPdfHeader(output)) {
        const composedCanvas = document.createElement("canvas");
        const composedContext = composedCanvas.getContext("2d");

        if (!composedContext) {
          throw new PdfExportError("Unable to compose the worksheet PDF page.", "compose");
        }

        composedCanvas.width = canvas.width;
        composedCanvas.height = canvas.height;
        composedContext.drawImage(canvas, 0, 0);
        if (shouldClearPdfHeader(output, index)) {
          const headerHeight = getPdfHeaderCropHeightForPage(page, canvas.height);
          composedContext.fillStyle = "#ffffff";
          composedContext.fillRect(0, 0, canvas.width, headerHeight);
          documentHeaderCanvas ??= createPdfHeaderCanvas({
            width: canvas.width,
            height: headerHeight,
            title,
            studentName,
            date,
            locale,
          });
          composedContext.drawImage(documentHeaderCanvas, 0, 0);
        }

        exportCanvas = composedCanvas;
      }

      const pageNumber = index + 1;
      pdf.addPage(size.format, "portrait");
      pdf.setPage(pageNumber);
      pdf.addImage(
        exportCanvas.toDataURL("image/jpeg", 0.96),
        "JPEG",
        0,
        0,
        size.widthMm,
        size.heightMm,
        undefined,
        "FAST",
      );
      canvas.width = 0;
      canvas.height = 0;
      if (exportCanvas !== canvas) {
        exportCanvas.width = 0;
        exportCanvas.height = 0;
      }
      guard.progress();
      await guard.wait(new Promise<void>((resolve) => setTimeout(resolve, 0)));
    }
    pdf.deletePage(pages.length + 1);
  } finally {
    captureFrame.dispose();
  }

  guard.check();
  onProgress?.({ current: pages.length, total: pages.length, stage: "saving" });
  await guard.wait(
    pdf.save(buildWorksheetPdfFilename(title, output), { returnPromise: true }),
    undefined,
    "The PDF could not be saved. Use Print or try again.",
    "save",
  );
}
