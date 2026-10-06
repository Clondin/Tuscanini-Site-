import { optimizedImages } from "../data/optimized-images";

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
  const optimized = optimizedImages[src];
  if (!optimized) return { src };
  return { src: optimized.src, srcSet: optimized.srcSet, sizes };
}
