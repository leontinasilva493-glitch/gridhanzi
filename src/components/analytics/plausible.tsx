// Plausible script — rendered as native <script> elements (not next/script)
// so the tags land in the SSR HTML directly. next/script in App Router is a
// Client Component; inside an async Server Component it only emits an RSC
// reference and the real <script> is injected post-hydration — invisible in
// View Source and to crawlers. Plain <script async defer> loads in parallel
// with the HTML and is visible to everyone.
export function Plausible({
  domain,
  src = "https://plausible.io/js/script.js",
}: {
  domain: string;
  src?: string;
}) {
  if (!domain) return null;
  return (
    <>
      {/* async={true} flags this to React 19 as a hoistable resource —
          see google-analytics.tsx for the full rationale. */}
      <script
        id="plausible-init"
        async
        dangerouslySetInnerHTML={{
          __html: `window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};`,
        }}
      />
      <script
        id="plausible-loader"
        data-domain={domain}
        src={src}
        defer
        async
      />
    </>
  );
}
