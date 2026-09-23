export const ROLES = [
  "teacher",
  "parent",
  "student",
  "self-learner",
  "school",
  "other",
] as const;
export const AGE_RANGES = [
  "under-18",
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-plus",
] as const;
export const TRIGGERS = ["time-60s", "preview-ready", "download-complete", "manual"] as const;
export const LOCALES = ["en", "zh"] as const;
export type Trigger = (typeof TRIGGERS)[number];
export type Locale = (typeof LOCALES)[number];
export type FeedbackInput = Record<string, unknown>;
export type FeedbackValues = {
  currentGoal: string;
  friction: string;
  role: (typeof ROLES)[number] | "";
  ageRange: (typeof AGE_RANGES)[number] | "";
  suggestion: string;
  contactEmail: string;
  mayContact: boolean;
};
export type FeedbackMeta = {
  pagePath: string;
  locale: Locale;
  trigger: Trigger;
  submittedAt: string;
};
export const LIMITS = {
  currentGoal: 2000,
  friction: 2000,
  suggestion: 2000,
  contactEmail: 254,
} as const;
const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";
const includes = <T extends readonly string[]>(
  list: T,
  value: string,
): value is T[number] => list.includes(value);
export const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export function normalizeMetadata(input: unknown): {
  locale: Locale;
  trigger: Trigger;
  pagePath: string;
} {
  const value =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const locale = text(value.locale);
  const trigger = text(value.trigger);
  const pagePath = text(value.pagePath);
  return {
    locale: includes(LOCALES, locale) ? locale : "en",
    trigger: includes(TRIGGERS, trigger) ? trigger : "time-60s",
    pagePath:
      pagePath.startsWith("/") && !pagePath.startsWith("/api/")
        ? pagePath.slice(0, 300)
        : "/",
  };
}
export function parseFeedbackInput(
  input: unknown,
):
  | { ok: true; value: FeedbackValues; honeypot: boolean }
  | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { ok: false, error: "Invalid feedback." };
  const body = input as FeedbackInput;
  const honeypot = Boolean(text(body.website));
  const currentGoal = text(body.currentGoal),
    friction = text(body.friction),
    suggestion = text(body.suggestion),
    contactEmail = text(body.contactEmail).toLowerCase();
  const roleValue = text(body.role),
    ageValue = text(body.ageRange);
  if (
    currentGoal.length > LIMITS.currentGoal ||
    friction.length > LIMITS.friction ||
    suggestion.length > LIMITS.suggestion ||
    contactEmail.length > LIMITS.contactEmail
  )
    return { ok: false, error: "One or more answers are too long." };
  if (roleValue && !includes(ROLES, roleValue))
    return { ok: false, error: "Invalid role." };
  if (ageValue && !includes(AGE_RANGES, ageValue))
    return { ok: false, error: "Invalid age range." };
  if (contactEmail && !isEmail(contactEmail))
    return { ok: false, error: "Enter a valid email address." };
  if (
    !honeypot &&
    !Boolean(
      currentGoal ||
        friction ||
        roleValue ||
        ageValue ||
        suggestion ||
        contactEmail,
    )
  )
    return { ok: false, error: "Please answer at least one question." };
  return {
    ok: true,
    honeypot,
    value: {
      currentGoal,
      friction,
      role: roleValue as FeedbackValues["role"],
      ageRange: ageValue as FeedbackValues["ageRange"],
      suggestion,
      contactEmail,
      mayContact: body.mayContact === true,
    },
  };
}
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
export function buildFeedbackEmail(values: FeedbackValues, meta: FeedbackMeta) {
  const textBody = [
    "GridHanzi feedback",
    `Path: ${meta.pagePath}`,
    `Locale: ${meta.locale}`,
    `Trigger: ${meta.trigger}`,
    `Submitted: ${meta.submittedAt}`,
    "",
    `Current goal: ${values.currentGoal || "(empty)"}`,
    `Specific problem: ${values.friction || "(empty)"}`,
    `Role: ${values.role || "(empty)"}`,
    `Age range: ${values.ageRange || "(empty)"}`,
    `Suggestion: ${values.suggestion || "(empty)"}`,
    `Contact email: ${values.contactEmail || "(empty)"}`,
    `May contact: ${values.mayContact ? "yes" : "no"}`,
  ].join("\n");
  return {
    subject: "GridHanzi feedback",
    text: textBody,
    html: textBody.split("\n").map(escapeHtml).join("<br>\n"),
    replyTo:
      values.mayContact && values.contactEmail
        ? values.contactEmail
        : undefined,
  };
}
