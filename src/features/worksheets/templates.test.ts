import assert from "node:assert/strict";
import test from "node:test";

import { worksheetTemplates } from "./data";
import * as templateTools from "./templates";

const { filterWorksheetTemplates } = templateTools;

test("the curated library contains complete classroom-ready templates", () => {
  assert.ok(worksheetTemplates.length >= 27);
  assert.equal(
    new Set(worksheetTemplates.map((template) => template.slug)).size,
    worksheetTemplates.length,
  );

  for (const template of worksheetTemplates) {
    assert.equal(template.wordCount, template.entries.length, template.slug);
    assert.ok(template.entries.length >= 15, template.slug);
    assert.ok(
      template.entries.every((entry) => entry.status === "complete"),
      `${template.slug} contains unresolved vocabulary`,
    );
    assert.ok(
      ["kids", "adult"].includes(template.recommendedProfile),
      `${template.slug} needs a recommended writing profile`,
    );
    for (const field of ["learningGoal", "teachingTip", "practiceActivity"] as const) {
      const value = (template as unknown as Record<string, unknown>)[field];
      assert.equal(typeof value, "string", `${template.slug} needs ${field}`);
      assert.ok(
        typeof value === "string" && value.length >= 70,
        `${template.slug} needs specific ${field} copy`,
      );
    }
  }

  for (const field of ["learningGoal", "teachingTip", "practiceActivity"] as const) {
    assert.equal(
      new Set(
        worksheetTemplates.map(
          (template) =>
            (template as unknown as Record<string, unknown>)[field],
        ),
      ).size,
      worksheetTemplates.length,
      `${field} must be unique per template`,
    );
  }

  assert.equal(
    worksheetTemplates.find((template) => template.slug === "family")
      ?.recommendedProfile,
    "kids",
  );
  assert.equal(
    worksheetTemplates.find((template) => template.slug === "hsk-1")
      ?.recommendedProfile,
    "adult",
  );
  assert.deepEqual(
    [
      "hsk-2",
      "hsk-3",
      "basic-strokes",
      "radicals",
      "pinyin-practice",
      "stroke-order-practice",
      "classical-poem-copying",
    ].filter((slug) =>
      worksheetTemplates.some((template) => template.slug === slug),
    ),
    [
      "hsk-2",
      "hsk-3",
      "basic-strokes",
      "radicals",
      "pinyin-practice",
      "stroke-order-practice",
      "classical-poem-copying",
    ],
  );
});

test("filterWorksheetTemplates filters by search, category, level, and age", () => {
  assert.deepEqual(
    filterWorksheetTemplates(worksheetTemplates, {
      query: "animal",
      category: "kids",
      level: "Beginner",
      age: "Ages 4–8",
    }).map((template) => template.slug),
    ["animals-kids"],
  );
});

test("filterWorksheetTemplates returns all templates for empty filters", () => {
  assert.equal(
    filterWorksheetTemplates(worksheetTemplates, {
      query: "",
      category: "all",
      level: "all",
      age: "all",
    }).length,
    worksheetTemplates.length,
  );
});

test("template summaries keep search data without sending full worksheets to listing clients", () => {
  const template = worksheetTemplates[0];
  assert.ok(template);
  const toWorksheetTemplateSummary = (
    templateTools as typeof templateTools & {
      toWorksheetTemplateSummary?: (value: typeof template) => {
        slug: string;
        previewEntries: typeof template.entries;
        searchTerms: string;
      };
    }
  ).toWorksheetTemplateSummary;

  assert.equal(typeof toWorksheetTemplateSummary, "function");
  if (!toWorksheetTemplateSummary) return;

  const summary = toWorksheetTemplateSummary(template);

  assert.equal("entries" in summary, false);
  assert.ok(summary.previewEntries.length > 0);
  assert.ok(summary.previewEntries.length <= 3);
  assert.match(summary.searchTerms, /family/i);
  assert.deepEqual(
    filterWorksheetTemplates([summary], {
      query: "mother",
      category: "all",
      level: "all",
      age: "all",
    }).map((item) => item.slug),
    ["family"],
  );
});
