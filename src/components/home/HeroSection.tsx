import { useRef } from "react";
import type { MouseEvent } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import TextReveal from "../ui/TextReveal";
import MagneticButton from "../ui/MagneticButton";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={sectionRef} className="relative h-screen flex items-end justify-center overflow-hidden bg-dark">
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-[120%] object-cover opacity-90"
          src="/assets/Trailer/Tuscanini_Trailer_Screens_Final.mp4"
        />
        <div className="absolute inset-0 film-grain opacity-[0.07] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl mx-auto mb-28 px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-block px-6 py-2 border border-gold/40 mb-8"
        >
          <p className="font-script italic tracking-widest text-gold text-lg">
            Dal cuore dell&rsquo;Italia
          </p>
        </motion.div>

        <TextReveal
          text="Italy at Your Table"
          as="h1"
          mode="word"
          delay={0.5}
          className="font-headline text-6xl md:text-8xl lg:text-9xl text-italia-white mb-6 leading-tight"
        />

        <p className="font-script text-xl md:text-3xl text-italia-white/70 max-w-2xl mx-auto italic mb-4">
          Authentic flavors, sourced from the heart of Italy&nbsp;&mdash;
          crafted for your home kitchen.
        </p>

        <p className="font-body uppercase tracking-[0.3em] text-gold/80 text-xs mb-12">
          Taste Tuscanini. Know Italy.
        </p>

        <MagneticButton className="inline-block">
          <motion.a
            href="#collections"
            onClick={(e: MouseEvent<HTMLAnchorElement>) => handleSmoothScroll(e, "collections")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-dark font-body font-semibold uppercase tracking-widest text-xs rounded-sm hover:bg-gold-light transition-colors"
          >
            Explore Our Collections
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </MagneticButton>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full italia-stripe z-20" />
    </section>
  );
}
