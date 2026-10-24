import { isProductionAnalyticsHost } from "../../components/analytics/host";
import type { WorksheetSettings } from "./types";
import type { FeedbackContext } from "./feedback";

/** Allowlisted action categories only. No free text, roles, emails or worksheet data. */
export function trackHelpEvent(
  event: "worksheet_help_open" | "worksheet_help_action" | "worksheet_feedback_sent" | "worksheet_use_selected",
  source: FeedbackContext["source"],
  action: "adjust" | "help" | "size" | "words" | "pinyin" | "strokes" | "layout" | "print" | "request" | "problem" | "recommendation",
  useCase?: FeedbackContext["useCase"],
) {
  if (typeof window === "undefined" || !isProductionAnalyticsHost(window.location.hostname)) return;
  try {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", event, {
      help_source: source, help_action: action, ...(useCase ? { worksheet_use: useCase } : {}),
      page_location: window.location.origin + window.location.pathname,
    });
  } catch {
    // Optional analytics must never prevent help or submission.
  }
}

type WorksheetEvent = "worksheet_editor_open" | "worksheet_preview_open" | "worksheet_review_blocked" |
  "worksheet_download_start" | "worksheet_download_success" | "worksheet_download_failure";

/** Only aggregate fields; never vocabulary, titles, names, or error messages. */
export function trackWorksheetEvent(event: WorksheetEvent, settings: WorksheetSettings, rowCount: number) {
  if (typeof window === "undefined" || !isProductionAnalyticsHost(window.location.hostname)) return;
  const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void };
  try {
    analyticsWindow.gtag?.("event", event, {
      worksheet_mode: settings.mode,
      worksheet_output: settings.output,
      paper_size: settings.paperSize,
      row_count: rowCount,
      page_location: window.location.origin + window.location.pathname,
    });
  } catch {
    // Optional analytics must never interrupt editing or exporting.
  }
  try {
    const clarityWindow = window as Window & { clarity?: (...args: unknown[]) => void };
    clarityWindow.clarity?.("event", event);
  } catch {
    // Clarity is optional and must never interrupt editing or exporting.
  }
}

export function trackTemplatePackDownloadClick(
  templateSlug: string,
  paperSize: "a4" | "letter",
) {
  if (typeof window === "undefined" || !isProductionAnalyticsHost(window.location.hostname)) return;
  const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void };
  try {
    analyticsWindow.gtag?.("event", "worksheet_pack_download_click", {
      template_slug: templateSlug,
      paper_size: paperSize,
      page_location: window.location.origin + window.location.pathname,
    });
  } catch {
    // Optional analytics must never interrupt a download.
  }
}

type DictionaryEvent =
  | "dictionary_search"
  | "dictionary_filter_used"
  | "dictionary_guide_open"
  | "dictionary_worksheet_open";

/** Dictionary events contain counts only, never a character, query, or meaning. */
export function trackDictionaryEvent(
  event: DictionaryEvent,
  resultCount: number,
  activeFilterCount: number,
) {
  if (typeof window === "undefined" || !isProductionAnalyticsHost(window.location.hostname)) return;
  const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void };
  try {
    analyticsWindow.gtag?.("event", event, {
      result_count: resultCount,
      active_filter_count: activeFilterCount,
      page_location: window.location.origin + window.location.pathname,
    });
  } catch {
    // Optional analytics must never interrupt dictionary browsing.
  }
}
