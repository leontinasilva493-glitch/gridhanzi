import { getWorksheetProfilePreset } from "../profiles";
import { defaultWorksheetSettings } from "../types";
import type { WorksheetEntry, WorksheetProfile } from "../types";
import { WorksheetPaper } from "./worksheet-paper";

export function WorksheetMiniature({
  entries,
  title,
  chineseTitle,
  profile = "kids",
  className,
}: {
  entries: WorksheetEntry[];
  title: string;
  chineseTitle: string;
  profile?: WorksheetProfile;
  className?: string;
}) {
  const preset = getWorksheetProfilePreset(profile);

  return (
    <WorksheetPaper
      entries={entries}
      compact
      className={className}
      settings={{
        ...defaultWorksheetSettings,
        profile,
        cellSize: preset.size.default,
        grid: preset.defaultGrid,
        paperSize: preset.pageFormats[0] ?? "a4",
        title: `${title} · ${chineseTitle}`,
      }}
    />
  );
}
