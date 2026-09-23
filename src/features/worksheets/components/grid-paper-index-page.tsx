
import { UiText } from "./ui-text";
import { ArrowRight, Download, FileText } from "lucide-react";

import { Link } from "@/core/i18n/navigation";
import { envConfigs } from "@/config";

import { gridPaperPages } from "../grid-pages";
import { GridPaperPreview } from "./grid-paper-preview";
import { PublicPageShell } from "./site-shell";
import { StructuredData } from "./structured-data";

export function GridPaperIndexPage() {
  const siteUrl = envConfigs.app_url.replace(/\/$/, "");

  return (
    <PublicPageShell active="grids">
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Hanzi grid paper templates",
            url: `${siteUrl}/grids`,
            itemListElement: gridPaperPages.map((page, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: page.h1,
              url: `${siteUrl}/grids/${page.slug}`,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Hanzi grid paper?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Hanzi grid paper gives each Chinese character a square writing area with optional cross and diagonal guide lines for proportion and stroke direction.",
                },
              },
              {
                "@type": "Question",
                name: "What is the difference between Tian Zi Ge and Mi Zi Ge?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Tian Zi Ge uses horizontal and vertical guides. Mi Zi Ge adds two diagonal guides to form a 米 shape.",
                },
              },
              {
                "@type": "Question",
                name: "How do I print the grid paper?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Open a template, download its A4 PDF, and print it from your browser or PDF viewer at the intended paper size.",
                },
              },
            ],
          },
        ]}
      />

      <main className="hs-container pt-6">
        <div className="text-sm text-[#617084]">
          <Link href="/" className="hover:text-[#b62822]"><UiText>{"Home"}</UiText></Link>
          <span className="px-2">/</span>
          <span aria-current="page"><UiText>{"Printable Grids"}</UiText></span>
        </div>
        <header className="mt-3 max-w-4xl">
          <p className="hs-kicker"><UiText>{"Printable Hanzi practice"}</UiText></p>
          <h1 className="hs-display mt-3 text-4xl font-bold sm:text-5xl"><UiText>{"Free Hanzi Grid Paper"}</UiText></h1>
          <p className="mt-4 text-lg leading-8 text-[#566276]"><UiText>{"Download printable Tian Zi Ge, Mi Zi Ge, and blank Chinese writing paper PDFs, or open a template in the worksheet maker to add your own characters and practice settings."}</UiText></p>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {gridPaperPages.map((page) => (
            <article key={page.slug} className="overflow-hidden rounded border border-[#ded7ca] bg-[#fffefa] shadow-[0_12px_34px_rgba(23,41,66,0.07)]">
              <div className="border-b border-[#e2d8ca] bg-[radial-gradient(circle_at_top_left,#fff8e8_0,#f2e9da_52%,#e8ddcb_100%)] p-4">
                <GridPaperPreview page={page} />
              </div>
              <div className="p-5">
                <p className="hs-kicker">{page.eyebrow}</p>
                <h2 className="hs-display mt-2 text-2xl font-bold">{page.slug === "blank" ? "Blank Writing Grid" : page.eyebrow.split(" /")[0]}</h2>
                <p className="mt-3 text-sm leading-6 text-[#5b687a]">{page.description}</p>
                <div className="mt-5 grid gap-2">
                  <Link href={`/grids/${page.slug}`} className="hs-primary-button w-full"><UiText>{"View printable page"}</UiText><ArrowRight className="size-4" />
                  </Link>
                  <a href={page.pdfHref} download={page.pdfFilename} className="hs-secondary-button w-full">
                    <Download className="size-4" /><UiText>{"Download PDF"}</UiText></a>
                  <Link href={page.generatorHref} className="inline-flex items-center justify-center gap-2 py-2 text-sm font-bold text-[#24466e]">
                    <FileText className="size-4" /><UiText>{"Customise this grid"}</UiText></Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="hs-card mt-8 p-6 sm:p-8">
          <h2 className="hs-display text-2xl font-bold"><UiText>{"Frequently asked questions"}</UiText></h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-bold">What is Hanzi grid paper?</h3>
              <p className="mt-2 text-sm leading-6 text-[#5f6d80]">It is writing paper with a square space for each Chinese character and optional guides for centre, proportion, and stroke direction.</p>
            </div>
            <div>
              <h3 className="font-bold">Tian Zi Ge vs Mi Zi Ge?</h3>
              <p className="mt-2 text-sm leading-6 text-[#5f6d80]">Tian Zi Ge uses a cross. Mi Zi Ge adds diagonal guides for extra visual support.</p>
            </div>
            <div>
              <h3 className="font-bold">How do I print?</h3>
              <p className="mt-2 text-sm leading-6 text-[#5f6d80]">Open a page, download its A4 PDF, and print from your browser or PDF viewer.</p>
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
