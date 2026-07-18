import assert from "node:assert/strict";
import test from "node:test";

import { createWorksheetEntryId } from "./ids";

test("createWorksheetEntryId returns stable-looking unique row identifiers", () => {
  const ids = Array.from({ length: 100 }, () => createWorksheetEntryId());

  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => /^row-[a-z0-9-]+$/i.test(id)));
});
