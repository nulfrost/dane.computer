import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "unocss/astro"

export default defineConfig({
  site: "https://dane.computer",
  integrations: [
    UnoCSS({
      injectReset: true
    }),
    sitemap(),
  ],
});
