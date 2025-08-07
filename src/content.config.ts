import { defineCollection, z } from "astro:content";
import { leafletStaticLoader } from "@nulfrost/leaflet-loader-astro";
import { glob } from "astro/loaders";

const blogs = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/data/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishedAt: z.union([z.date(), z.string()]).transform((val) => {
			if (val instanceof Date) return val;
			return new Date(val);
		}),
		publication: z.string().optional(),
		author: z.string().optional(),
		// Optional fields to match documents structure
		rkey: z.string().optional(),
		cid: z.string().optional(),
		// Keep year for backward compatibility if needed
		year: z.number().optional(),
	}),
});

const documents = defineCollection({
	loader: leafletStaticLoader({ repo: "did:plc:qttsv4e7pu2jl3ilanfgc3zn" }),
});

export const collections = { documents, blogs };
