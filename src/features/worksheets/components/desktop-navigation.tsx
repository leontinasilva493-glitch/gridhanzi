"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function DesktopNavigation({ children }: { children: ReactNode }) {
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const openMenu = () => nav.current?.querySelector<HTMLDetailsElement>("details[open]");
    function dismissOutside(event: PointerEvent) {
      const menu = openMenu();
      if (menu && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
    }
    function dismissWithEscape(event: KeyboardEvent) {
      const menu = openMenu();
      if (menu && event.key === "Escape" && !event.defaultPrevented) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissWithEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissWithEscape);
    };
  }, []);
  return <nav ref={nav} className="hidden items-stretch self-stretch xl:flex">{children}</nav>;
}
