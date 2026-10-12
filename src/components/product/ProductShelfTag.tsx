import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../data/products";
import { getCategoryAccent, getPosterColor } from "../../data/category-accents";
import { useProductDossier } from "./useProductDossier";
import {
  AffiliateNote,
  BuyActions,
  DossierOverlays,
  ProductDisclosures,
  ProductImage,
} from "./ProductParts";

/**
 * Option I: the pack stands on the same store shelf as the category pages,
 * and its shelf tag carries the size, facts, and buy link.
 */
export default function ProductShelfTag({
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
  const stripe = getPosterColor(categorySlug).background;
  return (
    <>
      <section className="bg-paper">
        <div style={{ backgroundColor: accent.soft }} className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.55),transparent)]"
          />
          <div className="relative max-w-7xl mx-auto px-5 md:px-10 pt-8 md:pt-12 grid lg:grid-cols-[1.15fr_1fr] gap-x-16 items-end">
            <div className="lg:order-2 pb-8 lg:pb-16">
              <Link
                to={`/category/${categorySlug}`}
                className="text-xs font-semibold uppercase tracking-[0.28em] text-ink/80 underline-offset-4 hover:underline"
              >
                {categoryName}
              </Link>
              <h1 className="mt-4 font-headline font-medium text-ink text-[clamp(2.75rem,5vw,5rem)] leading-[0.92] tracking-[-0.03em]">
                {product.name}
              </h1>
              <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-on-surface/90">
                {product.description}
              </p>
            </div>
            <ProductImage
              product={product}
              state={state}
              className="lg:order-1 w-full h-[300px] sm:h-[400px] lg:h-[500px] px-6"
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="relative h-4 bg-ink shadow-[0_14px_18px_-10px_rgba(20,18,16,0.6)]"
        />
        <div className="max-w-7xl mx-auto px-5 md:px-10 pb-16 md:pb-20 grid lg:grid-cols-[1.15fr_1fr] gap-x-16 gap-y-10">
          <div
            style={{ "--tag-stripe": stripe } as CSSProperties}
            className="mx-auto w-full max-w-md border-t-[6px] border-[var(--tag-stripe)] bg-white px-6 md:px-8 pt-6 pb-7 shadow-[0_18px_30px_-16px_rgba(20,18,16,0.45)]"
          >
            {state.size && (
              <p className="font-headline text-4xl text-ink">{state.size}</p>
            )}
            <dl className="mt-4 border-t border-ink/15">
              {state.facts
                .filter((fact) => fact.label !== "Pack size")
                .map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-2.5"
                  >
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-on-surface/70">
                      {fact.label}
                    </dt>
                    <dd className="text-sm font-semibold text-ink text-right">
                      {fact.value}
                    </dd>
                  </div>
                ))}
            </dl>
            <BuyActions state={state} buyRef={buyingRef} className="mt-6" />
          </div>
          <div className="lg:pt-10">
            <ProductDisclosures product={product} />
            <AffiliateNote state={state} />
          </div>
        </div>
      </section>
      <DossierOverlays product={product} state={state} swatch={accent.soft} />
    </>
  );
}
