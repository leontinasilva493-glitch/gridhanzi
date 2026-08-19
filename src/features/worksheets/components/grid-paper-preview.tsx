import { defaultWorksheetSettings, type WorksheetEntry, type WorksheetSettings } from "../types";
import type { GridPaperPage } from "../grid-pages";
import { WorksheetPaper } from "./worksheet-paper";

const previewEntries: WorksheetEntry[] = [
  { id: "preview-1", hanzi: "一", pinyin: "", english: "", status: "complete" },
  { id: "preview-2", hanzi: "十", pinyin: "", english: "", status: "complete" },
  { id: "preview-3", hanzi: "日", pinyin: "", english: "", status: "complete" },
  { id: "preview-4", hanzi: "月", pinyin: "", english: "", status: "complete" },
];

export function GridPaperPreview({ page }: { page: GridPaperPage }) {
  const settings: WorksheetSettings = {
    ...defaultWorksheetSettings,
    profile: page.profile,
    cellSize: page.profile === "brush" ? 40 : 22,
    grid: page.grid,
    mode: "write",
    showPinyin: false,
    showStrokeOrder: false,
    strokeOrderMode: "off",
    practiceStrength: "independent",
    extraBlankRows: 1,
    paperSize: "a4",
    title: page.previewTitle,
  };

  return (
    <div className="overflow-hidden rounded border border-[#d9d0c2] bg-[#ebe2d5] p-3 sm:p-5">
      <WorksheetPaper
        entries={previewEntries}
        settings={settings}
        compact
        showAnswers={false}
      />
    </div>
  );
}
