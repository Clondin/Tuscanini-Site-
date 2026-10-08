import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getResponsiveImageProps } from "../../lib/productImage";

/** Brand story band linking to the About page. */
export default function HeritageSection() {
  return (
    <section id="heritage" className="relative bg-dark text-aged-cream overflow-hidden">
      <div className="relative h-[300px] sm:h-[420px] lg:h-[560px]">
        <img
          {...getResponsiveImageProps(
            "/assets/ads/tomato-group-tuscanini-web.jpg",
            "100vw",
          )}
          alt="Tuscanini tomato juice, passata, sauces, and canned tomatoes arranged with fresh tomatoes"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[50%_60%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,#1a1209_0%,transparent_22%,transparent_55%,#1a1209_100%)]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-10 -mt-16 md:-mt-28 pb-16 md:pb-24 grid lg:grid-cols-2 gap-x-16 gap-y-6 items-end">
        <div>
          <span className="flex items-center gap-3 mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
            About Tuscanini
          </span>
          <h2 className="font-headline text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.04] text-white max-w-[18ch]">
            An Italian pantry.
          </h2>
        </div>
        <div className="lg:pb-2">
          <p className="text-base md:text-lg leading-relaxed text-aged-cream/80 max-w-[56ch]">
            Pasta and sauces, olive oils and vinegars, sparkling drinks,
            chocolate, and frozen favorites.
          </p>
          <Link
            to="/about"
            className="group mt-8 inline-flex min-h-12 items-center gap-3 border border-gold/60 px-6 text-sm font-semibold text-aged-cream hover:bg-gold hover:text-dark hover:border-gold transition-colors"
          >
            Read our story
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
