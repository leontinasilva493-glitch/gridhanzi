import type { Metadata } from "next";

import { HomePage } from "@/features/worksheets/components/home-page";
import { StructuredData } from "@/features/worksheets/components/structured-data";
import { envConfigs } from "@/config";

export const metadata: Metadata = {
  title: "Chinese Character Practice Sheet Generator",
  description:
    "Turn an English or Chinese vocabulary list into printable bilingual Hanzi practice sheets with Pinyin, meanings, tracing, and stroke order.",
};

export default function Page() {
  return (
    <>
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "HanziSheets 汉字字帖",
            url: envConfigs.app_url,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "HanziSheets 汉字字帖",
            url: envConfigs.app_url,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Chinese Character Practice Sheet Generator",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            isAccessibleForFree: true,
            url: envConfigs.app_url,
            description: "Create editable Chinese writing worksheets with Hanzi, Pinyin, English meanings, tracing, and real stroke order.",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Do I need an account?",
                acceptedAnswer: { "@type": "Answer", text: "No. The worksheet generator and PDF download work without an account." },
              },
              {
                "@type": "Question",
                name: "What paper sizes are supported?",
                acceptedAnswer: { "@type": "Answer", text: "The generator supports A4 and US Letter paper." },
              },
            ],
          },
        ]}
      />
      <HomePage />
    </>
  );
}
