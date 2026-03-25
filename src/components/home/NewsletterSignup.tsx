import { motion } from "motion/react";
import MagneticButton from "../ui/MagneticButton";

export default function NewsletterSignup() {
  return (
    <section className="py-28 px-6 bg-aged-cream relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-[0.04]" />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-gold font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
            Stay Connected
          </span>
          <h2 className="font-headline text-5xl md:text-6xl text-heading leading-tight mb-6">
            Join the Italian Table
          </h2>
          <p className="font-script text-on-surface/60 text-xl italic max-w-lg mx-auto mb-12">
            Recipes, stories from the field, and first access to new
            arrivals&nbsp;&mdash; delivered to your inbox.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              aria-label="Email address"
              className="flex-1 px-5 py-4 bg-white border border-on-surface/15 text-on-surface placeholder:text-on-surface/30 text-sm tracking-wide focus:outline-none focus:border-gold/60 rounded-sm"
            />
            <MagneticButton className="inline-block">
              <button
                type="submit"
                className="px-8 py-4 bg-gold text-dark font-body font-semibold uppercase tracking-widest text-xs rounded-sm hover:bg-gold-light transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </MagneticButton>
          </form>

          <p className="text-on-surface/30 text-[10px] tracking-widest uppercase mt-6">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
