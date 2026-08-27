import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { ForTeachersPage } from "@/features/worksheets/components/for-teachers-page";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = "Chinese Worksheets for Teachers";
  const description =
    "Create editable Chinese handwriting worksheets, tracing pages, and short recall tests from your own classroom word list.";
  const pageSeo = buildPageSeoMetadata(
    envConfigs.app_url,
    "/for-teachers",
    locale,
    { title, description },
  );
  return {
    ...pageSeo,
    title,
    description,
    openGraph: {
      ...pageSeo.openGraph,
      title,
      description,
    },
  };
}

export default function Page() {
  return <ForTeachersPage />;
}
