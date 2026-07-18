import type { WorksheetTemplate } from "./types";

export interface WorksheetTemplateFilters {
  query: string;
  category: WorksheetTemplate["category"] | "all";
  level: string | "all";
  age: string | "all";
}

export function filterWorksheetTemplates(
  templates: WorksheetTemplate[],
  filters: WorksheetTemplateFilters,
): WorksheetTemplate[] {
  const query = filters.query.trim().toLocaleLowerCase();

  return templates.filter((template) => {
    const matchesQuery =
      query.length === 0 ||
      [
        template.title,
        template.chineseTitle,
        template.description,
        template.entries.map((entry) => entry.english).join(" "),
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
