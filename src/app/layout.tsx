import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@/components/analytics";
import { envConfigs } from "@/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(envConfigs.app_url),
  applicationName: "GridHanzi",
  title: {
    default: "GridHanzi — Chinese Character Practice Sheet Generator",
    template: "%s | GridHanzi",
  },
  description:
    "Make printable Chinese writing worksheets from your own word list, with editable Hanzi, Pinyin, tracing, and writing grids.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/gridhanzi-icon-128.png", type: "image/png", sizes: "128x128" },
      { url: "/gridhanzi-icon-256.png", type: "image/png", sizes: "256x256" },
    ],
    apple: [
      { url: "/gridhanzi-icon-256.png", type: "image/png", sizes: "256x256" },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    title: "GridHanzi",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "GridHanzi — Chinese Character Practice Sheet Generator",
    description: "Paste a word list, check the Hanzi and Pinyin, and download a printable Chinese worksheet.",
    url: "/",
    siteName: "GridHanzi",
    type: "website",
    images: [{ url: "/og-gridhanzi.png", width: 1200, height: 630, alt: "GridHanzi Chinese character practice sheet generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GridHanzi — Chinese Worksheet Generator",
    description: "Make a Chinese practice sheet from your own words, then edit and download it.",
    images: ["/og-gridhanzi.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased">
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
