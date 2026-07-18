import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

test("Vinext production cache uses URL separators on Windows", async () => {
  const fixtureRoot = await mkdtemp(path.join(os.tmpdir(), "vinext-static-cache-"));
  const assetDirectory = path.join(fixtureRoot, "assets");

  try {
    await mkdir(assetDirectory);
    await writeFile(path.join(assetDirectory, "app-ABC123.js"), "export {};\n");

    const moduleUrl = pathToFileURL(
      path.join(
        process.cwd(),
        "node_modules",
        "vinext",
        "dist",
        "server",
        "static-file-cache.js",
      ),
    ).href;
    const { StaticFileCache } = (await import(moduleUrl)) as {
      StaticFileCache: {
        create(clientDirectory: string): Promise<{
          lookup(pathname: string): unknown;
        }>;
      };
    };

    const cache = await StaticFileCache.create(fixtureRoot);

    assert.ok(
      cache.lookup("/assets/app-ABC123.js"),
      "browser-style asset URLs must match the production cache on every OS",
    );
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});
