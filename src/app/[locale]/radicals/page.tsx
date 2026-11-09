import { envConfigs } from "@/config";
import { RadicalsPage } from "@/features/worksheets/components/learning-directory-pages";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = "Chinese Radicals - All 214 Kangxi Radicals with Meanings";
  const description = "Browse all 214 Kangxi radicals by stroke count, find a character’s radical, and practise 30 starter families with pinyin, examples and free worksheets.";
  return { ...buildPageSeoMetadata(envConfigs.app_url, "/radicals", locale, { title, description }), title, description };
}
export default function Page() { return <RadicalsPage />; }
