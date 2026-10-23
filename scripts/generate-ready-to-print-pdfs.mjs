import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "public", "downloads", "worksheets");
const baseUrl = process.env.PREVIEW_BASE_URL || "http://127.0.0.1:4340";
const slugs = ["chinese-first-characters", "numbers", "family"].filter(
  (slug) => !process.env.TEMPLATE_SLUG || process.env.TEMPLATE_SLUG === slug,
);
if (!slugs.length) throw new Error("Unknown TEMPLATE_SLUG");
const paperSizes = ["a4", "letter"];
const evidence = [];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const slug of slugs) {
    for (const paperSize of paperSizes) {
      const page = await browser.newPage({
        acceptDownloads: true,
        viewport: { width: 1280, height: 900 },
        deviceScaleFactor: 1.5,
      });
      try {
        const url = new URL("/worksheet/preview", baseUrl);
        url.searchParams.set("template", slug);
        url.searchParams.set("paper", paperSize);
        const response = await page.goto(url.href, { waitUntil: "networkidle" });
        if (!response?.ok()) {
          throw new Error(`Preview returned ${response?.status() ?? "no response"}: ${url.href}`);
        }

        await page.waitForFunction(() => {
          const button = [...document.querySelectorAll("button")].find((item) =>
            item.textContent?.includes("Download PDF"),
          );
          return button && !button.disabled;
        }, null, { timeout: 90000 });

        const button = page.getByRole("button", { name: "Download PDF" });
        // Never publish a degraded fallback as a ready-to-print teaching pack.
        for (let attempt = 0; attempt < 3; attempt += 1) {
          const retry = page.getByRole("button", { name: "Retry stroke guides" });
          if (!await retry.isVisible()) break;
          await retry.click();
          await page.waitForTimeout(5500);
        }
        if (await page.getByText(/Stroke data unavailable/).count() || await page.getByRole("button", { name: "Retry stroke guides" }).isVisible()) {
          throw new Error(`Incomplete stroke guides: ${slug}/${paperSize}; existing PDF was not replaced`);
        }
        const [download] = await Promise.all([
          Promise.race([
            page.waitForEvent("download", { timeout: 300000 }),
            page.getByRole("alert").waitFor({ timeout: 300000 }).then(async () => {
              throw new Error(await page.getByRole("alert").innerText());
            }),
          ]),
          button.click(),
        ]);
        const outputPath = path.join(outputDirectory, `${slug}-${paperSize}.pdf`);
        await download.saveAs(outputPath);
        evidence.push({ slug, paperSize, pages: await page.locator(".hs-paper").count(), strokeGuides: "complete" });
        console.log(outputPath);
      } finally {
        await page.close();
      }
    }
  }
  await mkdir(path.join(projectRoot, "artifacts", "p0"), { recursive: true });
  await writeFile(path.join(projectRoot, "artifacts", "p0", "generated-packs.json"), JSON.stringify(evidence, null, 2));
} finally {
  await browser.close();
}
