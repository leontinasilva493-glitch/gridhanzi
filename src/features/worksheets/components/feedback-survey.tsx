"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { ROLES, suppressDownloadHelp, type FeedbackContext } from "../feedback";
import { trackHelpEvent } from "../analytics";
import { localize } from "../i18n";

/** Inline, opened only on an explicit click. No automatic invitations. */
export function FeedbackSurvey({ open, onClose, kind, source, useCase }: FeedbackContext & {
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const t = (en: string, zh: string) => localize(locale, en, zh);
  const id = useId();
  const title = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const sending = useRef(false);
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [mayContact, setMayContact] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "invalid" | "failed" | "success">("idle");

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    title.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (open || status !== "success") return;
    setDescription(""); setRole(""); setEmail(""); setMayContact(false); setStatus("idle");
  }, [open, status]);

  function close() {
    if (sending.current) return;
    suppressDownloadHelp(30);
    onClose();
    returnFocus.current?.focus({ preventScroll: true });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    if (!description.trim()) { setStatus("invalid"); return; }
    sending.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          ...(kind === "problem" ? { friction: description } : { suggestion: description }),
          role, contactEmail: mayContact ? email : "", mayContact, website,
          locale, trigger: "manual", kind, source, useCase,
          pagePath: window.location.pathname,
        }),
      });
      const result: unknown = await response.json();
      if (!response.ok || !result || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
        throw new Error("Feedback was not accepted");
      }
      setStatus("success");
      suppressDownloadHelp(180);
      trackHelpEvent("worksheet_feedback_sent", source, kind, useCase);
    } catch {
      setStatus("failed");
    } finally {
      sending.current = false;
    }
  }

  if (!open) return null;
  const roleLabels = [t("Teacher", "教师"), t("Parent", "家长"), t("Student", "学生"), t("Self-learner", "自学者"), t("School / training centre", "学校 / 培训机构"), t("Other", "其他")];
  return (
    <section data-feedback-form data-clarity-mask="true" aria-labelledby={`${id}-title`}
      className="hs-no-print mt-4 rounded border border-[#d8d0c2] bg-[#fffdf9] p-4 text-sm"
      onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); close(); } }}>
      <div className="flex items-start justify-between gap-2">
        <h3 id={`${id}-title`} ref={title} tabIndex={-1} className="font-bold">
          {t("What would you like your worksheet to do?", "你想做出什么样的练习纸？")}
        </h3>
        <button type="button" onClick={close} disabled={status === "sending"} className="min-h-10 shrink-0 px-2 underline disabled:opacity-50">
          {t("Close form", "关闭表单")}
        </button>
      </div>
      {status === "success" ? <p role="status" className="mt-3">{t("Submitted. You can continue editing or downloading worksheets.", "已提交。你可以继续编辑或下载练习纸。")}</p> : (
        <form onSubmit={submit} className="mt-3 grid gap-3">
          <p>{t("Tell us how you want to use it and what is getting in the way. Please leave out student names and other personal details.", "说说你想怎么使用，以及现在还差哪一步。请勿填写学生姓名等个人信息。")}</p>
          <label htmlFor={`${id}-description`}>
            {kind === "problem" ? t("Describe the problem", "说明遇到的问题") : t("Describe the worksheet you need", "描述你需要的练习纸")}
            <textarea id={`${id}-description`} required maxLength={2000} value={description}
              onChange={event => setDescription(event.target.value)}
              placeholder={kind === "problem"
                ? t("For example: Pinyin appears in the preview, but is missing from my downloaded PDF.", "例如：预览里的拼音正常，但下载的 PDF 中没有显示。")
                : t("For example: My child is practising this week's words. I need more blank writing rows below each word.", "例如：给孩子练本周生字，想让每个字下面多留几行空格。")}
              className="mt-1 min-h-28 w-full rounded border p-2" />
          </label>
          <label htmlFor={`${id}-role`}>{t("Your role (optional)", "你的使用身份（可不填）")}
            <select id={`${id}-role`} value={role} onChange={event => setRole(event.target.value)} className="mt-1 w-full rounded border p-2">
              <option value="">{t("Prefer not to say", "暂不填写")}</option>
              {ROLES.map((value, index) => <option key={value} value={value}>{roleLabels[index]}</option>)}
            </select>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" checked={mayContact} onChange={event => { setMayContact(event.target.checked); if (!event.target.checked) setEmail(""); }} className="mt-1" />
            {t("I'm open to follow-up questions about this feedback (optional)", "愿意就这条反馈进一步交流（可选）")}
          </label>
          {mayContact && <label htmlFor={`${id}-email`}>{t("Email (optional)", "邮箱（可选）")}
            <input id={`${id}-email`} type="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} className="mt-1 w-full rounded border p-2" />
            <span className="mt-1 block text-xs text-[#56657a]">{t("Only for contact about this feedback. A reply is not guaranteed.", "仅用于联系这条反馈，不代表一定会回复。")}</span>
          </label>}
          <p className="text-xs leading-5 text-[#56657a]">{t("Your answers, selected use and help entry, and current page path are sent to GridHanzi by email to understand requests and problems. Worksheet contents are not attached automatically.", "填写内容、所选用途、帮助入口和当前页面路径会通过邮件发送给 GridHanzi，用于了解需求和问题。不会自动附带练习纸内容。")}</p>
          <input name="website" tabIndex={-1} aria-hidden="true" autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} className="absolute -left-[10000px]" />
          <button disabled={status === "sending"} className="hs-primary-button disabled:opacity-60">
            {status === "sending" ? t("Sending…", "正在提交……") : kind === "problem" ? t("Report issue", "提交问题") : t("Send request", "提交需求")}
          </button>
          {status === "invalid" && <p role="alert">{t("Please describe what you need or what went wrong.", "请描述你的需求或遇到的问题。")}</p>}
          {status === "failed" && <p role="alert">{t("Could not submit yet. Your text is still here. Try again, or ", "暂时未能提交，填写内容仍保留在这里。请重试，或")}
            <a href="mailto:support@gridhanzi.org" className="underline">{t("contact us by email", "通过邮件联系")}</a>{t(".", "。")}
          </p>}
        </form>
      )}
    </section>
  );
}
