import assert from "node:assert/strict";
import test from "node:test";

import { getWorksheetPaperAttributes } from "./print";
import { defaultWorksheetSettings } from "./types";

test("getWorksheetPaperAttributes exposes selected paper, margin, and background", () => {
  assert.deepEqual(
    getWorksheetPaperAttributes(
      {
        ...defaultWorksheetSettings,
        paperSize: "letter",
        printMargin: "narrow",
      },
      false,
    ),
    {
      "data-paper-size": "letter",
      "data-print-margin": "narrow",
      "data-background": "false",
    },
  );
});

