import type { ReactNode, MouseEvent as ReactMouseEvent } from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Search } from "lucide-react";
import { categories, type Category, type Product } from "../../data/products";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryResult {
  category: Category;
  matchField: "name";
}

interface ProductResult {
  product: Product;
  categorySlug: string;
  matchField: "name" | "description";
}

function highlightMatch(text: string, query: string): ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/20 text-primary rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      // Small delay to let animation start, then focus
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // Click outside to close
  const handleBackdropClick = useCallback(
    (e: ReactMouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  // Search logic
  const { categoryResults, productResults } = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return { categoryResults: [], productResults: [] };

    const catResults: CategoryResult[] = [];
    const prodNameResults: ProductResult[] = [];
    const prodDescResults: ProductResult[] = [];

    for (const cat of categories) {
      // Match category name
      if (cat.name.toLowerCase().includes(q)) {
        catResults.push({ category: cat, matchField: "name" });
      }

      // Match products
      for (const product of cat.products) {
        const nameMatch = product.name.toLowerCase().includes(q);
        const descMatch = product.description.toLowerCase().includes(q);

        if (nameMatch) {
          prodNameResults.push({
            product,
            categorySlug: cat.slug,
            matchField: "name",
          });
        } else if (descMatch) {
          prodDescResults.push({
            product,
            categorySlug: cat.slug,
            matchField: "description",
          });
        }
      }
    }

    // Sort: name matches first, then description matches
    const allProducts = [...prodNameResults, ...prodDescResults];

    return {
      categoryResults: catResults.slice(0, 5),
      productResults: allProducts.slice(0, 10),
    };
  }, [debouncedQuery]);

  const hasResults = categoryResults.length > 0 || productResults.length > 0;
  const hasQuery = debouncedQuery.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-on-surface/40 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-2xl mx-auto mt-20 sm:mt-28 bg-surface rounded-lg shadow-2xl border border-on-surface/10 overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-on-surface/10">
              <Search size={20} className="text-on-surface/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products and categories..."
                className="flex-1 bg-transparent text-on-surface text-base placeholder:text-on-surface/40 outline-none font-body"
              />
              <button
                onClick={onClose}
                className="text-on-surface/40 hover:text-on-surface transition-colors shrink-0"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {hasQuery && !hasResults && (
                <div className="px-5 py-12 text-center">
                  <p className="text-on-surface/50 text-sm font-body">
                    No results found for "{debouncedQuery}"
                  </p>
                  <p className="text-on-surface/30 text-xs mt-2 font-body">
                    Try a different search term
                  </p>
                </div>
              )}

              {!hasQuery && (
                <div className="px-5 py-12 text-center">
                  <p className="text-on-surface/40 text-sm font-body">
                    Start typing to search products and categories
                  </p>
                </div>
              )}

              {/* Category results */}
              {categoryResults.length > 0 && (
                <div className="px-5 pt-4 pb-2">
                  <h3 className="uppercase tracking-[0.2em] text-[9px] text-on-surface/40 mb-3 font-body">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categoryResults.map((result) => (
                      <Link
                        key={result.category.id}
                        to={`/category/${result.category.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-on-surface/5 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-hearth-stone shrink-0">
                          <img
                            src={result.category.heroImage}
                            alt={result.category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-on-surface font-body group-hover:text-primary transition-colors truncate">
                            {highlightMatch(result.category.name, debouncedQuery)}
                          </p>
                          <p className="text-xs text-on-surface/50 font-body truncate">
                            {result.category.tagline}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Product results */}
              {productResults.length > 0 && (
                <div className="px-5 pt-4 pb-4">
                  <h3 className="uppercase tracking-[0.2em] text-[9px] text-on-surface/40 mb-3 font-body">
                    Products
                  </h3>
                  <div className="space-y-1">
                    {productResults.map((result) => (
                      <Link
                        key={result.product.id}
                        to={`/product/${result.product.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-on-surface/5 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-hearth-stone shrink-0">
                          <img
                            src={result.product.image}
                            alt={result.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-on-surface font-body group-hover:text-primary transition-colors truncate">
                            {highlightMatch(result.product.name, debouncedQuery)}
                          </p>
                          <p className="text-xs text-on-surface/50 font-body truncate">
                            {result.matchField === "description"
                              ? highlightMatch(result.product.description, debouncedQuery)
                              : result.product.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
