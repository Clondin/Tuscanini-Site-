import { motion } from "motion/react";
import { Grape, TreePine, Sun } from "lucide-react";
import SourcingMap from "./SourcingMap";

const journeySteps = [
  {
    icon: Sun,
    region: "Tuscany",
    title: "Olive oil",
    description:
      "Tuscany is known for olive oil with fruity and peppery flavors. Browse our olive oils for cooking, dressings, and finishing dishes.",
  },
  {
    icon: Grape,
    region: "Sicily",
    title: "Citrus",
    description:
      "Sicilian lemons and blood oranges appear throughout the drink range. Browse lemonades, sparkling drinks, and citrus juices.",
  },
  {
    icon: TreePine,
    region: "Piedmont",
    title: "Chocolate and hazelnuts",
    description:
      "Piedmont is known for chocolate and hazelnuts. Browse chocolate bars, gianduiotti, and truffles in our chocolate collection.",
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
            Regional foods
          </span>
          <h2 className="mb-4 font-headline font-normal italic text-heading text-[clamp(1.875rem,3.6vw,2.75rem)]">
            A map of Italian food
          </h2>
          <p className="mx-auto max-w-[620px] font-serif-alt italic text-lg leading-[1.7] text-on-surface/80">
            Select a region to read about its foods and browse related products.
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
          <p className="mb-6 text-center text-[10px] uppercase tracking-[0.2em] text-on-surface/80">
            Select a region or a pin
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
                <p className="text-[17px] leading-[1.8] font-light text-on-surface/80 max-w-[62ch] text-pretty">
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
