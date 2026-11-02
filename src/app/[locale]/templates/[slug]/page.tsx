import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { envConfigs } from "@/config";
import { worksheetTemplates } from "@/features/worksheets/data";
import { getTemplateBySlug } from "@/features/worksheets/engine";
import { TemplateDetailPage } from "@/features/worksheets/components/template-detail-page";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";
import { buildTemplateSeoCopy } from "@/features/worksheets/templates";
import { getHskPracticePack } from "@/features/worksheets/hsk-practice-sets";
import { HskPracticePage } from "@/features/worksheets/components/hsk-practice-page";

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

  const pack = getHskPracticePack(slug);
  const copy = buildTemplateSeoCopy(template);
  const title = pack ? pack.title[locale === "zh" ? 1 : 0] : copy.title;
  const description = pack ? pack.description[locale === "zh" ? 1 : 0] : copy.description;

  const pageSeo = buildPageSeoMetadata(
    envConfigs.app_url,
    `/templates/${template.slug}`,
    locale,
    { title, description, chineseIndexable: Boolean(pack) },
  );

  return {
    ...pageSeo,
    title,
    description,
    openGraph: {
      ...pageSeo.openGraph,
      title,
      description,
      type: "article",
      siteName: "GridHanzi",
      images: ["/og-gridhanzi.png"],
    },
  };
}

export default async function Page({ params }: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) notFound();
  const pack = getHskPracticePack(slug);
  if (pack) return <HskPracticePage pack={pack} />;
  return <TemplateDetailPage template={template} />;
}
