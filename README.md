# Tuscanini Site

Tuscanini's public React site, with the Kayco product API and Kayco Sites CMS editorial content.

Agents and developers changing content, images, catalog behavior, navigation, or branding must read the [site-specific CMS integration contract](docs/cms-integration.md) and the repository-wide [agent instructions](AGENTS.md) first. Those documents identify exactly what the CMS controls, what remains hardcoded, and whether a change needs a CMS publish, a site deployment, or both.

## Production

- Website: <https://tuscanini-site.vercel.app>
- Admin: <https://kayco-sites-admin.vercel.app>
- Content API: <https://qkatfirzwukmgdrytbue.supabase.co/functions/v1/content-api>

The site immediately renders a reviewed product snapshot with bundled editorial content, then loads CMS content and the public `/api/catalog` endpoint concurrently. The product API provides mapped names, images, package sizes, origin, and reviewed active retail additions; the CMS provides editorial fields. New products must have images. Existing IDs remain stable.

See [the product API contract](docs/kayco-product-api.md) for source precedence, filtering, and caching. Configure `KAYCO_API_KEY` only on the server (Vercel or the local process/ignored `.env.local`). Without it, the reviewed public snapshot is used. The key is never sent to the browser. Adding product routes requires a rebuild and deployment; this integration does not require a CMS publish.

Editors can use the admin to update catalog wording and images, reorder content, publish page hero content and CTA links, replace the site logo, and change the site title, tagline, and primary color.

## Local development

Requirements: Node.js 22+ and pnpm.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The development server runs at <http://127.0.0.1:3000>. To use another CMS environment, set `VITE_KAYCO_CONTENT_API_URL` in `.env.local`; otherwise the hosted Kayco content API is used.

Run the quality gates before publishing:

```bash
pnpm lint
pnpm build
```

## Product image source audit

Kayco's public WordPress catalog can be compared with the published Tuscanini CMS catalog without changing either system:

```bash
pnpm kayco:images:audit
```

The command checks `robots.txt`, discovers the live Tuscanini brand term, reads the paginated product and featured-media metadata, and writes JSON, CSV, and a side-by-side HTML review page under `.artifacts/kayco-images/`. Matching is conservative: unique SKU clues are preferred, fuzzy candidates remain review-only, and placeholders are rejected.

To also download the full-resolution Kayco sources into the ignored staging artifact directory:

```bash
pnpm kayco:images:stage
```

Neither command edits CMS drafts, uploads media, or publishes content. Confirm internal authorization before republishing scraped assets. After product/package review, approved images must be uploaded through the Tuscanini CMS to its `site-media` area and selected on the existing product drafts. Do not hotlink Kayco image URLs or add a privileged Supabase key to this public application.

## Deployment

The Vercel project is connected to the GitHub repository. Merges to `main` create the production deployment, while pull requests receive preview deployments.

The `/admin` route redirects editors to the shared Kayco Sites admin.
