import { useState } from "react";
import { motion } from "motion/react";

export default function ClosingSection() {
  const [oliveBranchVisible, setOliveBranchVisible] = useState(true);

  return (
    <section className="py-36 px-8 bg-earth-dark relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-10" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {oliveBranchVisible && (
          <div className="mb-16">
            <img
              alt="Olive Branch"
              className="mx-auto h-32 w-auto opacity-40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCosI5jZjacVrJBNWbXh-YBOMdgr-dyzta3uQaRIdUkwuF-o-7DhIy6IaYW-l2av887VF-JOVA7qeOUzEXVlJyMHOz0kglm0qxF0Js8OaMD_PfTyY4BjWw8ELZPaqAy45nB3SvYeZPzuNPbIljtEcw5a3rMU06017eFjeozsbV9oXg6vw7P0MHJxrxQOd67bW0z4H4LFpBuxAbxJH4uRwJOuG3qJCKWkTLSJKCDxU5t9YfHX5UByy9MAA4RfUhlaFaVy-U-Ye0X-C0s"
              referrerPolicy="no-referrer"
              onError={() => setOliveBranchVisible(false)}
            />
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="font-headline text-5xl md:text-6xl text-heading leading-tight mb-10">
            Food connects people. Every Tuscanini product is made to bring
            your table to life.
          </h2>
          <p className="font-serif-alt text-primary italic text-2xl tracking-wide">
            Benvenuti alla nostra tavola.
          </p>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-4 wood-grain" />
    </section>
  );
}
