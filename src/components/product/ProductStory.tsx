import { motion } from "motion/react";

interface ProductStoryProps {
  productName: string;
}

export default function ProductStory({ productName }: ProductStoryProps) {
  return (
    <section className="py-28 bg-earth-dark relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-[0.03]"></div>
      <div className="max-w-3xl mx-auto px-6 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
            The Craft
          </span>
          <h2 className="font-headline text-4xl md:text-5xl text-heading italic mb-4">
            A Story of Italian Mastery
          </h2>
          <div className="flex justify-center items-center gap-4 mt-6 mb-12">
            <div className="w-16 h-px bg-primary/30"></div>
            <div className="w-2 h-2 rounded-full bg-primary/40"></div>
            <div className="w-16 h-px bg-primary/30"></div>
          </div>
          <p className="text-on-surface/70 text-lg leading-relaxed font-light">
            Our {productName} is crafted by generations of Italian artisans who share a reverence for authenticity.
            From sun-drenched fields to meticulous production, every step honors the belief that the finest
            ingredients need only the simplest preparations. When you choose Tuscanini, you choose to preserve
            the soul of the Italian kitchen.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
