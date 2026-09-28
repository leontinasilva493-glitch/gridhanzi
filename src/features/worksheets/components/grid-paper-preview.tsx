import type { GridPaperPage } from "../grid-pages";

export function GridPaperPreview({ page }: { page: GridPaperPage }) {
  return (
    <div className="overflow-hidden rounded border border-[#d9d0c2] bg-[#ebe2d5] p-3 sm:p-5">
      <img
        src={page.pdfHref.replace(/\.pdf$/, ".svg")}
        alt={`${page.previewTitle} printable PDF preview`}
        className="block w-full bg-white shadow-sm"
      />
    </div>
  );
}
