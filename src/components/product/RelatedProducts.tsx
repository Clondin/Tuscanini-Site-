import { Link } from "react-router-dom";
import type { Product } from "../../data/products";
import CatalogCard from "../category/CatalogCard";

export default function RelatedProducts({
  products,
  categorySlug,
  totalInCategory,
}: {
  products: Product[];
  categorySlug: string;
  totalInCategory: number;
}) {
  const visible = products.filter((product) => product.image).slice(0, 4);
  if (!visible.length) return null;
  return (
    <section className="bg-aged-cream px-5 md:px-10 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
          <h2 className="font-headline text-3xl text-heading">
            More in this collection
          </h2>
          <Link
            to={`/category/${categorySlug}`}
            className="min-h-11 inline-flex items-center text-sm font-semibold text-olive-deep underline underline-offset-4"
          >
            View all {totalInCategory} products
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {visible.map((product) => (
            <CatalogCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
