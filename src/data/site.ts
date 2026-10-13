/**
 * THE per-bakery configuration.
 *
 * Every bakery-specific value lives here. A clone only needs to edit this file,
 * `src/styles/theme.css`, the content collections and `public/`. Components must
 * never contain bakery-specific literals.
 */

export type Locale = "en" | "si" | "ta";

export type LocalizedText = {
  en: string;
  si?: string;
  ta?: string;
};

export type OpeningHour = {
  /** 0 = Sunday … 6 = Saturday */
  day: number;
  /** 24h "HH:MM". Leave `open` empty to mark the day closed. */
  open: string;
  close: string;
};

export const site = {
  // Identity
  name: "Crumb & Co.",
  tagline: {
    en: "Freshly baked every morning in Colombo.",
    si: "සෑම උදෑසනකම කොළඹ නැවුම් ලෙස පිළිස්සෙන.",
    ta: "கொழும்பில் ஒவ்வொரு காலையும் புதிதாக சுடப்படுகிறது.",
  },
  logo: "/logo.svg",

  // Contact
  whatsappNumber: "94743430033", // digits only, country code, no "+"
  phone: "+94 77 000 0000",
  email: "", // display only; orders go to WhatsApp
  address: {
    en: "12 Galle Road, Colombo 03, Sri Lanka",
    si: "12 ගාලු පාර, කොළඹ 03, ශ්‍රී ලංකාව",
    ta: "12 காலி வீதி, கொழும்பு 03, இலங்கை",
  },
  mapEmbedUrl:
    "https://www.google.com/maps?q=Colombo%2003%2C%20Sri%20Lanka&output=embed",
  mapLink: "https://maps.google.com/?q=Colombo+03,+Sri+Lanka",

  // Opening hours (0 = Sunday … 6 = Saturday)
  hours: [
    { day: 0, open: "07:00", close: "13:00" },
    { day: 1, open: "06:30", close: "20:00" },
    { day: 2, open: "06:30", close: "20:00" },
    { day: 3, open: "06:30", close: "20:00" },
    { day: 4, open: "06:30", close: "20:00" },
    { day: 5, open: "06:30", close: "20:00" },
    { day: 6, open: "06:30", close: "20:00" },
  ] as OpeningHour[],

  // Socials (empty string hides the link)
  socials: {
    facebook: "",
    instagram: "",
    tiktok: "",
  },

  // i18n
  defaultLocale: "en" as Locale,
  locales: ["en", "si", "ta"] as Locale[],

  // Ordering
  order: {
    allowPickup: true,
    allowDelivery: true,
  },

  // Menu data source.
  //  - "runtime": the demo fetches the public Sheet in the browser (instant edits).
  //  - "build":   clones fetch the Sheet during the build (static, event-driven rebuild).
  // Leave `sheetId` empty to run entirely from the content collections.
  menu: {
    mode: "runtime" as "runtime" | "build",
    sheetId: "",
    sheetTab: "Menu",
    refreshMinutes: 5,
  },

  // Zuvo demo chrome. Real bakery clones set `enabled: false` to remove the sample
  // ribbon and the `[DEMO: …]` prefix on every visitor message in one move. The
  // studio number receives website enquiries (owners wanting a site like this one),
  // which is a different conversation from a bakery order.
  demo: {
    enabled: true,
    tag: "[DEMO: Bakery]",
    studioName: "Zuvo Web Studio Express",
    studioWhatsAppNumber: "94743430033",
    ribbonText: "Sample website — a demo by Zuvo Web Studio Express",
    ribbonCta: "Message us",
  },

  // SEO — false for the concept demo, true for a real bakery clone.
  indexable: false,
  siteUrl: "https://demo-bakery.zuvo.lk",
  currency: { code: "LKR", symbol: "Rs." },
  heroVariant: "overlay" as "classic" | "split" | "menu-first" | "overlay",
} as const;

export type Site = typeof site;
