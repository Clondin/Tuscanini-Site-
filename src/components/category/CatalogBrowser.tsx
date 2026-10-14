import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Category } from "../../data/products";
import {
  isFrozenProduct,
  isGlutenFreeProduct,
  searchCatalog,
} from "../../lib/catalog-search";
import { isMissingProductImage } from "../../lib/productImage";
import CatalogCard from "./CatalogCard";

/** Cards revealed per step, so the full catalog is not one endless wall. */
export const CATALOG_PAGE_SIZE = 24;

/** The all-products browser: search, collection chips, filters, and paging. */
export default function CatalogBrowser({
  categories,
}: {
  categories: Category[];
}) {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get("q") || "";
  const selectedCategory = params.get("category") || "";
  const format = params.get("format") || "";
  const glutenFree = params.get("diet") === "gluten-free";
  const sort = params.get("sort") || "featured";
  const update = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next, { replace: true });
  };
  const base = categories;
  // Cards without a photo are not rendered, so they must not be counted either.
  const matches = searchCatalog(base, query).filter(
    (result) =>
      !isMissingProductImage(result.product.image) &&
      (!format ||
        (format === "frozen"
          ? isFrozenProduct(result.product)
          : !isFrozenProduct(result.product))) &&
      (!glutenFree || isGlutenFreeProduct(result.product)),
  );
  const matchedCollections = new Set(
    matches.map((result) => result.category.slug),
  );
  const results = matches.filter(
    (result) =>
      !selectedCategory || result.category.slug === selectedCategory,
  );
  if (sort === "az")
    results.sort((a, b) => a.product.name.localeCompare(b.product.name));
  if (sort === "za")
    results.sort((a, b) => b.product.name.localeCompare(a.product.name));
  const hasFrozen = base.some((entry) => entry.products.some(isFrozenProduct));
  const hasGlutenFree = base.some((entry) =>
    entry.products.some(isGlutenFreeProduct),
  );
  const filtered = Boolean(query || selectedCategory || format || glutenFree);

  // Reveal the grid in steps. Any change to the filters starts over at one page.
  const revealKey = [query, selectedCategory, format, glutenFree, sort].join("|");
  const [reveal, setReveal] = useState({ key: revealKey, count: CATALOG_PAGE_SIZE });
  const limit = reveal.key === revealKey ? reveal.count : CATALOG_PAGE_SIZE;
  const grid = useRef<HTMLDivElement>(null);
  const focusIndex = useRef<number | null>(null);
  useEffect(() => {
    if (focusIndex.current === null) return;
    const card = grid.current?.children[focusIndex.current];
    focusIndex.current = null;
    if (card instanceof HTMLElement) card.focus({ preventScroll: true });
  }, [limit]);
  const showMore = () => {
    focusIndex.current = limit;
    setReveal({ key: revealKey, count: limit + CATALOG_PAGE_SIZE });
  };
  const remaining = Math.max(results.length - limit, 0);
  const chips = categories.filter(
    (entry) =>
      matchedCollections.has(entry.slug) || entry.slug === selectedCategory,
  );
  const chipClass = (active: boolean) =>
    `shrink-0 snap-start inline-flex items-center gap-2 min-h-11 px-4 border text-sm whitespace-nowrap transition-colors ${
      active
        ? "bg-olive-deep border-olive-deep text-white"
        : "bg-surface border-on-surface/20 text-heading hover:border-olive-accent"
    }`;
  const approximate = results.some((result) => result.approximate);
  const selectClass =
    "min-h-11 border border-on-surface/25 bg-surface px-3 py-2 text-sm text-heading w-full";

  return (
    <div>
      <div className="border-y border-on-surface/20 bg-surface p-4 mb-5">
        <div className="grid gap-4 md:grid-cols-[minmax(220px,1fr)_2fr]">
          <label className="block">
            <span className="block text-xs font-semibold text-on-surface mb-2">
              Search products
            </span>
            <span className="flex items-center gap-2 border border-on-surface/25 px-3 min-h-11">
              <Search size={18} aria-hidden="true" />
              <input
                className="w-full min-w-0 py-2 bg-transparent text-sm"
                type="search"
                value={query}
                onChange={(event) => update("q", event.target.value)}
                placeholder="Try pasta, olives, or pistachio"
              />
            </span>
          </label>
          <button
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
            aria-controls="catalog-filters"
            className="md:hidden min-h-11 border border-on-surface/25 px-4 text-sm text-olive-deep font-semibold"
          >
            Filters & sort
            {selectedCategory || format || glutenFree ? " · Active" : ""}
          </button>
          <div
            id="catalog-filters"
            className={`${filtersOpen ? "flex" : "hidden"} md:flex flex-wrap items-end gap-3`}
          >
            {hasFrozen && (
              <label className="flex-1 min-w-[130px]">
                <span className="block text-xs font-semibold mb-2">
                  Storage
                </span>
                <select
                  className={selectClass}
                  value={format}
                  onChange={(event) => update("format", event.target.value)}
                >
                  <option value="">All products</option>
                  <option value="frozen">Frozen</option>
                  <option value="other">Other products</option>
                </select>
              </label>
            )}
            <label className="flex-1 min-w-[140px]">
              <span className="block text-xs font-semibold mb-2">Sort by</span>
              <select
                className={selectClass}
                value={sort}
                onChange={(event) => update("sort", event.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="az">Name: A–Z</option>
                <option value="za">Name: Z–A</option>
              </select>
            </label>
          </div>
        </div>
        <div
          className={`${filtersOpen || filtered ? "flex" : "hidden"} md:flex flex-wrap items-center gap-4 mt-2`}
        >
          {hasGlutenFree && (
            <label className="inline-flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={glutenFree}
                onChange={(event) =>
                  update("diet", event.target.checked ? "gluten-free" : "")
                }
                className="accent-olive-accent w-4 h-4"
              />
              Gluten-free
            </label>
          )}
          {filtered && (
            <button
              onClick={() =>
                setParams({}, { replace: true })
              }
              className="inline-flex items-center gap-2 min-h-11 text-sm underline underline-offset-4"
            >
              <X size={15} />
              Clear filters
            </button>
          )}
        </div>
      </div>
      <div
          role="group"
          aria-label="Filter by collection"
          className="-mx-5 md:mx-0 mb-6 flex gap-2 overflow-x-auto snap-x scroll-px-5 md:scroll-px-0 px-5 md:px-0 pb-2 md:[mask-image:linear-gradient(to_right,black_calc(100%-48px),transparent)]"
        >
          <button
            type="button"
            aria-pressed={!selectedCategory}
            onClick={() => update("category", "")}
            className={chipClass(!selectedCategory)}
          >
            All
          </button>
          {chips.map((entry) => {
            const active = entry.slug === selectedCategory;
            return (
              <button
                key={entry.slug}
                type="button"
                aria-pressed={active}
                onClick={() => update("category", active ? "" : entry.slug)}
                className={chipClass(active)}
              >
                {entry.name}
              </button>
            );
          })}
        </div>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <p role="status" className="text-sm text-on-surface/85">
          {results.length} {results.length === 1 ? "product" : "products"}
          {query && <> for “{query}”</>}
          {approximate && " · Includes close matches"}
        </p>
      </div>
      {results.length ? (
          <>
            <div
              ref={grid}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
              {results.slice(0, limit).map(({ product }) => (
                <CatalogCard key={product.id} product={product} />
              ))}
            </div>
            {remaining > 0 && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={showMore}
                  className="min-h-12 px-8 border border-olive-deep text-olive-deep text-sm font-semibold hover:bg-olive-deep hover:text-white transition-colors"
                >
                  Show more products
                </button>
              </div>
            )}
          </>
      ) : (
        <div className="border border-on-surface/20 bg-surface py-14 px-6 text-center">
          <h2 className="font-headline text-3xl">No products found</h2>
          <p className="mt-3 text-on-surface/80">
            Try another search or clear your filters.
          </p>
          <Link
            to="/products?view=collections"
            className="inline-flex min-h-11 items-center mt-5 text-olive-deep font-semibold underline underline-offset-4"
          >
            Browse all collections
          </Link>
        </div>
      )}
    </div>
  );
}
