import { useLocale } from "next-intl";
import { translateUi } from "../ui-copy";

/** Locale-aware visible copy; learning vocabulary itself is never translated. */
export function UiText({ children }: { children: string }) {
  return <span data-gridhanzi-ui="true">{translateUi(useLocale(), children)}</span>;
}

export function PageNumber({ page, total }: { page: number; total: number }) {
  return useLocale().startsWith("zh") ? `第 ${page} 页，共 ${total} 页` : `Page ${page} of ${total}`;
}
