import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { envConfigs } from "@/config";
import { HskLevelPage } from "@/features/worksheets/components/hsk-level-page";
import {
  getHskPublicPageFromRoute,
  getHskPublicPath,
  getHskSystemSlug,
  hskPublicPages,
} from "@/features/worksheets/hsk-pages";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

type PageProps = { params: Promise<{ locale: string; system: string; level: string }> };

export function generateStaticParams() {
  return hskPublicPages.map((page) => ({ system: getHskSystemSlug(page.system), level: `level-${page.level}` }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, system, level } = await params;
  const page = getHskPublicPageFromRoute(system, level);
  if (!page) return {};
  const pathname = getHskPublicPath(page);
  const seo = buildPageSeoMetadata(envConfigs.app_url, pathname, locale);
  return { ...seo, title: page.title, description: page.description, openGraph: { ...seo.openGraph, title: page.title, description: page.description } };
}

export default async function Page({ params }: PageProps) {
  const { locale, system, level } = await params;
  const page = getHskPublicPageFromRoute(system, level);
  if (!page) notFound();
  return <HskLevelPage page={page} locale={locale} />;
}
