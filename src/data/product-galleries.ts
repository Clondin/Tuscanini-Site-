import { productGalleries } from './product-galleries.generated.js';

export interface ProductGalleryImage {
  src: string;
  thumbnail: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}

/** Publish a SKU's commissioned photography only as a complete, reviewed set. */
export function getProductGallery(sku: string): ProductGalleryImage[] | undefined {
  const images = productGalleries[sku];
  if (!/^\d{6}$/.test(sku) || images?.length !== 4) return undefined;
  const prefix = `/assets/products/generated/${sku}/`;
  return images.every(image => image.src.startsWith(prefix) && image.thumbnail.startsWith(prefix))
    ? images : undefined;
}
