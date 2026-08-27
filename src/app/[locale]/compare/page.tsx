import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { ComparisonDirectoryPage } from "@/features/worksheets/components/comparison-directory-page";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = "Commonly Confused Chinese Characters";
  const description = "Compare 的得地, 不没, 来去, 在再, 上下, 好坏, 人入, and 牛午 with decision rules, corrected examples, stroke cues, and worksheets.";
  const seo = buildPageSeoMetadata(envConfigs.app_url, "/compare", locale, {
    title,
    description,
  });
  return { ...seo, title, description, openGraph: { ...seo.openGraph, title, description } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ComparisonDirectoryPage locale={locale} />;
}
