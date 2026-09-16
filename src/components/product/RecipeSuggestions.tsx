import { getRecipesForProduct, getPairedProductIds } from "../../data/recipes";
import { getProductById, type Product } from "../../data/products";
import CatalogCard from "../category/CatalogCard";

export default function RecipeSuggestions({
  productId,
}: {
  productId: string;
}) {
  const recipes = getRecipesForProduct(productId);
  const pairs = getPairedProductIds(productId)
    .filter((id) => id !== productId)
    .map(getProductById)
    .filter((product): product is Product => Boolean(product?.image));
  if (!recipes.length) return null;
  return (
    <section className="px-5 md:px-10 py-12 max-w-7xl mx-auto">
      <p className="text-xs tracking-[0.16em] uppercase text-olive-deep font-semibold mb-3">
        Bring it to the table
      </p>
      <h2 className="font-headline text-3xl md:text-4xl text-heading mb-8">
        A little inspiration for your next meal
      </h2>
      <div
        className={`grid gap-6 ${recipes.length > 1 ? "md:grid-cols-2" : ""}`}
      >
        {recipes.map((recipe) => {
          const complete = Boolean(
            recipe.instructions?.length && recipe.ingredients.length,
          );
          return (
            <article
              key={recipe.id}
              className="border border-on-surface/20 bg-aged-cream/50"
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  loading="lazy"
                  className="w-full max-h-[480px] aspect-[16/9] object-cover"
                />
              )}
              <div
                className={`p-5 md:p-7 ${recipes.length === 1 ? "md:grid md:grid-cols-2 md:gap-10" : ""}`}
              >
                <div>
                  <span className="text-xs uppercase tracking-wider text-olive-deep font-semibold">
                    {complete ? "Recipe" : "Serving idea"}
                  </span>
                  <h3 className="font-headline text-2xl text-heading mt-3 mb-3">
                    {recipe.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-on-surface/85">
                    {recipe.description}
                  </p>
                  {complete && (
                    <p className="mt-4 text-sm text-on-surface/85">
                      {[
                        recipe.prepTime && `${recipe.prepTime} prep`,
                        recipe.cookTime &&
                          recipe.cookTime !== "0 min" &&
                          `${recipe.cookTime} cook`,
                        recipe.servings && `Serves ${recipe.servings}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
                {recipe.ingredients.length > 0 && (
                  <details
                    className={`mt-5 border-t border-on-surface/20 pt-4 ${recipes.length === 1 ? "md:mt-0" : ""}`}
                  >
                    <summary className="cursor-pointer min-h-11 text-sm font-semibold text-olive-deep">
                      {complete
                        ? "View ingredients & method"
                        : "See all ingredients"}{" "}
                      ({recipe.ingredients.length})
                    </summary>
                    <h4 className="font-semibold mt-3 mb-3 text-sm">
                      {complete ? "Ingredients" : "What goes together"}
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                    {complete && (
                      <>
                        <h4 className="font-semibold mt-6 mb-3 text-sm">
                          Method
                        </h4>
                        <ol className="list-decimal pl-5 space-y-3 text-sm leading-relaxed">
                          {recipe.instructions!.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </>
                    )}
                  </details>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {pairs.length > 0 && (
        <div className="mt-12">
          <h2 className="font-headline text-3xl text-heading mb-6">
            Bring these together
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {pairs.slice(0, 4).map((product) => (
              <CatalogCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
