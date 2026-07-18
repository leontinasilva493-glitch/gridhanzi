"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Eye,
  GripVertical,
  LoaderCircle,
  Plus,
  Printer,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Link, useRouter } from "@/core/i18n/navigation";

import { createWorksheetEntryId } from "../ids";
import { localize } from "../i18n";
import {
  defaultWorksheetSettings,
  type GridDensity,
  type WorksheetEntry,
  type WorksheetDifficulty,
  type WorksheetMode,
  type WorksheetSettings,
  type WorksheetSnapshot,
} from "../types";
import { PublicPageShell } from "./site-shell";
import { WorksheetPaper } from "./worksheet-paper";

export const WORKSHEET_STORAGE_KEY = "hanzisheets:worksheet:v1";

export function GeneratorClient({
  initialEntries,
  initialMode,
  initialDifficulty = "beginner",
  autoEnrich = false,
  templateTitle,
  templateChineseTitle,
}: {
  initialEntries: WorksheetEntry[];
  initialMode?: WorksheetMode;
  initialDifficulty?: WorksheetDifficulty;
  autoEnrich?: boolean;
  templateTitle?: string;
  templateChineseTitle?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = (english: string, chinese: string) => localize(locale, english, chinese);
  const hasTemplate = Boolean(templateTitle && templateChineseTitle);
  const [entries, setEntries] = useState(initialEntries);
  const [settings, setSettings] = useState<WorksheetSettings>({
    ...defaultWorksheetSettings,
    mode: initialMode ?? defaultWorksheetSettings.mode,
    difficulty: initialDifficulty,
    title: hasTemplate
      ? `${templateTitle} · ${templateChineseTitle}`
      : "My Chinese Worksheet",
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date()),
  });
  const [isEnriching, setIsEnriching] = useState(false);
  const [message, setMessage] = useState(
    autoEnrich
      ? t("Preparing an AI-assisted worksheet…", "正在准备 AI 辅助字帖…")
      : hasTemplate
        ? t(`${templateTitle} template loaded`, `已载入 ${templateTitle} 模板`)
        : t("Curated fields loaded", "已载入精选词汇"),
  );
  const autoEnrichStarted = useRef(false);

  const completed = useMemo(
    () => entries.filter((entry) => entry.status === "complete").length,
    [entries],
  );

  function updateEntry(id: string, field: keyof WorksheetEntry, value: string) {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              [field]: value,
              status:
                (field === "hanzi" ? value : entry.hanzi) &&
                (field === "pinyin" ? value : entry.pinyin) &&
                (field === "english" ? value : entry.english)
                  ? "complete"
                  : "needs-review",
            }
          : entry,
      ),
    );
  }

  function moveEntry(index: number, direction: -1 | 1) {
    setEntries((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      if (!item) return current;
      next.splice(target, 0, item);
      return next;
    });
  }

  async function enrichEntries() {
    setIsEnriching(true);
    setMessage(t("Checking Hanzi, Pinyin, and meanings…", "正在检查汉字、拼音和释义…"));
    try {
      const values = entries.map((entry) => entry.hanzi || entry.english);
      const response = await fetch("/api/worksheet/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, difficulty: settings.difficulty }),
      });
      const payload = (await response.json()) as {
        entries?: WorksheetEntry[];
        source?: string;
        fallbackReason?: string;
        error?: string;
      };
      if (!response.ok || !payload.entries) {
        throw new Error(payload.error || "Could not enrich this list.");
      }
      setEntries((current) =>
        payload.entries!.map((entry, index) => ({
          ...entry,
          id: current[index]?.id ?? createWorksheetEntryId(),
        })),
      );
      setMessage(
        payload.source === "gemini"
          ? t("AI fields completed — please review", "AI 已补全，请检查结果")
          : payload.fallbackReason === "not_configured"
            ? t("AI is not configured — curated matches were used and unknown rows remain editable", "未配置 AI：已使用本地词库，未识别内容仍可编辑")
            : t("AI was unavailable — curated matches were used and unknown rows remain editable", "AI 暂时不可用：已使用本地词库，未识别内容仍可编辑"),
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not enrich this list.");
    } finally {
      setIsEnriching(false);
    }
  }

  useEffect(() => {
    if (!autoEnrich || autoEnrichStarted.current) return;
    autoEnrichStarted.current = true;
    void enrichEntries();
    // Run exactly once for the homepage handoff.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoEnrich]);

  function openPreview() {
    const snapshot: WorksheetSnapshot = {
      version: 1,
      entries,
      settings,
    };
    sessionStorage.setItem(WORKSHEET_STORAGE_KEY, JSON.stringify(snapshot));
    router.push("/worksheet/preview");
  }

  return (
    <PublicPageShell active="generator" footer={false}>
      <main className="hs-container pb-28 pt-6">
        <div className="flex items-center gap-2 text-sm text-[#617084]">
          <Link href="/" className="hover:text-[#b62822]">
            {t("Home", "首页")}
          </Link>
          <span>/</span>
          <span>{t("Generator", "字帖生成器")}</span>
        </div>
        <h1 className="hs-display mt-4 text-4xl font-bold sm:text-5xl">
          {t("Chinese Worksheet Generator", "中文汉字字帖生成器")}
        </h1>
        <p className="mt-2 text-[#566276]">
          {t("Review your vocabulary, choose a practice style, and print.", "检查词汇，选择练习方式，然后下载或打印。")}
        </p>
        <div className="mt-6 flex max-w-3xl items-center gap-3 text-sm">
          <StepBadge complete label={t("Add words", "添加词汇")} number="1" />
          <span className="h-px flex-1 bg-[#d6cfc2]" />
          <StepBadge active label={t("Review & customize", "检查与设置")} number="2" />
          <span className="h-px flex-1 bg-[#d6cfc2]" />
          <StepBadge label={t("Print", "下载打印")} number="3" />
        </div>

        <div className="mt-7 grid gap-4 xl:grid-cols-[275px_minmax(500px,1fr)_minmax(390px,0.78fr)]">
          <SettingsPanel settings={settings} setSettings={setSettings} />

          <section className="hs-card min-w-0 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="hs-display text-2xl font-bold">{t("Review your list", "检查词汇表")}</h2>
              <span className="flex items-center gap-1 text-sm font-medium text-[#237553]">
                {t(`${completed} fields completed`, `已完成 ${completed} 条`)} <Check className="size-4" />
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="hs-secondary-button text-sm"
                onClick={() =>
                  setEntries((current) => [
                    ...current,
                    {
                      id: createWorksheetEntryId(),
                      hanzi: "",
                      pinyin: "",
                      english: "",
                      status: "needs-review",
                    },
                  ])
                }
              >
                <Plus className="size-4" /> {t("Add row", "添加一行")}
              </button>
              <Link href="/" className="hs-secondary-button text-sm">
                <ArrowLeft className="size-4" /> {t("Paste more", "重新粘贴")}
              </Link>
              <button
                type="button"
                className="hs-secondary-button text-sm"
                onClick={enrichEntries}
                disabled={isEnriching || entries.length === 0}
              >
                {isEnriching ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {t("Auto-fill missing fields", "自动补全缺失内容")}
              </button>
            </div>

            <div className="mt-4 hidden overflow-x-auto rounded border border-[#ded7ca] md:block">
              <div className="min-w-[680px]">
                <div className="grid grid-cols-[34px_32px_1fr_1fr_1.1fr_104px] gap-2 bg-[#fbf8f2] px-3 py-3 text-xs font-bold text-[#516074]">
                  <span />
                  <span>#</span>
                  <span>{t("Chinese", "汉字")}</span>
                  <span>{t("Pinyin", "拼音")}</span>
                  <span>{t("English", "英文")}</span>
                  <span className="text-center">{t("Actions", "操作")}</span>
                </div>
                {entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-[34px_32px_1fr_1fr_1.1fr_104px] items-center gap-2 border-t border-[#e3ddd2] px-3 py-3"
                  >
                    <GripVertical className="size-4 text-[#758092]" />
                    <span className="text-sm">{index + 1}</span>
                    <EditorInput
                      value={entry.hanzi}
                      label={`Chinese row ${index + 1}`}
                      className="font-serif text-lg"
                      onChange={(value) => updateEntry(entry.id, "hanzi", value)}
                    />
                    <EditorInput
                      value={entry.pinyin}
                      label={`Pinyin row ${index + 1}`}
                      onChange={(value) => updateEntry(entry.id, "pinyin", value)}
                    />
                    <div className="relative">
                      <EditorInput
                        value={entry.english}
                        label={`English row ${index + 1}`}
                        onChange={(value) =>
                          updateEntry(entry.id, "english", value)
                        }
                      />
                      {entry.status === "needs-review" ? (
                        <AlertCircle className="absolute right-2 top-1/2 size-4 -translate-y-1/2 text-amber-500" />
                      ) : null}
                    </div>
                    <div className="flex justify-center gap-1">
                      <IconButton
                        label="Move up"
                        onClick={() => moveEntry(index, -1)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="size-4" />
                      </IconButton>
                      <IconButton
                        label="Move down"
                        onClick={() => moveEntry(index, 1)}
                        disabled={index === entries.length - 1}
                      >
                        <ArrowDown className="size-4" />
                      </IconButton>
                      <IconButton
                        label="Delete row"
                        onClick={() =>
                          setEntries((current) =>
                            current.filter((item) => item.id !== entry.id),
                          )
                        }
                      >
                        <Trash2 className="size-4" />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 space-y-3 md:hidden">
              {entries.map((entry, index) => (
                <article
                  key={entry.id}
                  className="rounded border border-[#ded7ca] bg-[#fffefa] p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-sm">{t(`Word ${index + 1}`, `词条 ${index + 1}`)}</strong>
                    {entry.status === "needs-review" ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                        <AlertCircle className="size-4" /> {t("Review", "待检查")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#237553]">
                        <Check className="size-4" /> {t("Ready", "已完成")}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 grid gap-3">
                    <MobileEditorField label={t("Chinese", "汉字")}>
                      <EditorInput
                        value={entry.hanzi}
                        label={`Chinese row ${index + 1}`}
                        className="font-serif text-lg"
                        onChange={(value) => updateEntry(entry.id, "hanzi", value)}
                      />
                    </MobileEditorField>
                    <MobileEditorField label={t("Pinyin", "拼音")}>
                      <EditorInput
                        value={entry.pinyin}
                        label={`Pinyin row ${index + 1}`}
                        onChange={(value) => updateEntry(entry.id, "pinyin", value)}
                      />
                    </MobileEditorField>
                    <MobileEditorField label={t("English", "英文")}>
                      <EditorInput
                        value={entry.english}
                        label={`English row ${index + 1}`}
                        onChange={(value) => updateEntry(entry.id, "english", value)}
                      />
                    </MobileEditorField>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <IconButton label="Move up" onClick={() => moveEntry(index, -1)} disabled={index === 0}>
                      <ArrowUp className="size-4" />
                    </IconButton>
                    <IconButton label="Move down" onClick={() => moveEntry(index, 1)} disabled={index === entries.length - 1}>
                      <ArrowDown className="size-4" />
                    </IconButton>
                    <IconButton
                      label="Delete row"
                      onClick={() => setEntries((current) => current.filter((item) => item.id !== entry.id))}
                    >
                      <Trash2 className="size-4" />
                    </IconButton>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-5 text-xs text-[#617084]">
              <span className="flex items-center gap-1 text-[#237553]">
                <Check className="size-4" /> {t("Auto-filled", "已自动补全")}
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="size-4" /> {t("Check ambiguity", "检查歧义")}
              </span>
              <span>{message}</span>
            </div>
          </section>

          <aside className="hs-card self-start p-4 xl:sticky xl:top-20">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-semibold">
                <span className="size-2.5 rounded-full bg-[#23835d]" />
                {t("Live preview", "实时预览")}
              </span>
              <span className="text-xs text-[#657083]">
                {settings.paperSize === "a4" ? "A4" : "US Letter"} · Portrait
              </span>
            </div>
            {entries.length > 0 ? (
              <WorksheetPaper
                entries={entries}
                settings={settings}
                compact
              />
            ) : (
              <div className="grid aspect-[210/297] place-items-center bg-white text-center text-sm text-[#657083]">
                {t("Add a vocabulary row to preview your worksheet.", "添加词汇后即可预览字帖。")}
              </div>
            )}
          </aside>
        </div>
      </main>

      <div className="hs-no-print fixed inset-x-0 bottom-0 z-40 border-t border-[#d8d0c2] bg-[#fffdf9]/96 backdrop-blur">
        <div className="hs-container flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className="hs-secondary-button min-w-56"
            onClick={openPreview}
            disabled={entries.length === 0}
          >
            <Eye className="size-4" /> {t("Preview full page", "完整预览")}
          </button>
          <button
            type="button"
            className="hs-primary-button min-w-72"
            onClick={openPreview}
            disabled={entries.length === 0}
          >
            <Printer className="size-4" /> {t("Print / Save PDF", "下载 / 打印 PDF")}
          </button>
        </div>
      </div>
    </PublicPageShell>
  );
}

function SettingsPanel({
  settings,
  setSettings,
}: {
  settings: WorksheetSettings;
  setSettings: React.Dispatch<React.SetStateAction<WorksheetSettings>>;
}) {
  const locale = useLocale();
  const t = (english: string, chinese: string) => localize(locale, english, chinese);

  function patch(value: Partial<WorksheetSettings>) {
    setSettings((current) => ({ ...current, ...value }));
  }

  return (
    <aside className="hs-card self-start p-4 xl:sticky xl:top-20">
      <SettingSection title={t("Worksheet type", "练习类型")}>
        <Segmented
          value={settings.mode}
          options={[
            ["trace", t("Learn", "新字精学")],
            ["write", t("Practice", "描红临写")],
            ["quiz", t("Test", "默写测试")],
          ]}
          onChange={(mode) => patch({ mode: mode as WorksheetMode })}
        />
      </SettingSection>
      <SettingSection title={t("Grid density", "格子密度")}>
        <Segmented
          value={settings.gridDensity}
          options={[
            ["large", t("Large · 6", "大格 · 6列")],
            ["standard", t("Standard · 8", "标准 · 8列")],
            ["compact", t("Compact · 10", "紧凑 · 10列")],
          ]}
          disabled={settings.mode !== "write"}
          onChange={(gridDensity) =>
            patch({ gridDensity: gridDensity as GridDensity })
          }
        />
        {settings.mode !== "write" ? (
          <p className="mt-2 text-[0.68rem] leading-4 text-[#707987]">
            {t(
              "Learn uses 9 teaching columns; Test uses a fixed two-column layout.",
              "新字精学固定9列，默写测试固定双栏。",
            )}
          </p>
        ) : null}
      </SettingSection>
      <SettingSection title={t("Grid", "格子")}>
        <Segmented
          value={settings.grid}
          options={[
            ["tian", "Tian Zi Ge"],
            ["mi", "Mi Zi Ge"],
          ]}
          onChange={(grid) => patch({ grid: grid as "tian" | "mi" })}
        />
      </SettingSection>
      <SettingSection title={t("Options", "显示选项")}>
        <ToggleRow
          label="Pinyin"
          checked={settings.showPinyin}
          onChange={(showPinyin) => patch({ showPinyin })}
        />
        <ToggleRow
          label={t("Stroke order", "笔顺")}
          checked={settings.showStrokeOrder}
          onChange={(showStrokeOrder) => patch({ showStrokeOrder })}
        />
      </SettingSection>
      <SettingSection title={t("Difficulty", "难度")}>
        <Segmented
          value={settings.difficulty}
          options={[
            ["beginner", t("Beginner", "入门 HSK 1-2")],
            ["advanced", t("Advanced", "进阶母语级")],
          ]}
          onChange={(difficulty) =>
            patch({ difficulty: difficulty as WorksheetDifficulty })
          }
        />
      </SettingSection>
      <SettingSection title={t("Paper", "纸张")}>
        <Segmented
          value={settings.paperSize}
          options={[
            ["a4", "A4"],
            ["letter", "US Letter"],
          ]}
          onChange={(paperSize) =>
            patch({ paperSize: paperSize as "a4" | "letter" })
          }
        />
      </SettingSection>
      <div className="space-y-3">
        <Field
          label={t("Worksheet title", "字帖标题")}
          value={settings.title}
          onChange={(title) => patch({ title })}
        />
        <Field
          label={t("Name", "姓名")}
          value={settings.studentName}
          placeholder={t("Student name", "学生姓名")}
          onChange={(studentName) => patch({ studentName })}
        />
        <Field
          label={t("Date", "日期")}
          value={settings.date}
          onChange={(date) => patch({ date })}
        />
      </div>
    </aside>
  );
}

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2 className="hs-display mb-2 font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Segmented({
  value,
  options,
  onChange,
  disabled = false,
}: {
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-flow-col auto-cols-fr overflow-hidden rounded border border-[#d5cdbf]">
      {options.map(([option, label]) => (
        <button
          type="button"
          key={option}
          disabled={disabled}
          onClick={() => onChange(option)}
          className={`min-h-10 border-r border-[#d5cdbf] px-2 text-xs font-semibold last:border-r-0 disabled:cursor-not-allowed disabled:opacity-55 ${
            value === option
              ? "bg-[#bd2923] text-white"
              : "bg-white text-[#20304a] hover:bg-[#faf5ec]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-1.5 text-sm">
      {label}
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="relative h-6 w-11 rounded-full bg-[#c9c9c4] transition peer-checked:bg-[#2b895f] peer-focus-visible:ring-4 peer-focus-visible:ring-green-100 after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
    </label>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-semibold text-[#4f5d70]">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-10 w-full rounded border border-[#d6cfc2] bg-white px-3 text-sm font-normal outline-none focus:border-[#315ed4] focus:ring-3 focus:ring-blue-100"
      />
    </label>
  );
}

function EditorInput({
  value,
  label,
  className = "",
  onChange,
}: {
  value: string;
  label: string;
  className?: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`h-10 w-full rounded border border-[#d8d3ca] bg-white px-2.5 text-sm outline-none focus:border-[#315ed4] focus:ring-3 focus:ring-blue-100 ${className}`}
    />
  );
}

function MobileEditorField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-semibold text-[#4f5d70]">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid min-h-11 min-w-11 place-items-center rounded border border-[#ded7ca] text-[#526074] hover:bg-[#f3eee4] disabled:opacity-25 md:min-h-8 md:min-w-8 md:border-0"
    >
      {children}
    </button>
  );
}

function StepBadge({
  number,
  label,
  active,
  complete,
}: {
  number: string;
  label: string;
  active?: boolean;
  complete?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 font-semibold ${
        active ? "text-[#b62822]" : complete ? "text-[#237553]" : "text-[#6d7685]"
      }`}
    >
      <span
        className={`grid size-9 place-items-center rounded-full border ${
          active
            ? "border-[#b62822] bg-[#b62822] text-white"
            : complete
              ? "border-[#237553]"
              : "border-[#c8c5bf]"
        }`}
      >
        {complete ? <Check className="size-4" /> : number}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}
