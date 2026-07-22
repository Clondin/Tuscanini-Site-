# Tuscanini site agent instructions

These instructions apply to the entire repository.

## Read the CMS contract first

Before changing content, catalog data, images, navigation, branding, or a component that consumes those values, read [docs/cms-integration.md](docs/cms-integration.md). It is the authoritative map between this public website and the Kayco Sites CMS.

Keep that document accurate in the same change whenever a component starts or stops consuming a CMS type, slug, or field.

## Choose the correct source of truth

- Use the CMS for the published catalog, recipes, the `home` and `about` page fields currently mapped in code, desktop primary navigation, footer body and links, and global site settings.
- Use this repository for layout, styling, behavior, routes, and every section marked as hardcoded in the CMS integration document.
- Treat `src/data/products.ts` and `src/data/recipes.ts` as emergency fallback content, not the normal production editing path.
- Do not imply that a code deployment changes CMS content or that publishing CMS content changes a component that has not been built to consume it.
- Do not mutate production CMS content during a presentation-only code task unless the user also requested that content change.

## When the CMS contract changes

- Prefer additive, backward-compatible fields. A public component must tolerate missing or old values during rollout.
- For a new or changed field, update the Kayco Sites CMS editor/preview and API or SDK contract when needed, `src/data/cms.ts`, the consuming component, fallback behavior, tests, and this repository's CMS documentation.
- For a new content type, coordinate the database/schema, Content API allowlist, admin editor and preview, public-site loader, seed or migration data, tests, and documentation.
- For a rename or removal, support both versions until existing published content has migrated.
- For an editable image, upload through the CMS to the site's Supabase `site-media` area and save its public URL in content. Do not replace it with a hardcoded public-site asset.
- Preserve stable slugs and `source_id` values unless redirects and all cross-references are migrated.

## Completion checks

Before finishing a CMS-related site change:

1. Compare the implemented API calls and field mappings with `docs/cms-integration.md`.
2. Confirm whether the requested result requires a CMS publish, a public-site deployment, or both.
3. Verify missing and published content behavior where applicable.
4. Run `pnpm lint` and `pnpm build`.
5. Never expose a Supabase service-role or secret key in this Vite client, its environment files, logs, or documentation.
