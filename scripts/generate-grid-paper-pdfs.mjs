import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outputDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "downloads");
const width = 595.28;
const height = 841.89;
const sheets = [
  ["tian-zi-ge-grid-paper", "Tian Zi Ge Grid Paper", "tian"],
  ["mi-zi-ge-grid-paper", "Mi Zi Ge Grid Paper", "mi"],
  ["blank-chinese-writing-practice-paper", "Blank Chinese Writing Paper", "tian"],
];

await mkdir(outputDir, { recursive: true });
for (const [name, title, grid] of sheets) {
  const { pdf, svg } = draw(title, grid);
  await Promise.all([
    writeFile(path.join(outputDir, name + ".pdf"), makePdf(pdf.join("\n"))),
    writeFile(path.join(outputDir, name + ".svg"), svg.join("\n")),
  ]);
}

// One set of A4 drawing commands produces both the download and its preview.
function draw(title, grid) {
  const pdf = ["q", "1 1 1 rg", `0 0 ${width} ${height} re f`, "Q"];
  const svg = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">`,
    `<rect width="${width}" height="${height}" fill="#fff"/>`];
  function line(x1, y1, x2, y2, color, dash = false) {
    const rgb = color.slice(1).match(/../g).map((n) => (parseInt(n, 16) / 255).toFixed(3)).join(" ");
    pdf.push(`${rgb} RG`, "0.7 w", dash ? "[3 3] 0 d" : "[] 0 d",
      `${x1} ${height - y1} m ${x2} ${height - y2} l S`);
    svg.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="0.7"${dash ? ' stroke-dasharray="3 3"' : ""}/>`);
  }
  function text(value, x, y, size, color, centered = false, serif = false) {
    const rgb = color.slice(1).match(/../g).map((n) => (parseInt(n, 16) / 255).toFixed(3)).join(" ");
    const pdfX = centered ? x - value.length * size * (serif ? 0.52 : 0.49) / 2 : x;
    pdf.push("BT", `${serif ? "/F2" : "/F1"} ${size} Tf`, `${rgb} rg`,
      `${pdfX} ${height - y} Td`, `(${value}) Tj`, "ET");
    svg.push(`<text x="${x}" y="${y}" fill="${color}" font-family="${serif ? "Georgia,serif" : "Arial,sans-serif"}" font-size="${size}"${serif ? ' font-weight="700"' : ""}${centered ? ' text-anchor="middle"' : ""}>${value}</text>`);
  }
  text(title, width / 2, 51, 18, "#17233a", true, true);
  text("Name:", 36, 91, 8, "#17233a");
  text("Date:", 464, 91, 8, "#17233a");
  line(36, 97, 394, 97, "#8f9297");
  line(464, 97, 559, 97, "#8f9297");

  const mi = grid === "mi";
  const columns = mi ? 4 : 8;
  const groups = mi ? 2 : 4;
  const cell = mi ? 108 : 61;
  const gap = mi ? 5.5 : 3.5;
  const groupGap = mi ? 30 : 23;
  const rowGap = 5;
  const left = (width - (columns * cell + (columns - 1) * gap)) / 2;
  const guide = mi ? "#c4c7cb" : "#dfe0e2";
  for (let group = 0; group < groups; group++) {
    const top = 124 + group * (2 * cell + rowGap + groupGap);
    text(`${group + 1}.`, left - 6, top - 5, 7, "#17233a");
    for (let row = 0; row < 2; row++) {
      for (let column = 0; column < columns; column++) {
        const x = left + column * (cell + gap);
        const y = top + row * (cell + rowGap);
        line(x, y, x + cell, y, "#b9c1ca");
        line(x + cell, y, x + cell, y + cell, "#b9c1ca");
        line(x + cell, y + cell, x, y + cell, "#b9c1ca");
        line(x, y + cell, x, y, "#b9c1ca");
        line(x + cell / 2, y + 1.5, x + cell / 2, y + cell - 1.5, guide, true);
        line(x + 1.5, y + cell / 2, x + cell - 1.5, y + cell / 2, guide, true);
        if (mi) {
          line(x + 1.5, y + 1.5, x + cell - 1.5, y + cell - 1.5, guide, true);
          line(x + cell - 1.5, y + 1.5, x + 1.5, y + cell - 1.5, guide, true);
        }
      }
    }
  }
  text("Page 1 / 1", width / 2, 823, 8, "#5b6573", true);
  svg.push("</svg>");
  return { pdf, svg };
}

function makePdf(content) {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length ${Buffer.byteLength(content, "ascii")} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>",
  ];
  const chunks = [Buffer.from([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 226, 227, 207, 211, 10])];
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.concat(chunks).length);
    chunks.push(Buffer.from(`${i + 1} 0 obj\n${objects[i]}\nendobj\n`, "ascii"));
  }
  const xref = Buffer.concat(chunks).length;
  chunks.push(Buffer.from(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`, "ascii"));
  for (let i = 1; i <= objects.length; i++) {
    chunks.push(Buffer.from(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`, "ascii"));
  }
  chunks.push(Buffer.from(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`, "ascii"));
  return Buffer.concat(chunks);
}
