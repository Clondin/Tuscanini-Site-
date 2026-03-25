import { motion } from "motion/react";
import { Award, ShieldCheck, Landmark } from "lucide-react";

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
    <section className="py-32 bg-aged-cream relative">
      <div className="absolute inset-0 sketch-overlay opacity-[0.03]"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">What We Stand For</span>
          <h2 className="font-headline text-5xl text-heading italic mb-6">Our Pillars</h2>
          <div className="flex justify-center items-center gap-4">
            <div className="w-16 h-px bg-primary/30"></div>
            <div className="w-2 h-2 rounded-full bg-primary/40"></div>
            <div className="w-16 h-px bg-primary/30"></div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="stone-texture p-12 text-center border border-on-surface/8 shadow-lg"
            >
              <value.icon className="w-12 h-12 text-primary mx-auto mb-6" />
              <h3 className="font-headline text-2xl text-heading mb-4">{value.title}</h3>
              <p className="font-body text-on-surface/60 text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
