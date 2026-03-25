import { motion } from "motion/react";

export default function ClosingSection() {
  return (
    <section className="py-36 px-8 dark-section relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-5" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-12 flex justify-center items-center gap-4">
          <div className="w-20 h-px bg-gold/30" />
          <div className="w-2 h-2 rounded-full bg-gold/40" />
          <div className="w-20 h-px bg-gold/30" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="font-headline text-5xl md:text-6xl text-italia-white leading-tight mb-10">
            Food connects people. Every Tuscanini product is made to bring
            your table to life.
          </h2>
          <p className="font-script italic text-gold text-3xl tracking-wide mb-4">
            Benvenuti alla nostra tavola.
          </p>
          <p className="font-body uppercase tracking-[0.3em] text-italia-white/40 text-xs">
            Taste Tuscanini. Know Italy.
          </p>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full italia-stripe" />
    </section>
  );
}
