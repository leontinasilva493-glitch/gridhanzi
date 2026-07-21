"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, FileCheck2, PencilLine, Search } from "lucide-react";

import { Link } from "@/core/i18n/navigation";

import { filterWorksheetTemplates } from "../templates";
import type { WorksheetTemplate } from "../types";
import { PublicPageShell } from "./site-shell";
import { WorksheetMiniature } from "./worksheet-miniature";

type CategoryFilter = WorksheetTemplate["category"] | "all";

export function TemplatesPage({ templates }: { templates: WorksheetTemplate[] }) {
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

  return (
    <PublicPageShell active="templates">
      <main className="hs-container pt-6">
        <div className="text-sm text-[#617084]">Home &nbsp;/&nbsp; Templates</div>
        <header className="mt-3">
          <h1 className="hs-display text-4xl font-bold sm:text-5xl">
            Printable Chinese Writing Worksheets
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-[#566276]">
            Choose an editable word list, then change the words, grid, and paper size.
          </p>
        </header>

        <section className="hs-card mt-6 p-4 sm:p-5" aria-label="Template filters">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="relative min-w-0">
              <span className="sr-only">Search templates</span>
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6a7586]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search family, travel, HSK…"
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
            <h2 className="hs-display text-2xl font-bold">Worksheet templates</h2>
            <span className="text-sm text-[#657083]">
              {filtered.length} {filtered.length === 1 ? "template" : "templates"}
            </span>
          </div>
          {filtered.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((template) => (
                <article key={template.slug} className="hs-card overflow-hidden p-3">
                  <WorksheetMiniature
                    entries={template.entries.slice(0, 3)}
                    title={template.title}
                    chineseTitle={template.chineseTitle}
                    profile={template.recommendedProfile}
                  />
                  <h3 className="hs-display mt-4 text-xl font-bold">{template.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-[#647083]">
                    {template.chineseTitle} · {template.age}
                    <br />
                    {template.level} · {template.wordCount} words
                  </p>
                  <Link
                    href={`/templates/${template.slug}`}
                    className="hs-secondary-button mt-3 w-full text-sm"
                  >
                    View template
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
  children: React.ReactNode;
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
