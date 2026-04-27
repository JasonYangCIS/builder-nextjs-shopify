# Post-Vercel TODO

Working list for the headless Builder.io + Shopify sandbox after the first Vercel deploy.

**Production URL:** https://builder-nextjs-shopify-sandbox.vercel.app/

Tick items as we go. Order matters for items 1–7; Builder content (8–10) and validation (11–16) can run in parallel.

---

## Deploy & domain

- [x] **1. First deploy.** Push repo → import in Vercel → first deploy with placeholder env vars to obtain the stable URL.
- [x] **2. Set production env vars in Vercel.** Copy each value from local `ProposeEnvVariable` history. Generate a **new** `SESSION_SECRET` for prod (don't reuse dev). Set:
  - `SHOPIFY_STORE_DOMAIN` = `builder-jason.myshopify.com`
  - `SHOPIFY_STOREFRONT_API_TOKEN`
  - `SHOPIFY_STOREFRONT_API_VERSION` = `2024-10`
  - `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID`
  - `SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI` = `https://builder-nextjs-shopify-sandbox.vercel.app/api/auth/callback`
  - `NEXT_PUBLIC_BUILDER_API_KEY`
  - `SESSION_SECRET` (fresh)
  - `APP_ORIGIN` = `https://builder-nextjs-shopify-sandbox.vercel.app`
  - `SHOPIFY_CUSTOMER_ACCOUNT_API_URL` (when available)
  - `SHOPIFY_WEBHOOK_SECRET` (when available)
- [x] **3. Lock to a stable domain.** Either keep the auto-generated `*.vercel.app` URL (above) as the canonical origin, or assign a custom subdomain. Preview deploys get unique URLs that **won't** pass the OAuth allow-list, so OAuth login only works on production.

## Shopify wiring

- [x] **4. Add Vercel callback to Customer Account API allow-list.** In Shopify admin → Headless channel → Customer Account API → add `https://builder-nextjs-shopify-sandbox.vercel.app/api/auth/callback` to the redirect-URI allow-list. Keep the `localhost:3000` entry too if you still want to test locally.
- [x] **5. Pull `SHOPIFY_CUSTOMER_ACCOUNT_API_URL`** from Shopify Headless channel → set in Vercel → redeploy → smoke-test `/api/auth/login` round-trip.
- [x] **6. Create Shopify webhooks** at Settings → Notifications → Webhooks:
  - `products/update` → `https://builder-nextjs-shopify-sandbox.vercel.app/api/webhooks/shopify`
  - `inventory_levels/update` → same URL
  - (optional) `products/delete`, `collections/update`
  - Copy the shared signing secret from the bottom of the Webhooks section → set `SHOPIFY_WEBHOOK_SECRET` in Vercel → redeploy.
- [x] **7. Verify webhook flow.** Edit a product in Shopify; confirm `revalidateTag` invalidates the PDP cache (PDP shows new data on next request without waiting for the 60s revalidate window).

## Builder.io content

- [x] **8. Create models** in Builder.io: `page`, `product`, `collection`, `navigation`, `footer`, `announcement-bar`. Add a Home `page` entry with `urlPath: "/"`.
- [ ] **9. Index repo for Builder.** Run `npx @builder.io/dev-tools index-repo` so the editor knows about registered components + design tokens.
- [ ] **10. Build a sample Home page** in Builder.io using `HeroSplit` + `ProductGrid`; verify live preview at `/preview` works inside the Builder editor.

## Validation

- [ ] **11. Critical happy path on prod:** browse → PDP → add to cart → discount code → checkout redirect (bogus gateway).
- [ ] **12. Customer auth round-trip:** login → `/account` loads → order history loads → logout clears session.
- [ ] **13. Playwright + axe** (`npm run e2e`) against the Vercel URL; fix any a11y violations.
- [ ] **14. SEO surface:** `/sitemap.xml` lists products+collections, `/robots.txt` allows prod, JSON-LD validates in Google Rich Results test, `/api/og/<slug>` returns 1200×630.
- [ ] **15. Security headers** via securityheaders.com → expect A or A+ (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- [ ] **16. Secret hygiene:** View Source + Network tab on the deployed site — confirm Shopify tokens **never** appear in the client bundle or in any `/api/*` response payloads.

## Optional

- [ ] **17. Vercel ↔ Builder integration** so content publishes auto-trigger redeploys.
- [ ] **18. Vercel Analytics / Speed Insights** for runtime perf data.

---

## Merge checklist (before clicking merge on the PR)

- [ ] `npm run typecheck` clean
- [ ] `npm run lint` clean
- [ ] `npm test` passes
- [ ] First Vercel deploy succeeds (build doesn't fail on `generateStaticParams`)
- [ ] At least one Builder page renders on prod
- [ ] At least one PDP renders on prod with JSON-LD present
- [ ] Add to cart → discount → checkout works end-to-end on prod
