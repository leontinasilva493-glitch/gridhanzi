import type { Metadata } from "next";

import { GeneratorClient } from "@/features/worksheets/components/generator-client";
import { StructuredData } from "@/features/worksheets/components/structured-data";
import {
  cloneTemplateEntries,
  enrichVocabularyLocally,
  getTemplateBySlug,
  parseVocabularyInput,
} from "@/features/worksheets/engine";
import type { HskLevel, HskSystem } from "@/features/worksheets/hsk";
import { parseWorksheetProfile } from "@/features/worksheets/profiles";
import type { WorksheetDifficulty } from "@/features/worksheets/types";
import { isChineseLocale } from "@/features/worksheets/i18n";
import { envConfigs } from "@/config";
import { buildPageSeoMetadata, toAbsoluteUrl } from "@/features/worksheets/seo";

const DEFAULT_HSK_SELECTION = {
  system: "2.0",
  level: "1",
} as const satisfies { system: HskSystem; level: HskLevel };

const HSK_20_LEVELS = new Set<HskLevel>(["1", "2", "3", "4", "5", "6"]);
const HSK_30_LEVELS = new Set<HskLevel>(["1", "2", "3", "4", "5", "6", "7-9"]);

const englishGeneratorCopy = {
  title: "Chinese Worksheet Generator: Free Mandarin Practice Sheets",
  description:
    "Make free Mandarin practice sheets with editable Hanzi, Pinyin, tracing, Chinese writing grids, Hanzi grid paper, and printable PDF output.",
  applicationName: "GridHanzi Chinese Worksheet Generator",
  applicationDescription:
    "Create printable Mandarin and Chinese worksheets from English or Chinese vocabulary with editable Hanzi, Pinyin, writing grids, Hanzi grid paper, stroke-order guidance, and PDF output.",
  featureList: [
    "Editable Hanzi, Pinyin, and English vocabulary rows",
    "Tracing, handwriting practice, and recall test worksheet modes",
    "Tian Zi Ge and Mi Zi Ge writing grids",
    "Printable Hanzi grid paper and Chinese character grids",
    "Optional Pinyin and stroke-order guidance",
    "A4, US Letter, and tablet PDF formats",
  ],
} as const;

const chineseGeneratorCopy = {
  title: "在线汉字字帖生成器",
  description:
    "输入中文或英文词汇，生成带汉字、拼音、描红格和空白练习格的可打印中文练习纸。",
  applicationName: "GridHanzi 在线汉字字帖生成器",
  applicationDescription:
    "输入中文或英文词汇，生成可编辑的汉字、拼音、描红格、书写格、笔顺提示和 PDF 字帖。",
  featureList: [
    "编辑汉字、拼音和英文释义",
    "描红、书写练习和默写测试模式",
    "田字格和米字格",
    "可选拼音和笔顺提示",
    "A4、US Letter 和平板 PDF 格式",
  ],
} as const;

function getGeneratorCopy(locale: string) {
  return isChineseLocale(locale) ? chineseGeneratorCopy : englishGeneratorCopy;
}

export function parseGeneratorHskSelection(query: {
  hskSystem?: string;
  hskLevel?: string;
}): { system: HskSystem; level: HskLevel } {
  if (query.hskSystem === "2.0" && HSK_20_LEVELS.has(query.hskLevel as HskLevel)) {
    return { system: "2.0", level: query.hskLevel as HskLevel };
  }

  if (query.hskSystem === "3.0" && HSK_30_LEVELS.has(query.hskLevel as HskLevel)) {
    return { system: "3.0", level: query.hskLevel as HskLevel };
  }

  return DEFAULT_HSK_SELECTION;
}

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = getGeneratorCopy(locale);
  const pageSeo = buildPageSeoMetadata(
    envConfigs.app_url,
    "/generator",
    locale,
    { chineseIndexable: true },
  );

  return {
    ...pageSeo,
    title: copy.title,
    description: copy.description,
    openGraph: {
      ...pageSeo.openGraph,
      title: copy.title,
      description: copy.description,
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [toAbsoluteUrl(envConfigs.app_url, "/og-gridhanzi.png")],
    },
  };
}

export default async function GeneratorPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    words?: string;
    template?: string;
    mode?: "trace" | "write" | "quiz";
    profile?: string;
    difficulty?: WorksheetDifficulty;
    auto?: string;
    hskSystem?: string;
    hskLevel?: string;
  }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const copy = getGeneratorCopy(locale);
  const chinese = isChineseLocale(locale);
  const initialHskSelection = parseGeneratorHskSelection(query);
  const template = getTemplateBySlug(query.template);
  const templateEntries = query.template
    ? cloneTemplateEntries(query.template)
    : [];
  const wordEntries = query.words
    ? enrichVocabularyLocally(parseVocabularyInput(query.words))
    : [];

  return (
    <>
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: copy.applicationName,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            isAccessibleForFree: true,
            url: toAbsoluteUrl(
              envConfigs.app_url,
              chinese ? "/zh/generator" : "/generator",
            ),
            description: copy.applicationDescription,
            featureList: [...copy.featureList],
            inLanguage: chinese ? "zh-Hans" : "en",
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
                  text: "It creates editable Mandarin and Chinese writing worksheets with Hanzi, Pinyin, English meanings, tracing grids, blank writing cells, Hanzi grid paper, optional stroke-order guidance, and PDF output.",
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
              {
                "@type": "Question",
                name: "Can I make Mandarin practice sheets and Hanzi grid paper?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The generator works as a Mandarin worksheet generator and lets you print Tian Zi Ge or Mi Zi Ge Hanzi grid paper for Chinese character practice.",
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
        initialMode={query.mode}
        initialProfile={parseWorksheetProfile(
          query.profile ?? template?.recommendedProfile,
        )}
        initialDifficulty={
          query.difficulty === "advanced" ? "advanced" : "beginner"
        }
        autoEnrich={query.auto === "1" && wordEntries.length > 0}
        templateTitle={template?.title}
        templateChineseTitle={template?.chineseTitle}
        initialHskSystem={initialHskSelection.system}
        initialHskLevel={initialHskSelection.level}
      />
    </>
  );
}
