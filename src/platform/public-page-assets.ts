export interface PublicPageManifest {
  build: string;
  compatibilityId: string;
  routes: string[];
  params?: Record<string, string>;
}
export interface AssetBinding { fetch(request: Request): Promise<Response> }

export function publicPageAssetPath(pathname: string, rsc: boolean): string {
  const key = Array.from(new TextEncoder().encode(pathname), byte => byte.toString(16).padStart(2, "0")).join("");
  return `/_public-pages/${key}.${rsc ? "rsc" : "html"}`;
}

export function eligiblePublicRequest(request: Request): boolean {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (request.headers.has("authorization") || request.headers.has("next-action")) return false;
  if (request.headers.has("x-vinext-mounted-slots") || request.headers.has("next-router-segment-prefetch")) return false;
  // Vinext sends the previous URL in interception-context on every normal
  // navigation. The build rejects parallel/intercepting routes, so this cannot
  // change any generated page's tree in this project.
  const mode = request.headers.get("x-vinext-rsc-render-mode");
  if (mode && mode !== "navigation") return false;
  // Only tracking and the framework's RSC cache buster are presentation-neutral.
  for (const key of new URL(request.url).searchParams.keys()) {
    if (!/^utm_[a-z_]+$/i.test(key) && !["_rsc", "gclid", "fbclid", "msclkid"].includes(key)) return false;
  }
  return true;
}

export async function readPublicPage(request: Request, assets: AssetBinding, manifest: PublicPageManifest): Promise<Response | undefined> {
  if (!eligiblePublicRequest(request)) return undefined;
  const url = new URL(request.url);
  if (/%2f|%5c/i.test(url.pathname) || url.pathname.includes("//")) return undefined;
  const rsc = url.pathname.endsWith(".rsc") || request.headers.get("rsc") === "1" || request.headers.get("accept")?.includes("text/x-component") === true;
  let pathname: string;
  try { pathname = decodeURIComponent(url.pathname.endsWith(".rsc") ? url.pathname.slice(0, -4) : url.pathname); } catch { return undefined; }
  // Exact paths only: leave canonical redirects, unknown URLs and parameterised
  // editors to Vinext. Locale is part of the manifest key, not a cookie choice.
  if (!manifest.routes.includes(pathname)) return undefined;
  const response = await assets.fetch(new Request(new URL(publicPageAssetPath(pathname, rsc), url.origin)));
  if (response.status !== 200) return undefined;
  const headers = new Headers(response.headers);
  headers.set("Content-Type", rsc ? "text/x-component; charset=utf-8" : "text/html; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.set("Vary", "RSC, Accept, Accept-Encoding");
  headers.set("X-GridHanzi-Render", "prerendered");
  headers.set("X-GridHanzi-Build", manifest.build);
  if (manifest.compatibilityId) headers.set("X-Vinext-RSC-Compatibility-Id", manifest.compatibilityId);
  if (rsc && manifest.params?.[pathname]) headers.set("X-Vinext-Params", manifest.params[pathname]);
  headers.delete("Set-Cookie");
  headers.delete("X-Robots-Tag"); // The internal artifact is noindex; the public HTML has its own robots metadata.
  headers.delete("Content-Length");
  return new Response(request.method === "HEAD" ? null : response.body, { status: 200, headers });
}
