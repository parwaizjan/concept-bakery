# Content and menu

How menu items are defined, how the bakery owner keeps prices and availability up
to date for free, and how the three languages are handled.

This doc contains **open decisions** (flagged below). Do not silently pick one —
record the decision here and remove the flag.

## 1. What is static vs what is live

| Data                                     | Source                                         | Who edits | How often                         |
| ---------------------------------------- | ---------------------------------------------- | --------- | --------------------------------- |
| Item name, category, image, translations | Content collections (repo)                     | Developer | Rarely — when a new item is added |
| Price                                    | Default in content, overridden by Google Sheet | Owner     | Often                             |
| Availability (in stock / sold out)       | Google Sheet                                   | Owner     | Often                             |
| Categories                               | Content collections                            | Developer | Rarely                            |
| Page copy (about, gallery)               | Content collections                            | Developer | Rarely                            |

Rule of thumb: **the owner edits a spreadsheet; the developer edits the repo.**

## 2. Content collections

`src/content/products/` — one Markdown/YAML file per item:

```yaml
# src/content/products/love-cake.md
category: cakes
name:
  en: Love Cake
  si: ලව් කේක්
  ta: லவ் கேக்
description:
  en: Rich, spiced Sri Lankan love cake.
  si: …
  ta: …
image: /images/love-cake.webp
price: 1800 # default in LKR; overridden by the Sheet
available: true # default; overridden by the Sheet
featured: true
```

**The file name (without `.md`) is the item id** and is what the Sheet must reference.
Keep it stable once the item is live.

**Product photos:** drop a photo named after the product id into
`src/assets/products/` (e.g. `soft-bread.jpg`, `love-cake.png`). It is picked up
automatically by `src/data/product-images.ts` — no code change needed. Products
without a matching file fall back to `public/images/placeholder.svg`. Preferred
size: 4:3 landscape, 1200x900, JPG or PNG.

`src/content/categories/` — one file per category with localized names and sort
order. `src/content/pages/` — about/gallery/visit copy, one file per locale
(`about/en.md`, `about/si.md`, `about/ta.md`).

`src/content.config.ts` defines and validates these schemas so `npm run check`
catches mistakes. Build-time Sheet data is written to `src/data/menu-live.json` and
merged over these defaults by `src/lib/menu.ts`.

New items and new photos are added by the **developer** after the owner sends
details. Owners do not add items themselves.

## 3. The owner's editing surface: Google Sheets

The owner maintains a single Google Sheet with live price and availability. They
already understand spreadsheets and it costs nothing.

### Proposed sheet format

| id        | name (read-only) | price | available | note (optional) |
| --------- | ---------------- | ----- | --------- | --------------- |
| love-cake | Love Cake        | 1800  | yes       |                 |
| milk-rice | Milk Rice        | 120   | no        | back tomorrow   |

- `id` matches the product's content file id (the developer sets this when adding
  the item).
- `price` in LKR, numbers only.
- `available` = `yes` / `no` (or `TRUE` / `FALSE`).
- The owner edits `price` and `available` only. They can add a short `note`.

### Decisions

- **Mechanism:** the demo uses **runtime browser fetch**; production clones use an
  **event-driven build** (see below). Both read the same simple sheet format.
- **Ownership:** every Sheet is **owner-owned**. Ideally the bakery creates a
  dedicated Gmail the owner controls rather than using a personal account; it is
  shared with the developer as an editor, and a last-known-good copy is kept in the
  repo. The concept demo uses a developer-owned Sheet.
- **Access:** the Sheet is link-shared as viewer (prices are not secret). Owners who
  insist on a private Sheet need the optional service-account path noted below.

### Demo: runtime browser fetch

The concept demo fetches the Sheet in the visitor's browser and merges values over
the base content, so price/availability changes appear without a rebuild.

- Endpoint: the **Google Visualization CSV** endpoint
  `…/gviz/tq?tqx=out:csv&sheet=<tab>`, or published CSV. Verify CORS from a
  Cloudflare origin with a real fetch before relying on it; the Sheets API v4 with a
  referrer-restricted key is the fallback if a CORS problem appears.
- Cache the successful response in `sessionStorage` for a few minutes to cut
  requests and speed up repeat views. Published CSVs are themselves edge-cached by
  Google for roughly five minutes.
- **Never guess at CORS** — test it.

### Clones: event-driven build (recommended)

Production clones keep the data static so pages stay fast and reliable:

1. Owner edits price/availability in the Sheet (or clicks a "Publish" custom menu
   item added by the setup script).
2. A Google Apps Script bound to the Sheet fires on change and calls a build
   trigger.
3. The site rebuilds, fetching the Sheet **at build time**, and redeploys.

- Build trigger: prefer a **GitHub Actions `workflow_dispatch`** (Apps Script POSTs
  to the GitHub API with a fine-grained token stored in Script Properties), which
  runs `npm run build` + `wrangler deploy`. Verify whether Cloudflare Workers Builds
  exposes an inbound deploy hook; if it does, use that instead.
- Debounce triggers (script lock / a short time window) so a burst of edits causes
  one rebuild, not many.
- A failed trigger or build is safe: the previously deployed static site stays live.

**OPEN IMPLEMENTATION NOTE:** the exact build trigger (Workers Builds deploy hook
vs GitHub Actions dispatch) and the Apps Script trigger type (`onChange` vs a
"Publish" menu) are implementation details to finalize while building. Neither
changes the data format or the ownership model.

### Private-sheet option

A build-time fetch can read a Sheet that is **not** public by sharing it with a
Google service account and putting the key in CI secrets. This adds a Google Cloud
project and key rotation per clone, so it is opt-in, not the default. A runtime
browser fetch can never use a private Sheet.

### Cost

- Google Sheets, publishing to web and Apps Script are **free** for a normal Google
  account. No Google Cloud billing account is required for the publish/CSV route.
- Runtime fetch: the Sheet is read in the visitor's browser, so there is **no server
  and no Cloudflare cost**.
- Build-time fetch: the read happens during CI. GitHub Actions free minutes
  (2,000/month on the free plan) comfortably cover the few rebuilds a bakery
  produces per day; avoid noisy per-edit rebuilds via debouncing.
- Quotas are generous for bakery-scale traffic; the risk is an abuse spike, not
  normal use.

### Failure fallback

Both paths must degrade gracefully:

- Render prices/availability from the base content (last known good values under
  version control).
- For runtime fetch, cache the last successful fetch and use it if the network or
  Sheet is unavailable.
- For the event-driven build, the last successful deploy stays live.
- Validate parsed rows; ignore unknown columns; require a known `id`.
- Never block the menu or the WhatsApp button because of a Sheet error — the order
  is an enquiry, so a stale price is not fatal.

## 4. Translations of menu items

**OPEN DECISION:** Where Sinhala/Tamil product names come from.

Options:

- **A. Content collection only** — developer supplies `si`/`ta` names in each
  product file. The Sheet only carries price/availability. Clean, but new items need
  a translation step by the developer.
- **B. Sheet carries three name columns** — `name_en`, `name_si`, `name_ta`. Owner
  would have to type Sinhala/Tamil, which many owners cannot comfortably do.
- **C. Hybrid** — Sheet carries `name_en` for quick fixes; developer fills `si`/`ta`
  in the product file. Recommended: keeps the owner's workload minimal while still
  delivering a fully localized site.

Regardless of choice, a missing `si`/`ta` value must fall back to `en` rather than
showing an empty string.

## 5. Adding a new item — workflow

1. Owner sends the developer: name, category, price, description, and a photo
   (WhatsApp is fine).
2. Developer adds an image under `public/images/`, optimizes it, and adds a product
   file under `src/content/products/` with `en`/`si`/`ta` content and a default
   price.
3. Developer adds a row with the same `id` to the bakery's Google Sheet and tells
   the owner they can now edit its price/availability.
4. `npm run check && npm run build`, deploy.

## 6. Currency and formatting

- Currency is LKR (`Rs.`). Format via `src/lib/format.ts`; do not hardcode `Rs.`
  in components.
- Totals in the WhatsApp message are indicative (enquiry only). No delivery fee is
  calculated.
