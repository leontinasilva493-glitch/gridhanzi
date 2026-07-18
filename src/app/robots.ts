import type { MetadataRoute } from "next";

import { envConfigs } from "@/config";
import { toAbsoluteUrl } from "@/features/worksheets/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/worksheet/preview", "/zh/worksheet/preview"],
    },
    sitemap: toAbsoluteUrl(envConfigs.app_url, "/sitemap.xml"),
  };
}
