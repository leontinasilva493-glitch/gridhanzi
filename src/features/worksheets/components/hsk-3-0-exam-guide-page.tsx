import { ArrowRight } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { hskExamGuide } from "../hsk-editorial-pages";
import { StructuredData } from "./structured-data";
import { PublicPageShell } from "./site-shell";

export function Hsk3ExamGuidePage({ locale }: { locale: string }) {
  const prefix = locale === "zh" ? "/zh" : "";
  const baseUrl = envConfigs.app_url.replace(/\/$/, "");
  const url = `${baseUrl}${prefix}/hsk/3-0-exam-guide`;

  return (
    <PublicPageShell active="hsk">
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: hskExamGuide.title,
            description: hskExamGuide.description,
            url,
            dateModified: hskExamGuide.updatedAt,
            inLanguage: "en",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${baseUrl}${prefix || "/"}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "HSK 3.0 exam guide",
                item: url,
              },
            ],
          },
        ]}
      />

      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">HSK 3.0 exam guide</span>
        </nav>

        <header className="mt-6 border-b border-[#ded7ca] pb-10">
          <p className="hs-kicker">HSK 3.0 exam dates and syllabus</p>
          <h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
            {hskExamGuide.heading}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#566276]">
            Check the announced 2026 HSK 3.0 dates and see what the official
            syllabus says about writing characters. The links below go to the
            Chinese Testing International notices and syllabus.
          </p>
          <p className="mt-4 text-sm text-[#617084]">
            Sources checked: {hskExamGuide.updatedAt}.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="HSK 3.0 dates">
          <article className="hs-card border-[#d8c49f] bg-[#fff9ed] p-6">
            <p className="hs-kicker">Completed trial</p>
            <h2 className="hs-display mt-2 text-2xl font-bold">
              September 20, 2026
            </h2>
            <p className="mt-3 leading-7 text-[#5a5f65]">
              The second-round global trial took place on this date. The official
              notice lists paper-based and computer-based formats; check the
              test center notice for local arrangements.
            </p>
          </article>
          <article className="hs-card border-[#d8c49f] bg-[#fff9ed] p-6">
            <p className="hs-kicker">Scheduled global launch</p>
            <h2 className="hs-display mt-2 text-2xl font-bold">
              December 13, 2026
            </h2>
            <p className="mt-3 leading-7 text-[#5a5f65]">
              Chinese Testing International lists this as the worldwide launch
              date for HSK 3.0. For registration details, check the Chinese Test
              Service website or contact your test center.
            </p>
          </article>
        </section>

        <section className="mt-8 hs-card p-6 sm:p-8">
          <h2 className="hs-display text-3xl font-bold">
            HSK 3.0 writing-character list
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#5a5f65]">
            The official syllabus lists 1,200 writing characters in six groups:
            Levels 1–2 together (100), Levels 3, 4, 5, and 6 (150 each), and
            Levels 7–9 together (500). These combined groups follow the
            published syllabus.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/hsk/3-0-writing-characters" className="hs-primary-button">
              Browse the 1,200 HSK 3.0 writing characters
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/hsk" className="hs-secondary-button">
              Browse HSK vocabulary lists
            </Link>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="official-sources-title">
          <h2 id="official-sources-title" className="hs-display text-3xl font-bold">
            Official HSK 3.0 sources
          </h2>
          <ul className="mt-4 grid gap-3">
            {hskExamGuide.officialSources.map((source) => (
              <li key={source.href}>
                <a
                  className="text-[#24466e] underline underline-offset-4 hover:text-[#b62822]"
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 hs-card p-6 sm:p-8" aria-labelledby="faq-title">
          <h2 id="faq-title" className="hs-display text-3xl font-bold">
            HSK 3.0 exam questions
          </h2>
          <div className="mt-5 grid gap-5">
            <div>
              <h3 className="font-bold">When is HSK 3.0 scheduled to launch worldwide?</h3>
              <p className="mt-2 leading-7 text-[#5a5f65]">
                The official notice lists December 13, 2026. Check your local
                test center for registration and exam arrangements.
              </p>
            </div>
            <div>
              <h3 className="font-bold">How many writing characters are in the HSK 3.0 syllabus?</h3>
              <p className="mt-2 leading-7 text-[#5a5f65]">
                The syllabus contains 1,200 characters across six published
                groups. The Levels 1–2 and 7–9 lists are combined.
              </p>
            </div>
            <div>
              <h3 className="font-bold">Where can I confirm exam arrangements?</h3>
              <p className="mt-2 leading-7 text-[#5a5f65]">
                Use the official Chinese Test Service notices linked above, then
                confirm local registration details with your test center.
              </p>
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
