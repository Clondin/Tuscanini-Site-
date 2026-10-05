# Tuscanini site audit follow-up

Implemented against the live site's source commit `3f04e78a8abad791c9bdc6030eeda5f3fd5c0e04`. The attached audit dated October 5, 2026 supplied the findings below.

| Audit finding | Result |
| --- | --- |
| 1. Hidden products and collections return 404 | These are deliberate catalog exclusions. Existing release decisions are preserved pending the owner's publication choice. Published/fallback route generation and sitemap selection now agree. |
| 2. Missing fries photos and placeholder tiles | Four fries products render a clear unavailable-photo state and have no fake zoom or empty sibling thumbnails. Exact fries pack photographs still need to be supplied. The eggplant-cutlet image was verified as the correct package. |
| 3. Footer promises unavailable features | With no newsletter endpoint, the section offers the existing Instagram link and current brand updates. |
| 4. Universal bottled-origin wording | Product origin now says “Made in Italy” only when the existing SKU flag is true. No origin facts were invented or overwritten. |
| 5. Buying buttons open shared destinations | Shared links identify the Amazon brand store or Tuscanini Foods site. Three officially verified flour links open their actual Amazon products. |
| 6. Product story grammar | The shared story uses a sentence that works with both singular and plural product names. |
| 7. Minced and sliced truffles share a photograph | Minced Black Truffle uses its verified 730586 package photograph. |
| 8. Duplicate flour sizes | Verified all-purpose, high-gluten, and spelt duplicate pairs are each consolidated into one SKU. Former URLs redirect permanently; browser/CMS/build references resolve to the same canonical IDs. |
| 9. Heavy image and film transfers | Local photos have responsive, content-hashed WebP variants. The click-to-play film is 4,691,131 bytes, down from 32,296,412 bytes. Original photo files remain for regeneration and recovery. |
| 10. Inconsistent size labels | Display-only formatting standardizes unit spacing/case across cards, shelves, quick views, and detail pages without changing amounts. |
| 11. Long tuna page titles | Browser and static/social metadata share compact titles while retaining full product names in visible content. |
| 12. Empty content-image alt text | Product shelf/card and sibling images have descriptive alternatives; existing named controls remain intact. Decorative backgrounds stay decorative. |
| 13. “All 20 collections” only shows nine | The button expands the active catalog from nine featured collections to all available collections, with correct count and accessibility state. |

Browser verification also found missing self-hosted fonts, product-panel clipping at 320px, and dialog focus moving after the background was hidden. Seven licensed font files are now tracked, mobile grid constraints are corrected, and dialogs move focus before hiding the background. Required lint checks exposed an existing map-tooltip ref read and missing Node globals for the geography script; both are corrected.

Asset validation found that the hidden Large Minced Black Truffle file `Truffles/730589.png` is corrupt (18,893,246 zero bytes), even though its URL responds successfully. That still-hidden product now uses the unavailable-photo state and needs a verified replacement before release.

## Content source and remaining inputs

The connected Kayco Sites Supabase project reported `INACTIVE` during this work. Production was using bundled fallback content. This change updates that fallback and presentation code; it does not resume the backend or publish CMS entries. External CMS image URLs remain authoritative. The updated [CMS contract](cms-integration.md) documents alias normalization, collection cards, metadata, and fallback behavior.

Two owner inputs remain: whether to release the intentionally hidden catalog, and where to obtain approved photos for Gondola, Crinkle Cut, Shoestring, and Straight Cut Fries. SKU-specific Italy-origin flags continue to use their existing values and need product-team confirmation if those values are uncertain.

Package/UPC evidence, verified flour destinations, and image regeneration instructions are in [catalog-image-sources.md](catalog-image-sources.md). Font provenance and licenses are in [the font directory](../public/assets/fonts/README.md).

## Verification

- `pnpm check` passes: lint, TypeScript, 42 tests, and the production build/postbuild.
- The built artifact has 162 clean-URL pages: home, About, 20 collections, and 140 products. All 162 have distinct titles (maximum 58 characters), correct canonical paths, and valid structured data. All 152 local bundle/social/preload asset references exist. The three flour redirects point to generated canonical pages. All 41 audit-listed unreleased routes remain excluded.
- Every generated WebP file decodes, declared variant widths match, and source transparency is preserved.
- Browser flows pass at 320px, 390px, and 1440px: collection expansion, menu/search navigation, shelf selection, sibling/product links, lightbox keyboard/focus behavior, alias canonicals, truthful buying labels, missing-photo states, restored fonts, and click-only film playback. The About map also passes tooltip containment while resizing from 1440px to 900px, selection/reset, zoom, and keyboard controls.
- No JavaScript page exceptions were observed. The seven existing CMS fallback warnings remain expected while the backend is inactive. Newsletter submission was exercised only with a mocked endpoint in tests; no live signup or purchase was submitted.
