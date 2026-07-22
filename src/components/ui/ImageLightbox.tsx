import type { TouchEvent as ReactTouchEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useModalDialog } from "../../hooks/useModalDialog";

interface ImageLightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLDivElement>(null);
  const lastDistance = useRef(0);
  const handleClose = useCallback(() => {
    setScale(1);
    onClose();
  }, [onClose]);
  const dialogRef = useModalDialog<HTMLDivElement>({ isOpen, onClose: handleClose, inertAppRoot: true });

  const getDistance = (touches: ReactTouchEvent<HTMLDivElement>["touches"]) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: ReactTouchEvent) => {
    if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches);
    }
  };

  const handleTouchMove = (e: ReactTouchEvent) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches);
      if (lastDistance.current > 0) {
        const delta = dist / lastDistance.current;
        setScale((prev) => Math.min(Math.max(prev * delta, 1), 4));
      }
      lastDistance.current = dist;
    }
  };

  const handleTouchEnd = () => {
    lastDistance.current = 0;
  };

  const handleDoubleClick = () => {
    setScale((prev) => (prev > 1 ? 1 : 2.5));
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded image: ${alt}`}
          tabIndex={-1}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-heading/90"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 z-20 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image */}
          <motion.div
            ref={imageRef}
            className="relative z-10 max-w-[90vw] max-h-[90vh] select-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ touchAction: "none" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
          >
            <img
              src={src}
              alt={alt}
              decoding="async"
              className="max-w-full max-h-[90vh] object-contain transition-transform duration-200 ease-out"
              style={{ transform: `scale(${scale})` }}
              draggable={false}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
