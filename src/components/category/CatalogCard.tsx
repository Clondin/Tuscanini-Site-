import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "../../data/products";
import { isFrozenProduct } from "../../lib/catalog-search";
import { getResponsiveImageProps, isMissingProductImage } from '../../lib/productImage';
import { formatProductSize } from '../../lib/formatProductSize';
import { getCategoryAccent } from "../../data/category-accents";

export default function CatalogCard({ product }: { product: Product }) {
  if (isMissingProductImage(product.image)) return null;
  const accent = getCategoryAccent(product.categoryId);
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block h-full bg-surface ring-1 ring-on-surface/12 transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-20px_rgba(42,31,22,0.5)] motion-reduce:hover:translate-y-0"
    >
      <div
        style={{ backgroundColor: accent.soft }}
        className="relative aspect-square flex items-center justify-center p-5 sm:p-8"
      >
        {isFrozenProduct(product) && (
          <span className="absolute top-3 left-3 rounded-full text-xs text-olive-deep bg-surface/90 px-2.5 py-1">
            Frozen
          </span>
        )}
        <img
          {...getResponsiveImageProps(product.image)}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 motion-reduce:transform-none"
        />
      </div>
      <div className="p-4 sm:p-5 border-t border-on-surface/10">
        <p className="text-xs sm:text-sm text-on-surface/75 mb-2">
          {formatProductSize(product.size) || "Tuscanini"}
        </p>
        <h3 className="font-headline text-lg sm:text-xl leading-snug text-heading group-hover:text-olive-accent">
          {product.name}
        </h3>
        <span className="mt-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-olive-deep">
          View product <ArrowUpRight size={15} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
