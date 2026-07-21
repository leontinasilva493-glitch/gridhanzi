import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { envConfigs } from "@/config";

const projectPath = (path: string) =>
  fileURLToPath(new URL(`../../../${path}`, import.meta.url));

const projectFile = (path: string) => readFile(projectPath(path), "utf8");

function readPngSize(buffer: Buffer): { width: number; height: number } {
  assert.equal(buffer.subarray(1, 4).toString("ascii"), "PNG");
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

test("GridHanzi is the default public brand and production domain", () => {
  assert.equal(envConfigs.app_name, "GridHanzi");
  assert.equal(envConfigs.app_url, "https://gridhanzi.org");
  assert.equal(envConfigs.app_logo, "/gridhanzi-icon-512.png");
});

test("metadata, structured data, and public chrome use the GridHanzi brand", async () => {
  const [layout, homeRoute, templateRoute, shell] = await Promise.all([
    projectFile("src/app/layout.tsx"),
    projectFile("src/app/[locale]/page.tsx"),
    projectFile("src/app/[locale]/templates/[slug]/page.tsx"),
    projectFile("src/features/worksheets/components/site-shell.tsx"),
  ]);
  const publicBrandSource = `${layout}\n${homeRoute}\n${templateRoute}\n${shell}`;

  assert.doesNotMatch(publicBrandSource, /HanziSheets|og-hanzisheets/);
  assert.match(layout, /template: "%s \| GridHanzi"/);
  assert.match(layout, /images: \["\/og-gridhanzi\.png"\]/);
  assert.match(homeRoute, /name: "GridHanzi"/);
  assert.match(templateRoute, /siteName: "GridHanzi"/);
  assert.match(shell, /src="\/gridhanzi-wordmark\.webp"/);
  assert.match(shell, /src="\/gridhanzi-icon-128\.png"/);
  assert.match(shell, /aria-label="GridHanzi home"/);
});

test("header pairs the Ming icon with a responsive, vertically aligned wordmark", async () => {
  const shell = await projectFile(
    "src/features/worksheets/components/site-shell.tsx",
  );
  const header = shell.slice(
    shell.indexOf("export function HanziSiteHeader"),
    shell.indexOf("export function HanziSiteFooter"),
  );

  assert.match(
    header,
    /src="\/gridhanzi-icon-128\.png"[\s\S]*?src="\/gridhanzi-wordmark\.webp"/,
  );
  assert.match(header, /className="flex shrink-0 items-center gap-1"/);
  assert.match(header, /className="size-9 shrink-0 rounded-[^\"]+ sm:size-10"/);
  assert.match(header, /className="h-7 w-auto sm:h-8"/);
});

test("brand asset set includes correctly sized icons, wordmark, favicon, and social image", async () => {
  const assets = [
    ["public/gridhanzi-icon-128.png", 128, 128],
    ["public/gridhanzi-icon-256.png", 256, 256],
    ["public/gridhanzi-icon-512.png", 512, 512],
    ["public/gridhanzi-wordmark.webp", null, null],
    ["public/og-gridhanzi.png", 1200, 630],
    ["public/favicon.ico", null, null],
  ] as const;

  for (const [path, width, height] of assets) {
    const absolutePath = projectPath(path);
    assert.ok(existsSync(absolutePath), `${path} should exist`);
    const buffer = await readFile(absolutePath);
    assert.ok(buffer.length > 500, `${path} should not be empty`);
    if (width && height) {
      assert.deepEqual(readPngSize(buffer), { width, height }, path);
    }
  }

  assert.equal(existsSync(projectPath("public/logo.png")), false);
  assert.equal(existsSync(projectPath("public/og-hanzisheets.png")), false);
});

test("web app manifest and environment templates publish gridhanzi.org", async () => {
  const manifestPath = projectPath("src/app/manifest.ts");
  assert.ok(existsSync(manifestPath), "src/app/manifest.ts should exist");

  const [manifest, envExample, productionEnv, packageSource, readme, wranglerExample] =
    await Promise.all([
      readFile(manifestPath, "utf8"),
      projectFile(".env.example"),
      projectFile(".env.production.example"),
      projectFile("package.json"),
      projectFile("README.md"),
      projectFile("wrangler.example.jsonc"),
    ]);

  assert.match(manifest, /name:\s*"GridHanzi"/);
  assert.match(manifest, /short_name:\s*"GridHanzi"/);
  assert.match(manifest, /gridhanzi-icon-512\.png/);
  assert.match(envExample, /NEXT_PUBLIC_APP_NAME=GridHanzi/);
  assert.match(productionEnv, /NEXT_PUBLIC_APP_URL=https:\/\/gridhanzi\.org/);
  assert.match(productionEnv, /NEXT_PUBLIC_APP_LOGO=\/gridhanzi-icon-512\.png/);
  assert.match(packageSource, /"name": "gridhanzi"/);
  assert.match(readme, /^# GridHanzi MVP/m);
  assert.match(wranglerExample, /"name": "gridhanzi"/);
});

test("worksheet handoff uses the GridHanzi storage key with legacy compatibility", async () => {
  const [generator, preview] = await Promise.all([
    projectFile("src/features/worksheets/components/generator-client.tsx"),
    projectFile("src/features/worksheets/components/print-preview-client.tsx"),
  ]);

  assert.match(generator, /"gridhanzi:worksheet:v1"/);
  assert.match(generator, /LEGACY_WORKSHEET_STORAGE_KEY/);
  assert.match(preview, /LEGACY_WORKSHEET_STORAGE_KEY/);
  assert.match(preview, /sessionStorage\.removeItem\(LEGACY_WORKSHEET_STORAGE_KEY\)/);
});
