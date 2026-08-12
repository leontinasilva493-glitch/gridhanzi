import { normalizeWorksheetSnapshot } from "./snapshot";
import type { WorksheetSnapshot } from "./types";

export const WORKSHEET_DRAFT_STORAGE_KEY = "gridhanzi:worksheet:draft:v1";
export const WORKSHEET_DRAFT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1_000;

export interface WorksheetDraftEnvelope {
  savedAt: number;
  snapshot: WorksheetSnapshot;
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

export function createWorksheetDraft(
  snapshot: WorksheetSnapshot,
  savedAt = Date.now(),
): WorksheetDraftEnvelope {
  return {
    savedAt,
    snapshot: normalizeWorksheetSnapshot(snapshot),
  };
}

export function parseWorksheetDraft(
  raw: string | null,
  now = Date.now(),
): WorksheetDraftEnvelope | null {
  if (!raw) return null;

  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return null;
    const savedAt = value.savedAt;
    if (
      typeof savedAt !== "number" ||
      !Number.isFinite(savedAt) ||
      savedAt <= 0 ||
      savedAt > now ||
      now - savedAt > WORKSHEET_DRAFT_MAX_AGE_MS
    ) {
      return null;
    }

    return {
      savedAt,
      snapshot: normalizeWorksheetSnapshot(value.snapshot),
    };
  } catch {
    return null;
  }
}

function comparableSnapshot(snapshot: WorksheetSnapshot) {
  const normalized = normalizeWorksheetSnapshot(snapshot);
  return {
    version: normalized.version,
    entries: normalized.entries.map(({ id: _id, ...entry }) => entry),
    settings: normalized.settings,
  };
}

export function isSameWorksheetSnapshot(
  left: WorksheetSnapshot,
  right: WorksheetSnapshot,
): boolean {
  return (
    JSON.stringify(comparableSnapshot(left)) ===
    JSON.stringify(comparableSnapshot(right))
  );
}
