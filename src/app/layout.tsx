import type { Metadata } from "next";
import { Inter, Libre_Baskerville, Noto_Serif_SC } from "next/font/google";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@/components/analytics";
import { envConfigs } from "@/config";
import { locales } from "@/config/locale";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-display",
});
const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-serif-sc",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(envConfigs.app_url),
  title: {
    default: "HanziSheets 汉字字帖 — Chinese Worksheet Generator",
    template: "%s | HanziSheets",
  },
  description:
    "Create bilingual Chinese writing worksheets with Hanzi, Pinyin, English meanings, stroke order, tracing, and printable grids.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "HanziSheets 汉字字帖 — Chinese Worksheet Generator",
    description: "Create printable bilingual Chinese worksheets with real stroke order and direct PDF download.",
    url: "/",
    siteName: "HanziSheets 汉字字帖",
    type: "website",
    images: [{ url: "/og-hanzisheets.png", width: 1200, height: 630, alt: "HanziSheets printable Chinese worksheet generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HanziSheets 汉字字帖",
    description: "Printable Chinese practice sheets with Hanzi, Pinyin, tracing, and real stroke order.",
    images: ["/og-hanzisheets.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const appUrl = envConfigs.app_url || '';

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {locales.map((loc) => (
          <link
            key={loc}
            rel="alternate"
            hrefLang={loc}
            href={`${appUrl}${loc === 'en' ? '' : `/${loc}`}`}
          />
        ))}
      </head>
      <body
        className={`${inter.variable} ${libreBaskerville.variable} ${notoSerifSC.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
