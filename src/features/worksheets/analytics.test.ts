import assert from "node:assert/strict";
import test from "node:test";
import { trackDictionaryEvent, trackHelpEvent, trackWorksheetEvent } from "./analytics";
import { defaultWorksheetSettings } from "./types";

test("business events use aggregate fields and a query-free page URL", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const calls: unknown[][] = [];
  try {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {
      location: { hostname: "gridhanzi.org", origin: "https://gridhanzi.org", pathname: "/generator", search: "?words=private" },
      gtag: (...args: unknown[]) => calls.push(args),
    } });
    trackWorksheetEvent("worksheet_download_success", { ...defaultWorksheetSettings, title: "PRIVATE TITLE", studentName: "PRIVATE NAME" }, 2);
    assert.deepEqual(calls, [["event", "worksheet_download_success", {
      worksheet_mode: "trace", worksheet_output: "worksheet", paper_size: "a4", row_count: 2, page_location: "https://gridhanzi.org/generator",
    }]]);
    calls.length = 0;
    trackHelpEvent("worksheet_use_selected", "templates", "recommendation", "child");
    assert.deepEqual(calls, [["event", "worksheet_use_selected", {
      help_source: "templates", help_action: "recommendation", worksheet_use: "child", page_location: "https://gridhanzi.org/generator",
    }]]);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
test("export failures add only allowlisted diagnostics", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const calls: unknown[][] = [];
  try {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {
      location: { hostname: "gridhanzi.org", origin: "https://gridhanzi.org", pathname: "/worksheet/preview" },
      gtag: (...args: unknown[]) => calls.push(args),
    } });
    trackWorksheetEvent("worksheet_download_failure", defaultWorksheetSettings, 3, {
      failureStage: "capture", pageCount: 6, elapsedMs: 1234.6, wasHidden: true,
    });
    assert.deepEqual(calls, [["event", "worksheet_download_failure", {
      worksheet_mode: "trace", worksheet_output: "worksheet", paper_size: "a4", row_count: 3,
      failure_stage: "capture", page_count: 6, elapsed_ms: 1235, was_hidden: "yes",
      page_location: "https://gridhanzi.org/worksheet/preview",
    }]]);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
test("disabled or broken analytics does not interrupt the worksheet", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  try {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {
      location: { hostname: "localhost" }, gtag: () => { throw new Error("must not send"); },
    } });
    assert.doesNotThrow(() => trackWorksheetEvent("worksheet_editor_open", defaultWorksheetSettings, 1));
    assert.doesNotThrow(() => trackHelpEvent("worksheet_help_open", "preview", "help"));
    Object.defineProperty(globalThis, "window", { configurable: true, value: {
      location: { hostname: "gridhanzi.org" }, gtag: () => { throw new Error("blocked"); },
    } });
    assert.doesNotThrow(() => trackWorksheetEvent("worksheet_editor_open", defaultWorksheetSettings, 1));
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("dictionary analytics sends counts without a searched character or query string", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const calls: unknown[][] = [];
  try {
    Object.defineProperty(globalThis, "window", { configurable: true, value: {
      location: { hostname: "gridhanzi.org", origin: "https://gridhanzi.org", pathname: "/chinese-stroke-order-dictionary", search: "?q=private" },
      gtag: (...args: unknown[]) => calls.push(args),
    } });
    trackDictionaryEvent("dictionary_guide_open", 4, 2);
    assert.deepEqual(calls, [["event", "dictionary_guide_open", {
      result_count: 4,
      active_filter_count: 2,
      page_location: "https://gridhanzi.org/chinese-stroke-order-dictionary",
    }]]);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
