# Customization — cloning into a real bakery

This is the checklist for turning the concept into a specific bakery's live site.
It must be quick and mechanical. If a step is unclear or missing, fix this doc.

## 0. Before you start

- Get from the owner: business name, logo, brand colors, WhatsApp number, phone,
  address, Google Maps location, opening hours, social links, menu (items, prices,
  photos), and any Sinhala/Tamil names.
- Confirm whether the bakery needs both pickup and delivery.
- Confirm the domain (usually `<bakery>.zuvo.lk`, or the owner's own domain).

## 1. Create the new project

1. On GitHub, use this repo's **Use this template** button to create a new private
   repo (do **not** fork — start with clean history).
2. Clone it locally and `npm install`.

## 2. Rebrand

1. **`src/data/site.ts`** — edit every value:
   - `name`, `tagline` (en/si/ta), `logo`
   - `whatsappNumber` (digits + country code, no `+`), `phone`, `email`, `address`,
     `mapEmbedUrl`, `mapLink`
   - `hours`, `socials`
   - `order.allowPickup` / `order.allowDelivery`
   - `demo.enabled: false` to remove the Zuvo sample ribbon **and** the
     `[DEMO: Bakery]` prefix on visitor messages (a live bakery must not advertise
     Zuvo or tag its orders as a demo)
   - `indexable: true` for a real bakery (and see "Turning on indexing" below)
   - `siteUrl` to the bakery's real domain, `currency` if different
   - `heroVariant` if the owner wants a different hero
2. **`src/styles/theme.css`** — set the brand colors/fonts (CSS variables). Do not
   edit component styles for color.
3. **`public/`** — replace `logo.svg`, `favicon.svg`, and the Open Graph image.
4. **Images** — replace the hero photo (`src/assets/hero.jpg`, ≥1680px wide), the
   about/story photo (`src/assets/about.jpg`), the gallery photos
   (`src/assets/gallery/`, listed in `src/data/gallery.ts`) and the product photos
   (`src/assets/products/`, named after each product id).

### Turning on indexing (do not miss this)

The concept ships invisible to search engines on purpose. A **live bakery must be
findable**, so all three of these have to change together or the site will stay
out of Google even when it looks live:

1. **`src/data/site.ts` → `indexable: true`.** This enables Open Graph tags, the
   sitemap, and makes `src/pages/robots.txt.ts` emit an allow-all `robots.txt`.
2. **`public/_headers` → delete the `X-Robots-Tag: noindex, nofollow` line.** This
   header overrides the meta tag, so leaving it in keeps the whole site invisible.
3. **`src/data/site.ts` → `siteUrl`** must be the bakery's real domain, not the demo
   domain, or canonical/hreflang/sitemap URLs will point at the demo.

Then confirm on the live domain (not `preview`):

- `robots.txt` shows `Allow: /` (not `Disallow: /`).
- Page head has no `noindex` and shows `og:title` / `og:image`; `<html lang>` is right.
- `curl -sI https://<domain>/ | grep -i x-robots` returns nothing.
- `https://<domain>/sitemap-index.xml` returns `200`.

## 3. Content

1. Delete the demo products/categories under `src/content/`.
2. Add the bakery's categories and products (names + `si`/`ta`, descriptions,
   default prices, images). Optimize images before committing.
3. Update About/Gallery page copy for all three languages.
4. Review every string in `src/i18n/ui.ts` — the demo brand name and any
   bakery-specific wording must be replaced.

## 4. Google Sheet (owner's price editor)

1. Create a new Google Sheet owned by the bakery (ideally a dedicated bakery Gmail
   they control), and share it with the developer as an editor. Set link sharing to
   viewer if using the default public-read setup.
2. Add the header row and one row per item using the ids from the product files
   (see `docs/CONTENT-AND-MENU.md`).
3. Set `site.menu.mode = 'build'`, `site.menu.sheetId`, and `site.menu.sheetTab` in
   `src/data/site.ts`. `scripts/fetch-menu.ts` reads these automatically.
4. Install the Apps Script on the Sheet that triggers a rebuild on change (the
   event-driven build described in `docs/CONTENT-AND-MENU.md`). Prototype this once
   on the concept before cloning so every clone can reuse it.
5. Walk the owner through editing price/availability, then ask them to change one
   price and confirm the live site updates after the rebuild.

## 5. Build and verify

```bash
npm run check
npm run build
npm run preview
```

Then verify, on a phone-sized viewport:

- [ ] Logo, colors, name, tagline are correct; no leftover demo branding.
- [ ] No Zuvo sample ribbon and no `[DEMO: …]` prefix on live messages
      (`site.demo.enabled: false`).
- [ ] WhatsApp number is the owner's; no demo numbers anywhere.
- [ ] Menu items, prices, images and translations are correct.
- [ ] Sheet edits (price + availability) show up on the live page.
- [ ] Order flow: add items, choose pickup/delivery, send — owner receives a
      correct itemized message.
- [ ] Indexing fully on (see "Turning on indexing"): `indexable: true`,
      `X-Robots-Tag` removed from `public/_headers`, `siteUrl` set to the real
      domain; `robots.txt` allows, no `noindex` meta, the `X-Robots-Tag` header is
      gone, the sitemap returns `200`, and `og:title`/`og:image` are present.
- [ ] Opening hours and Google Map point to the right place.
- [ ] Language switcher works for en/si/ta and preserves the page.

## 6. Deploy and hand over

1. Follow `docs/DEPLOYMENT.md`: rename the Worker, deploy, attach the domain.
2. Do a final check on the live domain (not just `preview`).
3. Give the owner: the live URL, the Google Sheet link, and a one-page note on how
   to mark items sold out and update prices.

## Common mistakes

- Leaving `indexable: false` in a production clone.
- Setting `indexable: true` but forgetting to delete `X-Robots-Tag: noindex` from
  `public/_headers`, or leaving `siteUrl` at the demo domain — the site stays out of
  search results even though it is live.
- Leaving the demo WhatsApp number or the demo Sheet URL.
- Leaving Zuvo demo chrome in a live clone: the sample ribbon or the
  `[DEMO: Bakery]` message prefix (`site.demo.enabled` must be `false`).
- Editing colors in components instead of `theme.css`.
- Adding English-only strings (missing `si`/`ta`).
- Committing unoptimized multi-megabyte photos.
