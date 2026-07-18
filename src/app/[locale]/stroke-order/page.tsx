import type { Metadata } from "next";

import { StrokeOrderClient } from "@/features/worksheets/components/stroke-order-client";
import { PublicPageShell } from "@/features/worksheets/components/site-shell";

export const metadata: Metadata = {
  title: "Chinese Stroke Order",
  description:
    "Watch Chinese character stroke-order animations, inspect every stroke, practise writing, and add the character to a printable worksheet.",
};

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
            Watch each stroke, practise it, or add the character to a printable
            worksheet.
          </p>
        </header>
        <StrokeOrderClient />
      </main>
    </PublicPageShell>
  );
}

