import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { envConfigs } from "@/config";
import { StrokeOrderCharacterPage } from "@/features/worksheets/components/stroke-order-character-page";
import {
  getStrokeOrderCharacter,
  indexableStrokeOrderCharacters,
} from "@/features/worksheets/stroke-order-characters";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

type PageProps = {
  params: Promise<{ locale: string; character: string }>;
};

export function generateStaticParams() {
  return indexableStrokeOrderCharacters.map((entry) => ({
    character: entry.character,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, character } = await params;
  const entry = getStrokeOrderCharacter(character);
  if (!entry) return {};

  const { title, description } = entry.seo;
  const pageSeo = buildPageSeoMetadata(
    envConfigs.app_url,
    `/stroke-order/${entry.character}`,
    locale,
  );

  return {
    ...pageSeo,
    title,
    description,
    openGraph: {
      ...pageSeo.openGraph,
      title,
      description,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, character } = await params;
  const entry = getStrokeOrderCharacter(character);
  if (!entry) notFound();

  return <StrokeOrderCharacterPage entry={entry} locale={locale} />;
}
