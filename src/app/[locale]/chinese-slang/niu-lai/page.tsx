import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { NiuLaiPage } from "@/features/worksheets/components/niu-lai-page";
import { niuLaiGuide } from "@/features/worksheets/niu-lai";
import { buildPageSeoMetadata, toAbsoluteUrl } from "@/features/worksheets/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = niuLaiGuide.seo;
  const pageSeo = buildPageSeoMetadata(
    envConfigs.app_url,
    "/chinese-slang/niu-lai",
    locale,
  );

  return {
    ...pageSeo,
    title,
    description,
    openGraph: {
      ...pageSeo.openGraph,
      type: "article",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [toAbsoluteUrl(envConfigs.app_url, "/og-gridhanzi.png")],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <NiuLaiPage locale={locale} />;
}
