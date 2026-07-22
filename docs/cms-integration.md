# Tuscanini CMS integration

This is the site-specific content contract for the Tuscanini public website. Read it before changing the catalog, content fields, images, navigation, branding, or the code that renders them. Update it in the same pull request whenever that contract changes.

Last verified against the implementation on July 21, 2026.

## Connection

| Setting | Value |
| --- | --- |
| CMS site name | Tuscanini |
| CMS site key | `tuscanini` |
| Production website | <https://tuscanini-site.vercel.app> |
| CMS admin | <https://kayco-sites-admin.vercel.app> |
| Content API base URL | `https://qkatfirzwukmgdrytbue.supabase.co/functions/v1/content-api` |
| Content API health | <https://qkatfirzwukmgdrytbue.supabase.co/functions/v1/content-api/health> |
| Public-site override | `VITE_KAYCO_CONTENT_API_URL` in `.env.local` or the Vercel project |
| CMS repository | <https://github.com/Clondin/Kayco-Sites-Backend> |

The public site needs only the browser-safe Content API URL. It does not need a Supabase key. Never put a Supabase secret or service-role key in a `VITE_` variable or the browser bundle.

## Runtime data flow

`src/main.tsx` waits for `initializeCmsContent()` in `src/data/cms.ts` before rendering React. On each new document load, the loader:

1. Requests every published `category`, `product`, `recipe`, `page`, `site_settings`, `navigation`, and `footer` entry through the public list endpoints.
2. Follows the API cursor until it has loaded all entries of each type.
3. Maps categories, products, and recipes into the data models used by the existing components.
4. Stores the other entries by `type:slug` for direct component lookups.
5. Applies the global document title, meta description, and primary-color CSS variable.
6. Renders the app only after loading finishes or the request fails.

The list route used for each type is:

```text
GET {VITE_KAYCO_CONTENT_API_URL}/sites/tuscanini/content/{type}?limit=100
```

Only published versions are public. Drafts and review versions never appear in this API.

### Fallback and replacement behavior

This behavior is important when editing or debugging the site:

- If any of the seven type requests fails, CMS initialization fails as a unit. The site logs a warning and uses the bundled catalog. Direct page, settings, navigation, and footer lookups then use their hardcoded component fallbacks.
- If the CMS returns one or more categories, the CMS category list replaces the entire bundled category catalog. It is not merged with the fallback categories.
- Products whose `category_slug` does not exactly match a published category slug are skipped from the visible catalog.
- If the CMS returns one or more recipes, those recipes replace the entire bundled recipe list. An empty recipe list leaves the bundled recipes in place.
- The fallback catalog lives in `src/data/products.ts` and related category files. Fallback recipes live in `src/data/recipes.ts`. They exist for resilience; editors should not use code changes as their normal content workflow.

## What the CMS controls

The API response has top-level `slug`, `title`, and `description` values plus the type-specific JSON object in `data`. The tables below name the exact fields consumed by this repository.

### Pages and global chrome

| Public component | CMS type and slug | Fields consumed | Missing-value behavior |
| --- | --- | --- | --- |
| Homepage hero | `page:home` | `data.headline`, `data.body`, `data.hero_image`, `data.cta_label`, `data.cta_url` | Uses bundled headline/body/CTA. A missing image restores the bundled hero video. |
| About hero | `page:about` | `data.headline`, `data.body` | Uses bundled headline and body. The background image and label remain hardcoded. |
| Navbar and document metadata | `site_settings:general` | `data.site_title`, `data.tagline`, `data.logo`, `data.primary_color` | Uses the Tuscanini wordmark/title and existing CSS color. |
| Footer branding | `site_settings:general` | `data.site_title`, `data.tagline`, `data.logo` | Uses the Tuscanini wordmark, title, and bundled tagline. |
| Desktop top navigation | `navigation:primary` | `data.links` | Uses the five bundled desktop links. Mobile page links remain hardcoded. |
| Footer introduction and links | `footer:main` | `data.body`, `data.links` | Uses the bundled introduction and hides the optional link list. |

`site_settings:general` has these effects:

- `site_title` sets `document.title` and the title shown in the navbar, footer, image alternative text, and copyright.
- `tagline` sets the document meta description and footer script line.
- `logo` replaces the bundled Tuscanini wordmark in both the navbar and footer.
- `primary_color` sets `--color-primary` only when it is a six-digit hex value such as `#1F5A44`.

Navigation and footer `links` accept an array of strings or newline-separated text. Each line must use this exact format:

```text
Label|/internal-path
```

The current components render these with React Router links, so use internal paths such as `/about` or `/category/beverages`. Changing mobile page links or the mega-menu grouping still requires code.

### Categories

All published category entries are sorted by `data.display_order`, ascending.

| CMS value | Public model/use |
| --- | --- |
| top-level `slug` | Category URL: `/category/{slug}` and the value products must use in `category_slug` |
| top-level `title` | Category name in menus, search, breadcrumbs, and headings |
| top-level `description` | Fallback description when `data.body` is missing |
| `data.source_id` | Internal category ID; falls back to the slug |
| `data.tagline` | Category hero and search result tagline |
| `data.body` | Category description section |
| `data.hero_image` | Category hero and search thumbnail |
| `data.display_order` | Catalog order, mega-menu order, related categories, and the first eight footer categories |

Use a non-empty hero image for every category. The category page assumes it can render that URL.

New categories default into the desktop mega-menu's **The Pantry** group. The Meals, Snacks & Sweets, and Foodservice assignments are still determined by hardcoded IDs in `src/data/categories-*.ts`. Changing those groups or adding a category to a homepage collection requires code.

### Products

All published products are sorted by `data.display_order`, ascending, before being attached to their categories.

| CMS value | Public model/use |
| --- | --- |
| top-level `slug` | Fallback product ID and therefore fallback product URL |
| top-level `title` | Product name in cards, search, quick view, breadcrumbs, and detail pages |
| top-level `description` | Card, search, quick-view, and detail summary |
| `data.source_id` | Preferred product ID and URL: `/product/{source_id}`; falls back to the slug |
| `data.category_slug` | Required parent category slug; products with no matching category are not shown |
| `data.image` | Product cards, search, pairings, quick view, detail image, and lightbox |
| `data.body` | Long product story/details; falls back to the top-level description |
| `data.ingredients` | Quick-view ingredients; an array is joined with commas and a string is used as-is |
| `data.size` | Product size/package information |
| `data.kosher` | Shows the Kosher badge only when the JSON value is boolean `true` |
| `data.made_in_italy` | Shows the Made in Italy badge only when the JSON value is boolean `true` |
| `data.display_order` | Order within the parent category |

Stable product IDs matter. Recipe `related_products`, homepage featured quick views, and internal links refer to product IDs. If `source_id` or a slug changes, migrate every reference and add a redirect before removing the old URL.

### Recipes

Recipes are not standalone routes. They appear on product detail pages when `data.related_products` contains that product's ID. The same references also create the **Pairs Well With** product list.

| CMS value | Public model/use |
| --- | --- |
| top-level `slug` | Fallback recipe ID |
| top-level `title` | Recipe card name |
| top-level `description` | Fallback description when `data.body` is missing |
| `data.source_id` | Preferred internal recipe ID |
| `data.body` | Recipe card description |
| `data.ingredients` | Ingredient list; accepts a string array or newline-separated text |
| `data.related_products` | Product IDs; accepts a string array or newline-separated text |
| `data.prep_time` | Preparation-time label |
| `data.cook_time` | Cooking-time label; exactly `0 min` hides the cook-time label |
| `data.servings` | Numeric serving count; invalid/missing values become `1` |
| `data.hero_image` | Mapped into the recipe model but not rendered by the current recipe card |
| `data.display_order` | Recipe-card order |

`instructions` is not consumed by the current public site. Publishing it in the CMS alone will not display recipe directions.

## What is still hardcoded

Do not tell an editor these areas are CMS-managed without first changing the code and content contract:

- The homepage sections below the hero: marquee, heritage story, collections heading/cards, featured-products presentation, trust badges, and newsletter copy.
- The homepage collections in `src/components/home/CollectionsGrid.tsx`. Their names, images, taglines, and first-nine selection are separate from CMS categories.
- The homepage featured cards in `src/components/home/FeaturedProducts.tsx`. Their copy and images are hardcoded; only Quick View resolves the matching product ID from the loaded catalog.
- The Italian eyebrow and tagline inside the homepage hero.
- The About page background image and all sections below its hero.
- Mobile page links, mega-menu group membership, mega-menu promotional art, and category accent/color rules.
- Footer social URLs, `TuscaniniFoods.com`, the Made in Italy label, headings, and copyright suffix.
- Routes themselves. Publishing a new `page` entry does not create a URL or component automatically.
- Layout, styling, animations, accessibility behavior, and responsive rules.

Changing a hardcoded area requires a public-site code deployment. To make it editable, implement a CMS field or entry, add editor and preview support in the CMS when needed, map it in this repository, add a safe fallback, publish content, and update this document.

## Editor workflow

For an existing CMS-managed value:

1. Open <https://kayco-sites-admin.vercel.app> and sign in with a Kayco CMS account.
2. Select the **Tuscanini** site. Confirm the site before editing; the CMS is multi-site.
3. Open **Content**, choose the content type, and open the entry identified in the tables above.
4. Edit the wording, ordering, references, or image. Use the live unsaved preview to check the draft.
5. Save the draft. If required by the team, mark it for review.
6. Publish the correct draft version. Saving alone does not affect the public website.
7. Check **Publishing** for the publish event and any webhook result.
8. Reload the public website after allowing for the delivery cache described below, then verify desktop and mobile behavior.

Published versions are immutable. Editing a live entry creates a new draft; the public site continues to receive the previous published version until the new draft is published.

### Images

- Upload at the image field with **Upload & use**, or choose an existing Tuscanini asset from **Media**.
- Add useful alternative text when uploading. The file is stored in the site's area of the public Supabase `site-media` bucket, and its public URL is saved in the CMS field.
- After uploading, save the draft and publish it. Uploading a file makes it available in Media but does not publish the content change by itself.
- Reuse the CMS asset URL for editable images. Do not download the file into `public/assets` unless it is intentionally becoming a code-managed fallback asset.
- Test the crop on the actual component. Product images generally use `object-contain`; category and page heroes use cover-style presentation and need suitable aspect ratios and safe focal areas.

## Publishing, caching, and deployments

A content-only publish does not require a GitHub commit or Vercel rebuild. A new document load requests CMS data before React renders; the running page does not poll or update itself after a publish.

The Content API currently sends list/item cache headers with a 30-second browser maximum age, a 300-second shared-cache maximum age, and stale-while-revalidate behavior. Therefore a normal reload can briefly show the previous published version. There is no public-site webhook, rebuild hook, or client-side cache invalidation implemented in this repository.

When verifying a publish:

1. Confirm the publish event succeeded in the CMS.
2. Request the exact item endpoint, for example `/sites/tuscanini/content/page/home`. Add a unique query such as `?verify=<timestamp>` when you need to bypass a cached URL during diagnosis.
3. Confirm the response contains the expected published fields.
4. Open a new page load after the cache has refreshed. A tab that was already open will not update automatically.

Presentation or component changes do require a public-site deployment. The Vercel project is connected to this GitHub repository: merges to `main` deploy production and pull requests receive previews.

## Common content operations

### Add a category

1. Create a `category` entry with a stable slug and usually set `source_id` to the same stable value.
2. Add its title, tagline, body, hero image, and display order.
3. Publish it before publishing products that reference it.
4. If it belongs outside The Pantry, update the hardcoded group data in this repository and deploy the site.
5. If it should appear in the homepage collections, update `CollectionsGrid.tsx`; CMS publication alone will not add it there.

### Add a product

1. Create a `product` entry with a stable slug/`source_id`.
2. Set `category_slug` to an exact published category slug.
3. Fill the display fields and upload/select its image.
4. Publish and verify the category page, search, quick view, and product detail route.
5. Add its ID to recipe `related_products` where appropriate. Homepage featuring still requires a code change.

### Change wording or an image

First find the component in the content map or hardcoded list above. If mapped, edit that exact CMS entry and field, save, and publish. If hardcoded, change the component and deploy the public site; do not create an unused CMS value and assume it will render.

### Add a page or editable section

A CMS entry alone cannot create a route. Add a route/component, define the type/slug/fields it reads, make missing content safe, add any required CMS editor and preview fields, publish the content, and document the new mapping here.

## Code-change playbook

| Public-site change | CMS work | Required handling |
| --- | --- | --- |
| Styling, layout, animation, or behavior only | None if the contract is unchanged | Deploy the site and verify existing published and fallback content. |
| New intentionally hardcoded section | None | Document it in the hardcoded list and deploy the site. |
| New CMS field on an existing type | Usually | Add CMS editor/preview support when needed, update `src/data/cms.ts` and the component, accept missing values, update tests/docs, then publish it. Existing JSON content normally needs no database migration. |
| New CMS-managed section | Yes | Define its type/slug/fields, build the editor/preview and public consumer, add fallback/empty behavior, create content, publish, and verify. |
| New content type | Yes | Update the CMS database/schema or enum, Content API allowlist, SDK/types, admin list/editor/preview, this loader and consumer, seed/migration data, tests, and docs. |
| Rename or remove a field | Yes | Use a two-phase rollout: read old and new fields, migrate/publish content, then remove old support later. |
| New editable image | Yes | Add an image field, upload through the CMS, render its public URL with a safe fallback, and publish. |
| Change a slug or `source_id` | Yes, high risk | Preserve the old URL or redirect it, migrate category/product/recipe references and hardcoded references, then publish and deploy in a backward-compatible order. |

### Safe deployment order

For a contract change, use an additive rollout:

1. Make the public consumer tolerate missing values and, for a rename, both old and new fields.
2. Add and test required CMS editor, preview, API, SDK, or schema support.
3. Deploy CMS/backend support when it changed.
4. Deploy the public site while it is still compatible with existing published content.
5. Create or update the CMS draft and publish it.
6. Verify the uncached API response and the rendered site.
7. Remove temporary fallbacks or old-field support only after every published entry has migrated.

For a presentation-only change, deploy only this repository. For content-only changes to fields already mapped here, publish only in the CMS.

## Agent verification checklist

Before completing CMS-related work:

- Confirm the selected CMS site key is `tuscanini`.
- Compare every API type, slug, and field touched by the change with `src/data/cms.ts` and the consuming component.
- State clearly whether production needs a CMS publish, a public-site deployment, or both.
- Test missing/empty values and the bundled fallback where the contract changed.
- Check a published item response from the Content API; do not use a draft preview as proof of public delivery.
- Verify cross-references: product `category_slug`, recipe `related_products`, hardcoded featured IDs, and changed URLs.
- Run the public-site checks:

```bash
pnpm lint
pnpm build
```

- If the CMS editor, preview, API, schema, or SDK changed, also run the Kayco Sites CMS repository's `pnpm check` and follow its deployment instructions.
- Confirm no secret was added to source, documentation, a `VITE_` variable, or browser output.
- Update this document in the same change when the implemented contract changes.

## Troubleshooting

| Symptom | First checks |
| --- | --- |
| A saved edit is not live | Confirm the draft was published, not only saved, and inspect the Publishing event. |
| API is correct but the page is old | Use a fresh document load and allow for the Content API cache; an open tab does not refetch. |
| All CMS content appears to be ignored | Check the browser warning and all seven list endpoints. One failed type request makes initialization fall back as a unit. |
| A product is missing | Confirm it is published and `category_slug` exactly matches a published category slug. |
| A product URL or recipe pairing broke | Check `source_id`, slug, and every `related_products` or hardcoded featured reference. |
| A homepage card did not change | Confirm whether it is in hardcoded `CollectionsGrid.tsx` or `FeaturedProducts.tsx`, not the CMS-driven catalog. |
| A new page entry has no URL | Add a React route and a component that reads that type/slug. |
| An uploaded image is not used | Select the asset in the field, save the draft, publish it, and confirm the API returns the public URL. |
| The whole catalog unexpectedly shrank | The published CMS category/product lists replace the bundled catalog; confirm all intended entries are published. |
