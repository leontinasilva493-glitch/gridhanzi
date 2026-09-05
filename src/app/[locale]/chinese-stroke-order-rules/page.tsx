import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { StrokeOrderRulesPage } from "@/features/worksheets/components/stroke-order-rules-page";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = "Chinese Stroke Order Rules with Examples";
  const description = "Learn eight core Chinese stroke order rules with clear Hanzi examples, important exceptions, common layout mistakes, and printable writing practice.";
  const seo = buildPageSeoMetadata(envConfigs.app_url, "/chinese-stroke-order-rules", locale, { title, description });
  return { ...seo, title, description, openGraph: { ...seo.openGraph, title, description } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <StrokeOrderRulesPage locale={locale} />;
}
