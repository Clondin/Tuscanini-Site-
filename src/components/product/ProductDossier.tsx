import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Expand,
  ArrowUpRight,
  Snowflake,
  ShieldCheck,
  Flag,
} from "lucide-react";
import type { Product } from "../../data/products";
import { isFrozenProduct } from "../../lib/catalog-search";
import ImageLightbox from "../ui/ImageLightbox";

const amazonStore =
  "https://www.amazon.com/stores/Tuscanini/page/63CC7208-7FF4-4C25-B5F7-CAC5D4CA1C9A?tag=kaycopromo-20";
export default function ProductDossier({
  product,
  categoryName,
  categorySlug,
}: {
  product: Product;
  categoryName: string;
  categorySlug: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const buyingRef = useRef<HTMLAnchorElement>(null);
  const frozen = isFrozenProduct(product);
  const url = frozen ? "https://www.tuscaninifoods.com/" : amazonStore;
  const label = frozen ? "Visit Tuscanini" : "Visit Amazon store";
  useEffect(() => {
    const button = buyingRef.current;
    if (!button) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setShowSticky(
          !entry.isIntersecting && entry.boundingClientRect.top < 75,
        ),
      { rootMargin: "-75px 0px 0px 0px" },
    );
    observer.observe(button);
    return () => observer.disconnect();
  }, []);
  const rows = [
    { label: "Pack size", value: product.size },
    { label: "Collection", value: categoryName },
    {
      label: "Origin",
      value: product.madeInItaly ? "Made in Italy" : undefined,
    },
    {
      label: "Certification",
      value: product.kosher === true ? "Certified kosher" : undefined,
    },
  ].filter((row) => row.value);
  return (
    <>
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-7 md:py-11 grid lg:grid-cols-2 gap-x-14 gap-y-6 items-start">
        <div className="lg:col-start-2 lg:row-start-1">
          <Link
            to={`/category/${categorySlug}`}
            className="text-xs uppercase tracking-[0.16em] font-semibold text-olive-deep"
          >
            {categoryName}
          </Link>
          <h1 className="font-headline text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] text-heading mt-3 mb-3">
            {product.name}
          </h1>
          <p className="text-base text-on-surface/85">{product.size}</p>
        </div>
        <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 bg-aged-cream border border-on-surface/15">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`View larger image of ${product.name}`}
            className="group relative w-full h-[260px] sm:h-[340px] lg:h-[530px] flex items-center justify-center px-8 py-6 cursor-zoom-in"
          >
            <img
              src={product.image}
              alt={product.name}
              fetchPriority="high"
              className="w-full h-full object-contain"
            />
            <span className="absolute right-3 bottom-3 inline-flex gap-2 items-center px-3 py-2 bg-surface border border-on-surface/20 text-sm text-olive-deep">
              <Expand size={16} />
              Enlarge
            </span>
          </button>
        </div>
        <div className="lg:col-start-2 lg:row-start-2">
          <a
            ref={buyingRef}
            href={url}
            target="_blank"
            rel={
              frozen ? "noopener noreferrer" : "sponsored noopener noreferrer"
            }
            className="inline-flex justify-center w-full sm:w-auto min-h-12 items-center gap-3 px-7 py-3.5 bg-olive-deep hover:bg-olive-accent text-white text-sm font-semibold"
          >
            {label}
            <ArrowUpRight size={18} />
          </a>
          <p className="mt-3 text-xs text-on-surface/80 leading-relaxed">
            {frozen
              ? "Explore Tuscanini’s website for more about the range."
              : "Browse the Tuscanini brand store. Selection and availability vary."}
          </p>
          <p className="my-6 text-base text-on-surface/85 leading-relaxed">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-3 mb-7 text-xs font-semibold text-olive-deep">
            {frozen && (
              <span className="inline-flex items-center gap-2 border border-olive-deep/30 px-3 py-2">
                <Snowflake size={16} />
                Frozen
              </span>
            )}
            {product.madeInItaly && (
              <span className="inline-flex items-center gap-2 border border-olive-deep/30 px-3 py-2">
                <Flag size={16} />
                Made in Italy
              </span>
            )}
            {product.kosher === true && (
              <span className="inline-flex items-center gap-2 border border-olive-deep/30 px-3 py-2">
                <ShieldCheck size={16} />
                Certified kosher
              </span>
            )}
          </div>
          <div className="border-y border-on-surface/20 divide-y divide-on-surface/20">
            <details open className="py-4">
              <summary className="cursor-pointer text-base font-semibold text-heading">
                Product details
              </summary>
              <dl className="mt-3">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[100px_1fr] gap-4 py-2 text-sm"
                  >
                    <dt className="text-on-surface/85">{row.label}</dt>
                    <dd className="text-heading">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </details>
            {product.ingredients && (
              <details className="py-4">
                <summary className="cursor-pointer text-base font-semibold text-heading">
                  Ingredients
                </summary>
                <p className="mt-4 text-sm leading-relaxed">
                  {product.ingredients}
                </p>
                <p className="mt-3 text-xs text-on-surface/80">
                  Check the packaging for the latest ingredient and allergen
                  information.
                </p>
              </details>
            )}
            {product.preparation?.length || product.storage ? (
              <details className="py-4">
                <summary className="cursor-pointer text-base font-semibold text-heading">
                  Preparation & storage
                </summary>
                {product.preparation?.map((step, index) => (
                  <p key={index} className="mt-3 text-sm leading-relaxed">
                    {step.replace(/\s*\|\s*/, ": ")}
                  </p>
                ))}
                {product.storage && (
                  <p className="mt-4 text-sm leading-relaxed">
                    {product.storage}
                  </p>
                )}
              </details>
            ) : null}
            {product.nutritionImage ||
            product.nutritionFacts?.length ||
            product.nutritionServing ||
            product.nutritionCalories ? (
              <details className="py-4">
                <summary className="cursor-pointer text-base font-semibold text-heading">
                  Nutrition facts
                </summary>
                {product.nutritionServing && (
                  <p className="mt-4 text-sm">
                    Serving size: {product.nutritionServing}
                  </p>
                )}
                {product.nutritionCalories && (
                  <p className="mt-3 text-sm">
                    Calories: {product.nutritionCalories}
                  </p>
                )}
                {product.nutritionFacts?.map((fact, index) => (
                  <p key={index} className="mt-3 text-sm">
                    {fact.replace(/\s*\|\s*/, ": ")}
                  </p>
                ))}
                {product.nutritionImage && (
                  <img
                    src={product.nutritionImage}
                    alt={`Nutrition facts for ${product.name}`}
                    loading="lazy"
                    className="mt-4 w-full max-w-md h-auto"
                  />
                )}
                <p className="mt-4 text-xs leading-relaxed">
                  Refer to the packaging for the latest nutrition information.
                </p>
              </details>
            ) : null}
          </div>
          {!frozen && (
            <p className="mt-5 text-xs leading-relaxed text-on-surface/80">
              As an Amazon Associate, Tuscanini may earn from qualifying
              purchases.
            </p>
          )}
          <Link
            to={`/category/${categorySlug}`}
            className="inline-flex min-h-11 mt-3 items-center text-sm font-semibold text-olive-deep underline underline-offset-4"
          >
            Back to {categoryName}
          </Link>
        </div>
      </section>
      {showSticky && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-on-surface/25 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-lg flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-heading truncate">{product.name}</p>
            <p className="text-xs text-on-surface/80">{product.size}</p>
          </div>
          <a
            href={url}
            target="_blank"
            rel={
              frozen ? "noopener noreferrer" : "sponsored noopener noreferrer"
            }
            className="min-h-11 shrink-0 inline-flex items-center gap-2 bg-olive-deep text-white px-4 text-xs font-semibold"
          >
            {label}
            <ArrowUpRight size={15} />
          </a>
        </div>
      )}
      {lightboxOpen && (
        <ImageLightbox
          src={product.image}
          alt={product.name}
          isOpen
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
