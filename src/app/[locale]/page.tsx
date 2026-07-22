import type { Metadata } from "next";

import { HomePage } from "@/features/worksheets/components/home-page";
import { StructuredData } from "@/features/worksheets/components/structured-data";
import { envConfigs } from "@/config";
import {
  buildPageSeoMetadata,
  toAbsoluteUrl,
} from "@/features/worksheets/seo";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Chinese Character Practice Sheet Generator",
    description:
      "Create free, printable worksheets with this Chinese character practice sheet generator. Add editable Hanzi, Pinyin, tracing and writing grids, then download a PDF.",
    ...buildPageSeoMetadata(envConfigs.app_url, "/", locale),
  };
}

export default function Page() {
  return (
    <>
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "GridHanzi",
            url: envConfigs.app_url,
            logo: toAbsoluteUrl(envConfigs.app_url, envConfigs.app_logo),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "GridHanzi",
            url: envConfigs.app_url,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "GridHanzi — Chinese Character Practice Sheet Generator",
            alternateName: "GridHanzi",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            isAccessibleForFree: true,
            url: envConfigs.app_url,
            description:
              "Create printable Chinese writing worksheets from any English or Chinese vocabulary list with editable Hanzi, Pinyin, tracing, and writing grids.",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What can I make with this Chinese writing worksheet generator?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "This Chinese worksheet generator turns any English or Chinese vocabulary list into editable practice pages with Hanzi, Pinyin, tracing cells, blank writing grids, and optional stroke-order guidance.",
                },
              },
              {
                "@type": "Question",
                name: "Is the printable Chinese worksheet generator free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. You can create, edit, preview, download, and print complete worksheets without creating an account.",
                },
              },
              {
                "@type": "Question",
                name: "Does the Hanzi practice sheet generator include Pinyin and stroke order?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Common vocabulary can be filled with Hanzi, Pinyin, and English meanings. You can review every field and choose whether to show Pinyin and stroke-order guidance before downloading.",
                },
              },
              {
                "@type": "Question",
                name: "Which paper sizes and writing profiles are supported?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Choose A4 or US Letter for printing, or a 3:4 digital worksheet for tablet apps. Kids, Adult, Tablet, and Brush profiles adjust the grid size and layout for different writing tools.",
                },
              },
            ],
          },
        ]}
      />
      <HomePage />
    </>
  );
}
