import { defineConfig, sharpImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "unocss/astro";

export default defineConfig({
  site: "https://dane.computer",
  image: {
    service: sharpImageService(),
  },
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    sitemap(),
  ],
});
