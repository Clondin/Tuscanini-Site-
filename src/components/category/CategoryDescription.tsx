import { motion } from "motion/react";

interface CategoryDescriptionProps {
  description: string;
}

export default function CategoryDescription({ description }: CategoryDescriptionProps) {
  return (
    <section className="py-20 px-6 md:px-10 bg-earth-dark relative">
      <div className="absolute inset-0 sketch-overlay opacity-[0.03] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <div className="flex justify-center items-center gap-4 mb-10">
          <div className="w-16 h-px bg-primary/30" />
          <div className="w-2 h-2 rounded-full bg-primary/40" />
          <div className="w-16 h-px bg-primary/30" />
        </div>
        <p className="font-serif-alt text-on-surface/70 text-lg md:text-xl leading-relaxed italic">
          {description}
        </p>
        <div className="flex justify-center items-center gap-4 mt-10">
          <div className="w-16 h-px bg-primary/30" />
          <div className="w-2 h-2 rounded-full bg-primary/40" />
          <div className="w-16 h-px bg-primary/30" />
        </div>
      </motion.div>
    </section>
  );
}
