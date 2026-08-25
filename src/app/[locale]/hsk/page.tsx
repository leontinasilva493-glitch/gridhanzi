import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { HskDirectoryPage } from "@/features/worksheets/components/hsk-directory-page";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = "HSK Vocabulary Lists: HSK 2.0 vs 3.0";
  const description = "Compare searchable HSK 2.0 and HSK 3.0 vocabulary lists, select words by Hanzi, Pinyin, or English, and make printable writing practice.";
  const seo = buildPageSeoMetadata(envConfigs.app_url, "/hsk", locale);
  return { ...seo, title, description, openGraph: { ...seo.openGraph, title, description } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <HskDirectoryPage locale={locale} />;
}
