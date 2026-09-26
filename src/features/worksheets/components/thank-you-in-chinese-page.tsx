import { ArrowRight, BookOpenText, PencilLine } from "lucide-react";
import type { ReactNode } from "react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { StructuredData } from "./structured-data";
import { PublicPageShell } from "./site-shell";

const title = "Thank You in Chinese: 谢谢 (Xièxie) Meaning & Usage";
const description =
  "Learn how to say thank you in Chinese with 谢谢 (xièxie). See simplified and traditional forms, understand the natural pronunciation, read polite examples, and practise writing the characters.";

const examples = [
  {
    hanzi: "谢谢你。",
    pinyin: "Xièxie nǐ.",
    meaning: "Thank you.",
    context: "A simple, friendly way to thank someone directly.",
  },
  {
    hanzi: "谢谢你的帮助。",
    pinyin: "Xièxie nǐ de bāngzhù.",
    meaning: "Thank you for your help.",
    context: "Use this when someone has helped you.",
  },
];

export function ThankYouInChinesePage({ locale }: { locale: string }) {
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pathname = `${localePrefix}/thank-you-in-chinese`;
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${pathname}`;
  const rootUrl = `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix || "/"}`;

  return (
    <PublicPageShell active="stroke-order">
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: title,
            description,
            url: pageUrl,
            inLanguage: "en",
            learningResourceType: "Chinese vocabulary and writing guide",
            teaches: ["谢谢", "xièxie", "Mandarin pronunciation", "Chinese character writing"],
            educationalLevel: "Beginner",
            provider: { "@type": "Organization", name: "GridHanzi", url: envConfigs.app_url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: rootUrl },
              {
                "@type": "ListItem",
                position: 2,
                name: "Chinese Stroke Order",
                item: `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix}/stroke-order`,
              },
              { "@type": "ListItem", position: 3, name: "谢谢", item: pageUrl },
            ],
          },
        ]}
      />

      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/">Home</Link><span aria-hidden="true"> &nbsp;/&nbsp; </span>
          <Link href="/stroke-order">Stroke Order</Link><span aria-hidden="true"> &nbsp;/&nbsp; </span>
          <span aria-current="page">谢谢</span>
        </nav>

        <header className="mt-6 grid items-center gap-7 border-b border-[#ded7ca] pb-9 lg:grid-cols-[minmax(0,1fr)_250px]">
          <div>
            <p className="hs-kicker">Word writing guide</p>
            <h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
              谢谢 (<span className="hs-hanzi-context">Xièxie</span>): Meaning, Pronunciation &amp; Usage Guide
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#566276]">
              <strong className="hs-hanzi-context text-[#172b49]">谢谢</strong> means “thank you” in Mandarin Chinese. The first syllable is xiè with a fourth tone; the second xie is usually light and unstressed in everyday speech.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold text-[#42516a]">
              <span className="rounded-full bg-[#e8f2ec] px-3 py-1.5">Simplified: 谢谢</span>
              <span className="rounded-full bg-[#edf1f5] px-3 py-1.5">Traditional: 謝謝</span>
              <span className="rounded-full bg-[#fff0e9] px-3 py-1.5 text-[#9d3c32]">Pinyin: xièxie</span>
            </div>
            <Link href="/generator?words=%E8%B0%A2%E8%B0%A2" className="hs-primary-button mt-6 min-h-11 px-5 py-2.5">
              <PencilLine className="size-4" /> Make a 谢谢 writing worksheet <ArrowRight className="size-4" />
            </Link>
          </div>
          <div aria-label="谢谢, pronounced xièxie" className="hs-hanzi-context grid aspect-square place-items-center rounded-full border border-[#d7cfc1] bg-[#f7efe3] text-8xl text-[#172b49] shadow-[inset_0_0_0_10px_#fffaf2]">
            谢谢
          </div>
        </header>

        <section className="mt-8" aria-labelledby="pronunciation-title">
          <p className="hs-kicker">Say it naturally</p>
          <h2 id="pronunciation-title" className="hs-display mt-2 text-3xl font-bold">How to pronounce 谢谢 (xièxie)</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="hs-card p-6">
              <p className="hs-hanzi-context text-5xl text-[#172b49]">谢</p>
              <p className="mt-2 font-bold text-[#b62822]">xiè · fourth tone</p>
              <p className="mt-3 text-sm leading-7 text-[#5d6878]">Start with a clear falling tone. This is the stressed syllable in the everyday expression.</p>
            </article>
            <article className="hs-card p-6">
              <p className="hs-hanzi-context text-5xl text-[#172b49]">谢</p>
              <p className="mt-2 font-bold text-[#b62822]">xie · usually neutral tone</p>
              <p className="mt-3 text-sm leading-7 text-[#5d6878]">The repeated second syllable is normally shorter and lighter in conversational Mandarin. You may also see the dictionary form written as “xiè xie.”</p>
            </article>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="writing-title">
          <p className="hs-kicker">Write the characters</p>
          <h2 id="writing-title" className="hs-display mt-2 text-3xl font-bold">谢谢 repeats the character 谢</h2>
          <article className="hs-card mt-4 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="hs-hanzi-context text-6xl text-[#172b49]">谢</p>
                <p className="mt-2 font-bold text-[#b62822]">xiè · to thank; to express thanks</p>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5d6878]">The word 谢谢 uses the same character twice. Practise the stroke order for 谢, then write the full word from memory.</p>
              </div>
              <BookOpenText className="size-7 text-[#9d3c32]" />
            </div>
            <Link href={`/stroke-order?character=${encodeURIComponent("谢")}`} className="mt-5 inline-flex items-center gap-1 font-bold text-[#24466e] hover:text-[#b62822]">
              Look up 谢 stroke order <ArrowRight className="size-4" />
            </Link>
          </article>
        </section>

        <section className="mt-8" aria-labelledby="examples-title">
          <p className="hs-kicker">Use it in context</p>
          <h2 id="examples-title" className="hs-display mt-2 text-3xl font-bold">Examples with 谢谢</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {examples.map((example) => (
              <article key={example.hanzi} className="hs-card p-5">
                <p className="hs-hanzi-context text-2xl font-semibold text-[#172b49]">{example.hanzi}</p>
                <p className="mt-2 text-sm font-semibold text-[#b62822]">{example.pinyin}</p>
                <p className="mt-2 text-sm font-semibold text-[#42516a]">{example.meaning}</p>
                <p className="mt-2 text-sm leading-6 text-[#5d6878]">{example.context}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2" aria-label="Polite response and writing practice">
          <article className="hs-card p-6 sm:p-8">
            <p className="hs-kicker">A common reply</p>
            <h2 className="hs-display mt-2 text-2xl font-bold">Responding to 谢谢</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6878]">A common reply is <strong className="hs-hanzi-context">不客气</strong> (bú kèqi), meaning “you’re welcome.” In natural speech, 不 changes from bù to bú before the following fourth-tone 客.</p>
          </article>
          <article className="hs-card border-[#d8c49f] bg-[#fff9ed] p-6 sm:p-8">
            <p className="hs-kicker">Practise writing</p>
            <h2 className="hs-display mt-2 text-2xl font-bold">Print a 谢谢 writing sheet</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6878]">Open the worksheet maker with 谢谢 prefilled, then choose writing grids and paper size before printing.</p>
            <Link href="/generator?words=%E8%B0%A2%E8%B0%A2" className="mt-5 inline-flex items-center gap-1 font-bold text-[#24466e] hover:text-[#b62822]">Create a 谢谢 worksheet <ArrowRight className="size-4" /></Link>
          </article>
        </section>

        <section className="mt-8" aria-labelledby="faq-title">
          <p className="hs-kicker">Quick answers</p>
          <h2 id="faq-title" className="hs-display mt-2 text-3xl font-bold">Questions about 谢谢</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Faq question="How do you say thank you in Chinese?" answer={<>Say <strong className="hs-hanzi-context">谢谢</strong> (xièxie) in Mandarin.</>} />
            <Faq question="What is the traditional form of 谢谢?" answer={<>The traditional Chinese form is <strong className="hs-hanzi-context">謝謝</strong>.</>} />
            <Faq question="Is the second syllable of 谢谢 a fourth tone?" answer="In everyday Mandarin, the second xie is usually pronounced with a neutral tone and said more lightly than the first syllable. Some learning materials write the syllables separately as xiè xie." />
            <Faq question="What does 不客气 mean?" answer={<>不客气 (bú kèqi) is a common way to say “you’re welcome” in response to 谢谢.</>} />
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}

function Faq({ question, answer }: { question: string; answer: ReactNode }) {
  return <article className="hs-card p-5"><h3 className="font-bold text-[#172b49]">{question}</h3><p className="mt-2 text-sm leading-6 text-[#5d6878]">{answer}</p></article>;
}
