import type { Metadata } from "next";
import { ArrowRight, PencilLine } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";
import { StrokeOrderDictionaryClient } from "@/features/worksheets/components/stroke-order-dictionary-client";
import { PublicPageShell } from "@/features/worksheets/components/site-shell";
import { StructuredData } from "@/features/worksheets/components/structured-data";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";
import { indexableStrokeOrderCharacters } from "@/features/worksheets/stroke-order-characters";
import { toStrokeOrderDictionaryEntries } from "@/features/worksheets/stroke-order-dictionary";

const pathname = "/chinese-stroke-order-dictionary";
const title = "Chinese Stroke Order Dictionary for Common Hanzi";
const description = "Browse reviewed Chinese characters by Hanzi, Pinyin, English meaning, radical, or stroke count. Open animated stroke guides and make printable writing worksheets.";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = buildPageSeoMetadata(envConfigs.app_url, pathname, locale, { title, description });
  return { ...seo, title, description };
}

export default async function Page({ params }: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const entries = toStrokeOrderDictionaryEntries(indexableStrokeOrderCharacters);
  const localePrefix = locale === "zh" ? "/zh" : "";
  const siteUrl = envConfigs.app_url.replace(/\/$/, "");
  const pageUrl = `${siteUrl}${localePrefix}${pathname}`;

  return (
    <PublicPageShell active="stroke-order">
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          description,
          url: pageUrl,
          inLanguage: "en",
          isAccessibleForFree: true,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}${localePrefix || "/"}` },
            { "@type": "ListItem", position: 2, name: "Chinese Stroke Order", item: `${siteUrl}${localePrefix}/stroke-order` },
            { "@type": "ListItem", position: 3, name: "Dictionary", item: pageUrl },
          ],
        },
      ]} />

      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/" className="hover:text-[#b62822]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/stroke-order" className="hover:text-[#b62822]">Stroke Order</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">Dictionary</span>
        </nav>

        <header className="mt-8 max-w-4xl">
          <p className="hs-kicker">Find the Hanzi you want to write</p>
          <h1 className="hs-display mt-3 text-4xl font-bold leading-tight sm:text-5xl">Chinese Stroke Order Dictionary</h1>
          <p className="mt-5 text-lg leading-8 text-[#4f5d71]">
            Browse {entries.length} reviewed character guides by sound, meaning, radical, or stroke count.
            Open a character to watch each stroke and learn how it is used, then turn it into a printable practice sheet.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold">
            <Link href="/stroke-order?mode=draw#character-lookup" className="inline-flex min-h-11 items-center gap-2 text-[#24466e] underline underline-offset-4 hover:text-[#b62822]">
              <PencilLine aria-hidden="true" className="size-4" /> Draw a character you cannot type
            </Link>
            <Link href="/chinese-stroke-order-rules" className="inline-flex min-h-11 items-center gap-1 text-[#24466e] underline underline-offset-4 hover:text-[#b62822]">
              Learn the stroke-order rules <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </header>

        <StrokeOrderDictionaryClient entries={entries} />

        <section aria-labelledby="dictionary-how-title" className="hs-card mt-12 p-6 sm:p-8">
          <p className="hs-kicker">Three ways to start</p>
          <h2 id="dictionary-how-title" className="hs-display mt-2 text-3xl font-bold">Find a character, then practise it</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold text-[#172b49]">Know how it sounds?</h3>
              <p className="mt-2 text-sm leading-7 text-[#566276]">Type Pinyin with or without tone marks. Search for <span className="font-semibold">ai</span> or <span className="font-semibold">ài</span> to find 爱 in this collection.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#172b49]">Recognise part of its shape?</h3>
              <p className="mt-2 text-sm leading-7 text-[#566276]">Choose a radical and total stroke count together to narrow the reviewed guides. If the character is unfamiliar, try the handwriting lookup.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#172b49]">Ready to write it?</h3>
              <p className="mt-2 text-sm leading-7 text-[#566276]">Open the guide for an animated sequence, pronunciation, and examples. Use its worksheet link to print tracing and independent writing cells.</p>
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
