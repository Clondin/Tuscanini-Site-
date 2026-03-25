import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import TextReveal from "../ui/TextReveal";

export default function ItalianQuote() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section ref={sectionRef} className="relative py-36 overflow-hidden dark-section">
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <img
          alt="Italian Coast"
          className="w-full h-[130%] object-cover opacity-15"
          src="/assets/ads/balsamic-glaze.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-transparent to-dark/90" />
      </motion.div>
      <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
        <TextReveal
          text={"\u201CFrom the Dolomite mountain ranges to Sicilian beaches \u2014 we travel so you don\u2019t have to.\u201D"}
          as="h2"
          mode="word"
          staggerDelay={0.06}
          className="font-script text-4xl md:text-6xl text-italia-white italic leading-relaxed font-light"
        />
        <div className="mt-12 flex justify-center items-center gap-6">
          <div className="w-16 h-px bg-gold/40" />
          <span className="font-body text-gold uppercase tracking-[0.4em] text-[10px]">
            The Pursuit
          </span>
          <div className="w-16 h-px bg-gold/40" />
        </div>
      </div>
    </section>
  );
}
