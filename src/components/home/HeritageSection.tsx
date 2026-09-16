import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import TextReveal from "../ui/TextReveal";

export default function HeritageSection() {
  return (
    <section id="heritage" className="bg-earth-dark py-20 md:py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="min-w-0"
        >
          <span className="block mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-burnt-terracotta">
            Our Heritage
          </span>
          <TextReveal
            text="Make room for a little Italy."
            as="h2"
            mode="word"
            className="font-headline font-normal text-heading text-[clamp(2rem,3.8vw,2.875rem)] leading-[1.14] max-w-[22ch] mb-5"
          />
          <p className="mb-[18px] text-[17px] leading-[1.75] text-on-surface/70 max-w-[52ch] text-pretty">
            A pot of pasta, a splash of olive oil, something good to share.
            Explore the ingredients that bring Italian cooking into your everyday meals.
          </p>
          <p className="font-script italic text-[22px] leading-[1.55] text-on-surface/85 border-l-2 border-gold/50 pl-[22px] py-1.5 max-w-[46ch]">
            From the first course to the last bite.
          </p>
          <Link
            to="/about"
            className="mt-7 inline-flex min-h-11 items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-burnt-terracotta hover:text-primary hover:gap-3.5 transition-all"
          >
            Read the full story
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <motion.div
          initial={false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="aspect-[4/5] overflow-hidden border-b-8 border-gold/30"
        >
          <img
            alt="Italian coastal landscape overlooking the Mediterranean"
            className="w-full h-full object-cover block"
            loading="lazy"
            decoding="async"
            src="/assets/ads/sparkling-parallax.jpg"
          />
        </motion.div>
      </div>
    </section>
  );
}
