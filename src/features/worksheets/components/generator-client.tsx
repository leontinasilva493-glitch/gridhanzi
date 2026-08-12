"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Download,
  Eye,
  GripVertical,
  LoaderCircle,
  Plus,
  Printer,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Link, useRouter } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

import {
  createWorksheetDraft,
  isSameWorksheetSnapshot,
  parseWorksheetDraft,
  WORKSHEET_DRAFT_STORAGE_KEY,
  type WorksheetDraftEnvelope,
} from "../draft";
import { createWorksheetEntryId } from "../ids";
import { localize } from "../i18n";
import {
  getCompatiblePaperSize,
  getWorksheetProfilePreset,
  worksheetProfilePresets,
} from "../profiles";
import {
  defaultWorksheetSettings,
  type PaperSize,
  type PracticeStrength,
  type StrokeOrderMode,
  type WorksheetEntry,
  type WorksheetDifficulty,
  type WorksheetMode,
  type WorksheetProfile,
  type WorksheetSettings,
  type WorksheetSnapshot,
} from "../types";
import type { HskLevel, HskSystem } from "../hsk";
import { HskPicker } from "./hsk-picker";
import { PublicPageShell } from "./site-shell";
import { WorksheetPaper } from "./worksheet-paper";

export const WORKSHEET_STORAGE_KEY = "gridhanzi:worksheet:v1";
export const LEGACY_WORKSHEET_STORAGE_KEY = "hanzisheets:worksheet:v1";

export function GeneratorClient({
  initialEntries,
  initialMode,
  initialProfile = "kids",
  initialDifficulty = "beginner",
  autoEnrich = false,
  pageTitle,
  pageDescription,
  breadcrumbLabel,
  templateTitle,
  templateChineseTitle,
  initialHskSystem,
  initialHskLevel,
}: {
  initialEntries: WorksheetEntry[];
  initialMode?: WorksheetMode;
  initialProfile?: WorksheetProfile;
  initialDifficulty?: WorksheetDifficulty;
  autoEnrich?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbLabel?: string;
  templateTitle?: string;
  templateChineseTitle?: string;
  initialHskSystem?: HskSystem;
  initialHskLevel?: HskLevel;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = (english: string, chinese: string) => localize(locale, english, chinese);
  const hasTemplate = Boolean(templateTitle && templateChineseTitle);
  const initialProfilePreset = getWorksheetProfilePreset(initialProfile);
  const [entries, setEntries] = useState(initialEntries);
  const [settings, setSettings] = useState<WorksheetSettings>({
    ...defaultWorksheetSettings,
    profile: initialProfile,
    cellSize: initialProfilePreset.size.default,
    grid: initialProfilePreset.defaultGrid,
    paperSize: initialProfilePreset.pageFormats[0] ?? "a4",
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
  const [pendingDraft, setPendingDraft] =
    useState<WorksheetDraftEnvelope | null>(null);
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const [message, setMessage] = useState(
    autoEnrich
      ? t("Filling in Hanzi and Pinyin…", "正在补全汉字和拼音…")
      : hasTemplate
        ? t(`${templateTitle} words loaded`, `已载入 ${templateTitle} 词表`)
        : t("Words loaded", "已载入词汇"),
  );
  const autoEnrichStarted = useRef(false);

  const completed = useMemo(
    () => entries.filter((entry) => entry.status === "complete").length,
    [entries],
  );
  const currentSnapshot = useMemo<WorksheetSnapshot>(
    () => ({ version: 2, entries, settings }),
    [entries, settings],
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
    setMessage(t("Filling in Hanzi and Pinyin…", "正在补全汉字和拼音…"));
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
        throw new Error(
          response.status === 429
            ? t(
                "Please wait a moment, then try again.",
                "操作太快了，请稍后再试。",
              )
            : payload.error ||
                t("Could not fill in this list.", "暂时无法补全这个词表。"),
        );
      }
      setEntries((current) =>
        payload.entries!.map((entry, index) => ({
          ...entry,
          id: current[index]?.id ?? createWorksheetEntryId(),
        })),
      );
      setMessage(
        payload.source === "gemini"
          ? t(
              "Words filled in. Check the results.",
              "内容已补全，请检查结果。",
            )
          : t(
              "We filled the words we know. Check any blank rows.",
              "已补全可识别的词，请检查空白项。",
            ),
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : t("Could not fill in this list.", "暂时无法补全这个词表。"),
      );
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

  useEffect(() => {
    try {
      const draft = parseWorksheetDraft(
        localStorage.getItem(WORKSHEET_DRAFT_STORAGE_KEY),
      );
      if (draft && !isSameWorksheetSnapshot(draft.snapshot, currentSnapshot)) {
        setPendingDraft(draft);
      } else if (draft) {
        setDraftSavedAt(draft.savedAt);
      }
    } catch {
      setDraftSavedAt(null);
    } finally {
      setDraftReady(true);
    }
    // Compare against the worksheet supplied by this page, once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!draftReady || pendingDraft) return;
    const timer = window.setTimeout(() => {
      try {
        const draft = createWorksheetDraft(currentSnapshot);
        localStorage.setItem(
          WORKSHEET_DRAFT_STORAGE_KEY,
          JSON.stringify(draft),
        );
        setDraftSavedAt(draft.savedAt);
      } catch {
        setDraftSavedAt(null);
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [currentSnapshot, draftReady, pendingDraft]);

  function restoreDraft() {
    if (!pendingDraft) return;
    setEntries(pendingDraft.snapshot.entries);
    setSettings(pendingDraft.snapshot.settings);
    setDraftSavedAt(pendingDraft.savedAt);
    setPendingDraft(null);
    setMessage(t("Worksheet restored from this device.", "已恢复此设备上的字帖草稿。"));
  }

  function discardDraft() {
    try {
      localStorage.removeItem(WORKSHEET_DRAFT_STORAGE_KEY);
    } finally {
      setPendingDraft(null);
      setDraftSavedAt(null);
      setMessage(t("Saved draft discarded.", "已放弃保存的草稿。"));
    }
  }

  function clearSavedDraft() {
    try {
      localStorage.removeItem(WORKSHEET_DRAFT_STORAGE_KEY);
    } finally {
      setDraftSavedAt(null);
      setMessage(t("Local draft cleared.", "本地草稿已清除。"));
    }
  }

  function addHskEntries(nextEntries: WorksheetEntry[]) {
    let addedCount = 0;
    let skippedCount = 0;

    setEntries((current) => {
      const existingHanzi = new Set(
        current
          .map((entry) => entry.hanzi.trim())
          .filter((value) => value.length > 0),
      );
      const acceptedEntries: WorksheetEntry[] = [];

      for (const entry of nextEntries) {
        const normalizedHanzi = entry.hanzi.trim();
        if (!normalizedHanzi || existingHanzi.has(normalizedHanzi)) {
          skippedCount += 1;
          continue;
        }

        existingHanzi.add(normalizedHanzi);
        acceptedEntries.push({
          ...entry,
          id: createWorksheetEntryId(),
          status: "complete",
        });
      }

      addedCount = acceptedEntries.length;
      return acceptedEntries.length > 0
        ? [...current, ...acceptedEntries]
        : current;
    });

    if (addedCount > 0 && skippedCount > 0) {
      setMessage(
        t(
          `Added ${addedCount} HSK words. Skipped ${skippedCount} duplicates already in your worksheet.`,
          `已加入 ${addedCount} 个 HSK 词条，并跳过了 ${skippedCount} 个当前字帖中的重复项。`,
        ),
      );
      return;
    }

    if (addedCount > 0) {
      setMessage(
        t(
          `Added ${addedCount} HSK words to your worksheet.`,
          `已把 ${addedCount} 个 HSK 词条加入当前字帖。`,
        ),
      );
      return;
    }

    setMessage(
      t(
        `All ${skippedCount} selected HSK words were already in your worksheet.`,
        `所选的 ${skippedCount} 个 HSK 词条都已存在于当前字帖中。`,
      ),
    );
  }

  function openPreview() {
    const snapshot: WorksheetSnapshot = {
      version: 2,
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
          <span>{breadcrumbLabel ?? t("Generator", "字帖生成器")}</span>
        </div>
        <h1 className="hs-display mt-4 text-4xl font-bold sm:text-5xl">
          {pageTitle ??
            t("Chinese Worksheet Generator", "中文汉字字帖生成器")}
        </h1>
        <p className="mt-2 text-[#566276]">
          {pageDescription ??
            t("Review your vocabulary, choose a practice style, and print.", "检查词汇，选择练习方式，然后下载或打印。")}
        </p>
        <div className="mt-6 flex max-w-3xl items-center gap-3 text-sm">
          <StepBadge complete label={t("Add words", "添加词汇")} number="1" />
          <span className="h-px flex-1 bg-[#d6cfc2]" />
          <StepBadge active label={t("Review & customize", "检查与设置")} number="2" />
          <span className="h-px flex-1 bg-[#d6cfc2]" />
          <StepBadge label={t("Print", "下载打印")} number="3" />
        </div>

        {pendingDraft ? (
          <section
            aria-label={t("Saved worksheet draft", "已保存的字帖草稿")}
            className="mt-5 flex flex-col gap-4 rounded border border-[#d8b67a] bg-[#fff8e8] p-4 shadow-[0_8px_24px_rgba(72,48,17,0.08)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-[#172942]">
                {t("Restore worksheet from this device?", "恢复此设备上的字帖草稿？")}
              </p>
              <p className="mt-1 text-sm leading-6 text-[#5f6877]">
                {t(
                  `${pendingDraft.snapshot.entries.length} rows saved ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(pendingDraft.savedAt)}.`,
                  `共 ${pendingDraft.snapshot.entries.length} 行，保存于 ${new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(pendingDraft.savedAt)}。`,
                )}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                className="hs-primary-button text-sm"
                onClick={restoreDraft}
              >
                {t("Restore worksheet", "恢复字帖")}
              </button>
              <button
                type="button"
                className="hs-secondary-button text-sm"
                onClick={discardDraft}
              >
                {t("Discard", "放弃")}
              </button>
            </div>
          </section>
        ) : null}

        <div className="mt-7 grid gap-4 xl:grid-cols-[275px_minmax(500px,1fr)_minmax(390px,0.78fr)]">
          <SettingsPanel settings={settings} setSettings={setSettings} />

          <section className="hs-card min-w-0 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="hs-display text-2xl font-bold">{t("Review your list", "检查词汇表")}</h2>
              <span className="flex items-center gap-1 text-sm font-medium text-[#237553]">
                {t(`${completed} words ready`, `${completed} 个词已完成`)} <Check className="size-4" />
              </span>
            </div>
            <div className="mt-4">
              <HskPicker
                currentEntries={entries}
                settings={settings}
                initialSystem={initialHskSystem}
                initialLevel={initialHskLevel}
                onAddEntries={addHskEntries}
              />
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
                  <p className="mt-3 text-xs font-semibold text-[#4f5d70]">
                    {t("Reorder or remove", "调整顺序或删除")}
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <IconButton
                      label={t("Move up", "上移")}
                      visibleLabel={t("Move up", "上移")}
                      onClick={() => moveEntry(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="size-4" />
                    </IconButton>
                    <IconButton
                      label={t("Move down", "下移")}
                      visibleLabel={t("Move down", "下移")}
                      onClick={() => moveEntry(index, 1)}
                      disabled={index === entries.length - 1}
                    >
                      <ArrowDown className="size-4" />
                    </IconButton>
                    <IconButton
                      label={t("Delete", "删除")}
                      visibleLabel={t("Delete", "删除")}
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
                {settings.paperSize === "tablet"
                  ? "Digital 3:4"
                  : settings.paperSize === "a4"
                    ? "A4 · Portrait"
                    : "US Letter · Portrait"}
              </span>
            </div>
            {entries.length > 0 ? (
              <div
                key={settings.profile}
                className="hs-profile-preview"
              >
                <WorksheetPaper
                  entries={entries}
                  settings={settings}
                  compact
                />
              </div>
            ) : (
              <div className="grid aspect-[210/297] place-items-center bg-white text-center text-sm text-[#657083]">
                {t("Add a vocabulary row to preview your worksheet.", "添加词汇后即可预览字帖。")}
              </div>
            )}
          </aside>
        </div>

        <GeneratorSupportSections />
      </main>

      <div className="hs-no-print fixed inset-x-0 bottom-0 z-40 border-t border-[#d8d0c2] bg-[#fffdf9]/96 backdrop-blur">
        <div className="hs-container flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-h-8 items-center gap-3 text-xs text-[#617084]">
            {draftSavedAt ? (
              <>
                <span className="flex items-center gap-1.5 text-[#237553]">
                  <Check className="size-3.5" />
                  {t("Saved locally", "已保存到本地")}
                </span>
                <button
                  type="button"
                  className="underline decoration-[#b7afa2] underline-offset-4 hover:text-[#b62822]"
                  onClick={clearSavedDraft}
                >
                  {t("Clear saved draft", "清除本地草稿")}
                </button>
              </>
            ) : (
              <span>{t("Autosaves on this device", "自动保存在此设备")}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
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
              {settings.profile === "tablet" ? (
                <Download className="size-4" />
              ) : (
                <Printer className="size-4" />
              )}
              {settings.profile === "tablet"
                ? t("Download 3:4 PDF", "下载 3:4 PDF")
                : t("Print / Save PDF", "下载 / 打印 PDF")}
            </button>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}

function GeneratorSupportSections() {
  return (
    <div className="mt-12 grid gap-10 pb-6">
      <section aria-labelledby="generator-steps-title">
        <p className="hs-kicker">Worksheet workflow</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="generator-steps-title"
              className="hs-display text-3xl font-bold"
            >
              How the Chinese worksheet generator works
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5b687a]">
              Start with English or Chinese vocabulary, review the generated
              Hanzi and Pinyin, then print the same list as a lesson page,
              handwriting practice sheet, or short recall test.
            </p>
          </div>
          <Link href="/templates" className="hs-secondary-button text-sm">
            Browse editable templates
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <SupportCard title="Paste a word list">
            Add English, Chinese, or mixed vocabulary. The editor keeps every
            row editable before you print.
          </SupportCard>
          <SupportCard title="Choose writing settings">
            Set the grid, cell size, Pinyin, stroke-order guidance, paper size,
            and practice mode for a Mandarin worksheet or Hanzi grid paper.
          </SupportCard>
          <SupportCard title="Preview and print">
            Check the live preview, open the full print page, then save a PDF or
            send the worksheet to a printer.
          </SupportCard>
        </div>
      </section>

      <section aria-labelledby="generator-settings-title">
        <p className="hs-kicker">Printable worksheet controls</p>
        <h2
          id="generator-settings-title"
          className="hs-display mt-2 text-3xl font-bold"
        >
          Worksheet settings teachers and parents expect
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Tian Zi Ge and Mi Zi Ge Hanzi grid paper",
            "Tracing, handwriting practice, and recall test modes",
            "Optional Pinyin and stroke-order guidance",
            "A4, US Letter, and tablet PDF formats",
          ].map((item) => (
            <div
              key={item}
              className="flex min-h-24 items-start gap-3 rounded border border-[#ded7ca] bg-[#fffefa] p-4"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-[#25815d]" />
              <p className="text-sm leading-6 text-[#4f5d70]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="generator-examples-title">
        <p className="hs-kicker">Example worksheets</p>
        <h2
          id="generator-examples-title"
          className="hs-display mt-2 text-3xl font-bold"
        >
          Examples you can generate and edit
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Family practice sheet", "/generator?template=family"],
            ["Numbers writing worksheet", "/generator?template=numbers"],
            ["Colors practice sheet", "/generator?template=colors"],
            ["HSK 1 writing practice", "/generator?template=hsk-1"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="group flex min-h-24 items-center justify-between gap-4 rounded border border-[#ded7ca] bg-white p-4 font-semibold text-[#172942] transition hover:border-[#b62822]"
            >
              <span>{label}</span>
              <Sparkles className="size-4 shrink-0 text-[#b62822] transition group-hover:scale-110" />
            </Link>
          ))}
        </div>
      </section>

      <section
        id="generator-faq"
        aria-labelledby="generator-faq-title"
        className="pb-8"
      >
        <p className="hs-kicker">Generator FAQ</p>
        <h2
          id="generator-faq-title"
          className="hs-display mt-2 text-3xl font-bold"
        >
          Chinese worksheet generator questions
        </h2>
        <div className="mt-5 divide-y divide-[#ded7ca] rounded border border-[#ded7ca] bg-white">
          {[
            [
              "What does the Chinese worksheet generator create?",
              "It creates editable Mandarin and Chinese writing worksheets with Hanzi, Pinyin, English meanings, tracing grids, blank writing cells, Hanzi grid paper, optional stroke-order guidance, and PDF output.",
            ],
            [
              "Can I paste English words into the worksheet generator?",
              "Yes. Paste English or Chinese vocabulary, review the filled Hanzi and Pinyin, edit every row, and print the final worksheet.",
            ],
            [
              "Does the worksheet generator include stroke order?",
              "Yes. You can show stroke-order guidance on worksheet rows and use the stroke-order tool to check a character before printing.",
            ],
            [
              "Can I make Mandarin practice sheets and Hanzi grid paper?",
              "Yes. The generator works as a Mandarin worksheet generator and lets you print Tian Zi Ge or Mi Zi Ge Hanzi grid paper for Chinese character practice.",
            ],
          ].map(([question, answer]) => (
            <details key={question} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold text-[#172942]">
                {question}
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5b687a]">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function SupportCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded border border-[#ded7ca] bg-white p-5">
      <h3 className="hs-display text-lg font-bold text-[#172942]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#5b687a]">{children}</p>
    </article>
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

  function selectProfile(profile: WorksheetProfile) {
    const preset = getWorksheetProfilePreset(profile);
    setSettings((current) => ({
      ...current,
      profile,
      cellSize: preset.size.default,
      grid: preset.defaultGrid,
      paperSize: getCompatiblePaperSize(profile, current.paperSize),
    }));
  }

  const profilePreset = getWorksheetProfilePreset(settings.profile);

  return (
    <aside className="hs-card self-start p-4 xl:sticky xl:top-20 xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto">
      <SettingSection title={t("Writing profile", "书写模板")}>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(worksheetProfilePresets).map((preset) => (
            <button
              type="button"
              key={preset.id}
              aria-pressed={settings.profile === preset.id}
              onClick={() => selectProfile(preset.id)}
              className={cn(
                "rounded border p-2.5 text-left transition",
                settings.profile === preset.id
                  ? "border-[#bd2923] bg-[#fff3ef] shadow-[inset_0_0_0_1px_#bd2923]"
                  : "border-[#d5cdbf] bg-white hover:border-[#ad9f8b]",
              )}
            >
              <strong className="block text-sm text-[#172942]">
                {preset.label}
              </strong>
              <span className="mt-1 block text-[0.65rem] leading-4 text-[#657083]">
                {preset.writingTool}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[0.68rem] leading-4 text-[#657083]">
          {profilePreset.description}
        </p>
      </SettingSection>
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
      {settings.mode !== "quiz" ? (
        <>
          <SettingSection title={t("Practice strength", "练习引导强度")}>
            <Segmented
              value={settings.practiceStrength}
              options={[
                ["guided", t("Guided", "引导")],
                ["balanced", t("Balanced", "均衡")],
                ["independent", t("Independent", "独立")],
              ]}
              onChange={(practiceStrength) =>
                patch({ practiceStrength: practiceStrength as PracticeStrength })
              }
            />
          </SettingSection>
          <SettingSection title={t("Extra blank row", "额外空白行")}>
            <Segmented
              value={String(settings.extraBlankRows)}
              options={[
                ["0", t("Off", "关闭")],
                ["1", t("Add one", "增加一行")],
              ]}
              onChange={(extraBlankRows) =>
                patch({ extraBlankRows: extraBlankRows === "1" ? 1 : 0 })
              }
            />
          </SettingSection>
        </>
      ) : null}
      <SettingSection
        title={t(
          `Cell size · ${settings.cellSize}${profilePreset.size.unit}`,
          `格子尺寸 · ${settings.cellSize}${profilePreset.size.unit}`,
        )}
      >
        <input
          type="range"
          aria-label="Cell size"
          min={profilePreset.size.min}
          max={profilePreset.size.max}
          step={profilePreset.size.step}
          value={settings.cellSize}
          onChange={(event) =>
            patch({ cellSize: Number(event.target.value) })
          }
          className="w-full accent-[#bd2923]"
        />
        <div className="mt-1 flex justify-between text-[0.65rem] text-[#657083]">
          <span>
            {profilePreset.size.min}
            {profilePreset.size.unit}
          </span>
          <span>{profilePreset.writingTool}</span>
          <span>
            {profilePreset.size.max}
            {profilePreset.size.unit}
          </span>
        </div>
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
        {settings.mode === "trace" ? (
          <div className="mt-3">
            <span className="mb-2 block text-xs font-semibold text-[#455367]">
              {t("Stroke order", "笔顺")}
            </span>
            <Segmented
              value={settings.strokeOrderMode}
              options={[
                ["detailed", t("Detailed", "详细")],
                ["compact", t("Compact", "精简")],
                ["off", t("Off", "关闭")],
              ]}
              onChange={(strokeOrderMode) =>
                patch({
                  strokeOrderMode: strokeOrderMode as StrokeOrderMode,
                  showStrokeOrder: strokeOrderMode !== "off",
                })
              }
            />
          </div>
        ) : null}
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
          options={profilePreset.pageFormats.map((paper) => [
            paper,
            paper === "tablet"
              ? "Digital · 3:4"
              : paper === "a4"
                ? "A4"
                : "US Letter",
          ])}
          onChange={(paperSize) =>
            patch({ paperSize: paperSize as PaperSize })
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
  visibleLabel,
  onClick,
  disabled,
  children,
}: {
  label: string;
  visibleLabel?: string;
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
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded border border-[#ded7ca] text-[#526074] hover:bg-[#f3eee4] disabled:opacity-25 md:min-h-8 md:min-w-8 md:border-0",
        visibleLabel && "w-full px-2 text-xs font-semibold",
      )}
    >
      {children}
      {visibleLabel ? <span>{visibleLabel}</span> : null}
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
