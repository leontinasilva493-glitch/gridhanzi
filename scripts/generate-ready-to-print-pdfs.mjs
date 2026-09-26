import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "public", "downloads", "worksheets");
const baseUrl = process.env.PREVIEW_BASE_URL || "http://127.0.0.1:4340";
const slugs = ["chinese-first-characters", "numbers", "family"];
const paperSizes = ["a4", "letter"];

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
        const [download] = await Promise.all([
          page.waitForEvent("download", { timeout: 120000 }),
          button.click(),
        ]);
        const outputPath = path.join(outputDirectory, `${slug}-${paperSize}.pdf`);
        await download.saveAs(outputPath);
        console.log(outputPath);
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
