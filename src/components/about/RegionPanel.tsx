import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { categories, type Product } from "../../data/products";
import { getCategoryAccent } from "../../data/category-accents";
import type { SourcingRegion } from "../../data/sourcing-regions";
import {
  getResponsiveImageProps,
  isMissingProductImage,
} from "../../lib/productImage";

const SHOWN = 4;

/** Alternates between the region's related collections so mixed regions show variety. */
function relatedProducts(region: SourcingRegion): Product[] {
  const lists = region.related
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category) => category !== undefined)
    .map((category) =>
      category.products.filter(
        (product) => !isMissingProductImage(product.image),
      ),
    );
  const picked: Product[] = [];
  for (let round = 0; picked.length < SHOWN; round++) {
    let added = false;
    for (const list of lists) {
      if (list[round] && picked.length < SHOWN) {
        picked.push(list[round]);
        added = true;
      }
    }
    if (!added) break;
  }
  return picked;
}

export default function RegionPanel({
  regions,
  selected,
  hoveredId,
  touring,
  onSelect,
  onHover,
  onReset,
  onToggleTour,
}: {
  regions: SourcingRegion[];
  selected: SourcingRegion | null;
  hoveredId: string | null;
  touring: boolean;
  onSelect: (region: SourcingRegion) => void;
  onHover: (id: string | null) => void;
  onReset: () => void;
  onToggleTour: () => void;
}) {
  const index = selected
    ? regions.findIndex((region) => region.id === selected.id)
    : -1;
  const previous = index > 0 ? regions[index - 1] : null;
  const next = index >= 0 && index < regions.length - 1 ? regions[index + 1] : null;

  const tourButton = (
    <button
      type="button"
      onClick={onToggleTour}
      aria-pressed={touring}
      className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-heading px-5 text-sm font-semibold text-aged-cream transition-colors hover:bg-burnt-terracotta"
    >
      {touring ? (
        <Pause size={15} aria-hidden="true" />
      ) : (
        <Play size={15} aria-hidden="true" className="translate-x-px" />
      )}
      {touring ? "Pause tour" : "Take the tour"}
    </button>
  );

  if (!selected) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-on-surface/12 pb-5">
          <h3 className="font-headline text-2xl text-heading">Regions</h3>
          {tourButton}
        </div>
        <ul className="flex-1 divide-y divide-on-surface/10">
          {regions.map((region) => (
            <li key={region.id}>
              <button
                type="button"
                onClick={() => onSelect(region)}
                onPointerEnter={() => onHover(region.id)}
                onPointerLeave={() => onHover(null)}
                onFocus={() => onHover(region.id)}
                onBlur={() => onHover(null)}
                className={`group flex w-full items-center gap-4 py-4 text-left transition-colors ${
                  hoveredId === region.id ? "text-burnt-terracotta" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full ring-4 ring-white/70 transition-transform group-hover:scale-125"
                  style={{ backgroundColor: region.color }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-headline text-xl text-heading group-hover:text-burnt-terracotta transition-colors">
                    {region.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-on-surface/75">
                    {region.eyebrow}
                  </span>
                </span>
                <ChevronRight
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-on-surface/40 transition-transform group-hover:translate-x-1 group-hover:text-burnt-terracotta"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const products = relatedProducts(selected);
  const collections = selected.related
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category) => category !== undefined);

  return (
    <div
      key={selected.id}
      className="region-panel-enter flex h-full flex-col"
      style={{ "--region-color": selected.color } as CSSProperties}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-on-surface/80 hover:text-heading"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          All regions
        </button>
        {tourButton}
      </div>

      {touring && (
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {regions.map((region, step) => (
            <span
              key={region.id}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                step <= index ? "bg-[var(--region-color)]" : "bg-on-surface/12"
              }`}
            />
          ))}
        </div>
      )}

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--region-color)]">
          {selected.eyebrow}
        </p>
        <h3 className="mt-2 font-headline text-[clamp(2.25rem,3.4vw,3rem)] leading-none text-heading">
          {selected.name}
        </h3>
        <p className="mt-3 font-serif-alt text-base italic leading-relaxed text-on-surface/85">
          {selected.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {selected.products.map((specialty) => (
            <span
              key={specialty}
              className="rounded-full border border-on-surface/12 bg-white/60 px-3 py-1 text-xs font-semibold text-on-surface/80"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {products.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-heading">Related products</h4>
          <ul className="mt-3 grid grid-cols-2 gap-2.5">
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/product/${product.id}`}
                  className="group block h-full bg-surface ring-1 ring-on-surface/10 transition-shadow hover:shadow-[0_12px_24px_-14px_rgba(42,31,22,0.5)]"
                >
                  <span
                    className="flex aspect-[2/1] items-center justify-center p-2"
                    style={{
                      backgroundColor: getCategoryAccent(product.categoryId).soft,
                    }}
                  >
                    <img
                      {...getResponsiveImageProps(product.image, "160px")}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:-translate-y-1"
                    />
                  </span>
                  <span className="block px-3 py-2 text-[13px] leading-snug text-heading line-clamp-1 group-hover:text-burnt-terracotta">
                    {product.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {collections.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {collections.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group inline-flex min-h-10 items-center gap-1.5 border border-on-surface/20 px-3.5 text-sm font-semibold text-heading transition-colors hover:border-[var(--region-color)] hover:text-[var(--region-color)]"
            >
              Shop {category.name}
              <ChevronRight
                size={15}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-on-surface/12 pt-3">
        {previous ? (
          <button
            type="button"
            onClick={() => onSelect(previous)}
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-on-surface/80 hover:text-heading"
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-0.5"
            />
            {previous.name}
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button
            type="button"
            onClick={() => onSelect(next)}
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-on-surface/80 hover:text-heading"
          >
            {next.name}
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        )}
      </div>
    </div>
  );
}
