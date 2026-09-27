import { getWorksheetProfilePreset } from "./profiles";
import { defaultWorksheetSettings } from "./types";
import type { PaperSize, WorksheetSnapshot, WorksheetTemplate } from "./types";

export const readyToPrintTemplateSlugs = [
  "chinese-first-characters",
  "numbers",
  "family",
] as const;

export type ReadyToPrintTemplateSlug =
  (typeof readyToPrintTemplateSlugs)[number];

export function isReadyToPrintTemplate(
  slug: string,
): slug is ReadyToPrintTemplateSlug {
  return readyToPrintTemplateSlugs.some((candidate) => candidate === slug);
}

export function getReadyToPrintPdfHref(
  slug: ReadyToPrintTemplateSlug,
  paperSize: "a4" | "letter",
): string {
  return `/downloads/worksheets/${slug}-${paperSize}.pdf`;
}

export function createTemplatePreviewSnapshot(
  template: WorksheetTemplate,
  paperSize: PaperSize = "a4",
): WorksheetSnapshot {
  const profile = template.recommendedProfile;
  const preset = getWorksheetProfilePreset(profile);

  return {
    version: 3,
    entries: template.entries.map((entry) => ({ ...entry })),
    settings: {
      ...defaultWorksheetSettings,
      profile,
      cellSize: preset.size.default,
      grid: preset.defaultGrid,
      paperSize: preset.pageFormats.includes(paperSize) ? paperSize : "a4",
      title: `${template.title} · ${template.chineseTitle}`,
      date: "",
    },
  };
}
