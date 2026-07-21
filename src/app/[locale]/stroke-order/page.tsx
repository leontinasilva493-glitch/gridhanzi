import type { Metadata } from "next";

import { StrokeOrderClient } from "@/features/worksheets/components/stroke-order-client";
import { PublicPageShell } from "@/features/worksheets/components/site-shell";
import { envConfigs } from "@/config";
import { buildPageSeoMetadata } from "@/features/worksheets/seo";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Chinese Stroke Order",
    description:
      "Enter a Chinese character to see its stroke order, play one stroke at a time, practise on screen, or add it to a worksheet.",
    ...buildPageSeoMetadata(envConfigs.app_url, "/stroke-order", locale),
  };
}

export default function StrokeOrderPage() {
  return (
    <PublicPageShell active="stroke-order">
      <main className="hs-container pb-4 pt-6">
        <div className="text-sm text-[#617084]">Home &nbsp;/&nbsp; Stroke Order</div>
        <header className="mt-2 text-center">
          <h1 className="hs-display text-4xl font-bold sm:text-5xl">
            Chinese Stroke Order
          </h1>
          <p className="mt-2 text-[#566276]">
            Enter a character to watch the strokes, practise on screen, or add
            it to a worksheet.
          </p>
        </header>
        <StrokeOrderClient />
      </main>
    </PublicPageShell>
  );
}
