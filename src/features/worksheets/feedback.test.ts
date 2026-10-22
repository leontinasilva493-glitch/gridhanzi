import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildFeedbackEmail,
  normalizeMetadata,
  parseFeedbackInput,
  suppressDownloadHelp,
  FEEDBACK_COOLDOWN_KEY,
} from "./feedback";

describe("feedback parsing", () => {
  it("never shortens a successful cooldown and tolerates blocked storage", () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    const values = new Map<string, string>();
    try {
      Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
      } });
      suppressDownloadHelp(180);
      const until = values.get(FEEDBACK_COOLDOWN_KEY);
      suppressDownloadHelp(30);
      assert.equal(values.get(FEEDBACK_COOLDOWN_KEY), until);
      Object.defineProperty(globalThis, "localStorage", { configurable: true, get() { throw new Error("blocked"); } });
      assert.doesNotThrow(() => suppressDownloadHelp(30));
    } finally {
      if (original) Object.defineProperty(globalThis, "localStorage", original);
      else Reflect.deleteProperty(globalThis, "localStorage");
    }
  });
  it("keeps help context separate from identity and strips private URL values", () => {
    const meta = normalizeMetadata({ locale: "zh", trigger: "manual", source: "templates", kind: "request", useCase: "class", pagePath: "/zh/templates?words=private#private" });
    assert.deepEqual(meta, { locale: "zh", trigger: "manual", source: "templates", kind: "request", useCase: "class", pagePath: "/zh/templates" });
    const parsed = parseFeedbackInput({ suggestion: "需要更多空白行" });
    assert.ok(parsed.ok);
    assert.equal(parsed.value.role, "");
    const mail = buildFeedbackEmail(parsed.value, { ...meta, submittedAt: "now" });
    assert.match(mail.text, /Selected use \(not a verified role\): class/);
    assert.doesNotMatch(mail.text, /private/);
    const invalid = normalizeMetadata({ kind: "private", source: "private", useCase: "private" });
    assert.equal(invalid.source, undefined);
    assert.equal(invalid.useCase, undefined);
    assert.equal(invalid.kind, undefined);
  });
  it("requires one answer and validates email", () => {
    assert.equal(parseFeedbackInput({}).ok, false);
    assert.equal(parseFeedbackInput({ contactEmail: "bad" }).ok, false);
    const parsed = parseFeedbackInput({
      friction: "The preview did not match what I expected.",
      contactEmail: "A@EXAMPLE.COM",
      mayContact: true,
    });
    assert.equal(parsed.ok, true);
    if (parsed.ok) assert.equal(parsed.value.contactEmail, "a@example.com");
  });
  it("marks honeypot without rejecting the shape", () => {
    const parsed = parseFeedbackInput({ suggestion: "x", website: "bot" });
    assert.equal(parsed.ok && parsed.honeypot, true);
  });
  it("escapes HTML and only includes reply-to with consent", () => {
    const parsed = parseFeedbackInput({
      suggestion: "<script>",
      contactEmail: "a@example.com",
    });
    assert.equal(parsed.ok, true);
    if (parsed.ok) {
      const email = buildFeedbackEmail(parsed.value, {
        pagePath: "/en",
        locale: "en",
        trigger: "preview-ready",
        submittedAt: "now",
      });
      assert.match(email.html, /&lt;script&gt;/);
      assert.equal(email.replyTo, undefined);
    }
  });
  it("normalizes metadata and preserves a specific problem", () => {
    assert.deepEqual(
      normalizeMetadata({
        locale: "fr",
        trigger: "invite",
        pagePath: "/api/feedback",
      }),
      { locale: "en", trigger: "time-60s", pagePath: "/" },
    );
    const parsed = parseFeedbackInput({
      friction: "I wanted to print a worksheet, but the preview was confusing.",
    });
    assert.equal(parsed.ok, true);
    if (parsed.ok) {
      assert.equal(
        parsed.value.friction,
        "I wanted to print a worksheet, but the preview was confusing.",
      );
      assert.match(
        buildFeedbackEmail(parsed.value, {
          pagePath: "/en",
          locale: "en",
          trigger: "time-60s",
          submittedAt: "now",
        }).text,
        /Specific problem: I wanted to print a worksheet/,
      );
    }
  });
  it("enforces the open friction field length", () => {
    assert.equal(parseFeedbackInput({ friction: "x".repeat(2001) }).ok, false);
    assert.equal(parseFeedbackInput({ friction: "I got stuck here" }).ok, true);
  });
  it("allows an empty honeypot submission and gates reply-to on consent", () => {
    const bot = parseFeedbackInput({ website: "filled" });
    assert.equal(bot.ok && bot.honeypot, true);
    const parsed = parseFeedbackInput({
      suggestion: "hello",
      contactEmail: "a@example.com",
      mayContact: true,
    });
    assert.equal(parsed.ok, true);
    if (parsed.ok)
      assert.equal(
        buildFeedbackEmail(parsed.value, {
          pagePath: "/en",
          locale: "en",
          trigger: "time-60s",
          submittedAt: "now",
        }).replyTo,
        "a@example.com",
      );
  });
});
