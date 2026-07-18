import type { MetadataRoute } from "next";

import { envConfigs } from "@/config";
import { buildPublicSitemapPaths, toAbsoluteUrl } from "@/features/worksheets/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildPublicSitemapPaths().map((pathname) => ({
    url: toAbsoluteUrl(envConfigs.app_url, pathname),
    changeFrequency: pathname.startsWith("/templates/") ? "monthly" : "weekly",
    priority:
      pathname === "/"
        ? 1
        : pathname === "/generator"
          ? 0.95
          : pathname === "/templates"
            ? 0.9
            : 0.75,
  }));
}
