import { cn } from "@/lib/utils";

import type { WorksheetEntry } from "../types";

export function WorksheetCardPreview({
  entries,
  title,
  chineseTitle,
  className,
}: {
  entries: WorksheetEntry[];
  title: string;
  chineseTitle: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded border border-[#d8d0c3] bg-[#fffdf8] shadow-sm",
        className,
      )}
      aria-label={`${title} worksheet preview`}
    >
      <div className="border-b border-[#ded7ca] bg-[#f5eddf] px-3 py-2 text-center">
        <p className="hs-display truncate text-sm font-bold text-[#17304f]">
          {title}
        </p>
        <p className="truncate font-serif text-xs text-[#8b302b]">
          {chineseTitle}
        </p>
      </div>
      <div className="divide-y divide-[#e7e0d5]">
        {entries.slice(0, 3).map((entry) => (
          <div
            key={entry.id}
            className="grid min-h-14 grid-cols-[2.6rem_minmax(0,1fr)] items-center gap-3 px-3 py-2"
          >
            <span className="grid size-10 place-items-center border border-[#c9bca8] bg-white font-serif text-xl text-[#17304f]">
              {entry.hanzi.slice(0, 1)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[#405269]">
                {entry.pinyin}
              </span>
              <span className="block truncate text-xs text-[#6a7586]">
                {entry.english}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
