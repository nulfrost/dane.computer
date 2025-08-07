import { defineCollection, z } from "astro:content";
import { leafletStaticLoader } from "@nulfrost/leaflet-loader-astro";
import { glob } from "astro/loaders";

const blogs = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/data/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		year: z.number(),
		published_at: z.date(),
	}),
});

const documents = defineCollection({
	loader: leafletStaticLoader({ repo: "did:plc:qttsv4e7pu2jl3ilanfgc3zn" }),
});

export const collections = { documents, blogs };
