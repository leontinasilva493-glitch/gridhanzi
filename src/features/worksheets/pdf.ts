import type { PaperSize, WorksheetOutput } from "./types";
import { createPdfExportGuard, getPdfExportTimeoutMs } from "./pdf-export-guard";

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

type StylePropertyReader = {
  length: number;
  item(index: number): string | null;
  getPropertyValue(name: string): string;
  getPropertyPriority(name: string): string;
};

type StylePropertyWriter = {
  setProperty(name: string, value: string, priority?: string): void;
};

type StyleCopyNode = {
  style: StylePropertyWriter;
  children: ArrayLike<StyleCopyNode>;
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
const PDF_CAPTURE_TIMEOUT_MS = 15_000;

function copyComputedStyleDeclaration(
  sourceStyle: StylePropertyReader,
  targetStyle: StylePropertyWriter,
) {
  for (let index = 0; index < sourceStyle.length; index += 1) {
    const propertyName = sourceStyle.item(index);
    if (!propertyName) continue;

    targetStyle.setProperty(
      propertyName,
      sourceStyle.getPropertyValue(propertyName),
      sourceStyle.getPropertyPriority(propertyName),
    );
  }
}

function applyPdfCaptureRootOverrides(targetStyle: StylePropertyWriter) {
  targetStyle.setProperty("width", "100%");
  targetStyle.setProperty("height", "100%");
  targetStyle.setProperty("min-height", "0");
  targetStyle.setProperty("margin", "0");
  targetStyle.setProperty("transform", "none");
  targetStyle.setProperty("box-shadow", "none");
}

function copyComputedStylesRecursive(
  sourceNode: StyleCopyNode,
  targetNode: StyleCopyNode,
  getComputedStyleForNode: (node: StyleCopyNode) => StylePropertyReader,
) {
  copyComputedStyleDeclaration(
    getComputedStyleForNode(sourceNode),
    targetNode.style,
  );
  const childCount = Math.min(
    sourceNode.children.length,
    targetNode.children.length,
  );
  for (let index = 0; index < childCount; index += 1) {
    const sourceChild = sourceNode.children[index];
    const targetChild = targetNode.children[index];
    if (!sourceChild || !targetChild) continue;
    copyComputedStylesRecursive(
      sourceChild,
      targetChild,
      getComputedStyleForNode,
    );
  }
}

export function prepareFlashcardCaptureClone<T extends StyleCopyNode>(
  sourceNode: T,
  targetNode: T,
  getComputedStyleForNode: (node: StyleCopyNode) => StylePropertyReader,
) {
  copyComputedStylesRecursive(sourceNode, targetNode, getComputedStyleForNode);
  applyPdfCaptureRootOverrides(targetNode.style);
}

function createPdfCapturePage(page: HTMLElement) {
  const geometry = getPdfCaptureGeometryFromPage(page);
  const host = document.createElement("div");
  const clonedPage = page.cloneNode(true) as HTMLElement;

  Object.assign(host.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: `${geometry.width}px`,
    height: `${geometry.height}px`,
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: "2147483647",
    background: "#ffffff",
  });
  host.dataset.gridhanziPdfCapture = "true";
  applyPdfCaptureRootOverrides(clonedPage.style);

  host.append(clonedPage);
  document.body.append(host);

  return { geometry, host };
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

async function waitForWorksheetAssets(pages: HTMLElement[], title: string, guard: ReturnType<typeof createPdfExportGuard>) {
  if (typeof document !== "undefined" && "fonts" in document) {
    await guard.wait(
      loadPdfHeaderFont(document.fonts, title),
      PDF_ASSET_TIMEOUT_MS,
      "Worksheet fonts did not finish loading. Try the PDF download again.",
    );
    await guard.wait(
      document.fonts.ready,
      PDF_ASSET_TIMEOUT_MS,
      "Worksheet fonts did not finish loading. Try the PDF download again.",
    );
  }

  const deadline = Date.now() + 8_000;
  while (
    pages.some((page) => page.querySelector('[data-stroke-loading="true"]')) &&
    Date.now() < deadline
  ) {
    await guard.wait(new Promise((resolve) => setTimeout(resolve, 120)));
  }
  if (pages.some((page) => page.querySelector('[data-stroke-loading="true"]'))) {
    throw new Error("Stroke-order assets are still loading. Try the PDF download again.");
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
    throw new Error("No worksheet pages are ready to export.");
  }

  const guard = createPdfExportGuard(signal, getPdfExportTimeoutMs(pages.length));
  guard.check();
  onProgress?.({ current: 0, total: pages.length, stage: "preparing" });
  await waitForWorksheetAssets(pages, title, guard);

  const [{ default: html2canvas }, { jsPDF }] = await guard.wait(Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]), PDF_CAPTURE_TIMEOUT_MS, "PDF tools could not finish loading. Use Print or try again.");
  guard.check();
  const size = getPdfPageSize(paperSize);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: size.format,
    compress: true,
    putOnlyUsedFonts: true,
  });
  const previousScroll = { x: window.scrollX, y: window.scrollY };
  let documentHeaderCanvas: HTMLCanvasElement | null = null;
  const capturePage = async (page: HTMLElement) => {
    const { geometry, host } = createPdfCapturePage(page);
    const existingClones = new Set(
      Array.from(document.querySelectorAll<HTMLIFrameElement>("iframe.html2canvas-container")),
    );

    try {
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
          if (output === "flashcards") {
            const clonedPage = clonedHost.firstElementChild;
            if (clonedPage instanceof HTMLElement) {
              prepareFlashcardCaptureClone(
                page as unknown as StyleCopyNode,
                clonedPage as unknown as StyleCopyNode,
                (node) =>
                  window.getComputedStyle(node as unknown as Element),
              );
              applyPdfCaptureRootOverrides(clonedPage.style);
            }
          }
        },
      }), PDF_CAPTURE_TIMEOUT_MS, "This page took too long to prepare. Try the PDF download again.");
    } finally {
      host.remove();
      for (const clone of document.querySelectorAll<HTMLIFrameElement>("iframe.html2canvas-container")) {
        if (!existingClones.has(clone)) clone.remove();
      }
    }
  };

  try {
    window.scrollTo(0, 0);
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
          throw new Error("Unable to compose the worksheet PDF page.");
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
      await guard.wait(new Promise<void>((resolve) => setTimeout(resolve, 0)));
    }
    pdf.deletePage(pages.length + 1);
  } finally {
    window.scrollTo(previousScroll.x, previousScroll.y);
  }

  guard.check();
  onProgress?.({ current: pages.length, total: pages.length, stage: "saving" });
  await guard.wait(pdf.save(buildWorksheetPdfFilename(title, output), { returnPromise: true }));
}
