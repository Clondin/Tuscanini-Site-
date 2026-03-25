interface SkeletonProps {
  className?: string;
}

/** Base skeleton block with a shimmer pulse animation. */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-on-surface/[0.06] via-on-surface/[0.10] to-on-surface/[0.06] bg-[length:200%_100%] rounded-sm ${className}`}
    />
  );
}

/** A line of skeleton text. */
export function SkeletonText({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-4 w-full rounded ${className}`} />;
}

/** A rectangular skeleton matching an image area. */
export function SkeletonImage({ className = "" }: SkeletonProps) {
  return <Skeleton className={`w-full aspect-[4/3] ${className}`} />;
}

/** A card-shaped skeleton with image area and text lines. */
export function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <SkeletonImage />
      <SkeletonText className="w-3/4" />
      <SkeletonText className="w-1/2" />
    </div>
  );
}

/** A circular skeleton, useful for avatars or icons. */
export function SkeletonCircle({ className = "" }: SkeletonProps) {
  return <Skeleton className={`rounded-full w-12 h-12 ${className}`} />;
}
