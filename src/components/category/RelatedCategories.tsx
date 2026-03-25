import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Category } from "../../data/products";
import { useMemo } from "react";

interface RelatedCategoriesProps {
  currentCategoryId: string;
  allCategories: Category[];
}

export default function RelatedCategories({ currentCategoryId, allCategories }: RelatedCategoriesProps) {
  const relatedCategories = useMemo(() => {
    const others = allCategories.filter((c) => c.id !== currentCategoryId);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [currentCategoryId, allCategories]);

  if (relatedCategories.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-10 bg-earth-dark relative">
      <div className="absolute inset-0 sketch-overlay opacity-[0.03] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl md:text-5xl text-heading italic mb-6">
            Explore More Collections
          </h2>
          <div className="flex justify-center items-center gap-4">
            <div className="w-16 h-px bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-16 h-px bg-primary/30" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(idx * 0.08, 0.5), duration: 0.5 }}
            >
              <Link
                to={`/category/${cat.slug}`}
                className="block group relative overflow-hidden aspect-[16/9] stone-texture border border-on-surface/8"
              >
                {cat.heroImage ? (
                  <img
                    src={cat.heroImage}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#e0d0c0] via-[#d4bfad] to-[#f0e2d4] opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-headline text-2xl text-white group-hover:text-primary transition-colors mb-1">
                    {cat.name}
                  </h3>
                  <p className="font-serif-alt italic text-white/70 text-sm">
                    {cat.tagline}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-4 wood-grain" />
    </section>
  );
}
