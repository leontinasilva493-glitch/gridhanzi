import { isProductionAnalyticsHost } from "../../components/analytics/host";
import type { WorksheetSettings } from "./types";

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
      row_count: rowCount,
      page_location: window.location.origin + window.location.pathname,
    });
  } catch {
    // Optional analytics must never interrupt editing or exporting.
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
