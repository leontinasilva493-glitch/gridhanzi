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
    title: "Printable Chinese Writing Worksheets",
    description:
      "Browse printable Chinese writing worksheets by topic, age, or HSK level, then edit the word list and grid.",
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
