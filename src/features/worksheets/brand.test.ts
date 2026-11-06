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

test("brand assets match the refreshed red-gold icon exports and existing wordmarks", async () => {
  const assets = [
    ["public/gridhanzi-icon-128.png", 128, 128, "1db11d1af1709a98d797932472be2609175d7ed9faab9d2a499bec696be7f3b9"],
    ["public/gridhanzi-icon-256.png", 256, 256, "7706b594d067107273fc251418e55cb74a4e583d18ac76d268768238147e630a"],
    ["public/gridhanzi-icon-512.png", 512, 512, "67fe4b9f3a9a1bbca7d2debb7a5710f4a2e25f5a50e3121fd0424349370ee5ca"],
    ["public/gridhanzi-wordmark.webp", null, null, "70c2cf298fa7437aed48f49e55b298a501b3296884b60eae50ad59f0d0a61856"],
    ["public/gridhanzi-horizontal.webp", null, null, "8fec65f902f1f514f95b7c34e672e827d124c15e13583157d8da9728bba071c8"],
    ["public/og-gridhanzi.png", 1200, 630, "cfca286e71f7eb5855e7364fc99a2c957dc3388686e7d3c3b81645ace58cf5a2"],
    ["public/favicon.ico", null, null, "2940bbe7fdec8d21672c42a3e255430df4800fd5cacde38e7e00eebbbfb9477d"],
    ["public/favicon-16x16.png", 16, 16, "1d5d30eeaf54f67c9e9384cb3ecbcfc0b2977050079369f1df9578ca432eb10d"],
    ["public/favicon-32x32.png", 32, 32, "2332c192620ccdca747436426ff39d463ca108b8368bc0c779979aae4da508bc"],
    ["public/favicon-48x48.png", 48, 48, "00125baf5df009eef6f4c864edf1d78ac2f2697712473a244052bd73b497970b"],
    ["public/favicon-96x96.png", 96, 96, "b8e7fd9331fdb2a48be5c81c96791e209e148d3bccb071b114e63cb7bdc0f7c3"],
    ["public/apple-touch-icon.png", 180, 180, "d36b7ad51197a8da58782d3f4a3931239d2feac35a0871d69c5cba7d0b567d41"],
    ["public/android-chrome-192x192.png", 192, 192, "616441a2a565fa1abb18e7eb6893be1b0ce8f3afc6954a2de3fd22a344c19606"],
    ["public/android-chrome-512x512.png", 512, 512, "67fe4b9f3a9a1bbca7d2debb7a5710f4a2e25f5a50e3121fd0424349370ee5ca"],
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
