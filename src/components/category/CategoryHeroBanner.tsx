import { motion } from "motion/react";
import { Category } from "../../data/products";
import CategoryBreadcrumbs from "./CategoryBreadcrumbs";

interface CategoryHeroBannerProps {
  category: Category;
}

export default function CategoryHeroBanner({ category }: CategoryHeroBannerProps) {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        {category.heroImage ? (
          <img
            alt={category.name}
            className="w-full h-full object-cover scale-105"
            src={category.heroImage}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#e0d0c0] via-[#d4bfad] to-[#f0e2d4]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/30 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-16"
      >
        <CategoryBreadcrumbs categoryName={category.name} />

        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-heading mb-4 leading-tight">
          {category.name}
        </h1>
        <p className="font-serif-alt italic text-on-surface/70 text-lg md:text-2xl max-w-2xl">
          {category.tagline}
        </p>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-8 stone-texture shadow-[0_-20px_50px_rgba(0,0,0,0.06)] z-20" />
    </section>
  );
}
