import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { categories } from "../../data/products";
import { getPosterColor } from "../../data/category-accents";
import {
  getResponsiveImageProps,
  isMissingProductImage,
} from "../../lib/productImage";

const slugs = [
  "pasta-gnocchi",
  "pasta-sauces",
  "olive-oil",
  "chocolate",
  "beverages",
  "pizza",
  "olives",
  "tuna-seafood",
];

/** Option B: a typographic index; hovering a row floods it with the aisle color. */
export default function AisleIndex() {
  const rows = slugs.flatMap((slug) => {
    const category = categories.find((entry) => entry.slug === slug);
    if (!category) return [];
    const packs = category.products
      .filter((product) => !isMissingProductImage(product.image))
      .slice(0, 3);
    return packs.length ? [{ category, packs, poster: getPosterColor(slug) }] : [];
  });

  return (
    <section id="collections" className="bg-paper px-5 md:px-10 py-16 md:py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-headline font-medium text-ink text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.03em]">
            Shop by aisle
          </h2>
          <Link
            to="/products?view=collections"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink"
          >
            <span className="underline decoration-ink/30 underline-offset-[6px] group-hover:decoration-ink">
              All collections
            </span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className="border-t-2 border-ink">
          {rows.map(({ category, packs, poster }) => (
            <li key={category.slug} className="border-b border-ink/15">
              <Link
                to={`/category/${category.slug}`}
                style={
                  {
                    "--row-bg": poster.background,
                    "--row-fg": poster.ink ? "#141210" : "#f7f4ee",
                  } as CSSProperties
                }
                className="group relative flex items-center gap-4 md:gap-8 overflow-hidden px-2 md:px-4 py-4 md:py-5 text-ink transition-colors duration-300 hover:text-[var(--row-fg)] focus-visible:text-[var(--row-fg)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-[var(--row-bg)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
                />
                <span className="relative flex-1 min-w-0 font-headline font-medium text-[clamp(2rem,5.4vw,5rem)] leading-none tracking-[-0.03em]">
                  {category.name}
                </span>
                <span className="relative hidden sm:flex items-end -space-x-4 h-16 md:h-20">
                  {packs.map((pack, index) => (
                    <img
                      key={pack.id}
                      {...getResponsiveImageProps(pack.image, "80px")}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{ transitionDelay: `${index * 60}ms` }}
                      className="h-full w-auto max-w-[72px] object-contain object-bottom transition-transform duration-500 group-hover:-translate-y-2 group-focus-visible:-translate-y-2 motion-reduce:transition-none"
                    />
                  ))}
                </span>
                <img
                  {...getResponsiveImageProps(packs[0].image, "56px")}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="relative sm:hidden h-12 w-auto max-w-[48px] object-contain"
                />
                <span
                  aria-hidden="true"
                  className="relative shrink-0 hidden sm:flex h-12 w-12 items-center justify-center rounded-full border border-current/30 transition-transform duration-300 group-hover:rotate-45"
                >
                  <ArrowUpRight size={20} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
