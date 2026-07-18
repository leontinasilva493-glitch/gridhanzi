import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

const isBuild = process.argv.includes("build") || process.argv.includes("deploy");
const useCloudflare = isBuild || process.env.VINEXT_CLOUDFLARE_DEV === "1";

export default defineConfig({
  plugins: [
    vinext(),
    ...(useCloudflare
      ? [cloudflare({ viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] } })]
      : []),
  ],
  optimizeDeps: {
    exclude: ["next-intl"],
  },
});
