import type { Metadata } from "next";

import { GeneratorClient } from "@/features/worksheets/components/generator-client";
import { StructuredData } from "@/features/worksheets/components/structured-data";
import {
  cloneTemplateEntries,
  enrichVocabularyLocally,
  getTemplateBySlug,
  parseVocabularyInput,
} from "@/features/worksheets/engine";
import { parseWorksheetProfile } from "@/features/worksheets/profiles";
import type { WorksheetDifficulty } from "@/features/worksheets/types";
import { envConfigs } from "@/config";
import { buildPageSeoMetadata, toAbsoluteUrl } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Chinese Worksheet Generator",
    description:
      "Review bilingual vocabulary, choose tracing or writing grids, preview the result, and print a Chinese character practice sheet.",
    ...buildPageSeoMetadata(envConfigs.app_url, "/generator", locale, {
      chineseIndexable: true,
    }),
  };
}

export default async function GeneratorPage({
  searchParams,
}: {
  searchParams: Promise<{
    words?: string;
    template?: string;
    mode?: "trace" | "write" | "quiz";
    profile?: string;
    difficulty?: WorksheetDifficulty;
    auto?: string;
  }>;
}) {
  const params = await searchParams;
  const template = getTemplateBySlug(params.template);
  const templateEntries = params.template
    ? cloneTemplateEntries(params.template)
    : [];
  const wordEntries = params.words
    ? enrichVocabularyLocally(parseVocabularyInput(params.words))
    : [];

  return (
    <>
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "GridHanzi Chinese Worksheet Generator",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            isAccessibleForFree: true,
            url: toAbsoluteUrl(envConfigs.app_url, "/generator"),
            description:
              "Create printable Chinese worksheets from English or Chinese vocabulary with editable Hanzi, Pinyin, writing grids, stroke-order guidance, and PDF output.",
            featureList: [
              "Editable Hanzi, Pinyin, and English vocabulary rows",
              "Tracing, handwriting practice, and recall test worksheet modes",
              "Tian Zi Ge and Mi Zi Ge writing grids",
              "Optional Pinyin and stroke-order guidance",
              "A4, US Letter, and tablet PDF formats",
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What does the Chinese worksheet generator create?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "It creates editable Chinese writing worksheets with Hanzi, Pinyin, English meanings, tracing grids, blank writing cells, optional stroke-order guidance, and PDF output.",
                },
              },
              {
                "@type": "Question",
                name: "Can I paste English words into the worksheet generator?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. You can paste English or Chinese vocabulary, review the filled Hanzi and Pinyin, edit every row, and print the final worksheet.",
                },
              },
              {
                "@type": "Question",
                name: "Does the worksheet generator include stroke order?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. You can show stroke-order guidance on worksheet rows and use the separate stroke-order tool to check a character before printing.",
                },
              },
            ],
          },
        ]}
      />
      <GeneratorClient
        initialEntries={
          templateEntries.length > 0
            ? templateEntries
            : wordEntries.length > 0
              ? wordEntries
              : cloneTemplateEntries("family").slice(0, 4)
        }
        initialMode={params.mode}
        initialProfile={parseWorksheetProfile(
          params.profile ?? template?.recommendedProfile,
        )}
        initialDifficulty={
          params.difficulty === "advanced" ? "advanced" : "beginner"
        }
        autoEnrich={params.auto === "1" && wordEntries.length > 0}
        templateTitle={template?.title}
        templateChineseTitle={template?.chineseTitle}
      />
    </>
  );
}
