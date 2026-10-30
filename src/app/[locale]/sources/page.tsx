import { envConfigs } from "@/config";
import { Link } from "@/core/i18n/navigation";
import { PublicPageShell } from "@/features/worksheets/components/site-shell";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildPageSeoMetadata(envConfigs.app_url, "/sources", locale, {
    title: "Worksheet Sources and Review Scope",
    description: "Where GridHanzi vocabulary and stroke guides come from, how teaching defaults are selected, and how worksheet inputs are processed.",
  });
}

export default function Page() {
  return <PublicPageShell>
    <main className="mx-auto max-w-3xl px-5 py-12 text-[#14253f]">
      <h1 className="hs-display text-4xl font-bold">Worksheet sources and review scope</h1>
      <p className="mt-4">Updated October 23, 2026. These notes describe the tool and the scope of our content checks; they are not a claim of teacher certification.</p>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold">Vocabulary and HSK versions</h2>
        <p>Our bundled vocabulary is derived from <a className="underline" href="https://github.com/drkameleon/complete-hsk-vocabulary/tree/v1.4">complete-hsk-vocabulary v1.4</a>. HSK 2.0 and 3.0 labels retain that dataset&apos;s classifications. Template themes are GridHanzi groupings, not official exam categories. See the <a className="underline" href="https://www.chinesetest.cn/HSK">Chinese Test Service</a> for current exam information.</p>
        <p>A dictionary may list several readings and meanings. We select common beginner defaults for exact words, and course-specific meanings where needed: 早 means “Good morning!” in Greetings; 点 means “dot stroke” in a stroke lesson. Other meanings remain valid in other contexts. Automatically filled content should be checked before teaching.</p>
        <p>Our latest software-assisted pass covered the displayed HSK 2.0 Level 1 list and the School and Greetings templates. It corrected selected readings and context mismatches. It does not certify every HSK level or replace a qualified teacher&apos;s review. Neutral-tone syllables intentionally have no tone mark; spelling spaces may differ between sources.</p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold">Character forms and stroke guides</h2>
        <p>Stroke guides use Hanzi Writer data version 2.0.1, loaded from jsDelivr. Taiwan Traditional conversion uses OpenCC; changing character forms does not automatically convert pronunciation to a regional standard. Pinyin is supported; Zhuyin is not currently provided. Stroke conventions can differ by region.</p>
        <p>If stroke data cannot load, the preview warns you and may contain fewer pages. Retry the guides before comparing page counts with a ready-made PDF. Changing paper, cell size or practice mode can also change pagination.</p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold">Free use and input processing</h2>
        <p>Creating, printing and downloading worksheets does not require an account or payment. Automatic completion has request limits and may be unavailable. You can continue editing manually. This page does not grant additional rights to third-party vocabulary, fonts or stroke datasets; their original licenses still apply.</p>
        <p>PDF rendering happens in your browser. The editor uses browser storage for drafts and preview handoff when storage is available. Automatic completion sends the entered words and selected difficulty and character standard to our server. When Gemini is configured, those words are also sent to Google for completion. Do not enter sensitive student information in that request.</p>
        <p>The site uses Google Analytics and Microsoft Clarity for usage and usability analysis. Worksheet analytics events omit word-list text and student names; feedback fields are masked for session replay. These controls do not make the whole site an offline-only tool.</p>
        <p>PVUV (pvuv.ai) also measures visits, traffic sources, page engagement, download-link clicks, and browser performance, and uses browser signals to help identify automated traffic. Its script sends page URLs, referrers, device and browser information, and visitor/session identifiers to in.pvuv.ai. It uses cookies and local storage for visitor identification. We do not add worksheet text or student names to PVUV events.</p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-semibold">Report a teaching or output error</h2>
        <p>Use the help and feedback controls in the worksheet preview. Include the template, affected word, expected reading or meaning, and source if available. Remove student names and private classroom information before sharing an example.</p>
        <Link className="hs-primary-button inline-flex" href="/generator">Open the worksheet editor</Link>
      </section>
    </main>
  </PublicPageShell>;
}
