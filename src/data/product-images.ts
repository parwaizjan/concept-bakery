import type { ImageMetadata } from "astro";

/**
 * Product photos, auto-loaded from `src/assets/products/`.
 *
 * Drop an image in that folder named after the product id (the content file name),
 * e.g. `soft-bread.jpg`, `love-cake.png`. No code change is needed — the file is
 * picked up here and used on the product card. Products without a matching file
 * fall back to `public/images/placeholder.svg`.
 *
 * Recommended: 4:3 landscape (e.g. 1200x900), JPG or PNG.
 */
const modules = import.meta.glob<ImageMetadata>(
  "../assets/products/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);

export const productImages: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(modules).map(([path, image]) => {
    const id =
      path
        .split("/")
        .pop()
        ?.replace(/\.[^.]+$/, "") ?? "";
    return [id, image];
  }),
);
