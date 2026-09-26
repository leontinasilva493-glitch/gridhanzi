import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrintPreviewClient } from "@/features/worksheets/components/print-preview-client";
import { getTemplateBySlug } from "@/features/worksheets/engine";
import { createTemplatePreviewSnapshot } from "@/features/worksheets/template-packs";

export const metadata: Metadata = {
  title: "Worksheet Print Preview",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PrintPreviewPage({ searchParams }: {
  searchParams: Promise<{ template?: string; paper?: string }>;
}) {
  const { template: slug, paper } = await searchParams;
  const template = slug ? getTemplateBySlug(slug) : undefined;
  if (slug && !template) notFound();

  const paperSize = paper === "letter" ? "letter" : "a4";
  return (
    <PrintPreviewClient
      templateSnapshot={template ? createTemplatePreviewSnapshot(template, paperSize) : undefined}
      templateSlug={template?.slug}
    />
  );
}

