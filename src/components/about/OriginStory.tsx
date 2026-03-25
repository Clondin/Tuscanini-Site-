import { motion } from "motion/react";

export default function OriginStory() {
  return (
    <section className="py-32 px-6 md:px-24 bg-earth-dark relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-5"></div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[4/5] wood-grain p-4 shadow-2xl rounded-sm transform -rotate-1 border-b-8 border-on-surface/15">
            <img
              alt="Italian Heritage"
              className="w-full h-full object-cover sepia-[0.2] contrast-125"
              src="/assets/Photos/PHOTO-2020-11-27-15-44-52.jpg"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <header>
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">Our Origins</span>
            <h2 className="font-headline text-5xl md:text-6xl text-heading leading-tight">
              Born of a Love for Italy's Table
            </h2>
          </header>
          <div className="space-y-6 text-on-surface/70 text-lg leading-relaxed font-light">
            <p>
              Tuscanini was founded on a singular obsession: to bring the soul of the Italian kitchen
              to homes everywhere. Not through imitation, but through authenticity — sourcing directly
              from the families, cooperatives, and artisans who have perfected their craft over centuries.
            </p>
            <p>
              Our founders traveled the length of Italy, from the sun-baked olive groves of Puglia to the
              alpine dairies of Trentino, forging relationships built on shared values: quality without
              compromise, tradition without shortcuts, and a deep respect for the land.
            </p>
            <p className="italic border-l-2 border-primary/40 pl-6 py-2">
              "We don't just import Italian food. We carry forward the stories, the traditions,
              and the generations of knowledge that make each product extraordinary."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
