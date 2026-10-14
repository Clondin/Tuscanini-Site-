import type { RefObject } from "react";
import { ArrowUpRight, Check, Expand, Share2 } from "lucide-react";
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
