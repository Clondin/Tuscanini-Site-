import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { recipePages, recipeTotalMinutes } from "../data/recipe-pages";
import { getProductById } from "../data/products";
import { getCategoryAccent } from "../data/category-accents";
import { getResponsiveImageProps, isMissingProductImage } from "../lib/productImage";

export default function RecipesPage() {
  return (
    <div className="bg-aged-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-9 pb-16">
        <h1 className="font-headline text-4xl md:text-6xl text-heading">Recipes</h1>
        <p className="max-w-xl mt-5 text-on-surface/85 leading-relaxed">
          Simple kosher recipes made with Tuscanini pasta, sauces, olive oils, pesto and balsamic. Each one lists the
          products it uses.
        </p>
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {recipePages.map((recipe) => {
            const main = getProductById(recipe.products[0]);
            const accent = getCategoryAccent(main?.categoryId ?? "");
            return (
              <li key={recipe.slug}>
                <Link
                  to={`/recipes/${recipe.slug}`}
                  className="group flex h-full flex-col bg-surface ring-1 ring-on-surface/12 transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-20px_rgba(42,31,22,0.5)] motion-reduce:hover:translate-y-0"
                >
                  <div
                    style={{ backgroundColor: accent.soft }}
                    className="relative aspect-[4/3] flex items-center justify-center p-6"
                  >
                    <span className="absolute top-3 left-3 rounded-full text-xs text-olive-deep bg-surface/90 px-2.5 py-1">
                      {recipe.kosher}
                    </span>
                    {main && !isMissingProductImage(main.image) && (
                      <img
                        {...getResponsiveImageProps(main.image, "(min-width: 1024px) 300px, 60vw")}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-auto max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 motion-reduce:transform-none"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 border-t border-on-surface/10">
                    <p className="text-xs uppercase tracking-wider text-olive-deep font-semibold">{recipe.course}</p>
                    <h2 className="mt-2 font-headline text-xl md:text-2xl leading-snug text-heading group-hover:text-olive-accent">
                      {recipe.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-on-surface/80 line-clamp-2">{recipe.intro}</p>
                    <p className="mt-auto pt-4 flex items-center gap-4 text-xs text-on-surface/75 tabular-nums">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={14} aria-hidden="true" />
                        {recipeTotalMinutes(recipe)} min
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={14} aria-hidden="true" />
                        Serves {recipe.servings}
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
