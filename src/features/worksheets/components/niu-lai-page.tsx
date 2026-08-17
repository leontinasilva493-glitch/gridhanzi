import { ArrowRight, BookOpenText, Languages, Radio, SearchCheck } from "lucide-react";

import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";

import { niuLaiGuide } from "../niu-lai";
import { StructuredData } from "./structured-data";
import { PublicPageShell } from "./site-shell";

export function NiuLaiPage({ locale }: { locale: string }) {
  const localePrefix = locale === "zh" ? "/zh" : "";
  const pathname = `${localePrefix}/chinese-slang/niu-lai`;
  const pageUrl = `${envConfigs.app_url.replace(/\/$/, "")}${pathname}`;
  const rootUrl = `${envConfigs.app_url.replace(/\/$/, "")}${localePrefix || "/"}`;

  return (
    <PublicPageShell active="stroke-order">
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: niuLaiGuide.seo.h1,
            description: niuLaiGuide.seo.description,
            url: pageUrl,
            mainEntityOfPage: pageUrl,
            image: `${envConfigs.app_url.replace(/\/$/, "")}/og-gridhanzi.png`,
            inLanguage: "en",
            datePublished: niuLaiGuide.publishedAt,
            dateModified: niuLaiGuide.reviewedAt,
            author: { "@type": "Organization", name: "GridHanzi" },
            publisher: { "@type": "Organization", name: "GridHanzi" },
            about: ["牛来", "Niu Lai", "Chinese internet culture", "Chinese characters"],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: rootUrl },
              { "@type": "ListItem", position: 2, name: "牛来 meaning", item: pageUrl },
            ],
          },
        ]}
      />

      <main className="hs-container pb-16 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#617084]">
          <Link href="/">Home</Link>
          <span aria-hidden="true"> &nbsp;/&nbsp; </span>
          <span>Chinese slang and culture</span>
          <span aria-hidden="true"> &nbsp;/&nbsp; </span>
          <span aria-current="page">牛来</span>
        </nav>

        <header className="mt-6 grid items-center gap-8 border-b border-[#ded7ca] pb-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <p className="hs-kicker">Current Chinese, explained carefully</p>
            <h1 className="hs-display mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
              What Does <span className="hs-hanzi-context">牛来</span> (Niú Lái) Mean? The Chinese Movie Meme Explained
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#566276]">
              {niuLaiGuide.quickAnswer}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold text-[#42516a]">
              <span className="rounded-full bg-[#e8f2ec] px-3 py-1.5">Simplified: 牛来</span>
              <span className="rounded-full bg-[#edf1f5] px-3 py-1.5">Traditional: 牛來</span>
              <span className="rounded-full bg-[#fff0e9] px-3 py-1.5 text-[#9d3c32]">Pinyin: Niú Lái</span>
            </div>
          </div>
          <div aria-hidden="true" className="relative grid aspect-square place-items-center overflow-hidden rounded-full border border-[#d7cfc1] bg-[#f7efe3] shadow-[inset_0_0_0_12px_#fffaf2]">
            <span className="hs-hanzi-context -translate-x-5 text-[7rem] leading-none text-[#172b49]">牛</span>
            <ArrowRight className="absolute size-10 translate-x-16 text-[#b62822]" />
            <span className="hs-hanzi-context absolute bottom-12 right-10 text-5xl text-[#9d3c32]">来</span>
          </div>
        </header>

        <section className="mt-8 rounded border border-[#d8c49f] bg-[#fff9ed] p-6 sm:p-8" aria-labelledby="quick-answer-title">
          <p className="hs-kicker">The short answer</p>
          <h2 id="quick-answer-title" className="hs-display mt-2 text-3xl font-bold">牛来 is a title and name, not a normal phrase</h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-[#4e5d70]">
            In the film, 牛来 is the calf's name as well as the title shown to audiences. Online, the same two characters became shorthand for the film, its unexpectedly rapid spread, and reaction images built around it. A learner should therefore keep the name as <strong>Niu Lai</strong> instead of treating it as a reusable sentence pattern.
          </p>
        </section>

        <section className="mt-10" aria-labelledby="breakdown-title">
          <p className="hs-kicker">Read the characters</p>
          <h2 id="breakdown-title" className="hs-display mt-2 text-3xl font-bold">The literal pieces: 牛 + 来</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="hs-card p-6 sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="hs-hanzi-context text-6xl text-[#172b49]">牛</p>
                  <p className="mt-2 font-bold text-[#b62822]">niú · cow, ox, cattle</p>
                </div>
                <BookOpenText className="size-7 text-[#9d3c32]" />
              </div>
              <p className="mt-4 text-sm leading-7 text-[#5d6878]">
                牛 is the animal word and a common word-family character in 牛奶, 牛肉 and 吹牛. Informally, 很牛 can praise someone or something as impressive. That slang layer can colour a meme, but it does not replace the film-name reading.
              </p>
              <Link href="/stroke-order/牛" className="mt-5 inline-flex items-center gap-1 font-bold text-[#24466e] hover:text-[#b62822]">
                Learn 牛 stroke order and usage <ArrowRight className="size-4" />
              </Link>
            </article>
            <article className="hs-card p-6 sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="hs-hanzi-context text-6xl text-[#172b49]">来</p>
                  <p className="mt-2 font-bold text-[#b62822]">lái · come, arrive</p>
                </div>
                <Languages className="size-7 text-[#9d3c32]" />
              </div>
              <p className="mt-4 text-sm leading-7 text-[#5d6878]">
                来 normally marks movement toward a speaker or reference point. In an everyday sentence, “the cow has arrived” would usually be 牛来了. The title 牛来 deliberately stands as a compact proper name, not a model sentence without 了.
              </p>
              <Link href="/stroke-order/来" className="mt-5 inline-flex items-center gap-1 font-bold text-[#24466e] hover:text-[#b62822]">
                Learn 来 stroke order and direction <ArrowRight className="size-4" />
              </Link>
            </article>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="viral-title">
          <p className="hs-kicker">Why people started sharing it</p>
          <h2 id="viral-title" className="hs-display mt-2 text-3xl font-bold">Why the 2026 film became a Chinese internet meme</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {[
              ["A striking visual contrast", "Reports and audience clips drew attention to the gap between the ink-wash promotional look and the much rougher computer animation seen in the film."],
              ["A tiny opening became part of the story", "Very limited early attendance and screenings made each new ticket, clip and reaction feel like participation in an unfolding internet event."],
              ["Audiences remixed the moment", "Spoof posters, edited clips and deliberately dramatic reactions changed the conversation from a conventional review into collective meme watching."],
            ].map(([title, body], index) => (
              <article key={title} className="hs-card p-6">
                <span className="grid size-9 place-items-center rounded-full bg-[#f7efe3] font-bold text-[#9d3c32]">{index + 1}</span>
                <h3 className="hs-display mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5d6878]">{body}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 max-w-4xl text-sm leading-7 text-[#5d6878]">
            These points describe the documented spread without turning a fast-changing box-office number into evergreen page copy. The page records the review date below so readers can separate stable language guidance from a developing media story.
          </p>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]" aria-labelledby="overseas-title">
          <article className="hs-card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Radio className="size-6 text-[#9d3c32]" />
              <p className="hs-kicker">Outside Chinese-language platforms</p>
            </div>
            <h2 id="overseas-title" className="hs-display mt-3 text-3xl font-bold">An emerging overseas meme, not a settled global phrase</h2>
            <p className="mt-4 text-base leading-8 text-[#4e5d70]">
              Overseas discussion is visible across Reddit film, box-office and internet-culture communities. Writers most often retain <strong>Niu Lai</strong>; some use <strong>The Bull Arrives</strong> as an explanatory community gloss. Search wording also includes “Niu Lai meme,” “Niu Lai movie,” “Chinese cow movie,” and “牛来 meaning.”
            </p>
            <p className="mt-4 text-sm leading-7 text-[#5d6878]">
              Because this evidence is recent and community-led, GridHanzi describes it as emerging rather than claiming a durable worldwide trend. “Bull market is coming” is a viewer-created wordplay around 牛市来了, not a definition learners should attach to every use of 牛来.
            </p>
          </article>
          <aside className="rounded border border-[#cbd7e5] bg-[#f5f8fb] p-6 sm:p-8">
            <SearchCheck className="size-7 text-[#24466e]" />
            <h2 className="hs-display mt-3 text-2xl font-bold">What the meme does not mean</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5d6878]">
              <li>• It is not a Chengyu or established idiom.</li>
              <li>• It is not an HSK vocabulary record.</li>
              <li>• It is not the usual sentence for “the cow arrived.”</li>
              <li>• “The Bull Arrives” is a helpful gloss, so Niu Lai remains the safest name.</li>
            </ul>
          </aside>
        </section>

        <section className="mt-10 rounded border border-[#233e62] bg-[#172b49] p-6 text-white sm:p-8" aria-labelledby="learn-next-title">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f4c9b7]">Turn the trend into useful Chinese</p>
          <h2 id="learn-next-title" className="hs-display mt-2 text-3xl font-bold !text-white">Learn the characters separately, then read the title in context</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#dce5ef]">
            牛 has a verified standalone HSK 3.0 Level 3 record, while 牛奶 provides earlier word-family anchors. 来 is a standalone Level 1 verb in both tracked HSK systems. The combined title 牛来 has no HSK classification, so its page teaches cultural context without inventing a curriculum level.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/stroke-order/牛" className="hs-primary-button min-h-12 px-5">Practise 牛 <ArrowRight className="size-4" /></Link>
            <Link href="/stroke-order/来" className="hs-secondary-button min-h-12 border-white bg-white px-5">Practise 来 <ArrowRight className="size-4" /></Link>
          </div>
        </section>

        <section className="mt-10 border-t border-[#ded7ca] pt-8" aria-labelledby="sources-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="hs-kicker">Evidence and update boundary</p>
              <h2 id="sources-title" className="hs-display mt-2 text-3xl font-bold">Sources used for the 牛来 explanation</h2>
            </div>
            <p className="text-sm text-[#617084]">Last reviewed: <time dateTime={niuLaiGuide.reviewedAt}>August 17, 2026</time></p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {niuLaiGuide.sources.map((source) => (
              <article key={source.href} className="hs-card min-w-0 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9d3c32]">{source.publisher}</p>
                <h3 className="mt-2 font-bold text-[#172b49]">{source.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5d6878]">{source.scope}</p>
                <a href={source.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 break-all text-sm font-bold text-[#24466e] hover:text-[#b62822]">
                  Open source <ArrowRight className="size-4 shrink-0" />
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
