import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getRecipePagesForProduct } from "../../data/recipe-pages";

/** "Recipes with this product": links to the /recipes pages that use this product. */
export default function RecipePageLinks({ productId }: { productId: string }) {
  const recipes = getRecipePagesForProduct(productId);
  if (!recipes.length) return null;
  return (
    <section aria-labelledby="recipe-pages-heading" className="px-5 md:px-10 py-12 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 id="recipe-pages-heading" className="font-headline text-3xl md:text-4xl text-heading">
          Recipes with this product
        </h2>
        <Link to="/recipes" className="inline-flex min-h-10 shrink-0 items-center gap-1.5 text-sm font-semibold text-olive-deep">
          All recipes <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <li key={recipe.slug}>
            <Link
              to={`/recipes/${recipe.slug}`}
              className="group flex h-full flex-col border border-on-surface/20 bg-aged-cream/50 p-5 transition-colors hover:border-olive-deep/50"
            >
              <span className="text-xs uppercase tracking-wider text-olive-deep font-semibold">
                {recipe.course} · {recipe.kosher}
              </span>
              <span className="mt-1 text-xs text-on-surface/70">Recipe from Kosher.com by {recipe.author}</span>
              <span className="mt-2 font-headline text-xl leading-snug text-heading group-hover:text-olive-accent">
                {recipe.title}
              </span>
              <span className="mt-2 text-sm leading-relaxed text-on-surface/80 line-clamp-2">{recipe.intro}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
