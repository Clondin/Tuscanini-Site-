# Catalog photo and flour corrections

Verified October 5, 2026. These changes affect the repository's emergency catalog and code-managed images. They do not publish or replace CMS images.

## Minced black truffle

The previous minced-truffle entry incorrectly used the sliced-truffle photo, `Truffles/730585.png`. Kayco's [Minced Black Truffle product page](https://www.kayco.com/product/tuscanini-minced-black-truffle/) identifies item **730586**, UPC **710069325869**, and size **2.82 oz**. Its [official package image](https://www.kayco.com/wp-content/uploads/2023/05/730586-3.png) visibly reads “Minced Black Truffle” and “2.82 oz / 80 g.”

The original source is 12,623,389 bytes. The bundled, uncropped derivative is `public/assets/Truffles/730586.webp`: 1280 × 1338 pixels, 175,784 bytes, with transparency preserved. It supplies the fallback entry's distinct photo. The [Sliced Black Truffle page](https://www.kayco.com/product/tuscanini-sliced-black-truffle/) identifies item 730585, UPC 710069325852, and size 1.41 oz; its existing photo is correct.

The hidden Large Minced Black Truffle entry's `730589.png` is corrupt: both the repository file and live HTTP response contain 18,893,246 zero bytes. It is no longer referenced as a photo. A verified large-format replacement is still needed before that entry can show a product image; its existing hidden status is preserved.

## Flour aliases

Both supplied photos in each pair visibly print the same product and net weight. Kayco lists one retail SKU for each blend, and [Tuscanini's flour page](https://www.tuscaninifoods.com/copy-of-truffle) presents those same three blends and current package fronts.

| Product | Verified net weight on both photos | Kayco SKU / UPC | Retained URL | Former URL |
| --- | --- | --- | --- | --- |
| [All Purpose Flour](https://www.kayco.com/product/flour-all-purpose-2-2lb-tuscanini/) | 1 kg / 2.2 lb | 730306 / 710069303065 | `/product/all-purpose-flour-2-2lb` | `/product/all-purpose-flour-1kg` |
| [High Gluten Flour](https://www.kayco.com/product/flour-high-gluten-5lb-tuscanini/) | 2.27 kg / 5 lb | 730307 / 710069303072 | `/product/high-gluten-flour-5lb` | `/product/high-gluten-flour-2-27kg` |
| [Spelt White Flour](https://www.kayco.com/product/flour-spelt-white-5lb-tuscanini/) | 2.27 kg / 5 lb | 730308 / 710069303089 | `/product/spelt-white-flour-5lb` | `/product/spelt-white-flour-2-27kg` |

The fallback catalog now contains three flour entries rather than six. Former URLs resolve to the retained entries, and permanent redirects preserve existing links. `canonicalProductId` also supports CMS/build loaders migrating old references. Flour descriptions follow the official page and package copy instead of describing the same weight as a separate “larger format.”

## Frozen fries

The four files formerly suggested by the fallback tuples are different products:

| Existing file in `Frozen/Mozzarella Sticks` | Visible package |
| --- | --- |
| `730140.png` | Mozzarella Sticks, 7 oz |
| `730141.png` | Mozzarella Sticks, 15 oz |
| `730142.png` | Breaded Eggplant Cutlets, 10 oz |
| `730143.png` | Breaded Eggplant Sticks, 10 oz |

These files must not be shown as fries. Searches of Kayco's public catalog and the available Tuscanini pages did not establish matching Gondola, Crinkle Cut, Shoestring, or Straight Cut Fries packages. Their correct SKU-confirmed photographs remain a product-team input. The website now renders a visible “Product image unavailable” state and omits unavailable gallery thumbnails. Breaded Eggplant Cutlets already has a correct package photograph; its directory and filename do not identify a different product.

## Responsive delivery

Run `pnpm exec tsx scripts/optimize-images.ts` after adding or changing a code-managed photograph. The script reads local image references in production TypeScript sources, preserves aspect ratio and transparency, and writes content-hashed WebP widths plus `src/data/optimized-images.ts`. Components use `getResponsiveImageProps` to let the browser choose a size suited to the rendered area; static social metadata uses `getOptimizedImageUrl`.

Original photos remain available for regeneration and recovery if a derivative fails. The script never fetches or rewrites an external CMS URL. An editable CMS image still requires an upload and CMS publication through the documented editor workflow.

After the catalog corrections, its 136 distinct non-placeholder photo URLs total 65.81 MB in original files. The largest responsive variants total 18.58 MB; the 640 px candidates total 9.87 MB, and the 320 px candidates total 4.12 MB. No active product's largest variant exceeds its source's size. These are totals across the catalog, not a single page load.

Across all 222 valid code-managed image references, including editorial and hidden catalog photos, source files total 107.70 MB versus 31.98 MB for the largest variants. There are 838 responsive candidates in 836 physical WebP files because identical sources share outputs. Every output was decoded to verify its format, actual width, and preserved source transparency. Original repository files are retained; the reduction applies to browser delivery.

For the 136 distinct available images in the active fallback catalog, the original files total 65,807,934 bytes. Their largest variants total 18,578,794 bytes (72% less), 640px variants total 9,865,050 bytes (85% less), and 320px variants total 4,122,744 bytes (94% less). No largest active variant is bigger than its original; the largest active variant is 442,420 bytes. The manifest also covers valid hidden and decorative images: 222 source URLs total 107,703,799 original bytes and 31,978,096 bytes at their largest generated sizes. These are image delivery comparisons, not a reduction of the repository's original source files.

The homepage's silent 30-second film is now `Trailer/Tuscanini_Trailer_Web.mp4`: H.264, 1280 × 538, with fast-start metadata, 4,691,131 bytes instead of 32,296,412 bytes (85% less). The original film is retained, and no film request occurs before the visitor presses Play on desktop. The derivative was generated with `ffmpeg -i public/assets/Trailer/Tuscanini_Trailer_Screens_Final.mp4 -vf 'scale=1280:-2' -c:v libx264 -preset medium -crf 25 -threads 2 -an -movflags +faststart public/assets/Trailer/Tuscanini_Trailer_Web.mp4`.
