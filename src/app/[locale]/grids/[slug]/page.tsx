import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { envConfigs } from "@/config";
import { GridPaperPageView } from "@/features/worksheets/components/grid-paper-page";
import { getGridPaperPage, gridPaperPages } from "@/features/worksheets/grid-pages";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return gridPaperPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getGridPaperPage(slug);
  if (!page) return {};

  const pageSeo = buildPageSeoMetadata(envConfigs.app_url, `/grids/${page.slug}`, locale);
  return {
    ...pageSeo,
    title: { absolute: page.title },
    description: page.description,
    openGraph: {
      ...pageSeo.openGraph,
      title: page.title,
      description: page.description,
      type: "article",
    },
  };
}

export default async function Page({ params }: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getGridPaperPage(slug);
  if (!page) notFound();

  return <GridPaperPageView page={page} />;
}
