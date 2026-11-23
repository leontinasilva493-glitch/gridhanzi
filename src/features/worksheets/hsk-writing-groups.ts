import catalog from "./hsk-writing-characters.json";

export type HskWritingGroupSlug =
  | "level-1-2"
  | "level-3"
  | "level-4"
  | "level-5"
  | "level-6"
  | "level-7-9";

export interface HskWritingBatch {
  index: number;
  label: string;
  start: number;
  end: number;
  characters: string[];
  worksheetHref: string;
}

export interface HskWritingGroupPageData {
  slug: HskWritingGroupSlug;
  path: string;
  level: string;
  shortLabel: string;
  label: string;
  count: number;
  cumulative: number;
  title: string;
  description: string;
  heading: string;
  directAnswer: string;
  studyTip: string;
  vocabHref: string;
  vocabLabel: string;
  characters: string[];
  batches: HskWritingBatch[];
  prevSlug?: HskWritingGroupSlug;
  nextSlug?: HskWritingGroupSlug;
}

export const HSK_WRITING_SOURCE_URL = catalog.sourceUrl;
export const HSK_WRITING_SOURCE_LABEL = catalog.source;
export const HSK_WRITING_PRINTED_PAGES = `${catalog.sourcePrintedPageNumbers[0]}–${catalog.sourcePrintedPageNumbers[catalog.sourcePrintedPageNumbers.length - 1]}`;
export const HSK_WRITING_PDF_PAGES = `${catalog.sourcePdfPageNumbers[0]}–${catalog.sourcePdfPageNumbers[catalog.sourcePdfPageNumbers.length - 1]}`;

const BATCH_SIZE = 30;

const groupMeta: Record<
  string,
  {
    slug: HskWritingGroupSlug;
    shortLabel: string;
    title: string;
    description: string;
    heading: string;
    directAnswer: string;
    studyTip: string;
    vocabHref: string;
    vocabLabel: string;
  }
> = {
  "1-2": {
    slug: "level-1-2",
    shortLabel: "Levels 1–2",
    title: "HSK 3.0 Levels 1–2 Writing Characters (100) – Practice Sheets",
    description:
      "Browse all 100 official HSK 3.0 Levels 1–2 handwriting characters from the 2025 syllabus. Open 30-character sets or build a custom printable Tian Zi Ge PDF.",
    heading: "HSK 3.0 Levels 1–2 Writing Characters (100 Characters)",
    directAnswer:
      "The official HSK 3.0 syllabus publishes 100 required handwriting characters for Levels 1–2 as a single combined group, forming the first 100 of the 1,200 cumulative writing characters.",
    studyTip:
      "Start with 10 to 15 characters per sheet using Tian Zi Ge grids and stroke-order guides, then switch to blank recall squares once you can write each character from Pinyin.",
    vocabHref: "/hsk/3-0/level-2",
    vocabLabel: "HSK 3.0 Level 2 vocabulary list",
  },
  "3": {
    slug: "level-3",
    shortLabel: "Level 3",
    title: "HSK 3.0 Level 3 Writing Characters (150) – Printable Practice",
    description:
      "Browse all 150 new HSK 3.0 Level 3 handwriting characters (250 cumulative). Print 30-character Tian Zi Ge practice sheets or check stroke order before writing.",
    heading: "HSK 3.0 Level 3 Writing Characters (150 New, 250 Cumulative)",
    directAnswer:
      "HSK 3.0 Level 3 adds 150 required handwriting characters on top of the 100 Levels 1–2 characters, bringing the cumulative writing requirement to 250 characters.",
    studyTip:
      "Level 3 introduces more multi-component characters. Practice in five 30-character sets and review high-frequency radicals alongside stroke order.",
    vocabHref: "/hsk/3-0/level-3",
    vocabLabel: "HSK 3.0 Level 3 vocabulary list",
  },
  "4": {
    slug: "level-4",
    shortLabel: "Level 4",
    title: "HSK 3.0 Level 4 Writing Characters (150) – Printable Practice",
    description:
      "Browse all 150 new HSK 3.0 Level 4 handwriting characters (400 cumulative). Open ready-to-print 30-character sets or customize a Chinese writing worksheet PDF.",
    heading: "HSK 3.0 Level 4 Writing Characters (150 New, 400 Cumulative)",
    directAnswer:
      "HSK 3.0 Level 4 adds 150 new handwriting characters for a cumulative total of 400 characters in the official 2025 exam syllabus.",
    studyTip:
      "Pair tracing sheets with recall-test sheets so you can check whether you remember the internal components of similar Level 4 characters without looking.",
    vocabHref: "/hsk/3-0/level-4",
    vocabLabel: "HSK 3.0 Level 4 vocabulary list",
  },
  "5": {
    slug: "level-5",
    shortLabel: "Level 5",
    title: "HSK 3.0 Level 5 Writing Characters (150) – Printable Practice",
    description:
      "Browse all 150 new HSK 3.0 Level 5 handwriting characters (550 cumulative). Split the list into printable 30-character PDF worksheets or select your own subset.",
    heading: "HSK 3.0 Level 5 Writing Characters (150 New, 550 Cumulative)",
    directAnswer:
      "HSK 3.0 Level 5 adds 150 handwriting characters, raising the cumulative syllabus writing requirement to 550 characters.",
    studyTip:
      "Focus on characters you still hesitate on during mock writing tasks: select up to 30 difficult characters below to print a targeted review sheet.",
    vocabHref: "/hsk/3-0/level-5",
    vocabLabel: "HSK 3.0 Level 5 vocabulary list",
  },
  "6": {
    slug: "level-6",
    shortLabel: "Level 6",
    title: "HSK 3.0 Level 6 Writing Characters (150) – Printable Practice",
    description:
      "Browse all 150 new HSK 3.0 Level 6 handwriting characters (700 cumulative). Generate printable Tian Zi Ge or blank grid PDFs in 30-character sets or custom lists.",
    heading: "HSK 3.0 Level 6 Writing Characters (150 New, 700 Cumulative)",
    directAnswer:
      "HSK 3.0 Level 6 introduces 150 additional handwriting characters, bringing the cumulative intermediate writing total to 700 characters.",
    studyTip:
      "At Level 6, use smaller adult grids or blank writing squares to practice keeping denser characters balanced and legible at exam speed.",
    vocabHref: "/hsk/3-0/level-6",
    vocabLabel: "HSK 3.0 Level 6 vocabulary list",
  },
  "7-9": {
    slug: "level-7-9",
    shortLabel: "Levels 7–9",
    title: "HSK 3.0 Levels 7–9 Writing Characters (500) – Practice Sheets",
    description:
      "Browse all 500 advanced HSK 3.0 Levels 7–9 handwriting characters (1,200 cumulative). Open 30-character printable practice sets or select specific characters.",
    heading: "HSK 3.0 Levels 7–9 Writing Characters (500 New, 1,200 Cumulative)",
    directAnswer:
      "The advanced HSK 3.0 Levels 7–9 exam adds 500 handwriting characters as one combined group, completing the full 1,200-character official writing list.",
    studyTip:
      "Work through the 500 advanced characters in 30-character batches or filter by character to build short weekly dictation sheets.",
    vocabHref: "/hsk/3-0/level-7-9",
    vocabLabel: "HSK 3.0 Levels 7–9 vocabulary list",
  },
};

function buildBatches(characters: string[]): HskWritingBatch[] {
  const batches: HskWritingBatch[] = [];
  for (let offset = 0; offset < characters.length; offset += BATCH_SIZE) {
    const slice = characters.slice(offset, offset + BATCH_SIZE);
    const start = offset + 1;
    const end = offset + slice.length;
    batches.push({
      index: batches.length + 1,
      label: `Set ${batches.length + 1} (${start}–${end})`,
      start,
      end,
      characters: slice,
      worksheetHref: `/generator?words=${encodeURIComponent(slice.join("\n"))}`,
    });
  }
  return batches;
}

let runningTotal = 0;
const rawGroups: HskWritingGroupPageData[] = catalog.groups.map((group) => {
  const meta = groupMeta[group.level];
  if (!meta) {
    throw new Error(`Missing metadata for HSK 3.0 writing group: ${group.level}`);
  }
  runningTotal += group.count;
  return {
    slug: meta.slug,
    path: `/hsk/3-0-writing-characters/${meta.slug}`,
    level: group.level,
    shortLabel: meta.shortLabel,
    label: group.label,
    count: group.count,
    cumulative: runningTotal,
    title: meta.title,
    description: meta.description,
    heading: meta.heading,
    directAnswer: meta.directAnswer,
    studyTip: meta.studyTip,
    vocabHref: meta.vocabHref,
    vocabLabel: meta.vocabLabel,
    characters: group.characters,
    batches: buildBatches(group.characters),
  };
});

export const hskWritingGroupPages: HskWritingGroupPageData[] = rawGroups.map(
  (group, index) => ({
    ...group,
    prevSlug: rawGroups[index - 1]?.slug,
    nextSlug: rawGroups[index + 1]?.slug,
  }),
);

export const hskWritingGroupPaths: string[] = hskWritingGroupPages.map(
  (group) => group.path,
);

export function getHskWritingGroupBySlug(
  slug: string,
): HskWritingGroupPageData | undefined {
  return hskWritingGroupPages.find((group) => group.slug === slug);
}

export function getHskWritingGroupSlugByLevel(
  level: string,
): HskWritingGroupSlug | undefined {
  return hskWritingGroupPages.find((group) => group.level === level)?.slug;
}
