import { productionAnalyticsScript } from "./host";

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  if (!measurementId) return null;
  const id = JSON.stringify(measurementId);
  return <script id="ga-init" async dangerouslySetInnerHTML={{ __html: productionAnalyticsScript(`
    if (!window.__gridhanziGaLoaded) {
      window.__gridhanziGaLoaded = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', ${id});
      var script = document.createElement('script');
      script.id = 'ga-loader'; script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(${id});
      document.head.appendChild(script);
    }
  `) }} />;
}
