import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Category } from "../../data/products";
import { getPosterColor } from "../../data/category-accents";
import { shelfSizing } from "../../lib/packSize";
import { formatProductSize } from "../../lib/formatProductSize";
import {
  getResponsiveImageProps,
  isMissingProductImage,
} from "../../lib/productImage";
import ShelfImage from "./ShelfImage";

/** Option C: each pack on its own plinth in the aisle color, named on its face. */
export default function GalleryShelf({ category }: { category: Category }) {
  const products = useMemo(
    () =>
      category.products.filter(
        (product) => !isMissingProductImage(product.image),
      ),
    [category.products],
  );
  const sizing = useMemo(
    () => shelfSizing(products, { base: 170, min: 105, max: 220 }),
    [products],
  );
  const poster = getPosterColor(category.slug);

  return (
    <section aria-label={`${category.name} shelf`} className="bg-paper py-6">
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 md:gap-x-8 gap-y-14">
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/product/${product.id}`} className="group block">
              <div className="relative flex h-[220px] md:h-[250px] items-end justify-center px-6">
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-1/2 h-4 w-3/5 -translate-x-1/2 translate-y-1/2 rounded-[50%] bg-ink/25 blur-md transition-transform duration-500 group-hover:scale-x-90"
                />
                <ShelfImage
                  {...getResponsiveImageProps(product.image, "220px")}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ maxHeight: sizing[product.id].height }}
                  className="relative max-w-full w-auto object-contain object-bottom mix-blend-multiply group-hover:-translate-y-3 motion-reduce:transform-none"
                />
              </div>
              <div
                style={{ backgroundColor: poster.background }}
                className={`relative px-4 pt-5 pb-6 min-h-[112px] ${poster.ink ? "text-ink" : "text-paper"} shadow-[inset_0_10px_14px_-12px_rgba(0,0,0,0.45)]`}
              >
                <p className="font-headline font-medium text-lg md:text-xl leading-[1.1] line-clamp-2">
                  {product.name}
                </p>
                {product.size && (
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] opacity-85 tabular-nums">
                    {formatProductSize(product.size)}
                  </p>
                )}
                <span
                  aria-hidden="true"
                  className="absolute right-4 bottom-5 text-lg transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
