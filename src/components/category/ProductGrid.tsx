import { motion } from "motion/react";
import { Product } from "../../data/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="py-24 px-6 md:px-10 bg-aged-cream relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex items-center gap-4"
        >
          <div>
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
              Explore the Collection
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-heading">
              {products.length === 1 ? "Product" : "Products"}
            </h2>
          </div>
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 border border-primary/30 text-primary font-headline text-xl self-end mb-1">
            {products.length}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
