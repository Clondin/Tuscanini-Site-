import { motion } from "motion/react";
import { Grape, TreePine, Sun } from "lucide-react";
import SourcingMap from "./SourcingMap";

const journeySteps = [
  {
    icon: Sun,
    region: "Tuscany",
    title: "Tuscan Olive Groves",
    description: "From century-old olive trees nestled in the rolling hills of Tuscany, we source the finest extra virgin olive oil — cold-pressed within hours of harvest to capture the peppery, fruity essence of the land.",
  },
  {
    icon: Grape,
    region: "Sicily",
    title: "Sicilian Citrus Orchards",
    description: "The volcanic soils of Sicily yield blood oranges and lemons of extraordinary intensity. Our citrus beverages and flavors draw directly from these sun-drenched orchards, carrying the vibrant spirit of the island.",
  },
  {
    icon: TreePine,
    region: "Piedmont",
    title: "Piedmont Hazelnut Farms",
    description: "The prized Tonda Gentile hazelnut of Piedmont forms the heart of our chocolate truffles. Roasted slowly and blended with Italian cocoa, these nuts contribute a depth of flavor found nowhere else on earth.",
  },
];

export default function SourcingJourney() {
  return (
    <section className="bg-earth-dark py-20 md:py-22 px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="block mb-3.5 text-[10px] font-bold uppercase tracking-[0.3em] text-burnt-terracotta">
            From Farm to Table
          </span>
          <h2 className="mb-4 font-headline font-normal italic text-heading text-[clamp(1.875rem,3.6vw,2.75rem)]">
            The Italian Sourcing Journey
          </h2>
          <p className="mx-auto max-w-[620px] font-serif-alt italic text-lg leading-[1.7] text-on-surface/62">
            We travel so you don&rsquo;t have to &mdash; traversing Italy&rsquo;s diverse regions to
            bring you the finest each has to offer.
          </p>
        </motion.div>

        {/* Interactive Sourcing Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="mb-6 text-center text-[10px] uppercase tracking-[0.2em] text-on-surface/45">
            Hover or tap the pins to explore our sourcing regions
          </p>
          <SourcingMap />
        </motion.div>

        <div className="flex flex-col">
          {journeySteps.map((step) => (
            <motion.div
              key={step.region}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-[64px_1fr] md:grid-cols-[88px_1fr] gap-6 md:gap-9 items-start py-8 md:py-9 border-t border-on-surface/14"
            >
              <span className="w-16 h-16 md:w-[88px] md:h-[88px] shrink-0 border border-on-surface/15 bg-gradient-to-b from-hearth-stone to-earth-dark flex items-center justify-center">
                <step.icon className="w-7 h-7 md:w-[34px] md:h-[34px] text-primary" />
              </span>
              <div>
                <span className="block mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/75">
                  {step.region}
                </span>
                <h3 className="mb-3 font-headline font-normal text-2xl md:text-[29px] text-heading">
                  {step.title}
                </h3>
                <p className="text-[17px] leading-[1.8] font-light text-on-surface/65 max-w-[62ch] text-pretty">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
