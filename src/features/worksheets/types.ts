export type WorksheetMode = "trace" | "write" | "quiz";
export type GridStyle = "tian" | "mi";
export type GridDensity = "large" | "standard" | "compact";
export type PaperSize = "a4" | "letter";
export type WorksheetDifficulty = "beginner" | "advanced";
export type PrintMargin = "normal" | "narrow";
export type EntryStatus = "complete" | "needs-review";

export interface WorksheetEntry {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  status: EntryStatus;
}

export interface WorksheetSettings {
  mode: WorksheetMode;
  grid: GridStyle;
  gridDensity: GridDensity;
  showPinyin: boolean;
  showStrokeOrder: boolean;
  paperSize: PaperSize;
  difficulty: WorksheetDifficulty;
  printMargin: PrintMargin;
  title: string;
  studentName: string;
  date: string;
}

export interface WorksheetTemplate {
  slug: string;
  title: string;
  chineseTitle: string;
  description: string;
  age: string;
  level: string;
  wordCount: number;
  category: "kids" | "topics" | "hsk";
  entries: WorksheetEntry[];
}

export interface WorksheetSnapshot {
  version: 1;
  entries: WorksheetEntry[];
  settings: WorksheetSettings;
}

export const defaultWorksheetSettings: WorksheetSettings = {
  mode: "write",
  grid: "tian",
  gridDensity: "standard",
  showPinyin: true,
  showStrokeOrder: true,
  paperSize: "a4",
  difficulty: "beginner",
  printMargin: "normal",
  title: "My Chinese Worksheet",
  studentName: "",
  date: "",
};
