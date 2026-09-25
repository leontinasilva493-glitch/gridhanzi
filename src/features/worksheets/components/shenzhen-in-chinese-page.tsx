import { ArrowRight, BookOpenText, PencilLine } from "lucide-react";
import type { ReactNode } from "react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { StructuredData } from "./structured-data";
import { PublicPageShell } from "./site-shell";

const title = "Shenzhen (深圳): Meaning, Pronunciation & Writing Guide";
const description =
  "Shenzhen in Chinese is 深圳 (Shēnzhèn). Learn the Mandarin tones, what each character commonly means, see natural example sentences, and practise writing the city name.";
const characters = [
  {
    character: "深",
    pinyin: "shēn · first tone",
    meaning: "deep; profound",
    note: "In this place name, 深 is read shēn. These are common standalone meanings of the character, not an explanation of the city's name origin.",
  },
  {
    character: "圳",
    pinyin: "zhèn · fourth tone",
    meaning: "irrigation ditch; small drainage channel",
    note: "圳 is a less common character. Its dictionary sense describes a channel; that sense alone does not establish the etymology of Shenzhen.",
  },
];

export function ShenzhenInChinesePage({ locale }: { locale: string }) {
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pathname = `${localePrefix}/shenzhen-in-chinese`;
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${pathname}`;
  const rootUrl = `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix || "/"}`;
  const sampleSentences = [
    { hanzi: "我住在深圳。", pinyin: "Wǒ zhù zài Shēnzhèn.", meaning: "I live in Shenzhen." },
    { hanzi: "我想去深圳旅行。", pinyin: "Wǒ xiǎng qù Shēnzhèn lǚxíng.", meaning: "I would like to travel to Shenzhen." },
  ];

  return (
    <PublicPageShell active="stroke-order">
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: title,
          description,
          url: pageUrl,
          inLanguage: "en",
          learningResourceType: "Chinese vocabulary guide and writing practice",
          teaches: ["深圳", "Shēnzhèn", "Mandarin tones", "Chinese character writing"],
          educationalLevel: "Beginner",
          provider: { "@type": "Organization", name: "GridHanzi", url: envConfigs.app_url },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: rootUrl },
            { "@type": "ListItem", position: 2, name: "Chinese Stroke Order", item: `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/stroke-order` },
            { "@type": "ListItem", position: 3, name: "Shenzhen", item: pageUrl },
          ],
        },
      ]} />

      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/">Home</Link><span aria-hidden="true"> &nbsp;/&nbsp; </span>
          <Link href="/stroke-order">Stroke Order</Link><span aria-hidden="true"> &nbsp;/&nbsp; </span>
          <span aria-current="page">Shenzhen</span>
        </nav>

        <header className="mt-6 grid items-center gap-7 border-b border-[#ded7ca] pb-9 lg:grid-cols-[minmax(0,1fr)_250px]">
          <div>
            <p className="hs-kicker">Word writing guide</p>
            <h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">Shenzhen (<span className="hs-hanzi-context">深圳</span>): Meaning, Pronunciation &amp; Writing Guide</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#566276]">Shenzhen is written <strong className="hs-hanzi-context text-[#172b49]">深圳</strong> in both simplified and traditional Chinese. In Mandarin, it is pronounced <strong>Shēnzhèn</strong>: shēn has the first tone, and zhèn has the fourth tone.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold text-[#42516a]">
              <span className="rounded-full bg-[#e8f2ec] px-3 py-1.5">Simplified: 深圳</span>
              <span className="rounded-full bg-[#edf1f5] px-3 py-1.5">Traditional: 深圳</span>
              <span className="rounded-full bg-[#fff0e9] px-3 py-1.5 text-[#9d3c32]">Pinyin: Shēnzhèn</span>
            </div>
            <Link href="/generator?words=%E6%B7%B1%E5%9C%B3" className="hs-primary-button mt-6 min-h-11 px-5 py-2.5"><PencilLine className="size-4" /> Make a 深圳 writing worksheet <ArrowRight className="size-4" /></Link>
          </div>
          <div aria-label="深圳, pronounced Shēnzhèn" className="hs-hanzi-context grid aspect-square place-items-center rounded-full border border-[#d7cfc1] bg-[#f7efe3] text-8xl text-[#172b49] shadow-[inset_0_0_0_10px_#fffaf2]">深圳</div>
        </header>

        <section className="mt-8" aria-labelledby="characters-title">
          <p className="hs-kicker">Read the characters</p>
          <h2 id="characters-title" className="hs-display mt-2 text-3xl font-bold">深圳, character by character</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {characters.map((item) => (
              <article key={item.character} className="hs-card p-6 sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div><p className="hs-hanzi-context text-6xl text-[#172b49]">{item.character}</p><p className="mt-2 font-bold text-[#b62822]">{item.pinyin}</p></div>
                  <BookOpenText className="size-7 text-[#9d3c32]" />
                </div>
                <p className="mt-4 text-sm leading-7 text-[#4e5d70]"><strong>Common character meaning:</strong> {item.meaning}.</p>
                <p className="mt-2 text-sm leading-7 text-[#5d6878]">{item.note}</p>
                <Link href={`/stroke-order?character=${encodeURIComponent(item.character)}`} className="mt-5 inline-flex items-center gap-1 font-bold text-[#24466e] hover:text-[#b62822]">Look up {item.character} stroke order <ArrowRight className="size-4" /></Link>
              </article>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-[#657082]">These are common meanings of the individual characters. They are not presented as the origin of the city’s name.</p>
        </section>

        <section className="mt-8 hs-card p-6 sm:p-8" aria-labelledby="sentences-title">
          <p className="hs-kicker">See it in context</p>
          <h2 id="sentences-title" className="hs-display mt-2 text-3xl font-bold">How to use 深圳 in a sentence</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {sampleSentences.map((sentence) => (
              <article key={sentence.hanzi} className="rounded border border-[#e3ddd2] bg-white p-5">
                <p className="hs-hanzi-context text-2xl font-semibold text-[#172b49]">{sentence.hanzi}</p>
                <p className="mt-2 text-sm font-semibold text-[#b62822]">{sentence.pinyin}</p>
                <p className="mt-2 text-sm leading-6 text-[#5d6878]">{sentence.meaning}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2" aria-label="Pronunciation and writing practice">
          <article className="hs-card p-6 sm:p-8">
            <p className="hs-kicker">Mandarin pronunciation</p>
            <h2 className="hs-display mt-2 text-2xl font-bold">Say Shēnzhèn with the right tones</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6878]">Read the first syllable with a high, level first tone: shēn. Then say zhèn with a falling fourth tone. The tone marks are part of the standard Mandarin Pinyin spelling.</p>
          </article>
          <article className="hs-card border-[#d8c49f] bg-[#fff9ed] p-6 sm:p-8">
            <p className="hs-kicker">Write the city name</p>
            <h2 className="hs-display mt-2 text-2xl font-bold">Practise 深圳 on a printable sheet</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6878]">Open the worksheet maker with 深圳 prefilled, then review the characters and choose the writing grids and paper size before printing.</p>
            <Link href="/generator?words=%E6%B7%B1%E5%9C%B3" className="mt-5 inline-flex items-center gap-1 font-bold text-[#24466e] hover:text-[#b62822]">Create a 深圳 worksheet <ArrowRight className="size-4" /></Link>
          </article>
        </section>

        <section className="mt-8" aria-labelledby="faq-title">
          <p className="hs-kicker">Quick answers</p>
          <h2 id="faq-title" className="hs-display mt-2 text-3xl font-bold">Questions about Shenzhen in Chinese</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Faq question="How do you write Shenzhen in Chinese?" answer={<>Write it <span className="hs-hanzi-context">深圳</span>. The simplified and traditional forms are the same.</>} />
            <Faq question="What is the Pinyin for Shenzhen?" answer={<>The Mandarin Pinyin is <strong>Shēnzhèn</strong>: shēn is first tone and zhèn is fourth tone.</>} />
            <Faq question="What do 深 and 圳 mean?" answer="Common dictionary senses include deep or profound for 深, and an irrigation ditch or small drainage channel for 圳. These senses do not by themselves explain the place name's origin." />
            <Faq question="Is Shenzhen pronounced the same in Cantonese?" answer="This guide gives the Mandarin pronunciation. Cantonese has a different pronunciation; consult a Cantonese-specific dictionary or audio source for that reading." />
          </div>
        </section>

      </main>
    </PublicPageShell>
  );
}

function Faq({ question, answer }: { question: string; answer: ReactNode }) {
  return <article className="hs-card p-5"><h3 className="font-bold text-[#172b49]">{question}</h3><p className="mt-2 text-sm leading-6 text-[#5d6878]">{answer}</p></article>;
}
