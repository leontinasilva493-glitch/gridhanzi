import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectPath = (path: string) =>
  fileURLToPath(new URL(`../../../${path}`, import.meta.url));

const projectFile = (path: string) => readFile(projectPath(path), "utf8");

test("Cloudflare production configuration is included in Git deployments", async () => {
  const gitignore = await projectFile(".gitignore");

  assert.ok(existsSync(projectPath("wrangler.jsonc")));
  assert.doesNotMatch(gitignore, /^wrangler\.jsonc$/m);
});

test("Cloudflare deploys the GridHanzi Worker with shared API rate limiting", async () => {
  const wrangler = JSON.parse(await projectFile("wrangler.jsonc"));

  assert.equal(wrangler.name, "gridhanzi");
  assert.deepEqual(wrangler.ratelimits, [
    {
      name: "WORKSHEET_RATE_LIMITER",
      namespace_id: "145052251",
      simple: { limit: 10, period: 60 },
    },
  ]);
});

test("Cloudflare and local installs use the lockfile-compatible pnpm version", async () => {
  const packageJson = JSON.parse(await projectFile("package.json"));

  assert.equal(packageJson.packageManager, "pnpm@10.28.0");
});
