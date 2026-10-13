# Architecture

This document describes how the concept-bakery site is put together: the stack,
the folder layout, how data flows, how languages work, and how the cart behaves.

Because this repo is cloned per bakery, the architecture is deliberately boring and
centralized. A developer rebranding a clone should touch as few files as possible.

## 1. Stack

| Concern           | Choice                           | Why                                      |
| ----------------- | -------------------------------- | ---------------------------------------- |
| Framework         | Astro (`output: 'static'`)       | Static HTML, fast on 3G, near-zero JS    |
| Styling           | Tailwind CSS + CSS variables     | Fast layout, themable via tokens         |
| Content           | Astro Content Collections        | Schema-validated, easy to edit per clone |
| Menu prices/stock | Google Sheet (client-side fetch) | Free, familiar to owner, instant updates |
| Interactivity     | Vanilla JS modules               | Cart only; no framework islands          |
| Hosting           | Cloudflare Workers static assets | Free tier, global CDN                    |
| Domain            | `*.zuvo.lk` subdomain            | Bulk-managed demo/clone domains          |

No React/Vue/Svelte. If a future feature truly needs an island, document the reason
in `AGENTS.md` before adding it.

## 2. Folder structure (intended)

```text
concept-bakery/
├─ AGENTS.md
├─ README.md
├─ astro.config.ts           # site URL, i18n, sitemap gated on indexable, Tailwind
├─ wrangler.jsonc            # worker name + static assets config
├─ package.json
├─ tsconfig.json
├─ .prettierrc.json
├─ scripts/
│  └─ fetch-menu.ts          # build-time Sheet fetch -> src/data/menu-live.json
├─ public/
│  ├─ favicon.svg
│  ├─ logo.svg
│  ├─ _headers               # Cloudflare headers (X-Robots-Tag when noindex)
│  └─ images/                # item, hero, gallery images (dev-managed)
├─ src/
│  ├─ assets/
│  │  ├─ hero.jpg            # hero photo, optimized by Astro <Image>
│  │  ├─ about.jpg           # about/story photo
│  │  └─ gallery/            # gallery photos
│  ├─ data/
│  │  ├─ site.ts             # THE per-bakery config (see §3)
│  │  ├─ gallery.ts          # gallery photo list (imports src/assets/gallery)
│  │  ├─ product-images.ts   # drop-in product photos (src/assets/products)
│  │  └─ menu-live.json      # last-known-good Sheet data (written by scripts/)
│  ├─ content.config.ts      # schemas for products/categories/pages
│  ├─ content/
│  │  ├─ products/           # one file per item (file name = item id)
│  │  ├─ categories/         # one file per category
│  │  └─ pages/              # about/gallery/visit copy, one file per locale
│  ├─ i18n/
│  │  ├─ ui.ts               # ALL UI strings: en, si, ta
│  │  └─ utils.ts            # t(), getLangFromUrl(), localizePath(), switchLocalePath()
│  ├─ layouts/
│  │  └─ BaseLayout.astro    # <html lang>, meta, header/footer, cart, config JSON
│  ├─ components/
│  │  ├─ Header.astro
│  │  ├─ Footer.astro
│  │  ├─ LangSwitcher.astro
│  │  ├─ Seo.astro
│  │  ├─ hero/               # Hero.astro (classic | split | menu-first)
│  │  ├─ menu/               # Menu, CategoryNav, ProductGrid, ProductCard, ProductImage, BestSellers
│  │  ├─ cart/               # CartButton, CartDrawer, StickyOrderBar
│  │  ├─ visit/              # OpeningHours, MapEmbed, ContactLinks
│  │  └─ pages/              # HomePage, MenuPage, AboutPage, GalleryPage, VisitPage
│  ├─ lib/
│  │  ├─ menu.ts             # load products + merge menu-live.json (server-side)
│  │  ├─ whatsapp.ts         # builds the wa.me order URL + message
│  │  ├─ sheet.ts            # shared CSV fetch + parse (browser and build)
│  │  └─ format.ts           # LKR currency + number formatting
│  ├─ scripts/
│  │  └─ order.ts            # client cart, Sheet merge, WhatsApp hand-off
│  ├─ pages/
│  │  ├─ index.astro         # home (en)
│  │  ├─ menu.astro          # menu (en)
│  │  ├─ about.astro
│  │  ├─ gallery.astro
│  │  ├─ visit.astro
│  │  ├─ 404.astro
│  │  ├─ robots.txt.ts       # conditional on site.indexable
│  │  └─ [lang]/…            # si/ and ta/ routes (getStaticPaths)
│  └─ styles/
│     ├─ global.css
│     └─ theme.css           # design tokens as CSS variables
```

If you add a top-level folder, update this tree and the table in `AGENTS.md`.

## 3. `src/data/site.ts` — the single source of truth

Every bakery-specific value lives here so a clone is a one-file edit plus content:

```ts
export const site = {
  // Identity
  name: "Crumb & Co.",
  tagline: { en: "…", si: "…", ta: "…" },
  logo: "/logo.svg",
  // Contact
  whatsappNumber: "94771234567", // digits only, country code, no +
  phone: "+94 77 123 4567",
  email: "", // optional, display only
  address: { en: "…", si: "…", ta: "…" },
  mapEmbedUrl: "https://www.google.com/maps/embed?…",
  mapLink: "https://maps.google.com/?q=…",
  // Hours
  hours: [{ day: 1, open: "07:00", close: "20:00" } /* … */],
  // Socials
  socials: { facebook: "", instagram: "", tiktok: "" },
  // i18n + behaviour
  defaultLocale: "en",
  locales: ["en", "si", "ta"],
  // Ordering
  order: { allowPickup: true, allowDelivery: true },
  // Zuvo demo chrome — clones set enabled:false to drop the ribbon + [DEMO] tag
  demo: {
    enabled: true,
    tag: "[DEMO: Bakery]",
    studioName: "Zuvo Web Studio Express",
    studioWhatsAppNumber: "94743430033",
    ribbonText: "Sample website — a demo by Zuvo Web Studio Express",
    ribbonCta: "Message us",
  },
  // SEO — false for the concept demo, true for a real bakery clone
  indexable: false,
  siteUrl: "https://demo-bakery.zuvo.lk",
  currency: { code: "LKR", symbol: "Rs." },
  // Menu data source
  menu: {
    mode: "runtime", // 'runtime' (demo) | 'build' (clones)
    sheetId: "…",
    sheetTab: "Menu",
    refreshMinutes: 5, // runtime mode only
  },
  heroVariant: "classic", // 'classic' | 'split' | 'fullbleed'
} as const;

export type Site = typeof site;
```

Colors and fonts are CSS variables in `src/styles/theme.css` (so Tailwind utilities
and raw CSS share the same tokens). A clone changes the variable values there; the
component markup does not change.

## 4. Data flow

```text
Google Sheet (owner edits price + availability)
        │
        ├─ runtime browser fetch  (demo:  site.menu.mode = 'runtime')
        └─ fetch during CI build  (clone: site.menu.mode = 'build',
                                   rebuilt by Sheet -> Apps Script -> build trigger)
        ▼
menu items = base content (repo) + live price/stock (Sheet)
        │
        ▼
rendered ProductGrid / ProductCard
        │
        ▼
cart (localStorage)
        │
        ▼
src/lib/whatsapp.ts → wa.me/<number>?text=<order>
```

`src/lib/sheet.ts` is the single parser shared by both modes:
[`scripts/fetch-menu.ts`](../scripts/fetch-menu.ts) uses it at build time and writes
`src/data/menu-live.json`; the browser module uses it at runtime.

Key points:

- **Base item data** (name, image, category, translations, default price) lives in
  content collections under version control. It is enough to render the site even if
  the Sheet is unreachable.
- **Live price and availability** come from the Google Sheet and override the base
  values. If the Sheet or a fetch fails, the site falls back to the base content and
  still works (never break ordering because of a Sheet outage).
- **Two modes, one format.** The demo fetches at runtime so edits show up without a
  rebuild; clones fetch at build time so pages stay static and fast and are refreshed
  by the event-driven rebuild. See `docs/CONTENT-AND-MENU.md`.
- **Ordering never needs the Sheet to succeed** — the cart uses whatever price is
  currently displayed, but the message is an enquiry, so the owner confirms the
  final amount anyway.

Details of the Sheet format, fetch mechanism and fallback are in
`docs/CONTENT-AND-MENU.md`.

## 5. i18n / trilingual

- Astro i18n routing: `defaultLocale: 'en'`, `locales: ['en', 'si', 'ta']`,
  `prefixDefaultLocale: false`. English lives at `/menu`, Sinhala at `/si/menu`,
  Tamil at `/ta/menu`.
- Every UI string is keyed in `src/i18n/ui.ts` with `en`, `si`, `ta` values. A
  missing translation must fall back to `en`, never render `undefined`.
- Page copy and product/category names are localized in content collections. Product
  translations and the Sheet relationship are an open question — see
  `docs/CONTENT-AND-MENU.md`.
- `BaseLayout` sets `<html lang>` and `hreflang` alternates.
- The language switcher preserves the current page across locales.
- One deliberate exception: the Zuvo `DemoRibbon` is English in every locale (studio
  attribution, not bakery content). See "Demo chrome" in section 6.

## 6. Cart

- Pure vanilla module (`src/lib/cart.ts`) persisted to `localStorage` under a
  versioned key (e.g. `crumb-cart-v1`).
- State: array of `{ id, qty }`; item details are resolved from menu data at render
  time so prices cannot go stale in storage.
- UI: a cart button with a badge and a drawer. Quantity steppers with large tap
  targets. Mobile-first.
- Checkout step: pickup/delivery toggle (per `site.order`), optional customer name,
  phone and notes, then "Send order on WhatsApp".
- No login, no accounts, no server.

### Demo chrome and the `[DEMO]` tag

The concept wraps itself in Zuvo studio chrome so demos never read as a real
business:

- `DemoRibbon` (in `BaseLayout`, so every page and locale) — a slim brand-tinted
  bar linking to a **website enquiry** for the studio. English-only on purpose: it
  is studio attribution, not bakery content.
- Every **visitor-facing** demo message (order and enquiry CTAs, the cart/order
  summary) is prefixed with `site.demo.tag` (`[DEMO: Bakery] `) so it is not
  mistaken for a website enquiry.

Both are governed by one switch, `site.demo.enabled`. The central helpers live in
`src/lib/whatsapp.ts`: `withDemoTag()` (used inside `buildOrderMessage`) and
`buildDemoWhatsAppUrl()` (used by the hero and contact CTAs). The ribbon's own link
is intentionally **not** tagged — it is the website enquiry. A real bakery clone
sets `site.demo.enabled: false`, which drops the ribbon and the tag together.

## 7. Indexing

`site.indexable` drives the meta tag, `robots.txt` and the sitemap:

- `false` (concept default): `<meta name="robots" content="noindex, nofollow">`,
  `robots.txt` disallows everything, no sitemap generated, no Open Graph.
- `true` (real bakery): indexing allowed, sitemap generated (`@astrojs/sitemap`),
  Open Graph/Twitter meta and canonical URLs emitted.

One piece is **not** driven by the flag: `public/_headers` always adds
`X-Robots-Tag: noindex, nofollow`, which overrides everything above. A real bakery
clone must delete that line when it sets `indexable: true`, and set `siteUrl` to the
real domain. Otherwise the site stays invisible to search engines. See "Turning on
indexing" in `docs/CUSTOMIZATION.md`.

Never commit a demo with `indexable: true`, and never ship a production clone with
`indexable: false`.

## 8. Performance and accessibility

- Static HTML first; JS is only the cart/Sheet hydration, kept small.
- Images: use Astro `<Image>` where possible; serve appropriately sized WebP with
  explicit dimensions and lazy loading below the fold.
- Semantic landmarks, skip link, focus states, visible labels, keyboard-operable
  cart. Color contrast must pass WCAG AA regardless of indexability.
- Test on a simulated slow 3G connection and a narrow viewport for every change.
