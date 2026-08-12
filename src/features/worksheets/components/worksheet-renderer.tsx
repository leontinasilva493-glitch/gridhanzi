"use client";

import { FlashcardPaper } from "./flashcard-paper";
import { WorksheetPaper } from "./worksheet-paper";
import type { WorksheetEntry, WorksheetSettings } from "../types";

export function WorksheetRenderer({
  entries,
  settings,
  compact = false,
  showBackground = true,
  showAnswers = true,
  className,
  onPageCountChange,
}: {
  entries: WorksheetEntry[];
  settings: WorksheetSettings;
  compact?: boolean;
  showBackground?: boolean;
  showAnswers?: boolean;
  className?: string;
  onPageCountChange?: (pageCount: number) => void;
}) {
  if (settings.output === "flashcards") {
    return (
      <FlashcardPaper
        entries={entries}
        settings={settings}
        compact={compact}
        showBackground={showBackground}
        className={className}
        onPageCountChange={onPageCountChange}
      />
    );
  }

  return (
    <WorksheetPaper
      entries={entries}
      settings={settings}
      compact={compact}
      showBackground={showBackground}
      showAnswers={showAnswers}
      className={className}
      onPageCountChange={onPageCountChange}
    />
  );
}
