import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";
import { HskWritingGroupBrowser } from "@/features/worksheets/components/hsk-writing-group-browser";
import { PublicPageShell } from "@/features/worksheets/components/site-shell";
import { StructuredData } from "@/features/worksheets/components/structured-data";
import {
  getHskWritingGroupBySlug,
  HSK_WRITING_PDF_PAGES,
  HSK_WRITING_PRINTED_PAGES,
  HSK_WRITING_SOURCE_LABEL,
  HSK_WRITING_SOURCE_URL,
  hskWritingGroupPages,
} from "@/features/worksheets/hsk-writing-groups";
import { buildPageSeoMetadata, toAbsoluteUrl } from "@/features/worksheets/seo";
import { indexableStrokeOrderCharacters } from "@/features/worksheets/stroke-order-characters";

type Props = {
  params: Promise<{ locale: string; group: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return hskWritingGroupPages.map((group) => ({ group: group.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, group: slug } = await params;
  const data = getHskWritingGroupBySlug(slug);
  if (!data) return {};

  const seo = buildPageSeoMetadata(envConfigs.app_url, data.path, locale, {
    title: data.title,
    description: data.description,
  });
  return {
    ...seo,
    title: data.title,
    description: data.description,
    openGraph: {
      ...seo.openGraph,
      title: data.title,
      description: data.description,
    },
  };
}

export default async function HskWritingGroupPage({ params }: Props) {
  const { group: slug } = await params;
  const data = getHskWritingGroupBySlug(slug);
  if (!data) notFound();

  const prevGroup = data.prevSlug ? getHskWritingGroupBySlug(data.prevSlug) : undefined;
  const nextGroup = data.nextSlug ? getHskWritingGroupBySlug(data.nextSlug) : undefined;
  const groupCharSet = new Set(data.characters);
  const curatedGuidesInGroup = indexableStrokeOrderCharacters.filter((entry) =>
    groupCharSet.has(entry.character),
  );
  const curatedStrokeSet = curatedGuidesInGroup.map((entry) => entry.character);

  const pageUrl = toAbsoluteUrl(envConfigs.app_url, data.path);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: data.heading,
      description: data.description,
      url: pageUrl,
      inLanguage: "en",
      educationalLevel: `HSK 3.0 ${data.shortLabel}`,
      learningResourceType: "Writing character list and printable worksheet",
      isAccessibleForFree: true,
      provider: {
        "@type": "Organization",
        name: "GridHanzi",
        url: envConfigs.app_url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: toAbsoluteUrl(envConfigs.app_url, "/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "HSK 3.0 writing characters",
          item: toAbsoluteUrl(envConfigs.app_url, "/hsk/3-0-writing-characters"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: data.shortLabel,
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <PublicPageShell active="hsk">
      <StructuredData data={structuredData} />
      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-hs-muted">
          <Link href="/" className="hover:text-hs-seal">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/hsk/3-0-writing-characters" className="hover:text-hs-seal">
            HSK 3.0 writing characters
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className="text-hs-ink">
            {data.shortLabel}
          </span>
        </nav>

        <header className="mt-6 border-b border-hs-line pb-8">
          <p className="hs-kicker">Official HSK 3.0 writing syllabus</p>
          <h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight text-hs-ink sm:text-5xl">
            {data.heading}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-hs-muted">
            {data.directAnswer}
          </p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="hs-card border-hs-line bg-hs-paper p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-hs-muted">
                Syllabus group
              </dt>
              <dd className="mt-1 text-lg font-bold text-hs-ink">{data.shortLabel}</dd>
            </div>
            <div className="hs-card border-hs-line bg-hs-paper p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-hs-muted">
                New writing characters
              </dt>
              <dd className="mt-1 text-lg font-bold text-hs-ink">{data.count}</dd>
            </div>
            <div className="hs-card border-hs-line bg-hs-paper p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-hs-muted">
                Cumulative writing total
              </dt>
              <dd className="mt-1 text-lg font-bold text-hs-ink">
                {data.cumulative.toLocaleString("en-US")} / 1,200
              </dd>
            </div>
            <div className="hs-card border-hs-line bg-hs-paper p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-hs-muted">
                Printable practice sets
              </dt>
              <dd className="mt-1 text-lg font-bold text-hs-ink">
                {data.batches.length} sets (up to 30 / sheet)
              </dd>
            </div>
          </dl>

          <p className="mt-5 text-sm leading-6 text-hs-muted">
            Source: {HSK_WRITING_SOURCE_LABEL} (printed pages {HSK_WRITING_PRINTED_PAGES}, PDF pages {HSK_WRITING_PDF_PAGES} in the{" "}
            <a
              className="text-hs-link underline hover:text-hs-seal"
              href={HSK_WRITING_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
            >
              official HSK 3.0 syllabus PDF
            </a>
            ). For how vocabulary, reading, and writing lists differ, see{" "}
            <Link
              href="/hsk/3-0-handwriting-requirements"
              className="text-hs-link underline hover:text-hs-seal"
            >
              HSK 3.0 handwriting requirements
            </Link>
            .
          </p>
        </header>

        <HskWritingGroupBrowser
          shortLabel={data.shortLabel}
          characters={data.characters}
          batches={data.batches}
          curatedStrokeSet={curatedStrokeSet}
        />

        <section
          aria-labelledby="study-tip-heading"
          className="mt-12 hs-card border-hs-line bg-hs-paper p-5 sm:p-6"
        >
          <p className="hs-kicker">Practice workflow</p>
          <h2 id="study-tip-heading" className="hs-display mt-1 text-2xl font-bold text-hs-ink">
            How to practise {data.shortLabel} writing characters
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-hs-muted">{data.studyTip}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <Link
              href={data.vocabHref}
              className="text-hs-link underline underline-offset-4 hover:text-hs-seal"
            >
              Browse {data.vocabLabel} →
            </Link>
            <Link
              href="/hsk/3-0-exam-guide"
              className="text-hs-link underline underline-offset-4 hover:text-hs-seal"
            >
              HSK 3.0 exam dates &amp; syllabus guide →
            </Link>
            <Link
              href="/grids/tian-zi-ge"
              className="text-hs-link underline underline-offset-4 hover:text-hs-seal"
            >
              Blank Tian Zi Ge grid paper PDF →
            </Link>
          </div>
        </section>

        {curatedGuidesInGroup.length > 0 ? (
          <section aria-labelledby="stroke-guides-heading" className="mt-12">
            <p className="hs-kicker">Step-by-step stroke guides</p>
            <h2
              id="stroke-guides-heading"
              className="hs-display mt-1 text-2xl font-bold text-hs-ink"
            >
              Reviewed stroke-order guides in {data.shortLabel} ({curatedGuidesInGroup.length})
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-hs-muted">
              Open a character guide to watch stroke animations, review common mistakes, and practise writing in context.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {curatedGuidesInGroup.slice(0, 36).map((entry) => (
                <Link
                  key={entry.character}
                  href={`/stroke-order/${encodeURIComponent(entry.character)}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded border border-hs-line bg-white px-3 py-1.5 text-sm text-hs-ink transition-colors hover:border-hs-seal hover:text-hs-seal"
                >
                  <span className="hs-hanzi-context text-xl font-bold">{entry.character}</span>
                  <span className="text-xs text-hs-muted">{entry.pinyin}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <nav
          aria-label="Other HSK 3.0 writing groups"
          className="mt-12 border-t border-hs-line pt-8"
        >
          <p className="hs-kicker">All 6 official writing groups</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {hskWritingGroupPages.map((item) => (
              <Link
                key={item.slug}
                href={item.path}
                aria-current={item.slug === data.slug ? "page" : undefined}
                className={`rounded border px-3 py-2 text-sm font-semibold transition-colors ${
                  item.slug === data.slug
                    ? "border-hs-seal bg-hs-seal text-white"
                    : "border-hs-line bg-white text-hs-ink hover:border-hs-seal hover:text-hs-seal"
                }`}
              >
                {item.shortLabel} ({item.count})
              </Link>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
            {prevGroup ? (
              <Link
                href={prevGroup.path}
                className="text-hs-link underline underline-offset-4 hover:text-hs-seal"
              >
                ← Previous: {prevGroup.shortLabel} ({prevGroup.count})
              </Link>
            ) : (
              <Link
                href="/hsk/3-0-writing-characters"
                className="text-hs-link underline underline-offset-4 hover:text-hs-seal"
              >
                ← All 1,200 HSK 3.0 writing characters
              </Link>
            )}
            {nextGroup ? (
              <Link
                href={nextGroup.path}
                className="text-hs-link underline underline-offset-4 hover:text-hs-seal"
              >
                Next: {nextGroup.shortLabel} ({nextGroup.count}) →
              </Link>
            ) : null}
          </div>
        </nav>
      </main>
    </PublicPageShell>
  );
}
