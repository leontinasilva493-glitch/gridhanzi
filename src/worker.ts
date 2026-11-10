import { eligiblePublicRequest, readPublicPage, type AssetBinding, type PublicPageManifest } from "./platform/public-page-assets";

interface Environment { ASSETS?: AssetBinding; [binding: string]: unknown }
interface Context { waitUntil(promise: Promise<unknown>): void; passThroughOnException(): void }
let manifest: PublicPageManifest | undefined;

export default {
  async fetch(request: Request, env: Environment = {}, ctx?: Context): Promise<Response> {
    const url = new URL(request.url);
    // Generated implementation artifacts are not alternate public page URLs.
    if (url.pathname.startsWith("/_public-pages/")) return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
    if (env.ASSETS && eligiblePublicRequest(request)) {
      if (!manifest) {
        const response = await env.ASSETS.fetch(new Request(new URL("/_public-pages/manifest.json", url.origin)));
        if (response.status === 200) manifest = await response.json() as PublicPageManifest;
      }
      if (manifest) {
        const response = await readPublicPage(request, env.ASSETS, manifest);
        if (response) return response;
      }
    }
    // Load the React server only for actions, APIs, unknown paths and user state.
    const { default: application } = await import("vinext/server/app-router-entry");
    return application.fetch(request, env, ctx);
  },
};
