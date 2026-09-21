import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildFeedbackEmail,
  normalizeMetadata,
  parseFeedbackInput,
} from "./feedback";

describe("feedback parsing", () => {
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
