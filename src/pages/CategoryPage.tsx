import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { getCategoryBySlug, categories } from "../data/products";
import { ChevronRight, ShieldCheck, Award } from "lucide-react";
import { useMemo } from "react";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;

  const relatedCategories = useMemo(() => {
    if (!category) return [];
    const others = categories.filter((c) => c.id !== category.id);
    // Shuffle and take max 6
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [category]);

  if (!category) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="text-center still-life-frame max-w-md mx-auto py-16 px-10">
          <h1 className="font-headline text-4xl text-primary mb-4">Category Not Found</h1>
          <p className="text-on-surface/60 font-body mb-8">
            The category you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-primary text-white font-body text-sm uppercase tracking-widest hover:bg-primary/80 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface selection:bg-burnt-terracotta selection:text-white">
      {/* Category Hero Banner */}
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
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link
              to="/"
              className="text-on-surface/50 hover:text-primary transition-colors font-body uppercase tracking-widest text-[10px]"
            >
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-on-surface/30" />
            <span className="text-primary font-body uppercase tracking-widest text-[10px]">
              {category.name}
            </span>
          </nav>

          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-heading mb-4 leading-tight">
            {category.name}
          </h1>
          <p className="font-serif-alt italic text-on-surface/70 text-lg md:text-2xl max-w-2xl">
            {category.tagline}
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-8 stone-texture shadow-[0_-20px_50px_rgba(0,0,0,0.06)] z-20" />
      </section>

      {/* Category Description */}
      <section className="py-20 px-6 md:px-10 bg-earth-dark relative">
        <div className="absolute inset-0 sketch-overlay opacity-[0.03] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="flex justify-center items-center gap-4 mb-10">
            <div className="w-16 h-px bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-16 h-px bg-primary/30" />
          </div>
          <p className="font-serif-alt text-on-surface/70 text-lg md:text-xl leading-relaxed italic">
            {category.description}
          </p>
          <div className="flex justify-center items-center gap-4 mt-10">
            <div className="w-16 h-px bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-16 h-px bg-primary/30" />
          </div>
        </motion.div>
      </section>

      {/* Products Grid */}
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
                {category.products.length === 1 ? "Product" : "Products"}
              </h2>
            </div>
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 border border-primary/30 text-primary font-headline text-xl self-end mb-1">
              {category.products.length}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {category.products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(idx * 0.08, 0.5), duration: 0.5 }}
                className="still-life-frame group min-h-[420px]"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden mb-5 bg-surface ring-1 ring-on-surface/10">
                    {product.image ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e0d0c0] via-[#d4bfad] to-[#f0e2d4]">
                        <span className="font-headline text-xl text-heading/40 text-center px-4">{product.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 mb-3">
                    {product.kosher && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-wider font-body">
                        <ShieldCheck className="w-3 h-3" />
                        Kosher
                      </span>
                    )}
                    {product.madeInItaly && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-wider font-body">
                        <Award className="w-3 h-3" />
                        Made in Italy
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline text-xl text-heading mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-on-surface/50 text-sm leading-relaxed font-body mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <span className="inline-flex items-center gap-2 text-primary text-[11px] uppercase tracking-[0.2em] font-body group-hover:gap-3 transition-all">
                    View Details
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Categories */}
      {relatedCategories.length > 0 && (
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
      )}
    </div>
  );
}
