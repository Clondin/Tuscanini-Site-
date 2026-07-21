# Tuscanini Site

Tuscanini's public React site, backed by the Kayco Sites CMS.

## Production

- Website: <https://tuscanini-site.vercel.app>
- Admin: <https://kayco-sites-admin.vercel.app>
- Content API: <https://qkatfirzwukmgdrytbue.supabase.co/functions/v1/content-api>

The site loads published categories, products, recipes, pages, navigation, footer content, and global settings before React renders. If the content API is temporarily unavailable, the bundled catalog remains available as a fallback.

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
