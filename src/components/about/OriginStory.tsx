import { motion } from "motion/react";
import { getResponsiveImageProps } from "../../lib/productImage";

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
            alt="Craftsperson coiling rope beside blue fishing boats in a coastal Italian harbor."
            width={1122}
            height={1402}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-[50%_45%] block"
            {...getResponsiveImageProps("/assets/Photos/story/coastal-craftsperson-lead.webp", "100vw")}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="min-w-0"
        >
          <h2 className="mb-6 font-headline font-normal text-heading text-[clamp(2.125rem,4.2vw,3.375rem)] leading-[1.1] max-w-[20ch]">
            What we make
          </h2>
          <div className="flex flex-col gap-5 text-[17px] leading-[1.8] font-light text-on-surface/70 max-w-[54ch]">
            <p className="text-pretty">
              Our range includes pasta, sauces, olive oils, sparkling drinks,
              snacks, chocolate, and frozen foods.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
