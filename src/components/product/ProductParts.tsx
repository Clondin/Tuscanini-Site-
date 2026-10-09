import type { ReactNode, RefObject } from "react";
import { ArrowUpRight, Check, Expand, Plus, Share2 } from "lucide-react";
import type { Product } from "../../data/products";
import { getResponsiveImageProps } from "../../lib/productImage";
import ImageLightbox from "../ui/ImageLightbox";
import ProductImagePlaceholder from "../ui/ProductImagePlaceholder";
import type { ProductDossierState } from "./useProductDossier";

/** The pack shot as a zoom button, or the unavailable-photo state. */
export function ProductImage({
  product,
  state,
  className = "",
  imageClassName = "",
  multiply = true,
  enlargeClassName = "",
}: {
  product: Product;
  state: ProductDossierState;
  className?: string;
  imageClassName?: string;
  /** Multiply blends white-background photos into light panels; skip it on saturated fields. */
  multiply?: boolean;
  enlargeClassName?: string;
}) {
  if (!state.hasImage) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <ProductImagePlaceholder productName={product.name} />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={state.openLightbox}
      aria-label={`View larger image of ${product.name}`}
      className={`group relative flex items-end justify-center cursor-zoom-in ${className}`}
    >
      <img
        {...getResponsiveImageProps(product.image, "(min-width: 1024px) 50vw, 100vw")}
        alt={product.name}
        fetchPriority="high"
        className={`relative h-full w-full object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none ${multiply ? "mix-blend-multiply" : ""} ${imageClassName}`}
      />
      <span
        className={`absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-paper/90 px-3.5 py-2 text-xs font-semibold text-ink shadow-sm backdrop-blur transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100 ${enlargeClassName}`}
      >
        <Expand size={14} />
        Enlarge
      </span>
    </button>
  );
}

/** Primary buy link and share; `tone` adapts them to paper or saturated fields. */
export function BuyActions({
  state,
  buyRef,
  tone = "paper",
  className = "",
}: {
  state: ProductDossierState;
  /** Observed to reveal the mobile buy bar once this button scrolls away. */
  buyRef: RefObject<HTMLAnchorElement | null>;
  tone?: "paper" | "dark";
  className?: string;
}) {
  const onDark = tone === "dark";
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <a
          ref={buyRef}
          href={state.purchase.href}
          target="_blank"
          rel={state.purchase.rel}
          className={`group inline-flex flex-1 sm:flex-none justify-center min-h-13 items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold transition-colors ${
            onDark
              ? "bg-paper text-ink hover:bg-lemon"
              : "bg-ink text-paper hover:bg-tomato"
          }`}
        >
          {state.purchase.label}
          <ArrowUpRight
            size={18}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
        <button
          type="button"
          onClick={state.share}
          className={`inline-flex min-h-13 items-center gap-2 rounded-full border px-5 py-4 text-sm font-semibold transition-colors ${
            onDark
              ? "border-current/40 hover:bg-paper/10"
              : "border-ink/25 text-ink hover:border-ink"
          }`}
        >
          {state.copied ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}
          {state.copied ? "Link copied" : "Share"}
        </button>
        <span role="status" className="sr-only">
          {state.copied ? "Product link copied to clipboard" : ""}
        </span>
      </div>
      {!state.frozen && (
        <p className={`mt-3 text-xs leading-relaxed ${onDark ? "opacity-80" : "text-on-surface/75"}`}>
          Selection and availability vary.
        </p>
      )}
    </div>
  );
}

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group py-1">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-heading [&::-webkit-details-marker]:hidden">
        {title}
        <Plus
          size={18}
          aria-hidden="true"
          className="shrink-0 transition-transform duration-300 group-open:rotate-45"
        />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

/** Ingredients, preparation, and nutrition, each shown only when recorded. */
export function ProductDisclosures({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const hasNutrition = Boolean(
    product.nutritionImage ||
      product.nutritionFacts?.length ||
      product.nutritionServing ||
      product.nutritionCalories,
  );
  const hasPrep = Boolean(product.preparation?.length || product.storage);
  if (!product.ingredients && !hasPrep && !hasNutrition) return null;
  return (
    <div className={`border-y border-on-surface/20 divide-y divide-on-surface/20 ${className}`}>
      {product.ingredients && (
        <Disclosure title="Ingredients">
          <p className="text-sm leading-relaxed">{product.ingredients}</p>
          <p className="mt-3 text-xs text-on-surface/80">
            Check the packaging for the latest ingredient and allergen
            information.
          </p>
        </Disclosure>
      )}
      {hasPrep && (
        <Disclosure title="Preparation & storage">
          {product.preparation?.map((step, index) => (
            <p key={index} className="mt-3 first:mt-0 text-sm leading-relaxed">
              {step.replace(/\s*\|\s*/, ": ")}
            </p>
          ))}
          {product.storage && (
            <p className="mt-4 text-sm leading-relaxed">{product.storage}</p>
          )}
        </Disclosure>
      )}
      {hasNutrition && (
        <Disclosure title="Nutrition facts">
          {product.nutritionServing && (
            <p className="text-sm">Serving size: {product.nutritionServing}</p>
          )}
          {product.nutritionCalories && (
            <p className="mt-3 text-sm">Calories: {product.nutritionCalories}</p>
          )}
          {product.nutritionFacts?.map((fact, index) => (
            <p key={index} className="mt-3 text-sm">
              {fact.replace(/\s*\|\s*/, ": ")}
            </p>
          ))}
          {product.nutritionImage && (
            <img
              {...getResponsiveImageProps(product.nutritionImage, "100vw")}
              alt={`Nutrition facts for ${product.name}`}
              loading="lazy"
              className="mt-4 w-full max-w-md h-auto"
            />
          )}
          <p className="mt-4 text-xs leading-relaxed">
            Refer to the packaging for the latest nutrition information.
          </p>
        </Disclosure>
      )}
    </div>
  );
}

export function AffiliateNote({ state }: { state: ProductDossierState }) {
  if (!state.purchase.sponsored) return null;
  return (
    <p className="mt-5 text-xs leading-relaxed text-on-surface/75">
      As an Amazon Associate, Tuscanini may earn from qualifying purchases.
    </p>
  );
}

/** Mobile buy bar plus the lightbox; render once per layout. */
export function DossierOverlays({
  product,
  state,
  swatch,
}: {
  product: Product;
  state: ProductDossierState;
  swatch: string;
}) {
  return (
    <>
      {state.showSticky && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-paper/95 backdrop-blur border-t border-ink/15 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-12px_rgba(20,18,16,0.35)] flex items-center gap-3">
          {state.hasImage && (
            <img
              {...getResponsiveImageProps(product.image, "48px")}
              alt=""
              style={{ backgroundColor: swatch }}
              className="h-12 w-12 shrink-0 object-contain p-1"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-heading truncate">{product.name}</p>
            <p className="text-xs text-on-surface/80">{state.size}</p>
          </div>
          <a
            href={state.purchase.href}
            target="_blank"
            rel={state.purchase.rel}
            className="min-h-11 shrink-0 inline-flex items-center gap-2 rounded-full bg-ink text-paper px-4 text-xs font-semibold"
          >
            {state.purchase.label}
            <ArrowUpRight size={15} />
          </a>
        </div>
      )}
      {state.lightboxOpen && state.hasImage && (
        <ImageLightbox
          src={product.image}
          alt={product.name}
          isOpen
          onClose={state.closeLightbox}
        />
      )}
    </>
  );
}
