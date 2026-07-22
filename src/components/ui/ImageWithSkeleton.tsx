import type { ImgHTMLAttributes } from "react";
import { useState } from "react";
import { SkeletonImage } from "./Skeleton";

interface ImageWithSkeletonProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  onLoad?: ImgHTMLAttributes<HTMLImageElement>["onLoad"];
  /** Extra classes applied to the outer wrapper div. */
  wrapperClassName?: string;
  /** Extra classes applied to the skeleton placeholder. */
  skeletonClassName?: string;
  className?: string;
}

/**
 * Wraps a standard <img> with a skeleton placeholder that shows while the
 * image is loading, then cross-fades to the loaded image.
 */
export default function ImageWithSkeleton({
  wrapperClassName = "",
  skeletonClassName = "",
  className = "",
  src,
  alt,
  referrerPolicy,
  onLoad,
  loading = "lazy",
  decoding = "async",
  ...imgProps
}: ImageWithSkeletonProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const loaded = loadedSrc === src;

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Skeleton shown underneath while loading */}
      {!loaded && (
        <div className="absolute inset-0 z-10">
          <SkeletonImage className={`h-full ${skeletonClassName}`} />
        </div>
      )}

      {/* The actual image — starts transparent and fades in once loaded */}
      <img
        {...imgProps}
        src={src}
        alt={alt}
        referrerPolicy={referrerPolicy}
        loading={loading}
        decoding={decoding}
        className={`transition-opacity duration-500 ease-out ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={(e) => {
          setLoadedSrc(src);
          onLoad?.(e);
        }}
      />
    </div>
  );
}
