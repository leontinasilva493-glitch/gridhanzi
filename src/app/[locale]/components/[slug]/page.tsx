import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { envConfigs } from "@/config";
import { CharacterComponentDetailPage } from "@/features/worksheets/components/character-component-detail-page";
import { characterComponentPages, getCharacterComponentPage } from "@/features/worksheets/character-components";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return characterComponentPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getCharacterComponentPage(slug);
  if (!page) return {};
  const seo = buildPageSeoMetadata(envConfigs.app_url, `/components/${page.slug}`, locale, { title: page.title, description: page.description });
  return { ...seo, title: page.title, description: page.description, openGraph: { ...seo.openGraph, title: page.title, description: page.description } };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  const page = getCharacterComponentPage(slug);
  if (!page) notFound();
  return <CharacterComponentDetailPage page={page} locale={locale} />;
}
