import type { WorksheetSettings } from "./types";

export function getWorksheetPaperAttributes(
  settings: WorksheetSettings,
  showBackground: boolean,
) {
  return {
    "data-paper-size": settings.paperSize,
    "data-print-margin": settings.printMargin,
    "data-background": String(showBackground),
  } as const;
}

