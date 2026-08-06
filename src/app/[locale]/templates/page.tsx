import type { Metadata } from "next";

import { TemplatesPage } from "@/features/worksheets/components/templates-page";
import { worksheetTemplates } from "@/features/worksheets/data";
import { envConfigs } from "@/config";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";
import { toWorksheetTemplateSummary } from "@/features/worksheets/templates";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Printable Chinese Writing Worksheets & Hanzi Grid Paper",
    description:
      "Browse printable Chinese writing worksheets, Hanzi grid paper, Tian Zi Ge, Mi Zi Ge, topic word lists, and HSK practice sheets, then edit and print.",
    ...buildPageSeoMetadata(envConfigs.app_url, "/templates", locale),
  };
}

export default function Page() {
  return (
    <TemplatesPage
      templates={worksheetTemplates.map(toWorksheetTemplateSummary)}
    />
  );
}
