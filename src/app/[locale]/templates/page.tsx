import type { Metadata } from "next";

import { TemplatesPage } from "@/features/worksheets/components/templates-page";
import { worksheetTemplates } from "@/features/worksheets/data";

export const metadata: Metadata = {
  title: "Printable Chinese Writing Worksheets",
  description:
    "Browse editable Chinese tracing, handwriting, topic, kids, and HSK worksheet templates with Pinyin and stroke-order practice.",
};

export default function Page() {
  return <TemplatesPage templates={worksheetTemplates} />;
}
