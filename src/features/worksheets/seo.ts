import { worksheetTemplates } from "./data";

export function buildPublicSitemapPaths(): string[] {
  return [
    "/",
    "/generator",
    "/templates",
    "/stroke-order",
    ...worksheetTemplates.map((template) => `/templates/${template.slug}`),
  ];
}

export function toAbsoluteUrl(baseUrl: string, pathname: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${pathname.replace(/^\/+/, "")}`;
}
