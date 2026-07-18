import { cn } from "@/lib/utils";

export function SealMark({
  text = "汉字\n字帖",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid size-10 shrink-0 place-items-center whitespace-pre-line rounded-[4px] border-2 border-[#bd2c26] text-center font-serif text-[11px] font-bold leading-[0.95] text-[#bd2c26]",
        className,
      )}
    >
      {text}
    </span>
  );
}
