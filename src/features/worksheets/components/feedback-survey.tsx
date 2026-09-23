"use client";

import type { FormEvent, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { AGE_RANGES, ROLES, type Trigger } from "../feedback";

type Locale = "en" | "zh";
type Status = "idle" | "sending" | "invalid" | "failed" | "success";
type FormState = {
  currentGoal: string;
  friction: string;
  role: string;
  ageRange: string;
  suggestion: string;
  contactEmail: string;
  mayContact: boolean;
  website: string;
};
type Copy = {
  inviteTime: string;
  invitePreview: string;
  button: string;
  title: string;
  close: string;
  send: string;
  thanks: string;
  failed: string;
  required: string;
  privacy: string;
  goal: string;
  friction: string;
  frictionHelp: string;
  detail: string;
  role: string;
  age: string;
  suggestion: string;
  email: string;
  contact: string;
  roles: readonly string[];
  ages: readonly string[];
};
const initialForm: FormState = {
  currentGoal: "",
  friction: "",
  role: "",
  ageRange: "",
  suggestion: "",
  contactEmail: "",
  mayContact: false,
  website: "",
};
const copy: Record<Locale, Copy> = {
  en: {
    inviteTime: "What are you trying to finish, and where are you stuck?",
    invitePreview:
      "Your PDF is ready. Is there anything we should improve?",
    button: "Share feedback",
    title: "A quick question",
    close: "Close",
    send: "Send feedback",
    thanks: "Thanks — your feedback was sent.",
    failed: "Could not send yet. Your answers are still here; try again.",
    required: "Please answer at least one question.",
    privacy:
      "Optional answers improve the product and enable approved contact. We never upload worksheet contents.",
    goal: "What are you trying to make or teach?",
    friction: "What felt difficult or unclear?",
    frictionHelp: "Please describe what you wanted to do, where you got stuck, and the result you expected.",
    detail: "Anything else about that?",
    role: "Your role",
    age: "Age range",
    suggestion: "What should we improve?",
    email: "Email (optional)",
    contact: "You may contact me about this feedback",
    roles: [
      "Teacher",
      "Parent",
      "Student",
      "Self-learner",
      "School / training centre",
      "Other",
    ],
    ages: ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"],
  },
  zh: {
    inviteTime: "你正在尝试完成什么？哪里卡住了？",
    invitePreview: "PDF 已下载。使用过程中有什么需要改进？",
    button: "分享反馈",
    title: "简单问卷",
    close: "关闭",
    send: "提交反馈",
    thanks: "谢谢，反馈已发送。",
    failed: "暂时发送失败，已保留你的填写内容，可以重试。",
    required: "请至少填写一项。",
    privacy: "填写内容仅用于产品改进，以及在你同意后联系你；不会上传字帖内容。",
    goal: "你想制作或教学什么？",
    friction: "什么地方用得不顺手？",
    frictionHelp: "请直接描述：当时想做什么、卡在哪一步、你原本希望得到什么结果。",
    detail: "还有其他补充吗？",
    role: "你的身份",
    age: "年龄段",
    suggestion: "你希望我们改进什么？",
    email: "邮箱（可选）",
    contact: "可以通过邮箱联系我",
    roles: ["教师", "家长", "学生", "自学者", "学校 / 培训机构", "其他"],
    ages: ["未满 18 岁", "18–24", "25–34", "35–44", "45–54", "55 岁以上"],
  },
};
const cooldownKey = "gridhanzi-feedback-cooldown";
function isCooledDown() {
  try {
    return Number(localStorage.getItem(cooldownKey) || 0) > Date.now();
  } catch {
    return false;
  }
}
function saveCooldown(days: number) {
  try {
    localStorage.setItem(cooldownKey, String(Date.now() + days * 86400000));
  } catch {
    // The lifecycle ref still prevents repeated invitations in this mount.
  }
}

export function FeedbackSurvey({
  locale: suppliedLocale,
}: {
  locale?: string;
}) {
  const detectedLocale = useLocale();
  const locale: Locale =
    (suppliedLocale || detectedLocale) === "zh" ? "zh" : "en";
  const t = copy[locale];
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState<FormState>(initialForm);
  const fired = useRef(false);
  const lifecycleCooldown = useRef(false);
  const inviteButton = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const fire = (value: Trigger) => {
      if (fired.current || lifecycleCooldown.current || isCooledDown()) return;
      fired.current = true;
      setTrigger(value);
    };
    const onDownloaded = () => fire("download-complete");
    const onRequested = () => { setTrigger("manual"); setOpen(true); };
    window.addEventListener("gridhanzi:download-complete", onDownloaded);
    window.addEventListener("gridhanzi:feedback-requested", onRequested);
    return () => {
      window.removeEventListener("gridhanzi:download-complete", onDownloaded);
      window.removeEventListener("gridhanzi:feedback-requested", onRequested);
    };
  }, []);
  useEffect(() => {
    if (open) title.current?.focus();
  }, [open]);
  const close = (dismiss: boolean) => {
    setOpen(false);
    if (dismiss || status === "success") {
      lifecycleCooldown.current = true;
      if (status !== "success") saveCooldown(30);
      setTrigger(null);
    }
    window.setTimeout(() => inviteButton.current?.focus(), 0);
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) close(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, status]);
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };
  const hasAnswer = Boolean(
    form.currentGoal.trim() ||
      form.friction.trim() ||
      form.role ||
      form.ageRange ||
      form.suggestion.trim() ||
      form.contactEmail.trim(),
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasAnswer) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          locale,
          trigger,
          pagePath: window.location.pathname,
        }),
      });
      if (!response.ok) throw new Error("feedback request failed");
      setStatus("success");
      lifecycleCooldown.current = true;
      saveCooldown(180);
    } catch {
      setStatus("failed");
    }
  }
  if (!trigger) return null;
  const inviteText =
    trigger === "download-complete" ? t.invitePreview : t.inviteTime;
  return (
    <div
      data-feedback-invite
      className="hs-no-print fixed inset-x-3 bottom-3 z-[70] sm:left-auto sm:right-5 sm:max-w-sm"
    >
      {!open ? (
        <InvitationCard
          buttonRef={inviteButton}
          copy={t}
          text={inviteText}
          onOpen={() => setOpen(true)}
          onDismiss={() => close(true)}
        />
      ) : (
        <dialog
          data-feedback-dialog
          open
          aria-labelledby="feedback-title"
          aria-describedby="feedback-description"
          className={[
            "fixed inset-x-3 bottom-3 m-0 max-h-[calc(100vh-1.5rem)]",
            "max-w-sm overflow-y-auto rounded-xl border border-[#d8d0c2]",
            "bg-[#fffdf9] p-5 text-[#14253f] shadow-2xl",
          ].join(" ")}
        >
          <div className="flex items-center justify-between">
            <h2
              id="feedback-title"
              ref={title}
              tabIndex={-1}
              className="hs-display text-xl font-bold"
            >
              {t.title}
            </h2>
            <button
              aria-label={t.close}
              className="min-h-11 min-w-11 text-2xl"
              onClick={() => close(false)}
            >
              ×
            </button>
          </div>
          <p
            id="feedback-description"
            className="mt-2 text-xs leading-5 text-[#56657a]"
          >
            {t.privacy}
          </p>
          {status === "success" ? (
            <p data-feedback-success role="status" className="mt-5">
              {t.thanks}
            </p>
          ) : (
            <SurveyForm
              t={t}
              form={form}
              status={status}
              update={update}
              onSubmit={submit}
            />
          )}
        </dialog>
      )}
    </div>
  );
}

function InvitationCard({
  buttonRef,
  copy: t,
  text,
  onOpen,
  onDismiss,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>;
  copy: Copy;
  text: string;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#d8d0c2] bg-[#fffdf9] p-4 text-[#14253f] shadow-2xl">
      <p className="font-semibold">{text}</p>
      <button
        ref={buttonRef}
        className="hs-primary-button mt-3"
        onClick={onOpen}
      >
        {t.button}
      </button>
      <button
        className="ml-3 min-h-11 px-2 text-sm underline"
        onClick={onDismiss}
      >
        {t.close}
      </button>
    </div>
  );
}

function SurveyForm({
  t,
  form,
  status,
  update,
  onSubmit,
}: {
  t: Copy;
  form: FormState;
  status: Status;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 text-sm">
      <label htmlFor="feedback-goal">
        {t.goal}
        <textarea
          id="feedback-goal"
          value={form.currentGoal}
          onChange={(event) => update("currentGoal", event.target.value)}
          maxLength={2000}
          className="mt-1 min-h-20 w-full rounded border p-2"
        />
      </label>
      <label htmlFor="feedback-friction">
        {t.friction}
        <span className="mt-1 block text-xs text-[#687487]">
          {t.frictionHelp}
        </span>
        <textarea
          id="feedback-friction"
          value={form.friction}
          onChange={(event) => update("friction", event.target.value)}
          maxLength={2000}
          className="mt-1 min-h-20 w-full rounded border p-2"
        />
      </label>
      <label htmlFor="feedback-role">
        {t.role}
        <select
          id="feedback-role"
          value={form.role}
          onChange={(event) => update("role", event.target.value)}
          className="mt-1 w-full rounded border p-2"
        >
          <option value="">—</option>
          {t.roles.map((label, index) => (
            <option key={label} value={ROLES[index]}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="feedback-age">
        {t.age}
        <select
          id="feedback-age"
          value={form.ageRange}
          onChange={(event) => update("ageRange", event.target.value)}
          className="mt-1 w-full rounded border p-2"
        >
          <option value="">—</option>
          {t.ages.map((label, index) => (
            <option key={label} value={AGE_RANGES[index]}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="feedback-suggestion">
        {t.suggestion}
        <textarea
          id="feedback-suggestion"
          value={form.suggestion}
          onChange={(event) => update("suggestion", event.target.value)}
          maxLength={2000}
          className="mt-1 min-h-20 w-full rounded border p-2"
        />
      </label>
      <label htmlFor="feedback-email">
        {t.email}
        <input
          id="feedback-email"
          type="email"
          value={form.contactEmail}
          onChange={(event) => update("contactEmail", event.target.value)}
          maxLength={254}
          className="mt-1 w-full rounded border p-2"
        />
      </label>
      <label className="flex gap-2">
        <input
          type="checkbox"
          checked={form.mayContact}
          onChange={(event) => update("mayContact", event.target.checked)}
        />
        {t.contact}
      </label>
      <input
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        value={form.website}
        onChange={(event) => update("website", event.target.value)}
        className="absolute -left-[10000px]"
      />
      <button
        disabled={status === "sending"}
        className="hs-primary-button disabled:opacity-60"
      >
        {status === "sending" ? "…" : t.send}
      </button>
      {status === "invalid" ? (
        <p role="alert">{t.required}</p>
      ) : status === "failed" ? (
        <p role="alert">{t.failed}</p>
      ) : null}
    </form>
  );
}
