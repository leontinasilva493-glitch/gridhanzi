import type { Metadata } from "next";

import { worksheetTemplates } from "./data";
import { strokeOrderCharacters } from "./stroke-order-characters";

export function buildPublicSitemapPaths(): string[] {
  return [
    "/",
    "/generator",
    "/templates",
    "/stroke-order",
    ...strokeOrderCharacters.map(
      (entry) => `/stroke-order/${entry.character}`,
    ),
    "/for-teachers",
    ...worksheetTemplates.map((template) => `/templates/${template.slug}`),
  ];
}

export function toAbsoluteUrl(baseUrl: string, pathname: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${pathname.replace(/^\/+/, "")}`;
}

export function buildPageSeoMetadata(
  baseUrl: string,
  pathname: string,
  locale: string,
  options: { chineseIndexable?: boolean } = {},
): Metadata {
  const englishPath = pathname === "/" ? "/" : `/${pathname.replace(/^\/+/, "")}`;
  const localizedPath =
    locale === "zh"
      ? englishPath === "/"
        ? "/zh"
        : `/zh${englishPath}`
      : englishPath;
  const canonical = toAbsoluteUrl(baseUrl, localizedPath);
  const chineseIndexable = options.chineseIndexable === true;

  return {
    alternates: {
      canonical,
      ...(chineseIndexable
        ? {
            languages: {
              en: toAbsoluteUrl(baseUrl, englishPath),
              zh: toAbsoluteUrl(
                baseUrl,
                englishPath === "/" ? "/zh" : `/zh${englishPath}`,
              ),
              "x-default": toAbsoluteUrl(baseUrl, englishPath),
            },
          }
        : {}),
    },
    ...(locale === "zh" && !chineseIndexable
      ? { robots: { index: false, follow: true } }
      : {}),
    openGraph: {
      url: canonical,
      siteName: "GridHanzi",
      type: "website",
      images: [
        {
          url: toAbsoluteUrl(baseUrl, "/og-gridhanzi.png"),
          width: 1200,
          height: 630,
          alt: "GridHanzi Chinese character practice sheet generator",
        },
      ],
    },
  };
}
