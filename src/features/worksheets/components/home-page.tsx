
import { UiText } from "./ui-text";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardPaste,
  FileText,
  GraduationCap,
  Languages,
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
        <section className="hs-container grid items-start gap-8 pb-12 pt-6 sm:pt-10 lg:grid-cols-[1.02fr_0.9fr] lg:pt-12">
          <div>
            <h1 className="hs-display max-w-3xl text-3xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.55rem]"><UiText>{"Free Chinese Character Worksheet Generator"}</UiText></h1>
            <p className="mt-3 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 text-[#435166]"><UiText>{"Use this free Chinese character worksheet generator to turn your own English or Chinese word list into printable practice sheets. Edit the Hanzi and Pinyin, choose tracing, Tian Zi Ge, Mi Zi Ge, or blank writing grids, then download an A4 or US Letter PDF—no sign-up required."}</UiText></p>
            <div className="mt-5 sm:mt-8">
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
          ><UiText>{"Paste English or Chinese words and make a custom worksheet."}</UiText></TaskLink>
          <TaskLink
            href="/templates"
            icon={BookOpen}
            title="Start with a worksheet"
          ><UiText>{"Pick an editable topic or HSK word list to get started faster."}</UiText></TaskLink>
          <TaskLink
            href="/stroke-order"
            icon={PencilLine}
            title="Check one character’s stroke order"
          ><UiText>{"Look up the strokes before adding a character to your worksheet."}</UiText></TaskLink>
        </section>

        <section className="hs-container hs-content-visibility py-14">
          <p className="hs-kicker"><UiText>{"One site, clear starting points"}</UiText></p>
          <h2 className="hs-display mt-2 text-3xl font-bold"><UiText>{"Choose the Right Chinese Writing Tool"}</UiText></h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#566276]"><UiText>{"Start with the page that matches the job: build from your own words, open a ready-made list, print empty grids, or focus on vocabulary and stroke order."}</UiText></p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ToolLink
              href="/generator"
              icon={ClipboardPaste}
              title="Chinese worksheet generator from your word list"
            ><UiText>{"Edit Hanzi and Pinyin before printing a custom practice sheet."}</UiText></ToolLink>
            <ToolLink
              href="/templates"
              icon={BookOpen}
              title="Printable Chinese writing worksheets"
            ><UiText>{"Choose an editable topic, classroom, or HSK word list."}</UiText></ToolLink>
            <ToolLink
              href="/grids"
              icon={FileText}
              title="Tian Zi Ge and Mi Zi Ge PDFs"
            ><UiText>{"Download blank Hanzi grid paper for immediate handwriting practice."}</UiText></ToolLink>
            <ToolLink
              href="/hsk"
              icon={GraduationCap}
              title="HSK vocabulary lists"
            ><UiText>{"Compare HSK 2.0 and 3.0 levels, then send selected words to a worksheet."}</UiText></ToolLink>
            <ToolLink
              href="/stroke-order"
              icon={PencilLine}
              title="Chinese stroke order guides"
            ><UiText>{"Check one character’s strokes, meaning, and practice options."}</UiText></ToolLink>
            <ToolLink
              href="/english-to-chinese-writing-practice"
              icon={Languages}
              title="English to Chinese writing practice"
            ><UiText>{"Begin with English vocabulary, then review the matched Hanzi and Pinyin."}</UiText></ToolLink>
          </div>
        </section>

        <section className="hs-container hs-content-visibility py-14">
          <p className="hs-kicker"><UiText>{"Practice sheet workflow"}</UiText></p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="hs-display text-3xl font-bold"><UiText>{"How to Use the Chinese Character Worksheet Generator"}</UiText></h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5b687a]"><UiText>{"GridHanzi keeps the worksheet useful first: paste vocabulary, review the Chinese writing fields, then print a practice sheet with grids, Pinyin, and optional stroke-order guidance."}</UiText></p>
            </div>
            <Link href="/generator" className="hs-primary-button text-sm"><UiText>{"Create a practice sheet"}</UiText></Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ProcessItem icon={ClipboardPaste} title="Paste words"><UiText>{"Start with English, Chinese, or a mixed classroom word list."}</UiText></ProcessItem>
            <ProcessItem icon={CheckCircle2} title="Check Hanzi and Pinyin"><UiText>{"Edit every row before it becomes a printable worksheet."}</UiText></ProcessItem>
            <ProcessItem icon={Printer} title="Print the PDF"><UiText>{"Choose tracing grids, blank writing cells, paper size, and PDF output."}</UiText></ProcessItem>
          </div>
          <p className="mt-5 text-sm leading-6 text-[#5b687a]"><UiText>{"Need a faster start? Browse"}</UiText>{" "}{" "}
            <Link href="/templates" className="font-semibold text-[#b62822]"><UiText>{"Chinese character practice sheet templates"}</UiText></Link>{" "}<UiText>{"and open any topic in the worksheet generator. Need empty practice cells instead? Download"}</UiText>{" "}{" "}
            <Link href="/grids" className="font-semibold text-[#b62822]"><UiText>{"printable Hanzi grid PDFs"}</UiText></Link>
            .
          </p>
        </section>

        <section className="hs-container hs-content-visibility py-14">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="hs-kicker"><UiText>{"Editable word lists"}</UiText></p>
              <h2 className="hs-display mt-2 text-3xl font-bold"><UiText>{"Start with a Chinese worksheet template"}</UiText></h2>
            </div>
            <Link
              href="/templates"
              className="hidden items-center gap-1 text-sm font-semibold text-[#b62822] sm:flex"
            ><UiText>{"View all templates"}</UiText><ArrowRight className="size-4" />
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
                  <UiText>{template.title}</UiText>
                </h3>
                <p className="mt-1 text-sm text-[#657083]">
                  <UiText>{template.age}</UiText> · {template.wordCount}<UiText>{"words"}</UiText></p>
                <Link
                  href={`/templates/${template.slug}`}
                  className="hs-secondary-button mt-3 w-full text-sm"
                ><UiText>{"View"}</UiText><UiText>{template.title}</UiText><UiText>{"worksheet"}</UiText></Link>
              </article>
            ))}
          </div>
        </section>

        <section
          id="practice-types"
          className="hs-container hs-content-visibility pb-14"
        >
          <p className="hs-kicker"><UiText>{"One list, three uses"}</UiText></p>
          <h2 className="hs-display mt-2 text-3xl font-bold"><UiText>{"Choose a Chinese character practice mode"}</UiText></h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <PracticeCard title="Learn new characters" mode="trace"><UiText>{"See the strokes in order, trace the character, then copy it."}</UiText></PracticeCard>
            <PracticeCard title="Practice handwriting" mode="write"><UiText>{"Start with a model and tracing cells, then use the blank grids."}</UiText></PracticeCard>
            <PracticeCard title="Test recall" mode="quiz"><UiText>{"Read the Pinyin or meaning, then write the word without a model."}</UiText></PracticeCard>
          </div>
        </section>

        <section
          id="for-teachers"
          className="hs-container hs-content-visibility grid gap-6 pb-14 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="hs-card p-7 sm:p-9">
            <p className="hs-kicker"><UiText>{"For regular lesson prep"}</UiText></p>
            <h2 className="hs-display mt-2 text-3xl font-bold"><UiText>{"Create Chinese writing worksheets for class"}</UiText></h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <WorkflowItem icon={ClipboardPaste} title="Paste this week’s words"><UiText>{"Copy them from your lesson plan or spreadsheet."}</UiText></WorkflowItem>
              <WorkflowItem icon={CheckCircle2} title="Check bilingual fields"><UiText>{"Fix the Hanzi, Pinyin, or meaning if needed."}</UiText></WorkflowItem>
              <WorkflowItem icon={Printer} title="Print practice and quizzes"><UiText>{"Use the same list for tracing and a later test."}</UiText></WorkflowItem>
            </div>
          </div>
          <aside className="hs-card border-[#243e62] p-7 sm:p-9">
            <h2 className="hs-display text-2xl font-bold"><UiText>{"Use one list for lessons, practice, and review"}</UiText></h2>
            <p className="mt-3 text-[#566276]"><UiText>{"Turn the same checked vocabulary into a guided lesson, a handwriting page, or a short recall test."}</UiText></p>
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
              <Link href="/for-teachers" className="hs-secondary-button"><UiText>{"See the teacher workflow"}</UiText></Link>
              <Link href="/generator" className="hs-primary-button"><UiText>{"Create a worksheet"}</UiText></Link>
            </div>
          </aside>
        </section>

        <section className="hs-container hs-card hs-content-visibility grid overflow-hidden lg:grid-cols-2">
          <div className="p-8 sm:p-10">
            <p className="hs-kicker"><UiText>{"Practice at home"}</UiText></p>
            <h2 className="hs-display mt-2 text-3xl font-bold"><UiText>{"Print Chinese character practice sheets for home"}</UiText></h2>
            <p className="mt-4 max-w-xl leading-7 text-[#566276]"><UiText>{"Print the words from class and let your child trace them before writing them without a model. No extra app or account is needed."}</UiText></p>
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
          <p className="hs-kicker"><UiText>{"Questions before you print"}</UiText></p>
          <h2 className="hs-display mt-2 text-3xl font-bold"><UiText>{"Frequently asked questions"}</UiText></h2>
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
                  <UiText>{question}</UiText>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#617084]">
                  <UiText>{answer}</UiText>
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
      <UiText>{label}</UiText>
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
      <h3 className="hs-display mt-4 text-lg font-bold"><UiText>{title}</UiText></h3>
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
          <UiText>{title}</UiText>
          <ArrowRight className="mt-0.5 size-4 shrink-0 text-[#b62822] transition-transform group-hover:translate-x-1" />
        </span>
        <span className="mt-2 block text-sm leading-6 text-[#617084]">
          {children}
        </span>
      </span>
    </Link>
  );
}

function ToolLink({
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
      className="group rounded border border-[#ded7ca] bg-[#fffefa] p-5 transition hover:-translate-y-0.5 hover:border-[#b62822] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b62822] focus-visible:ring-offset-2"
    >
      <span className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f3eee3] text-[#315f47]">
          <Icon className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="hs-display flex items-start justify-between gap-3 font-bold text-[#172942]">
            <UiText>{title}</UiText>
            <ArrowRight className="mt-0.5 size-4 shrink-0 text-[#b62822] transition-transform group-hover:translate-x-1" />
          </span>
          <span className="mt-2 block text-sm leading-6 text-[#617084]">
            {children}
          </span>
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
        <h3 className="hs-display text-xl font-bold text-[#b62822]"><UiText>{title}</UiText></h3>
        <p className="mt-2 text-sm leading-6 text-[#58667a]">{children}</p>
        <Link
          href={`/generator?template=family&mode=${mode}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#102545]"
        ><UiText>{"Try this mode"}</UiText><ArrowRight className="size-4" />
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
      <h3 className="hs-display mt-4 font-bold"><UiText>{title}</UiText></h3>
      <p className="mt-2 text-sm leading-6 text-[#677286]">{children}</p>
    </div>
  );
}
