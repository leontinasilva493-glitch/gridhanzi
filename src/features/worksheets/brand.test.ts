import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
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
  assert.match(shell, /src="\/gridhanzi-horizontal\.webp"/);
  assert.match(shell, /src="\/gridhanzi-icon-128\.png"/);
  assert.match(shell, /aria-label="GridHanzi home"/);
  assert.match(layout, /url: "\/favicon-16x16\.png"/);
  assert.match(layout, /url: "\/favicon-32x32\.png"/);
  assert.match(layout, /url: "\/apple-touch-icon\.png"/);
});

test("header uses the official responsive red-gold horizontal lockup", async () => {
  const shell = await projectFile(
    "src/features/worksheets/components/site-shell.tsx",
  );
  const header = shell.slice(
    shell.indexOf("export function HanziSiteHeader"),
    shell.indexOf("export function HanziSiteFooter"),
  );

  assert.match(header, /src="\/gridhanzi-horizontal\.webp"/);
  assert.match(header, /width="1030"/);
  assert.match(header, /height="300"/);
  assert.match(header, /className="h-10 w-auto sm:h-11"/);
  assert.doesNotMatch(header, /gridhanzi-wordmark|gridhanzi-icon-128/);
});

test("brand assets match the approved red-gold logo package", async () => {
  const assets = [
    ["public/gridhanzi-icon-128.png", 128, 128, "53382bd65b19a0c77da0f6e0f49224bbb1975cecd488f9f1eb27c887cd3e8321"],
    ["public/gridhanzi-icon-256.png", 256, 256, "22c8276ce479dd5863bd0f787438ae8907a38f33a8809cf1025b6e82590b386c"],
    ["public/gridhanzi-icon-512.png", 512, 512, "704e0c7f2c38d5e3beac3aa09b7292140da6c600d60d6692194c5aea5720c5ee"],
    ["public/gridhanzi-wordmark.webp", null, null, "70c2cf298fa7437aed48f49e55b298a501b3296884b60eae50ad59f0d0a61856"],
    ["public/gridhanzi-horizontal.webp", null, null, "8fec65f902f1f514f95b7c34e672e827d124c15e13583157d8da9728bba071c8"],
    ["public/og-gridhanzi.png", 1200, 630, "cfca286e71f7eb5855e7364fc99a2c957dc3388686e7d3c3b81645ace58cf5a2"],
    ["public/favicon.ico", null, null, "714e992de6c1da995367ace12c818c0c4aa908f34f8fa802f163974e2d4f37aa"],
    ["public/favicon-16x16.png", 16, 16, "7ffcecc3a525926d7077bbacfd2e2fe6defd771c76f03a23f5c35758e48fd239"],
    ["public/favicon-32x32.png", 32, 32, "f0bb904b846f44939c573e0b20ae22e25a49ae4dbd688e4b5ddb57a5d918781e"],
    ["public/apple-touch-icon.png", 180, 180, "7ba62550d2de45bd32c1d17b13f34fbc1e0e52d7b3946d5d47caacb913688182"],
    ["public/android-chrome-192x192.png", 192, 192, "3460d70dfa3644a405f47c8b8a023be146c8721c7c2be93ed10f4c2c84f0a423"],
    ["public/android-chrome-512x512.png", 512, 512, "704e0c7f2c38d5e3beac3aa09b7292140da6c600d60d6692194c5aea5720c5ee"],
  ] as const;

  for (const [path, width, height, expectedHash] of assets) {
    const absolutePath = projectPath(path);
    assert.ok(existsSync(absolutePath), `${path} should exist`);
    const buffer = await readFile(absolutePath);
    assert.ok(buffer.length > 500, `${path} should not be empty`);
    assert.equal(sha256(buffer), expectedHash, `${path} should match the approved package`);
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
  assert.match(manifest, /android-chrome-192x192\.png/);
  assert.match(manifest, /android-chrome-512x512\.png/);
  assert.match(manifest, /background_color:\s*"#FFFFFF"/);
  assert.match(manifest, /theme_color:\s*"#A80017"/);
  assert.match(envExample, /NEXT_PUBLIC_APP_NAME=GridHanzi/);
  assert.match(productionEnv, /NEXT_PUBLIC_APP_URL=https:\/\/gridhanzi\.org/);
  assert.match(productionEnv, /NEXT_PUBLIC_APP_LOGO=\/gridhanzi-icon-512\.png/);
  assert.match(packageSource, /"name": "gridhanzi"/);
  assert.match(readme, /^# GridHanzi$/m);
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
