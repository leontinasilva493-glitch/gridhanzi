import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(scriptDir, "..", "public", "downloads");
const pageWidth = 595.28;
const pageHeight = 841.89;

const sheets = [
  { filename: "tian-zi-ge-grid-paper.pdf", title: "Tian Zi Ge Grid Paper", grid: "tian" },
  { filename: "mi-zi-ge-grid-paper.pdf", title: "Mi Zi Ge Grid Paper", grid: "mi" },
  { filename: "blank-chinese-writing-practice-paper.pdf", title: "Blank Chinese Writing Practice Paper", grid: "tian" },
];

await mkdir(outputDir, { recursive: true });

for (const sheet of sheets) {
  await writeFile(
    path.join(outputDir, sheet.filename),
    buildPdf(sheet.title, sheet.grid),
  );
}

function buildPdf(title, grid) {
  const commands = [
    "q",
    "1 1 1 rg",
    `0 0 ${pageWidth} ${pageHeight} re f`,
    "Q",
    "BT",
    "/F1 14 Tf",
    "0.09 0.14 0.22 rg",
    `42 ${pageHeight - 50} Td`,
    `(${title}) Tj`,
    "ET",
  ];

  const marginX = 42;
  const top = pageHeight - 82;
  const cell = 40;
  const columns = 12;
  const rows = 17;
  const lineColor = "0.61 0.64 0.68 RG";

  commands.push(lineColor, "0.7 w");
  for (let row = 0; row <= rows; row += 1) {
    const y = top - row * cell;
    commands.push(`${marginX} ${y} m ${marginX + columns * cell} ${y} l S`);
  }
  for (let column = 0; column <= columns; column += 1) {
    const x = marginX + column * cell;
    commands.push(`${x} ${top} m ${x} ${top - rows * cell} l S`);
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = marginX + column * cell;
      const y = top - (row + 1) * cell;
      commands.push(`${x} ${y + cell / 2} m ${x + cell} ${y + cell / 2} l S`);
      commands.push(`${x + cell / 2} ${y} m ${x + cell / 2} ${y + cell} l S`);
      if (grid === "mi") {
        commands.push(`${x} ${y} m ${x + cell} ${y + cell} l S`);
        commands.push(`${x + cell} ${y} m ${x} ${y + cell} l S`);
      }
    }
  }

  commands.push("BT", "/F1 8 Tf", "0.35 0.38 0.42 rg", `42 34 Td`, "(gridhanzi.org - print at 100% for A4)", "Tj", "ET");
  return makePdf(commands.join("\n"));
}

function makePdf(content) {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length ${Buffer.byteLength(content, "ascii")} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  const chunks = [
    Buffer.from([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a,
      0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a,
    ]),
  ];
  const offsets = [0];

  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.concat(chunks).length);
    chunks.push(Buffer.from(`${index + 1} 0 obj\n${objects[index]}\nendobj\n`, "ascii"));
  }

  const xrefOffset = Buffer.concat(chunks).length;
  chunks.push(Buffer.from(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`, "ascii"));
  for (let index = 1; index <= objects.length; index += 1) {
    chunks.push(Buffer.from(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`, "ascii"));
  }
  chunks.push(Buffer.from(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`, "ascii"));
  return Buffer.concat(chunks);
}
