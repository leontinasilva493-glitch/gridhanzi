import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { envConfigs } from "@/config";
import { ComparisonDetailPage } from "@/features/worksheets/components/comparison-detail-page";
import { comparisonPages, getComparisonPage } from "@/features/worksheets/comparison-pages";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() { return comparisonPages.map((page) => ({ slug: page.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getComparisonPage(slug);
  if (!page) return {};
  const seo = buildPageSeoMetadata(envConfigs.app_url, `/compare/${page.slug}`, locale);
  return { ...seo, title: page.title, description: page.description, openGraph: { ...seo.openGraph, title: page.title, description: page.description } };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  const page = getComparisonPage(slug);
  if (!page) notFound();
  return <ComparisonDetailPage page={page} locale={locale} />;
}
