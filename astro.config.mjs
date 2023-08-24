import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

import svgSpritesheet from "./integrations/svg-spritesheet";

// https://astro.build/config
export default defineConfig({
  site: "https://harrisonskitchen.com",
  experimental: {
    assets: true,
  },
  output: "server",
  adapter: cloudflare(),
  integrations: [
    svgSpritesheet({
      output: "/spritesheet.svg",
    }),
  ],
});
