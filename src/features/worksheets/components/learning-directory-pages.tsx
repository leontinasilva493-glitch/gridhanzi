import type { ReactNode } from "react";
import { Link } from "@/core/i18n/navigation";
import { PublicPageShell } from "./site-shell";
import { RadicalLookup } from "./radical-lookup";
import { radicals, radicalGuides, pinyinGuides, pinyinChart, getRelatedPinyinGuides, learningWorksheetHref, type LearningExample, type Radical } from "../learning-directories";
import { getStrokeOrderCharacter } from "../stroke-order-characters";

function Frame({ title, parent, children }: { title: string; parent?: "radicals" | "pinyin"; children: ReactNode }) {
  return <PublicPageShell active="stroke-order"><main className="hs-container py-8">
    <nav aria-label="Breadcrumb" className="text-sm text-[#566276]"><Link href="/">Home</Link> / {parent && <><Link href={`/${parent}`}>{parent === "radicals" ? "Chinese Radicals" : "Chinese Pinyin"}</Link> / </>}<span aria-current="page">{parent ? "Practice guide" : title}</span></nav>
    <h1 className="hs-display mt-6 max-w-5xl text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
    {children}
    <aside className="mt-10 flex flex-wrap gap-4 border-t border-[#ded7ca] pt-6 text-sm font-semibold text-[#24466e]">
      <Link href="/radicals">Chinese radicals</Link><Link href="/pinyin">Chinese pinyin chart</Link><Link href="/chinese-stroke-order-dictionary">Stroke order dictionary</Link><Link href="/grids">Chinese grid paper PDFs</Link><Link href="/sources">Sources and review scope</Link>
    </aside>
  </main></PublicPageShell>;
}

function Examples({ examples }: { examples: LearningExample[] }) {
  return <div className="mt-5 grid gap-4 sm:grid-cols-3">{examples.map(e => {
    const guide = getStrokeOrderCharacter(e.character);
    return <article key={e.character} className="hs-card p-5"><p className="hs-hanzi-context text-5xl">{e.character}</p><p className="mt-3 font-bold">{e.pinyin}</p><p className="mt-1 text-sm">{e.meaning.replace(/-/g, " ")}</p>
      <Link className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-[#24466e] underline" href={guide ? `/stroke-order/${e.character}` : `/stroke-order?character=${encodeURIComponent(e.character)}`}>{guide ? `${e.character} stroke order guide` : `Look up ${e.character} stroke order`}</Link>
      {guide && guide.pinyin !== e.pinyin && <p className="mt-2 text-xs leading-6">This lesson uses {e.pinyin}. The general guide starts with {guide.pinyin}; check its alternate-reading notes.</p>}
    </article>;
  })}</div>;
}

export function RadicalsPage() {
  return <Frame title="Chinese Radicals: Complete List of 214 Kangxi Radicals">
    <p className="mt-4 max-w-4xl text-lg leading-8">A radical is a dictionary indexing component used to group Chinese characters. This reference lists all <strong>214 Kangxi radicals</strong>, with 30 starter families explained through example characters and printable practice.</p>
    <RadicalLookup />
    <p className="mt-4 text-sm leading-7">Start with a family below or <a className="font-bold underline" href="#all-radicals">browse all 214 by stroke count</a>. A radical can suggest a meaning category, but it does not predict a whole character’s meaning or sound. These are traditional Kangxi headings, not a claim that every modern dictionary uses 214 categories.</p>
    <section className="mt-10" aria-labelledby="starter-radicals"><h2 id="starter-radicals" className="hs-display text-3xl font-bold">30 radical families to practise first</h2><p className="mt-3 text-sm leading-7">Selected for useful beginner examples, not ranked by measured frequency. Each set opens the editor with its chosen readings and meanings.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{radicalGuides.map(r => <article key={r.id} className="hs-card p-5"><Link href={`/radicals/${r.slug}`} className="text-xl font-bold text-[#24466e]">{r.glyph} {r.meaning}</Link><p className="mt-2 text-sm">{r.pinyin} · #{r.id}{r.variants && ` · ${r.variants}`}</p><p className="mt-3 flex gap-4 text-2xl">{r.examples.map(e => <Link key={e.character} aria-label={`${e.character} stroke order`} href={getStrokeOrderCharacter(e.character) ? `/stroke-order/${e.character}` : `/stroke-order?character=${encodeURIComponent(e.character)}`}>{e.character}</Link>)}</p><Link className="mt-4 inline-flex min-h-11 items-center font-bold text-[#b62822] underline" href={learningWorksheetHref("radical",r.slug)}>Make this example worksheet</Link></article>)}</div>
    </section>
    <section id="all-radicals" className="mt-12"><h2 className="hs-display text-3xl font-bold">All 214 radicals by traditional stroke count</h2><p className="mt-3 text-sm leading-7">Counts belong to the Kangxi heading, not necessarily its simplified or side form: 水 has 4 strokes, 氵 has 3. Readings below name the radical headings; stroke names and ordinary word readings can differ. Notes mark the main distinctions and selected regional variants. Rare headings are not all everyday words.</p>
      <nav aria-label="Radical stroke counts" className="mt-4 flex flex-wrap gap-3">{Array.from({length:17},(_,i)=>i+1).map(n=><a className="rounded border px-3 py-2" key={n} href={`#strokes-${n}`}>{n} strokes</a>)}</nav>
      {Array.from({length:17},(_,i)=>i+1).map(n=><section key={n} id={`strokes-${n}`} className="mt-8 scroll-mt-24"><h3 className="text-xl font-bold">{n} {n===1?"stroke":"strokes"} · {radicals.filter(r=>r.strokes===n).length} radicals</h3><ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">{radicals.filter(r=>r.strokes===n).map(r=><li id={`radical-${r.id}`} key={r.id} className="hs-card p-3 scroll-mt-24"><span className="text-xs text-[#566276]">#{r.id}</span><p className="text-3xl">{r.slug ? <Link className="underline" href={`/radicals/${r.slug}`}>{r.glyph}</Link> : r.glyph}</p><p className="mt-1 text-sm">{r.pinyin}</p><p className="mt-1 text-xs">{r.meaning}</p>{r.readingNote && <details className="mt-2 text-xs leading-6"><summary className="cursor-pointer underline">Reading and meaning note</summary><p>{r.readingNote}</p></details>}</li>)}</ul></section>)}
    </section><p className="mt-8 text-sm leading-7">Reference: <a className="underline" href="https://www.unicode.org/Public/17.0.0/ucd/CJKRadicals.txt">Unicode 17.0 radical mappings</a>; lookup classifications from <a className="underline" href="https://github.com/skishore/makemeahanzi">Make Me a Hanzi</a>. <a className="underline" href="/data/README.txt">Data and licence notes</a>. Radical readings were cross-checked against the <a className="underline" href="https://dict.mini.moe.edu.tw/SearchIndex/RadicalsTable">MOE radical reading table</a> and <a className="underline" href="https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/second-lang/Radicals.pdf">Hong Kong Education Bureau radical reference</a>; the notes identify contextual or regional differences.</p>
  </Frame>;
}

export function RadicalDetailPage({ radical: r }: { radical: Radical & {slug:string} }) {
  return <Frame parent="radicals" title={`${r.glyph}: the ${r.meaning} radical`}>
    <p className="mt-4 text-lg">Kangxi radical {r.id} · {r.pinyin} · {r.strokes} strokes in the heading{r.variants && ` · related forms: ${r.variants}`}</p>
    {r.readingNote && <p className="mt-3 max-w-4xl rounded border border-[#ded7ca] p-4 text-sm leading-7">{r.readingNote}</p>}
    {getStrokeOrderCharacter(r.glyph) && <p className="mt-3"><Link className="font-semibold text-[#24466e] underline" href={`/stroke-order/${r.glyph}`}>See the standalone {r.glyph} stroke order guide</Link></p>}
    <Link className="hs-primary-button mt-5 inline-flex" href={learningWorksheetHref("radical",r.slug)}>Make a {r.meaning} radical worksheet</Link>
    <section className="hs-card mt-8 p-6"><h2 className="text-2xl font-bold">Recognise the form</h2><p className="mt-3 max-w-4xl leading-8">{r.shape}</p><h2 className="mt-6 text-2xl font-bold">What the radical tells you</h2><p className="mt-3 max-w-4xl leading-8">{r.usage}</p></section>
    <section className="mt-8"><h2 className="text-2xl font-bold">Three examples in the {r.meaning} family</h2><Examples examples={r.examples}/></section>
    <section className="hs-card mt-8 p-6"><h2 className="text-2xl font-bold">Try this writing exercise</h2><p className="mt-3 max-w-4xl leading-8">{r.practice}</p><p className="mt-3 text-sm leading-7">The worksheet link preserves the readings shown here. Review the rows, choose tracing or blank practice, then preview before downloading. The heading’s stroke count can differ from the component form inside a character.</p>{r.componentSlug && <Link className="mt-3 inline-flex font-bold text-[#24466e] underline" href={`/components/${r.componentSlug}`}>Explore how this component contributes to character formation</Link>}</section>
  </Frame>;
}

export function PinyinPage() {
  const initials=["b","p","m","f","d","t","n","l","g","k","h","j","q","x","zh","ch","sh","r","z","c","s"];
  return <Frame title="Chinese Pinyin: Syllable Chart with Tones">
    <p className="mt-4 max-w-4xl text-lg leading-8">Pinyin spells Mandarin sounds with Latin letters and tone marks. Browse a {pinyinChart.length}-syllable reference chart and start with <strong>30 guided syllables</strong> that connect pronunciation notes to characters and printable worksheets.</p>
    <div className="mt-5 flex flex-wrap gap-3"><Link className="hs-primary-button" href="/pinyin/ma">Start with mā, má, mǎ, mà and ma</Link><Link className="hs-secondary-button" href={learningWorksheetHref("pinyin","ma")}>Make a tone-example worksheet</Link><a className="hs-secondary-button" href="#syllable-chart">Jump to the chart</a></div>
    <section className="hs-card mt-8 p-6"><h2 className="text-2xl font-bold">Initials: the consonant opening</h2><p className="mt-3 text-xl leading-10">{initials.join(" · ")}</p><p className="mt-3 leading-7">These are the 21 consonant initials. y and w are spelling conventions for syllables beginning with i, ü or u sounds, not extra consonants in this count. Some syllables, such as ai, have no consonant initial.</p><h2 className="mt-6 text-2xl font-bold">Finals: the rest of the syllable</h2><p className="mt-3 text-lg leading-9">a · o · e · i · u · ü · ai · ei · ao · ou · an · en · ang · eng · ong · ia · ie · iao · iou · ian · in · iang · ing · iong · ua · uo · uai · uei · uan · uen · uang · ueng · üe · üan · ün · er</p><p className="mt-3 leading-7">After an initial, iou, uei and uen shorten to iu, ui and un. ü loses its dots after j, q, x and y, but keeps them after n and l, as in nǚ and lǜ. Not every initial combines with every final. The i in zhi, chi, shi, ri, zi, ci and si differs from the vowel in ji.</p></section>
    <section className="mt-8"><h2 className="text-2xl font-bold">Four tones and a neutral tone</h2><div className="mt-4 grid gap-3 sm:grid-cols-5">{[["1 · high level","mā 妈","mother"],["2 · rising","má 麻","hemp"],["3 · low / dipping","mǎ 马","horse"],["4 · falling","mà 骂","scold"],["Neutral · light","ma 吗","question particle"]].map(([tone,word,meaning])=><div className="hs-card p-4" key={tone}><h3 className="font-bold">{tone}</h3><p className="mt-2 text-xl">{word}</p><p className="mt-1 text-sm">{meaning}</p></div>)}</div><p className="mt-4 leading-7">A third tone is often low rather than fully dipping in connected speech. Before another third tone, it normally rises. Tone marks belong on a first, then e, then o in ou; otherwise mark the last vowel. Neutral syllables have no mark. A syllable does not necessarily have a common word in every tone.</p></section>
    <section className="mt-10"><h2 className="text-2xl font-bold">30 guided syllables with character examples</h2><ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{pinyinGuides.map(p=><li className="hs-card p-4" key={p.slug}><Link className="text-xl font-bold text-[#24466e] underline" href={`/pinyin/${p.slug}`}>{p.slug}</Link><p className="mt-2 text-sm leading-7">{p.examples.map(e=>`${e.pinyin} ${e.character}`).join(" · ")}</p></li>)}</ul></section>
    <section id="syllable-chart" className="mt-10"><h2 className="text-2xl font-bold">Syllable index by initial</h2><p className="mt-3 leading-7">This spelling reference includes uncommon combinations. Linked entries have a reviewed lesson; unlinked entries are reference spellings, not promises of a new character page. Tone examples are supplied in the 30 lessons rather than mechanically inventing four words for every spelling.</p>{[...initials,""].map(initial=><section className="mt-5" key={initial||"none"}><h3 className="font-bold">{initial||"No consonant initial (including y / w spellings)"}</h3><div className="mt-2 flex flex-wrap gap-2">{pinyinChart.filter(p=>p.initial===initial).map(p=><span key={p.syllable} className="rounded border border-[#ded7ca] px-3 py-2">{pinyinGuides.some(g=>g.slug===p.syllable)?<Link className="font-bold text-[#24466e] underline" href={`/pinyin/${p.syllable}`}>{p.syllable}</Link>:p.syllable}</span>)}</div></section>)}</section>
    <p className="mt-8 text-sm leading-7">Spelling combinations cross-checked with <a className="underline" href="https://pinyin.info/rules/initials_finals.html">Pinyin.info’s initials and finals chart</a>. Character readings were checked against dictionary and teaching examples. These are written pronunciation notes, not recorded audio.</p>
  </Frame>;
}

export function PinyinDetailPage({ guide: p }: { guide: typeof pinyinGuides[number] }) {
  return <Frame parent="pinyin" title={`${p.slug} in Pinyin: Pronunciation, Tones and Characters`}>
    <p className="mt-4 max-w-4xl text-lg leading-8">Compare {p.examples.map(e=>`${e.character} (${e.pinyin})`).join(", ")} and connect the sound of {p.slug} to a written character in context.</p>
    <Link className="hs-primary-button mt-5 inline-flex" href={learningWorksheetHref("pinyin",p.slug)}>Make a {p.slug} character worksheet</Link>
    <section className="hs-card mt-8 p-6"><h2 className="text-2xl font-bold">How to form the sound</h2><p className="mt-3 max-w-4xl leading-8">{p.sound}</p><h2 className="mt-6 text-2xl font-bold">Tone and word contrasts</h2><p className="mt-3 max-w-4xl leading-8">{p.contrast}</p></section>
    <section className="mt-8"><h2 className="text-2xl font-bold">Characters and their selected readings</h2><Examples examples={p.examples}/></section>
    <section className="hs-card mt-8 p-6"><h2 className="text-2xl font-bold">Practise sound and writing together</h2><p className="mt-3 max-w-4xl leading-8">{p.practice}</p><p className="mt-3 text-sm leading-7">The editor opens with these contextual readings, including neutral tones. Review them before printing; an alternate reading in another word does not invalidate this lesson’s selected sense.</p></section>
    <section className="mt-8"><h2 className="text-2xl font-bold">Compare another syllable</h2><p className="mt-3 text-sm leading-7">Keep track of which initial, final or tone changes when moving between these examples.</p><ul className="mt-4 flex flex-wrap gap-4">{getRelatedPinyinGuides(p.slug).map(other => <li key={other.slug}><Link className="font-bold text-[#24466e] underline" href={`/pinyin/${other.slug}`}>{other.slug}: {other.examples.map(e => `${e.character} ${e.pinyin}`).join(" / ")}</Link></li>)}</ul></section>
  </Frame>;
}
