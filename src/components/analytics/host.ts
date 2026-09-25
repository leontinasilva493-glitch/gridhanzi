const productionHosts = ["gridhanzi.org", "www.gridhanzi.org"];
export function isProductionAnalyticsHost(hostname: string) {
  return productionHosts.includes(hostname);
}

/** Check the browser host even in production-built preview deployments. */
export function productionAnalyticsScript(script: string) {
  return `if (${JSON.stringify(productionHosts)}.includes(window.location.hostname)) {${script}}`;
}
