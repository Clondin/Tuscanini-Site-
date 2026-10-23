import { productGalleries } from './product-galleries.generated.js';
import { brandPhotos } from './brand-photos.generated.js';

export interface ProductGalleryImage {
  src: string;
  thumbnail: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}

/** Real Tuscanini photography for a SKU, from the brand's own photo library (exact SKU matches only). */
function getBrandPhotos(sku: string): ProductGalleryImage[] {
  const prefix = `/assets/products/brand/${sku}/`;
  return (brandPhotos[sku] ?? []).filter(image => image.src.startsWith(prefix) && image.thumbnail.startsWith(prefix));
}

/**
 * Publish a SKU's commissioned photography only as a complete, reviewed set; the brand's
 * real product photos follow the lead image so the card image stays the same.
 */
export function getProductGallery(sku: string): ProductGalleryImage[] | undefined {
  if (!/^\d{6}$/.test(sku)) return undefined;
  const images = productGalleries[sku];
  const prefix = `/assets/products/generated/${sku}/`;
  const commissioned = images?.length === 4 && images.every(image => image.src.startsWith(prefix) && image.thumbnail.startsWith(prefix))
    ? images : undefined;
  const real = getBrandPhotos(sku);
  if (!commissioned) return real.length ? real : undefined;
  return real.length ? [commissioned[0], ...real, ...commissioned.slice(1)] : commissioned;
}
