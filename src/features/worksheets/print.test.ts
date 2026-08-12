import assert from "node:assert/strict";
import test from "node:test";

import { getWorksheetPaperAttributes } from "./print";
import { defaultWorksheetSettings } from "./types";

test("getWorksheetPaperAttributes exposes selected paper, profile, size, margin, background, and output", () => {
  assert.deepEqual(
    getWorksheetPaperAttributes(
      {
        ...defaultWorksheetSettings,
        output: "flashcards",
        paperSize: "letter",
        printMargin: "narrow",
      },
      false,
    ),
    {
      "data-paper-size": "letter",
      "data-print-margin": "narrow",
      "data-background": "false",
      "data-profile": "kids",
      "data-cell-size": "22",
      "data-output": "flashcards",
    },
  );
});
