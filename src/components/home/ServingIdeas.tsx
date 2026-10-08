import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { recipes } from "../../data/recipes";
import { getProductById } from "../../data/products";
import {
  getResponsiveImageProps,
  isMissingProductImage,
} from "../../lib/productImage";
import SectionHeading from "../ui/SectionHeading";

const SHOWN = 4;

/**
 * Brings the recipe list, otherwise only reachable from product pages, onto
 * the homepage. Each idea links to the first of its products that exists in
 * the merged catalog; ideas with no resolvable product are skipped.
 */
export default function ServingIdeas() {
  const ideas = recipes
    .flatMap((recipe) => {
      const product = recipe.products
        .map((id) => getProductById(id))
        .find((match) => match && !isMissingProductImage(match.image));
      return product ? [{ recipe, product }] : [];
    })
    .slice(0, SHOWN);
  if (!ideas.length) return null;

  return (
    <section
      id="serving-ideas"
      className="bg-aged-cream px-5 md:px-10 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <figure className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              {...getResponsiveImageProps(
                "/assets/ads/gnocchi-recipe.jpg",
                "(min-width: 1024px) 40vw, 100vw",
              )}
              alt="Tuscanini mini gnocchi served with mushrooms on a rustic wooden table"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-[45%_50%]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 ring-1 ring-inset ring-heading/10"
            />
          </div>
          <figcaption className="mt-3 text-xs text-on-surface/70">
            Ideas for pasta night, antipasti, and dessert.
          </figcaption>
        </figure>

        <div className="lg:col-span-7">
          <SectionHeading
            eyebrow="From the kitchen"
            title="Serving ideas"
            className="mb-2"
          />
          <ol>
            {ideas.map(({ recipe, product }, index) => {
              const complete = Boolean(
                recipe.instructions?.length && recipe.ingredients.length,
              );
              return (
                <li key={recipe.id} className="border-b border-on-surface/15">
                  <Link
                    to={`/product/${product.id}#recipes`}
                    className="group grid grid-cols-[2.25rem_1fr_auto] md:grid-cols-[3rem_1fr_auto] gap-x-4 md:gap-x-6 items-start py-7 md:py-8"
                  >
                    <span
                      aria-hidden="true"
                      className="font-headline italic text-2xl md:text-3xl text-gold leading-none pt-1 tabular-nums"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-[0.18em] text-burnt-terracotta">
                        {complete ? "Recipe" : "Serving idea"}
                        {recipe.ingredients.length > 0 &&
                          ` · ${recipe.ingredients.length} ingredients`}
                      </span>
                      <span className="mt-2 block font-headline text-2xl md:text-[1.75rem] leading-snug text-heading group-hover:text-olive-accent transition-colors">
                        {recipe.name}
                      </span>
                      <span className="mt-2 block text-sm md:text-base leading-relaxed text-on-surface/80 max-w-[58ch]">
                        {recipe.description}
                      </span>
                      <span className="mt-3 block text-sm font-semibold text-olive-deep">
                        With {product.name}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-1 w-10 h-10 rounded-full border border-on-surface/25 flex items-center justify-center text-olive-deep transition-colors group-hover:bg-olive-deep group-hover:border-olive-deep group-hover:text-white"
                    >
                      <ArrowUpRight size={17} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
