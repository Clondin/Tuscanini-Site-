import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function BrandBanner() {
  return (
    <section className="relative h-[50vh] min-h-[320px] overflow-hidden">
      <img
        src="/assets/ads/tomato-group-tuscanini-web.jpg"
        alt="Tuscanini Tomato Products"
        className="w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="absolute inset-0 flex flex-col justify-center px-10 md:px-24 max-w-3xl"
      >
        <span className="text-white/70 font-bold tracking-[0.3em] text-[10px] uppercase mb-3">
          Made in Italy
        </span>
        <h2 className="font-headline text-4xl md:text-6xl text-white leading-tight mb-6">
          Sun-Ripened. Slow-Cooked. Authentically Italian.
        </h2>
        <Link
          to="/category/sauces-tomatoes"
          className="inline-flex items-center gap-3 px-7 py-3 bg-primary text-white font-body font-semibold uppercase tracking-widest text-xs rounded-sm hover:bg-primary/90 transition-colors w-fit"
        >
          Shop Tomato Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}
