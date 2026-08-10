import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import ImageWithSkeleton from "../ui/ImageWithSkeleton";

const spotlight = [
  {
    id: "evoo-750ml",
    name: "Extra Virgin Olive Oil",
    tagline: "Cold-pressed from Italian groves",
    image: "/assets/Olive Oil/730406 Large.png",
  },
  {
    id: "sparkling-lemonade",
    name: "Sparkling Lemonade",
    tagline: "Bright Sicilian citrus in every sip",
    image: "/assets/Beverage/730380.png",
  },
  {
    id: "chocolate-truffle-pistachio",
    name: "Pistachio Chocolate Truffles",
    tagline: "Sicilian pistachios meet fine chocolate",
    image: "/assets/Chocolate Truffle/Info/Pistachio/image001.png",
  },
];

export default function FeaturedProducts() {
  return (
    <section id="spotlight" className="bg-surface py-20 md:py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Spotlight"
          title="Standout Selections"
          action={{ label: "View all", to: "/#collections" }}
          className="mb-11"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {spotlight.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="border-b sm:border-b-0 sm:border-r last:border-0 border-gold/35"
            >
              <Link
                to={`/product/${product.id}`}
                className="group block text-inherit py-8 sm:py-0 px-0 sm:px-8"
              >
                <div className="aspect-square flex items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(240,232,219,0.9),rgba(240,232,219,0))]">
                  <ImageWithSkeleton
                    className="w-full h-full object-contain p-[30px] drop-shadow-[0_14px_22px_rgba(42,31,22,0.18)] group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    wrapperClassName="w-full h-full"
                    skeletonClassName="aspect-auto"
                    src={product.image}
                    alt={product.name}
                  />
                </div>
                <p className="mt-[22px] font-headline text-[23px] leading-tight text-heading group-hover:text-primary transition-colors">
                  {product.name}
                </p>
                <p className="mt-2 font-script italic text-[17px] text-on-surface/62">
                  {product.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-burnt-terracotta group-hover:gap-3 transition-all">
                  View product
                  <ChevronRight className="w-[13px] h-[13px]" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
