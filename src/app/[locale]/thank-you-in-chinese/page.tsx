import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { ThankYouInChinesePage } from "@/features/worksheets/components/thank-you-in-chinese-page";
import { buildPageSeoMetadata, toAbsoluteUrl } from "@/features/worksheets/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const title = "Thank You in Chinese: 谢谢 (Xièxie) Meaning & Usage";
const description =
  "Learn how to say thank you in Chinese with 谢谢 (xièxie). See simplified and traditional forms, understand the natural pronunciation, read polite examples, and practise writing the characters.";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const pageSeo = buildPageSeoMetadata(envConfigs.app_url, "/thank-you-in-chinese", locale, {
    title,
    description,
  });

  return {
    ...pageSeo,
    title,
    description,
    openGraph: { ...pageSeo.openGraph, title, description },
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
  return <ThankYouInChinesePage locale={locale} />;
}
