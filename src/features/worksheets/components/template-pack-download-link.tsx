"use client";

import type { ReactNode } from "react";

import { trackTemplatePackDownloadClick } from "../analytics";
import {
  getReadyToPrintPdfHref,
  type ReadyToPrintTemplateSlug,
} from "../template-packs";

export function TemplatePackDownloadLink({
  slug,
  paperSize,
  className,
  children,
}: {
  slug: ReadyToPrintTemplateSlug;
  paperSize: "a4" | "letter";
  className: string;
  children: ReactNode;
}) {
  const href = getReadyToPrintPdfHref(slug, paperSize);
  return (
    <a
      href={href}
      download={`${slug}-${paperSize}.pdf`}
      className={className}
      onClick={() => trackTemplatePackDownloadClick(slug, paperSize)}
    >
      {children}
    </a>
  );
}


export function ClassroomDownloadLink({ mode }: { mode: import("../classroom-example").ClassroomMode }) {
  return (
    <a
      href={`/downloads/classroom/${mode}.pdf`}
      download={`gridhanzi-classroom-${mode}-a4.pdf`}
      className="hs-secondary-button mt-4"
      onClick={() => trackTemplatePackDownloadClick(`classroom-${mode}`, "a4")}
    >
      Download PDF · A4 · 1 page
    </a>
  );
}
