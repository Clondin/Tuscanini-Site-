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
    <section className="bg-surface border-t border-on-surface/10 py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
        {trustBadges.map((badge, idx) => (
          <motion.div
            key={badge.title}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.12, duration: 0.6 }}
          >
            <badge.icon className="w-[26px] h-[26px] text-primary block" />
            <h3 className="mt-[18px] mb-2.5 font-headline font-normal text-[22px] text-heading">
              {badge.title}
            </h3>
            <p className="text-sm leading-[1.75] text-on-surface/65 max-w-[38ch]">{badge.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
