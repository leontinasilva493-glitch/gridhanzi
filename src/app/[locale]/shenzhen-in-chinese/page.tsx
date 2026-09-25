import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { ShenzhenInChinesePage } from "@/features/worksheets/components/shenzhen-in-chinese-page";
import { buildPageSeoMetadata, toAbsoluteUrl } from "@/features/worksheets/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const title = "Shenzhen (深圳): Meaning, Pronunciation & Writing Guide";
const description =
  "Shenzhen in Chinese is 深圳 (Shēnzhèn). Learn the Mandarin tones, what each character commonly means, see natural example sentences, and practise writing the city name.";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const pageSeo = buildPageSeoMetadata(envConfigs.app_url, "/shenzhen-in-chinese", locale, {
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
  return <ShenzhenInChinesePage locale={locale} />;
}
