import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GridHanzi",
    short_name: "GridHanzi",
    description:
      "Create printable Chinese character practice sheets with Hanzi, Pinyin, tracing, and writing grids.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#A80017",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
