import { useState, type FormEvent } from "react";

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
    <section className="bg-dark py-14 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-10 md:gap-12">
        <div>
          <h2 className="font-headline font-normal text-italia-white text-[clamp(1.625rem,2.8vw,2.125rem)] mb-2">
            Join the Italian table
          </h2>
          <p className="font-script italic text-xl text-italia-white/65 max-w-[46ch]">
            {endpoint
              ? "Recipes, stories from the field, and first access to new arrivals."
              : "Recipes and stories from the field are coming soon."}
          </p>
        </div>

        {endpoint ? (
          <div className="flex-1 min-w-[320px] max-w-md">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-6 border-b border-gold/50 pb-3"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="your@email.com"
                required
                disabled={status === "submitting"}
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-italia-white placeholder:text-italia-white/40 text-[15px] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="shrink-0 whitespace-nowrap bg-transparent border-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors disabled:cursor-wait disabled:opacity-65"
              >
                {status === "submitting" ? "Joining…" : "Subscribe"}
              </button>
            </form>
            <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-italia-white/35">
              No spam. Unsubscribe anytime.
            </p>
            <p
              className="mt-2 min-h-6 text-sm text-italia-white/75"
              role="status"
              aria-live="polite"
            >
              {status === "success" && "Welcome to the Italian table. Please check your inbox."}
              {status === "error" && "We couldn't complete your signup. Please try again in a moment."}
            </p>
          </div>
        ) : (
          <p
            className="max-w-md flex-1 min-w-[320px] text-sm leading-relaxed text-italia-white/65"
            role="status"
          >
            Email signup is not available yet. Follow{" "}
            <a
              href="https://www.instagram.com/tuscaninifoods/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold underline decoration-gold/35 underline-offset-4 hover:decoration-gold"
            >
              Tuscanini on Instagram
            </a>{" "}
            for new products and recipes.
          </p>
        )}
      </div>
    </section>
  );
}
