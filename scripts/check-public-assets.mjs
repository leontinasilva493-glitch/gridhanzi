import { readFile, writeFile } from "node:fs/promises";

const base = process.argv[2] || "http://127.0.0.1:4351";
const manifest = JSON.parse(await readFile("dist/client/_public-pages/manifest.json", "utf8"));
const queue = manifest.routes.flatMap(route => [route, route + ".rsc"]);
const results = [];
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) {
    const route = queue.shift();
    try {
      const response = await fetch(base + encodeURI(route), { redirect: "manual", signal: AbortSignal.timeout(30000) });
      const body = await response.text();
      const render = response.headers.get("x-gridhanzi-render");
      const build = response.headers.get("x-gridhanzi-build");
      const contentType = response.headers.get("content-type") || "";
      const validBody = route.endsWith(".rsc") ? contentType.includes("text/x-component") : body.includes('rel="canonical"') && /<h1[ >]/.test(body);
      results.push({ route, status: response.status, render, build, ok: response.status === 200 && render === "prerendered" && !!build && validBody });
    } catch (error) {
      results.push({ route, ok: false, error: String(error) });
    }
    if (results.length % 100 === 0) console.log(`Checked ${results.length}/${manifest.routes.length * 2}`);
  }
}));
const failed = results.filter(result => !result.ok);
const summary = { base, checkedAt: new Date().toISOString(), requests: results.length, retries: 0, failed, builds: [...new Set(results.map(result => result.build))] };
if (process.argv[3]) await writeFile(process.argv[3], JSON.stringify({ summary, results }, null, 2));
console.log(JSON.stringify(summary, null, 2));
if (failed.length || summary.builds.length !== 1) process.exitCode = 1;
