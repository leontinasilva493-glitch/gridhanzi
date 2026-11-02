import type { Metadata } from "next";
import { envConfigs } from "@/config";
import { p1LearningPages } from "./p1-learning-pages";
import { buildPageSeoMetadata } from "./seo";
import { P1LearningPage } from "./components/p1-learning-page";

export type LearningPageProps = { params: Promise<{ locale: string }> };
export async function learningMetadata(path: string, { params }: LearningPageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = p1LearningPages.find(item => item.path === path)!;
  const title = (page.seoTitle ?? page.title)[locale === "zh" ? 1 : 0];
  const description = page.description[locale === "zh" ? 1 : 0];
  return { ...buildPageSeoMetadata(envConfigs.app_url, path, locale, { title, description, chineseIndexable: true }), title, description };
}
export async function renderLearningPage(path: string, { params }: LearningPageProps) {
  const { locale } = await params;
  return <P1LearningPage page={p1LearningPages.find(item => item.path === path)!} locale={locale} />;
}
