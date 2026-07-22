import type { MouseEvent } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import TextReveal from "../ui/TextReveal";
import MagneticButton from "../ui/MagneticButton";

export default function HeritageSection() {
  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  return (
    <section className="py-16 md:py-20 px-6 md:px-16 bg-earth-dark relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-5" />
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center relative z-10">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative order-2 md:order-1"
        >
          <div className="aspect-[4/5] wood-grain p-4 shadow-2xl rounded-sm transform -rotate-1 border-b-8 border-gold/30">
            <img
              alt="Italian coastal landscape overlooking the Mediterranean"
              className="w-full h-full object-cover"
              src="/assets/ads/sparkling-parallax.jpg"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gold/5 blur-3xl rounded-full" />
        </motion.div>

        <motion.div
          initial={false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="min-w-0 space-y-6 order-1 md:order-2"
        >
          <header>
            <span className="text-burnt-terracotta font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
              Our Heritage
            </span>
            <TextReveal
              text="A Legacy Born in the Tuscan Pantry"
              as="h2"
              mode="word"
              className="font-headline text-4xl md:text-5xl text-heading leading-tight"
            />
          </header>
          <div className="space-y-5 text-on-surface/75 text-base md:text-lg leading-relaxed font-light">
            <p>
              Tuscanini was founded on a singular obsession: to bottle the
              ephemeral magic of a Sunday afternoon in an Italian village. We
              believe that true luxury lies in simplicity&mdash;the peppery
              bite of first-press olive oil, the perfect snap of bronze-cut
              pasta.
            </p>
            <p className="font-script italic text-xl md:text-2xl text-on-surface/85 border-l-2 border-gold/40 pl-5 py-1">
              Every product in our archive is a tribute to the families who
              have perfected their craft over generations. We don&rsquo;t just
              import food; we preserve the soul of the Italian kitchen.
            </p>
          </div>
          <MagneticButton className="inline-block">
            <a
              href="#collections"
              onClick={(e) => handleSmoothScroll(e, "collections")}
              className="inline-flex min-h-11 items-center gap-2 text-burnt-terracotta text-sm uppercase tracking-widest font-semibold hover:gap-4 transition-all"
            >
              Discover our collections
              <ChevronRight className="w-4 h-4" />
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
