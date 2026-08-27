import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { envConfigs } from "@/config";
import { worksheetTemplates } from "@/features/worksheets/data";
import { getTemplateBySlug } from "@/features/worksheets/engine";
import { TemplateDetailPage } from "@/features/worksheets/components/template-detail-page";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";
import { buildTemplateSeoCopy } from "@/features/worksheets/templates";

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

  const { title, description } = buildTemplateSeoCopy(template);

  const pageSeo = buildPageSeoMetadata(
    envConfigs.app_url,
    `/templates/${template.slug}`,
    locale,
    { title, description },
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
  return <TemplateDetailPage template={template} />;
}
