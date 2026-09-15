# Kayco product catalog

Verified September 15, 2026. Read alongside [the CMS contract](cms-integration.md).

## Connections

| Purpose | Location |
| --- | --- |
| Private upstream | `https://kayco-planning-dashboard.clondinski1234.workers.dev/api/v1/items?range=Tuscanini` |
| Public website endpoint | `GET /api/catalog` |
| Server-only variable | `KAYCO_API_KEY` (never use a `VITE_` prefix) |
| Reviewed SKU mapping and public snapshot | `src/data/kayco-catalog.generated.ts` |
| Catalog merge and image validation | `src/data/kayco-catalog.ts` |
| Upstream filtering and cache | `server/kayco-catalog.ts` |

The dashboard's `pages.dev/api/v1/overview` URL returns HTML. Authenticated API requests use the Worker address above. The browser only reads the public endpoint. The Vercel function, local Vite middleware, and optional build-time reads use the private key. No key, sales, costs, prices, buyer, customer, inventory, or raw ERP title is included in public responses.

## Selection

The API returned 301 Tuscanini items, of which 254 had images. The reviewed snapshot refreshes 135 existing products and adds 67, for 210 products in 23 categories. The other eight existing products retain their original content and URLs. All 199 distinct API image URLs returned successful image responses during integration.

- Add only active Tuscanini retail items (`status: A`) with images. Never add a product without an image.
- Exclude bulk, foodservice, club/Costco, Canadian duplicate, display, shipper, and empty-bin records from additions.
- Match exact reviewed SKUs; do not guess at runtime using names or image filenames.
- Equivalent seasonal SKU records share a retail page rather than creating indistinguishable duplicate listings.
- Existing IDs, URLs, and recipe references remain stable. Additions use a readable slug followed by the SKU.
- Previously unreviewed SKUs require an explicit mapping and rebuild, so new routes and the sitemap are available when products appear.

New categories are Crackers & Breadsticks, Gelato & Sorbetto, and Dessert Sauces. Starter category copy is code-managed until corresponding CMS categories are published. Frozen products use the existing “Where to buy” link.

## Source precedence

The CMS continues to own descriptions, details, ingredients, certification, category copy, recipes, pages, navigation, footer, and settings. A valid published CMS catalog is the editorial base; otherwise the bundled editorial catalog is used.

The reviewed API mapping then supplies readable product names and stable category placement for additions. The API supplies image, package size, and origin. Existing CMS category placement and editorial fields remain intact. The API has no ingredients or kosher certification; new products do not invent those values.

Raw ERP names contain internal codes and abbreviations and are not displayed. Public names are reviewed in the mapping. An upstream name/category change needs a mapping review and deployment. API images are hosted at `https://kayco-planning-dashboard.pages.dev/product-images/…`; they are not editable CMS uploads. Editing `data.image`, title, size, or origin in the CMS does not override an API-mapped field. Editorial images still use CMS `site-media` uploads.

A missing or invalid API image cannot add a product. Existing products retain their original image if no eligible replacement is available. On a successful live read, inactive or imageless additions are omitted. On an outage, the last successful response or reviewed snapshot remains available.

## Rendering and caching

The initial render merges bundled editorial content with the reviewed public snapshot. CMS reads and `/api/catalog` run concurrently on each new document load. The complete merged catalog replaces the initial view when they settle. There is no polling.

The server caches successful reads for five minutes and coalesces simultaneous refreshes. Responses allow a 60-second browser cache, 300-second shared cache, and up to an hour of stale responses while revalidating. Authenticated redirects are rejected and upstream error details are not forwarded.

`meta.source` identifies delivery: `live`, `cached`, or `snapshot`. A deployment without a configured key serves the snapshot; do not describe it as live synchronization.

The build prepares one merged catalog in ignored `.artifacts/catalog-build.json`. Both sitemap and route HTML use that same catalog. Rebuild for new/removed routes or updated static search/social metadata. Existing products can refresh images and package data on a new page load.

## Deployment

This change requires a public-site deployment. Configure `KAYCO_API_KEY` as a server-only Vercel environment variable for live refresh. The snapshot works without a key. No CMS publish is required for this integration; CMS editorial changes continue through the existing publishing workflow.

Locally, set the key in the process environment or ignored `.env.local`, then run `pnpm dev`. Do not commit a real value. The server reads the key without exposing it through Vite's client environment.

During this integration the configured CMS hostname did not resolve from the development machine. The bundled editorial fallback and live Kayco source were verified; a new CMS publication was not verified.

## Adding another product

1. Read the private item endpoint server-side and retain only public product fields.
2. Confirm active retail status, exact package/variant identity, image response and actual pack art.
3. Add a reviewed entry to the mapping, keeping any existing public ID. Do not reuse one product's image for a different SKU.
4. Add category metadata if needed; keep editorial fields in the CMS when available.
5. Run catalog tests, lint, typecheck, and build. Check search, category shelf, detail page, direct route HTML, and sitemap.
6. Deploy the public site. Do not publish new images or content to the CMS unless that separate change is requested.
