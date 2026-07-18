import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { envConfigs } from "@/config";
import { worksheetTemplates } from "@/features/worksheets/data";
import { getTemplateBySlug } from "@/features/worksheets/engine";
import { TemplateDetailPage } from "@/features/worksheets/components/template-detail-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return worksheetTemplates.map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return {};

  const localePrefix = locale === "en" ? "" : `/${locale}`;
  const canonical = `${envConfigs.app_url}${localePrefix}/templates/${template.slug}`;
  const title = `${template.title} Chinese Writing Worksheet`;
  const description = `${template.description} Edit and download ${template.wordCount} Hanzi words with Pinyin, meanings, tracing, and real stroke order.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      siteName: "HanziSheets 汉字字帖",
    },
  };
}

export default async function Page({ params }: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) notFound();
  return <TemplateDetailPage template={template} />;
}
