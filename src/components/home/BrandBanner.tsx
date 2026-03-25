import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function BrandBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section ref={sectionRef} className="relative h-[50vh] min-h-[320px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src="/assets/ads/tomato-group-tuscanini-web.jpg"
          alt="Tuscanini Tomato Products"
          className="w-full h-[130%] object-cover scale-105"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-tuscanini-red/85 via-tuscanini-red/40 to-transparent" />
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="absolute inset-0 flex flex-col justify-center px-10 md:px-24 max-w-3xl"
      >
        <span className="text-gold font-bold tracking-[0.3em] text-[10px] uppercase mb-3">
          Made in Italy
        </span>
        <h2 className="font-headline text-4xl md:text-6xl text-white leading-tight mb-3">
          Sun-Ripened. Slow-Cooked. Authentically Italian.
        </h2>
        <p className="font-script italic text-2xl text-white/80 mb-6">
          Taste Tuscanini. Know Italy.
        </p>
        <Link
          to="/category/sauces-tomatoes"
          className="inline-flex items-center gap-3 px-7 py-3 bg-gold text-dark font-body font-semibold uppercase tracking-widest text-xs rounded-sm hover:bg-gold-light transition-colors w-fit"
        >
          Shop Tomato Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}
