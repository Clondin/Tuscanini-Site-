import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Clock, Users, ChevronRight } from "lucide-react";
import {
  getRecipesForProduct,
  getPairedProductIds,
  type Recipe,
} from "../../data/recipes";
import {
  getProductById,
  getCategoryForProduct,
  type Product,
} from "../../data/products";

interface RecipeSuggestionsProps {
  productId: string;
}

export default function RecipeSuggestions({
  productId,
}: RecipeSuggestionsProps) {
  const recipes = getRecipesForProduct(productId);
  const pairedIds = getPairedProductIds(productId);
  const pairedProducts = pairedIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);

  // If no recipes, fall back to same-category products
  if (recipes.length === 0) {
    const category = getCategoryForProduct(productId);
    if (!category) return null;

    const sameCategoryProducts = category.products.filter(
      (p) => p.id !== productId
    );
    if (sameCategoryProducts.length === 0) return null;

    return (
      <section className="px-6 md:px-10 py-14 md:py-18 max-w-7xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading title="Pairs Well With..." />
          <ProductPairingsRow products={sameCategoryProducts.slice(0, 6)} />
        </motion.div>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-10 py-14 md:py-18 max-w-7xl mx-auto space-y-12">
      {/* Recipe cards */}
      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading title="Recipes with this Product" />
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide">
          {recipes.map((recipe, idx) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={idx} />
          ))}
        </div>
      </motion.div>

      {/* Paired products */}
      {pairedProducts.length > 0 && (
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <SectionHeading title="Pairs Well With..." />
          <ProductPairingsRow products={pairedProducts.slice(0, 6)} />
        </motion.div>
      )}
    </section>
  );
}

/* ---------- Sub-components ---------- */

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-8">
      <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-3">
        Perfect Pairings
      </span>
      <h2 className="font-headline text-3xl md:text-4xl text-heading italic">
        {title}
      </h2>
      <div className="w-16 h-px bg-primary/30 mt-4" />
    </div>
  );
}

function RecipeCard({ recipe, index }: { key?: string; recipe: Recipe; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="min-w-[280px] max-w-[320px] flex-shrink-0 snap-start still-life-frame"
    >
      <div className="space-y-4">
        <h3 className="font-headline text-xl text-heading leading-snug">
          {recipe.name}
        </h3>
        <p className="text-on-surface/55 text-sm leading-relaxed line-clamp-3">
          {recipe.description}
        </p>

        <div className="flex items-center gap-5 text-on-surface/45 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {recipe.prepTime} prep
          </span>
          {recipe.cookTime !== "0 min" && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {recipe.cookTime} cook
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {recipe.servings}
          </span>
        </div>

        <div className="pt-2">
          <span className="text-[10px] uppercase tracking-widest text-on-surface/40 font-bold block mb-2">
            Ingredients
          </span>
          <ul className="space-y-1">
            {recipe.ingredients.slice(0, 4).map((ing) => (
              <li
                key={ing}
                className="text-on-surface/50 text-xs flex items-start gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                {ing}
              </li>
            ))}
            {recipe.ingredients.length > 4 && (
              <li className="text-on-surface/35 text-xs italic">
                +{recipe.ingredients.length - 4} more
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function ProductPairingsRow({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {products.map((product, idx) => (
        <motion.div
          key={product.id}
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.06, duration: 0.4 }}
          className="min-w-0"
        >
          <Link
            to={`/product/${product.id}`}
            className="group block still-life-frame"
          >
            <div className="aspect-square overflow-hidden mb-3 bg-surface ring-1 ring-on-surface/10">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out opacity-95 group-hover:opacity-100"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e0d0c0] via-[#d4bfad] to-[#f0e2d4]">
                  <span className="font-headline text-sm text-heading/40 text-center px-2">
                    {product.name}
                  </span>
                </div>
              )}
            </div>
            <h4 className="font-headline text-sm text-heading group-hover:text-primary transition-colors leading-tight mb-1">
              {product.name}
            </h4>
            <span className="inline-flex items-center gap-1 text-primary text-[10px] uppercase tracking-widest font-body group-hover:gap-2 transition-all">
              View
              <ChevronRight className="w-3 h-3" />
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
