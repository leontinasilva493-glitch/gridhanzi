import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GridHanzi",
    short_name: "GridHanzi",
    description:
      "Create printable Chinese character practice sheets with Hanzi, Pinyin, tracing, and writing grids.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF9F0",
    theme_color: "#19324A",
    icons: [
      {
        src: "/gridhanzi-icon-128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/gridhanzi-icon-256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/gridhanzi-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
