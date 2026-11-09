import { notFound } from "next/navigation";
import { envConfigs } from "@/config";
import { RadicalDetailPage } from "@/features/worksheets/components/learning-directory-pages";
import { radicalGuides, radicalTitle, radicalDescription } from "@/features/worksheets/learning-directories";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";
type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return radicalGuides.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const entry = radicalGuides.find(p => p.slug === slug);
  if (!entry) return {};
  const title = radicalTitle(entry), description = radicalDescription(entry);
  return { ...buildPageSeoMetadata(envConfigs.app_url, `/radicals/${slug}`, locale, { title, description }), title, description };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = radicalGuides.find(p => p.slug === slug);
  if (!entry) notFound();
  return <RadicalDetailPage radical={entry} />;
}
