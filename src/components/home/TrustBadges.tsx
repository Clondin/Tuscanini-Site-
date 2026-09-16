import { motion } from "motion/react";
import { Award, ShieldCheck, Leaf } from "lucide-react";

const trustBadges = [
  {
    icon: Award,
    title: "Made in Italy",
    text: "Discover regional flavors. Find origin details on each product page.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Kosher",
    text: "Look for certification on individual products and check the packaging.",
  },
  {
    icon: Leaf,
    title: "Make it your own",
    text: "Find a familiar favorite, try a new pairing, and bring it to your table.",
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
            <p className="text-sm leading-[1.75] text-on-surface/80 max-w-[38ch]">{badge.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
