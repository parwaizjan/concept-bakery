import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const localizedText = z.object({
  en: z.string(),
  si: z.string().optional(),
  ta: z.string().optional(),
});

/**
 * Menu products. The file name (without `.md`) is the item id used to match rows in
 * the owner's Google Sheet, so keep it stable once live.
 */
const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    category: z.string(),
    name: localizedText,
    description: localizedText.optional(),
    image: z.string().optional(),
    price: z.number().nonnegative(),
    available: z.boolean().default(true),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

/** Menu categories. The file name is the category id referenced by products. */
const categories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/categories" }),
  schema: z.object({
    name: localizedText,
    order: z.number().default(0),
    image: z.string().optional(),
  }),
});

/** Long-form page copy, one file per locale: `about/en.md`, `about/si.md`, … */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { products, categories, pages };
