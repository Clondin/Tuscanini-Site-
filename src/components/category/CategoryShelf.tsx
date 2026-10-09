import type { CSSProperties } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Category } from "../../data/products";
import { getCategoryAccent, getPosterColor } from "../../data/category-accents";
import { shelfSizing } from "../../lib/packSize";
import { formatProductSize } from "../../lib/formatProductSize";
import ShelfImage from "./ShelfImage";
import {
  getResponsiveImageProps,
  isMissingProductImage,
} from "../../lib/productImage";

/**
 * The collection as a lit store shelf: every pack visible on wrapping rows,
 * scaled by its stated pack size, with a shelf tag naming it underneath.
 */
export default function CategoryShelf({ category }: { category: Category }) {
  const products = useMemo(
    () =>
      category.products.filter(
        (product) => !isMissingProductImage(product.image),
      ),
    [category.products],
  );
  const sizing = useMemo(
    () => shelfSizing(products, { base: 175, min: 110, max: 230 }),
    [products],
  );
  const accent = getCategoryAccent(category.slug);
  const poster = getPosterColor(category.slug);

  return (
    <section
      aria-label={`${category.name} shelf`}
      style={
        {
          backgroundColor: accent.soft,
          "--tag-stripe": poster.background,
        } as CSSProperties
      }
      className="relative overflow-hidden pt-10 pb-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.45),rgba(255,255,255,0)_45%)]"
      />
      <ul className="relative grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(176px,1fr))] gap-y-10">
        {products.map((product, index) => (
          <li key={product.id}>
            <Link to={`/product/${product.id}`} className="group block h-full">
              <div className="flex h-[210px] md:h-[236px] items-end justify-center px-4 pb-1">
                <ShelfImage
                  {...getResponsiveImageProps(product.image, "200px")}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ maxHeight: sizing[product.id].height }}
                  className="max-w-full w-auto object-contain object-bottom mix-blend-multiply group-hover:-translate-y-2 motion-reduce:transform-none"
                />
              </div>
              {/* Adjacent cells join their planks into one continuous shelf per row;
                  the last pack's plank runs on so a short final row is still a full shelf. */}
              <div
                aria-hidden="true"
                className={`relative h-3 bg-ink shadow-[0_12px_16px_-8px_rgba(20,18,16,0.55)] ${
                  index === products.length - 1
                    ? "after:absolute after:left-full after:top-0 after:h-full after:w-screen after:bg-ink after:shadow-[0_12px_16px_-8px_rgba(20,18,16,0.55)]"
                    : ""
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-white/25" />
              </div>
              <div className="mx-2 sm:mx-3 mt-3 min-h-[68px] border-t-4 border-[var(--tag-stripe)] bg-paper px-3 py-2.5 shadow-[0_6px_14px_-8px_rgba(20,18,16,0.4)] transition-transform duration-300 origin-top group-hover:-rotate-1 motion-reduce:transform-none">
                <p className="font-headline text-[15px] md:text-base leading-tight text-ink line-clamp-2 group-hover:underline underline-offset-2">
                  {product.name}
                </p>
                {product.size && (
                  <p className="mt-1 text-xs text-on-surface/75 tabular-nums">
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
