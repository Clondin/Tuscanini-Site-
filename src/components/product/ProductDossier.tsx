import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../data/products";
import { getCategoryAccent } from "../../data/category-accents";
import { useProductDossier } from "./useProductDossier";
import {
  AffiliateNote,
  BuyActions,
  DossierOverlays,
  ProductDisclosures,
  ProductImage,
} from "./ProductParts";

/** Default product layout: tinted image panel beside the details. */
export default function ProductDossier({
  product,
  categoryName,
  categorySlug,
}: {
  product: Product;
  categoryName: string;
  categorySlug: string;
}) {
  const { state, buyingRef } = useProductDossier(product, categoryName);
  const accent = getCategoryAccent(categorySlug);
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
          {state.size && <p className="text-lg text-on-surface/80">{state.size}</p>}
        </div>

        <div
          style={{ backgroundColor: accent.soft }}
          className="relative lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 overflow-hidden ring-1 ring-inset ring-heading/5"
        >
          <ProductImage
            product={product}
            state={state}
            className="w-full h-[300px] sm:h-[400px] lg:h-[min(620px,calc(100svh-140px))] px-10 pt-10 pb-12"
          />
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <p className="text-base md:text-lg text-on-surface/85 leading-relaxed">
            {product.description}
          </p>
          <dl className="mt-7 grid grid-cols-2 gap-px bg-on-surface/12 border border-on-surface/12">
            {state.facts.map((fact) => (
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
          <BuyActions state={state} buyRef={buyingRef} className="mt-7" />
          <ProductDisclosures product={product} className="mt-8" />
          <AffiliateNote state={state} />
          <Link
            to={`/category/${categorySlug}`}
            className="inline-flex min-h-11 mt-3 items-center text-sm font-semibold text-olive-deep underline underline-offset-4"
          >
            Back to {categoryName}
          </Link>
        </div>
      </section>
      <DossierOverlays product={product} state={state} swatch={accent.soft} />
    </>
  );
}
