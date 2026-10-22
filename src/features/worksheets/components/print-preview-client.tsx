"use client";
import { trackWorksheetEvent } from "../analytics";
import { RepeatFillControl } from "./repeat-fill-control";
import { WorksheetHelp, type HelpPanel } from "./worksheet-help";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import {
  ArrowLeft,
  Download,
  Info,
  LoaderCircle,
  Printer,
} from "lucide-react";

import { Link } from "@/core/i18n/navigation";

import {
  defaultWorksheetSettings,
  type WorksheetSnapshot,
} from "../types";
import type { PaperSize, PrintMargin } from "../types";
import { downloadWorksheetPdf, type PdfExportProgress } from "../pdf";
import { localize } from "../i18n";
import { getWorksheetProfilePreset } from "../profiles";
import { normalizeWorksheetSnapshot } from "../snapshot";
import {
  LEGACY_WORKSHEET_STORAGE_KEY,
  WORKSHEET_STORAGE_KEY,
} from "./generator-client";
import { WorksheetRenderer } from "./worksheet-renderer";

const fallbackSnapshot: WorksheetSnapshot = {
  version: 3,
  entries: [],
  settings: {
    ...defaultWorksheetSettings,
    title: "My Chinese Worksheet",
    date: "",
  },
};

export function PrintPreviewClient({ templateSnapshot, templateSlug }: {
  templateSnapshot?: WorksheetSnapshot;
  templateSlug?: string;
} = {}) {
  const printPagesRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = (english: string, chinese: string) => localize(locale, english, chinese);
  const [snapshot, setSnapshot] = useState(templateSnapshot ?? fallbackSnapshot);
  const [zoom, setZoom] = useState(85);
  const [pageCount, setPageCount] = useState(1);
  const [showAnswers, setShowAnswers] = useState(true);
  const [backgroundGraphics, setBackgroundGraphics] = useState(true);
  const [paperSize, setPaperSize] = useState<PaperSize>(
    templateSnapshot?.settings.paperSize ?? fallbackSnapshot.settings.paperSize,
  );
  const [printMargin, setPrintMargin] = useState<PrintMargin>(
    templateSnapshot?.settings.printMargin ?? fallbackSnapshot.settings.printMargin,
  );
  const [pdfProgress, setPdfProgress] = useState<PdfExportProgress | null>(null);
  const exportController = useRef<AbortController | null>(null);
  const [pdfNotice, setPdfNotice] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [downloads, setDownloads] = useState(0);
  const [helpPanel, setHelpPanel] = useState<HelpPanel>(null);
  const [previewReady, setPreviewReady] = useState(Boolean(templateSnapshot));
  const [loadError, setLoadError] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const profilePreset = getWorksheetProfilePreset(snapshot.settings.profile);
  const canShowAnswers = snapshot.settings.output === "worksheet";
  const isTablet = paperSize === "tablet";

  useEffect(() => () => {
    exportController.current?.abort();
    exportController.current = null;
  }, []);

  function cancelExport() {
    exportController.current?.abort();
  }

  function printWorksheet() {
    cancelExport();
    // Allow the cancelled capture's finally block to remove temporary pages first.
    setTimeout(() => window.print(), 0);
  }

  useEffect(() => {
    if (templateSnapshot) return;
    try {
      const saved =
        sessionStorage.getItem(WORKSHEET_STORAGE_KEY) ??
        sessionStorage.getItem(LEGACY_WORKSHEET_STORAGE_KEY);
      if (!saved) {
        setLoadError(true);
        return;
      }
      const parsed = JSON.parse(saved) as unknown;
      const normalized = normalizeWorksheetSnapshot(parsed);
      if (normalized.entries.length > 0) {
        setSnapshot(normalized);
        setPaperSize(normalized.settings.paperSize);
        setPrintMargin(normalized.settings.printMargin);
        setPreviewReady(true);

        try {
          sessionStorage.setItem(WORKSHEET_STORAGE_KEY, JSON.stringify(normalized));
          sessionStorage.removeItem(LEGACY_WORKSHEET_STORAGE_KEY);
        } catch {
          setStorageWarning(true);
        }
      } else {
        setLoadError(true);
      }
    } catch {
      setLoadError(true);
    }
  }, [templateSnapshot]);

  const printSettings = {
    ...snapshot.settings,
    paperSize,
    printMargin,
    showStrokeOrder:
      canShowAnswers && showAnswers && snapshot.settings.showStrokeOrder,
  };
  useEffect(() => {
    if (!previewReady || templateSnapshot) return;
    try {
      sessionStorage.setItem(WORKSHEET_STORAGE_KEY, JSON.stringify({
        ...snapshot, settings: { ...snapshot.settings, paperSize, printMargin },
      }));
    } catch {
      setStorageWarning(true);
    }
  }, [snapshot, paperSize, printMargin, previewReady, templateSnapshot]);

  async function handlePdfDownload() {
    if (exportController.current) return;
    const controller = new AbortController();
    exportController.current = controller;
    const pageElements = Array.from(
      printPagesRef.current?.querySelectorAll<HTMLElement>(".hs-paper") ?? [],
    );
    trackWorksheetEvent("worksheet_download_start", snapshot.settings, snapshot.entries.length);
    setPdfError("");
    setPdfNotice("");
    setPdfProgress({ current: 0, total: pageElements.length, stage: "preparing" });

    try {
      await downloadWorksheetPdf({
        pages: pageElements,
        paperSize,
        output: snapshot.settings.output,
        title: snapshot.settings.title,
        studentName: snapshot.settings.studentName,
        date: snapshot.settings.date,
        locale,
        onProgress: setPdfProgress,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      trackWorksheetEvent("worksheet_download_success", snapshot.settings, snapshot.entries.length);
      setDownloads(value => value + 1);
    } catch (error) {
      if (exportController.current !== controller) return;
      if (controller.signal.aborted) {
        setPdfNotice(t("PDF creation cancelled. Your worksheet is unchanged. You can print or try again.", "已取消生成 PDF，字帖未更改。可以直接打印或重新下载。"));
        return;
      }
      trackWorksheetEvent("worksheet_download_failure", snapshot.settings, snapshot.entries.length);
      setPdfError(
        error instanceof Error && !locale.startsWith("zh")
          ? error.message
          : t("The PDF could not be created. Try Print instead.", "无法生成 PDF，请尝试打印。"),
      );
    } finally {
      if (exportController.current === controller) {
        exportController.current = null;
        setPdfProgress(null);
      }
    }
  }

  if (!previewReady) {
    return (
      <main className="min-h-screen bg-[#eeeeec] px-6 py-16 text-[#14253f]">
        <div className="hs-card mx-auto max-w-xl p-6">
          <p role={loadError ? "alert" : "status"}>
            {loadError
              ? t("Could not load your worksheet. Return to the editor and open the preview again. Your browser may be blocking site storage.", "无法载入字帖，请返回编辑器重新打开预览。浏览器可能限制了网站存储。")
              : t("Loading your worksheet…", "正在载入字帖……")}
          </p>
          <Link href="/generator" className="hs-secondary-button mt-5">
            {t("Back to editor", "返回编辑器")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeeec] text-[#14253f]">
      <header className="hs-no-print sticky top-0 z-40 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#d6d6d3] bg-[#fffdf9] px-4 py-2">
        <Link href={templateSlug ? `/generator?template=${templateSlug}` : "/generator?resume=1"} className="flex items-center gap-2 font-semibold">
          <ArrowLeft className="size-5" /> {t("Back to editor", "返回编辑器")}
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <ToolbarSelect
            disabled={pdfProgress !== null}
            label={t("Paper size", "纸张尺寸")}
            value={paperSize}
            options={(snapshot.settings.output === "flashcards"
              ? (["a4", "letter"] as const)
              : profilePreset.pageFormats
            ).map(
              (paper) =>
                [
                  paper,
                  paper === "tablet"
                    ? "Digital · 3:4"
                    : paper === "a4"
                      ? "A4"
                      : t("US Letter", "美式信纸"),
                ] as [string, string],
            )}
            onChange={(value) => setPaperSize(value as PaperSize)}
          />
          <ToolbarChip
            label={isTablet ? t("Tablet PDF · 3:4", "平板 PDF · 3:4") : t("Portrait", "纵向")}
          />
          <ToolbarChip
            label={t(
              pageCount ? `${pageCount} ${pageCount === 1 ? "page" : "pages"}` : "Calculating pages…",
              pageCount ? `${pageCount} 页` : "正在计算页数……",
            )}
          />
          <label className="flex h-10 items-center gap-2 rounded border border-[#d5d1c9] bg-white px-2 text-sm">
            <span className="sr-only">{t("Preview zoom", "预览缩放")}</span>
            <select
              aria-label={t("Preview zoom", "预览缩放")}
              disabled={pdfProgress !== null}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="h-full bg-transparent outline-none"
            >
              {[55, 65, 75, 85, 95, 105, 115].map((value) => (
                <option key={value} value={value}>{value}%</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex gap-2">
          {!isTablet ? (
            <button
              type="button"
              className="hs-secondary-button"
              disabled={pageCount === 0}
              onClick={printWorksheet}
            >
              <Printer className="size-4" /> {t("Print", "打印")}
            </button>
          ) : null}
          <button
            type="button"
            className="hs-primary-button"
            onClick={handlePdfDownload}
            disabled={pdfProgress !== null || pageCount === 0}
          >
            {pdfProgress ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {pdfProgress
              ? pdfProgress.stage === "preparing"
                ? t("Preparing PDF…", "正在准备 PDF……")
                : pdfProgress.stage === "saving"
                ? t("Saving PDF…", "正在保存 PDF……")
                : t(
                  `Creating ${Math.max(1, pdfProgress.current)}/${Math.max(1, pdfProgress.total)}`,
                  `正在生成 ${Math.max(1, pdfProgress.current)}/${Math.max(1, pdfProgress.total)}`,
                )
              : isTablet
                ? t("Download 3:4 PDF", "下载 3:4 PDF")
                : t("Download PDF", "下载 PDF")}
          </button>
        </div>
      </header>

      {(pdfProgress || pdfError || pdfNotice) ? (
        <section className="hs-no-print border-b border-[#d6d6d3] bg-[#fffdf9] px-4 py-3">
          {pdfProgress ? (
            <div className="flex flex-wrap items-center gap-3" role="status" aria-live="polite">
              <p className="text-sm">{t("Creating your PDF. You can cancel or use Print without losing your worksheet.", "正在生成 PDF，可随时取消或改用打印，字帖不会丢失。")}</p>
              <button type="button" className="hs-secondary-button text-sm" onClick={cancelExport}>
                {t("Cancel PDF", "取消生成 PDF")}
              </button>
            </div>
          ) : null}
          {pdfError ? (
            <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <p>{pdfError}</p>
              <p className="mt-1">{t("Your worksheet is still here. Try downloading again, or use your browser's Print dialog to save as PDF.", "字帖仍保留在当前页面。可以重新下载，或在浏览器打印窗口中选择另存为 PDF。")}</p>
              <button type="button" className="hs-secondary-button mt-2" onClick={printWorksheet}>
                {t("Print / Save as PDF instead", "改用打印 / 另存为 PDF")}
              </button>
              <button type="button" className="ml-3 mt-2 min-h-11 underline" onClick={() => setHelpPanel("pdf-error")}>
                {t("Still stuck? Get help", "仍然无法完成？查看帮助")}
              </button>
            </div>
          ) : null}
          {pdfNotice ? <p role="status" className="text-sm">{pdfNotice}</p> : null}
        </section>
      ) : null}

      <WorksheetHelp panel={helpPanel} onPanelChange={setHelpPanel} downloads={downloads} templateSlug={templateSlug} isWorksheet={canShowAnswers} onPrint={printWorksheet} busy={pdfProgress !== null} failed={Boolean(pdfError)} />

      <div className="hs-print-layout grid min-h-[calc(100vh-4rem)] md:grid-cols-[220px_minmax(0,1fr)_310px]">
        <aside className="hs-no-print hidden border-r border-[#d4d4d0] bg-[#f9f8f5] p-5 md:block">
          {Array.from({ length: pageCount }, (_, pageIndex) => (
            <Thumbnail
              key={pageIndex}
              label={t(`Page ${pageIndex + 1}`, `第 ${pageIndex + 1} 页`)}
              selected={pageIndex === 0}
              tablet={isTablet}
            />
          ))}
        </aside>

        <main className="hs-print-stage overflow-auto p-5 sm:p-8">
          <div
            ref={printPagesRef}
            className="hs-print-pages mx-auto origin-top space-y-6 transition-transform"
            style={{
              width: isTablet ? "min(100%, 768px)" : "min(100%, 794px)",
              transform: `scale(${zoom / 100})`,
              marginBottom: `${Math.max(0, zoom - 85) * 8}px`,
            }}
          >
            <WorksheetRenderer
              entries={snapshot.entries}
              settings={printSettings}
              showBackground={backgroundGraphics}
              showAnswers={canShowAnswers ? showAnswers : false}
              onPageCountChange={setPageCount}
            />
          </div>
        </main>

        <aside className="hs-no-print border-l border-[#d4d4d0] bg-[#fffdf9] p-6">
          <fieldset disabled={pdfProgress !== null} className="min-w-0">
          <h1 className="hs-display text-2xl font-bold">{t("Print settings", "打印与下载设置")}</h1>
          <Link href={templateSlug ? `/generator?template=${templateSlug}` : "/generator?resume=1"} className="mt-3 block text-sm font-semibold text-[#24466e] underline underline-offset-4">
            {t("Edit word list", "返回编辑器")}
          </Link>
          <button id="worksheet-help-trigger" type="button" className="mt-2 block min-h-11 text-sm underline underline-offset-4" onClick={() => setHelpPanel("help")}>{t("Having trouble?", "遇到问题？")}</button>
 {!templateSlug && canShowAnswers && snapshot.settings.mode !== "quiz" && <RepeatFillControl
 enabled={!!snapshot.settings.repeatToFill} disabled={!snapshot.entries.some(entry => /\p{Script=Han}/u.test(entry.hanzi))}
 chinese={locale === "zh"} onChange={repeatToFill => {
 const next = { ...snapshot, settings: { ...snapshot.settings, repeatToFill } };
 setSnapshot(next);
 try {
   sessionStorage.setItem(WORKSHEET_STORAGE_KEY, JSON.stringify(next));
   setStorageWarning(false);
 } catch {
   setStorageWarning(true);
 }
 }} />}

          <PrintToggle
            label={t("Background graphics", "背景图形")}
            description={t("Keep grid lines and tracing colour in the PDF.", "在 PDF 中保留格线和描红颜色。")}
            checked={backgroundGraphics}
            onChange={setBackgroundGraphics}
          />
          {snapshot.settings.output === "worksheet" ? (
            <PrintToggle
              label={t("Show answers", "显示答案")}
              description={t("Keep model characters and stroke-order diagrams.", "保留示范汉字和笔顺图。")}
              checked={showAnswers}
              onChange={setShowAnswers}
            />
          ) : null}
          {!isTablet ? (
            <label className="mt-6 block border-t border-[#ddd7cd] pt-5 text-sm font-semibold">
              {t("Margins", "页边距")}
              <select
                value={printMargin}
                onChange={(event) =>
                  setPrintMargin(event.target.value as PrintMargin)
                }
                className="mt-2 h-11 w-full rounded border border-[#d5cec1] bg-white px-3 font-normal"
              >
                <option value="normal">{t("Normal", "标准")}</option>
                <option value="narrow">{t("Narrow", "窄边距")}</option>
              </select>
            </label>
          ) : null}
          <div className="mt-8 flex gap-3 rounded border border-[#c9d2df] bg-[#f7fafc] p-4 text-sm leading-6 text-[#4d5e73]">
            <Info className="mt-0.5 size-5 shrink-0 text-[#24466e]" />
            {isTablet
              ? t(
                  "The 3:4 PDF fits GoodNotes and other handwriting apps.",
                  "这份 3:4 PDF 可用于 GoodNotes 等手写应用。",
                )
              : t(
                  "Download the PDF for a saved file. Use Print for printer and copy settings.",
                  "需要保存文件时下载 PDF；需要选择打印机或份数时使用打印。",
                )}
          </div>
          {storageWarning ? (
            <p role="status" className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {t("Changes are available on this page but could not be saved. Download or print before leaving.", "修改已在此页面生效，但无法保存。离开前请先下载或打印。")}
            </p>
          ) : null}
          </fieldset>
        </aside>
      </div>
    </div>
  );
}

function ToolbarSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      aria-label={label}
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 rounded border border-[#d5d1c9] bg-white px-3 text-sm"
    >
      {options.map(([option, optionLabel]) => (
        <option key={option} value={option}>
          {optionLabel}
        </option>
      ))}
    </select>
  );
}

function ToolbarChip({ label }: { label: string }) {
  return (
    <span role="status" className="inline-flex items-center px-1 text-xs font-medium text-[#657083]">
      {label}
    </span>
  );
}

function PrintToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="mt-6 flex cursor-pointer items-start justify-between gap-4">
      <span>
        <strong className="block text-sm">{label}</strong>
        <span className="mt-1 block text-xs leading-5 text-[#687487]">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span className="relative mt-1 h-6 w-11 shrink-0 rounded-full bg-[#c9c9c4] peer-checked:bg-[#c52e28] after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
    </label>
  );
}

function Thumbnail({
  label,
  selected,
  tablet,
}: {
  label: string;
  selected?: boolean;
  tablet?: boolean;
}) {
  return (
    <div className="mb-7 text-center">
      <div
        className={`mx-auto grid w-28 place-items-center bg-white text-xs text-[#8a8f96] shadow-sm ${
          tablet ? "aspect-[3/4]" : "aspect-[210/297]"
        } ${
          selected ? "rounded border-2 border-[#c62d27]" : "border border-[#d8d8d4]"
        }`}
      >
        {label}
      </div>
      <p className={`mt-3 text-sm ${selected ? "font-semibold text-[#b62822]" : ""}`}>
        {label}
      </p>
    </div>
  );
}
