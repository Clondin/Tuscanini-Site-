import { motion } from "motion/react";
import { Award, ShieldCheck, Landmark } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const values = [
  {
    icon: Award,
    title: "Authenticity",
    description: "Every product traces back to Italian soil. We source directly from regional cooperatives and family-owned farms who have cultivated their land for generations.",
  },
  {
    icon: ShieldCheck,
    title: "Quality",
    description: "Certified Kosher, uncompromising standards. Every ingredient is vetted, every process verified, every product held to the highest benchmarks of excellence.",
  },
  {
    icon: Landmark,
    title: "Heritage",
    description: "Preserving centuries-old culinary traditions. We honor the recipes and methods that have defined Italian cooking through the ages.",
  },
];

export default function ValuesPillars() {
  return (
    <section className="bg-aged-cream py-20 md:py-22 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading eyebrow="What We Stand For" title="Our Pillars" className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3">
          {values.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
              className="py-8 md:py-0 md:px-9 border-b md:border-b-0 md:border-r last:border-0 border-gold/35"
            >
              <value.icon className="w-7 h-7 text-primary block" />
              <h3 className="mt-[22px] mb-3 font-headline font-normal text-[25px] text-heading">
                {value.title}
              </h3>
              <p className="text-sm leading-[1.8] text-on-surface/65">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
