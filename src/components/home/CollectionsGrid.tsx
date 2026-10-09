import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { categories, type Category } from "../../data/products";
import { isMissingProductImage } from "../../lib/productImage";
import PackFan from "../ui/PackFan";

/**
 * Homepage aisles as poster-colored signs. The first is the large feature
 * tile and the last spans two columns. Text color is chosen per sign for
 * contrast: ink on the light lemon and orange fields, paper on the rest.
 */
const signs: { slug: string; background: string; ink: boolean }[] = [
  { slug: "pasta-gnocchi", background: "#f0be2c", ink: true },
  { slug: "pasta-sauces", background: "#c8302a", ink: false },
  { slug: "olive-oil", background: "#2f6b3a", ink: false },
  { slug: "chocolate", background: "#3a2a20", ink: false },
  { slug: "beverages", background: "#3e63a8", ink: false },
  { slug: "pizza", background: "#e8743b", ink: true },
];

function AisleSign({
  category,
  background,
  ink,
  feature,
  className,
}: {
  category: Category;
  background: string;
  ink: boolean;
  feature: boolean;
  className: string;
}) {
  const products = category.products.filter(
    (product) => !isMissingProductImage(product.image),
  );
  if (!products.length) return null;
  return (
    <Link
      to={`/category/${category.slug}`}
      style={{ backgroundColor: background } as CSSProperties}
      className={`group relative flex flex-col overflow-hidden ${ink ? "text-ink" : "text-paper"} ${className}`}
    >
      <div className={`relative flex items-start justify-between gap-4 ${feature ? "p-6 md:p-10" : "p-5 md:p-6"}`}>
        <h3
          className={`font-headline font-medium leading-[0.92] tracking-[-0.025em] ${
            feature
              ? "text-[clamp(2.75rem,6vw,5.5rem)] max-w-[8ch]"
              : "text-[clamp(1.6rem,2.4vw,2.25rem)]"
          }`}
        >
          {category.name}
        </h3>
        <span
          aria-hidden="true"
          className={`shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
            feature ? "flex h-14 w-14" : "hidden md:flex h-10 w-10"
          } ${
            ink
              ? "border-ink/40 group-hover:bg-ink group-hover:text-paper"
              : "border-paper/50 group-hover:bg-paper group-hover:text-ink"
          }`}
        >
          <ArrowUpRight size={feature ? 22 : 18} />
        </span>
      </div>
      <div className={`relative flex-1 ${feature ? "px-8 md:px-14 pb-8" : "px-5 pb-5"}`}>
        <PackFan
          products={products}
          onColor
          sizes={feature ? "(min-width: 1024px) 420px, 70vw" : "(min-width: 1024px) 220px, 40vw"}
        />
      </div>
    </Link>
  );
}

export default function CollectionsGrid() {
  const featured = signs.flatMap((sign) => {
    const category = categories.find((entry) => entry.slug === sign.slug);
    return category ? [{ ...sign, category }] : [];
  });
  const last = featured.length - 1;
  return (
    <section
      id="collections"
      className="bg-paper px-5 md:px-10 py-16 md:py-24 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12 flex flex-wrap items-end justify-between gap-6">
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
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[230px] md:auto-rows-[280px] gap-3 md:gap-4">
          {featured.map(({ category, background, ink }, index) => (
            <AisleSign
              key={category.slug}
              category={category}
              background={background}
              ink={ink}
              feature={index === 0}
              className={
                index === 0
                  ? "col-span-2 row-span-2"
                  : index === last
                    ? "col-span-2"
                    : ""
              }
            />
          ))}
          <Link
            id="more-collections"
            to="/products?view=collections"
            className="group col-span-2 scroll-mt-24 relative overflow-hidden bg-ink text-paper p-6 md:p-8 flex flex-col justify-end"
          >
            <div className="flex items-end justify-between gap-4">
              <p className="font-headline font-medium text-[clamp(2rem,3.4vw,3.25rem)] leading-[0.95] tracking-[-0.02em] max-w-[11ch]">
                See every collection
              </p>
              <span
                aria-hidden="true"
                className="shrink-0 w-14 h-14 rounded-full bg-lemon text-ink flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
              >
                <ArrowRight size={22} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
