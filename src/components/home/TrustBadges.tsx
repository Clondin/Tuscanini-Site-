import { motion } from "motion/react";
import { Award, ShieldCheck, Leaf } from "lucide-react";

const trustBadges = [
  {
    icon: Award,
    title: "Made in Italy",
    text: "Sourced directly from regional cooperatives and family-owned farms across Italy.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Kosher",
    text: "Uncompromising quality meeting the highest standards of dietary tradition.",
  },
  {
    icon: Leaf,
    title: "Pure Ingredients",
    text: "No unnecessary additives. Just the raw, honest flavor of the earth.",
  },
];

export default function TrustBadges() {
  return (
    <section className="py-24 bg-earth-dark relative">
      <div className="absolute inset-0 sketch-overlay opacity-[0.03]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustBadges.map((badge, idx) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="stone-texture p-12 text-center border border-on-surface/8 shadow-lg hover:border-gold/30 transition-colors"
            >
              <badge.icon className="w-12 h-12 text-gold mx-auto mb-6" />
              <h3 className="font-headline text-2xl text-heading mb-4">
                {badge.title}
              </h3>
              <p className="font-body text-on-surface/60 text-sm leading-relaxed">
                {badge.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
