# Tuscanini CMS integration

This is the site-specific content contract for the Tuscanini public website. Read it before changing the catalog, content fields, images, navigation, branding, or the code that renders them. Update it in the same pull request whenever that contract changes.

Last verified against the implementation on September 16, 2026.

## Product API precedence

The requested Kayco product API integration now supplies reviewed product names, images, package sizes, origin, and active retail additions. The CMS remains the editorial source for descriptions, details, ingredients, certification, category copy, recipes, pages, and global content. Read [the complete product API contract](kayco-product-api.md) for exact endpoints, filtering, secret handling, fallback behavior, caching, and deployment.

The public endpoint is `/api/catalog`; its private key is the server-only `KAYCO_API_KEY`. The reviewed SKU map and outage snapshot are in `src/data/kayco-catalog.generated.ts`. New products require an image. Existing IDs and recipe references remain stable. For mapped products, editing a CMS title, image, size, or origin does not override the API-owned values.

This integration needs a public-site deployment and server-side key configuration for live refresh, with no CMS publish required. The configured CMS hostname failed to resolve from the development machine during this work; bundled editorial fallback behavior was verified.

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

`src/main.tsx` immediately renders bundled editorial content merged with the reviewed Kayco snapshot. `initializeCmsContent()` in `src/data/cms.ts` loads CMS content and `/api/catalog` concurrently. On each new document load, the loader:

1. Requests every published `category`, `product`, `recipe`, `page`, `site_settings`, `navigation`, and `footer` entry through the public list endpoints.
2. Follows the API cursor until it has loaded all entries of each type.
3. Maps categories, products, and recipes into the data models used by the existing components.
4. Stores the other entries by `type:slug` for direct component lookups.
5. Applies the primary-color CSS variable. `RouteMetadata.tsx` combines CMS settings and route content into route-specific title, description, canonical, social, robots, and structured metadata.
6. Merges the public Kayco catalog (or reviewed snapshot) over the editorial catalog according to the precedence above.
7. Re-renders once after the independent requests settle, using every successful collection and retaining the bundled fallback for unavailable collection groups.

The list route used for each type is:

```text
GET {VITE_KAYCO_CONTENT_API_URL}/sites/tuscanini/content/{type}?limit=100
```

Only published versions are public. Drafts and review versions never appear in this API.

### Fallback and replacement behavior

This behavior is important when editing or debugging the site:

- The seven type requests settle independently. A failed page, settings, navigation, footer, or recipe request keeps only that type's hardcoded fallback while successful types still load.
- CMS categories and products are a coordinated editorial pair. If either request fails—or the mapped catalog has no products—the bundled editorial catalog is used before applying the Kayco product merge.
- A valid CMS catalog replaces the bundled editorial base; reviewed Kayco additions and their new categories are then merged into that base.
- Products whose `category_slug` does not exactly match a published category slug are skipped from the visible catalog.
- If the CMS returns one or more recipes, those recipes replace the entire bundled recipe list. An empty recipe list leaves the bundled recipes in place.
- The fallback catalog lives in `src/data/products.ts` and related category files. Fallback recipes live in `src/data/recipes.ts`. They exist for resilience; editors should not use code changes as their normal content workflow.

## What the CMS controls

The API response has top-level `slug`, `title`, and `description` values plus the type-specific JSON object in `data`. The tables below name the exact fields consumed by this repository.

### Pages and global chrome

| Public component | CMS type and slug | Fields consumed | Missing-value behavior |
| --- | --- | --- | --- |
| Homepage hero | `page:home` | `data.headline`, `data.body`, `data.hero_image`, `data.cta_label`, `data.cta_url` | Uses bundled headline/body/CTA. A missing image uses the bundled optimized poster; the bundled film loads only after a desktop visitor presses Play. |
| About hero | `page:about` | `data.headline`, `data.body` | Uses bundled headline and body. The background image and label remain hardcoded. |
| Navbar and document metadata | `site_settings:general` | `data.site_title`, `data.tagline`, `data.logo`, `data.primary_color` | Uses the Tuscanini wordmark/title and existing CSS color. |
| Footer branding | `site_settings:general` | `data.site_title`, `data.tagline`, `data.logo` | Uses the Tuscanini wordmark, title, and bundled tagline. |
| Desktop top navigation | `navigation:primary` | `data.links` | Uses bundled desktop links. Mobile page links and shared collection groups remain code-managed. |
| Footer introduction and links | `footer:main` | `data.body`, `data.links` | Uses the bundled introduction and hides the optional link list. |

`site_settings:general` has these effects:

- `site_title` supplies the route-title brand suffix and the title shown in the navbar, footer, image alternative text, and copyright.
- `tagline` supplies the default route description and footer script line. Route-specific category, product, home, and about descriptions take precedence where available.
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
| `data.hero_image` | Category metadata and editorial image fallback |
| `data.display_order` | Catalog order, mega-menu order, related categories, and the first eight footer categories |

Collection cards use a product image from the merged catalog. The category hero image remains available for metadata; it is no longer required to render the category grid.

Desktop and mobile navigation share `src/data/collection-groups.ts`: Pasta & Sauces, Pantry, Snacks & Sweets, Drinks, and Frozen. Unknown CMS categories default to Pantry. Homepage featured collection selection remains code-managed; every image-bearing collection appears at `/products?view=collections`.

### Products

This table describes the CMS editorial input. For API-mapped products, name, image, package size, and origin follow the Kayco precedence above. CMS edits to those fields alone do not change their displayed API-owned values.

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
| `data.ingredients` | Product-detail Ingredients disclosure and quick view; an array is joined with commas and a string is used as-is |
| `data.size` | Product size/package information |
| `data.storage` | Product-detail preparation/storage disclosure; omitted when absent |
| `data.prep` | Preparation entries, array or newline-separated text; `method \| instructions` displays as a labeled step |
| `data.nfp_image` | Nutrition label image inside the Nutrition facts disclosure |
| `data.nutrition_serving`, `data.nutrition_calories` | Serving size and calories; missing values stay hidden and numeric zero is preserved |
| `data.nutrition_facts` | Nutrition rows, array or newline-separated text; `label \| value` displays as a labeled row |
| `data.kosher` | Shows the Kosher badge only when the JSON value is boolean `true` |
| `data.made_in_italy` | Shows the Made in Italy badge only when the JSON value is boolean `true` |
| `data.display_order` | Order within the parent category |

Stable product IDs matter. Recipe `related_products`, homepage featured quick views, and internal links refer to product IDs. If `source_id` or a slug changes, migrate every reference and add a redirect before removing the old URL.

### Recipes

Recipes are not standalone routes. They appear on product detail pages when `data.related_products` contains that product's ID. The same references also create the **Pairs Well With** product list.

| CMS value | Public model/use |
| --- | --- |
| top-level `slug` | Fallback recipe ID |
| top-level `title` | Recipe or serving-idea title |
| top-level `description` | Fallback description when `data.body` is missing |
| `data.source_id` | Preferred internal recipe ID |
| `data.body` | Recipe or serving-idea introduction |
| `data.ingredients` | Ingredient list; accepts a string array or newline-separated text |
| `data.related_products` | Product IDs; accepts a string array or newline-separated text |
| `data.prep_time` | Preparation-time label |
| `data.cook_time` | Cooking-time label; exactly `0 min` hides the cook-time label |
| `data.servings` | Positive numeric serving count; invalid/missing values remain absent |
| `data.hero_image` | Rendered as the recipe/serving-idea image when supplied |
| `data.display_order` | Recipe-card order |

`data.instructions` now supplies recipe directions (string array or newline-separated text). An entry with nonempty ingredients and instructions renders as a **Recipe**, with all ingredients and the method available in a native disclosure. An older entry without directions renders as a **Serving idea**, with the complete ingredient list and no invented method or cooking-time claim. Empty direction entries are ignored.

The existing CMS recipe editor, preview, and publish validation already support `instructions`; the product editor already supports preparation, storage, and nutrition fields. No backend/schema/editor change is needed for these additive consumers. Publish verified values through those existing editors. Missing fields remain hidden.

Only recipe-linked products form **Bring these together** recommendations. Products without recipes do not get arbitrary same-category "pairings"; siblings appear once under **More in this collection**.

## What is still hardcoded

Do not tell an editor these areas are CMS-managed without first changing the code and content contract:

- The homepage sections below the hero: marquee, heritage story, collections heading/cards, featured-products presentation, trust badges, and newsletter copy.
- Homepage collections feature six code-selected categories. Names, counts, and representative product images come from the merged catalog. All collections use the same card layout on `/products?view=collections`.
- The homepage hero shows three code-selected products using merged names, images, and links. The separate FeaturedProducts section is no longer mounted.
- The Italian eyebrow, product selection, and secondary story link inside the homepage hero.
- The About page background image and all sections below its hero.
- Mobile page links, shared menu group membership, and category accent/color rules. The former mega-menu promotional image is no longer rendered.
- Footer social URLs, `TuscaniniFoods.com`, the Made in Italy label, headings, and copyright suffix.
- Routes themselves. Publishing a new `page` entry does not create a URL or component automatically.
- Layout, styling, animations, accessibility behavior, and responsive rules.

Changing a hardcoded area requires a public-site code deployment. To make it editable, implement a CMS field or entry, add editor and preview support in the CMS when needed, map it in this repository, add a safe fallback, publish content, and update this document.


## Catalog browsing and UI behavior

- `/products` is the all-products route, included in build HTML and the sitemap. `?view=collections` displays all image-bearing collections. Search/filter URLs canonicalize to `/products` and use `noindex, follow`.
- Category pages default to a product grid, with optional `?view=shelf`. Shelf items link directly to products; arrows and native horizontal scrolling replace the former selection panel and drag instruction.
- Search and filters use URL state (`q`, `category`, `format`, `diet`, `sort`, `view`). Search normalizes accents and punctuation, accepts common shorthand, includes size/SKU and frozen attributes, and marks approximate spelling matches. The overlay previews six products and links to all results.
- Frozen classification uses the API flag or established frozen category. The Gluten-free filter matches explicit gluten-free product names, not missing certification fields. `kosher` is displayed only for confirmed product values; no partial category certification fraction is rendered.
- Products without images do not render in the new browsing cards or search. The upstream image-required addition rule remains unchanged.
- Product pages show only the current product image in the main image area. Siblings are clearly labeled separate product cards. Mobile pages put the title and size before the image and show a sticky retailer action after the main action scrolls away.
- The current retailer destinations are general stores: **Visit Amazon store** for non-frozen items, **Visit Tuscanini** for frozen items. They are not represented as exact listings or a store locator. Exact retailer listings still require verified data and a coordinated CMS field if added later.
- `VITE_NEWSLETTER_ENDPOINT`, when configured, enables the existing labeled signup and success/error handling. Without it, the section links directly to Instagram; it no longer advertises an unavailable signup.
- Section hash navigation waits for lazy-rendered destinations and respects the fixed header offset.

This UI change requires a public-site deployment. Existing published editorial fields appear when the CMS is reachable; creating or correcting editorial content requires a separate CMS publish. No production CMS content was changed during implementation.

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

A content-only publish does not require a GitHub commit or Vercel rebuild. A new document load renders bundled fallback content immediately, requests CMS data, and refreshes the React tree when those requests settle; the running page does not poll or update itself after that initial load.

The production build generates `public/sitemap.xml` plus clean-URL HTML entry files from one merged CMS/Kayco catalog, with bundled editorial content and the reviewed Kayco snapshot as an offline fallback. Those entry files carry route-specific canonical, social, and structured metadata. Vercel serves only generated slugs and lets an unmatched direct request fall through to `404.html` with HTTP 404 instead of rewriting every URL to the SPA shell.

Visible content still refreshes from the public Content API on each new document load, so editing an existing field does not require a deploy for the React interface. A rebuild is required when adding, removing, or changing a public slug so the route file and sitemap stay current. A rebuild is also required when static/social metadata must immediately reflect a changed title, description, category relationship, or image; without it, JavaScript updates browser metadata after loading, but non-JavaScript link-preview crawlers can see the previous build's values.

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
pnpm check
```

- If the CMS editor, preview, API, schema, or SDK changed, also run the Kayco Sites CMS repository's `pnpm check` and follow its deployment instructions.
- Confirm no secret was added to source, documentation, a `VITE_` variable, or browser output.
- Update this document in the same change when the implemented contract changes.

## Troubleshooting

| Symptom | First checks |
| --- | --- |
| A saved edit is not live | Confirm the draft was published, not only saved, and inspect the Publishing event. |
| API is correct but the page is old | Use a fresh document load and allow for the Content API cache; an open tab does not refetch. |
| Some CMS content appears to be ignored | Check the browser warning for that content type and its list endpoint. Category and product failures intentionally keep the catalog fallback as a coordinated pair. |
| A product is missing | Confirm it is published and `category_slug` exactly matches a published category slug. |
| A product URL or recipe pairing broke | Check `source_id`, slug, and every `related_products` or hardcoded featured reference. |
| A homepage card did not change | Selection and taglines remain code-managed; names and product images follow the merged catalog. |
| A new page entry has no URL | Add a React route and a component that reads that type/slug. |
| An uploaded image is not used | Select the asset in the field, save the draft, publish it, and confirm the API returns the public URL. |
| The whole catalog unexpectedly shrank | The published CMS category/product lists replace the bundled catalog; confirm all intended entries are published. |
