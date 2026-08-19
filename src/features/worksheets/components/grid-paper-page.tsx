import { ArrowRight, Download, FileText, Printer } from "lucide-react";

import { Link } from "@/core/i18n/navigation";
import { envConfigs } from "@/config";

import type { GridPaperPage } from "../grid-pages";
import { PublicPageShell } from "./site-shell";
import { StructuredData } from "./structured-data";
import { GridPaperPreview } from "./grid-paper-preview";

export function GridPaperPageView({ page }: { page: GridPaperPage }) {
  const siteUrl = envConfigs.app_url.replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}/grids/${page.slug}`;
  const relatedPages = page.relatedSlugs
    .map((slug) => ({ slug, label: relatedLabel(slug) }))
    .filter(Boolean);

  return (
    <PublicPageShell active="grids">
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.h1,
            description: page.description,
            url: canonicalUrl,
            isAccessibleForFree: true,
            inLanguage: "en",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: page.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
              { "@type": "ListItem", position: 2, name: "Printable Grids", item: `${siteUrl}/grids` },
              { "@type": "ListItem", position: 3, name: page.h1, item: canonicalUrl },
            ],
          },
        ]}
      />

      <main className="hs-container pt-5">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/" className="hover:text-[#b62822]">Home</Link>
          <span className="px-2">/</span>
          <Link href="/grids" className="hover:text-[#b62822]">Printable Grids</Link>
          <span className="px-2">/</span>
          <span aria-current="page">{page.eyebrow}</span>
        </nav>

        <section className="mt-5 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="hs-kicker">{page.eyebrow}</p>
            <h1 className="hs-display mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              {page.h1}
            </h1>
            <div className="mt-5 max-w-3xl space-y-4 text-lg leading-8 text-[#4f5d71]">
              {page.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={page.pdfHref}
                download={page.pdfFilename}
                className="hs-primary-button min-w-64"
              >
                <Download className="size-5" /> Download PDF
              </a>
              <Link href={page.generatorHref} className="hs-secondary-button min-w-56">
                <FileText className="size-5" /> Make a custom sheet
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[#536176]">
              <span className="inline-flex items-center gap-2"><Printer className="size-4 text-[#267254]" /> A4 printable PDF</span>
              <span className="inline-flex items-center gap-2"><Download className="size-4 text-[#267254]" /> No sign-up required</span>
            </div>
          </div>
          <div>
            <GridPaperPreview page={page} />
            <p className="mt-3 text-center text-xs text-[#697487]">
              Live worksheet preview · <a href={page.pdfHref} className="font-semibold text-[#24466e] underline">open the PDF</a>
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            {page.sections.map((section) => (
              <article key={section.heading} className="hs-card p-6 sm:p-7">
                <h2 className="hs-display text-2xl font-bold">{section.heading}</h2>
                <p className="mt-3 text-base leading-8 text-[#58677a]">{section.body}</p>
                {section.heading.startsWith("Download") ? (
                  <a href={page.pdfHref} download={page.pdfFilename} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#24466e] underline">
                    Download {page.eyebrow} PDF <ArrowRight className="size-4" />
                  </a>
                ) : null}
              </article>
            ))}
          </div>

          <aside className="hs-card h-fit self-start p-6 lg:sticky lg:top-20">
            <p className="hs-kicker">Keep practising</p>
            <h2 className="hs-display mt-2 text-2xl font-bold">Build a worksheet from your word list</h2>
            <p className="mt-3 text-sm leading-6 text-[#58677a]">
              Add Hanzi, Pinyin, and meanings, then choose the same grid style before printing a custom practice sheet.
            </p>
            <Link href={page.generatorHref} className="hs-primary-button mt-5 w-full">
              Open the worksheet maker <ArrowRight className="size-4" />
            </Link>
            <div className="mt-6 border-t border-[#ded7ca] pt-5">
              <h3 className="font-bold">Related printable grids</h3>
              <div className="mt-3 grid gap-2">
                {relatedPages.map((related) => (
                  <Link key={related.slug} href={`/grids/${related.slug}`} className="rounded border border-[#ded7ca] px-3 py-2 text-sm font-semibold text-[#24466e] hover:bg-[#f7f1e7]">
                    {related.label} <ArrowRight className="ml-1 inline size-3" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="hs-card mt-5 divide-y divide-[#ded7ca]">
          <h2 className="hs-display p-5 text-2xl font-bold">Frequently asked questions</h2>
          {page.faqs.map((faq) => (
            <details key={faq.question} className="p-5">
              <summary className="cursor-pointer font-semibold">{faq.question}</summary>
              <p className="mt-3 text-sm leading-7 text-[#5f6d80]">{faq.answer}</p>
            </details>
          ))}
        </section>
      </main>
    </PublicPageShell>
  );
}

function relatedLabel(slug: GridPaperPage["slug"]): string {
  if (slug === "tian-zi-ge") return "Tian Zi Ge printable PDF";
  if (slug === "mi-zi-ge") return "Mi Zi Ge printable PDF";
  return "Blank Chinese writing paper";
}
