import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import MagneticButton from "../ui/MagneticButton";

export default function NewsletterSignup() {
  const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT?.trim() || "";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!endpoint || status === "submitting") return;
    setStatus("submitting");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!response.ok) throw new Error(`Newsletter endpoint returned ${response.status}`);
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Newsletter signup failed.", error);
      setStatus("error");
    }
  };

  return (
    <section className="py-16 md:py-20 px-6 bg-aged-cream relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-[0.04]" />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-burnt-terracotta font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
            Stay Connected
          </span>
          <h2 className="font-headline text-4xl md:text-5xl text-heading leading-tight mb-5">
            Join the Italian Table
          </h2>
          <p className="font-script text-on-surface/70 text-xl italic max-w-lg mx-auto mb-8">
            {endpoint
              ? <>Recipes, stories from the field, and first access to new arrivals&nbsp;&mdash; delivered to your inbox.</>
              : <>Recipes and stories from the field are coming soon.</>}
          </p>

          {endpoint ? (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="your@email.com"
                  required
                  disabled={status === "submitting"}
                  className="flex-1 px-5 py-4 bg-white border border-on-surface/15 text-on-surface placeholder:text-on-surface/40 text-sm tracking-wide focus:outline-none focus:border-primary rounded-sm disabled:opacity-60"
                />
                <MagneticButton className="inline-block">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="min-h-11 px-8 py-4 bg-gold text-dark font-body font-semibold uppercase tracking-widest text-xs rounded-sm hover:bg-gold-light transition-colors whitespace-nowrap disabled:cursor-wait disabled:opacity-65"
                  >
                    {status === "submitting" ? "Joining\u2026" : "Subscribe"}
                  </button>
                </MagneticButton>
              </form>
              <p className="text-on-surface/50 text-[10px] tracking-widest uppercase mt-6">
                No spam. Unsubscribe anytime.
              </p>
              <p className="mt-3 min-h-6 text-sm text-on-surface/75" role="status" aria-live="polite">
                {status === "success" && "Welcome to the Italian table. Please check your inbox."}
                {status === "error" && "We couldn't complete your signup. Please try again in a moment."}
              </p>
            </>
          ) : (
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-on-surface/65" role="status">
              Email signup is not available yet. Follow {" "}
              <a
                href="https://www.instagram.com/tuscaninifoods/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-burnt-terracotta underline decoration-burnt-terracotta/35 underline-offset-4 hover:decoration-burnt-terracotta"
              >
                Tuscanini on Instagram
              </a>{" "}
              for new products and recipes.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
