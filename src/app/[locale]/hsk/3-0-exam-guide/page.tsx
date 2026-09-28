import type { Metadata } from "next";
import { envConfigs } from "@/config";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";
import { hskExamGuide } from "@/features/worksheets/hsk-editorial-pages";
import { Hsk3ExamGuidePage } from "@/features/worksheets/components/hsk-3-0-exam-guide-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = buildPageSeoMetadata(envConfigs.app_url, "/hsk/3-0-exam-guide", locale, { title: hskExamGuide.title, description: hskExamGuide.description });
  return { ...seo, title: hskExamGuide.title, description: hskExamGuide.description, openGraph: { ...seo.openGraph, title: hskExamGuide.title, description: hskExamGuide.description } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <Hsk3ExamGuidePage locale={locale} />;
}
