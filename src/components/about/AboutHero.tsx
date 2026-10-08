import { motion } from "motion/react";
import { getCmsData } from "../../data/cms";
import { getResponsiveImageProps } from "../../lib/productImage";

export default function AboutHero() {
  const cms = getCmsData("page", "about");
  const headline =
    typeof cms?.headline === "string" ? cms.headline : "Our Story";
  const body =
    typeof cms?.body === "string"
      ? cms.body
      : "Italian pasta, sauces, olive oils, drinks, and more.";

  return (
    <section className="relative h-[62vh] min-h-[520px] flex items-center justify-center overflow-hidden bg-dark">
      <img
        alt="Stone village lane overlooking olive-covered Italian hills at sunset."
        width={1672}
        height={941}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        {...getResponsiveImageProps("/assets/Photos/story/italian-hillside-village-hero.webp", "100vw")}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/88 via-dark/30 to-dark/45" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center px-6 md:px-10 max-w-[900px] mx-auto"
      >
        <h1 className="font-headline font-normal text-italia-white text-[clamp(3.25rem,7.5vw,6rem)] leading-none">
          {headline}
        </h1>
        <div className="w-20 h-px bg-gold/60 mx-auto my-8" />
        <p className="font-serif-alt italic text-italia-white/85 text-[clamp(1.125rem,2vw,1.4375rem)] leading-relaxed max-w-[600px] mx-auto">
          {body}
        </p>
      </motion.div>
    </section>
  );
}
