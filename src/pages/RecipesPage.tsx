import { Link } from "react-router-dom";
import { Clock, Users, ArrowRight } from "lucide-react";
import { recipePages, recipeTotalMinutes, type RecipePage } from "../data/recipe-pages";
import { formatRecipeTime } from "../lib/recipeTime";
import KosherCredit from "../components/kosher/KosherCredit";

function Meta({ recipe, light = false }: { recipe: RecipePage; light?: boolean }) {
  return (
    <p className={`flex items-center gap-4 text-xs tabular-nums ${light ? "text-paper/80" : "text-on-surface/70"}`}>
      <span className="inline-flex items-center gap-1.5">
        <Clock size={14} aria-hidden="true" />
        {formatRecipeTime(recipeTotalMinutes(recipe))}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Users size={14} aria-hidden="true" />
        Serves {recipe.servings.replace("-", "–")}
      </span>
    </p>
  );
}

function FeaturedRecipe({ recipe }: { recipe: RecipePage }) {
  return (
    <Link to={`/recipes/${recipe.slug}`} className="group grid overflow-hidden bg-surface md:grid-cols-[1.35fr_1fr]">
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[440px] overflow-hidden bg-on-surface/5">
        <img
          src={recipe.image}
          sizes="(min-width: 768px) 60vw, 100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none"
        />
      </div>
      <div className="flex flex-col justify-center px-5 py-7 md:px-12 md:py-12">
        <p className="text-[11px] uppercase tracking-[0.24em] text-olive-deep font-semibold">
          {recipe.course} &middot; {recipe.kosher}
        </p>
        <h2 className="mt-3 font-headline text-3xl md:text-[2.75rem] leading-[1.05] text-heading group-hover:text-olive-accent transition-colors text-balance">
          {recipe.title}
        </h2>
        <p className="mt-3 text-sm text-on-surface/70">By {recipe.author}</p>
        <p className="mt-4 hidden md:block text-[15px] leading-relaxed text-on-surface/80 line-clamp-3">{recipe.intro}</p>
        <div className="mt-6">
          <Meta recipe={recipe} />
        </div>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink">
          Get the recipe
          <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
        </span>
      </div>
    </Link>
  );
}

function RecipeCard({ recipe }: { recipe: RecipePage }) {
  return (
    <Link to={`/recipes/${recipe.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-on-surface/5">
        <img
          src={recipe.image}
          sizes="(min-width: 768px) 45vw, 92vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none"
        />
        <span className="absolute left-3 top-3 bg-surface/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold text-olive-deep">
          {recipe.kosher}
        </span>
      </div>
      <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-olive-deep font-semibold">{recipe.course}</p>
      <h2 className="mt-2 font-headline text-2xl md:text-[1.9rem] leading-[1.12] text-heading group-hover:text-olive-accent transition-colors text-balance">
        {recipe.title}
      </h2>
      <p className="mt-1.5 text-xs text-on-surface/65">By {recipe.author}</p>
      <div className="mt-3">
        <Meta recipe={recipe} />
      </div>
    </Link>
  );
}

export default function RecipesPage() {
  const [featured, ...rest] = recipePages;
  return (
    <div className="bg-aged-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-10 md:pt-16 pb-16 md:pb-24">
        <header className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-olive-deep font-semibold">From the Kosher.com kitchen</p>
          <h1 className="mt-3 font-headline text-5xl md:text-7xl leading-[0.98] text-heading">Recipes</h1>
          <p className="mt-5 max-w-xl text-on-surface/80 leading-relaxed md:text-lg">
            Kosher recipes made with Tuscanini olive oil, truffle salt, tomatoes and more, from the cooks at Kosher.com.
            Each one lists the Tuscanini products it uses and links back to the original.
          </p>
          <KosherCredit className="mt-3" />
        </header>

        {featured && (
          <div className="mt-10 md:mt-14">
            <FeaturedRecipe recipe={featured} />
          </div>
        )}

        {rest.length > 0 && (
          <ul className="mt-12 md:mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
            {rest.map((recipe) => (
              <li key={recipe.slug}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </ul>
        )}

        <p className="mt-16 border-t border-on-surface/15 pt-6 text-sm leading-relaxed text-on-surface/70">
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
