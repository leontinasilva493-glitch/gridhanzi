import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";
import { PracticePageClient } from "@/features/worksheets/components/practice-page-client";
import { PublicPageShell } from "@/features/worksheets/components/site-shell";
import { resolveInitialPracticeCharacter } from "@/features/worksheets/practice-session";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Chinese Character Practice Session",
    description:
      "Practise recommended Chinese characters in one continuous follow-and-fill session, then open each Hanzi guide or printable worksheet.",
    ...buildPageSeoMetadata(envConfigs.app_url, "/practice", locale),
    robots: { index: false, follow: true },
  };
}

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ character?: string | string[] }>;
}) {
  const query = await searchParams;
  const initialCharacter = resolveInitialPracticeCharacter(
    Array.isArray(query.character) ? query.character[0] : query.character,
  );

  return (
    <PublicPageShell active="stroke-order">
      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/">Home</Link>
          <span aria-hidden="true"> &nbsp;/&nbsp; </span>
          <Link href="/stroke-order">Stroke Order</Link>
          <span aria-hidden="true"> &nbsp;/&nbsp; </span>
          <span aria-current="page">Practice</span>
        </nav>

        <header className="mt-6 grid items-end gap-6 border-b border-[#ded7ca] pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.45fr)]">
          <div>
            <p className="hs-kicker">Continuous follow &amp; fill</p>
            <h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
              Practice Chinese Characters
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#566276] sm:text-lg sm:leading-8">
              Stay close to each standard template stroke and move at your own pace. Complete one Hanzi, then continue through a recommended practice set.
            </p>
          </div>
          <aside className="rounded border border-[#d8c49f] bg-[#fff9ed] p-5 text-sm leading-6 text-[#5d6878]">
            <strong className="block text-[#172b49]">How this practice works</strong>
            Your cursor controls the speed and position of the reveal. The finished stroke keeps the clean template shape.
          </aside>
        </header>

        <PracticePageClient initialCharacter={initialCharacter} />
      </main>
    </PublicPageShell>
  );
}
