import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { StrokeOrderClient } from "@/features/worksheets/components/stroke-order-client";
import { PublicPageShell } from "@/features/worksheets/components/site-shell";
import {
  groupStrokeOrderCharactersByTier,
  indexableStrokeOrderCharacters as strokeOrderCharacters,
  strokeOrderLearningTiers,
} from "@/features/worksheets/stroke-order-characters";
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
  const groupedStrokeOrderCharacters = groupStrokeOrderCharactersByTier(
    strokeOrderCharacters,
  );
  const tierDescriptions: Record<(typeof strokeOrderLearningTiers)[number], string> = {
    "High-frequency": "Start with characters that recur across everyday reading and writing.",
    Beginner: "Build early conversation and classroom vocabulary one character at a time.",
    Advanced: "Extend your recognition with more specialised word-family anchors.",
    Foundation: "Strengthen familiar building blocks before moving into longer words.",
  };

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

        <section className="mt-10 border-t border-[#ded7ca] pt-8" aria-labelledby="hsk-paths-title">
          <div className="rounded border border-[#d8c49f] bg-[#fff9ed] p-6 sm:p-8">
            <p className="hs-kicker">Choose a learning path</p>
            <h2 id="hsk-paths-title" className="hs-display mt-2 text-3xl font-bold">
              Start a worksheet from an HSK list
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5d6878]">
              Open the existing picker to choose the version and level that fit your study plan, then return here for focused stroke-order practice.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/generator?hskSystem=3.0&hskLevel=1" className="hs-primary-button min-h-12 px-5">
                Choose HSK 3.0 Level 1 <ArrowRight className="size-4" />
              </Link>
              <Link href="/generator?hskSystem=2.0&hskLevel=1" className="hs-secondary-button min-h-12 px-5">
                Choose HSK 2.0 Level 1 <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="popular-guides-title">
          <p className="hs-kicker">Learn in context</p>
          <h2 id="popular-guides-title" className="hs-display mt-2 text-3xl font-bold">
            Character guide learning paths
          </h2>
          <div className="mt-6 space-y-9">
            {groupedStrokeOrderCharacters.map((group) => (
              <section key={group.tier} aria-labelledby={`${group.tier}-guides-title`}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 id={`${group.tier}-guides-title`} className="hs-display text-2xl font-bold">
                      {group.tier}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5d6878]">
                      {tierDescriptions[group.tier]}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#edf1f5] px-3 py-1.5 text-sm font-bold text-[#42516a]">
                    {group.entries.length} guides
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.entries.map((entry) => (
                    <Link
                      key={entry.character}
                      href={`/stroke-order/${entry.character}`}
                      className="hs-card group flex min-h-12 min-w-0 items-center gap-4 p-5 transition-transform hover:-translate-y-0.5"
                    >
                      <span className="hs-hanzi-context text-5xl text-[#172b49]">
                        {entry.character}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold text-[#172b49]">{entry.pinyin}</span>
                        <span className="mt-1 block text-sm text-[#647084]">
                          {entry.meaning} · {entry.strokes} strokes
                        </span>
                        <span className="mt-2 block text-sm font-bold text-[#b62822]">View guide</span>
                      </span>
                      <ArrowRight className="ml-auto size-4 shrink-0 text-[#b62822]" />
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
