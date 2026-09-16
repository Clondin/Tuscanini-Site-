import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "../../data/products";
import { isFrozenProduct } from "../../lib/catalog-search";

export default function CatalogCard({ product }: { product: Product }) {
  if (!product.image) return null;
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block h-full border border-on-surface/15 bg-surface hover:border-olive-accent transition-colors"
    >
      <div className="relative aspect-square flex items-center justify-center bg-aged-cream/50 p-5 sm:p-8">
        {isFrozenProduct(product) && (
          <span className="absolute top-3 left-3 text-xs text-olive-deep bg-surface px-2 py-1">
            Frozen
          </span>
        )}
        <img
          src={product.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 motion-reduce:transform-none"
        />
      </div>
      <div className="p-4 sm:p-5 border-t border-on-surface/10">
        <p className="text-xs sm:text-sm text-on-surface/75 mb-2">
          {product.size || "Tuscanini"}
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
