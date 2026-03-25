import { motion } from "motion/react";

export default function ItalianQuote() {
  return (
    <section className="relative py-36 overflow-hidden bg-surface">
      <div className="absolute inset-0 z-0">
        <img
          alt="Italian Coast"
          className="w-full h-full object-cover opacity-20"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN5mUX9JZGjnSsvYEYqUhuJgKDqZp0SgCmy4ZBcB1MSb0tHXakUnUchTzLazRZlStxn6p9mZhDBdisboWQ9YXoIcXuznI6FO0s63LGO9VDh9Rb2DonXgx_S57OkccH5pHEk-ZU2tc9TP7WAkqEjtDmjLyI5IWe0sVw_RQfxTsy_s_3VATENtqlBrKKPPcaOG8t9D7qKXd9L32Lm7G-3007Mvvc-1fR6wLTGmoW5gIPQ6gOQbf1a_NVCM2_ACKirgw8sdCiqQ2z5Y7i"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-transparent to-surface/90" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="font-headline text-4xl md:text-6xl text-heading italic leading-relaxed font-light"
        >
          &ldquo;From the Dolomite mountain ranges to Sicilian
          beaches&nbsp;&mdash; we travel so you don&rsquo;t have to.&rdquo;
        </motion.h2>
        <div className="mt-12 flex justify-center items-center gap-6">
          <div className="w-16 h-px bg-primary/40" />
          <span className="font-serif-alt text-primary uppercase tracking-[0.4em] text-[10px]">
            The Pursuit
          </span>
          <div className="w-16 h-px bg-primary/40" />
        </div>
      </div>
    </section>
  );
}
