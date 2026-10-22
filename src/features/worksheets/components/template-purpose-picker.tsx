"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/core/i18n/navigation";
import { HELP_USES, type FeedbackContext } from "../feedback";
import { trackHelpEvent } from "../analytics";
import { localize } from "../i18n";
import { FeedbackSurvey } from "./feedback-survey";

export function TemplatePurposePicker() {
  const locale = useLocale();
  const t = (en: string, zh: string) => localize(locale, en, zh);
  const [useCase, setUseCase] = useState<FeedbackContext["useCase"]>();
  const [formOpen, setFormOpen] = useState(false);
  const labels = [t("For a class", "课堂练习"), t("For a child", "孩子练字"), t("For myself", "自己练习"), t("HSK practice", "HSK 练习")];
  const recommendations = {
    class: {
      text: t("Use your lesson's words, or start with an everyday topic.", "用本课词表制作练习纸，或从常见主题开始。"),
      links: [["/#hero-vocabulary", t("Enter lesson words", "输入本课词表")], ["#everyday-words", t("Browse topic templates", "浏览主题模板")]],
    },
    child: {
      text: t("Start with first characters, numbers, or family words. You can adjust the writing cell size in the editor.", "从基础汉字、数字或家庭词汇开始。打开编辑器后可以调整字格大小。"),
      links: [["/templates/chinese-first-characters", t("First characters", "基础汉字")], ["/templates/numbers", t("Numbers", "数字")], ["/templates/family", t("Family", "家庭")]],
    },
    self: {
      text: t("Practise common characters, or use your own word list.", "练常用字，或者换成你自己的词表。"),
      links: [["/templates/top-100-chinese-characters", t("100 common characters", "常用 100 字")], ["/#hero-vocabulary", t("Enter my own words", "输入自己的词表")], ["/grids", t("Blank practice sheets", "空白练习纸")]],
    },
    hsk: {
      text: t("Choose words by the HSK version and level you are using.", "按你正在使用的 HSK 版本和级别选择词表。"),
      links: [["/generator?hskSystem=2.0&hskLevel=1", t("Choose version and level", "选择版本与级别")]],
    },
  };
  const selected = useCase ? recommendations[useCase] : null;
  return (
    <section className="hs-card mt-8 p-5 sm:p-7" aria-labelledby="practice-sheet-templates-title" data-template-purpose>
      <h2 id="practice-sheet-templates-title" className="hs-display text-3xl font-bold">{t("What are you preparing today?", "这次想准备什么练习？")}</h2>
      <p className="mt-3 text-sm leading-6 text-[#5b687a]">{t("Choose a use to find templates you can print or edit. You can also browse all templates below.", "选一个用途，查看可直接使用或修改的模板。也可以直接浏览下方全部模板。")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {HELP_USES.map((value, index) => <button key={value} type="button" aria-pressed={useCase === value} aria-controls="template-purpose-results"
          className={useCase === value ? "hs-primary-button" : "hs-secondary-button"}
          onClick={() => { setUseCase(value); setFormOpen(false); trackHelpEvent("worksheet_use_selected", "templates", "recommendation", value); }}>{labels[index]}</button>)}
      </div>
      <div id="template-purpose-results" className="mt-4" aria-live="polite">
        {selected && <>
          <p className="text-sm leading-6">{selected.text}</p>
          <div className="mt-3 flex flex-wrap gap-3">{selected.links.map(([href, label]) => {
            const className = "hs-secondary-button text-sm";
            const onClick = () => trackHelpEvent("worksheet_help_action", "templates", "recommendation", useCase);
            return href.startsWith("#") ? <a key={href} href={href} className={className} onClick={onClick}>{label}</a> : <Link key={href} href={href} className={className} onClick={onClick}>{label}</Link>;
          })}</div>
        </>}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#24466e]">
        <a href="#ready-to-print" className="min-h-10 content-center underline">{t("Ready-made PDFs", "现成 PDF")}</a>
        <a href="#template-directory-title" className="min-h-10 content-center underline">{t("Browse all templates", "浏览全部模板")}</a>
        <Link href="/#hero-vocabulary" className="min-h-10 content-center underline">{t("Start with my own words", "从自己的词表开始")}</Link>
        <Link href="/grids" className="min-h-10 content-center underline">{t("Blank grid PDFs", "空白格 PDF")}</Link>
      </div>
      <button type="button" className="mt-3 min-h-11 text-left text-sm underline" onClick={() => { setFormOpen(true); trackHelpEvent("worksheet_help_action", "templates", "request", useCase); }}>
        {t("Can't find what you need? Describe the worksheet you have in mind.", "没找到你要的练习？描述一下你想做的练习纸。")}
      </button>
      <FeedbackSurvey open={formOpen} onClose={() => setFormOpen(false)} kind="request" source="templates" useCase={useCase} />
    </section>
  );
}
