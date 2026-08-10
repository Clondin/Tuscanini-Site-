import { motion } from "motion/react";

export default function OriginStory() {
  return (
    <section className="bg-surface py-20 md:py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-[72px] items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="aspect-[4/5] overflow-hidden border-b-8 border-gold/30"
        >
          <img
            alt="Italian heritage"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover block"
            src="/assets/Photos/PHOTO-2020-11-27-15-44-52.jpg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="min-w-0"
        >
          <span className="block mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-burnt-terracotta">
            Our Origins
          </span>
          <h2 className="mb-6 font-headline font-normal text-heading text-[clamp(2.125rem,4.2vw,3.375rem)] leading-[1.1] max-w-[20ch]">
            Born of a Love for Italy&rsquo;s Table
          </h2>
          <div className="flex flex-col gap-5 text-[17px] leading-[1.8] font-light text-on-surface/70 max-w-[54ch]">
            <p className="text-pretty">
              Tuscanini was founded on a singular obsession: to bring the soul of the Italian kitchen
              to homes everywhere. Not through imitation, but through authenticity &mdash; sourcing
              directly from the families, cooperatives, and artisans who have perfected their craft
              over centuries.
            </p>
            <p className="text-pretty">
              Our founders traveled the length of Italy, from the sun-baked olive groves of Puglia to
              the alpine dairies of Trentino, forging relationships built on shared values: quality
              without compromise, tradition without shortcuts, and a deep respect for the land.
            </p>
            <p className="font-script italic text-[23px] leading-[1.55] text-on-surface/85 border-l-2 border-gold/50 pl-[22px] py-1.5">
              &ldquo;We don&rsquo;t just import Italian food. We carry forward the stories, the
              traditions, and the generations of knowledge that make each product extraordinary.&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
