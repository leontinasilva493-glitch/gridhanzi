/**
 * Regenerate with: pnpm exec tsx scripts/build-hsk-catalog.mjs
 *
 * The source URL is pinned to the commit tagged v1.4 so regeneration does not
 * drift when the upstream default branch changes.
 */
import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  vocabularyByHanzi,
  worksheetTemplates,
} from "../src/features/worksheets/data.ts";

const SOURCE_COMMIT = "7ac65bf1a6387d35f1ade478906172a19311c7f9";
const SOURCE_SHA256 =
  "52d8e64ba65a6db4a38ea34302c6de5df53cdb5145254b25edcbf93b80676434";
const SOURCE_URL = `https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/${SOURCE_COMMIT}/complete.min.json`;
const OUTPUT_URL = new URL(
  "../src/features/worksheets/hsk-catalog.json",
  import.meta.url,
);

const LEVELS = new Map([
  ["o1", { system: "2.0", level: "1" }],
  ["o2", { system: "2.0", level: "2" }],
  ["o3", { system: "2.0", level: "3" }],
  ["o4", { system: "2.0", level: "4" }],
  ["o5", { system: "2.0", level: "5" }],
  ["o6", { system: "2.0", level: "6" }],
  ["n1", { system: "3.0", level: "1" }],
  ["n2", { system: "3.0", level: "2" }],
  ["n3", { system: "3.0", level: "3" }],
  ["n4", { system: "3.0", level: "4" }],
  ["n5", { system: "3.0", level: "5" }],
  ["n6", { system: "3.0", level: "6" }],
  ["n7", { system: "3.0", level: "7-9" }],
]);

const SYSTEM_ORDER = new Map([
  ["2.0", 0],
  ["3.0", 1],
]);
const LEVEL_ORDER = new Map([
  ["1", 1],
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7-9", 7],
]);

function compareText(left, right) {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function buildThemeMembership() {
  const memberships = new Map();

  for (const template of worksheetTemplates) {
    if (!template.slug.startsWith("hsk-3-")) continue;

    for (const entry of template.entries) {
      const themes = memberships.get(entry.hanzi) ?? new Set();
      themes.add(template.slug);
      memberships.set(entry.hanzi, themes);
    }
  }

  return memberships;
}

const NON_TEACHING_MEANING =
  /^(?:surname\b|used in\b|abbr\.?\s+for\b)|\b(?:archaic|variant of)\b/i;

function normalizePinyin(value) {
  return value.normalize("NFC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function isTeachingMeaning(value) {
  return typeof value === "string" &&
    value.trim().length > 0 &&
    !NON_TEACHING_MEANING.test(value.trim());
}

function selectTeachingSense(source) {
  const forms = Array.isArray(source.f) ? source.f : [];
  const preferred = vocabularyByHanzi.get(source.s);
  const preferredIsUsable =
    preferred && isTeachingMeaning(preferred.english)
      ? preferred
      : undefined;

  const ranked = forms
    .map((form, index) => {
      const pinyin =
        typeof form?.i?.y === "string" ? form.i.y.trim() : "";
      const meanings = Array.isArray(form?.m)
        ? form.m.filter((meaning) => typeof meaning === "string")
        : [];
      const teachingMeaning = meanings.find(isTeachingMeaning);
      const matchesPreferred = Boolean(
        preferredIsUsable &&
          pinyin &&
          normalizePinyin(preferredIsUsable.pinyin) === normalizePinyin(pinyin),
      );

      return {
        index,
        pinyin,
        fallbackMeaning: meanings[0]?.trim() ?? "",
        teachingMeaning,
        matchesPreferred,
        score:
          (matchesPreferred ? 100 : 0) +
          (teachingMeaning ? 10 : 0) +
          (pinyin && pinyin[0] === pinyin[0]?.toLocaleLowerCase() ? 1 : 0),
      };
    })
    .filter((candidate) => candidate.pinyin);

  ranked.sort(
    (left, right) => right.score - left.score || left.index - right.index,
  );
  const selected = ranked[0];
  if (!selected) return null;

  return {
    pinyin: selected.pinyin,
    english:
      selected.matchesPreferred && preferredIsUsable
        ? preferredIsUsable.english.trim()
        : selected.teachingMeaning?.trim() ?? selected.fallbackMeaning,
  };
}

async function fetchUpstreamCatalog() {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) {
    throw new Error(
      `Unable to download HSK source (${response.status} ${response.statusText}).`,
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== SOURCE_SHA256) {
    throw new Error(
      `HSK source integrity check failed: expected ${SOURCE_SHA256}, received ${digest}.`,
    );
  }

  return JSON.parse(bytes.toString("utf8"));
}

function compactEntry(source, classification, themes) {
  const hanzi = typeof source.s === "string" ? source.s.trim() : "";
  const sense = selectTeachingSense(source);
  const pinyin = sense?.pinyin ?? "";
  const english = sense?.english ?? "";

  if (!hanzi || !pinyin || !english) return null;

  return {
    id: `${classification.system}:${classification.level}:${hanzi}`,
    hanzi,
    pinyin,
    english,
    system: classification.system,
    level: classification.level,
    themes: [...(themes.get(hanzi) ?? [])].sort(compareText),
  };
}

async function main() {
  const upstream = await fetchUpstreamCatalog();
  if (!Array.isArray(upstream)) {
    throw new TypeError("The upstream HSK catalogue must be a JSON array.");
  }

  const themes = buildThemeMembership();
  const entriesById = new Map();

  for (const source of upstream) {
    if (!Array.isArray(source?.l)) continue;

    for (const sourceLevel of source.l) {
      const classification = LEVELS.get(sourceLevel);
      if (!classification) continue;

      const entry = compactEntry(source, classification, themes);
      if (entry && !entriesById.has(entry.id)) {
        entriesById.set(entry.id, entry);
      }
    }
  }

  const catalog = [...entriesById.values()].sort(
    (left, right) =>
      SYSTEM_ORDER.get(left.system) - SYSTEM_ORDER.get(right.system) ||
      LEVEL_ORDER.get(left.level) - LEVEL_ORDER.get(right.level) ||
      compareText(left.hanzi, right.hanzi),
  );

  await writeFile(OUTPUT_URL, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${catalog.length} versioned HSK entries to ${fileURLToPath(OUTPUT_URL)}.`,
  );
}

await main();
