import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { GeneratorClient } from "@/features/worksheets/components/generator-client";
import { StructuredData } from "@/features/worksheets/components/structured-data";
import { buildPageSeoMetadata, toAbsoluteUrl } from "@/features/worksheets/seo";
import type { WorksheetEntry } from "@/features/worksheets/types";

const pagePath = "/english-to-chinese-writing-practice";

const starterEntries: WorksheetEntry[] = [
  { id: "row-1", hanzi: "\u5bb6\u5ead", pinyin: "jia ting", english: "family", status: "complete" },
  { id: "row-2", hanzi: "\u8001\u5e08", pinyin: "lao shi", english: "teacher", status: "complete" },
  { id: "row-3", hanzi: "\u5b66\u751f", pinyin: "xue sheng", english: "student", status: "complete" },
  { id: "row-4", hanzi: "\u4e2d\u56fd", pinyin: "Zhong guo", english: "China", status: "complete" },
  { id: "row-5", hanzi: "\u4e2d\u6587", pinyin: "Zhong wen", english: "Chinese language", status: "complete" },
  { id: "row-6", hanzi: "\u5199", pinyin: "xie", english: "write", status: "complete" },
  { id: "row-7", hanzi: "\u8bfb", pinyin: "du", english: "read", status: "complete" },
  { id: "row-8", hanzi: "\u8bf7", pinyin: "qing", english: "please", status: "complete" },
];

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageSeo = buildPageSeoMetadata(envConfigs.app_url, pagePath, locale);
  const title = "English to Chinese Writing Practice";
  const description =
    "Turn English vocabulary into an editable Chinese writing practice worksheet with Hanzi, Pinyin, tracing grids, and printable PDF output.";

  return {
    ...pageSeo,
    title,
    description,
    openGraph: {
      ...pageSeo.openGraph,
      title,
      description,
      type: "website",
      siteName: "GridHanzi",
      images: ["/og-gridhanzi.png"],
    },
  };
}

export default function Page() {
  const pageUrl = toAbsoluteUrl(envConfigs.app_url, pagePath);

  return (
    <>
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "English to Chinese Writing Practice",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            isAccessibleForFree: true,
            url: pageUrl,
            description:
              "Create editable Chinese writing practice worksheets from English vocabulary with Hanzi, Pinyin, writing grids, and PDF output.",
            featureList: [
              "Starter English vocabulary mapped to editable Hanzi rows",
              "Pinyin and English meaning review before printing",
              "Tracing, handwriting practice, and recall test modes",
              "Tian Zi Ge and Mi Zi Ge writing grids",
              "Printable PDF worksheet output",
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: toAbsoluteUrl(envConfigs.app_url, "/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "English to Chinese Writing Practice",
                item: pageUrl,
              },
            ],
          },
        ]}
      />
      <GeneratorClient
        initialEntries={starterEntries}
        initialMode="trace"
        initialProfile="adult"
        pageTitle="English to Chinese Writing Practice"
        pageDescription="Start with English vocabulary, review the matched Hanzi and Pinyin, then customize the writing grid before printing a practice worksheet."
        breadcrumbLabel="English to Chinese Practice"
        templateTitle="English to Chinese Writing Practice"
        templateChineseTitle="\u82f1\u6587\u8f6c\u4e2d\u6587\u7ec3\u4e60"
      />
    </>
  );
}
