"use client";

import { UiText } from "./ui-text";
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
      <UiText>{({ trace: "Download Learn PDF", write: "Download Practice PDF", quiz: "Download Recall Test PDF" })[mode]}</UiText>
    </a>
  );
}
