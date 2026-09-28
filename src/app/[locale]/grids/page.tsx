import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { GridPaperIndexPage } from "@/features/worksheets/components/grid-paper-index-page";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = "Free Chinese Grid Paper PDFs: Tian Zi Ge & Mi Zi Ge";
  const description = "Print free Chinese grid paper for handwriting practice. Compare Tian Zi Ge, Mi Zi Ge, and blank A4 PDFs, or create a worksheet from your own Hanzi.";
  const pageSeo = buildPageSeoMetadata(envConfigs.app_url, "/grids", locale, {
    title,
    description,
  });

  return {
    ...pageSeo,
    title,
    description,
    openGraph: { ...pageSeo.openGraph, title, description },
  };
}

export default function Page() {
  return <GridPaperIndexPage />;
}
