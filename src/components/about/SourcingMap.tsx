import type { RefObject } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useCallback } from "react";
import MapTooltip from "./MapTooltip";

interface Region {
  id: string;
  name: string;
  products: string[];
  description: string;
  x: number;
  y: number;
}

const regions: Region[] = [
  {
    id: "piedmont",
    name: "Piedmont",
    products: ["Chocolate", "Hazelnuts", "Gelato"],
    description: "World-renowned chocolate and confectionery",
    x: 115,
    y: 115,
  },
  {
    id: "liguria",
    name: "Liguria",
    products: ["Pesto", "Herbs"],
    description: "Home of basil and pesto Genovese",
    x: 135,
    y: 150,
  },
  {
    id: "emilia-romagna",
    name: "Emilia-Romagna",
    products: ["Pasta", "Sauces", "Balsamic"],
    description: "Italy's food valley",
    x: 195,
    y: 148,
  },
  {
    id: "tuscany",
    name: "Tuscany",
    products: ["Olive Oil", "Balsamic Vinegar"],
    description: "Heart of Italian olive oil tradition",
    x: 185,
    y: 195,
  },
  {
    id: "campania",
    name: "Campania",
    products: ["Pizza Dough", "Tomato Sauce", "Pasta"],
    description: "The birthplace of pizza and rich volcanic soil tomatoes",
    x: 245,
    y: 305,
  },
  {
    id: "puglia",
    name: "Puglia",
    products: ["Olive Oil", "Crackers"],
    description: "Italy's largest olive oil producer",
    x: 300,
    y: 305,
  },
  {
    id: "sicily",
    name: "Sicily",
    products: ["Olives", "Seafood"],
    description: "Mediterranean's finest catch and ancient olive groves",
    x: 225,
    y: 420,
  },
];

// Center badge position
const CENTER_X = 200;
const CENTER_Y = 245;

// Simplified SVG outline of Italy including Sicily and Sardinia
const ITALY_PATH =
  "M 150 60 L 165 55 L 185 58 L 200 50 L 220 52 L 235 48 L 260 55 L 280 65 L 290 58 L 305 62 L 315 72 L 310 85 L 295 90 L 280 88 L 265 95 L 248 100 L 235 95 L 220 100 L 205 98 L 195 105 L 180 100 L 165 105 L 150 100 L 135 108 L 120 105 L 108 115 L 100 125 L 95 140 L 100 148 L 115 155 L 130 158 L 145 162 L 158 170 L 170 178 L 180 185 L 188 195 L 195 210 L 200 225 L 210 240 L 220 255 L 230 270 L 240 280 L 248 290 L 255 302 L 260 315 L 265 325 L 272 335 L 280 340 L 288 335 L 295 325 L 300 312 L 305 300 L 310 288 L 315 275 L 318 260 L 315 245 L 310 232 L 302 218 L 292 205 L 280 195 L 268 185 L 255 178 L 245 168 L 238 155 L 232 142 L 228 130 L 225 118 L 220 108 L 210 102 Z";

const SICILY_PATH =
  "M 195 395 L 210 388 L 228 385 L 248 388 L 265 395 L 272 405 L 268 418 L 255 428 L 238 435 L 218 438 L 200 432 L 190 420 L 188 408 Z";

const SARDINIA_PATH =
  "M 68 210 L 80 200 L 92 198 L 100 205 L 105 220 L 108 240 L 105 260 L 100 278 L 92 288 L 80 290 L 70 282 L 65 265 L 62 245 L 60 225 Z";

export default function SourcingMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(mapRef, { once: true, amount: 0.3 });
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handlePinClick = useCallback((regionId: string) => {
    setSelectedRegion((prev) => (prev === regionId ? null : regionId));
  }, []);

  const handlePinHover = useCallback((regionId: string | null) => {
    setHoveredRegion(regionId);
  }, []);

  const selectedData = regions.find((r) => r.id === selectedRegion);

  return (
    <div ref={mapRef} className="relative w-full max-w-2xl mx-auto">
      {/* Mobile bottom sheet backdrop */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setSelectedRegion(null)}
          />
        )}
      </AnimatePresence>

      <div ref={containerRef as RefObject<HTMLDivElement>} className="relative aspect-[3/4] w-full">
        <svg
          viewBox="0 0 380 480"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="italyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d4230" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#b85c38" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#8c3b24" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="italyStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3d4230" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8c3b24" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Italy mainland */}
          <motion.path
            d={ITALY_PATH}
            fill="url(#italyGradient)"
            stroke="url(#italyStroke)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Sicily */}
          <motion.path
            d={SICILY_PATH}
            fill="url(#italyGradient)"
            stroke="url(#italyStroke)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Sardinia */}
          <motion.path
            d={SARDINIA_PATH}
            fill="url(#italyGradient)"
            stroke="url(#italyStroke)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Dotted lines from pins to center badge */}
          {regions.map((region, idx) => (
            <motion.line
              key={`line-${region.id}`}
              x1={region.x}
              y1={region.y}
              x2={CENTER_X}
              y2={CENTER_Y}
              stroke="#b85c38"
              strokeWidth="0.8"
              strokeDasharray="3 4"
              strokeOpacity="0.25"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: 1.5 + idx * 0.15,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Center Tuscanini badge */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
            style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px` }}
          >
            <circle
              cx={CENTER_X}
              cy={CENTER_Y}
              r="22"
              fill="#2a1f16"
              stroke="#b85c38"
              strokeWidth="1.5"
            />
            <text
              x={CENTER_X}
              y={CENTER_Y - 3}
              textAnchor="middle"
              fill="#f5efe4"
              fontSize="6"
              fontWeight="700"
              letterSpacing="0.1em"
              fontFamily="Playfair Display, serif"
            >
              TUSCANINI
            </text>
            <text
              x={CENTER_X}
              y={CENTER_Y + 7}
              textAnchor="middle"
              fill="#b85c38"
              fontSize="4.5"
              letterSpacing="0.15em"
              fontFamily="Manrope, sans-serif"
            >
              ITALIA
            </text>
          </motion.g>

          {/* Region pins */}
          {regions.map((region, idx) => (
            <motion.g
              key={region.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                delay: 2 + idx * 0.2,
                duration: 0.4,
                type: "spring",
                stiffness: 300,
              }}
              style={{ transformOrigin: `${region.x}px ${region.y}px` }}
              className="cursor-pointer"
              onMouseEnter={() => handlePinHover(region.id)}
              onMouseLeave={() => handlePinHover(null)}
              onClick={() => handlePinClick(region.id)}
            >
              {/* Pulse ring */}
              <motion.circle
                cx={region.x}
                cy={region.y}
                r="10"
                fill="none"
                stroke="#b85c38"
                strokeWidth="1"
                animate={{
                  r: [10, 16, 10],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: idx * 0.3,
                  ease: "easeInOut",
                }}
              />
              {/* Pin dot */}
              <circle
                cx={region.x}
                cy={region.y}
                r="6"
                fill={
                  hoveredRegion === region.id || selectedRegion === region.id
                    ? "#8c3b24"
                    : "#b85c38"
                }
                stroke="#f5efe4"
                strokeWidth="1.5"
              />
              {/* Inner dot */}
              <circle
                cx={region.x}
                cy={region.y}
                r="2"
                fill="#f5efe4"
              />
            </motion.g>
          ))}
        </svg>

        {/* Desktop tooltips */}
        <div className="hidden md:block">
          {regions.map((region) => {
            // Convert SVG coords to percentage positions
            const xPercent = (region.x / 380) * 100;
            const yPercent = (region.y / 480) * 100;
            return (
              <MapTooltip
                key={`tooltip-${region.id}`}
                region={region.name}
                products={region.products}
                description={region.description}
                x={(xPercent / 100) * (containerRef.current?.clientWidth ?? 600)}
                y={(yPercent / 100) * (containerRef.current?.clientHeight ?? 800)}
                visible={hoveredRegion === region.id && selectedRegion !== region.id}
                containerRef={containerRef}
              />
            );
          })}
        </div>

        {/* Desktop expanded info card */}
        <AnimatePresence>
          {selectedData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-[105%] w-64 z-30"
            >
              <div className="bg-earth-dark border border-on-surface/10 rounded-xl shadow-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-headline text-heading text-xl font-bold">
                    {selectedData.name}
                  </h3>
                  <button
                    onClick={() => setSelectedRegion(null)}
                    className="text-on-surface/40 hover:text-on-surface transition-colors text-lg leading-none"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-on-surface/60 text-sm leading-relaxed italic font-serif-alt mb-4">
                  {selectedData.description}
                </p>
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface/40 block">
                    Products Sourced
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedData.products.map((product) => (
                      <span
                        key={product}
                        className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {selectedData && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            <div className="bg-earth-dark border-t border-on-surface/10 rounded-t-2xl shadow-2xl p-6 pb-8">
              <div className="w-10 h-1 bg-on-surface/20 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline text-heading text-2xl font-bold">
                  {selectedData.name}
                </h3>
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="text-on-surface/40 hover:text-on-surface transition-colors text-xl"
                >
                  &times;
                </button>
              </div>
              <p className="text-on-surface/60 text-sm leading-relaxed italic font-serif-alt mb-4">
                {selectedData.description}
              </p>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface/40 block">
                  Products Sourced
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedData.products.map((product) => (
                    <span
                      key={product}
                      className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
