let fallbackSequence = 0;

export function createWorksheetEntryId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return `row-${globalThis.crypto.randomUUID()}`;
  }

  fallbackSequence += 1;
  return `row-${Date.now().toString(36)}-${fallbackSequence.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
