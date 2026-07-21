import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Product } from "../../data/products";

interface RelatedProductsProps {
  products: Product[];
  categoryName: string;
}

export default function RelatedProducts({ products, categoryName }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-20 px-6 bg-aged-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-headline text-4xl text-heading italic mb-4">
            More from {categoryName}
          </h2>
          <div className="flex justify-center items-center gap-4">
            <div className="w-16 h-px bg-primary/30"></div>
            <div className="w-2 h-2 rounded-full bg-primary/40"></div>
            <div className="w-16 h-px bg-primary/30"></div>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
          {products.slice(0, 4).map((related, idx) => (
            <motion.div
              key={related.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(idx * 0.1, 0.3) }}
            >
              <Link
                to={`/product/${related.id}`}
                className="still-life-frame group block cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="aspect-square overflow-hidden mb-4 bg-surface ring-1 ring-on-surface/10">
                  {related.image ? (
                    <img
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000 opacity-90"
                      src={related.image}
                      alt={related.name}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#e0d0c0] via-[#d4bfad] to-[#f0e2d4] p-8">
                      <span className="font-headline text-3xl text-heading/30 text-center">{related.name}</span>
                      <span className="text-primary/40 text-xs uppercase tracking-[0.3em] mt-3">Image Coming Soon</span>
                    </div>
                  )}
                </div>
                <h3 className="font-headline text-base md:text-xl text-primary mb-2">{related.name}</h3>
                <p className="hidden sm:block text-on-surface/70 text-sm leading-relaxed line-clamp-2">
                  {related.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
