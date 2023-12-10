import {
  defineConfig,
  presetWebFonts,
  transformerVariantGroup,
  presetUno,
  presetIcons,
  presetTypography,
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
    presetTypography(),
  ],
  transformers: [transformerVariantGroup()],
});
