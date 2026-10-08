import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getResponsiveImageProps, isMissingProductImage } from "../../lib/productImage";
import { categories } from "../../data/products";
import { recipes } from "../../data/recipes";

/**
 * Brand story band. Every figure is counted from the live merged catalog and
 * recipe list at render time, so the numbers follow CMS and API changes.
 */
export default function HeritageSection() {
  const products = categories.flatMap((category) =>
    category.products.filter((product) => !isMissingProductImage(product.image)),
  );
  const stats = [
    { value: products.length, label: "Products" },
    { value: categories.length, label: "Collections" },
    {
      value: products.filter((product) => product.kosher === true).length,
      label: "Certified kosher",
    },
    { value: recipes.length, label: "Serving ideas" },
  ].filter((stat) => stat.value > 0);

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

      <div className="relative max-w-7xl mx-auto px-5 md:px-10 -mt-16 md:-mt-28 pb-16 md:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
        <div className="lg:col-span-6">
          <span className="flex items-center gap-3 mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
            About Tuscanini
          </span>
          <h2 className="font-headline text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.04] text-white max-w-[16ch]">
            An Italian pantry, from pasta night to dessert.
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-aged-cream/80 max-w-[52ch]">
            Pasta and sauces, olive oils and vinegars, sparkling drinks,
            chocolate, and frozen favorites — everything you need for an
            Italian table, in one family of products.
          </p>
          <p className="mt-6 font-script italic text-2xl text-gold-light">
            Taste Tuscanini. Know Italy.
          </p>
          <Link
            to="/about"
            className="group mt-8 inline-flex min-h-12 items-center gap-3 border border-gold/60 px-6 text-sm font-semibold text-aged-cream hover:bg-gold hover:text-dark hover:border-gold transition-colors"
          >
            Read our story
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <dl className="lg:col-span-6 grid grid-cols-2 border-t border-l border-white/12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse border-r border-b border-white/12 px-5 py-6 md:px-8 md:py-9"
            >
              <dt className="mt-2 text-xs md:text-sm uppercase tracking-[0.16em] text-aged-cream/70">
                {stat.label}
              </dt>
              <dd className="font-headline text-[clamp(2.5rem,5vw,4.25rem)] leading-none text-gold tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
