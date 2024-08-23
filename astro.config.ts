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
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "solarized-light",
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
