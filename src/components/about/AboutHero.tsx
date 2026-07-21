import { motion } from "motion/react";
import { getCmsData } from "../../data/cms";

export default function AboutHero() {
  const cms = getCmsData("page", "about");
  const headline = typeof cms?.headline === "string" ? cms.headline : "Our Story";
  const body = typeof cms?.body === "string"
    ? cms.body
    : "A journey rooted in tradition, driven by an unwavering passion for authentic Italian flavors.";
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-surface">
      <div className="absolute inset-0 z-0">
        <img
          alt="Italian Countryside"
          className="w-full h-full object-cover opacity-40 scale-105"
          src="/assets/Photos/backgrounds/italian-village.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-black/15"></div>
        <div className="absolute inset-0 sketch-overlay pointer-events-none"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <div className="inline-block px-6 py-2 border border-primary/30 mb-8">
          <p className="font-serif-alt italic tracking-widest text-primary text-sm">La Nostra Storia</p>
        </div>
        <h1 className="font-headline text-6xl md:text-8xl text-heading mb-6 leading-tight">{headline}</h1>
        <p className="font-serif-alt text-lg md:text-2xl text-on-surface/70 max-w-2xl mx-auto italic">
          {body}
        </p>
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full h-12 stone-texture shadow-[0_-20px_50px_rgba(0,0,0,0.06)] z-20"></div>
    </section>
  );
}
