import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { CharacterComponentsPage } from "@/features/worksheets/components/character-components-page";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = "Chinese Character Components: Meaning & Sound Clues";
  const description = "Learn how Chinese character components suggest meaning or sound. Explore six curated families with example Hanzi, writing guidance and worksheets.";
  const seo = buildPageSeoMetadata(envConfigs.app_url, "/chinese-character-components", locale, { title, description });
  return { ...seo, title, description, openGraph: { ...seo.openGraph, title, description } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CharacterComponentsPage locale={locale} />;
}
