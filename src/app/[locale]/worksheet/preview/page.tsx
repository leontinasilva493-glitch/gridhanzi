import type { Metadata } from "next";

import { PrintPreviewClient } from "@/features/worksheets/components/print-preview-client";

export const metadata: Metadata = {
  title: "Worksheet Print Preview",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrintPreviewPage() {
  return <PrintPreviewClient />;
}

