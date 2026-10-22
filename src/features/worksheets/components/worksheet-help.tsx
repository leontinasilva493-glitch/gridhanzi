"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/core/i18n/navigation";
import { localize } from "../i18n";
import { trackHelpEvent } from "../analytics";
import { FEEDBACK_COOLDOWN_KEY, suppressDownloadHelp, type FeedbackContext } from "../feedback";
import { FeedbackSurvey } from "./feedback-survey";

export type HelpPanel = "adjust" | "help" | "pdf-error" | null;

export function WorksheetHelp({ panel, onPanelChange, downloads, templateSlug, isWorksheet, onPrint, busy, failed }: {
  panel: HelpPanel;
  onPanelChange: (panel: HelpPanel) => void;
  downloads: number;
  templateSlug?: string;
  isWorksheet: boolean;
  onPrint: () => void;
  busy: boolean;
  failed: boolean;
}) {
  const locale = useLocale();
  const t = (en: string, zh: string) => localize(locale, en, zh);
  const [hint, setHint] = useState(false);
  const dismissed = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const [feedback, setFeedback] = useState<FeedbackContext | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [problem, setProblem] = useState<"pdf" | "layout" | null>(null);
  const editor = templateSlug ? `/generator?template=${encodeURIComponent(templateSlug)}` : "/generator?resume=1";
  const source = panel === "adjust" ? "download" : panel === "pdf-error" ? "pdf-error" : "preview";

  useEffect(() => {
    if (!downloads || dismissed.current) return;
    try { if (Number(localStorage.getItem(FEEDBACK_COOLDOWN_KEY) || 0) > Date.now()) return; } catch { /* Help also works without storage. */ }
    setHint(true);
  }, [downloads]);

  useEffect(() => { if (failed) setHint(false); }, [failed]);

  useEffect(() => {
    if (!panel) return;
    setHint(false);
    setProblem(panel === "pdf-error" ? "pdf" : null);
    setFormOpen(false);
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: "nearest" });
    trackHelpEvent("worksheet_help_open", panel === "adjust" ? "download" : panel === "pdf-error" ? "pdf-error" : "preview", panel === "adjust" ? "adjust" : "help");
  }, [panel]);

  function dismiss() {
    dismissed.current = true;
    setHint(false);
    setFormOpen(false);
    onPanelChange(null);
    document.getElementById("worksheet-help-trigger")?.focus({ preventScroll: true });
    suppressDownloadHelp(30);
  }
  function request(kind: FeedbackContext["kind"]) {
    setFeedback({ kind, source });
    setFormOpen(true);
    trackHelpEvent("worksheet_help_action", source, kind);
  }
  function editLink(action: "size" | "words" | "pinyin" | "strokes" | "layout", target: string, label: string) {
    return <Link href={`${editor}#${target}`} onClick={() => trackHelpEvent("worksheet_help_action", source, action)} className="hs-secondary-button justify-start text-sm">{label}</Link>;
  }

  return (
    <section hidden={busy || (!hint && !panel)} data-worksheet-help className="hs-no-print border-b border-[#d6d6d3] bg-[#fffdf9] px-4 py-3">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start justify-between gap-3">
          <h2 ref={heading} tabIndex={-1} className="font-semibold">
            {panel && panel !== "adjust" ? t("What is getting in the way?", "哪里还不顺利？") : t("Want to adjust this worksheet?", "想调整这份练习纸？")}
          </h2>
          <button type="button" onClick={dismiss} className="min-h-10 px-2 text-sm underline">{t("Close help", "关闭帮助")}</button>
        </div>
        {!panel ? <>
          <p className="mt-1 text-sm">{isWorksheet
            ? t("Change the cell size, words, or pinyin, then generate another copy.", "修改字格大小、练习内容或拼音提示，再生成一份。")
            : t("Change the words, pinyin, or card layout, then generate another copy.", "修改词表、拼音或卡片排版，再生成一份。")}</p>
          <button type="button" onClick={() => onPanelChange("adjust")} className="hs-secondary-button mt-2 text-sm">
            {templateSlug ? t("Edit this template", "编辑这个模板") : t("Adjust worksheet", "调整练习纸")}
          </button>
        </> : <>
          {templateSlug && <p className="mt-2 text-sm text-[#56657a]">{t("These links open the original template in the editor. Paper and margin changes made in this preview are not carried over.", "以下链接会在编辑器中打开原始模板，不会带入本次预览中调整的纸张及边距设置。")}</p>}
          {panel === "adjust" ? <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {isWorksheet ? editLink("size", "worksheet-cell-size", t("Larger writing cells", "字格大一点")) : editLink("layout", "worksheet-settings", t("Change card layout", "调整卡片排版"))}
            {editLink("words", "review-words", t("Change the words", "换成我要练的字"))}
            {editLink("pinyin", "worksheet-pinyin", t("Show or hide pinyin", "显示或隐藏拼音"))}
            {isWorksheet && editLink("strokes", "worksheet-strokes", t("Add stroke-order guides", "加上笔顺提示"))}
            <button type="button" onClick={() => request("request")} className="min-h-11 text-left text-sm underline">{t("I need something else", "这些还不能满足我的需要")}</button>
          </div> : <>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => { setProblem("pdf"); setFormOpen(false); }} className="hs-secondary-button text-sm" aria-pressed={problem === "pdf"}>{t("PDF download failed", "PDF 下载失败")}</button>
              <button type="button" onClick={() => { setProblem("layout"); setFormOpen(false); }} className="hs-secondary-button text-sm" aria-pressed={problem === "layout"}>{t("Content or layout is wrong", "内容或排版不对")}</button>
              <button type="button" onClick={() => { setProblem(null); request("request"); }} className="hs-secondary-button text-sm">{t("I need a different practice format", "找不到想要的练习方式")}</button>
            </div>
            {problem === "pdf" && <div className="mt-3 text-sm">
              <p>{t("Try your browser's Print dialog and choose Save as PDF, if available. Print uses paper sizes; it does not preserve the tablet PDF's 3:4 format.", "可以尝试浏览器打印，并在可用时选择“另存为 PDF”。打印使用纸张尺寸，不会保留平板 PDF 的 3:4 比例。")}</p>
              <button type="button" className="hs-secondary-button mt-2 text-sm" onClick={() => { trackHelpEvent("worksheet_help_action", source, "print"); onPrint(); }}>{t("Open print dialog", "打开打印窗口")}</button>
              <button type="button" className="ml-3 min-h-11 underline" onClick={() => request("problem")}>{t("Still stuck? Describe the problem", "仍然无法完成？说明问题")}</button>
            </div>}
            {problem === "layout" && <div className="mt-3 flex flex-wrap gap-2">
              {editLink("words", "review-words", t("Edit Hanzi, pinyin or meanings", "修改汉字、拼音或释义"))}
              {editLink("layout", "worksheet-settings", t("Adjust paper or layout", "调整纸张或排版"))}
              <button type="button" className="min-h-11 text-sm underline" onClick={() => request("problem")}>{t("Can't find the setting you need?", "找不到需要的设置？")}</button>
            </div>}
          </>}
        </>}
        <FeedbackSurvey open={formOpen && Boolean(panel) && !busy} onClose={dismiss} kind={feedback?.kind ?? "request"} source={feedback?.source ?? source} />
      </div>
    </section>
  );
}
