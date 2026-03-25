import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Package, ShieldCheck, Award, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../data/products";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape]);

  return createPortal(
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-heading/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal content */}
          <motion.div
            className="relative z-10 bg-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-on-surface/10 shadow-2xl
                       md:rounded-sm"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-on-surface/10 rounded-full text-on-surface/60 hover:text-on-surface hover:bg-white transition-colors"
              aria-label="Close quick view"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="aspect-square md:aspect-auto md:min-h-[400px] overflow-hidden bg-earth-dark">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e0d0c0] via-[#d4bfad] to-[#f0e2d4]">
                    <span className="font-headline text-2xl text-heading/30 text-center px-4">
                      {product.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-8 md:p-10 flex flex-col">
                <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-3">
                  Quick View
                </span>

                <h2 className="font-headline text-3xl md:text-4xl text-heading leading-tight mb-4">
                  {product.name}
                </h2>

                <p className="text-on-surface/70 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>

                {product.details && (
                  <div className="border-l-2 border-primary/30 pl-5 mb-6">
                    <p className="text-on-surface/55 text-sm leading-relaxed font-serif-alt italic">
                      {product.details}
                    </p>
                  </div>
                )}

                {product.size && (
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-4 h-4 text-primary/60" />
                    <span className="text-on-surface/40 uppercase tracking-widest text-[10px] font-bold">
                      Size
                    </span>
                    <span className="text-on-surface/70 text-sm">{product.size}</span>
                  </div>
                )}

                {product.ingredients && (
                  <div className="mb-4">
                    <span className="text-on-surface/40 uppercase tracking-widest text-[10px] font-bold block mb-1">
                      Ingredients
                    </span>
                    <p className="text-on-surface/60 text-xs leading-relaxed">
                      {product.ingredients}
                    </p>
                  </div>
                )}

                {/* Badges */}
                <div className="flex gap-2 mb-6">
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

                {/* Spacer to push link to bottom */}
                <div className="flex-1" />

                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-body uppercase tracking-[0.2em] text-xs hover:bg-primary/85 transition-colors shadow-lg shadow-primary/20 text-center justify-center"
                >
                  View Full Details
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
