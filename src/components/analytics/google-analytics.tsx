// GA4 (gtag.js) as native <script> tags — see analytics/plausible.tsx for
// why we avoid next/script (RSC-only emission breaks View Source + crawlers
// + delays script load until hydration). `async` keeps it off the critical
// path; GA's enhanced measurement picks up History API navigations on its
// own in App Router.
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  if (!measurementId) return null;
  return (
    <>
      <script
        id="ga-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        async
      />
      {/* async={true} flags this to React 19 as a hoistable resource —
          without it, React logs the "Encountered a script tag while
          rendering React component" warning and won't re-execute it on
          client navigations. */}
      <script
        id="ga-init"
        async
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}');`,
        }}
      />
    </>
  );
}
