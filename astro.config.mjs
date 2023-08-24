import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://harrisonskitchen.com",
  experimental: {
    assets: true,
  },
  output: "server",
  adapter: cloudflare(),
});
