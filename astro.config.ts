import { defineConfig, sharpImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "unocss/astro";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://dane.computer",
  experimental: {
    contentLayer: true,
    contentIntellisense: true,
  },
  image: {
    service: sharpImageService(),
  },
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    sitemap(),
    mdx(),
  ],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "solarized-light",
      wrap: true,
      transformers: [
        {
          preprocess(code) {
            if (code.endsWith("\n")) {
              code = code.slice(0, -1);
            }
            return code;
          },
        },
      ],
    },
  },
});
