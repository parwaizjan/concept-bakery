import type { ImageMetadata } from "astro";

import bread from "../assets/gallery/bread.jpg";
import cakes from "../assets/gallery/cakes.jpg";
import drinks from "../assets/gallery/drinks.jpg";
import milkRice from "../assets/gallery/milk-rice.jpg";
import shortEats from "../assets/gallery/short-eats.jpg";
import sweets from "../assets/gallery/sweets.jpg";
import type { UiKey } from "../i18n/ui";

/**
 * Photos shown in the "From our bakery" section and on /gallery.
 *
 * Add new photos to `src/assets/gallery/`, import them here, and give each one an
 * `altKey` that exists in all three languages (`src/i18n/ui.ts`).
 */
export type GalleryImage = {
  src: ImageMetadata;
  altKey: UiKey;
};

export const gallery: GalleryImage[] = [
  { src: shortEats, altKey: "gallery.altShortEats" },
  { src: sweets, altKey: "gallery.altSweets" },
  { src: cakes, altKey: "gallery.altCakes" },
  { src: bread, altKey: "gallery.altBread" },
  { src: drinks, altKey: "gallery.altDrinks" },
  { src: milkRice, altKey: "gallery.altMilkRice" },
];
