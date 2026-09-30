# Deployment

How the concept demo and each bakery clone are hosted, built and published. The
goal is a repeatable, near-zero-cost deploy.

## 1. Target

- **Host:** Cloudflare Workers (static assets). No SSR.
- **Demo domain:** `https://demo-bakery.zuvo.lk`
- **Per clone:** `<bakery>.zuvo.lk` or the owner's own domain, attached to that
  clone's Worker.
- **Source:** private GitHub repo per bakery (created from this template).
- **Cost:** Cloudflare free tier and Google Sheets free tier only.

## 2. Build

```bash
npm ci
npm run check
npm run build     # output in dist/
```

`dist/` is plain static HTML/CSS/JS/images. There is no server component.

## 3. Cloudflare Workers (static assets)

Astro static output is served by a Worker using the static assets feature:

`wrangler.jsonc` (shape):

```jsonc
{
  "name": "concept-bakery",
  "compatibility_date": "2026-01-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
  },
}
```

Deploy:

```bash
npx wrangler deploy
```

Each clone sets its own `name` (the Worker name) in `wrangler.jsonc`. Keep the
Worker name and the domain name aligned (e.g. worker `sunrise-bakery`, domain
`sunrise-bakery.zuvo.lk`).

`not_found_handling: "404-page"` serves `dist/404.html` for unknown paths. Keep a
`src/pages/404.astro`.

## 4. Custom domain

1. The `zuvo.lk` zone is managed in the Cloudflare account.
2. In the Worker's **Settings > Domains & Routes**, add a custom domain
   `demo-bakery.zuvo.lk` (demo) or `<bakery>.zuvo.lk` (clone).
3. Cloudflare creates the DNS record automatically because the zone is on the same
   account. TLS is automatic.
4. For an owner's external domain, add it as a custom domain on the Worker and have
   the owner point DNS at Cloudflare as instructed by the dashboard.

## 5. Continuous deployment

Two options; pick one per repo:

- **Cloudflare Workers Builds** — connect the GitHub repo in the Cloudflare
  dashboard, set build command `npm run build`, and deploy on every push to `main`.
- **GitHub Actions** — a workflow running `npm ci && npm run build` then
  `wrangler deploy` using a `CLOUDFLARE_API_TOKEN` secret.

For the concept demo either is fine. For clones, Workers Builds is usually the
least setup.

## 6. Secrets

The static site needs no runtime secrets. Deployment credentials
(`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) live only as CI/GitHub secrets,
never in the repo or in `src/data/site.ts`.

The Google Sheet URL is public (published to web) and safe to commit; it contains
no credentials.

## 7. Headers and caching

- `public/_headers` sets long cache lifetimes for hashed assets and adds
  `X-Robots-Tag: noindex` while the site is not indexable.
- Because output is static, Cloudflare's edge caching handles most traffic.
- Keep total page weight low; most visitors are on mobile networks.

## 8. Rollback

Cloudflare keeps previous Worker versions. Roll back from **Workers > Deployments >
Rollback** if a deploy breaks the demo or a live bakery. Always verify the live
domain after deploying.

## 9. Post-deploy checklist

- [ ] Home, menu, about, gallery, visit pages load on mobile.
- [ ] Language switcher works for en/si/ta.
- [ ] WhatsApp order opens with the correct number and itemized message.
- [ ] `robots.txt` matches the intended `indexable` state; sitemap present only if
      indexable.
- [ ] No demo branding or demo phone number remains in a clone.
- [ ] Opening hours and map are correct.
