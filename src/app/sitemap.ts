import type { MetadataRoute } from "next";

import { envConfigs } from "@/config";
import { buildPublicSitemapPaths, toAbsoluteUrl } from "@/features/worksheets/seo";

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
        url: englishUrl,
        ...(pathname === "/generator"
          ? { alternates: { languages: generatorLanguages } }
          : {}),
      };
    },
  );

  entries.push({
    url: generatorLanguages.zh,
    alternates: {
      languages: generatorLanguages,
    },
  });

  return entries;
}
