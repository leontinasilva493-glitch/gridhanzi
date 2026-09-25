import { productionAnalyticsScript } from "./host";

export function Plausible({ domain, src = "https://plausible.io/js/script.js" }: { domain: string; src?: string }) {
  if (!domain) return null;
  return <script id="plausible-init" async dangerouslySetInnerHTML={{ __html: productionAnalyticsScript(`
    if (!window.plausible) {
      window.plausible = function(){(window.plausible.q = window.plausible.q || []).push(arguments)};
      var script = document.createElement('script');
      script.id = 'plausible-loader'; script.async = true;
      script.setAttribute('data-domain', ${JSON.stringify(domain)});
      script.src = ${JSON.stringify(src)}; document.head.appendChild(script);
    }
  `) }} />;
}
