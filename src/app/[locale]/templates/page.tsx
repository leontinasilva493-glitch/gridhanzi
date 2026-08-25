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
    title: {
      absolute: "Free Printable Chinese Writing Worksheets (PDF) | GridHanzi",
    },
    description:
      "Browse free printable Chinese writing worksheets with Hanzi, Pinyin, tracing, topic word lists, and HSK practice, then edit and save a PDF.",
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
