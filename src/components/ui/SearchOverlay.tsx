import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import { categories } from "../../data/products";
import { normalizeSearch, searchCatalog } from "../../lib/catalog-search";
import { useModalDialog } from "../../hooks/useModalDialog";

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);
  const dialogRef = useModalDialog<HTMLDivElement>({
    isOpen,
    onClose: close,
    initialFocusRef: inputRef,
    inertAppRoot: true,
  });
  const q = normalizeSearch(query);
  const products = q ? searchCatalog(categories, query) : [];
  const collections = q
    ? categories
        .filter((category) => normalizeSearch(category.name).includes(q))
        .slice(0, 4)
    : [];
  if (!isOpen) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[60] bg-dark/60 backdrop-blur-sm px-3 sm:px-5"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
        tabIndex={-1}
        className="w-full max-w-2xl mx-auto mt-5 sm:mt-24 bg-surface shadow-2xl max-h-[calc(100dvh-40px)] sm:max-h-[80dvh] flex flex-col"
      >
        <div className="p-5 border-b border-on-surface/20">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 id="search-title" className="font-headline text-2xl">
              Search products
            </h2>
            <button
              onClick={close}
              aria-label="Close search"
              className="h-11 w-11 flex items-center justify-center shrink-0"
            >
              <X size={21} />
            </button>
          </div>
          <label className="flex items-center gap-3 border border-on-surface/40 px-3">
            <Search size={19} aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              aria-label="Search products and categories"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pasta, olive oil, chocolate…"
              className="min-w-0 w-full bg-transparent py-3 text-base"
            />
          </label>
        </div>
        <div className="overflow-y-auto p-5">
          {!q ? (
            <>
              <p className="text-sm text-on-surface/80 mb-4">
                Search by category
              </p>
              <div className="flex flex-wrap gap-2">
                {["Pasta", "Olive oil", "Chocolate", "Frozen"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="min-h-11 px-4 border border-on-surface/25 text-sm hover:bg-aged-cream"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <Link
                to="/products?view=collections"
                onClick={close}
                className="inline-flex min-h-11 items-center gap-2 mt-5 text-olive-deep font-semibold"
              >
                Explore all collections <ArrowRight size={17} />
              </Link>
            </>
          ) : (
            <>
              <p role="status" className="text-sm text-on-surface/85 mb-4">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
                {products.some((result) => result.approximate)
                  ? " · Including close matches"
                  : ""}
              </p>
              {collections.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-olive-deep mb-2">
                    Collections
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {collections.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/category/${category.slug}`}
                        onClick={close}
                        className="inline-flex min-h-11 items-center px-3 border border-on-surface/25 text-sm"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <ul>
                {products
                  .slice(0, 6)
                  .map(({ product, category, approximate }) => (
                    <li key={product.id}>
                      <Link
                        to={`/product/${product.id}`}
                        onClick={close}
                        className="flex items-center gap-4 p-3 -mx-3 hover:bg-aged-cream border-b border-on-surface/10"
                      >
                        <img
                          src={product.image}
                          alt=""
                          className="w-14 h-16 object-contain shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-base text-heading leading-snug">
                            {product.name}
                          </p>
                          <p className="text-sm text-on-surface/80 mt-1">
                            {product.size} · {category.name}
                          </p>
                          {approximate && (
                            <span className="text-xs text-olive-deep">
                              Close match
                            </span>
                          )}
                        </div>
                        <ArrowRight
                          size={17}
                          className="ml-auto shrink-0 text-olive-deep"
                        />
                      </Link>
                    </li>
                  ))}
              </ul>
              {!products.length && (
                <div className="py-5">
                  <h3 className="font-headline text-2xl">
                    No products found for “{query}”
                  </h3>
                  <p className="text-sm mt-3">
                    Try a shorter name, or explore a collection below.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {categories.slice(0, 4).map((category) => (
                      <Link
                        key={category.slug}
                        to={`/category/${category.slug}`}
                        onClick={close}
                        className="text-sm underline min-h-11 inline-flex items-center text-olive-deep"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {q && (
          <Link
            to={`/products?q=${encodeURIComponent(query.trim())}`}
            onClick={close}
            className="flex items-center justify-between gap-3 bg-olive-deep text-white px-5 py-4 font-semibold text-sm"
          >
            View all {products.length}{" "}
            {products.length === 1 ? "result" : "results"}{" "}
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </div>,
    document.body,
  );
}
