import assert from "node:assert/strict";
import test from "node:test";

import { worksheetTemplates } from "./data";
import { filterWorksheetTemplates } from "./templates";

test("the curated library contains 20 complete classroom-ready templates", () => {
  assert.ok(worksheetTemplates.length >= 20);
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
