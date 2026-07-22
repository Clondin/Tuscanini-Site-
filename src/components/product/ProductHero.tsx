import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Package, MapPin, Expand } from "lucide-react";
import { Product } from "../../data/products";
import { CategoryAccent } from "../../data/category-accents";
import TrustBadges from "./TrustBadges";
import ImageWithSkeleton from "../ui/ImageWithSkeleton";
import ImageLightbox from "../ui/ImageLightbox";

interface ProductHeroProps {
  product: Product;
  categoryName: string;
  accent: CategoryAccent;
  /** Extra content (e.g. the craft story) rendered in the scrolling column
      while the product image stays pinned alongside it. */
  children?: ReactNode;
}

export default function ProductHero({ product, categoryName, accent, children }: ProductHeroProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section className="px-6 md:px-10 pb-14 md:pb-18 pt-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="order-1 lg:col-start-2 lg:row-start-1 lg:order-none">
          <span
            className="font-bold tracking-[0.3em] text-[10px] uppercase block mb-3"
            style={{ color: accent.deep }}
          >
            {categoryName}
          </span>
          <h1 className="font-headline text-4xl text-heading leading-tight mb-4">{product.name}</h1>
          <p className="text-on-surface/70 text-base leading-relaxed font-light">{product.description}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="still-life-frame order-2 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:order-none lg:sticky lg:top-28"
        >
          <button
            type="button"
            disabled={!product.image}
            aria-label={product.image ? `Open larger image of ${product.name}` : undefined}
            className="aspect-square w-full overflow-hidden relative group cursor-zoom-in text-left disabled:cursor-default"
            style={{
              background: `radial-gradient(ellipse at 50% 42%, ${accent.soft} 0%, #faf7f2 78%)`,
            }}
            onClick={() => product.image && setLightboxOpen(true)}
          >
            {product.image ? (
              <>
                <ImageWithSkeleton
                  src={product.image}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-contain"
                  wrapperClassName="w-full h-full"
                  skeletonClassName="aspect-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-heading/10">
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-on-surface/10 text-on-surface text-xs uppercase tracking-widest font-body font-semibold shadow-lg">
                    <Expand className="w-4 h-4" />
                    View Image
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <span className="font-headline text-3xl text-heading/30 text-center">{product.name}</span>
                <span className="text-primary/40 text-xs uppercase tracking-[0.3em] mt-3">Image Coming Soon</span>
              </div>
            )}
          </button>
          <div
            aria-hidden
            className="h-0.5 mt-4 opacity-50"
            style={{
              background: `linear-gradient(to right, ${accent.accent}, transparent)`,
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="order-3 space-y-6 lg:col-start-2 lg:row-start-2 lg:order-none"
        >
          <div className="w-full h-px bg-on-surface/10"></div>

          {product.details && (
            <div
              className="border-l-2 pl-6"
              style={{ borderColor: `${accent.accent}55` }}
            >
              <p className="text-on-surface/60 leading-relaxed font-serif-alt italic">
                {product.details}
              </p>
            </div>
          )}

          {product.size && (
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" style={{ color: accent.accent }} />
              <span className="text-on-surface/40 uppercase tracking-widest text-[10px] font-bold">Size</span>
              <span className="text-on-surface/70 text-sm">{product.size}</span>
            </div>
          )}

          <TrustBadges madeInItaly={product.madeInItaly} kosher={product.kosher} />

          <motion.a
            href="https://tuscaninifoods.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex min-h-11 items-center gap-3 px-8 py-3.5 text-white font-body uppercase tracking-[0.16em] text-xs transition-opacity hover:opacity-85 shadow-lg mt-2 cursor-pointer"
            style={{ backgroundColor: accent.deep, boxShadow: `0 10px 25px -5px ${accent.deep}40` }}
          >
            <MapPin className="w-4 h-4" />
            Visit TuscaniniFoods.com
          </motion.a>

          {children}
        </motion.div>
      </div>

      {product.image && (
        <ImageLightbox
          src={product.image}
          alt={product.name}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
