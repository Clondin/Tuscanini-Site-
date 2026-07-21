import type { RefObject } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState } from "react";

interface MapTooltipProps {
  key?: string;
  region: string;
  products: string[];
  description: string;
  x: number;
  y: number;
  visible: boolean;
  containerRef: RefObject<HTMLElement | null>;
}

export default function MapTooltip({
  region,
  products,
  description,
  x,
  y,
  visible,
  containerRef,
}: MapTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: x, top: y });

  useEffect(() => {
    if (!visible || !tooltipRef.current || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();

    let left = x;
    let top = y - tooltip.height - 12;

    // If tooltip overflows right
    if (left + tooltip.width / 2 > container.width) {
      left = container.width - tooltip.width / 2 - 8;
    }
    // If tooltip overflows left
    if (left - tooltip.width / 2 < 0) {
      left = tooltip.width / 2 + 8;
    }
    // If tooltip overflows top, show below pin
    if (top < 0) {
      top = y + 20;
    }

    setPosition({ left, top });
  }, [visible, x, y, containerRef]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.85, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute z-30 pointer-events-none -translate-x-1/2"
          style={{ left: position.left, top: position.top }}
        >
          <div className="bg-earth-dark/95 backdrop-blur-sm border border-on-surface/10 rounded-lg shadow-xl px-4 py-3 min-w-[200px] max-w-[260px]">
            <h4 className="font-headline text-heading text-base font-bold mb-1">
              {region}
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {products.map((product) => (
                <span
                  key={product}
                  className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full"
                >
                  {product}
                </span>
              ))}
            </div>
            <p className="text-on-surface/60 text-xs leading-relaxed italic font-serif-alt">
              {description}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
