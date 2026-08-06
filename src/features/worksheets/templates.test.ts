import assert from "node:assert/strict";
import test from "node:test";

import { worksheetTemplates } from "./data";
import * as templateTools from "./templates";

const { filterWorksheetTemplates } = templateTools;

const mvpTemplateSeoExpectations = {
  "hsk-3-campus-life": {
    seoTitle: "HSK 3 Campus Life Chinese Worksheet",
    h1: "HSK 3 Campus Life Chinese Worksheet",
  },
  "hsk-3-health": {
    seoTitle: "HSK 3 Health Chinese Writing Practice",
    h1: "HSK 3 Health Chinese Writing Practice",
  },
  "hsk-3-shopping-money": {
    seoTitle: "HSK 3 Shopping and Money Worksheet",
    h1: "HSK 3 Shopping and Money Worksheet",
  },
  "hsk-3-technology": {
    seoTitle: "HSK 3 Technology Chinese Worksheet",
    h1: "HSK 3 Technology Chinese Worksheet",
  },
  "hsk-3-exams-grades": {
    seoTitle: "HSK 3 Exam and Grade Writing Worksheet",
    h1: "HSK 3 Exam and Grade Writing Worksheet",
  },
  "hsk-3-apartment-home": {
    seoTitle: "HSK 3 Home and Apartment Worksheet",
    h1: "HSK 3 Home and Apartment Worksheet",
  },
  "hsk-3-office-teamwork": {
    seoTitle: "HSK 3 Workplace Chinese Worksheet",
    h1: "HSK 3 Workplace Chinese Worksheet",
  },
  "top-100-chinese-characters": {
    seoTitle: "Top 100 Chinese Characters Writing Practice",
    h1: "Top 100 Chinese Characters Writing Practice",
  },
  "blank-tianzige-grid": {
    seoTitle: "Printable Chinese Character Grid - Tian Zi Ge",
    h1: "Printable Chinese Character Grid - Tian Zi Ge",
  },
  "chinese-first-characters": {
    seoTitle: "First Chinese Characters Worksheet",
    h1: "First Chinese Characters Worksheet",
  },
  "hsk-4": {
    seoTitle: "HSK 4 Chinese Writing Worksheet",
    h1: "HSK 4 Chinese Writing Worksheet",
  },
  "hsk-5": {
    seoTitle: "HSK 5 Chinese Writing Worksheet",
    h1: "HSK 5 Chinese Writing Worksheet",
  },
  "top-200-chinese-characters": {
    seoTitle: "Top 200 Chinese Characters Writing Practice",
    h1: "Top 200 Chinese Characters Writing Practice",
  },
  "blank-mi-zi-ge-grid": {
    seoTitle: "Printable Hanzi Grid Paper - Mi Zi Ge",
    h1: "Printable Hanzi Grid Paper - Mi Zi Ge",
  },
  "chinese-numbers-1-100": {
    seoTitle: "Chinese Numbers 1-100 Writing Practice",
    h1: "Chinese Numbers 1-100 Writing Practice",
  },
  "chinese-measure-words": {
    seoTitle: "Chinese Measure Words Worksheet",
    h1: "Chinese Measure Words Worksheet",
  },
  "common-chinese-verbs": {
    seoTitle: "Common Chinese Verbs Worksheet",
    h1: "Common Chinese Verbs Worksheet",
  },
} as const;

test("the curated library contains complete classroom-ready templates", () => {
  assert.ok(worksheetTemplates.length >= 44);
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
      "hsk-3-campus-life",
      "hsk-3-health",
      "hsk-3-shopping-money",
      "hsk-3-technology",
      "hsk-3-exams-grades",
      "hsk-3-apartment-home",
      "hsk-3-office-teamwork",
      "top-100-chinese-characters",
      "blank-tianzige-grid",
      "chinese-first-characters",
      "hsk-4",
      "hsk-5",
      "top-200-chinese-characters",
      "blank-mi-zi-ge-grid",
      "chinese-numbers-1-100",
      "chinese-measure-words",
      "common-chinese-verbs",
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
      "hsk-3-campus-life",
      "hsk-3-health",
      "hsk-3-shopping-money",
      "hsk-3-technology",
      "hsk-3-exams-grades",
      "hsk-3-apartment-home",
      "hsk-3-office-teamwork",
      "top-100-chinese-characters",
      "blank-tianzige-grid",
      "chinese-first-characters",
      "hsk-4",
      "hsk-5",
      "top-200-chinese-characters",
      "blank-mi-zi-ge-grid",
      "chinese-numbers-1-100",
      "chinese-measure-words",
      "common-chinese-verbs",
    ],
  );
});

test("MVP validation templates have vertical keyword TDH overrides", () => {
  const seoTitles = new Set<string>();
  const headings = new Set<string>();

  for (const [slug, expected] of Object.entries(mvpTemplateSeoExpectations)) {
    const template = worksheetTemplates.find((item) => item.slug === slug);
    assert.ok(template, slug);
    assert.equal(template.seoTitle, expected.seoTitle, slug);
    assert.equal(template.h1, expected.h1, slug);
    assert.notEqual(
      template.seoTitle,
      `${template.title} Chinese Writing Worksheet`,
      `${slug} should not use the fallback SEO title`,
    );
    assert.notEqual(
      template.h1,
      `${template.title} Chinese Writing Worksheet`,
      `${slug} should not use the fallback H1`,
    );
    assert.ok(
      template.seoDescription && template.seoDescription.length >= 90,
      `${slug} needs a specific SEO description`,
    );
    seoTitles.add(template.seoTitle);
    headings.add(template.h1);
  }

  assert.equal(seoTitles.size, Object.keys(mvpTemplateSeoExpectations).length);
  assert.equal(headings.size, Object.keys(mvpTemplateSeoExpectations).length);
});

test("template names do not repeat Chinese in generated worksheet titles", () => {
  assert.deepEqual(
    ["travel", "shopping", "restaurant"].map(
      (slug) => worksheetTemplates.find((template) => template.slug === slug)?.title,
    ),
    ["Travel", "Shopping", "Restaurant"],
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
