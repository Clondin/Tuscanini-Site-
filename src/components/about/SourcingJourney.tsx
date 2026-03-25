import { motion } from "motion/react";
import { Grape, TreePine, Sun } from "lucide-react";

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
    <section className="py-32 px-6 md:px-24 bg-earth-dark relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-5"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">From Farm to Table</span>
          <h2 className="font-headline text-5xl text-heading italic mb-6">The Italian Sourcing Journey</h2>
          <p className="font-serif-alt text-on-surface/60 text-lg italic max-w-2xl mx-auto">
            We travel so you don't have to — traversing Italy's diverse regions to bring you the finest each has to offer.
          </p>
        </motion.div>

        <div className="space-y-20">
          {journeySteps.map((step, idx) => (
            <motion.div
              key={step.region}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="flex-shrink-0 w-32 h-32 rounded-full stone-texture border border-on-surface/10 flex items-center justify-center shadow-lg">
                <step.icon className="w-14 h-14 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="text-primary/70 font-bold tracking-[0.3em] text-[10px] uppercase block mb-2">
                  {step.region}
                </span>
                <h3 className="font-headline text-3xl text-heading mb-4">{step.title}</h3>
                <p className="text-on-surface/60 text-lg leading-relaxed font-light max-w-xl">
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
