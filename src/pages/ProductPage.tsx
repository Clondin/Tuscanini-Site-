import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { getProductById, getCategoryForProduct, categories } from "../data/products";
import { ChevronRight, Flag, ShieldCheck, MapPin, ArrowLeft, Package } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const category = id ? getCategoryForProduct(id) : undefined;

  if (!product || !category) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <h1 className="font-headline text-5xl text-heading mb-6">Product Not Found</h1>
          <p className="text-on-surface/60 mb-10 font-body text-lg">
            We couldn't find the product you're looking for. It may have been removed or the link is incorrect.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-body uppercase tracking-widest text-xs hover:bg-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const relatedProducts = category.products.filter((p) => p.id !== product.id);

  return (
    <div className="min-h-screen bg-surface">
      {/* Breadcrumb */}
      <div className="pt-28 pb-4 px-6 md:px-10 max-w-7xl mx-auto">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-xs font-body uppercase tracking-widest"
        >
          <Link to="/" className="text-on-surface/50 hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-on-surface/30" />
          <Link
            to={`/category/${category.slug}`}
            className="text-on-surface/50 hover:text-primary transition-colors"
          >
            {category.name}
          </Link>
          <ChevronRight className="w-3 h-3 text-on-surface/30" />
          <span className="text-primary">{product.name}</span>
        </motion.nav>
      </div>

      {/* Product Hero */}
      <section className="px-6 md:px-10 pb-24 pt-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="still-life-frame"
          >
            <div className="aspect-square overflow-hidden bg-surface">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#e0d0c0] via-[#d4bfad] to-[#f0e2d4] p-8">
                  <span className="font-headline text-3xl text-heading/30 text-center">{product.name}</span>
                  <span className="text-primary/40 text-xs uppercase tracking-[0.3em] mt-3">Image Coming Soon</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="space-y-8"
          >
            {/* Back to Category Link */}
            <Link
              to={`/category/${category.slug}`}
              className="inline-flex items-center gap-2 text-on-surface/50 hover:text-primary transition-colors text-xs font-body uppercase tracking-widest"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to {category.name}
            </Link>

            <div>
              <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
                {category.name}
              </span>
              <h1 className="font-headline text-4xl md:text-5xl text-heading leading-tight mb-6">
                {product.name}
              </h1>
              <p className="text-on-surface/70 text-lg leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Divider between description and details */}
            <div className="w-full h-px bg-on-surface/10"></div>

            {product.details && (
              <div className="border-l-2 border-primary/30 pl-6">
                <p className="text-on-surface/60 leading-relaxed font-serif-alt italic">
                  {product.details}
                </p>
              </div>
            )}

            {product.size && (
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-primary/60" />
                <span className="text-on-surface/40 uppercase tracking-widest text-[10px] font-bold">Size</span>
                <span className="text-on-surface/70 text-sm">{product.size}</span>
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              {product.madeInItaly && (
                <div className="flex items-center gap-3 px-5 py-3 border border-primary/20 bg-earth-dark/50">
                  <Flag className="w-5 h-5 text-primary" />
                  <span className="text-on-surface/70 text-xs uppercase tracking-widest font-bold">Made in Italy</span>
                </div>
              )}
              {product.kosher && (
                <div className="flex items-center gap-3 px-5 py-3 border border-primary/20 bg-earth-dark/50">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="text-on-surface/70 text-xs uppercase tracking-widest font-bold">Certified Kosher</span>
                </div>
              )}
            </div>

            {/* Where to Buy Button */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white font-body uppercase tracking-[0.2em] text-xs hover:bg-primary/85 transition-colors shadow-lg shadow-primary/20 mt-4 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              Where to Buy
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Product Story Section */}
      <section className="py-28 bg-earth-dark relative overflow-hidden">
        <div className="absolute inset-0 sketch-overlay opacity-[0.03]"></div>
        <div className="max-w-3xl mx-auto px-6 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
              The Craft
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-heading italic mb-4">
              A Story of Italian Mastery
            </h2>
            <div className="flex justify-center items-center gap-4 mt-6 mb-12">
              <div className="w-16 h-px bg-primary/30"></div>
              <div className="w-2 h-2 rounded-full bg-primary/40"></div>
              <div className="w-16 h-px bg-primary/30"></div>
            </div>
            <p className="text-on-surface/70 text-lg leading-relaxed font-light">
              Our {product.name} is crafted by generations of Italian artisans who share a reverence for authenticity.
              From sun-drenched fields to meticulous production, every step honors the belief that the finest
              ingredients need only the simplest preparations. When you choose Tuscanini, you choose to preserve
              the soul of the Italian kitchen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-28 px-6 bg-aged-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-headline text-4xl text-heading italic mb-4">
                More from {category.name}
              </h2>
              <div className="flex justify-center items-center gap-4">
                <div className="w-16 h-px bg-primary/30"></div>
                <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                <div className="w-16 h-px bg-primary/30"></div>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {relatedProducts.slice(0, 3).map((related, idx) => (
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
                    <div className="aspect-square overflow-hidden mb-6 bg-surface ring-1 ring-on-surface/10">
                      {related.image ? (
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90"
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
                    <h3 className="font-headline text-xl text-primary mb-2">{related.name}</h3>
                    <p className="text-on-surface/60 text-sm leading-relaxed line-clamp-2">
                      {related.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
