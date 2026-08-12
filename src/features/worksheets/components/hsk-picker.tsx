"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  Check,
  ChevronDown,
  LoaderCircle,
  RefreshCw,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { HskCatalogEntry, HskLevel, HskSystem } from "../hsk";
import {
  HSK_CURATED_THEME_IDS,
  HSK_PICKER_STORAGE_KEY,
  createHskPickerState,
  getHskLevels,
  parseHskPickerState,
  type HskPickerState,
} from "../hsk-picker-state";
import { localize } from "../i18n";
import type { WorksheetEntry, WorksheetSettings } from "../types";

type HskRuntime = typeof import("../hsk");

const MAX_VISIBLE_RESULTS = 120;

const THEME_LABELS: Record<string, [string, string]> = {
  "hsk-3-apartment-home": ["Apartment and home", "家与公寓"],
  "hsk-3-campus-life": ["Campus life", "校园生活"],
  "hsk-3-exams-grades": ["Exams and grades", "考试与成绩"],
  "hsk-3-health": ["Health", "健康"],
  "hsk-3-office-teamwork": ["Office and teamwork", "办公室与协作"],
  "hsk-3-shopping-money": ["Shopping and money", "购物与金钱"],
  "hsk-3-technology": ["Technology", "科技"],
};

function buildInitialState(
  initialSystem?: HskSystem,
  initialLevel?: HskLevel,
): HskPickerState {
  return createHskPickerState({
    system: initialSystem,
    level: initialLevel,
  });
}

export function HskPicker({
  currentEntries,
  settings,
  initialSystem,
  initialLevel,
  onAddEntries,
}: {
  currentEntries: WorksheetEntry[];
  settings: WorksheetSettings;
  initialSystem?: HskSystem;
  initialLevel?: HskLevel;
  onAddEntries: (entries: WorksheetEntry[]) => void;
}) {
  const locale = useLocale();
  const t = (english: string, chinese: string) => localize(locale, english, chinese);
  const fallbackState = buildInitialState(initialSystem, initialLevel);
  const [isOpen, setIsOpen] = useState(false);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [loadError, setLoadError] = useState("");
  const [catalogRuntime, setCatalogRuntime] = useState<HskRuntime | null>(null);
  const [state, setState] = useState<HskPickerState>(() => {
    if (typeof window === "undefined") return fallbackState;
    return parseHskPickerState(
      window.localStorage.getItem(HSK_PICKER_STORAGE_KEY),
      { fallbackState },
    );
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(HSK_PICKER_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage write failures so the picker remains usable.
    }
  }, [state]);

  async function ensureCatalogLoaded(forceReload = false) {
    if (catalogRuntime && !forceReload) return;
    if (loadState === "loading" && !forceReload) return;

    setLoadState("loading");
    setLoadError("");

    try {
      const module = await import("../hsk");
      const validIds = new Set(module.hskCatalog.map((entry) => entry.id));
      const validThemes = new Set(HSK_CURATED_THEME_IDS);
      setCatalogRuntime(module);
      setState((current) =>
        parseHskPickerState(JSON.stringify(current), {
          validIds,
          validThemes,
          fallbackState,
        }),
      );
      setLoadState("ready");
    } catch (error) {
      setLoadState("error");
      setLoadError(
        error instanceof Error
          ? error.message
          : "The HSK list could not be loaded.",
      );
    }
  }

  const catalogEntriesById = useMemo(() => {
    if (!catalogRuntime) return new Map<string, HskCatalogEntry>();
    return new Map(catalogRuntime.hskCatalog.map((entry) => [entry.id, entry]));
  }, [catalogRuntime]);

  const filteredEntries = useMemo(() => {
    if (!catalogRuntime) return [] as HskCatalogEntry[];
    return catalogRuntime.filterHskCatalog({
      system: state.system,
      level: state.level,
      query: state.query,
      theme: state.theme || undefined,
    });
  }, [catalogRuntime, state.level, state.query, state.system, state.theme]);

  const selectedEntries = useMemo(
    () =>
      state.selectedIds
        .map((id) => catalogEntriesById.get(id))
        .filter((entry): entry is HskCatalogEntry => Boolean(entry)),
    [catalogEntriesById, state.selectedIds],
  );

  const selectedSummary = useMemo(() => {
    if (!catalogRuntime || selectedEntries.length === 0) {
      return { wordCount: 0, uniqueHanziCount: 0, estimatedPageCount: 0 };
    }
    return catalogRuntime.summarizeHskSelection(selectedEntries, settings);
  }, [catalogRuntime, selectedEntries, settings]);

  const currentHanziSet = useMemo(
    () =>
      new Set(
        currentEntries
          .map((entry) => entry.hanzi.trim())
          .filter((value) => value.length > 0),
      ),
    [currentEntries],
  );

  const duplicateCount = useMemo(
    () =>
      selectedEntries.filter((entry) => currentHanziSet.has(entry.hanzi.trim()))
        .length,
    [currentHanziSet, selectedEntries],
  );

  const visibleEntries = useMemo(
    () => filteredEntries.slice(0, MAX_VISIBLE_RESULTS),
    [filteredEntries],
  );

  const themeOptions = useMemo(
    () =>
      HSK_CURATED_THEME_IDS.map((themeId) => ({
        value: themeId,
        label: t(
          THEME_LABELS[themeId]?.[0] ?? themeId,
          THEME_LABELS[themeId]?.[1] ?? themeId,
        ),
      })),
    [t],
  );

  function toggleSelection(entryId: string) {
    setState((current) => {
      const nextSelected = current.selectedIds.includes(entryId)
        ? current.selectedIds.filter((id) => id !== entryId)
        : [...current.selectedIds, entryId];
      return createHskPickerState({
        ...current,
        selectedIds: nextSelected,
      });
    });
  }

  function handleSystemChange(system: HskSystem) {
    setState((current) =>
      createHskPickerState({
        ...current,
        system,
        level: current.level,
        theme: system === "3.0" ? current.theme : "",
        selectedIds: [],
      }),
    );
  }

  function handleLevelChange(level: HskLevel) {
    setState((current) =>
      createHskPickerState({
        ...current,
        level,
      }),
    );
  }

  function handleQueryChange(query: string) {
    setState((current) =>
      createHskPickerState({
        ...current,
        query,
      }),
    );
  }

  function handleThemeChange(theme: string) {
    setState((current) =>
      createHskPickerState({
        ...current,
        theme,
      }),
    );
  }

  function selectFiltered() {
    setState((current) => {
      const nextSelected = new Set(current.selectedIds);
      for (const entry of filteredEntries) {
        nextSelected.add(entry.id);
      }
      return createHskPickerState({
        ...current,
        selectedIds: [...nextSelected],
      });
    });
  }

  function clearSelected() {
    setState((current) =>
      createHskPickerState({
        ...current,
        selectedIds: [],
      }),
    );
  }

  function addSelectedToWorksheet() {
    if (!catalogRuntime || selectedEntries.length === 0) return;

    onAddEntries(catalogRuntime.toWorksheetEntries(selectedEntries));
  }

  return (
    <section className="mb-5 rounded border border-[#ded7ca] bg-[#fffefa] p-4 shadow-[0_8px_24px_rgba(52,40,20,0.04)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="hs-kicker">{t("HSK picker", "HSK 选择器")}</p>
          <h3 className="hs-display mt-1 text-2xl font-bold">
            {t("Choose from HSK", "从 HSK 词表选择")}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#5c6878]">
            {t(
              "Browse a source-labeled community HSK list, then add versioned rows into the worksheet editor without replacing your current draft.",
              "浏览带来源与版本标识的社区 HSK 词表，并把选中的词条追加到当前字帖草稿中。",
            )}
          </p>
        </div>
        <button
          type="button"
          className="hs-secondary-button shrink-0 text-sm"
          aria-expanded={isOpen}
          onClick={() => {
            const nextOpen = !isOpen;
            setIsOpen(nextOpen);
            if (nextOpen) {
              void ensureCatalogLoaded();
            }
          }}
        >
          {isOpen ? t("Hide HSK picker", "收起 HSK 选择器") : t("Open HSK picker", "打开 HSK 选择器")}
          <ChevronDown className={cn("size-4 transition", isOpen && "rotate-180")} />
        </button>
      </div>

      {isOpen ? (
        <div className="mt-4 space-y-4 border-t border-[#e5dfd4] pt-4">
          <div className="rounded border border-[#d9e2ea] bg-[#f7fafc] p-3 text-sm text-[#4f6177]">
            <p className="font-semibold text-[#20314c]">
              {t("Version note", "版本说明")}
            </p>
            <p className="mt-1 leading-6">
              {t(
                "HSK 3.0 still runs in 2026 global trials. This picker labels the worksheet list by version, but it does not claim that HSK 3.0 has fully replaced HSK 2.0 everywhere.",
                "截至 2026 年，HSK 3.0 仍处于全球试行阶段。这里会按版本标注词表，但不表示 HSK 3.0 已在所有场景全面取代 HSK 2.0。",
              )}
            </p>
            <p className="mt-1 leading-6">
              {t(
                "Source: a community-maintained HSK vocabulary catalogue with worksheet theme labels.",
                "来源：社区维护的 HSK 词汇目录，并补充了字帖主题标签。",
              )}
            </p>
          </div>

          {loadState === "loading" ? (
            <div className="flex items-center gap-2 rounded border border-[#d8e1e8] bg-white p-4 text-sm text-[#4f6177]">
              <LoaderCircle className="size-4 animate-spin" />
              {t("Loading the HSK catalogue…", "正在加载 HSK 词表……")}
            </div>
          ) : null}

          {loadState === "error" ? (
            <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">
                {t("The HSK list could not be loaded.", "HSK 词表加载失败。")}
              </p>
              <p className="mt-1 break-all">{loadError}</p>
              <button
                type="button"
                className="hs-secondary-button mt-3 text-sm"
                onClick={() => void ensureCatalogLoaded(true)}
              >
                <RefreshCw className="size-4" />
                {t("Retry", "重试")}
              </button>
            </div>
          ) : null}

          {loadState === "ready" && catalogRuntime ? (
            <>
              <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr]">
                <div className="rounded border border-[#e3ddd2] bg-white p-3">
                  <p className="text-sm font-semibold text-[#21314a]">
                    {t("Version", "版本")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["2.0", "3.0"] as HskSystem[]).map((system) => (
                      <button
                        key={system}
                        type="button"
                        className={cn(
                          "rounded-full border px-3 py-2 text-sm font-semibold transition",
                          state.system === system
                            ? "border-[#b62822] bg-[#fff2ef] text-[#a3201b]"
                            : "border-[#d9d2c6] bg-[#fffdfa] text-[#4d5c71]",
                        )}
                        onClick={() => handleSystemChange(system)}
                      >
                        {`HSK ${system}`}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="rounded border border-[#e3ddd2] bg-white p-3 text-sm font-semibold text-[#21314a]">
                  {t("Level", "等级")}
                  <select
                    value={state.level}
                    onChange={(event) => handleLevelChange(event.target.value as HskLevel)}
                    className="mt-3 h-11 w-full rounded border border-[#d5cec1] bg-white px-3 font-normal"
                  >
                    {getHskLevels(state.system).map((level) => (
                      <option key={level} value={level}>
                        {state.system === "3.0" && level === "7-9"
                          ? t("Levels 7-9", "7-9 级")
                          : t(`Level ${level}`, `Level ${level}`)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded border border-[#e3ddd2] bg-white p-3 text-sm font-semibold text-[#21314a]">
                  {t("Theme", "主题")}
                  <select
                    value={state.theme}
                    onChange={(event) => handleThemeChange(event.target.value)}
                    disabled={state.system !== "3.0"}
                    className="mt-3 h-11 w-full rounded border border-[#d5cec1] bg-white px-3 font-normal disabled:cursor-not-allowed disabled:bg-[#f5f2eb] disabled:text-[#8a94a5]"
                  >
                    <option value="">{t("All themes", "全部主题")}</option>
                    {themeOptions.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block rounded border border-[#e3ddd2] bg-white p-3 text-sm font-semibold text-[#21314a]">
                {t("Search Hanzi, Pinyin, or meaning", "搜索汉字、拼音或释义")}
                <span className="relative mt-3 block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7a8699]" />
                  <input
                    value={state.query}
                    onChange={(event) => handleQueryChange(event.target.value)}
                    placeholder={t("Try 爱, ai, family, campus…", "试试 爱、ai、family、campus……")}
                    className="h-11 w-full rounded border border-[#d5cec1] bg-white pl-9 pr-3 font-normal"
                  />
                </span>
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-[#e3ddd2] bg-[#fbf8f2] px-3 py-3 text-sm text-[#4d5c71]">
                <span>
                  {t(
                    `${filteredEntries.length} filtered words`,
                    `筛出 ${filteredEntries.length} 个词`,
                  )}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="hs-secondary-button text-sm"
                    onClick={selectFiltered}
                    disabled={filteredEntries.length === 0}
                  >
                    {t("Select filtered", "选择当前筛选")}
                  </button>
                  <button
                    type="button"
                    className="hs-secondary-button text-sm"
                    onClick={clearSelected}
                    disabled={state.selectedIds.length === 0}
                  >
                    {t("Clear selected", "清空已选")}
                  </button>
                </div>
              </div>

              <div
                aria-live="polite"
                className="grid gap-3 rounded border border-[#e3ddd2] bg-white p-3 sm:grid-cols-3"
              >
                <SummaryBlock
                  label={t("Selected words", "已选词条")}
                  value={selectedSummary.wordCount}
                />
                <SummaryBlock
                  label={t("Unique Hanzi", "去重汉字")}
                  value={selectedSummary.uniqueHanziCount}
                />
                <SummaryBlock
                  label={t("Estimated pages", "预估页数")}
                  value={selectedSummary.estimatedPageCount}
                />
              </div>

              {duplicateCount > 0 ? (
                <p className="text-sm text-amber-700">
                  {t(
                    `${duplicateCount} selected words already exist in the worksheet. They will be skipped when you add them.`,
                    `有 ${duplicateCount} 个已选词条已在当前字帖中，追加时会自动跳过。`,
                  )}
                </p>
              ) : null}

              <div className="rounded border border-[#e3ddd2] bg-white">
                <div className="flex items-center justify-between border-b border-[#ebe5d9] px-3 py-3 text-sm font-semibold text-[#21314a]">
                  <span>{t("Matching words", "匹配词条")}</span>
                  {filteredEntries.length > visibleEntries.length ? (
                    <span className="text-xs font-normal text-[#667487]">
                      {t(
                        `Showing the first ${visibleEntries.length} results`,
                        `当前显示前 ${visibleEntries.length} 条`,
                      )}
                    </span>
                  ) : null}
                </div>
                {visibleEntries.length > 0 ? (
                  <div className="max-h-[28rem] overflow-y-auto">
                    {visibleEntries.map((entry) => {
                      const selected = state.selectedIds.includes(entry.id);
                      return (
                        <label
                          key={entry.id}
                          className="flex cursor-pointer items-start gap-3 border-t border-[#f0eadf] px-3 py-3 first:border-t-0"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelection(entry.id)}
                            className="mt-1 size-4 rounded border-[#b6bdc7]"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-serif text-lg text-[#1e2e47]">
                                {entry.hanzi}
                              </span>
                              <span className="text-sm text-[#607185]">
                                {entry.pinyin}
                              </span>
                              <span className="rounded-full bg-[#f4efe6] px-2 py-0.5 text-xs font-semibold text-[#6a5b3f]">
                                {`HSK ${entry.system} · ${entry.level}`}
                              </span>
                              {entry.themes[0] ? (
                                <span className="rounded-full bg-[#edf4fb] px-2 py-0.5 text-xs font-semibold text-[#325377]">
                                  {t(
                                    THEME_LABELS[entry.themes[0]]?.[0] ?? entry.themes[0],
                                    THEME_LABELS[entry.themes[0]]?.[1] ?? entry.themes[0],
                                  )}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 text-sm leading-6 text-[#4d5c71]">
                              {entry.english}
                            </p>
                          </div>
                          {selected ? (
                            <span className="mt-1 text-[#227654]">
                              <Check className="size-4" />
                            </span>
                          ) : null}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="px-3 py-4 text-sm text-[#667487]">
                    {t(
                      "No words match this filter yet. Try another search, level, or theme.",
                      "当前筛选下没有结果，试试其他搜索词、等级或主题。",
                    )}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#607185]">
                  {t(
                    "Selected rows are added after your current worksheet list and keep your existing draft intact.",
                    "已选词条会追加到当前词汇表之后，不会替换现有草稿。",
                  )}
                </p>
                <button
                  type="button"
                  className="hs-primary-button text-sm"
                  disabled={selectedEntries.length === 0}
                  onClick={addSelectedToWorksheet}
                >
                  {t("Add selected to worksheet", "把已选词条加入字帖")}
                </button>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function SummaryBlock({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded border border-[#eee6d8] bg-[#fffdfa] px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a8699]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[#1f2f48]">{value}</p>
    </div>
  );
}
