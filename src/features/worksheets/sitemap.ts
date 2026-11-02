import { p1BilingualPaths } from "./p1-learning-pages";
import type { MetadataRoute } from "next";

import { envConfigs } from "../../config";
import { buildPublicSitemapPaths, toAbsoluteUrl } from "./seo";

// Editorial navigation tiers, not measured Google ranking weights.
export function sitemapPriority(pathname: string): number {
  if (pathname === "/") return 1;
  if (["/generator", "/zh/generator", "/english-to-chinese-writing-practice"].includes(pathname)) return 0.9;
  if (["/templates", "/grids", "/stroke-order", "/hsk", "/hsk-level-checker", "/compare", "/for-teachers", "/chinese-character-components"].includes(pathname)) return 0.8;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const generatorLanguages = {
    en: toAbsoluteUrl(envConfigs.app_url, "/generator"),
    zh: toAbsoluteUrl(envConfigs.app_url, "/zh/generator"),
    "x-default": toAbsoluteUrl(envConfigs.app_url, "/generator"),
  };
  const entries: MetadataRoute.Sitemap = buildPublicSitemapPaths().map(
    (pathname) => {
      const englishUrl = toAbsoluteUrl(envConfigs.app_url, pathname);

      return {
        url: new URL(englishUrl).href,
        priority: sitemapPriority(pathname),
        ...(pathname === "/generator"
          ? { alternates: { languages: generatorLanguages } }
          : {}),
      };
    },
  );

  entries.push({
    url: generatorLanguages.zh,
    priority: sitemapPriority("/zh/generator"),
    alternates: {
      languages: generatorLanguages,
    },
  });

  for (const pathname of p1BilingualPaths) {
    const languages = {
      en: toAbsoluteUrl(envConfigs.app_url, pathname),
      zh: toAbsoluteUrl(envConfigs.app_url, `/zh${pathname}`),
      "x-default": toAbsoluteUrl(envConfigs.app_url, pathname),
    };
    const english = entries.find(entry => entry.url === new URL(languages.en).href);
    if (english) english.alternates = { languages };
    entries.push({ url: new URL(languages.zh).href, priority: sitemapPriority(pathname), alternates: { languages } });
  }
  return entries;
}
