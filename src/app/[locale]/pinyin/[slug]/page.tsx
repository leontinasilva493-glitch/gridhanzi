import { notFound } from "next/navigation";
import { envConfigs } from "@/config";
import { PinyinDetailPage } from "@/features/worksheets/components/learning-directory-pages";
import { pinyinGuides, pinyinTitle, pinyinDescription } from "@/features/worksheets/learning-directories";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";
type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return pinyinGuides.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const entry = pinyinGuides.find(p => p.slug === slug);
  if (!entry) return {};
  const title = pinyinTitle(entry), description = pinyinDescription(entry);
  return { ...buildPageSeoMetadata(envConfigs.app_url, `/pinyin/${slug}`, locale, { title, description }), title, description };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = pinyinGuides.find(p => p.slug === slug);
  if (!entry) notFound();
  return <PinyinDetailPage guide={entry} />;
}
