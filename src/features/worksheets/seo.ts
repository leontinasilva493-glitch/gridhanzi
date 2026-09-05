import type { Metadata } from "next";

import { worksheetTemplates } from "./data";
import { gridPaperPages } from "./grid-pages";
import { getHskPublicPath, hskPublicPages } from "./hsk-pages";
import { comparisonPages } from "./comparison-pages";
import { characterComponentPages } from "./character-components";
import {
  filterIndexableStrokeOrderCharacters,
  indexableStrokeOrderCharacters,
  type StrokeOrderPublicationStatus,
} from "./stroke-order-characters";

export function buildStrokeOrderSitemapPaths(
  entries: ReadonlyArray<{
    character: string;
    publicationStatus: StrokeOrderPublicationStatus;
  }> = indexableStrokeOrderCharacters,
): string[] {
  return filterIndexableStrokeOrderCharacters(entries).map(
    (entry) => `/stroke-order/${entry.character}`,
  );
}

export function buildPublicSitemapPaths(): string[] {
  return [
    "/",
    "/generator",
    "/english-to-chinese-writing-practice",
    "/templates",
    "/grids",
    ...gridPaperPages.map((page) => `/grids/${page.slug}`),
    "/stroke-order",
    ...buildStrokeOrderSitemapPaths(),
    "/hsk",
    ...hskPublicPages.map(getHskPublicPath),
    "/hsk-level-checker",
    "/compare",
    ...comparisonPages.map((page) => `/compare/${page.slug}`),
    "/chinese-slang/niu-lai",
    "/chinese-stroke-order-rules",
    "/chinese-character-components",
    ...characterComponentPages.map((page) => `/components/${page.slug}`),
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
  options: {
    chineseIndexable?: boolean;
    title?: string;
    description?: string;
  } = {},
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
      ...(options.title ? { title: options.title } : {}),
      ...(options.description ? { description: options.description } : {}),
      images: [
        {
          url: toAbsoluteUrl(baseUrl, "/og-gridhanzi.png"),
          width: 1200,
          height: 630,
          alt: "GridHanzi Chinese character practice sheet generator",
        },
      ],
    },
    ...(options.title && options.description
      ? {
          twitter: {
            card: "summary_large_image" as const,
            title: options.title,
            description: options.description,
            images: [toAbsoluteUrl(baseUrl, "/og-gridhanzi.png")],
          },
        }
      : {}),
  };
}
