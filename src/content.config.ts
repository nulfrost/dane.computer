import { defineCollection } from "astro:content";
import { leafletStaticLoader } from "@nulfrost/leaflet-loader-astro";

const documents = defineCollection({
	loader: leafletStaticLoader({ repo: "did:plc:qttsv4e7pu2jl3ilanfgc3zn" }),
});

export const collections = { documents };
