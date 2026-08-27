import type {
  WorksheetTemplate,
  WorksheetTemplateSummary,
} from "./types";

type FilterableWorksheetTemplate = Pick<
  WorksheetTemplate,
  "slug" | "title" | "chineseTitle" | "description" | "category" | "level" | "age"
> & {
  entries?: WorksheetTemplate["entries"];
  searchTerms?: string;
};

export interface WorksheetTemplateFilters {
  query: string;
  category: WorksheetTemplate["category"] | "all";
  level: string | "all";
  age: string | "all";
}

export function buildTemplateSeoCopy(template: WorksheetTemplate): {
  title: string;
  description: string;
} {
  const title =
    template.seoTitle ??
    (/(?:Writing Practice|Practice|Strokes|Radicals|Copying)$/i.test(
      template.title,
    )
      ? `${template.title} Worksheet`
      : /Chinese/i.test(template.title)
        ? `${template.title} Writing Worksheet`
        : `${template.title} Chinese Writing Worksheet`);
  const description =
    template.seoDescription ??
    `${template.description} Edit Hanzi and Pinyin, then print a PDF.`;

  return { title, description };
}

export function filterWorksheetTemplates<T extends FilterableWorksheetTemplate>(
  templates: T[],
  filters: WorksheetTemplateFilters,
): T[] {
  const query = filters.query.trim().toLocaleLowerCase();

  return templates.filter((template) => {
    const matchesQuery =
      query.length === 0 ||
      [
        template.title,
        template.chineseTitle,
        template.description,
        template.searchTerms ??
          template.entries?.map((entry) => entry.english).join(" ") ??
          "",
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query);
    const matchesCategory =
      filters.category === "all" || template.category === filters.category;
    const matchesLevel =
      filters.level === "all" || template.level === filters.level;
    const matchesAge = filters.age === "all" || template.age === filters.age;

    return matchesQuery && matchesCategory && matchesLevel && matchesAge;
  });
}

export function toWorksheetTemplateSummary(
  template: WorksheetTemplate,
): WorksheetTemplateSummary {
  return {
    slug: template.slug,
    title: template.title,
    chineseTitle: template.chineseTitle,
    description: template.description,
    age: template.age,
    level: template.level,
    wordCount: template.wordCount,
    category: template.category,
    previewEntries: template.entries.slice(0, 3),
    searchTerms: template.entries
      .flatMap((entry) => [entry.hanzi, entry.pinyin, entry.english])
      .join(" "),
  };
}
