import type { PaperSize, WorksheetOutput } from "./types";

export type PdfExportProgress = {
  current: number;
  total: number;
};

export type DownloadWorksheetPdfOptions = {
  pages: HTMLElement[];
  paperSize: PaperSize;
  output?: WorksheetOutput;
  title: string;
  studentName?: string;
  date?: string;
  onProgress?: (progress: PdfExportProgress) => void;
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

export function shouldRecomposeWorksheetPdfHeader(
  output: WorksheetOutput = "worksheet",
) {
  return output === "worksheet";
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
}: {
  width: number;
  height: number;
  title: string;
  studentName: string;
  date: string;
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
  context.fillText(`Name: ${studentName}`, width * 0.052, height * 0.78);
  context.fillText(`Date: ${date}`, width * 0.716, height * 0.78);

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

async function waitForWorksheetAssets(pages: HTMLElement[], title: string) {
  if (typeof document !== "undefined" && "fonts" in document) {
    await loadPdfHeaderFont(document.fonts, title);
    await document.fonts.ready;
  }

  const deadline = Date.now() + 8_000;
  while (
    pages.some((page) => page.querySelector('[data-stroke-loading="true"]')) &&
    Date.now() < deadline
  ) {
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
}

export async function downloadWorksheetPdf({
  pages,
  paperSize,
  output = "worksheet",
  title,
  studentName = "",
  date = "",
  onProgress,
}: DownloadWorksheetPdfOptions): Promise<void> {
  if (pages.length === 0) {
    throw new Error("No worksheet pages are ready to export.");
  }

  await waitForWorksheetAssets(pages, title);

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);
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

    try {
      return await html2canvas(host, {
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
      });
    } finally {
      host.remove();
    }
  };

  window.scrollTo(0, 0);
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  try {
    await capturePage(pages[0]);

    for (let index = 0; index < pages.length; index += 1) {
      const page = pages[index];
      if (!page) continue;

      onProgress?.({ current: index + 1, total: pages.length });
      const canvas = await capturePage(page);

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
        const headerHeight = getPdfHeaderCropHeight(canvas.height);
        composedContext.fillStyle = "#ffffff";
        composedContext.fillRect(0, 0, canvas.width, headerHeight);

        if (index === 0) {
          documentHeaderCanvas ??= createPdfHeaderCanvas({
            width: canvas.width,
            height: headerHeight,
            title,
            studentName,
            date,
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
    }
    pdf.deletePage(pages.length + 1);
  } finally {
    window.scrollTo(previousScroll.x, previousScroll.y);
  }

  pdf.save(buildWorksheetPdfFilename(title, output));
}
