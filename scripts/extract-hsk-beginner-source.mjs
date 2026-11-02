// Input: UTF-8 text extracted with pypdf, with ---PDF PAGE N--- boundaries.
// Usage: node scripts/extract-hsk-beginner-source.mjs <text> <official-pdf>
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const [textPath, pdfPath] = process.argv.slice(2);
if (!textPath || !pdfPath) throw new Error("Provide the extracted text and original PDF paths.");
const text = readFileSync(textPath, "utf8");
const entries = [];
let page = 0;
for (const line of text.split(/\r?\n/)) {
  const boundary = line.match(/---PDF PAGE (\d+)---/);
  if (boundary) page = Number(boundary[1]);
  if (page < 80 || page > 92) continue;
  const row = line.match(/^(\d+)\s+([12])(?:（[^）]+）)*\s+(\S+)\s+(.+)$/u);
  if (!row || Number(row[1]) > 500) continue;
  const pinyin = row[4].match(/^[\p{Script=Latin}\p{M}üÜ'’\s]+/u)?.[0].trim();
  if (!pinyin) throw new Error(`Missing Pinyin on row ${row[1]}`);
  entries.push({ number: Number(row[1]), level: Number(row[2]), hanzi: row[3].replace(/\d+$/, ""), pinyin, pdfPage: page });
}
if (entries.length !== 500 || entries.some((entry, index) => entry.number !== index + 1 || entry.level !== (index < 300 ? 1 : 2))) {
  throw new Error("Expected all 300 Level 1 and 200 additional Level 2 rows in official order.");
}
const result = {
  edition: "2025-11 examination syllabus",
  verifiedAt: "2026-11-02",
  sourceUrl: "https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf",
  sha256: createHash("sha256").update(readFileSync(pdfPath)).digest("hex"),
  note: "Vocabulary entries, not writing-character requirements. Homographs retain their row numbers; terminal sense numbers are removed from display Hanzi.",
  entries,
};
writeFileSync(new URL("../src/features/worksheets/hsk-2025-beginner-source.json", import.meta.url), JSON.stringify(result, null, 2) + "\n");
console.log("Verified and extracted 500 official vocabulary rows.");
