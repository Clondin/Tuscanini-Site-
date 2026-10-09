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

/** Option C: a ruled specification sheet, built for scanning and comparing. */
export default function ProductSpec({
  product,
  categoryName,
  categorySlug,
}: {
  product: Product;
  categoryName: string;
  categorySlug: string;
}) {
  const { state, buyingRef } = useProductDossier(product, categoryName);
  const poster = getPosterColor(categorySlug);
  const rows = [
    ...state.facts.map((fact) => ({ label: fact.label, value: fact.value })),
    ...(product.sku ? [{ label: "Item number", value: product.sku }] : []),
  ];
  return (
    <>
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-12">
        <div className="grid lg:grid-cols-12 border-t-[3px] border-ink">
          <div className="lg:col-span-7 lg:sticky lg:top-[75px] self-start pt-6 lg:pr-10">
            <div className="flex items-center justify-between border-b border-ink/15 pb-3">
              <Link
                to={`/category/${categorySlug}`}
                style={{ backgroundColor: poster.background }}
                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${poster.ink ? "text-ink" : "text-paper"}`}
              >
                {categoryName}
              </Link>
              {state.size && (
                <span className="text-sm tabular-nums text-on-surface/80">{state.size}</span>
              )}
            </div>
            <ProductImage
              product={product}
              state={state}
              className="w-full h-[320px] sm:h-[440px] lg:h-[min(600px,calc(100svh-200px))] py-10"
            />
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-ink pt-6 lg:pl-10">
            <h1 className="font-headline font-medium text-ink text-[clamp(2.5rem,4.2vw,4rem)] leading-[0.95] tracking-[-0.025em]">
              {product.name}
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-on-surface/90">
              {product.description}
            </p>

            <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-ink">
              Specifications
            </h2>
            <dl className="mt-3 border-t-2 border-ink">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[9rem_1fr] gap-4 border-b border-ink/15 py-3 text-sm"
                >
                  <dt className="text-on-surface/70">{row.label}</dt>
                  <dd className="font-semibold text-ink tabular-nums">{row.value}</dd>
                </div>
              ))}
            </dl>

            <BuyActions state={state} buyRef={buyingRef} className="mt-8" />
            <ProductDisclosures product={product} className="mt-8" />
            <AffiliateNote state={state} />
          </div>
        </div>
      </section>
      <DossierOverlays
        product={product}
        state={state}
        swatch={getCategoryAccent(categorySlug).soft}
      />
    </>
  );
}
