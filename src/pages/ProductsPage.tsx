import { Link, useSearchParams } from "react-router-dom";
import { categories } from "../data/products";
import CatalogBrowser from "../components/category/CatalogBrowser";
import CollectionCards from "../components/category/CollectionCards";

export default function ProductsPage() {
  const [params] = useSearchParams();
  const collections = params.get("view") === "collections";
  return (
    <div className="bg-aged-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-9 pb-16">
        <p className="text-xs uppercase tracking-[0.18em] text-olive-deep mb-4">
          The Tuscanini pantry
        </p>
        <h1 className="font-headline text-4xl md:text-6xl text-heading">
          Good food starts here.
        </h1>
        <p className="max-w-xl mt-5 text-on-surface/85 leading-relaxed">
          Find a familiar favorite or something new for your table. Explore our
          pasta, pantry staples, drinks, and more.
        </p>
        <nav
          aria-label="Browse the catalog"
          className="flex gap-7 mt-8 mb-7 border-b border-on-surface/20"
        >
          <Link
            aria-current={!collections ? "page" : undefined}
            className={`pb-4 text-sm font-semibold border-b-2 ${!collections ? "border-olive-deep text-olive-deep" : "border-transparent"}`}
            to="/products"
          >
            All products
          </Link>
          <Link
            aria-current={collections ? "page" : undefined}
            className={`pb-4 text-sm font-semibold border-b-2 ${collections ? "border-olive-deep text-olive-deep" : "border-transparent"}`}
            to="/products?view=collections"
          >
            All {categories.length} collections
          </Link>
        </nav>
        {collections ? (
          <CollectionCards categories={categories} />
        ) : (
          <CatalogBrowser categories={categories} />
        )}
      </div>
    </div>
  );
}
