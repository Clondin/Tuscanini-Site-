import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "../../data/products";
import { getCategoryAccent } from "../../data/category-accents";
import { isMissingProductImage } from "../../lib/productImage";
import PackFan from "../ui/PackFan";

/**
 * A collection as a tinted display case: its own accent color, a small fan of
 * its pack shots. `feature` is the oversized
 * homepage variant that also shows the collection tagline.
 */
export default function CollectionTile({
  category,
  feature = false,
  className = "",
}: {
  category: Category;
  feature?: boolean;
  className?: string;
}) {
  const products = category.products.filter(
    (product) => !isMissingProductImage(product.image),
  );
  if (!products.length) return null;
  const accent = getCategoryAccent(category.slug);
  return (
    <Link
      to={`/category/${category.slug}`}
      style={
        {
          backgroundColor: accent.soft,
          "--tile-accent": accent.deep,
        } as CSSProperties
      }
      className={`group relative flex flex-col overflow-hidden ring-1 ring-inset ring-heading/5 transition-shadow duration-300 hover:shadow-[0_18px_40px_-18px_rgba(42,31,22,0.45)] ${className}`}
    >
      <div
        className={`relative flex-1 px-5 pt-6 ${feature ? "min-h-[260px] md:min-h-0 md:px-12 md:pt-12" : "min-h-[150px] md:min-h-0"}`}
      >
        <PackFan
          products={products}
          sizes={
            feature
              ? "(min-width: 1024px) 420px, 70vw"
              : "(min-width: 1024px) 220px, 40vw"
          }
        />
      </div>
      <div
        className={`relative flex items-end justify-between gap-3 ${feature ? "p-5 md:p-8" : "p-4 md:p-5"}`}
      >
        <div className="min-w-0">
          <h3
            className={`font-headline text-heading leading-tight ${feature ? "text-[clamp(1.75rem,3vw,2.75rem)]" : "text-lg md:text-2xl"}`}
          >
            {category.name}
          </h3>
          {feature && category.tagline && (
            <p className="mt-2 max-w-[40ch] text-sm md:text-base text-on-surface/80 line-clamp-2">
              {category.tagline}
            </p>
          )}
        </div>
        <span
          aria-hidden="true"
          className="shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full border border-[var(--tile-accent)] text-[var(--tile-accent)] flex items-center justify-center transition-colors duration-300 group-hover:bg-[var(--tile-accent)] group-hover:text-white"
        >
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}
