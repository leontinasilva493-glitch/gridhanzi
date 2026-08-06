export function isChineseLocale(locale: string): boolean {
  return locale.toLocaleLowerCase().startsWith("zh");
}

export function localize(locale: string, english: string, chinese: string): string {
  return isChineseLocale(locale) ? chinese : english;
}

export function switchLocalePath(pathname: string, target: "en" | "zh"): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withoutLocale = normalized.replace(/^\/(?:en|zh)(?=\/|$)/, "") || "/";

  if (target === "en") return withoutLocale;
  return withoutLocale === "/" ? "/zh" : `/zh${withoutLocale}`;
}
