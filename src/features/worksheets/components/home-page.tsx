import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardPaste,
  FileText,
  GraduationCap,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Link } from "@/core/i18n/navigation";

import { worksheetTemplates } from "../data";
import { defaultWorksheetSettings } from "../types";
import { HomeWorkbench } from "./home-workbench";
import { PublicPageShell } from "./site-shell";
import { WorksheetMiniature } from "./worksheet-miniature";
import { WorksheetPaper } from "./worksheet-paper";

const family = worksheetTemplates[0];

export function HomePage() {
  if (!family) return null;

  return (
    <PublicPageShell active="home">
      <main>
        <section className="hs-container grid items-start gap-8 pb-12 pt-10 lg:grid-cols-[1.02fr_0.9fr] lg:pt-12">
          <div>
            <h1 className="hs-display max-w-3xl text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.55rem]">
              Turn any word list into a printable Chinese worksheet.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#435166]">
              Paste English, Chinese, or both. We’ll add Hanzi, Pinyin,
              meanings, and stroke-order practice.
            </p>
            <div className="mt-8">
              <HomeWorkbench />
            </div>
            <div className="hs-card mt-4 grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <TrustItem icon={ShieldCheck} label="Free to use" />
              <TrustItem icon={CheckCircle2} label="No sign-up" />
              <TrustItem icon={FileText} label="A4 & US Letter" />
            </div>
          </div>
          <div className="relative lg:pt-1">
            <div className="absolute inset-0 -z-10 rounded-full bg-[#eadfcd]/35 blur-3xl" />
            <WorksheetPaper
              entries={family.entries.slice(0, 4)}
              compact
              settings={{
                ...defaultWorksheetSettings,
                title: "My Family · 我的家人",
              }}
              className="max-w-[590px]"
            />
          </div>
        </section>

        <section className="hs-container hs-card grid gap-4 px-5 py-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          <Step icon={ClipboardPaste} number="1" title="Paste your list">
            Add English, Chinese, or both.
          </Step>
          <ArrowRight className="hidden size-6 text-[#657083] md:block" />
          <Step icon={CheckCircle2} number="2" title="Check bilingual fields">
            Review Hanzi, Pinyin, and meanings.
          </Step>
          <ArrowRight className="hidden size-6 text-[#657083] md:block" />
          <Step icon={Printer} number="3" title="Print practice sheets">
            Classroom-ready pages in seconds.
          </Step>
        </section>

        <section className="hs-container hs-content-visibility py-14">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="hs-kicker">Teacher-ready starting points</p>
              <h2 className="hs-display mt-2 text-3xl font-bold">
                Start with a template
              </h2>
            </div>
            <Link
              href="/templates"
              className="hidden items-center gap-1 text-sm font-semibold text-[#b62822] sm:flex"
            >
              View all templates <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {worksheetTemplates.map((template) => (
              <article key={template.slug} className="hs-card overflow-hidden p-3">
                <WorksheetMiniature
                  entries={template.entries.slice(0, 3)}
                  title={template.title}
                  chineseTitle={template.chineseTitle}
                  className="shadow-sm"
                />
                <h3 className="hs-display mt-4 text-lg font-bold">
                  {template.title}
                </h3>
                <p className="mt-1 text-sm text-[#657083]">
                  {template.age} · {template.wordCount} words
                </p>
                <Link
                  href={`/generator?template=${template.slug}`}
                  className="hs-secondary-button mt-3 w-full text-sm"
                >
                  Use template
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section
          id="practice-types"
          className="hs-container hs-content-visibility pb-14"
        >
          <p className="hs-kicker">One vocabulary list</p>
          <h2 className="hs-display mt-2 text-3xl font-bold">
            Three ways to practise
          </h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <PracticeCard title="Learn new characters" mode="trace">
              Follow real stroke-order frames, trace twice, then write independently.
            </PracticeCard>
            <PracticeCard title="Practice handwriting" mode="write">
              Use one model, two trace cells, and five blank grids per character.
            </PracticeCard>
            <PracticeCard title="Test recall" mode="quiz">
              Read the Pinyin or meaning and write each character in its own grid.
            </PracticeCard>
          </div>
        </section>

        <section
          id="for-teachers"
          className="hs-container hs-content-visibility grid gap-6 pb-14 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="hs-card p-7 sm:p-9">
            <p className="hs-kicker">Built for repeated use</p>
            <h2 className="hs-display mt-2 text-3xl font-bold">
              Made for weekly lesson prep, not one-off demos.
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <WorkflowItem icon={ClipboardPaste} title="Paste this week’s words">
                Add from a list or spreadsheet.
              </WorkflowItem>
              <WorkflowItem icon={CheckCircle2} title="Check bilingual fields">
                Correct ambiguity before printing.
              </WorkflowItem>
              <WorkflowItem icon={Printer} title="Print practice and quizzes">
                Reuse the same list in three modes.
              </WorkflowItem>
            </div>
          </div>
          <aside className="hs-card border-[#243e62] p-7 sm:p-9">
            <div className="flex items-center justify-between">
              <h2 className="hs-display text-2xl font-bold">Teacher Pro</h2>
              <span className="rounded-full border border-[#d76560] px-3 py-1 text-xs font-bold text-[#b62822]">
                Coming soon
              </span>
            </div>
            <p className="mt-3 text-[#566276]">
              We will only build the workflow features teachers actually ask
              for.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "CSV import",
                "Worksheet packs",
                "Saved vocabulary lists",
                "School header & logo",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-[#25815d]" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/generator" className="hs-primary-button mt-7">
              Create a free worksheet
            </Link>
          </aside>
        </section>

        <section className="hs-container hs-card hs-content-visibility grid overflow-hidden lg:grid-cols-2">
          <div className="p-8 sm:p-10">
            <p className="hs-kicker">Calm, useful home practice</p>
            <h2 className="hs-display mt-2 text-3xl font-bold">
              Perfect for bilingual families
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-[#566276]">
              Support daily learning with printable pages that reinforce
              classroom vocabulary without turning home practice into another
              complicated app.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Build handwriting confidence",
                "Reinforce classroom learning",
                "Simple, print-and-go sheets",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-[#25815d]" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid min-h-72 place-items-center bg-[#efe4d2] p-8">
            <div className="w-72 rotate-[-5deg]">
              <WorksheetMiniature
                entries={family.entries.slice(0, 3)}
                title="Home Practice"
                chineseTitle="家庭练习"
              />
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="hs-container hs-content-visibility py-14"
        >
          <p className="hs-kicker">Questions before you print</p>
          <h2 className="hs-display mt-2 text-3xl font-bold">
            Frequently asked questions
          </h2>
          <div className="hs-card mt-6 divide-y divide-[#ded7ca]">
            {[
              [
                "Do I need an account?",
                "No. The MVP lets you create, edit, preview, and print without registration.",
              ],
              [
                "How accurate are the Hanzi and Pinyin?",
                "Known teaching vocabulary uses curated data. AI-filled rows are always editable before printing.",
              ],
              [
                "Can I edit the words after generation?",
                "Yes. Hanzi, Pinyin, and English fields remain editable in the generator.",
              ],
              [
                "What paper sizes are supported?",
                "A4 and US Letter are available in the generator and print preview.",
              ],
            ].map(([question, answer]) => (
              <details key={question} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-semibold">
                  {question}
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#617084]">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: typeof ShieldCheck;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-4 text-sm font-medium">
      <span className="grid size-9 place-items-center rounded-full border border-[#8cb4a0] text-[#267254]">
        <Icon className="size-4" />
      </span>
      {label}
    </div>
  );
}

function Step({
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
    <div className="flex gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-full border border-[#bfd0c3] bg-[#f5f2e7] text-[#26694d]">
        <Icon className="size-5" />
      </span>
      <div>
        <h2 className="hs-display text-lg font-bold">
          {number}. {title}
        </h2>
        <p className="mt-1 text-sm text-[#657083]">{children}</p>
      </div>
    </div>
  );
}

function PracticeCard({
  title,
  mode,
  children,
}: {
  title: string;
  mode: "trace" | "write" | "quiz";
  children: React.ReactNode;
}) {
  return (
    <article className="hs-card grid gap-5 p-5 sm:grid-cols-[0.9fr_1fr] lg:grid-cols-1">
      <WorksheetPaper
        compact
        entries={family.entries.slice(0, 2)}
        settings={{
          ...defaultWorksheetSettings,
          mode,
          title,
          showStrokeOrder: mode !== "quiz",
        }}
      />
      <div>
        <h3 className="hs-display text-xl font-bold text-[#b62822]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#58667a]">{children}</p>
        <Link
          href={`/generator?template=family&mode=${mode}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#102545]"
        >
          Try this mode <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function WorkflowItem({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof GraduationCap;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="grid size-12 place-items-center rounded-full bg-[#f2eee2] text-[#315f47]">
        <Icon className="size-5" />
      </span>
      <h3 className="hs-display mt-4 font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#677286]">{children}</p>
    </div>
  );
}
