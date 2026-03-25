import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Package, MapPin, Expand } from "lucide-react";
import { Product } from "../../data/products";
import TrustBadges from "./TrustBadges";
import ImageWithSkeleton from "../ui/ImageWithSkeleton";
import ImageLightbox from "../ui/ImageLightbox";

interface ProductHeroProps {
  product: Product;
  categoryName: string;
  categorySlug: string;
}

export default function ProductHero({ product, categoryName, categorySlug }: ProductHeroProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section className="px-6 md:px-10 pb-24 pt-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="still-life-frame"
        >
          <div
            className="aspect-square overflow-hidden bg-surface relative group cursor-zoom-in"
            onClick={() => product.image && setLightboxOpen(true)}
          >
            {product.image ? (
              <>
                <ImageWithSkeleton
                  src={product.image}
                  alt={product.name}
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
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#e0d0c0] via-[#d4bfad] to-[#f0e2d4] p-8">
                <span className="font-headline text-3xl text-heading/30 text-center">{product.name}</span>
                <span className="text-primary/40 text-xs uppercase tracking-[0.3em] mt-3">Image Coming Soon</span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="space-y-8"
        >
          <Link
            to={`/category/${categorySlug}`}
            className="inline-flex items-center gap-2 text-on-surface/50 hover:text-primary transition-colors text-xs font-body uppercase tracking-widest"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to {categoryName}
          </Link>

          <div>
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
              {categoryName}
            </span>
            <h1 className="font-headline text-4xl md:text-5xl text-heading leading-tight mb-6">
              {product.name}
            </h1>
            <p className="text-on-surface/70 text-lg leading-relaxed font-light">
              {product.description}
            </p>
          </div>

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

          <TrustBadges madeInItaly={product.madeInItaly} kosher={product.kosher} />

          <motion.a
            href="https://tuscaninifoods.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white font-body uppercase tracking-[0.2em] text-xs hover:bg-primary/85 transition-colors shadow-lg shadow-primary/20 mt-4 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            Where to Buy
          </motion.a>
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
