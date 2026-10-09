import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Category } from "../../data/products";
import { shelfSizing } from "../../lib/packSize";
import { formatProductSize } from "../../lib/formatProductSize";
import {
  getResponsiveImageProps,
  isMissingProductImage,
} from "../../lib/productImage";
import { opaquePackShots } from "../../data/opaque-pack-shots.generated";
import ShelfImage from "./ShelfImage";

// Written out in full (not built from strings) so Tailwind generates both classes.
const WOOD =
  "bg-[linear-gradient(to_bottom,#d2a574_0%,#b98653_35%,#9c6a3c_75%,#7f532c_100%)]";
const WOOD_RUN_ON =
  "after:absolute after:left-full after:top-0 after:h-full after:w-screen after:bg-[linear-gradient(to_bottom,#d2a574_0%,#b98653_35%,#9c6a3c_75%,#7f532c_100%)]";

/** Option B: warm wooden pantry shelves; names lettered on the wall beneath. */
export default function PantryShelf({ category }: { category: Category }) {
  const products = useMemo(
    () =>
      category.products.filter(
        (product) => !isMissingProductImage(product.image),
      ),
    [category.products],
  );
  const sizing = useMemo(
    () => shelfSizing(products, { base: 185, min: 115, max: 240 }),
    [products],
  );

  return (
    <section
      aria-label={`${category.name} shelf`}
      className="relative overflow-hidden bg-[#efe5d3] pt-12 pb-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,250,240,0.85),rgba(255,250,240,0)_60%)]"
      />
      <ul className="relative grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-y-8">
        {products.map((product, index) => (
          <li key={product.id}>
            <Link to={`/product/${product.id}`} className="group block h-full">
              <div className="flex h-[220px] md:h-[250px] items-end justify-center px-4">
                <ShelfImage
                  {...getResponsiveImageProps(product.image, "200px")}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ maxHeight: sizing[product.id].height }}
                  className={`max-w-full w-auto object-contain object-bottom mix-blend-multiply group-hover:-translate-y-2 motion-reduce:transform-none ${
                    opaquePackShots.has(product.image) ? "" : "drop-shadow-[0_6px_6px_rgba(80,50,20,0.25)]"
                  }`}
                />
              </div>
              <div
                aria-hidden="true"
                className={`relative h-4 ${WOOD} shadow-[0_14px_18px_-10px_rgba(70,40,15,0.6)] ${
                  index === products.length - 1
                    ? WOOD_RUN_ON
                    : ""
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-[2px] bg-[#e8c49a]" />
              </div>
              <div className="px-3 pt-4 text-center">
                <p className="font-headline italic text-[17px] leading-tight text-[#3a2617] line-clamp-2 group-hover:underline underline-offset-4">
                  {product.name}
                </p>
                {product.size && (
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#3a2617]/70 tabular-nums">
                    {formatProductSize(product.size)}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
