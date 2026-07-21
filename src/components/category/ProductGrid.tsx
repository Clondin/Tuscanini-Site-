import { Product } from "../../data/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="py-14 md:py-18 px-6 md:px-10 bg-aged-cream relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-12 flex items-end justify-between gap-4">
          <div>
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
              Explore the Collection
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-heading">
              {products.length === 1 ? "Product" : "Products"}
            </h2>
          </div>
          <span className="text-on-surface/65 text-sm font-body">
            {products.length} {products.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
