import type { GridStyle, WorksheetProfile } from "./types";

export type GridPaperFaq = {
  question: string;
  answer: string;
};

export type GridPaperPage = {
  slug: "tian-zi-ge" | "mi-zi-ge" | "blank";
  grid: GridStyle;
  profile: Extract<WorksheetProfile, "kids" | "brush">;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  previewTitle: string;
  pdfHref: string;
  pdfFilename: string;
  generatorHref: string;
  intro: string[];
  sections: Array<{ heading: string; body: string }>;
  faqs: GridPaperFaq[];
  relatedSlugs: Array<"tian-zi-ge" | "mi-zi-ge" | "blank">;
};

export const gridPaperPages: GridPaperPage[] = [
  {
    slug: "tian-zi-ge",
    grid: "tian",
    profile: "kids",
    title: "Tian Zi Ge Printable PDF - Free Chinese Grid Paper | GridHanzi",
    description:
      "Free printable Tian Zi Ge (田字格) grid paper PDF for Chinese character writing practice. Download blank tianzige sheets with cross guide lines. No sign-up.",
    h1: "Free Tian Zi Ge (田字格) Printable Grid Paper",
    eyebrow: "Tian Zi Ge / 田字格",
    previewTitle: "Tian Zi Ge Grid Paper",
    pdfHref: "/downloads/tian-zi-ge-grid-paper.pdf",
    pdfFilename: "tian-zi-ge-grid-paper.pdf",
    generatorHref: "/generator?grid=tian-zi-ge",
    intro: [
      "Tian Zi Ge is the four-part Chinese writing grid used to help learners place a character inside a square. The horizontal and vertical guide lines divide each cell into clear reference areas, making it easier to check proportion, balance, and the position of the centre of a Hanzi.",
      "This one-page A4 printable PDF gives you clean blank practice rows for handwriting lessons, home review, or quick character drills. Print it as many times as you need, or open the generator to add your own Hanzi, Pinyin, and tracing guidance before saving a custom worksheet.",
    ],
    sections: [
      {
        heading: "Download Printable Tian Zi Ge PDF",
        body: "Use the download button to open the ready-to-print A4 Tian Zi Ge grid paper. The PDF is a real blank file with square cells and cross guide lines, so it works from a browser, PDF viewer, or classroom printer without an account.",
      },
      {
        heading: "How to Use Tian Zi Ge Grid Paper",
        body: "Start with the model character in the first cell, then look at how its strokes sit around the centre cross. Ask learners to trace or copy the character while keeping the left and right sides balanced. The blank cells leave enough repetition for a short lesson without crowding the page.",
      },
      {
        heading: "Make Custom Tian Zi Ge Worksheets",
        body: "When you need vocabulary, Pinyin, or stroke-order support, open the GridHanzi generator with Tian Zi Ge selected. Edit every row, choose a paper size, adjust the practice mode, and download a personalised PDF after checking the preview.",
      },
    ],
    faqs: [
      {
        question: "What is Tian Zi Ge paper?",
        answer:
          "Tian Zi Ge is Chinese character practice paper with a square cell divided by one horizontal and one vertical guide line. It helps learners judge the centre, scale, and balance of each Hanzi.",
      },
      {
        question: "Is this Tian Zi Ge PDF free to print?",
        answer:
          "Yes. The one-page A4 PDF is free to download and print, with no sign-up required.",
      },
      {
        question: "Can I add characters to the Tian Zi Ge sheet?",
        answer:
          "Yes. Open the custom generator to add Hanzi, Pinyin, meanings, tracing cells, and your own word list before downloading a new PDF.",
      },
    ],
    relatedSlugs: ["mi-zi-ge", "blank"],
  },
  {
    slug: "mi-zi-ge",
    grid: "mi",
    profile: "brush",
    title: "Mi Zi Ge Printable PDF - Free Chinese Grid Paper | GridHanzi",
    description:
      "Free printable Mi Zi Ge (米字格) grid paper PDF with diagonal guide lines for Chinese character writing practice. Download blank mizige sheets instantly.",
    h1: "Free Mi Zi Ge (米字格) Printable Grid Paper",
    eyebrow: "Mi Zi Ge / 米字格",
    previewTitle: "Mi Zi Ge Grid Paper",
    pdfHref: "/downloads/mi-zi-ge-grid-paper.pdf",
    pdfFilename: "mi-zi-ge-grid-paper.pdf",
    generatorHref: "/generator?grid=mi-zi-ge&profile=brush",
    intro: [
      "Mi Zi Ge is a Chinese character writing grid with a horizontal line, a vertical line, and two diagonal lines. Together they form a 米 shape that gives learners extra reference points for stroke direction, slant, and the outer limits of a character.",
      "This printable A4 Mi Zi Ge PDF is useful for brush practice, careful handwriting, and learners who want more visual guidance than a plain square. Download the blank sheet for immediate practice, or use the generator to turn a word list into an editable Mi Zi Ge worksheet.",
    ],
    sections: [
      {
        heading: "Download Printable Mi Zi Ge PDF",
        body: "The download button opens a real one-page A4 PDF with blank Mi Zi Ge cells and diagonal guide lines. Print it directly for handwriting practice or keep a copy as a reusable classroom handout.",
      },
      {
        heading: "Tian Zi Ge vs Mi Zi Ge: What's the Difference",
        body: "Tian Zi Ge uses a cross, while Mi Zi Ge adds two diagonals to show more directional structure. Tian Zi Ge is often a calm starting point for basic character placement; Mi Zi Ge can be helpful when learners need to check diagonals, slant, and brush movement. Both grids support repeated copying, so the better choice depends on the learner and the writing task.",
      },
      {
        heading: "Make Custom Mi Zi Ge Worksheets",
        body: "Open the generator with Mi Zi Ge selected to add your own characters, meanings, Pinyin, and practice modes. You can switch between guided tracing and blank writing cells, then preview and download an editable PDF for the exact vocabulary you are teaching.",
      },
    ],
    faqs: [
      {
        question: "What is Mi Zi Ge paper?",
        answer:
          "Mi Zi Ge is Chinese character practice paper with a cross and two diagonal guide lines. The lines form a 米 shape and help learners judge stroke direction and slant.",
      },
      {
        question: "Should beginners use Tian Zi Ge or Mi Zi Ge?",
        answer:
          "Both are useful. Tian Zi Ge is a simple starting point for centre and proportion, while Mi Zi Ge provides additional diagonal guides for learners who need more directional support.",
      },
      {
        question: "Can I customise the Mi Zi Ge PDF?",
        answer:
          "Yes. Use the custom generator to edit the vocabulary, select Mi Zi Ge, choose practice options, and download a new worksheet PDF.",
      },
    ],
    relatedSlugs: ["tian-zi-ge", "blank"],
  },
  {
    slug: "blank",
    grid: "tian",
    profile: "kids",
    title: "Blank Chinese Writing Practice Paper - Free Printable PDF | GridHanzi",
    description:
      "Free printable blank Chinese writing practice paper PDF. Download Hanzi handwriting grid paper with Tian Zi Ge and Mi Zi Ge options.",
    h1: "Blank Chinese Writing Practice Paper",
    eyebrow: "Blank Hanzi practice paper",
    previewTitle: "Blank Chinese Writing Paper",
    pdfHref: "/downloads/blank-chinese-writing-practice-paper.pdf",
    pdfFilename: "blank-chinese-writing-practice-paper.pdf",
    generatorHref: "/generator?grid=tian-zi-ge",
    intro: [
      "Blank Chinese writing practice paper is a flexible starting point when you already know what characters or vocabulary you want to practise. The empty cells keep the page uncluttered while still giving each Hanzi a consistent writing area.",
      "Use the free printable PDF for independent handwriting, copying from a textbook, dictation, or a quick review sheet. If you want more guidance, choose Tian Zi Ge or Mi Zi Ge in the generator and add the exact rows, Pinyin, meanings, or tracing steps your learner needs.",
    ],
    sections: [
      {
        heading: "Download Blank Chinese Writing Practice Paper",
        body: "Download the one-page A4 PDF for a clean set of blank Chinese writing cells. It is ready to print and does not require an account, so you can make a few copies before a lesson or keep it beside a vocabulary book.",
      },
      {
        heading: "Choose Your Grid: Tian Zi Ge, Mi Zi Ge or Plain",
        body: "Tian Zi Ge adds a horizontal and vertical cross, Mi Zi Ge adds diagonal guides, and a plain blank cell removes the internal guides. Pick the lightest amount of support that still helps the learner place the character confidently, then switch styles when the practice goal changes.",
      },
      {
        heading: "Make Custom Practice Sheets",
        body: "The generator turns a blank idea into a finished worksheet. Paste English or Chinese vocabulary, review the Hanzi and Pinyin, select Tian Zi Ge or Mi Zi Ge, and choose tracing, writing, or quiz mode before exporting a printable PDF.",
      },
    ],
    faqs: [
      {
        question: "Is the blank Chinese writing paper really empty?",
        answer:
          "Yes. The downloadable PDF contains blank writing cells without printed vocabulary or model characters, so you can copy from any lesson source.",
      },
      {
        question: "Which grid should I choose for Chinese handwriting?",
        answer:
          "Choose Tian Zi Ge for centre and proportion guides, Mi Zi Ge for extra diagonal guidance, or plain cells when the learner is ready for less support.",
      },
      {
        question: "Can I turn the blank paper into a custom worksheet?",
        answer:
          "Yes. Open the generator, paste or type your word list, select a grid and practice mode, then preview and download the resulting PDF.",
      },
    ],
    relatedSlugs: ["tian-zi-ge", "mi-zi-ge"],
  },
];

export function getGridPaperPage(slug: string): GridPaperPage | undefined {
  return gridPaperPages.find((page) => page.slug === slug);
}

export function parseGridQuery(value: string | undefined): GridStyle | undefined {
  if (value === "tian" || value === "tian-zi-ge") return "tian";
  if (value === "mi" || value === "mi-zi-ge") return "mi";
  return undefined;
}
