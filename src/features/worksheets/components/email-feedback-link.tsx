"use client";

import { useState } from "react";
import { Mail, X } from "lucide-react";
import { useLocale } from "next-intl";

import { isChineseLocale } from "../i18n";

const email = "support@gridhanzi.org";

export function EmailFeedbackLink() {
  const chinese = isChineseLocale(useLocale());
  const [status, setStatus] = useState<"copied" | "failed" | null>(null);
  const label = chinese
    ? "邮件反馈：复制邮箱并打开邮件应用"
    : "Email feedback: copy address and open email app";

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="relative shrink-0">
      <a
        href={`mailto:${email}`}
        onClick={() => { void copyAddress(); }}
        aria-label={label}
        title={`${label} — ${email}`}
        className="grid size-10 place-items-center rounded border border-[#d8d0c2] bg-white text-[#17253c] transition-colors hover:border-[#b62822] hover:text-[#b62822] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b62822]"
      >
        <Mail className="size-5" aria-hidden="true" />
      </a>
      {status ? (
        <div className="absolute right-0 top-12 z-50 w-60 rounded border border-[#d8d0c2] bg-white p-3 text-sm text-[#17253c] shadow-lg">
          <button
            type="button"
            aria-label={chinese ? "关闭提示" : "Dismiss notification"}
            onClick={() => setStatus(null)}
            className="float-right ml-1 grid size-6 place-items-center rounded hover:bg-[#f7f1e7]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
          <div role="status">
            <p>{status === "copied"
              ? (chinese ? "邮箱已复制" : "Email address copied")
              : (chinese ? "无法自动复制，请手动复制：" : "Could not copy. Please copy manually:")}</p>
            <p className="mt-1 select-text break-all font-medium">{email}</p>
            <p className="mt-2 text-xs text-[#566276]">{chinese
              ? "若邮件应用未打开，可将此地址粘贴到常用邮箱写信。"
              : "If no email app opens, paste this address into your usual mailbox."}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
