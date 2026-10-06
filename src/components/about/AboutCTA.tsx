import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import MagneticButton from "../ui/MagneticButton";
import { getResponsiveImageProps } from "../../lib/productImage";

export default function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-dark py-24 md:py-[120px] px-6 md:px-10">
      <img
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        {...getResponsiveImageProps("/assets/Photos/backgrounds/italian-coast.jpg", "100vw")}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/70 to-dark/95" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-[820px] mx-auto text-center"
      >
        <h2 className="mb-5 font-headline font-normal text-italia-white text-[clamp(2.25rem,4.6vw,3.625rem)] leading-[1.1]">
          Taste the Tradition
        </h2>
        <p className="mx-auto mb-10 max-w-[600px] font-serif-alt italic text-xl leading-[1.65] text-italia-white/70">
          From our family to yours &mdash; discover the full range of authentic Italian products
          crafted with generations of expertise.
        </p>
        <MagneticButton className="inline-block">
          <Link
            to="/#collections"
            className="inline-flex items-center gap-3 px-10 py-[19px] bg-gold text-dark text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
          >
            Explore our collections
            <ArrowRight className="w-[15px] h-[15px]" />
          </Link>
        </MagneticButton>
        <p className="mt-14 font-script italic text-[26px] tracking-wide text-gold">
          Benvenuti alla nostra tavola.
        </p>
      </motion.div>
    </section>
  );
}
