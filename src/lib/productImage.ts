import { optimizedImages, type OptimizedImage } from "../data/optimized-images";
import { productGalleries } from "../data/product-galleries.generated";

const commissionedImages: Record<string, OptimizedImage> = {};
for (const gallery of Object.values(productGalleries)) {
  for (const image of gallery) {
    const thumbnailWidth = Math.max(1, Math.round(image.width * Math.min(320 / image.width, 320 / image.height, 1)));
    commissionedImages[image.src] = {
      src: image.src,
      srcSet: `${image.thumbnail} ${thumbnailWidth}w, ${image.src} ${image.width}w`,
    };
  }
}

/** Includes the CMS-uploaded form of the existing unavailable-photo asset. */
export function isMissingProductImage(src: string | null | undefined): boolean {
  if (!src?.trim()) return true;
  return /(?:^|[/-])pack-shot-pending\.(?:svg|png|webp)(?:[?#]|$)/i.test(src);
}

/** Only code-managed local photos are optimized; CMS image URLs remain authoritative. */
export function getOptimizedImageUrl(src: string): string {
  return optimizedImages[src]?.src ?? src;
}

export function getResponsiveImageProps(src: string, sizes = "(min-width: 1024px) 400px, 90vw") {
  const optimized = optimizedImages[src] ?? commissionedImages[src];
  if (!optimized) return { src };
  return { src: optimized.src, srcSet: optimized.srcSet, sizes };
}
