# concept-bakery

A reusable, trilingual (English / Sinhala / Tamil) concept website for small
bakeries in Sri Lanka. Visitors browse the menu, build an order, choose pickup or
delivery, and send the itemized order to the owner **on WhatsApp**. No payments,
no backend, no monthly cost.

This repository is a **concept / template**. It is shown to bakery owners as a live
demo and then cloned and rebranded into that bakery's real site. The demo lives at
`https://demo-bakery.zuvo.lk`.

> If you are an AI agent or a developer about to change anything, read
> [`AGENTS.md`](./AGENTS.md) first. It contains the non-negotiable rules.

## Why this exists

Small bakeries in Sri Lanka sell through Facebook, WhatsApp and phone calls. They
do not have websites, and they do not want a payment gateway or a booking system.
This concept gives them a fast, mobile-first menu where every order arrives as a
normal WhatsApp chat they already know how to handle.

- **Zero running cost** — static files on Cloudflare's free tier.
- **WhatsApp-only ordering** — no forms, no payment gateway, no checkout.
- **Owner-editable prices/availability** — via a free Google Sheet (see below).
- **Trilingual** — English (default), Sinhala, Tamil.
- **Fast to clone** — branding and content are centralized so a rebrand is quick.

## Quickstart

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # preview the built site
npm run check     # astro check (types + content schema)
npx wrangler deploy
```

## Documentation

| Doc                                                      | What it covers                                                  |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| [`AGENTS.md`](./AGENTS.md)                               | Purpose, rules, where to change what, definition of done        |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)         | Stack, folder structure, data flow, i18n, cart                  |
| [`docs/DESIGN-BRIEF.md`](./docs/DESIGN-BRIEF.md)         | Pages/sections, mobile-first rules, hero variants, theme tokens |
| [`docs/CONTENT-AND-MENU.md`](./docs/CONTENT-AND-MENU.md) | Menu data, the Google Sheet, translations                       |
| [`docs/ORDER-FLOW.md`](./docs/ORDER-FLOW.md)             | The WhatsApp order flow in detail                               |
| [`docs/CUSTOMIZATION.md`](./docs/CUSTOMIZATION.md)       | Clone/rebrand checklist for a real bakery                       |
| [`docs/CLIENT-CHECKLIST.md`](./docs/CLIENT-CHECKLIST.md) | Client-facing intake list and ready-to-send WhatsApp message    |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)             | Cloudflare Workers, domains, GitHub                             |

## Status

Implemented and building clean (`npm run check`, `npm run lint`, `npm run build`).
The demo ships with `indexable: false`, an empty `menu.sheetId` (so it runs from the
content collections until a Sheet is connected) and `menu.mode: "runtime"`.

- Home, menu, about, gallery and visit pages, in English / Sinhala / Tamil.
- Vanilla cart + WhatsApp order hand-off (`src/scripts/order.ts`).
- Bakery theme tokens in `src/styles/theme.css` (Warm Crumb default, plus presets).
- Google Sheet reader shared by the runtime and build-time paths
  (`src/lib/sheet.ts`, `scripts/fetch-menu.ts`).

Remaining implementation detail: the exact event-driven build trigger for clones.
See `docs/CONTENT-AND-MENU.md`.
