import { Link, useParams } from "react-router-dom";
import { ChevronRight, ShoppingCart, ArrowUpRight } from "lucide-react";
import { getRecipePage, recipePages } from "../data/recipe-pages";
import { getProductById, type Product } from "../data/products";
import { getCategoryAccent } from "../data/category-accents";
import { getAmazonProductLink } from "../lib/productPurchaseLink";
import { formatProductSize } from "../lib/formatProductSize";
import { getResponsiveImageProps, isMissingProductImage } from "../lib/productImage";
import NotFoundPage from "./NotFoundPage";

function RecipeProduct({ product }: { product: Product }) {
  const accent = getCategoryAccent(product.categoryId);
  const amazon = getAmazonProductLink(product);
  return (
    <li className="flex gap-4 bg-surface ring-1 ring-on-surface/12 p-3">
      <Link
        to={`/product/${product.id}`}
        style={{ backgroundColor: accent.soft }}
        className="flex h-24 w-24 shrink-0 items-center justify-center p-2"
        aria-label={product.name}
      >
        {!isMissingProductImage(product.image) && (
          <img
            {...getResponsiveImageProps(product.image, "96px")}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain mix-blend-multiply"
          />
        )}
      </Link>
      <div className="flex min-w-0 flex-col justify-center gap-2">
        <Link
          to={`/product/${product.id}`}
          className="font-headline text-lg leading-snug text-heading hover:text-olive-accent"
        >
          {product.name}
        </Link>
        {product.size && (
          <p className="-mt-1 text-xs text-on-surface/75 tabular-nums">{formatProductSize(product.size)}</p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {amazon && (
            <a
              href={amazon.href}
              target="_blank"
              rel="sponsored noopener"
              aria-label={`Buy ${product.name} on Amazon`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-ink/15 bg-paper px-3.5 text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              <ShoppingCart size={13} aria-hidden="true" />
              Buy on Amazon
            </a>
          )}
          <Link
            to={`/product/${product.id}`}
            className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-olive-deep"
          >
            View product <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </li>
  );
}

export default function RecipePage() {
  const { slug } = useParams<{ slug: string }>();
  const recipe = slug ? getRecipePage(slug) : undefined;
  if (!recipe) return <NotFoundPage />;

  const products = recipe.products
    .map((id) => getProductById(id))
    .filter((product): product is Product => Boolean(product));
  const main = products[0];
  const accent = getCategoryAccent(main?.categoryId ?? "");
  const more = recipePages.filter((other) => other.slug !== recipe.slug).slice(0, 3);
  const facts = [
    ["Prep", `${recipe.prepMinutes} min`],
    ["Cook", recipe.cookMinutes ? `${recipe.cookMinutes} min` : "No cooking"],
    ["Serves", String(recipe.servings)],
    ["Kosher", recipe.kosher],
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-aged-cream border-b border-on-surface/10">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-5 md:px-10 py-3.5 flex flex-wrap items-center gap-2">
          <Link to="/" className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-on-surface/80 hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0 text-on-surface/80" />
          <Link to="/recipes" className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-on-surface/80 hover:text-primary transition-colors">
            Recipes
          </Link>
          <ChevronRight className="hidden md:block w-3 h-3 shrink-0 text-on-surface/80" />
          <span aria-current="page" className="hidden md:inline text-xs tracking-wide text-olive-deep">
            {recipe.title}
          </span>
        </nav>
      </div>

      <article>
        <header className="max-w-7xl mx-auto px-5 md:px-10 pt-8 md:pt-12 pb-10 grid md:grid-cols-[1.15fr_0.85fr] gap-8 md:gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-olive-deep font-semibold">{recipe.course}</p>
            <h1 className="mt-3 font-headline font-medium text-heading text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.95] tracking-[-0.02em]">
              {recipe.title}
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-on-surface/85">{recipe.intro}</p>
            <dl className="mt-7 grid grid-cols-4 max-w-lg border-y border-on-surface/15">
              {facts.map(([label, value]) => (
                <div key={label} className="py-3 pr-2">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-on-surface/70">{label}</dt>
                  <dd className="mt-1 font-headline text-lg text-heading tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {main && !isMissingProductImage(main.image) && (
            <div style={{ backgroundColor: accent.soft }} className="flex aspect-[4/3] md:aspect-square items-center justify-center p-8 md:p-12">
              <img
                {...getResponsiveImageProps(main.image, "(min-width: 768px) 40vw, 90vw")}
                alt={main.name}
                decoding="async"
                className="h-full w-auto max-w-full object-contain mix-blend-multiply"
              />
            </div>
          )}
        </header>

        <div className="max-w-7xl mx-auto px-5 md:px-10 pb-12 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          <section aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading" className="font-headline text-2xl md:text-3xl text-heading mb-5">
              Ingredients
            </h2>
            <ul className="divide-y divide-on-surface/12 border-y border-on-surface/12">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient} className="py-3 text-[15px] leading-relaxed text-on-surface/90">
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="method-heading">
            <h2 id="method-heading" className="font-headline text-2xl md:text-3xl text-heading mb-5">
              Method
            </h2>
            <ol className="space-y-6">
              {recipe.steps.map((step, index) => (
                <li key={index} className="grid grid-cols-[2.5rem_1fr] gap-3">
                  <span className="font-headline text-2xl text-olive-deep tabular-nums leading-none pt-0.5">{index + 1}</span>
                  <p className="text-[15px] leading-relaxed text-on-surface/90">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-xs leading-relaxed text-on-surface/70">
              {recipe.kosher === "Dairy" ? "Dairy recipe." : "Pareve recipe: no meat or dairy ingredients."} Check each
              package for its kosher certification.
            </p>
          </section>
        </div>

        {products.length > 0 && (
          <section aria-labelledby="products-heading" className="bg-aged-cream">
            <div className="max-w-7xl mx-auto px-5 md:px-10 py-12">
              <h2 id="products-heading" className="font-headline text-2xl md:text-3xl text-heading mb-6">
                Products in this recipe
              </h2>
              <ul className="grid gap-4 md:grid-cols-2">
                {products.map((product) => (
                  <RecipeProduct key={product.id} product={product} />
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>

      <section aria-labelledby="more-heading" className="max-w-7xl mx-auto px-5 md:px-10 py-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 id="more-heading" className="font-headline text-2xl md:text-3xl text-heading">
            More recipes
          </h2>
          <Link to="/recipes" className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-olive-deep">
            All recipes <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {more.map((other) => (
            <li key={other.slug}>
              <Link
                to={`/recipes/${other.slug}`}
                className="group block h-full border-t-2 border-olive-deep/60 pt-3"
              >
                <p className="text-xs uppercase tracking-wider text-on-surface/70">
                  {other.course} · {other.kosher}
                </p>
                <p className="mt-1 font-headline text-xl leading-snug text-heading group-hover:text-olive-accent">
                  {other.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
