import assert from "node:assert/strict";
import test from "node:test";
import { trackWorksheetEvent } from "./analytics";
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
      worksheet_mode: "trace", worksheet_output: "worksheet", row_count: 2, page_location: "https://gridhanzi.org/generator",
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
    Object.defineProperty(globalThis, "window", { configurable: true, value: {
      location: { hostname: "gridhanzi.org" }, gtag: () => { throw new Error("blocked"); },
    } });
    assert.doesNotThrow(() => trackWorksheetEvent("worksheet_editor_open", defaultWorksheetSettings, 1));
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
