import type { Metadata } from "next";

import { GeneratorClient } from "@/features/worksheets/components/generator-client";
import {
  cloneTemplateEntries,
  enrichVocabularyLocally,
  getTemplateBySlug,
  parseVocabularyInput,
} from "@/features/worksheets/engine";
import type { WorksheetDifficulty } from "@/features/worksheets/types";

export const metadata: Metadata = {
  title: "Chinese Worksheet Generator",
  description:
    "Review bilingual vocabulary, choose tracing or writing grids, preview the result, and print a Chinese character practice sheet.",
};

export default async function GeneratorPage({
  searchParams,
}: {
  searchParams: Promise<{
    words?: string;
    template?: string;
    mode?: "trace" | "write" | "quiz";
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
    <GeneratorClient
      initialEntries={
        templateEntries.length > 0
          ? templateEntries
          : wordEntries.length > 0
            ? wordEntries
            : cloneTemplateEntries("family").slice(0, 4)
      }
      initialMode={params.mode}
      initialDifficulty={
        params.difficulty === "advanced" ? "advanced" : "beginner"
      }
      autoEnrich={params.auto === "1" && wordEntries.length > 0}
      templateTitle={template?.title}
      templateChineseTitle={template?.chineseTitle}
    />
  );
}
