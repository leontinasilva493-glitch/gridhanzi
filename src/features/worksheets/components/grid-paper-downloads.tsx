"use client";

import { Download } from "lucide-react";

import { trackTemplatePackDownloadClick } from "../analytics";
import { UiText } from "./ui-text";

export function GridPaperDownloads({ pdfHref, slug }: { pdfHref: string; slug: string }) {
  const formats = [
    { size: "a4", label: "A4 PDF", href: pdfHref },
    { size: "letter", label: "US Letter PDF", href: pdfHref.replace(/\.pdf$/, "-letter.pdf") },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {formats.map(({ size, label, href }) => (
        <a
          key={size}
          href={href}
          download
          className="hs-secondary-button"
          onClick={() => trackTemplatePackDownloadClick(`grid-paper-${slug}`, size)}
        >
          <Download className="size-4" aria-hidden="true" />
          <UiText>{label}</UiText>
        </a>
      ))}
    </div>
  );
}
