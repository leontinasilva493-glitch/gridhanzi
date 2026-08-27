import type { Metadata } from "next";

import { HomePage } from "@/features/worksheets/components/home-page";
import { StructuredData } from "@/features/worksheets/components/structured-data";
import { envConfigs } from "@/config";
import {
  buildPageSeoMetadata,
  toAbsoluteUrl,
} from "@/features/worksheets/seo";

const homeTitle = "Chinese Character Worksheet Generator";
const homeDescription =
  "Use this free Chinese character worksheet generator to turn English or Chinese word lists into editable Hanzi, Pinyin, tracing, and writing-grid PDFs.";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: homeTitle,
    description: homeDescription,
    ...buildPageSeoMetadata(envConfigs.app_url, "/", locale, {
      title: homeTitle,
      description: homeDescription,
    }),
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
            name: homeTitle,
            alternateName: "GridHanzi",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            isAccessibleForFree: true,
            url: envConfigs.app_url,
            description: homeDescription,
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What can I make with this Chinese character worksheet generator?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "This Chinese worksheet generator turns any English or Chinese vocabulary list into editable practice pages with Hanzi, Pinyin, tracing cells, blank writing grids, Hanzi grid paper, and optional stroke-order guidance.",
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
              {
                "@type": "Question",
                name: "Can I print Hanzi grid paper or Chinese character grids?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Use Tian Zi Ge or Mi Zi Ge settings to make printable Hanzi grid paper, then preview and save the Chinese character grid as a PDF.",
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
