import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { GridPaperIndexPage } from "@/features/worksheets/components/grid-paper-index-page";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = "Hanzi Grid Paper: Tian Zi Ge & Mi Zi Ge";
  const description = "Free printable Hanzi grid paper for Chinese writing practice. Download Tian Zi Ge, Mi Zi Ge and blank grid PDFs, or make custom Hanzi worksheets.";
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
