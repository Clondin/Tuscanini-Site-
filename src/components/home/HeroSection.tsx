import type { MouseEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex items-end justify-center overflow-hidden bg-surface">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-85"
          src="/assets/Trailer/Tuscanini_Trailer_Screens_Final.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
        <div className="absolute inset-0 sketch-overlay pointer-events-none" />
      </div>

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
          className="inline-block px-6 py-2 border border-primary/30 mb-8"
        >
          <p className="font-serif-alt italic tracking-widest text-primary text-sm">
            Dal cuore dell&rsquo;Italia
          </p>
        </motion.div>

        <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl text-heading mb-6 leading-tight">
          Italy at Your Table
        </h1>

        <p className="font-serif-alt text-lg md:text-2xl text-on-surface/70 max-w-2xl mx-auto italic mb-12">
          Authentic flavors, sourced from the heart of Italy&nbsp;&mdash;
          crafted for your home kitchen.
        </p>

        <motion.a
          href="#collections"
          onClick={(e: MouseEvent<HTMLAnchorElement>) => handleSmoothScroll(e, "collections")}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-body font-semibold uppercase tracking-widest text-xs rounded-sm hover:bg-primary/90 transition-colors"
        >
          Explore Our Collections
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-12 stone-texture shadow-[0_-20px_50px_rgba(0,0,0,0.06)] z-20" />
    </section>
  );
}
