# Tuscanini Site

Tuscanini's public React site, backed by the Kayco Sites CMS.

Agents and developers changing content, images, catalog behavior, navigation, or branding must read the [site-specific CMS integration contract](docs/cms-integration.md) and the repository-wide [agent instructions](AGENTS.md) first. Those documents identify exactly what the CMS controls, what remains hardcoded, and whether a change needs a CMS publish, a site deployment, or both.

## Production

- Website: <https://tuscanini-site.vercel.app>
- Admin: <https://kayco-sites-admin.vercel.app>
- Content API: <https://qkatfirzwukmgdrytbue.supabase.co/functions/v1/content-api>

The site loads published categories, products, recipes, pages, navigation, footer content, and global settings before React renders. If the content API is temporarily unavailable, the bundled catalog remains available as a fallback. Published changes are picked up on a new document load after the Content API cache refreshes; they do not require a Vercel rebuild.

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

## Deployment

The Vercel project is connected to the GitHub repository. Merges to `main` create the production deployment, while pull requests receive preview deployments.

The `/admin` route redirects editors to the shared Kayco Sites admin.
