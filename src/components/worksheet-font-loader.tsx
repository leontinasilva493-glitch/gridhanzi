"use client";

import { useEffect } from "react";

const FONT_STYLESHEET = "https://cdn.jsdelivr.net/npm/lxgw-wenkai-gb-web@1.522.0/style.css";

export function WorksheetFontLoader() {
  useEffect(() => {
    const preload = document.querySelector<HTMLLinkElement>("link[data-gridhanzi-font]");
    if (preload) {
      preload.rel = "stylesheet";
      return;
    }
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = FONT_STYLESHEET;
    stylesheet.dataset.gridhanziFont = "true";
    document.head.append(stylesheet);
  }, []);

  return null;
}
