import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../data/products";
import { shelfSizing } from "../../lib/packSize";
import { formatProductSize } from "../../lib/formatProductSize";
import { getResponsiveImageProps, isMissingProductImage } from "../../lib/productImage";
import SectionHeading from "../ui/SectionHeading";

interface RelatedProductsProps {
  /** Sibling products from the same category, excluding the one on screen. */
  products: Product[];
  categorySlug: string;
  /** Total items in the category, for the "All N items" link. */
  totalInCategory: number;
}

export default function RelatedProducts({
  products,
  categorySlug,
  totalInCategory,
}: RelatedProductsProps) {
  const shelf = products.filter((p) => !isMissingProductImage(p.image)).slice(0, 8);
  const sizing = useMemo(() => shelfSizing(shelf, { base: 185, min: 120, max: 240 }), [shelf]);

  if (shelf.length === 0) return null;

  return (
    <section className="bg-earth-dark py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Back on the shelf"
          rule="ink"
          action={{ label: `All ${totalInCategory} items`, to: `/category/${categorySlug}` }}
        />

        <div className="overflow-x-auto pt-7">
          <div className="flex flex-col w-max min-w-full">
            <div className="flex items-end px-1.5 min-h-[210px]">
              {shelf.map((product) => {
                const { height, width } = sizing[product.id];
                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    aria-label={product.name}
                    style={{ width }}
                    className="group flex shrink-0 items-end justify-center px-4"
                  >
                    <img
                      {...getResponsiveImageProps(product.image, "200px")}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      style={{ maxHeight: height }}
                      className="max-w-full w-auto object-contain drop-shadow-[0_12px_16px_rgba(42,31,22,0.2)] group-hover:-translate-y-1.5 transition-transform duration-300"
                    />
                  </Link>
                );
              })}
            </div>

            <div className="h-3.5 shelf-edge" />

            <div className="flex px-1.5 pt-3.5">
              {shelf.map((product) => {
                const { width } = sizing[product.id];
                return (
                  <span key={product.id} style={{ width }} className="shrink-0 px-4 text-center">
                    <span className="block font-headline text-[15px] leading-tight text-heading line-clamp-2">
                      {product.name}
                    </span>
                    {product.size && (
                      <span className="mt-1 block text-[10px] tracking-[0.16em] text-on-surface/45">
                        {formatProductSize(product.size)}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
