import { useSearchParams } from "react-router-dom";
import { Columns3, Grid2X2 } from "lucide-react";
import type { Category } from "../../data/products";
import { isMissingProductImage } from "../../lib/productImage";
import CatalogCard from "./CatalogCard";
import CategoryShelf from "./CategoryShelf";

/**
 * A collection's products with a Shelf/Grid switch. Shelf is the default;
 * `?view=grid` keeps the grid, so existing shared links still work.
 */
export default function CategoryProducts({ category }: { category: Category }) {
  const [params, setParams] = useSearchParams();
  const grid = params.get("view") === "grid";
  const products = category.products.filter(
    (product) => !isMissingProductImage(product.image),
  );
  const setView = (view: "shelf" | "grid") => {
    const next = new URLSearchParams(params);
    if (view === "grid") next.set("view", "grid");
    else next.delete("view");
    setParams(next, { replace: true });
  };
  const option = (active: boolean) =>
    `inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
      active ? "bg-ink text-paper" : "text-ink/75 hover:text-ink"
    }`;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-on-surface/80">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
        <div
          role="group"
          aria-label="Product view"
          className="flex rounded-full border border-ink/15 bg-paper p-1"
        >
          <button
            type="button"
            aria-pressed={!grid}
            onClick={() => setView("shelf")}
            className={option(!grid)}
          >
            <Columns3 size={16} aria-hidden="true" />
            Shelf
          </button>
          <button
            type="button"
            aria-pressed={grid}
            onClick={() => setView("grid")}
            className={option(grid)}
          >
            <Grid2X2 size={16} aria-hidden="true" />
            Grid
          </button>
        </div>
      </div>
      {grid ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <CatalogCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <CategoryShelf category={category} />
      )}
    </div>
  );
}
