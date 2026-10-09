import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "../../data/products";
import { collectionGroups } from "../../data/collection-groups";
import { getPosterColor } from "../../data/category-accents";
import {
  getResponsiveImageProps,
  isMissingProductImage,
} from "../../lib/productImage";

/** Option D: tabs for each aisle; the panel lists every collection in it. */
export default function AisleExplorer() {
  const groups = collectionGroups(categories)
    .map((group) => ({
      ...group,
      items: group.items.flatMap((category) => {
        const pack = category.products.find(
          (product) => !isMissingProductImage(product.image),
        );
        return pack ? [{ category, pack }] : [];
      }),
    }))
    .filter((group) => group.items.length > 0);
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  if (!groups.length) return null;
  const current = groups[Math.min(active, groups.length - 1)];
  const poster = getPosterColor(current.items[0].category.slug);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: groups.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (keys[event.key] + groups.length) % groups.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="collections" className="bg-paper px-5 md:px-10 py-16 md:py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-10 flex flex-wrap items-end justify-between gap-6">
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

        <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-10">
          <div
            role="tablist"
            aria-label="Aisles"
            onKeyDown={onKeyDown}
            className="-mx-5 px-5 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t-2 lg:border-ink"
          >
            {groups.map((group, index) => {
              const selected = index === active;
              const swatch = getPosterColor(group.items[0].category.slug).background;
              return (
                <button
                  key={group.label}
                  ref={(element) => {
                    tabs.current[index] = element;
                  }}
                  id={`${baseId}-tab-${index}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  className={`group shrink-0 flex items-center gap-3 rounded-full border px-4 py-2.5 text-left transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-ink/15 lg:px-0 lg:py-5 ${
                    selected
                      ? "border-ink bg-ink text-paper lg:bg-transparent lg:text-ink"
                      : "border-ink/20 text-ink/70 hover:text-ink"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    style={{ backgroundColor: swatch }}
                    className={`h-3 w-3 shrink-0 rounded-full transition-transform ${selected ? "lg:scale-150" : ""}`}
                  />
                  <span className="whitespace-nowrap text-sm font-semibold lg:font-headline lg:font-medium lg:text-[2rem] lg:leading-none lg:tracking-[-0.02em]">
                    {group.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active}`}
            style={{ backgroundColor: poster.background }}
            className={`p-5 md:p-8 transition-colors duration-500 ${poster.ink ? "text-ink" : "text-paper"}`}
          >
            <h3 className="font-headline font-medium text-[clamp(2.25rem,4.4vw,4rem)] leading-[0.95] tracking-[-0.025em]">
              {current.label}
            </h3>
            <ul key={current.label} className="page-enter mt-6 md:mt-8 grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
              {current.items.map(({ category, pack }) => (
                <li key={category.slug}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="group flex h-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4 bg-paper p-3 md:p-4 text-ink transition-shadow hover:shadow-[0_14px_28px_-16px_rgba(0,0,0,0.5)]"
                  >
                    <img
                      {...getResponsiveImageProps(pack.image, "80px")}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-12 md:h-20 md:w-16 shrink-0 object-contain mix-blend-multiply transition-transform duration-300 group-hover:-translate-y-1"
                    />
                    <span className="min-w-0 font-headline text-base sm:text-lg md:text-2xl leading-tight [overflow-wrap:anywhere]">
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
