"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, FileCheck2, PencilLine, Search } from "lucide-react";

import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

import { filterWorksheetTemplates } from "../templates";
import type { WorksheetTemplate, WorksheetTemplateSummary } from "../types";
import { PublicPageShell } from "./site-shell";
import { WorksheetCardPreview } from "./worksheet-card-preview";

type CategoryFilter = WorksheetTemplate["category"] | "all";
type TemplateDirectoryGroup = {
  id: string;
  title: string;
  description: string;
  slugs: string[];
};

const templateShowcase = [
  {
    slug: "chinese-first-characters",
    eyebrow: "For first characters",
    note: "Large, calm writing targets for a learner's first printable page.",
  },
  {
    slug: "hsk-1",
    eyebrow: "For HSK review",
    note: "Turn a level-based vocabulary set into editable recognition and writing practice.",
  },
  {
    slug: "family",
    eyebrow: "For everyday vocabulary",
    note: "Start from a useful topic, then tune the guidance and blank writing space.",
  },
] as const;

const templateDirectoryGroups: TemplateDirectoryGroup[] = [
  {
    id: "quick-start",
    title: "Quick Start",
    description: "Simple printable worksheets, Hanzi grid paper, and blank Chinese character grids.",
    slugs: [
      "chinese-first-characters",
      "top-100-chinese-characters",
      "top-200-chinese-characters",
      "blank-tianzige-grid",
      "blank-mi-zi-ge-grid",
    ],
  },
  {
    id: "hsk-worksheets",
    title: "HSK Worksheets",
    description: "Ready-to-edit HSK word lists and HSK 3 scene-based practice sheets.",
    slugs: [
      "hsk-1",
      "hsk-2",
      "hsk-3",
      "hsk-4",
      "hsk-5",
      "hsk-3-campus-life",
      "hsk-3-health",
      "hsk-3-shopping-money",
      "hsk-3-technology",
      "hsk-3-exams-grades",
      "hsk-3-apartment-home",
      "hsk-3-office-teamwork",
    ],
  },
  {
    id: "writing-basics",
    title: "Writing Basics",
    description: "Practice strokes, radicals, pinyin, stroke order, and copywork.",
    slugs: [
      "basic-strokes",
      "radicals",
      "pinyin-practice",
      "stroke-order-practice",
      "classical-poem-copying",
    ],
  },
  {
    id: "everyday-words",
    title: "Everyday Words",
    description: "Common classroom, home, food, travel, and daily-life word packs.",
    slugs: [
      "family",
      "numbers",
      "chinese-numbers-1-100",
      "colors",
      "greetings",
      "days-months",
      "food-drinks",
      "animals-kids",
      "school-classroom",
      "daily-routine",
      "weather-seasons",
      "body-health",
      "home-rooms",
      "transportation",
      "travel",
      "shopping",
      "restaurant",
      "hobbies-sports",
      "chinese-new-year",
      "jobs-work",
      "chinese-measure-words",
      "common-chinese-verbs",
    ],
  },
];
const hskPickerHref = "/generator?hskSystem=2.0&hskLevel=1";

export function TemplatesPage({ templates }: { templates: WorksheetTemplateSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [level, setLevel] = useState("all");
  const [age, setAge] = useState("all");
  const levels = useMemo(
    () => [...new Set(templates.map((template) => template.level))],
    [templates],
  );
  const ages = useMemo(
    () => [...new Set(templates.map((template) => template.age))],
    [templates],
  );
  const filtered = useMemo(
    () =>
      filterWorksheetTemplates(templates, {
        query,
        category,
        level,
        age,
      }),
    [age, category, level, query, templates],
  );
  const directoryGroups = useMemo(() => {
    const templatesBySlug = new Map(templates.map((template) => [template.slug, template]));

    return templateDirectoryGroups.map((group) => ({
      ...group,
      templates: group.slugs
        .map((slug) => templatesBySlug.get(slug))
        .filter((template): template is WorksheetTemplateSummary => Boolean(template)),
    }));
  }, [templates]);
  const showcaseTemplates = useMemo(() => {
    const templatesBySlug = new Map(
      templates.map((template) => [template.slug, template]),
    );
    return templateShowcase.flatMap((showcase) => {
      const template = templatesBySlug.get(showcase.slug);
      return template ? [{ ...showcase, template }] : [];
    });
  }, [templates]);

  return (
    <PublicPageShell active="templates">
      <main className="hs-container pt-6">
        <div className="text-sm text-[#617084]">Home &nbsp;/&nbsp; Templates</div>
        <header className="mt-3">
          <h1 className="hs-display text-4xl font-bold sm:text-5xl">
            Printable Chinese Writing Worksheets
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-[#566276]">
            Choose an editable word list, Tian Zi Ge paper, Mi Zi Ge paper, or
            printable Hanzi grid template, then change the words, grid, and
            paper size.
          </p>
        </header>

        <section
          className="mt-6 grid gap-5 rounded border border-[#ded7ca] bg-[#fffefa] p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto]"
          aria-labelledby="practice-sheet-templates-title"
        >
          <div>
            <p className="hs-kicker">Editable practice sheets</p>
            <h2
              id="practice-sheet-templates-title"
              className="hs-display mt-2 text-3xl font-bold"
            >
              Chinese Character Practice Sheet Templates
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5b687a]">
              Start from printable Chinese writing practice sheets for family,
              numbers, colors, HSK, school, travel, everyday topics, Tian Zi Ge
              paper, and Mi Zi Ge Hanzi grid paper. Each template opens as an
              editable word list, so you can change the Hanzi, Pinyin, grid,
              paper size, and PDF layout before printing.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-3 lg:justify-end">
            <Link href="/generator" className="hs-primary-button text-sm">
              Make a custom worksheet
            </Link>
            <Link href="/for-teachers" className="hs-secondary-button text-sm">
              Teacher workflow
            </Link>
            <Link href={hskPickerHref} className="hs-secondary-button text-sm">
              Choose by HSK version
            </Link>
            <Link href="/hsk" className="hs-secondary-button text-sm">
              Browse HSK vocabulary
            </Link>
          </div>
        </section>

        <section
          className="mt-8"
          aria-labelledby="template-outcomes-title"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="hs-kicker">Real worksheet outcomes</p>
              <h2
                id="template-outcomes-title"
                className="hs-display mt-2 text-3xl font-bold"
              >
                See what you can print
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5b687a]">
                Compare the finished page direction first. Every example stays
                editable before you print or save a PDF.
              </p>
            </div>
            <span className="rounded-full border border-[#d7d0c4] bg-[#fffefa] px-3 py-1.5 text-xs font-semibold text-[#617084]">
              Preview → edit → print
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {showcaseTemplates.map(({ eyebrow, note, template }) => (
              <article
                key={template.slug}
                className="group overflow-hidden rounded border border-[#ded7ca] bg-[#fffefa] shadow-[0_12px_34px_rgba(23,41,66,0.07)]"
              >
                <div className="relative overflow-hidden border-b border-[#e2d8ca] bg-[radial-gradient(circle_at_top_left,#fff8e8_0,#f2e9da_52%,#e8ddcb_100%)] p-5">
                  <span className="absolute right-4 top-4 rounded-full bg-[#172942] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white">
                    Printable
                  </span>
                  <WorksheetCardPreview
                    entries={template.previewEntries}
                    title={template.title}
                    chineseTitle={template.chineseTitle}
                    className="mx-auto mt-5 max-w-64 rotate-[-1deg] transition duration-300 group-hover:rotate-0 group-hover:-translate-y-1"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a42b26]">
                    {eyebrow}
                  </p>
                  <h3 className="hs-display mt-2 text-xl font-bold text-[#172942]">
                    {template.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5b687a]">
                    {note}
                  </p>
                  <Link
                    href={`/generator?template=${template.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#24466e] hover:text-[#b62822]"
                  >
                    Use this layout <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8" aria-labelledby="template-directory-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="hs-kicker">Browse by need</p>
              <h2 id="template-directory-title" className="hs-display mt-2 text-3xl font-bold">
                Find the right worksheet faster
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {templateDirectoryGroups.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="rounded-full border border-[#d7d0c4] bg-white px-3 py-2 text-sm font-semibold text-[#17253c] hover:border-[#b62822] hover:text-[#b62822]"
                >
                  {group.title}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-6">
            {directoryGroups.map((group, index) => (
              <section
                key={group.id}
                id={group.id}
                className="scroll-mt-24 rounded border border-[#ded7ca] bg-[#fffefa] p-5 sm:p-6"
                aria-labelledby={`${group.id}-title`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3
                      id={`${group.id}-title`}
                      className="hs-display text-2xl font-bold"
                    >
                      {group.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5f6c7f]">
                      {group.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#617084]">
                      {group.templates.length} templates
                    </span>
                    {group.id === "hsk-worksheets" ? (
                      <Link
                        href={hskPickerHref}
                        className="inline-flex items-center gap-1 rounded-full border border-[#d7d0c4] bg-white px-3 py-1 text-xs font-semibold text-[#24466e] hover:border-[#b62822] hover:text-[#b62822]"
                      >
                        Choose by HSK version <ArrowRight className="size-3.5" />
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-4 grid gap-3",
                    index === 0
                      ? "sm:grid-cols-3"
                      : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                  )}
                >
                  {group.templates.map((template) => (
                    <article
                      key={template.slug}
                      className="rounded border border-[#e3dbce] bg-white p-4"
                    >
                      <h4 className="hs-display text-lg font-bold">
                        <Link
                          href={`/templates/${template.slug}`}
                          className="hover:text-[#b62822]"
                        >
                          {template.title}
                        </Link>
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-[#5f6c7f]">
                        {template.description}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-[#657083]">
                        {template.level} - {template.wordCount} words
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                          href={`/generator?template=${template.slug}`}
                          className="hs-primary-button px-3 py-2 text-xs"
                        >
                          Edit sheet
                        </Link>
                        <Link
                          href={`/templates/${template.slug}`}
                          className="inline-flex items-center gap-1 px-1 py-2 text-xs font-semibold text-[#24466e] hover:text-[#b62822]"
                        >
                          Details <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="hs-card mt-6 p-4 sm:p-5" aria-label="Template filters">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="relative min-w-0">
              <span className="sr-only">Search templates</span>
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6a7586]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search family, travel, HSK..."
                className="h-12 w-full rounded border border-[#d7d0c4] bg-white pl-12 pr-4 outline-none focus:border-[#315ed4] focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <FilterSelect label="Level" value={level} options={levels} onChange={setLevel} />
            <FilterSelect label="Age" value={age} options={ages} onChange={setAge} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["kids", "Kids"],
                ["topics", "Topics"],
                ["hsk", "HSK"],
              ] as const
            ).map(([value, label]) => (
              <button
                type="button"
                key={value}
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
                className={`min-h-10 min-w-20 rounded border px-4 py-2 text-sm font-semibold ${
                  category === value
                    ? "border-[#b62822] bg-[#b62822] text-white"
                    : "border-[#d2cabc] bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="hs-display text-2xl font-bold">All worksheet templates</h2>
            <span className="text-sm text-[#657083]">
              {filtered.length} {filtered.length === 1 ? "template" : "templates"}
            </span>
          </div>
          {filtered.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((template) => (
                <article key={template.slug} className="hs-card overflow-hidden p-3">
                  <WorksheetCardPreview
                    entries={template.previewEntries}
                    title={template.title}
                    chineseTitle={template.chineseTitle}
                  />
                  <h3 className="hs-display mt-4 text-xl font-bold">
                    <Link
                      href={`/templates/${template.slug}`}
                      className="hover:text-[#b62822]"
                    >
                      {template.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#647083]">
                    {template.chineseTitle} - {template.age}
                    <br />
                    {template.level} - {template.wordCount} words
                  </p>
                  <Link
                    href={`/generator?template=${template.slug}`}
                    className="hs-primary-button mt-3 w-full text-sm"
                  >
                    Edit this practice sheet
                  </Link>
                  <Link
                    href={`/templates/${template.slug}`}
                    className="mt-2 inline-flex w-full items-center justify-center gap-1 text-sm font-semibold text-[#24466e] hover:text-[#b62822]"
                  >
                    Worksheet details <ArrowRight className="size-4" />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="hs-card mt-4 p-10 text-center">
              <h3 className="hs-display text-xl font-bold">No templates found</h3>
              <p className="mt-2 text-sm text-[#617084]">Try another word or clear the filters.</p>
              <button
                type="button"
                className="hs-secondary-button mt-4"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setLevel("all");
                  setAge("all");
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        <section className="hs-card mt-8 p-5 sm:p-7">
          <h2 className="hs-display text-2xl font-bold">Choose a worksheet</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <GoalCard icon={BookOpen} title="Build vocabulary">
              Pick a topic and review the words before students start writing.
            </GoalCard>
            <GoalCard icon={PencilLine} title="Practise handwriting">
              Trace a model character, then write it again in blank grids.
            </GoalCard>
            <GoalCard icon={FileCheck2} title="Prepare for HSK">
              Filter by HSK level and print the words your learner is studying.
            </GoalCard>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-xs font-semibold text-[#536176]">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 min-w-40 rounded border border-[#d7d0c4] bg-white px-3 text-sm font-normal"
      >
        <option value="all">All {label.toLocaleLowerCase()}s</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function GoalCard({ icon: Icon, title, children }: {
  icon: typeof BookOpen;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="flex gap-4 rounded border border-[#ded7ca] bg-white p-5">
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#f3eee3] text-[#315f47]">
        <Icon className="size-7" />
      </span>
      <div>
        <h3 className="hs-display text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#5f6c7f]">{children}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#b62822]">
          Use the filters above <ArrowRight className="size-4" />
        </span>
      </div>
    </article>
  );
}
