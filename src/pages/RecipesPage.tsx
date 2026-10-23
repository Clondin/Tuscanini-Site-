import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { recipePages, recipeTotalMinutes } from "../data/recipe-pages";
import KosherCredit from "../components/kosher/KosherCredit";

export default function RecipesPage() {
  return (
    <div className="bg-aged-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-9 pb-16">
        <h1 className="font-headline text-4xl md:text-6xl text-heading">Recipes</h1>
        <p className="max-w-xl mt-5 text-on-surface/85 leading-relaxed">
          Kosher recipes made with Tuscanini olive oil, truffle salt, tomatoes and more, from the cooks at Kosher.com.
          Each one lists the Tuscanini products it uses and links back to the original.
        </p>
        <KosherCredit className="mt-3" />
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {recipePages.map((recipe) => {
            return (
              <li key={recipe.slug}>
                <Link
                  to={`/recipes/${recipe.slug}`}
                  className="group flex h-full flex-col bg-surface ring-1 ring-on-surface/12 transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-20px_rgba(42,31,22,0.5)] motion-reduce:hover:translate-y-0"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-on-surface/5">
                    <img
                      src={recipe.image}
                      srcSet={`${recipe.imageThumb} 300w, ${recipe.image} 1024w`}
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 92vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transform-none"
                    />
                    <span className="absolute top-3 left-3 rounded-full text-xs text-olive-deep bg-surface/90 px-2.5 py-1">
                      {recipe.kosher}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5 border-t border-on-surface/10">
                    <p className="text-xs uppercase tracking-wider text-olive-deep font-semibold">{recipe.course}</p>
                    <h2 className="mt-2 font-headline text-xl md:text-2xl leading-snug text-heading group-hover:text-olive-accent">
                      {recipe.title}
                    </h2>
                    <p className="mt-1 text-xs text-on-surface/70">By {recipe.author} · Kosher.com</p>
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
        <p className="mt-10 text-sm text-on-surface/75">
          Originals on Kosher.com:{" "}
          {recipePages.map((recipe, index) => (
            <span key={recipe.slug}>
              {index > 0 && " · "}
              <a href={recipe.sourceUrl} target="_blank" rel="noopener" className="text-olive-deep underline decoration-olive-deep/30 underline-offset-4 hover:decoration-olive-deep">
                {recipe.title}
              </a>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
