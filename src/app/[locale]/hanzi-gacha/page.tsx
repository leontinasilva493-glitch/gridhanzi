import type { Metadata } from "next";
import { envConfigs } from "@/config";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";
import { PublicPageShell } from "@/features/worksheets/components/site-shell";
import { HanziGacha } from "@/features/worksheets/components/hanzi-gacha";
import "./style.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const chinese = locale === "zh";
  const title = chinese ? "汉字扭蛋：抽卡收集与书写练习" : "Hanzi Gacha: Chinese Character Collection Game";
  const description = chinese
    ? "免费抽取并收集汉字卡，学习拼音与字义，查看笔顺，并将喜欢的汉字制作成可打印的书写练习纸。"
    : "Draw and collect Chinese character cards, learn Pinyin and meanings, explore stroke order, and make a printable Hanzi worksheet. Free, with no sign-up.";
  const seo = buildPageSeoMetadata(envConfigs.app_url, "/hanzi-gacha", locale, { title, description });
  return { ...seo, title, description, twitter: { card: "summary_large_image", title, description, images: ["/og-gridhanzi.png"] } };
}

export default function Page() {
  return <PublicPageShell active="hanzi-gacha"><HanziGacha /></PublicPageShell>;
}
