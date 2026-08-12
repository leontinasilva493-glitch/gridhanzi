export type WorksheetMode = "trace" | "write" | "quiz";
export type CharacterStandard = "simplified" | "traditional-tw";
export type WorksheetOutput = "worksheet" | "flashcards";
export type GridStyle = "tian" | "mi";
export type WorksheetProfile = "kids" | "adult" | "tablet" | "brush";
export type PaperSize = "a4" | "letter" | "tablet";
export type WorksheetDifficulty = "beginner" | "advanced";
export type PrintMargin = "normal" | "narrow";
export type PracticeStrength = "guided" | "balanced" | "independent";
export type StrokeOrderMode = "detailed" | "compact" | "off";
export type EntryStatus = "complete" | "needs-review";

export interface WorksheetEntry {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  status: EntryStatus;
}

export interface WorksheetSettings {
  characterStandard: CharacterStandard;
  profile: WorksheetProfile;
  cellSize: number;
  output: WorksheetOutput;
  mode: WorksheetMode;
  grid: GridStyle;
  showPinyin: boolean;
  showStrokeOrder: boolean;
  practiceStrength: PracticeStrength;
  extraBlankRows: 0 | 1;
  strokeOrderMode: StrokeOrderMode;
  flashcardsPerPage: 6 | 9;
  flashcardShowPinyin: boolean;
  flashcardShowEnglish: boolean;
  paperSize: PaperSize;
  difficulty: WorksheetDifficulty;
  printMargin: PrintMargin;
  title: string;
  studentName: string;
  date: string;
}

export interface WorksheetTemplate {
  slug: string;
  recommendedProfile: Extract<WorksheetProfile, "kids" | "adult">;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
  chineseTitle: string;
  description: string;
  learningGoal: string;
  teachingTip: string;
  practiceActivity: string;
  age: string;
  level: string;
  wordCount: number;
  category: "kids" | "topics" | "hsk";
  entries: WorksheetEntry[];
}

export interface WorksheetTemplateSummary {
  slug: string;
  title: string;
  chineseTitle: string;
  description: string;
  age: string;
  level: string;
  wordCount: number;
  category: WorksheetTemplate["category"];
  previewEntries: WorksheetEntry[];
  searchTerms: string;
}

export interface WorksheetSnapshot {
  version: 3;
  entries: WorksheetEntry[];
  settings: WorksheetSettings;
}

export const defaultWorksheetSettings: WorksheetSettings = {
  characterStandard: "simplified",
  profile: "kids",
  cellSize: 22,
  output: "worksheet",
  mode: "trace",
  grid: "tian",
  showPinyin: true,
  showStrokeOrder: true,
  practiceStrength: "balanced",
  extraBlankRows: 0,
  strokeOrderMode: "detailed",
  flashcardsPerPage: 6,
  flashcardShowPinyin: true,
  flashcardShowEnglish: true,
  paperSize: "a4",
  difficulty: "beginner",
  printMargin: "normal",
  title: "My Chinese Worksheet",
  studentName: "",
  date: "",
};
