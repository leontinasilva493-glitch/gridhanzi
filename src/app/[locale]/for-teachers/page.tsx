import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { ForTeachersPage } from "@/features/worksheets/components/for-teachers-page";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageSeo = buildPageSeoMetadata(
    envConfigs.app_url,
    "/for-teachers",
    locale,
  );
  return {
    ...pageSeo,
    title: "Chinese Worksheets for Teachers",
    description:
      "Create editable Chinese handwriting worksheets, tracing pages, and short recall tests from your own classroom word list.",
    openGraph: {
      ...pageSeo.openGraph,
      title: "Chinese Worksheets for Teachers",
      description:
        "Paste your classroom vocabulary, check the Hanzi and Pinyin, and download a printable Chinese worksheet.",
    },
  };
}

export default function Page() {
  return <ForTeachersPage />;
}
