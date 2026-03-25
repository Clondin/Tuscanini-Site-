import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function BeveragesBanner() {
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
          src="/assets/ads/beverages-wide.jpg"
          alt="Tuscanini Sparkling Beverages"
          className="w-full h-[130%] object-cover scale-105"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-l from-dark/75 via-dark/30 to-transparent" />
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="absolute inset-0 flex flex-col justify-center items-end px-10 md:px-24"
      >
        <div className="max-w-md text-right">
          <span className="text-gold font-bold tracking-[0.3em] text-[10px] uppercase mb-3 block">
            Sparkling &amp; Refreshing
          </span>
          <h2 className="font-headline text-4xl md:text-6xl text-white leading-tight mb-3">
            Real. Organic. Refreshing.
          </h2>
          <p className="font-script italic text-xl text-white/70 mb-6">Saluti!</p>
          <Link
            to="/category/beverages"
            className="inline-flex items-center gap-3 px-7 py-3 bg-gold text-dark font-body font-semibold uppercase tracking-widest text-xs rounded-sm hover:bg-gold-light transition-colors"
          >
            Explore Beverages
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
