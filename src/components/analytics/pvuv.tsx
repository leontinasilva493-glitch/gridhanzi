import { productionAnalyticsScript } from "./host";

export function Pvuv() {
  return <script id="pvuv-init" dangerouslySetInnerHTML={{ __html: productionAnalyticsScript(`
    if (!document.getElementById('pvuv-loader')) {
      var script = document.createElement('script');
      script.id = 'pvuv-loader';
      script.defer = true;
      script.src = 'https://www.pvuv.ai/f.js';
      script.setAttribute('data-site', 'CfYvPpaZ');
      script.setAttribute('data-api', 'https://in.pvuv.ai');
      document.head.appendChild(script);
    }
  `) }} />;
}
