import type { Metadata } from "next";

import { StrokeOrderClient } from "@/features/worksheets/components/stroke-order-client";
import { PublicPageShell } from "@/features/worksheets/components/site-shell";
import { strokeOrderCharacters } from "@/features/worksheets/stroke-order-characters";
import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Chinese Stroke Order",
    description:
      "Enter a Chinese character to see its stroke order, play one stroke at a time, practise on screen, or add it to a worksheet.",
    ...buildPageSeoMetadata(envConfigs.app_url, "/stroke-order", locale),
  };
}

export default function StrokeOrderPage() {
  return (
    <PublicPageShell active="stroke-order">
      <main className="hs-container pb-16 pt-6">
        <div className="text-sm text-[#617084]">Home &nbsp;/&nbsp; Stroke Order</div>
        <header className="mt-2 text-center">
          <h1 className="hs-display text-4xl font-bold sm:text-5xl">
            Chinese Stroke Order
          </h1>
          <p className="mt-2 text-[#566276]">
            Enter a character to watch the strokes, practise on screen, or add
            it to a worksheet.
          </p>
        </header>
        <StrokeOrderClient />

        <section className="mt-10 border-t border-[#ded7ca] pt-8" aria-labelledby="popular-guides-title">
          <p className="hs-kicker">Learn in context</p>
          <h2 id="popular-guides-title" className="hs-display mt-2 text-3xl font-bold">
            Popular character guides
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5d6878]">
            Open a complete guide for stroke animation, step-by-step diagrams,
            meaning, HSK level, example words, and printable practice.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {strokeOrderCharacters.map((entry) => (
              <Link
                key={entry.character}
                href={`/stroke-order/${entry.character}`}
                className="hs-card group flex min-w-0 items-center gap-4 p-5 transition-transform hover:-translate-y-0.5"
              >
                <span className="hs-hanzi-context text-5xl text-[#172b49]">
                  {entry.character}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-[#172b49]">
                    {entry.pinyin}
                  </span>
                  <span className="mt-1 block text-sm text-[#647084]">
                    {entry.meaning} · {entry.strokes} strokes
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
