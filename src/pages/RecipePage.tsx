import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Clock, Users, ListChecks, Printer, ShoppingCart, ArrowRight, Check } from "lucide-react";
import { getRecipePage, recipePages, type RecipePage as Recipe } from "../data/recipe-pages";
import { getProductById, type Product } from "../data/products";
import { getCategoryAccent } from "../data/category-accents";
import { getAmazonProductLink } from "../lib/productPurchaseLink";
import { formatProductSize } from "../lib/formatProductSize";
import { getResponsiveImageProps, isMissingProductImage } from "../lib/productImage";
import { formatRecipeTime } from "../lib/recipeTime";
import NotFoundPage from "./NotFoundPage";

const INTRO_CLAMP = 240;

function Intro({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > INTRO_CLAMP;
  return (
    <div className="mx-auto max-w-2xl">
      <p
        className={`font-headline text-[1.15rem] md:text-[1.35rem] leading-[1.6] text-on-surface/90 ${
          long && !open ? "line-clamp-3" : ""
        }`}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="mt-2 text-sm font-semibold text-olive-deep underline decoration-olive-deep/30 underline-offset-4 hover:decoration-olive-deep print:hidden"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function Ingredients({ recipe }: { recipe: Recipe }) {
  const [checked, setChecked] = useState<Set<number>>(() => new Set());
  const toggle = (index: number) =>
    setChecked((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  return (
    <section aria-labelledby="ingredients-heading" className="bg-aged-cream px-5 py-6 md:px-7 md:py-8">
      <div className="flex items-baseline justify-between gap-4 border-b border-on-surface/15 pb-4">
        <h2 id="ingredients-heading" className="font-headline text-2xl md:text-[1.75rem] text-heading">
          Ingredients
        </h2>
        <p className="text-xs text-on-surface/65 tabular-nums" aria-live="polite">
          {checked.size ? `${checked.size} of ${recipe.ingredients.length}` : `Serves ${recipe.servings}`}
        </p>
      </div>
      <ul className="mt-2">
        {recipe.ingredients.map((ingredient, index) => {
          const done = checked.has(index);
          return (
            <li key={index} className="border-b border-on-surface/10 last:border-b-0">
              <label className="flex cursor-pointer items-start gap-3.5 py-3 select-none">
                <input type="checkbox" checked={done} onChange={() => toggle(index)} className="peer sr-only" />
                <span
                  aria-hidden="true"
                  className={`mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-olive-deep ${
                    done ? "border-olive-deep bg-olive-deep text-paper" : "border-on-surface/35 bg-surface"
                  }`}
                >
                  {done && <Check size={13} strokeWidth={3} />}
                </span>
                <span
                  className={`text-[15px] md:text-base leading-relaxed transition-colors ${
                    done ? "text-on-surface/45 line-through decoration-on-surface/30" : "text-on-surface/90"
                  }`}
                >
                  {ingredient}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Steps({ recipe }: { recipe: Recipe }) {
  const [done, setDone] = useState<Set<number>>(() => new Set());
  const toggle = (index: number) =>
    setDone((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  return (
    <section aria-labelledby="method-heading">
      <div className="flex items-baseline justify-between gap-4 border-b border-on-surface/15 pb-4">
        <h2 id="method-heading" className="font-headline text-2xl md:text-[1.75rem] text-heading">
          Method
        </h2>
        <p className="text-xs text-on-surface/65">Tap a step when it&rsquo;s done</p>
      </div>
      <ol className="mt-2">
        {recipe.steps.map((step, index) => {
          const finished = done.has(index);
          return (
            <li key={index} className="border-b border-on-surface/10 last:border-b-0">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-pressed={finished}
                className="grid w-full grid-cols-[2.75rem_1fr] md:grid-cols-[3.5rem_1fr] gap-3 md:gap-4 py-6 text-left"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full font-headline text-lg md:text-xl tabular-nums transition-colors ${
                    finished ? "bg-olive-deep text-paper" : "ring-1 ring-olive-deep/40 text-olive-deep"
                  }`}
                >
                  {finished ? <Check size={18} strokeWidth={2.5} /> : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-on-surface/55">
                    Step {index + 1}
                  </span>
                  <span
                    className={`mt-1.5 block text-[16px] md:text-[18px] leading-[1.7] transition-colors ${
                      finished ? "text-on-surface/45" : "text-on-surface/90"
                    }`}
                  >
                    {step}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function RecipeProduct({ product }: { product: Product }) {
  const accent = getCategoryAccent(product.categoryId);
  const amazon = getAmazonProductLink(product);
  return (
    <li className="group flex flex-col">
      <Link
        to={`/product/${product.id}`}
        style={{ backgroundColor: accent.soft }}
        className="relative flex aspect-square items-center justify-center overflow-hidden p-5 md:p-7"
        aria-label={product.name}
      >
        {!isMissingProductImage(product.image) && (
          <img
            {...getResponsiveImageProps(product.image, "(min-width: 1024px) 280px, 45vw")}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
          />
        )}
      </Link>
      <Link
        to={`/product/${product.id}`}
        className="mt-3 font-headline text-[17px] md:text-lg leading-snug text-heading hover:text-olive-accent"
      >
        {product.name}
      </Link>
      {product.size && <p className="mt-0.5 text-xs text-on-surface/65 tabular-nums">{formatProductSize(product.size)}</p>}
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2">
        <Link to={`/product/${product.id}`} className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-olive-deep">
          View product <ArrowRight size={13} aria-hidden="true" />
        </Link>
        {amazon && (
          <a
            href={amazon.href}
            target="_blank"
            rel="sponsored noopener"
            aria-label={`Buy ${product.name} on Amazon`}
            className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-on-surface/70 hover:text-ink"
          >
            <ShoppingCart size={13} aria-hidden="true" /> Amazon
          </a>
        )}
      </div>
    </li>
  );
}

function RelatedRecipe({ recipe }: { recipe: Recipe }) {
  return (
    <li>
      <Link to={`/recipes/${recipe.slug}`} className="group block">
        <div className="aspect-[4/3] overflow-hidden bg-on-surface/5">
          <img
            src={recipe.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
          />
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] font-semibold text-olive-deep">
          {recipe.course} &middot; {recipe.kosher}
        </p>
        <p className="mt-1.5 font-headline text-xl md:text-2xl leading-snug text-heading group-hover:text-olive-accent">
          {recipe.title}
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-on-surface/65 tabular-nums">
          <Clock size={13} aria-hidden="true" /> {formatRecipeTime(recipe.totalMinutes)}
        </p>
      </Link>
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
  const more = recipePages.filter((other) => other.slug !== recipe.slug).slice(0, 3);
  const facts: { icon: typeof Clock; label: string; value: string }[] = [
    { icon: Clock, label: "Total time", value: formatRecipeTime(recipe.totalMinutes) },
    { icon: Users, label: "Serves", value: recipe.servings.replace("-", "–") },
    { icon: ListChecks, label: "Ingredients", value: String(recipe.ingredients.length) },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-on-surface/10 print:hidden">
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

      <article className="recipe-article">
        <header className="max-w-5xl mx-auto px-5 md:px-10 pt-9 md:pt-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] text-olive-deep font-semibold">
            {recipe.course} <span className="mx-1.5 text-on-surface/30">/</span> {recipe.kosher}
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl font-headline font-medium text-heading text-[clamp(2.2rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.02em] text-balance">
            {recipe.title}
          </h1>
          <p className="mt-5 text-sm md:text-[15px] text-on-surface/75">
            By <span className="font-semibold text-on-surface">{recipe.author}</span>
            <span className="mx-2 text-on-surface/30">&middot;</span>
            Recipe from{" "}
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener"
              className="text-olive-deep underline decoration-olive-deep/30 underline-offset-4 hover:decoration-olive-deep"
            >
              Kosher.com
            </a>
          </p>
          <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-3 divide-x divide-on-surface/15 border-y border-on-surface/15">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-2 py-4 md:py-5">
                <Icon size={18} strokeWidth={1.6} className="text-olive-deep" aria-hidden="true" />
                <dt className="mt-1 text-[10px] uppercase tracking-[0.2em] text-on-surface/60">{label}</dt>
                <dd className="font-headline text-xl md:text-2xl text-heading tabular-nums whitespace-nowrap">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <figure className="relative mx-auto mt-8 md:mt-12 max-w-7xl md:px-10">
          <div className="aspect-[4/3] md:aspect-[21/10] overflow-hidden bg-on-surface/5">
            <img
              src={recipe.image}
              srcSet={recipe.imageThumb !== recipe.image ? `${recipe.imageThumb} 300w, ${recipe.image} 1024w` : undefined}
              sizes="(min-width: 1280px) 1200px, 100vw"
              alt={recipe.title}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption className="px-5 md:px-0 pt-2 text-right text-[11px] text-on-surface/55">Photo: Kosher.com</figcaption>
        </figure>

        <div className="max-w-5xl mx-auto px-5 md:px-10 pt-8 md:pt-12 text-center">
          <Intro text={recipe.intro} />
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 print:hidden">
            <a
              href="#recipe"
              className="inline-flex min-h-11 items-center gap-2 bg-ink px-6 text-sm font-semibold text-paper transition-colors hover:bg-olive-deep"
            >
              Jump to recipe
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-11 items-center gap-2 px-5 text-sm font-semibold text-ink ring-1 ring-ink/20 transition-colors hover:bg-ink hover:text-paper"
            >
              <Printer size={16} aria-hidden="true" /> Print recipe
            </button>
          </div>
        </div>

        <div id="recipe" className="max-w-7xl mx-auto scroll-mt-24 px-5 md:px-10 pt-12 md:pt-20 pb-14 md:pb-20 grid gap-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16 xl:gap-24 items-start">
          <div className="lg:sticky lg:top-[100px]">
            <Ingredients recipe={recipe} />
          </div>
          <div>
            <Steps recipe={recipe} />
            <p className="mt-6 text-xs leading-relaxed text-on-surface/60">
              {recipe.kosher === "Pareve" ? "Pareve recipe: no meat or dairy ingredients." : `${recipe.kosher} recipe.`} Check each
              package for its kosher certification.
            </p>
            <div className="mt-8 flex flex-col gap-3 border-t border-on-surface/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-on-surface/70">
                Recipe by {recipe.author}, originally published on Kosher.com.
              </p>
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-olive-deep underline decoration-olive-deep/30 underline-offset-4 hover:decoration-olive-deep print:hidden"
              >
                View on Kosher.com <span aria-hidden="true">&rarr;</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>

        {products.length > 0 && (
          <section aria-labelledby="products-heading" className="bg-aged-cream print:hidden">
            <div className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-20">
              <p className="text-[11px] uppercase tracking-[0.24em] text-olive-deep font-semibold">In the pantry</p>
              <h2 id="products-heading" className="mt-2 font-headline text-3xl md:text-4xl text-heading">
                Tuscanini products in this recipe
              </h2>
              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-4">
                {products.map((product) => (
                  <RecipeProduct key={product.id} product={product} />
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-heading" className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-20 print:hidden">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 id="more-heading" className="font-headline text-3xl md:text-4xl text-heading">
              More recipes
            </h2>
            <Link to="/recipes" className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-olive-deep">
              All recipes <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {more.map((other) => (
              <RelatedRecipe key={other.slug} recipe={other} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
