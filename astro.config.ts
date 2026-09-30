// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import { site } from "./src/data/site";

// Sitemap is only generated for indexable sites (real bakery clones).
// The concept/demo ships with `indexable: false` and must not be indexed.
export default defineConfig({
  site: site.siteUrl,
  output: "static",
  i18n: {
    defaultLocale: site.defaultLocale,
    locales: [...site.locales],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: site.indexable ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
