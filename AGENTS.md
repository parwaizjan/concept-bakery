# AGENTS.md

This file is the entry point for any AI agent or developer working in this repository.
Read it fully before making changes. It explains what this repository is, what it is
for, and the rules that must be preserved when it is cloned.

## 1. What this repo is

`concept-bakery` is **a reusable reference/template website for small bakeries in
Sri Lanka**. It is a _concept_ that is pitched to real bakery owners. It is not a
single bakery's production site.

The business model is:

1. A prospective bakery owner is shown the live demo.
2. If they like it, **this repo is cloned (it is a GitHub Template Repository)** and
   rebranded into that bakery's real website.
3. Downtime between showing the demo and going live should be as close to zero as
   possible. Cloning + rebranding must be a quick, mechanical, repeatable process.

Because of this, the repository is optimized for **fast turnaround and low ongoing
cost**, not for one-off bespoke work.

- Demo site: `https://demo-bakery.zuvo.lk`
- Hosting: Cloudflare Workers (static assets), custom domain via `*.zuvo.lk`
- Source: private GitHub repo
- Target market: Sri Lankan bakeries
- Languages: **English (default), Sinhala (`si`), Tamil (`ta`)** — trilingual

## 2. The one feature that sells this concept

**Ordering via WhatsApp.** The visitor browses the bakery's items, builds a cart
with quantities, chooses pickup or delivery, and taps a button that opens WhatsApp
with a fully itemized order message pre-filled, addressed to the bakery owner.
There is **no payment gateway, no backend, no contact form, no email**.

Everything else is presentation around this core flow. If a proposed change does
not serve "browse items -> build order -> send on WhatsApp", question whether it
belongs.

## 3. Non-negotiable rules

These are product and business constraints. Do not violate them without explicit
human instruction recorded in this file.

1. **Zero running cost.** No paid services, no servers, no databases that cost money.
   The owner must be able to run the site on free tiers indefinitely.
2. **Static output only.** Astro renders to static HTML. No SSR, no server routes
   that require a running Worker at request time (Cloudflare's static asset serving
   is fine). This keeps hosting free and fast.
3. **WhatsApp-only ordering.** No contact forms, no email endpoints, no checkout.
   "Enquiry only": totals shown are indicative and the owner confirms in chat. No
   delivery fees are calculated.
4. **Owner must be able to update prices and availability for free, with minimal
   tech skill.** The chosen mechanism is a Google Sheet (see
   `docs/CONTENT-AND-MENU.md`). Do not introduce a login/admin panel/CMS that adds
   cost or complexity for the owner. The owner does **not** add new items
   themselves; new items and photos are sent to the developer.
5. **No indexing by default.** The concept/demo must not appear in search results.
   Cloning a real bakery turns indexing on in **three** places together: set
   `indexable: true` in `src/data/site.ts`, **delete the `X-Robots-Tag: noindex`
   line from `public/_headers`**, and set `siteUrl` to the real domain. Missing any
   of the three keeps the site out of search results. See "Turning on indexing" in
   `docs/CUSTOMIZATION.md`. Never ship a demo with indexing on, and never ship a
   paid bakery clone with indexing off.
6. **Trilingual structure is mandatory.** Every user-facing string must be
   translatable. English is the default; `si` and `ta` are first-class. Do not
   hardcode English copy into components. See `docs/ARCHITECTURE.md`. One deliberate
   exception: the Zuvo `DemoRibbon` is English in every locale (studio attribution,
   not bakery content) and is dropped in clones via `site.demo.enabled: false`.
7. **All bakery-specific values live in one place.** Brand name, logo, colors,
   WhatsApp number, address, map, hours, socials, locales and feature flags live in
   `src/data/site.ts` and the content collections. Components must not contain
   bakery-specific literals.
8. **Low JavaScript.** The cart is small vanilla JS (localStorage + DOM). Do not add
   a client framework (React/Vue/Svelte) unless a feature genuinely requires it and
   it is documented as a deliberate decision.
9. **Mobile-first.** Most visitors arrive on phones from Facebook/WhatsApp links.
   Test every change at mobile widths first. Large tap targets; fast on 3G.
10. **Accessibility and SEO hygiene** (when indexable): semantic HTML, alt text,
    language attributes, per-page meta. Accessibility always, regardless of
    indexability.

## 4. Where to change what

| You want to change...                                | Edit this                                                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Bakery name, tagline, logo, colors, fonts            | `src/data/site.ts`, `src/styles/theme.css`, `public/logo.svg`                                             |
| WhatsApp number, phone, address, map, hours, socials | `src/data/site.ts`                                                                                        |
| Demo ribbon / `[DEMO]` tag / studio number           | `src/data/site.ts` (`demo`), `src/components/DemoRibbon.astro`                                            |
| Indexing on/off, sitemap, robots                     | `src/data/site.ts` (`indexable`), `src/pages/robots.txt.ts`, `public/_headers` (`X-Robots-Tag`)           |
| Enabled languages / default language                 | `src/data/site.ts`, `astro.config.mjs`                                                                    |
| Menu items, categories, images (new items)           | `src/content/products/`, `src/content/categories/`, `src/assets/` (`products/`, `gallery/`, `gallery.ts`) |
| Live prices / availability (owner)                   | Google Sheet (documented in `docs/CONTENT-AND-MENU.md`)                                                   |
| UI labels, buttons, nav, order message copy          | `src/i18n/ui.ts` (all three languages)                                                                    |
| Hero layout / section order                          | `src/components/hero/`, `src/pages/index.astro`                                                           |
| WhatsApp order message format                        | `src/lib/whatsapp.ts`                                                                                     |
| Deployment / domain / worker name                    | `wrangler.jsonc`, `docs/DEPLOYMENT.md`                                                                    |

## 5. Standard workflow

```bash
npm install          # install deps
npm run dev          # local dev server at http://localhost:4321
npm run build        # static build to dist/
npm run preview      # preview the built site
npm run check        # astro check (types + content schema)
npm run lint         # prettier check
npm run format       # prettier write
npx wrangler deploy  # deploy dist/ to Cloudflare Workers
```

Always run `npm run check`, `npm run lint` and `npm run build` before considering a
change done. There is no test suite yet; if you add one, document it here and in
`README.md`.

## 6. Cloning this repo into a real bakery site

This repo is the source. A clone must be a fast, mechanical rebrand. The full
checklist lives in `docs/CUSTOMIZATION.md`. Summary:

1. Create a new repo from this template (or copy the files), not a fork with
   history, so the new bakery starts clean.
2. `npm install`.
3. Edit `src/data/site.ts` end to end (name, contacts, colors, locales, indexable).
   For a real bakery set `indexable: true` **and** delete the `X-Robots-Tag` line
   from `public/_headers`, and set `siteUrl` to the real domain — all three, or the
   site stays out of search results. See `docs/CUSTOMIZATION.md`.
4. Replace `public/logo.svg`, `public/favicon.svg`, and hero/gallery images.
5. Update content: categories, products, page copy, translations.
6. Point the menu at the bakery's own Google Sheet.
7. `npm run check && npm run build`.
8. Deploy with `wrangler deploy`; attach the bakery's custom domain.
9. Verify: WhatsApp order message arrives, `robots.txt` allows indexing and no
   `X-Robots-Tag` header is sent (indexing truly on), language switcher works,
   hours/map are correct.

Do not leave placeholder branding, demo phone numbers, or `indexable: false` in a
production clone.

## 7. Definition of done

A change is complete when:

- [ ] `npm run check` passes.
- [ ] `npm run build` succeeds and `dist/` is valid static output.
- [ ] All new user-facing strings exist in `en`, `si` and `ta`.
- [ ] No bakery-specific value was hardcoded outside `site.ts` / content.
- [ ] The WhatsApp order flow still produces a correct, itemized message.
- [ ] The `indexable` behavior is correct for the context (demo vs clone).
- [ ] Verified on a mobile viewport.

## 8. Open questions / decisions pending

Track unresolved decisions here so agents do not silently pick one:

- **Google Sheets: mechanism and ownership are decided.** Demo uses a runtime
  browser fetch; production clones use an event-driven build (Sheet edit -> Apps
  Script -> build trigger -> static redeploy). Sheets are owner-owned, shared with
  the developer, and link-shared as viewer by default. Remaining implementation
  detail: the build trigger (Workers Builds deploy hook vs GitHub Actions
  `workflow_dispatch`) and the Apps Script trigger type. Do not switch mechanisms
  without recording the reason. See `docs/CONTENT-AND-MENU.md`.
- Whether Sinhala/Tamil product names come from the sheet, a translation file, or
  both. See `docs/CONTENT-AND-MENU.md`.
- Whether a lightweight test setup (Playwright smoke test of the order flow) is
  worth adding.

When you resolve one of these, move the decision into the relevant doc and leave a
short note here.

## 9. Documentation map

- `README.md` — human-facing overview and quickstart.
- `docs/ARCHITECTURE.md` — stack, folder structure, data flow, i18n, cart.
- `docs/DESIGN-BRIEF.md` — pages/sections, mobile-first rules, hero variants,
  theme tokens, component inventory.
- `docs/CONTENT-AND-MENU.md` — menu data, Google Sheets, translations.
- `docs/ORDER-FLOW.md` — the WhatsApp ordering flow in detail.
- `docs/CUSTOMIZATION.md` — step-by-step rebrand/clone checklist.
- `docs/CLIENT-CHECKLIST.md` — client-facing intake list and WhatsApp message; keep
  it free of developer jargon and credentials.
- `docs/DEPLOYMENT.md` — Cloudflare Workers, domains, GitHub, secrets.
