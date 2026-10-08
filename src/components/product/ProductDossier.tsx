import { getResponsiveImageProps, isMissingProductImage } from "../../lib/productImage";
import { formatProductSize } from "../../lib/formatProductSize";
import { getProductPurchaseLink } from "../../lib/productPurchaseLink";
import { getCategoryAccent } from "../../data/category-accents";
import ProductImagePlaceholder from "../ui/ProductImagePlaceholder";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Expand,
  ArrowUpRight,
  Snowflake,
  ShieldCheck,
  Flag,
  Package,
  LayoutGrid,
  Share2,
  Check,
  Plus,
} from "lucide-react";
import type { Product } from "../../data/products";
import { isFrozenProduct } from "../../lib/catalog-search";
import ImageLightbox from "../ui/ImageLightbox";

function Disclosure({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group py-1">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-heading [&::-webkit-details-marker]:hidden">
        {title}
        <Plus
          size={18}
          aria-hidden="true"
          className="shrink-0 text-olive-deep transition-transform duration-300 group-open:rotate-45"
        />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

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
  const [copied, setCopied] = useState(false);
  const buyingRef = useRef<HTMLAnchorElement>(null);
  const frozen = isFrozenProduct(product);
  const purchaseLink = getProductPurchaseLink(product);
  const url = purchaseLink.href;
  const label = purchaseLink.label;
  const hasImage = !isMissingProductImage(product.image);
  const size = formatProductSize(product.size);
  const accent = getCategoryAccent(categorySlug);
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
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const share = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: shareUrl });
      } catch {
        // Dismissing the share sheet is not an error worth surfacing.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      // Clipboard access can be blocked; the address bar still has the link.
    }
  };
  const facts = [
    { label: "Pack size", value: size, icon: Package },
    {
      label: "Origin",
      value: product.madeInItaly ? "Made in Italy" : undefined,
      icon: Flag,
    },
    {
      label: "Certification",
      value: product.kosher === true ? "Certified kosher" : undefined,
      icon: ShieldCheck,
    },
    { label: "Storage", value: frozen ? "Frozen" : undefined, icon: Snowflake },
    { label: "Collection", value: categoryName, icon: LayoutGrid },
  ].filter((fact) => fact.value);
  const rel = purchaseLink.sponsored
    ? "sponsored noopener noreferrer"
    : "noopener noreferrer";
  return (
    <>
      <section
        style={{ "--product-accent": accent.deep } as CSSProperties}
        className="max-w-7xl mx-auto px-5 md:px-10 py-6 md:py-10 grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-x-14 gap-y-6 items-start"
      >
        <div className="lg:col-start-2 lg:row-start-1">
          <Link
            to={`/category/${categorySlug}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[var(--product-accent)] hover:underline underline-offset-4"
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--product-accent)]" />
            {categoryName}
          </Link>
          <h1 className="font-headline text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.04] text-heading mt-4 mb-3">
            {product.name}
          </h1>
          {size && <p className="text-lg text-on-surface/80">{size}</p>}
        </div>

        <div
          style={{ backgroundColor: accent.soft }}
          className="relative lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 overflow-hidden ring-1 ring-inset ring-heading/5"
        >
          {hasImage ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`View larger image of ${product.name}`}
              className="group relative w-full h-[300px] sm:h-[400px] lg:h-[min(620px,calc(100svh-140px))] flex items-end justify-center px-10 pt-10 pb-12 cursor-zoom-in"
            >
              <span
                aria-hidden="true"
                className="absolute bottom-9 left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-[50%] bg-heading/20 blur-lg"
              />
              <img
                {...getResponsiveImageProps(product.image, "(min-width: 1024px) 50vw, 100vw")}
                alt={product.name}
                fetchPriority="high"
                className="relative h-full w-full object-contain object-bottom mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
              />
              <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-surface/90 px-3.5 py-2 text-xs font-semibold text-olive-deep shadow-sm backdrop-blur transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
                <Expand size={14} />
                Enlarge
              </span>
            </button>
          ) : (
            <div className="h-[300px] sm:h-[400px] lg:h-[560px] flex items-center justify-center">
              <ProductImagePlaceholder productName={product.name} />
            </div>
          )}
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <p className="text-base md:text-lg text-on-surface/85 leading-relaxed">
            {product.description}
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-px bg-on-surface/12 border border-on-surface/12">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-surface p-4 md:p-5">
                <fact.icon
                  size={18}
                  aria-hidden="true"
                  className="mb-3 text-[var(--product-accent)]"
                />
                <dt className="text-[11px] uppercase tracking-[0.16em] text-on-surface/70">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm md:text-base font-semibold text-heading">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              ref={buyingRef}
              href={url}
              target="_blank"
              rel={rel}
              className="group inline-flex flex-1 sm:flex-none justify-center min-h-13 items-center gap-3 px-8 py-4 bg-olive-deep hover:bg-olive-accent text-white text-sm font-semibold transition-colors"
            >
              {label}
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <button
              type="button"
              onClick={share}
              className="inline-flex min-h-13 items-center gap-2 border border-on-surface/25 px-5 py-4 text-sm font-semibold text-heading hover:border-olive-deep transition-colors"
            >
              {copied ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}
              {copied ? "Link copied" : "Share"}
            </button>
            <span role="status" className="sr-only">
              {copied ? "Product link copied to clipboard" : ""}
            </span>
          </div>
          {!frozen && (
            <p className="mt-3 text-xs text-on-surface/75 leading-relaxed">
              Selection and availability vary.
            </p>
          )}

          {(product.ingredients ||
            product.preparation?.length ||
            product.storage ||
            product.nutritionImage ||
            product.nutritionFacts?.length ||
            product.nutritionServing ||
            product.nutritionCalories) && (
            <div className="mt-8 border-y border-on-surface/20 divide-y divide-on-surface/20">
              {product.ingredients && (
                <Disclosure title="Ingredients">
                  <p className="text-sm leading-relaxed">{product.ingredients}</p>
                  <p className="mt-3 text-xs text-on-surface/80">
                    Check the packaging for the latest ingredient and allergen
                    information.
                  </p>
                </Disclosure>
              )}
              {product.preparation?.length || product.storage ? (
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
              ) : null}
              {product.nutritionImage ||
              product.nutritionFacts?.length ||
              product.nutritionServing ||
              product.nutritionCalories ? (
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
              ) : null}
            </div>
          )}
          {purchaseLink.sponsored && (
            <p className="mt-5 text-xs leading-relaxed text-on-surface/75">
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
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-on-surface/20 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-12px_rgba(42,31,22,0.35)] flex items-center gap-3">
          {hasImage && (
            <img
              {...getResponsiveImageProps(product.image, "48px")}
              alt=""
              style={{ backgroundColor: accent.soft }}
              className="h-12 w-12 shrink-0 object-contain p-1 mix-blend-multiply"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-heading truncate">{product.name}</p>
            <p className="text-xs text-on-surface/80">{size}</p>
          </div>
          <a
            href={url}
            target="_blank"
            rel={rel}
            className="min-h-11 shrink-0 inline-flex items-center gap-2 bg-olive-deep text-white px-4 text-xs font-semibold"
          >
            {label}
            <ArrowUpRight size={15} />
          </a>
        </div>
      )}
      {lightboxOpen && hasImage && (
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
