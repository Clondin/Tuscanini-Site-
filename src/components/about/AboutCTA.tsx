import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import MagneticButton from "../ui/MagneticButton";

export default function AboutCTA() {
  return (
    <section className="py-48 px-8 bg-earth-dark relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-10"></div>
      <div className="absolute inset-0 z-0">
        <img
          alt="Italian Coast"
          className="w-full h-full object-cover opacity-15"
          src="/assets/Photos/backgrounds/italian-coast.jpg"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-dark via-earth-dark/80 to-earth-dark"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2 className="font-headline text-5xl md:text-6xl text-heading leading-tight mb-8">
          Taste the Tradition
        </h2>
        <p className="font-serif-alt text-on-surface/60 text-xl italic mb-12 max-w-2xl mx-auto">
          From our family to yours — discover the full range of authentic Italian products crafted with generations of expertise.
        </p>
        <MagneticButton className="inline-block">
          <Link
            to="/#collections"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-body uppercase tracking-[0.2em] text-xs hover:bg-primary/85 transition-colors shadow-lg shadow-primary/20"
          >
            Explore Our Collections
            <ArrowRight className="w-4 h-4" />
          </Link>
        </MagneticButton>
        <p className="font-serif-alt text-primary italic text-2xl tracking-wide mt-16">
          Benvenuti alla nostra tavola.
        </p>
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full h-4 wood-grain"></div>
    </section>
  );
}
