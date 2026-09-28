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
