import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function BeveragesBanner() {
  return (
    <section className="relative h-[50vh] min-h-[320px] overflow-hidden">
      <img
        src="/assets/ads/beverages-wide.jpg"
        alt="Tuscanini Sparkling Beverages"
        className="w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-black/65 via-black/20 to-transparent" />
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="absolute inset-0 flex flex-col justify-center items-end px-10 md:px-24"
      >
        <div className="max-w-md text-right">
          <span className="text-white/70 font-bold tracking-[0.3em] text-[10px] uppercase mb-3 block">
            Sparkling &amp; Refreshing
          </span>
          <h2 className="font-headline text-4xl md:text-6xl text-white leading-tight mb-6">
            Real. Organic. Refreshing.
          </h2>
          <Link
            to="/category/beverages"
            className="inline-flex items-center gap-3 px-7 py-3 bg-white text-primary font-body font-semibold uppercase tracking-widest text-xs rounded-sm hover:bg-white/90 transition-colors"
          >
            Explore Beverages
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
