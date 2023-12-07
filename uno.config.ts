import {
  defineConfig,
  presetWebFonts,
  transformerVariantGroup,
  presetUno,
  presetIcons,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: "Asap:100,300,400,600,700",
      },
    }),
    presetIcons(),
  ],
  transformers: [transformerVariantGroup()],
});
