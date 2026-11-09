"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Bookmark, X } from "lucide-react";

const DISMISSED_KEY = "gridhanzi-bookmark-prompt-dismissed-v1";
const SHOW_DELAY_MS = 12_000;

export function BookmarkPrompt() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [shortcut, setShortcut] = useState("Ctrl + D");
  const [mobile, setMobile] = useState(false);
  const chinese = locale.startsWith("zh");

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISSED_KEY) === "1") return;
    } catch {
      // Storage is optional; the prompt remains usable without it.
    }

    const isMobile = /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent)
      || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    setMobile(isMobile);
    if (!isMobile && /Mac/.test(window.navigator.platform)) {
      setShortcut("⌘ + D");
    }
    const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Dismissal still applies for this visit when storage is blocked.
    }
  }

  if (!visible) return null;

  return (
    <aside
      aria-label={chinese ? "收藏 GridHanzi" : "Bookmark GridHanzi"}
      className="hs-no-print fixed bottom-4 right-4 z-[60] w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-[#d8d0c2] bg-[#fffdf8] p-4 text-[#172b46] shadow-[0_12px_36px_rgba(13,41,76,0.2)] sm:bottom-6 sm:right-6"
      role="status"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-lg bg-[#edf3f8] p-2 text-[#174b78]" aria-hidden="true">
          <Bookmark size={19} />
        </span>
        <div className="min-w-0 flex-1 pr-5">
          <p className="font-semibold">{chinese ? "下次练习更快找到我们" : "Find us faster next time"}</p>
          <p className="mt-1 text-sm leading-5 text-[#566276]">
            {chinese
              ? mobile
                ? "使用浏览器菜单将本页加入书签。"
                : <>按 <kbd className="rounded border border-[#d8d0c2] bg-white px-1.5 py-0.5 font-mono text-xs">{shortcut}</kbd>，或在浏览器菜单中选择添加书签。</>
              : mobile
                ? "Use your browser’s menu to add this page to bookmarks."
                : <>Save this page with <kbd className="rounded border border-[#d8d0c2] bg-white px-1.5 py-0.5 font-mono text-xs">{shortcut}</kbd>, or choose Add Bookmark from the browser menu.</>}
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="mt-3 min-h-10 rounded-md bg-[#174b78] px-3 text-sm font-semibold text-white hover:bg-[#10395e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174b78]"
          >
            {chinese ? "知道了" : "Got it"}
          </button>
        </div>
        <button
          type="button"
          aria-label={chinese ? "关闭书签提醒" : "Dismiss bookmark reminder"}
          onClick={dismiss}
          className="absolute right-2 top-2 grid size-9 place-items-center rounded-md text-[#566276] hover:bg-[#f1eee7] focus-visible:outline-2 focus-visible:outline-[#174b78]"
        >
          <X size={18} />
        </button>
      </div>
    </aside>
  );
}
