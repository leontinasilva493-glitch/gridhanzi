"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { X } from "lucide-react";

const DISMISSED_KEY = "gridhanzi-bookmark-prompt-dismissed-v1";
const SHOW_DELAY_MS = 12_000;

function isMobileOrTabletDevice() {
  const { platform, userAgent, maxTouchPoints } = window.navigator;
  const appleTablet = platform === "MacIntel" && maxTouchPoints > 1;

  return appleTablet || /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(userAgent);
}

export function BookmarkPrompt() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [shortcut, setShortcut] = useState("Ctrl + D");
  const chinese = locale.startsWith("zh");

  useEffect(() => {
    if (isMobileOrTabletDevice()) return;

    try {
      if (window.localStorage.getItem(DISMISSED_KEY) === "1") return;
    } catch {
      // Storage is optional; the prompt remains usable without it.
    }

    if (/Mac/.test(window.navigator.platform)) {
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
      className="hs-no-print fixed right-3 top-[min(75vh,calc(100dvh-6rem))] z-[60] w-[min(20rem,calc(100vw-1.5rem))] -translate-y-1/2 rounded-[1.125rem] border border-white/10 bg-[#222] px-4 py-3.5 text-[#f3f1e5] shadow-[0_14px_38px_rgba(0,0,0,0.36)] sm:right-6 sm:w-[min(22rem,calc(100vw-3rem))] sm:px-5 sm:py-4"
      role="status"
    >
      <div className="min-w-0 pr-7">
        <p className="text-sm font-semibold tracking-tight sm:text-base">
          {chinese ? "把 GridHanzi 加入书签" : "Bookmark GridHanzi"}
        </p>
        <p className="mt-1.5 text-xs leading-5 text-[#b6b6b1] sm:text-sm">
          {chinese
            ? <>按 <kbd className="rounded-md border border-white/15 bg-[#171717] px-1.5 py-0.5 font-mono text-[0.7rem] text-[#ecebdc]">{shortcut}</kbd> 收藏，下次直达。</>
            : <>Press <kbd className="rounded-md border border-white/15 bg-[#171717] px-1.5 py-0.5 font-mono text-[0.7rem] text-[#ecebdc]">{shortcut}</kbd> to save for next time.</>}
        </p>
        <button
          type="button"
          aria-label={chinese ? "关闭书签提醒" : "Dismiss bookmark reminder"}
          onClick={dismiss}
          className="absolute right-2 top-2 grid size-8 place-items-center rounded-full text-[#a8a8a3] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d6d3bf] sm:right-2.5 sm:top-2.5"
        >
          <X size={18} />
        </button>
      </div>
    </aside>
  );
}
