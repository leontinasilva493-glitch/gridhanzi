import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { translateUi } from "./ui-copy";

test("critical homepage and navigation copy has Chinese translations", async () => {
  const home = await readFile(new URL("./components/home-page.tsx", import.meta.url), "utf8");
  const shell = await readFile(new URL("./components/site-shell.tsx", import.meta.url), "utf8");
  const homepageStart = home.slice(home.indexOf("export function HomePage"), home.indexOf("Chinese Learning Guides"));
  const header = shell.slice(0, shell.indexOf("export function HanziSiteFooter"));
  const literals = [...homepageStart.matchAll(/<UiText>\{"([^"]+)"\}<\/UiText>/g)].map((match) => match[1]);
  const titleLabels = [...homepageStart.matchAll(/\s(?:title|label)="([^"]+)"/g)].map((match) => match[1]);
  const menuLabels = [...header.matchAll(/(?:label: |\[)"([^"]+)"(?:,|\])/g)].map((match) => match[1]);
  const headerLiterals = [...header.matchAll(/<UiText>\{"([^"]+)"\}<\/UiText>/g)].map((match) => match[1]);
  const allowedUnchanged = new Set(["HSK"]);
  const labels = [...new Set([...literals, ...titleLabels, ...menuLabels, ...headerLiterals])];
  assert.ok(labels.length > 25, "extract homepage and navigation labels from source");
  const untranslated = labels.filter((label) => !allowedUnchanged.has(label) && translateUi("zh", label) === label);
  assert.deepEqual(untranslated, [], `Missing Chinese translations: ${untranslated.join(", ")}`);
});

test("key worksheet actions retain explicit Chinese copy", async () => {
  const workbench = await readFile(new URL("./components/home-workbench.tsx", import.meta.url), "utf8");
  const editor = await readFile(new URL("./components/generator-client.tsx", import.meta.url), "utf8");
  for (const [source, english, chinese] of [
    [workbench, "1. Paste your word list", "1. 粘贴词汇表"],
    [workbench, "Vocabulary list", "词汇表"],
    [workbench, "Build my worksheet", "生成我的字帖"],
    [editor, "Chinese Worksheet Generator", "中文汉字字帖生成器"],
    [editor, "Preparing your worksheet editor…", "正在准备字帖编辑器…"],
  ]) {
    assert.ok(source.includes(`t("${english}", "${chinese}")`), `${english} has a Chinese translation`);
  }
});
