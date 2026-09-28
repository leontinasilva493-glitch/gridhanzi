import type { Metadata } from "next";
import { envConfigs } from "@/config";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";
import { hskWritingCharactersPage } from "@/features/worksheets/hsk-editorial-pages";
import { HskWritingCharactersPage } from "@/features/worksheets/components/hsk-writing-characters-page";
import { PublicPageShell } from "@/features/worksheets/components/site-shell";
import { Link } from "@/core/i18n/navigation";
import catalog from "@/features/worksheets/hsk-writing-characters.json";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = buildPageSeoMetadata(envConfigs.app_url, "/hsk/3-0-writing-characters", locale, { title: hskWritingCharactersPage.title, description: hskWritingCharactersPage.description });
  return { ...seo, title: hskWritingCharactersPage.title, description: hskWritingCharactersPage.description, openGraph: { ...seo.openGraph, title: hskWritingCharactersPage.title, description: hskWritingCharactersPage.description } };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PublicPageShell active="hsk"><main className="hs-container pb-16 pt-6"><nav aria-label="Breadcrumb" className="text-sm text-[#617084]"><Link href="/">Home</Link> <span aria-hidden="true"> / </span><span aria-current="page">HSK 3.0 writing characters</span></nav><header className="mt-6 border-b border-[#ded7ca] pb-10"><p className="hs-kicker">Official writing syllabus</p><h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">{hskWritingCharactersPage.heading}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-[#566276]">The HSK 3.0 syllabus lists 1,200 writing characters in six groups. Levels 1–2 and Levels 7–9 are published as combined groups.</p><p className="mt-4 text-sm leading-6 text-[#617084]">Source: <a className="underline" href="https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf" target="_blank" rel="noreferrer">official HSK 3.0 syllabus (PDF)</a>. Choose characters below to make a focused worksheet, or use the <Link href="/stroke-order" className="underline">Chinese stroke-order tool</Link> to look up how a character is written. For test dates, read the <Link href="/hsk/3-0-exam-guide" className="underline">HSK 3.0 exam dates and syllabus guide</Link>.</p></header><HskWritingCharactersPage /><p className="mt-8 text-sm leading-6 text-[#617084]">Need help writing a character? Search for it in the <Link href="/stroke-order" className="underline">Chinese stroke-order tool</Link>.</p></main></PublicPageShell>;
}
