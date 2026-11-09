import { learningDirectoryPaths } from "./learning-directories";
import { p1GuidePaths } from "./p1-learning-pages";
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
    "/huong-dan-tao-giay-luyen-viet-tieng-trung",
    "/english-to-chinese-writing-practice",
    "/templates",
    "/grids",
    ...gridPaperPages.map((page) => `/grids/${page.slug}`),
    "/stroke-order",
    "/chinese-stroke-order-dictionary",
    ...learningDirectoryPaths,
    ...buildStrokeOrderSitemapPaths(),
    ...p1GuidePaths,
    "/hsk",
    "/hsk/3-0-exam-guide",
    "/hsk/3-0-writing-characters",
    ...hskPublicPages.map(getHskPublicPath),
    "/hsk-level-checker",
    "/compare",
    ...comparisonPages.map((page) => `/compare/${page.slug}`),
    "/chinese-slang/niu-lai",
    "/shenzhen-in-chinese",
    "/thank-you-in-chinese",
    "/chinese-stroke-order-rules",
    "/chinese-character-components",
    ...characterComponentPages.map((page) => `/components/${page.slug}`),
    "/for-teachers",
    "/sources",
    ...worksheetTemplates.map((template) => `/templates/${template.slug}`),
  ];
}

export function toAbsoluteUrl(baseUrl: string, pathname: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${pathname.replace(/^\/+/, "")}`;
}

export type WorksheetSearchParams = Readonly<Record<string, string | string[] | undefined>>;

const worksheetStateParameters: Readonly<Record<string, ReadonlySet<string>>> = {
  "/generator": new Set([
    "learning", "words", "template", "practiceset", "mode", "profile", "difficulty",
    "auto", "hsksystem", "hsklevel", "script", "grid", "resume",
  ]),
  "/stroke-order": new Set(["character", "mode"]),
};

export function hasWorksheetStateQuery(
  pathname: string,
  searchParams: WorksheetSearchParams = {},
): boolean {
  const keys = worksheetStateParameters[pathname];
  // Presence is intentional: empty/repeated business parameters are still
  // state URLs. Tracking parameters alone do not change public indexability.
  return Boolean(keys && Object.keys(searchParams).some((key) => keys.has(key.toLowerCase())));
}

export function buildPageSeoMetadata(
  baseUrl: string,
  pathname: string,
  locale: string,
  options: {
    chineseIndexable?: boolean;
    title?: string;
    description?: string;
    searchParams?: WorksheetSearchParams;
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
    ...((locale === "zh" && !chineseIndexable) || hasWorksheetStateQuery(englishPath, options.searchParams)
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
