import type { MouseEvent as ReactMouseEvent } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight, ShieldCheck, Award } from "lucide-react";
import { Product } from "../../data/products";
import TiltCard from "../ui/TiltCard";
import ImageWithSkeleton from "../ui/ImageWithSkeleton";
import QuickViewButton from "../ui/QuickViewButton";
import QuickViewModal from "../ui/QuickViewModal";

interface ProductCardProps {
  key?: string;
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);

  const handleQuickView = (e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: Math.min(index * 0.08, 0.5), duration: 0.5 }}
        className="still-life-frame group min-h-[420px]"
      >
        <TiltCard>
        <Link to={`/product/${product.id}`} className="block">
          <div className="aspect-[4/3] overflow-hidden mb-5 bg-surface ring-1 ring-on-surface/10 relative">
            {product.image ? (
              <ImageWithSkeleton
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                wrapperClassName="w-full h-full"
                skeletonClassName="aspect-auto"
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e0d0c0] via-[#d4bfad] to-[#f0e2d4]">
                <span className="font-headline text-xl text-heading/40 text-center px-4">{product.name}</span>
              </div>
            )}
            <QuickViewButton onClick={handleQuickView} />
          </div>

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
        </TiltCard>
      </motion.div>

      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}
