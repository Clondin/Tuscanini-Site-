import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import { Search, Grid2X2, Columns3, X } from "lucide-react";
import type { Category } from "../../data/products";
import {
  isFrozenProduct,
  isGlutenFreeProduct,
  searchCatalog,
} from "../../lib/catalog-search";
import CatalogCard from "./CatalogCard";
import CategoryShelf from "./CategoryShelf";

export default function CatalogBrowser({
  categories,
  category,
}: {
  categories: Category[];
  category?: Category;
}) {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get("q") || "";
  const selectedCategory = params.get("category") || "";
  const format = params.get("format") || "";
  const glutenFree = params.get("diet") === "gluten-free";
  const sort = params.get("sort") || "featured";
  const shelf = Boolean(category && params.get("view") === "shelf");
  const update = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next, { replace: true });
  };
  const base = category ? [category] : categories;
  const results = searchCatalog(base, query).filter(
    (result) =>
      (!selectedCategory ||
        category ||
        result.category.slug === selectedCategory) &&
      (!format ||
        (format === "frozen"
          ? isFrozenProduct(result.product)
          : !isFrozenProduct(result.product))) &&
      (!glutenFree || isGlutenFreeProduct(result.product)),
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
  const approximate = results.some((result) => result.approximate);
  const selectClass =
    "min-h-11 border border-on-surface/25 bg-surface px-3 py-2 text-sm text-heading w-full";

  return (
    <div>
      <div className="border-y border-on-surface/20 bg-surface p-4 mb-5">
        <div className="grid gap-4 md:grid-cols-[minmax(220px,1fr)_2fr]">
          <label className="block">
            <span className="block text-xs font-semibold text-on-surface mb-2">
              Search {category ? "this collection" : "products"}
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
            {!category && (
              <label className="flex-1 min-w-[160px]">
                <span className="block text-xs font-semibold mb-2">
                  Collection
                </span>
                <select
                  className={selectClass}
                  value={selectedCategory}
                  onChange={(event) => update("category", event.target.value)}
                >
                  <option value="">All collections</option>
                  {categories.map((entry) => (
                    <option key={entry.slug} value={entry.slug}>
                      {entry.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
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
                setParams(shelf ? { view: "shelf" } : {}, { replace: true })
              }
              className="inline-flex items-center gap-2 min-h-11 text-sm underline underline-offset-4"
            >
              <X size={15} />
              Clear filters
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <p role="status" className="text-sm text-on-surface/85">
          {results.length} {results.length === 1 ? "product" : "products"}
          {query && <> for “{query}”</>}
          {approximate && " · Includes close matches"}
        </p>
        {category && (
          <div
            className="flex border border-on-surface/25"
            aria-label="Product view"
          >
            <button
              aria-pressed={!shelf}
              onClick={() => update("view", "")}
              className={`inline-flex items-center gap-2 px-4 min-h-11 text-sm ${!shelf ? "bg-olive-deep text-white" : ""}`}
            >
              <Grid2X2 size={16} />
              Grid
            </button>
            <button
              aria-pressed={shelf}
              onClick={() => update("view", "shelf")}
              className={`inline-flex items-center gap-2 px-4 min-h-11 text-sm ${shelf ? "bg-olive-deep text-white" : ""}`}
            >
              <Columns3 size={16} />
              Shelf
            </button>
          </div>
        )}
      </div>
      {results.length ? (
        shelf && category ? (
          <CategoryShelf
            key={results.map((result) => result.product.id).join(",")}
            category={{
              ...category,
              products: results.map((result) => result.product),
            }}
            compact
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {results.map(({ product }) => (
              <CatalogCard key={product.id} product={product} />
            ))}
          </div>
        )
      ) : (
        <div className="border border-on-surface/20 bg-surface py-14 px-6 text-center">
          <h2 className="font-headline text-3xl">No products match just yet</h2>
          <p className="mt-3 text-on-surface/80">
            Try a shorter name or clear a filter to see more.
          </p>
          <Link
            to="/products?view=collections"
            className="inline-flex min-h-11 items-center mt-5 text-olive-deep font-semibold underline underline-offset-4"
          >
            Explore all collections
          </Link>
        </div>
      )}
    </div>
  );
}
