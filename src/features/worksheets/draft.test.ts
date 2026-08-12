import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorksheetDraft,
  isSameWorksheetSnapshot,
  parseWorksheetDraft,
} from "./draft";
import {
  defaultWorksheetSettings,
  type WorksheetSnapshot,
} from "./types";

const NOW = Date.UTC(2026, 7, 12, 4, 0, 0);

function snapshot(overrides: Partial<WorksheetSnapshot> = {}): WorksheetSnapshot {
  return {
    version: 2,
    entries: [
      {
        id: "row-1",
        hanzi: "家庭",
        pinyin: "jiātíng",
        english: "family",
        status: "complete",
      },
    ],
    settings: {
      ...defaultWorksheetSettings,
      title: "Family practice",
    },
    ...overrides,
  };
}

test("round-trips a current worksheet draft through JSON storage", () => {
  const draft = createWorksheetDraft(snapshot(), NOW);
  const parsed = parseWorksheetDraft(JSON.stringify(draft), NOW + 1_000);

  assert.equal(parsed?.savedAt, NOW);
  assert.equal(parsed?.snapshot.entries[0]?.hanzi, "家庭");
  assert.equal(parsed?.snapshot.settings.title, "Family practice");
});

test("rejects malformed, invalid-date, and expired worksheet drafts", () => {
  assert.equal(parseWorksheetDraft("not json", NOW), null);
  assert.equal(
    parseWorksheetDraft(
      JSON.stringify({ savedAt: Number.NaN, snapshot: snapshot() }),
      NOW,
    ),
    null,
  );

  const expired = createWorksheetDraft(
    snapshot(),
    NOW - 30 * 24 * 60 * 60 * 1_000 - 1,
  );
  assert.equal(parseWorksheetDraft(JSON.stringify(expired), NOW), null);
});

test("compares worksheet content while ignoring generated row identifiers", () => {
  const sameContent = snapshot({
    entries: [
      {
        ...snapshot().entries[0]!,
        id: "a-different-row-id",
      },
    ],
  });
  const changedContent = snapshot({
    entries: [
      {
        ...snapshot().entries[0]!,
        english: "home and family",
      },
    ],
  });

  assert.equal(isSameWorksheetSnapshot(snapshot(), sameContent), true);
  assert.equal(isSameWorksheetSnapshot(snapshot(), changedContent), false);
});
