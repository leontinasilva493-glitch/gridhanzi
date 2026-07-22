import type { ReactNode } from "react";
import { Menu } from "lucide-react";

import { Link } from "@/core/i18n/navigation";
import { cn } from "@/lib/utils";

import { LocaleSwitch } from "./locale-switch";

const navItems = [
  { href: "/generator", label: "Worksheet Maker", key: "generator" },
  { href: "/templates", label: "Templates", key: "templates" },
  { href: "/stroke-order", label: "Stroke Order", key: "stroke-order" },
] as const;

export function HanziSiteHeader({ active }: { active?: string }) {
  return (
    <header className="hs-no-print sticky top-0 z-50 border-b border-[#ded7ca] bg-[#fffdf8]/95 backdrop-blur">
      <div className="hs-container flex h-16 items-center justify-between gap-5">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="GridHanzi home"
        >
          <img
            src="/gridhanzi-horizontal.webp"
            alt="GridHanzi"
            width="1030"
            height="300"
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        <nav className="hidden items-stretch self-stretch lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "relative flex items-center px-5 text-sm font-medium text-[#17253c] transition-colors hover:text-[#b62822]",
                active === item.key &&
                  "text-[#b62822] after:absolute after:inset-x-5 after:bottom-0 after:h-0.5 after:bg-[#b62822]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitch />
          {active !== "generator" ? (
            <Link href="/generator" className="hs-primary-button min-h-10 px-4 py-2 text-sm">
              Create Worksheet
            </Link>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          {active !== "generator" ? (
            <Link href="/generator" className="hs-primary-button min-h-9 px-3 py-2 text-xs sm:text-sm">
              Create
            </Link>
          ) : null}
          <details className="relative">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded border border-[#d8d0c2] bg-white">
              <Menu className="size-5" />
              <span className="sr-only">Open navigation</span>
            </summary>
            <nav className="hs-card absolute right-0 top-12 grid w-64 overflow-hidden p-2">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="rounded px-3 py-2.5 text-sm font-medium hover:bg-[#f7f1e7]"
                >
                  {item.label}
                </Link>
              ))}
              {active !== "generator" ? (
                <div className="border-t border-[#ded7ca] p-2">
                  <Link href="/generator" className="hs-primary-button w-full text-sm">
                    Create Worksheet
                  </Link>
                </div>
              ) : null}
              <div className="border-t border-[#ded7ca] p-2">
                <LocaleSwitch />
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function HanziSiteFooter() {
  return (
    <footer className="hs-no-print mt-16 bg-[#0d294c] text-white">
      <div className="hs-container grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/gridhanzi-icon-128.png"
              alt=""
              aria-hidden="true"
              width="128"
              height="128"
              className="size-12 rounded-xl"
            />
            <span className="font-serif text-2xl font-bold tracking-tight">
              GridHanzi
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-blue-100/75">
            Make a Chinese worksheet from your own word list. Edit it, print
            it, and use it again when the class is ready to review.
          </p>
        </div>
        <FooterColumn
          title="Templates"
          links={[
            ["Family", "/templates/family"],
            ["Numbers", "/templates/numbers"],
            ["Colors", "/templates/colors"],
            ["All templates", "/templates"],
          ]}
        />
        <FooterColumn
          title="Teaching tools"
          links={[
            ["Worksheet Generator", "/generator"],
            ["Stroke Order", "/stroke-order"],
            ["Practice Types", "/#practice-types"],
          ]}
        />
        <FooterColumn
          title="Resources"
          links={[
            ["For Teachers", "/for-teachers"],
            ["Learning Tips", "/templates"],
            ["FAQ", "/#faq"],
          ]}
        />
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-blue-100/55">
        © 2026 GridHanzi · gridhanzi.org
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<[string, string]>;
}) {
  return (
    <div>
      <h2 className="font-serif text-base font-bold">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-blue-100/75">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicPageShell({
  active,
  children,
  footer = true,
}: {
  active?: string;
  children: ReactNode;
  footer?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HanziSiteHeader active={active} />
      {children}
      {footer ? <HanziSiteFooter /> : null}
    </div>
  );
}
