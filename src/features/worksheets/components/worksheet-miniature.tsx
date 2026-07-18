import { defaultWorksheetSettings } from "../types";
import type { WorksheetEntry } from "../types";
import { WorksheetPaper } from "./worksheet-paper";

export function WorksheetMiniature({
  entries,
  title,
  chineseTitle,
  className,
}: {
  entries: WorksheetEntry[];
  title: string;
  chineseTitle: string;
  className?: string;
}) {
  return (
    <WorksheetPaper
      entries={entries}
      compact
      className={className}
      settings={{
        ...defaultWorksheetSettings,
        title: `${title} · ${chineseTitle}`,
      }}
    />
  );
}

