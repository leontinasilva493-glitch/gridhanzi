import { NextRequest, NextResponse } from "next/server";
import {
  buildFeedbackEmail,
  normalizeMetadata,
  parseFeedbackInput,
} from "@/features/worksheets/feedback";
import {
  enforceMinIntervalRateLimit,
  type RateLimitBinding,
} from "@/lib/rate-limit";

type EmailPayload = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};
type RuntimeEnv = {
  FEEDBACK_RATE_LIMITER?: RateLimitBinding;
  FEEDBACK_EMAIL?: {
    send(message: EmailPayload): Promise<{ messageId: string }>;
  };
  FEEDBACK_TO_EMAIL?: string;
  FEEDBACK_FROM_EMAIL?: string;
};
async function getRuntimeEnv(): Promise<RuntimeEnv> {
  try {
    const { env } = await import("cloudflare:workers");
    return env;
  } catch {
    return {};
  }
}
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const expected = new URL(request.url),
      actual = new URL(origin);
    if (actual.protocol !== expected.protocol) return false;
    if (actual.host === expected.host) return true;
    const local = new Set(["localhost", "127.0.0.1", "[::1]"]);
    return (
      local.has(actual.hostname) &&
      local.has(expected.hostname) &&
      actual.port === expected.port
    );
  } catch {
    return false;
  }
}
const validConfiguredEmail = (value: string) =>
  value.length <= 254 && /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(value);
export async function POST(request: NextRequest) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (
    !(request.headers.get("content-type") || "")
      .toLowerCase()
      .startsWith("application/json")
  )
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 415 },
    );
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 16_384)
    return NextResponse.json(
      { error: "Request is too large." },
      { status: 413 },
    );
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }
  if (new TextEncoder().encode(JSON.stringify(body)).byteLength > 16_384)
    return NextResponse.json(
      { error: "Request is too large." },
      { status: 413 },
    );
  const parsed = parseFeedbackInput(body);
  if (!parsed.ok)
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  if (parsed.honeypot) return NextResponse.json({ ok: true });
  const runtime = await getRuntimeEnv();
  const limited = await enforceMinIntervalRateLimit(request, {
    intervalMs: 20_000,
    keyPrefix: "feedback",
    binding: runtime.FEEDBACK_RATE_LIMITER,
    retryAfterSeconds: 60,
  });
  if (limited) return limited;
  const to = (
    runtime.FEEDBACK_TO_EMAIL ??
    process.env.FEEDBACK_TO_EMAIL ??
    ""
  ).trim();
  const from = (
    runtime.FEEDBACK_FROM_EMAIL ??
    process.env.FEEDBACK_FROM_EMAIL ??
    "feedback@gridhanzi.org"
  ).trim();
  if (
    !runtime.FEEDBACK_EMAIL ||
    !validConfiguredEmail(to) ||
    !validConfiguredEmail(from)
  )
    return NextResponse.json(
      { error: "Feedback email is not configured." },
      { status: 503 },
    );
  const metadata = normalizeMetadata(body);
  const email = buildFeedbackEmail(parsed.value, {
    ...metadata,
    submittedAt: new Date().toISOString(),
  });
  try {
    await runtime.FEEDBACK_EMAIL.send({
      to,
      from,
      subject: email.subject,
      text: email.text,
      html: email.html,
      ...(email.replyTo ? { replyTo: email.replyTo } : {}),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Feedback email failed.", error);
    return NextResponse.json(
      { error: "Feedback could not be sent. Please retry." },
      { status: 503 },
    );
  }
}
