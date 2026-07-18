import { ArrowRight, BookOpen, Check, Eye, FileText, PencilLine, Sprout, Users } from "lucide-react";

import { Link } from "@/core/i18n/navigation";
import { envConfigs } from "@/config";

import { worksheetTemplates } from "../data";
import type { WorksheetTemplate } from "../types";
import { PublicPageShell } from "./site-shell";
import { StructuredData } from "./structured-data";
import { WorksheetMiniature } from "./worksheet-miniature";

export function TemplateDetailPage({ template }: { template: WorksheetTemplate }) {
  const related = worksheetTemplates
    .filter((candidate) => candidate.slug !== template.slug)
    .sort((left, right) => Number(right.category === template.category) - Number(left.category === template.category))
    .slice(0, 3);

  return (
    <PublicPageShell active="templates">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: `${template.title} Chinese Writing Worksheet`,
          description: template.description,
          url: `${envConfigs.app_url.replace(/\/$/, "")}/templates/${template.slug}`,
          learningResourceType: "Worksheet",
          educationalLevel: template.level,
          audience: { "@type": "EducationalAudience", educationalRole: "student" },
          isAccessibleForFree: true,
          inLanguage: ["en", "zh-Hans"],
        }}
      />
      <main className="hs-container pt-5">
        <div className="text-sm text-[#617084]">
          Templates &nbsp;/&nbsp; {template.category === "hsk" ? "HSK" : "Topics"} &nbsp;/&nbsp; {template.title}
        </div>
        <section className="mt-5 grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex rounded border border-[#c8322b] px-4 py-2 text-xs font-bold tracking-[0.1em] text-[#b62822]">
              FREE EDITABLE TEMPLATE
            </span>
            <h1 className="hs-display mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              {template.title} Chinese Writing Worksheet
            </h1>
            <p className="mt-3 font-serif text-2xl text-[#b62822]">{template.chineseTitle}</p>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#4f5d71]">
              {template.description} Practise every word with Hanzi, Pinyin,
              English meanings, real stroke order, tracing, and blank writing grids.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
              <Meta icon={Users}>{template.age}</Meta>
              <Meta icon={Sprout}>{template.level}</Meta>
              <Meta icon={BookOpen}>{template.wordCount} words</Meta>
              <Meta icon={FileText}>A4 & US Letter</Meta>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/generator?template=${template.slug}&profile=${template.recommendedProfile}`} className="hs-primary-button min-w-64">
                <FileText className="size-5" /> Use this template
              </Link>
              <Link href={`/generator?template=${template.slug}&profile=${template.recommendedProfile}`} className="hs-secondary-button min-w-56">
                <Eye className="size-5" /> Preview worksheet
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[480px] sm:rotate-[3deg]">
            <WorksheetMiniature
              entries={template.entries.slice(0, 4)}
              title={template.title}
              chineseTitle={template.chineseTitle}
              profile={template.recommendedProfile}
            />
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="hs-card grid gap-8 p-5 sm:grid-cols-[1.1fr_0.9fr] sm:p-7">
            <div>
              <h2 className="hs-display text-2xl font-bold">Words included</h2>
              <div className="mt-4 overflow-x-auto rounded border border-[#ddd6ca]">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-[#faf6ee] text-xs text-[#536176]">
                    <tr><th className="px-3 py-2">#</th><th className="px-3 py-2">Hanzi</th><th className="px-3 py-2">Pinyin</th><th className="px-3 py-2">English</th></tr>
                  </thead>
                  <tbody>
                    {template.entries.map((entry, index) => (
                      <tr key={entry.id} className="border-t border-[#e3ddd3]">
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2 font-serif text-base">{entry.hanzi}</td>
                        <td className="px-3 py-2">{entry.pinyin}</td>
                        <td className="px-3 py-2">{entry.english}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="border-t border-[#ded7ca] pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
              <h2 className="hs-display text-2xl font-bold">Learning outcomes</h2>
              <Outcome title="Recognize & read" icon={BookOpen}>Connect simplified Hanzi with Pinyin and a concise English meaning.</Outcome>
              <Outcome title="Write with confidence" icon={PencilLine}>Trace model characters, then write independently in Tian Zi Ge or Mi Zi Ge.</Outcome>
              <Outcome title="Follow stroke order" icon={Check}>Use cumulative Hanzi Writer diagrams instead of decorative placeholders.</Outcome>
            </div>
          </div>

          <aside className="hs-card self-start p-6 lg:sticky lg:top-20">
            <h2 className="hs-display text-2xl font-bold">Teacher-ready settings</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-[#526176]">
              <li>✓ Learn, Practice, and Test layouts</li>
              <li>✓ Tian Zi Ge and Mi Zi Ge</li>
              <li>✓ Beginner and advanced enrichment</li>
              <li>✓ Pinyin and stroke order toggles</li>
              <li>✓ Direct PDF download or physical print</li>
            </ul>
            <Link href={`/generator?template=${template.slug}&profile=${template.recommendedProfile}`} className="hs-primary-button mt-6 w-full">
              Open in generator
            </Link>
            <p className="mt-2 text-center text-xs text-[#677286]">No sign-up required. Free to use.</p>
          </aside>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="hs-card p-6">
            <h2 className="hs-display text-2xl font-bold">Teaching note</h2>
            <div className="mt-4 rounded border border-[#c9d6e5] bg-[#f8fbff] p-4">
              <h3 className="font-bold">Three-pass practice</h3>
              <p className="mt-2 text-sm leading-6 text-[#58677a]">
                Read the list aloud, trace each model once, then hide the answers
                and use quiz mode for retrieval practice. Reprint the same list a
                week later to check retention.
              </p>
            </div>
          </article>
          <article className="hs-card p-6">
            <h2 className="hs-display text-2xl font-bold">Related templates</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {related.map((candidate) => (
                <Link key={candidate.slug} href={`/templates/${candidate.slug}`} className="rounded border border-[#ded7ca] bg-white p-4">
                  <h3 className="hs-display font-bold">{candidate.title}</h3>
                  <p className="mt-1 text-xs text-[#657083]">{candidate.age} · {candidate.wordCount} words</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#24466e]">View template <ArrowRight className="size-3" /></span>
                </Link>
              ))}
            </div>
          </article>
        </section>

        <section className="hs-card mt-5 divide-y divide-[#ded7ca]">
          <h2 className="hs-display p-5 text-2xl font-bold">Frequently asked questions</h2>
          <details className="p-5">
            <summary className="cursor-pointer font-semibold">Can I change the vocabulary?</summary>
            <p className="mt-3 text-sm text-[#5f6d80]">Yes. Open the template in the generator to add, delete, reorder, or rewrite every row.</p>
          </details>
          <details className="p-5">
            <summary className="cursor-pointer font-semibold">Is the PDF free?</summary>
            <p className="mt-3 text-sm text-[#5f6d80]">Yes. Download or print the complete worksheet without creating an account.</p>
          </details>
        </section>
      </main>
    </PublicPageShell>
  );
}

function Meta({ icon: Icon, children }: { icon: typeof Users; children: React.ReactNode }) {
  return <span className="flex items-center gap-2"><Icon className="size-5 text-[#267254]" /> {children}</span>;
}

function Outcome({ icon: Icon, title, children }: { icon: typeof BookOpen; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 flex gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#8fb49f] text-[#267254]"><Icon className="size-5" /></span>
      <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#617084]">{children}</p></div>
    </div>
  );
}
