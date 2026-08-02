import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardPaste,
  FileText,
  GraduationCap,
  PencilLine,
  Printer,
} from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { worksheetTemplates } from "../data";
import { PublicPageShell } from "./site-shell";
import { StructuredData } from "./structured-data";
import { WorksheetMiniature } from "./worksheet-miniature";

const featuredSlugs = [
  "school-classroom",
  "numbers",
  "daily-routine",
  "hsk-1",
] as const;

const featuredTemplates = featuredSlugs.flatMap((slug) => {
  const template = worksheetTemplates.find((candidate) => candidate.slug === slug);
  return template ? [template] : [];
});

const previewTemplate =
  worksheetTemplates.find((template) => template.slug === "school-classroom") ??
  worksheetTemplates[0];

export function ForTeachersPage() {
  if (!previewTemplate) return null;

  return (
    <PublicPageShell>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Chinese Worksheets for Teachers",
          description:
            "Create editable Chinese handwriting worksheets, tracing pages, and short recall tests from your own classroom word list.",
          url: `${envConfigs.app_url.replace(/\/$/, "")}/for-teachers`,
          audience: {
            "@type": "EducationalAudience",
            educationalRole: "teacher",
          },
          isAccessibleForFree: true,
          inLanguage: ["en", "zh-Hans"],
        }}
      />
      <main>
        <section className="hs-container pb-12 pt-6 sm:pt-10">
          <div className="text-sm text-[#617084]">
            Home &nbsp;/&nbsp; For Teachers
          </div>
          <div className="mt-5 grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="hs-kicker">Chinese worksheets for teachers</p>
              <h1 className="hs-display mt-3 max-w-3xl text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
                Create Chinese worksheets for your class.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4f5d71]">
                Paste vocabulary from a lesson plan or spreadsheet, check the
                Hanzi and Pinyin, then print a tracing page, handwriting
                practice, or a short recall test.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/generator" className="hs-primary-button min-w-52">
                  <FileText className="size-5" /> Create a worksheet
                </Link>
                <Link href="/templates" className="hs-secondary-button min-w-44">
                  Browse word lists <ArrowRight className="size-4" />
                </Link>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#45556a]">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-[#267254]" /> No account needed
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-[#267254]" /> A4 and US Letter
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-[#267254]" /> Download as PDF
                </li>
              </ul>
            </div>
            <div className="relative mx-auto w-full max-w-[520px] lg:pr-4">
              <div className="absolute inset-8 -z-10 rounded-full bg-[#e9dcc7] blur-3xl" />
              <div className="rotate-[2deg]">
                <WorksheetMiniature
                  entries={previewTemplate.entries.slice(0, 5)}
                  title="This Week’s Words"
                  chineseTitle="本周词汇"
                  profile="kids"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="hs-container hs-card grid gap-4 px-5 py-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          <TeacherStep icon={ClipboardPaste} number="1" title="Paste the lesson words">
            Add one word per line or paste rows from a spreadsheet.
          </TeacherStep>
          <ArrowRight className="hidden size-6 text-[#657083] md:block" />
          <TeacherStep icon={CheckCircle2} number="2" title="Check every field">
            Edit the characters, Pinyin, and meaning before printing.
          </TeacherStep>
          <ArrowRight className="hidden size-6 text-[#657083] md:block" />
          <TeacherStep icon={Printer} number="3" title="Use it in class">
            Download the page or print copies for students.
          </TeacherStep>
        </section>

        <section className="hs-container py-14">
          <p className="hs-kicker">One checked list, three classroom jobs</p>
          <h2 className="hs-display mt-2 text-3xl font-bold sm:text-4xl">
            Learn, practise, and test
          </h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            <UseCaseCard
              icon={BookOpen}
              title="Introduce new characters"
              description="Show the stroke sequence first, then give students a model character to copy."
              href="/generator?mode=trace"
              linkLabel="Open Learn mode"
            />
            <UseCaseCard
              icon={PencilLine}
              title="Set handwriting practice"
              description="Print model, tracing, and blank cells on the same page for classwork or homework."
              href="/generator?mode=write"
              linkLabel="Open Practice mode"
            />
            <UseCaseCard
              icon={GraduationCap}
              title="Check recall"
              description="Keep the Pinyin or English prompt and remove the model character for a short written test."
              href="/generator?mode=quiz"
              linkLabel="Open Test mode"
            />
          </div>
        </section>

        <section className="border-y border-[#ded7ca] bg-[#f3eadb] py-14">
          <div className="hs-container">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="hs-kicker">Ready to edit</p>
                <h2 className="hs-display mt-2 text-3xl font-bold sm:text-4xl">
                  Classroom word lists
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-[#566276]">
                  Start with a topic, then replace any word to match the lesson
                  you are teaching.
                </p>
              </div>
              <Link href="/templates" className="hs-secondary-button">
                View all templates <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredTemplates.map((template) => (
                <article key={template.slug} className="hs-card p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b62822]">
                    {template.level}
                  </p>
                  <h3 className="hs-display mt-2 text-xl font-bold">
                    {template.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#6a7586]">
                    {template.chineseTitle} · {template.wordCount} words
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {template.entries.slice(0, 4).map((entry) => (
                      <span
                        key={entry.id}
                        className="rounded border border-[#d9d1c4] bg-[#fffdf8] px-2 py-1 font-serif text-sm"
                      >
                        {entry.hanzi}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/generator?template=${template.slug}&profile=${template.recommendedProfile}`}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#24466e]"
                  >
                    Use this list <ArrowRight className="size-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hs-container grid gap-6 py-14 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="hs-card bg-[#102e52] p-7 text-white sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f2aaa4]">
              Before you print
            </p>
            <h2 className="hs-display mt-3 text-3xl font-bold !text-white">
              Keep the final check with the teacher.
            </h2>
            <p className="mt-4 leading-7 text-blue-100/80">
              Automatically filled characters and Pinyin stay editable. Read
              through the list once so names, regional wording, and lesson
              meanings match your class.
            </p>
            <Link href="/generator" className="hs-primary-button mt-7">
              Start with my words
            </Link>
          </article>
          <article className="hs-card p-7 sm:p-9">
            <h2 className="hs-display text-3xl font-bold">Teacher questions</h2>
            <div className="mt-5 divide-y divide-[#ded7ca] border-y border-[#ded7ca]">
              <Faq
                question="Can I paste from Excel or Google Sheets?"
                answer="Yes. Copy the rows and paste them into the word-list box. You can check and edit every field before making the worksheet."
              />
              <Faq
                question="Can I make a test from the same vocabulary?"
                answer="Yes. Open Test mode to keep the prompt while removing the model character students would otherwise trace."
              />
              <Faq
                question="Can students use the PDF on a tablet?"
                answer="Yes. Choose the Tablet profile and download the 3:4 PDF for a handwriting app such as GoodNotes."
              />
            </div>
          </article>
        </section>
      </main>
    </PublicPageShell>
  );
}

function TeacherStep({
  icon: Icon,
  number,
  title,
  children,
}: {
  icon: typeof ClipboardPaste;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#9fc5af] bg-[#f7fbf8] text-[#267254]">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#7a5145]">
          {number}. {title}
        </p>
        <p className="mt-1 text-sm leading-6 text-[#617084]">{children}</p>
      </div>
    </div>
  );
}

function UseCaseCard({
  icon: Icon,
  title,
  description,
  href,
  linkLabel,
}: {
  icon: typeof BookOpen;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <article className="hs-card flex h-full flex-col p-7">
      <span className="grid size-12 place-items-center rounded-full border border-[#9fc5af] bg-[#f7fbf8] text-[#267254]">
        <Icon className="size-6" />
      </span>
      <h3 className="hs-display mt-5 text-2xl font-bold">{title}</h3>
      <p className="mt-3 flex-1 leading-7 text-[#5b687a]">{description}</p>
      <Link href={href} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#b62822]">
        {linkLabel} <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="py-4">
      <summary className="cursor-pointer font-semibold">{question}</summary>
      <p className="mt-3 text-sm leading-6 text-[#5f6d80]">{answer}</p>
    </details>
  );
}
