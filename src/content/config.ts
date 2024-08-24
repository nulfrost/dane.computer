import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.number(),
    published_at: z.date(),
  }),
});

export const collections = { blog };
