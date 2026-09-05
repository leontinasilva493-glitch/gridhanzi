import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { HskLevelCheckerPage } from "@/features/worksheets/components/hsk-level-checker-page";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = "HSK Level Checker for Chinese Text (2.0 & 3.0)";
  const description = "Paste Chinese text to check its HSK 2.0 and 3.0 levels, find difficult words and characters, and turn them into a printable writing worksheet.";
  const seo = buildPageSeoMetadata(envConfigs.app_url, "/hsk-level-checker", locale, { title, description });
  return { ...seo, title, description, openGraph: { ...seo.openGraph, title, description } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <HskLevelCheckerPage locale={locale} />;
}
