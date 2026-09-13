import sitemap from "../../features/worksheets/sitemap";

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
  })[character]!);
}

export function GET(): Response {
  const entries = sitemap().map((entry) => {
    const alternates = Object.entries(entry.alternates?.languages ?? {}).map(
      ([language, url]) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(language)}" href="${escapeXml(String(url))}" />`,
    );
    return ["  <url>", `    <loc>${escapeXml(entry.url)}</loc>`, ...alternates, `    <priority>${entry.priority!.toFixed(1)}</priority>`, "  </url>"].join("\n");
  });
  return new Response([
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/css" href="/sitemap.css"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join("\n"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
