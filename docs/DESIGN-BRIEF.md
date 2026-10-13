# Design brief

The visual and structural direction for the concept, shared by every clone. A clone
keeps this structure and swaps tokens, imagery and copy. Keep this doc and
`docs/ARCHITECTURE.md` in sync.

## 1. Goals and constraints

- **Mobile-first.** Most visitors and demo-viewing owners are on phones. Design at
  360px first, then scale up.
- **Order in under a minute.** The path from landing to "order sent on WhatsApp"
  must be short and obvious.
- **Warm, appetising, trustworthy.** A bakery, not a corporate landing page.
- **Low JavaScript, fast on 3G.** Static HTML with a small cart/sheet script.
- **Trilingual without clutter.** The layout must survive longer Sinhala/Tamil
  strings; never rely on tight fixed-width text.
- **Template, not bespoke.** Structure stays stable; tokens and content change.

## 2. Page structure

The **homepage is the primary ordering surface**. The full menu lives on it so a
visitor can start adding items after one scroll. A dedicated `/menu` page mirrors
the same menu component for sharing and indexing.

Every page in every locale starts with a slim, non-dismissible **Zuvo sample ribbon**
(`DemoRibbon`) above the header: studio attribution plus a "Message us" website
enquiry link. It is brand-tinted (`bg-primary text-on-primary`), small and centered,
**English-only by design** (studio chrome, not bakery content), and disappears when
`site.demo.enabled` is false.

Homepage sections, in order:

1. **Header** (sticky, compact): logo, language switcher, cart button with a count
   badge.
2. **Hero** — brand name, tagline, primary call to action ("View menu"), secondary
   "Chat on WhatsApp". Variant controlled by `site.heroVariant`.
3. **Quick-info strip** — open now / today's hours, pickup and delivery availability.
4. **Menu** (the core section) — sticky category chips, product cards, one-tap add.
5. **Best sellers** — optional band highlighting `featured` items.
6. **About teaser** — two or three sentences and a photo, linking to `/about`.
7. **Gallery strip** — a few photos, linking to `/gallery`.
8. **Visit us** — address, Google Map, hours, phone, WhatsApp and socials.
9. **Footer** — hours summary, socials, language switcher, small print.

Dedicated pages:

- `/menu` — full menu (deep link; same component as the homepage section).
- `/about`, `/gallery`, `/visit` — expanded content.
- `/404` — friendly not-found with a link back to the menu.

Routing: English at the root, Sinhala under `/si/...`, Tamil under `/ta/...`.

**Decision:** the full menu is on the homepage. `/menu` is a mirror, not the only
home of the menu. If a bakery's menu grows very large, the filter still keeps the
homepage usable.

## 3. Menu section behaviour (mobile-first)

- **Category chips** across the top of the section, horizontally scrollable with
  large tap targets; active category reflects scroll position (scroll-spy).
- **Product cards**: image (or a placeholder), name, short description, price,
  availability state ("Sold out" disabled), and an add control.
- **One-tap add** from the card; quantity adjusted afterwards in the cart.
- **Sticky bottom order bar** appears once the cart has items: item count, running
  total (indicative), and "View order".
- **Sold-out items** are visibly de-emphasised and cannot be added. If the Sheet says
  an item in the cart is now sold out, warn before sending.
- **Prices update** from the Sheet without a reload; defaults render instantly first.
- No hover-only actions; every interaction works with touch and keyboard.

## 4. Hero variants

Selected per clone with `site.heroVariant`:

- `overlay` — full-bleed photo, copy left-aligned over a dark left-to-right
  gradient. The demo default; suits photos whose subject sits on one side.
- `classic` — full-bleed image, brand name and tagline centred, CTA below.
- `split` — text on the left, image on the right; stacks on mobile.
- `menu-first` — a short, compact hero so the menu starts within the first scroll.

The hero image lives at `src/assets/hero.jpg` and is optimized by Astro `<Image>`
(WebP srcset). Replace it per clone with a landscape photo at least ~1680px wide.

## 5. Theme tokens (`src/styles/theme.css`)

Bakery aesthetic: warm, edible, high contrast, readable outdoors on a phone. All
colours and fonts are CSS variables so a clone rebrands by editing values only.

### Default palette — "Warm Crumb"

| Token                    | Value     | Use                                  |
| ------------------------ | --------- | ------------------------------------ |
| `--color-bg`             | `#FFF8F1` | Page background (warm cream)         |
| `--color-surface`        | `#FFFFFF` | Cards                                |
| `--color-surface-alt`    | `#F6E9DC` | Alternating bands                    |
| `--color-text`           | `#3B2A21` | Body text (cocoa)                    |
| `--color-text-muted`     | `#7A6558` | Secondary text                       |
| `--color-primary`        | `#C4673A` | Buttons, links, accents (terracotta) |
| `--color-primary-strong` | `#A8502A` | Hover/active                         |
| `--color-on-primary`     | `#FFFFFF` | Text on primary                      |
| `--color-accent`         | `#7C8C4A` | Tags, small highlights (pistachio)   |
| `--color-border`         | `#E8D8C8` | Borders, dividers                    |
| `--color-success`        | `#3F7D4E` | "Available" / order confirmed        |
| `--color-danger`         | `#B23A3A` | "Sold out", errors                   |
| `--color-focus`          | `#1D4ED8` | Visible keyboard focus ring          |

### Alternate presets (for pitch variety)

- **Midnight Cocoa** — dark background, cream text, gold accent.
- **Rose Vanilla** — soft pink/cream, deep rose primary.
- **Pistachio Cream** — cream and green, warm brown text.

Keep presets as token overrides, not separate stylesheets. The demo can switch
between them for pitches; a clone picks one and customises.

### Typography

- `--font-heading`: a warm serif with character (e.g. **Fraunces**).
- `--font-body`: a clean, legible sans (e.g. **Inter**).
- Type scale and line heights as tokens (`--text-sm` … `--text-4xl`). Long
  Sinhala/Tamil strings must wrap without clipping.

### Shape, depth, motion

- Radii: `--radius-sm` 6px, `--radius-md` 12px, `--radius-lg` 20px,
  `--radius-full` 9999px — soft and friendly.
- Shadows: one or two soft, low-opacity tokens.
- Motion: subtle transitions only; respect `prefers-reduced-motion`.
- Spacing: 4px base scale (`--space-1` … `--space-12`); container max ~1120px,
  reading width ~720px.

## 6. Component inventory

- Layout: `BaseLayout`, `DemoRibbon`, `Header`, `Footer`, `LangSwitcher`, `Seo`.
- Hero: `Hero` under `components/hero/`, switching on `site.heroVariant`
  (`classic` | `split` | `menu-first`).
- Menu: `Menu`, `CategoryNav`, `ProductGrid`, `ProductCard`, `AvailabilityBadge`,
  `BestSellers`.
- Cart: `CartButton`, `CartDrawer`, `StickyOrderBar`. Quantity steppers and the
  order form are rendered inside `CartDrawer` / driven by `scripts/order.ts`.
- Visit: `OpeningHours`, `MapEmbed`, `ContactLinks`.
- Page templates: `components/pages/` — `HomePage`, `MenuPage`, `AboutPage`,
  `GalleryPage`, `VisitPage` (shared across locales).

## 7. Accessibility and performance budgets

- Semantic landmarks, skip link, visible focus, AA contrast in every preset.
- `<html lang>` per locale; `hreflang` alternates.
- Cart and Sheet script budget: small (target well under ~15KB gzipped, no
  framework). If this is exceeded, justify it in `AGENTS.md`.
- Target LCP under ~2.5s on a mid-range phone on slow 3G. Optimise images (WebP,
  correct dimensions, lazy below the fold).

## 8. What a clone customises

- Token values in `theme.css` (colours, fonts, radii) and `heroVariant` in
  `site.ts`.
- Logo and favicon in `public/`; hero, about and gallery photos live in
  `src/assets/` (`hero.jpg`, `about.jpg`, `gallery/`, listed in
  `src/data/gallery.ts`) and are optimized by Astro `<Image>`.
- Section order only if a bakery truly needs it — prefer keeping the standard
  structure for fast turnaround.
