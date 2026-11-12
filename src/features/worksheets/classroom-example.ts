export const classroomWords = ["日", "月", "山", "水"] as const;

export type ClassroomMode = "trace" | "write" | "quiz";

export function classroomEditorHref(mode: ClassroomMode) {
  return "/generator?" + new URLSearchParams({
    words: classroomWords.join("\n"),
    mode,
  }).toString();
}
