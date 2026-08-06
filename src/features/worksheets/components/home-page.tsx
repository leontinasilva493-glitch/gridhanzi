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
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Link } from "@/core/i18n/navigation";

import { worksheetTemplates } from "../data";
import { defaultWorksheetSettings } from "../types";
import { HomeWorkbench } from "./home-workbench";
import { PublicPageShell } from "./site-shell";
import { WorksheetCardPreview } from "./worksheet-card-preview";
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
              Free Chinese Character Worksheet Generator
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#435166]">
              Create free, printable Chinese character worksheets from your own
              English or Chinese word list. Edit the Hanzi and Pinyin, choose
              Hanzi grid paper, tracing grids, or writing grids, then download
              a PDF—no sign-up required.
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

        <section
          aria-label="Choose how to start"
          className="hs-container grid gap-3 md:grid-cols-3"
        >
          <TaskLink
            href="/generator"
            icon={ClipboardPaste}
            title="Build from my word list"
          >
            Paste English or Chinese words and make a custom worksheet.
          </TaskLink>
          <TaskLink
            href="/templates"
            icon={BookOpen}
            title="Start with a worksheet"
          >
            Pick an editable topic or HSK word list to get started faster.
          </TaskLink>
          <TaskLink
            href="/stroke-order"
            icon={PencilLine}
            title="Check one character’s stroke order"
          >
            Look up the strokes before adding a character to your worksheet.
          </TaskLink>
        </section>

        <section className="hs-container hs-content-visibility py-14">
          <p className="hs-kicker">Practice sheet workflow</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="hs-display text-3xl font-bold">
                Make a Chinese character practice sheet in 3 steps
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5b687a]">
                GridHanzi keeps the worksheet useful first: paste vocabulary,
                review the Chinese writing fields, then print a practice sheet
                with grids, Pinyin, and optional stroke-order guidance.
              </p>
            </div>
            <Link href="/generator" className="hs-primary-button text-sm">
              Create a practice sheet
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ProcessItem icon={ClipboardPaste} title="Paste words">
              Start with English, Chinese, or a mixed classroom word list.
            </ProcessItem>
            <ProcessItem icon={CheckCircle2} title="Check Hanzi and Pinyin">
              Edit every row before it becomes a printable worksheet.
            </ProcessItem>
            <ProcessItem icon={Printer} title="Print the PDF">
              Choose tracing grids, blank writing cells, paper size, and PDF
              output.
            </ProcessItem>
          </div>
          <p className="mt-5 text-sm leading-6 text-[#5b687a]">
            Need a faster start? Browse{" "}
            <Link href="/templates" className="font-semibold text-[#b62822]">
              Chinese character practice sheet templates
            </Link>{" "}
            and open any topic in the worksheet generator.
          </p>
        </section>

        <section className="hs-container hs-content-visibility py-14">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="hs-kicker">Editable word lists</p>
              <h2 className="hs-display mt-2 text-3xl font-bold">
                Start with a Chinese worksheet template
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
            {worksheetTemplates.slice(0, 8).map((template) => (
              <article key={template.slug} className="hs-card overflow-hidden p-3">
                <WorksheetCardPreview
                  entries={template.entries.slice(0, 3)}
                  title={template.title}
                  chineseTitle={template.chineseTitle}
                />
                <h3 className="hs-display mt-4 text-lg font-bold">
                  {template.title}
                </h3>
                <p className="mt-1 text-sm text-[#657083]">
                  {template.age} · {template.wordCount} words
                </p>
                <Link
                  href={`/templates/${template.slug}`}
                  className="hs-secondary-button mt-3 w-full text-sm"
                >
                  View {template.title} worksheet
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section
          id="practice-types"
          className="hs-container hs-content-visibility pb-14"
        >
          <p className="hs-kicker">One list, three uses</p>
          <h2 className="hs-display mt-2 text-3xl font-bold">
            Choose a Chinese character practice mode
          </h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <PracticeCard title="Learn new characters" mode="trace">
              See the strokes in order, trace the character, then copy it.
            </PracticeCard>
            <PracticeCard title="Practice handwriting" mode="write">
              Start with a model and tracing cells, then use the blank grids.
            </PracticeCard>
            <PracticeCard title="Test recall" mode="quiz">
              Read the Pinyin or meaning, then write the word without a model.
            </PracticeCard>
          </div>
        </section>

        <section
          id="for-teachers"
          className="hs-container hs-content-visibility grid gap-6 pb-14 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="hs-card p-7 sm:p-9">
            <p className="hs-kicker">For regular lesson prep</p>
            <h2 className="hs-display mt-2 text-3xl font-bold">
              Create Chinese writing worksheets for class
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <WorkflowItem icon={ClipboardPaste} title="Paste this week’s words">
                Copy them from your lesson plan or spreadsheet.
              </WorkflowItem>
              <WorkflowItem icon={CheckCircle2} title="Check bilingual fields">
                Fix the Hanzi, Pinyin, or meaning if needed.
              </WorkflowItem>
              <WorkflowItem icon={Printer} title="Print practice and quizzes">
                Use the same list for tracing and a later test.
              </WorkflowItem>
            </div>
          </div>
          <aside className="hs-card border-[#243e62] p-7 sm:p-9">
            <h2 className="hs-display text-2xl font-bold">
              Use one list for lessons, practice, and review
            </h2>
            <p className="mt-3 text-[#566276]">
              Turn the same checked vocabulary into a guided lesson, a
              handwriting page, or a short recall test.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "Learn pages with stroke order",
                "Tracing and blank writing grids",
                "Tests without a model character",
                "A4, US Letter, and tablet PDFs",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-[#25815d]" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/for-teachers" className="hs-secondary-button">
                See the teacher workflow
              </Link>
              <Link href="/generator" className="hs-primary-button">
                Create a worksheet
              </Link>
            </div>
          </aside>
        </section>

        <section className="hs-container hs-card hs-content-visibility grid overflow-hidden lg:grid-cols-2">
          <div className="p-8 sm:p-10">
            <p className="hs-kicker">Practice at home</p>
            <h2 className="hs-display mt-2 text-3xl font-bold">
              Print Chinese character practice sheets for home
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-[#566276]">
              Print the words from class and let your child trace them before
              writing them without a model. No extra app or account is needed.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Review this week’s words",
                "Trace before writing independently",
                "Print another copy for later review",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-[#25815d]" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid min-h-72 place-items-center bg-[#efe4d2] p-8">
            <div className="w-72 rotate-[-5deg]">
              <WorksheetCardPreview
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
                "What can I make with this Chinese character worksheet generator?",
                "This Chinese worksheet generator turns any English or Chinese vocabulary list into editable practice pages with Hanzi, Pinyin, tracing cells, blank writing grids, Hanzi grid paper, and optional stroke-order guidance.",
              ],
              [
                "Is the printable Chinese worksheet generator free?",
                "Yes. You can create, edit, preview, download, and print complete worksheets without creating an account.",
              ],
              [
                "Does the Hanzi practice sheet generator include Pinyin and stroke order?",
                "Yes. Common vocabulary can be filled with Hanzi, Pinyin, and English meanings. You can review every field and choose whether to show Pinyin and stroke-order guidance before downloading.",
              ],
              [
                "Which paper sizes and writing profiles are supported?",
                "Choose A4 or US Letter for printing, or a 3:4 digital worksheet for tablet apps. Kids, Adult, Tablet, and Brush profiles adjust the grid size and layout for different writing tools.",
              ],
              [
                "Can I print Hanzi grid paper or Chinese character grids?",
                "Yes. Use Tian Zi Ge or Mi Zi Ge settings to make printable Hanzi grid paper, then preview and save the Chinese character grid as a PDF.",
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

function ProcessItem({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof ClipboardPaste;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded border border-[#ded7ca] bg-white p-5">
      <span className="grid size-12 place-items-center rounded-full bg-[#f3eee3] text-[#315f47]">
        <Icon className="size-5" />
      </span>
      <h3 className="hs-display mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#5b687a]">{children}</p>
    </article>
  );
}

function TaskLink({
  href,
  icon: Icon,
  title,
  children,
}: {
  href: string;
  icon: typeof ClipboardPaste;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group hs-card flex min-h-32 items-start gap-4 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#c8322b] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8322b] focus-visible:ring-offset-2"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#9fc5af] bg-[#f7fbf8] text-[#267254]">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="hs-display flex items-start justify-between gap-3 text-lg font-bold">
          {title}
          <ArrowRight className="mt-0.5 size-4 shrink-0 text-[#b62822] transition-transform group-hover:translate-x-1" />
        </span>
        <span className="mt-2 block text-sm leading-6 text-[#617084]">
          {children}
        </span>
      </span>
    </Link>
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
      <PracticeModePreview mode={mode} />
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

function PracticeModePreview({ mode }: { mode: "trace" | "write" | "quiz" }) {
  return (
    <div
      className="rounded border border-[#d8d0c3] bg-[#fffdf8] p-3"
      aria-label={`${mode} worksheet mode preview`}
    >
      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-[#607086]">
        <span>{mode === "quiz" ? "Recall" : mode === "trace" ? "Trace" : "Write"}</span>
        <span>田字格</span>
      </div>
      <div className="space-y-3">
        {family.entries.slice(0, 2).map((entry) => (
          <div key={entry.id} className="grid grid-cols-[minmax(0,1fr)_repeat(3,2.5rem)] items-center gap-2">
            <span className="truncate text-xs text-[#566276]">
              {mode === "quiz" ? entry.english : entry.pinyin}
            </span>
            {[0, 1, 2].map((cell) => (
              <span
                key={cell}
                className="grid aspect-square place-items-center border border-[#c9bca8] bg-white font-serif text-xl"
              >
                {mode === "quiz"
                  ? ""
                  : cell === 0 || (mode === "trace" && cell === 1)
                    ? entry.hanzi.slice(0, 1)
                    : ""}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
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
