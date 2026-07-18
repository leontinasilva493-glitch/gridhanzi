"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

import { isChineseLocale, switchLocalePath } from "../i18n";

export function LocaleSwitch() {
  const locale = useLocale();
  const pathname = usePathname() || "/";
  const chinese = isChineseLocale(locale);

  return (
    <div className="flex items-center rounded border border-[#d8d0c2] bg-white p-0.5 text-xs font-semibold" aria-label="Language">
      <a
        href={switchLocalePath(pathname, "en")}
        aria-current={!chinese ? "page" : undefined}
        className={`rounded px-2 py-1.5 ${!chinese ? "bg-[#17304f] text-white" : "text-[#526174]"}`}
      >
        EN
      </a>
      <a
        href={switchLocalePath(pathname, "zh")}
        aria-current={chinese ? "page" : undefined}
        className={`rounded px-2 py-1.5 ${chinese ? "bg-[#17304f] text-white" : "text-[#526174]"}`}
      >
        中文
      </a>
    </div>
  );
}
