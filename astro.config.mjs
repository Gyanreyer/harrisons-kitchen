import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://harrisonskitchen.com",
  output: "server",
  adapter: cloudflare(),
});
