import { Link } from "react-router-dom";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import type { Product } from "../../data/products";
import { isFrozenProduct } from "../../lib/catalog-search";
import { getResponsiveImageProps, isMissingProductImage } from '../../lib/productImage';
import { formatProductSize } from '../../lib/formatProductSize';
import { getAmazonBuyLink } from "../../lib/productPurchaseLink";
import { getCategoryAccent } from "../../data/category-accents";

export default function CatalogCard({ product }: { product: Product }) {
  if (isMissingProductImage(product.image)) return null;
  const accent = getCategoryAccent(product.categoryId);
  const amazon = getAmazonBuyLink(product);
  return (
    <div className="group flex h-full flex-col bg-surface ring-1 ring-on-surface/12 transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-20px_rgba(42,31,22,0.5)] motion-reduce:hover:translate-y-0">
      <Link to={`/product/${product.id}`} className="block flex-1">
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
      {amazon && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
          <a
            href={amazon.href}
            target="_blank"
            rel="sponsored noopener"
            data-aff-placement="card"
            data-aff-kind={amazon.kind}
            data-aff-slug={product.id}
            aria-label={`${amazon.kind === "dp" ? "Buy" : "Find"} ${product.name} on Amazon`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-ink/15 bg-paper px-3.5 text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            <ShoppingCart size={13} aria-hidden="true" />
            {amazon.label}
          </a>
        </div>
      )}
    </div>
  );
}
