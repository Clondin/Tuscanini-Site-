import type { Product } from "../../data/products";
import { opaquePackShots } from "../../data/opaque-pack-shots.generated";
import {
  getResponsiveImageProps,
  isMissingProductImage,
} from "../../lib/productImage";

/**
 * Up to three pack shots arranged like a small shelf display: the first
 * product stands in front, the next two lean in behind it. Hovering the
 * nearest `group` ancestor spreads the arrangement slightly.
 */
export default function PackFan({
  products,
  sizes = "(min-width: 1024px) 240px, 40vw",
  eager = false,
  onColor = false,
}: {
  products: Product[];
  sizes?: string;
  eager?: boolean;
  /** On saturated backgrounds, skip multiply blending, which would tint the packs. */
  onColor?: boolean;
}) {
  const packs = products
    .filter((product) => !isMissingProductImage(product.image))
    // On color, opaque photos show as boxes; put transparent pack shots first.
    .sort((a, b) =>
      onColor
        ? Number(opaquePackShots.has(a.image)) - Number(opaquePackShots.has(b.image))
        : 0,
    )
    .filter(
      (product, index, list) =>
        list.findIndex((other) => other.image === product.image) === index,
    )
    .slice(0, 3);
  if (!packs.length) return null;
  const [front, left, right] = packs;
  const image = (product: Product) => ({
    ...getResponsiveImageProps(product.image, sizes),
    alt: "",
    loading: eager ? ("eager" as const) : ("lazy" as const),
    decoding: "async" as const,
  });
  const motion =
    "transition-transform duration-500 ease-out motion-reduce:transition-none";
  const blend = onColor ? "" : "mix-blend-multiply";
  return (
    <div className="relative h-full w-full flex items-end justify-center">
      <div
        aria-hidden="true"
        className={`absolute bottom-0 left-1/2 h-5 w-3/4 -translate-x-1/2 rounded-[50%] blur-md ${onColor ? "bg-black/35" : "bg-heading/20"}`}
      />
      {left && (
        <img
          {...image(left)}
          className={`absolute bottom-[4%] left-[7%] h-[66%] max-w-[40%] w-auto object-contain object-bottom ${blend} -rotate-6 origin-bottom ${motion} group-hover:-translate-x-2 group-hover:-rotate-[9deg]`}
        />
      )}
      {right && (
        <img
          {...image(right)}
          className={`absolute bottom-[4%] right-[7%] h-[66%] max-w-[40%] w-auto object-contain object-bottom ${blend} rotate-6 origin-bottom ${motion} group-hover:translate-x-2 group-hover:rotate-[9deg]`}
        />
      )}
      {/* The front pack stays opaque; multiplying it would let the packs behind show through. */}
      <img
        {...image(front)}
        className={`relative h-[88%] max-w-[54%] w-auto object-contain object-bottom ${motion} group-hover:-translate-y-2`}
      />
    </div>
  );
}
