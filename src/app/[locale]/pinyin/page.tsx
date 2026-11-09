import { envConfigs } from "@/config";
import { PinyinPage } from "@/features/worksheets/components/learning-directory-pages";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = "Chinese Pinyin Chart - Initials, Finals, Tones & Practice";
  const description = "Explore a Mandarin pinyin syllable chart and 30 guided lessons with tone examples, character links and printable worksheets. Learn initials and finals.";
  return { ...buildPageSeoMetadata(envConfigs.app_url, "/pinyin", locale, { title, description }), title, description };
}
export default function Page() { return <PinyinPage />; }
