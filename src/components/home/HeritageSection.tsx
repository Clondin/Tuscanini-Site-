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
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-28 px-6 md:px-24 bg-earth-dark relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-5" />
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative order-2 md:order-1"
        >
          <div className="aspect-[4/5] wood-grain p-4 shadow-2xl rounded-sm transform -rotate-1 border-b-8 border-gold/30">
            <img
              alt="Tuscanini Italian Market"
              className="w-full h-full object-cover"
              src="/assets/ads/sparkling-parallax.jpg"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gold/5 blur-3xl rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-10 order-1 md:order-2"
        >
          <header>
            <span className="text-gold font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
              Our Heritage
            </span>
            <TextReveal
              text="A Legacy Born in the Tuscan Pantry"
              as="h2"
              mode="word"
              className="font-headline text-5xl md:text-6xl text-heading leading-tight"
            />
          </header>
          <div className="space-y-6 text-on-surface/70 text-lg leading-relaxed font-light">
            <p>
              Tuscanini was founded on a singular obsession: to bottle the
              ephemeral magic of a Sunday afternoon in an Italian village. We
              believe that true luxury lies in simplicity&mdash;the peppery
              bite of first-press olive oil, the perfect snap of bronze-cut
              pasta.
            </p>
            <p className="font-script italic text-2xl text-on-surface/80 border-l-2 border-gold/40 pl-6 py-2">
              Every product in our archive is a tribute to the families who
              have perfected their craft over generations. We don&rsquo;t just
              import food; we preserve the soul of the Italian kitchen.
            </p>
          </div>
          <MagneticButton className="inline-block">
            <a
              href="#collections"
              onClick={(e) => handleSmoothScroll(e, "collections")}
              className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-widest font-semibold hover:gap-4 transition-all"
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
