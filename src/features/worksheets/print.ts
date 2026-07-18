import type { WorksheetSettings } from "./types";

export function getWorksheetPaperAttributes(
  settings: WorksheetSettings,
  showBackground: boolean,
) {
  return {
    "data-paper-size": settings.paperSize,
    "data-print-margin": settings.printMargin,
    "data-background": String(showBackground),
    "data-profile": settings.profile,
    "data-cell-size": String(settings.cellSize),
  } as const;
}
