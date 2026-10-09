import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { categories } from "../../data/products";
import { getPosterColor } from "../../data/category-accents";
import { isMissingProductImage } from "../../lib/productImage";
import PackFan from "../ui/PackFan";

const slugs = [
  "pasta-gnocchi",
  "pasta-sauces",
  "olive-oil",
  "pizza",
  "chocolate",
  "beverages",
  "olives",
  "tuna-seafood",
  "pesto",
  "canned-tomatoes",
];

/** Option C: a horizontal rail of tall aisle posters. */
export default function AisleRail() {
  const rail = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () =>
      setEdges({
        start: element.scrollLeft < 4,
        end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
      });
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, []);
  const move = (direction: number) =>
    rail.current?.scrollBy({
      left: direction * rail.current.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  const posters = slugs.flatMap((slug) => {
    const category = categories.find((entry) => entry.slug === slug);
    if (!category) return [];
    const products = category.products.filter(
      (product) => !isMissingProductImage(product.image),
    );
    return products.length
      ? [{ category, products, poster: getPosterColor(slug) }]
      : [];
  });

  return (
    <section id="collections" className="bg-paper py-16 md:py-24 scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10 mb-8 md:mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-headline font-medium text-ink text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.03em]">
          Shop by aisle
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={edges.start}
            aria-label="Previous aisles"
            className="h-12 w-12 rounded-full border border-ink/25 flex items-center justify-center text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={edges.end}
            aria-label="Next aisles"
            className="h-12 w-12 rounded-full border border-ink/25 flex items-center justify-center text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <ul
        ref={rail}
        tabIndex={0}
        aria-label="Aisles, scroll horizontally"
        className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-5 md:scroll-px-[max(2.5rem,calc((100vw_-_80rem)/2_+_2.5rem))] px-5 md:px-[max(2.5rem,calc((100vw_-_80rem)/2_+_2.5rem))] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posters.map(({ category, products, poster }) => (
          <li key={category.slug} className="snap-start shrink-0 w-[72vw] sm:w-[300px] md:w-[320px]">
            <Link
              to={`/category/${category.slug}`}
              style={{ backgroundColor: poster.background }}
              className={`group flex h-[420px] md:h-[460px] flex-col p-6 ${poster.ink ? "text-ink" : "text-paper"}`}
            >
              <h3 className="font-headline font-medium text-[2.6rem] leading-[0.92] tracking-[-0.025em]">
                {category.name}
              </h3>
              <div className="relative mt-auto h-[230px] md:h-[260px]">
                <PackFan
                  products={products}
                  onColor
                  sizes="(min-width: 768px) 280px, 60vw"
                />
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                Shop
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
        <li className="snap-start shrink-0 w-[72vw] sm:w-[300px] md:w-[320px]">
          <Link
            to="/products?view=collections"
            className="group flex h-[420px] md:h-[460px] flex-col justify-end bg-ink p-6 text-paper"
          >
            <span className="font-headline font-medium text-[2.6rem] leading-[0.92] tracking-[-0.025em]">
              See every collection
            </span>
            <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-lemon text-ink transition-transform group-hover:translate-x-1">
              <ArrowRight size={22} aria-hidden="true" />
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
