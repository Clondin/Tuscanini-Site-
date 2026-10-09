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

/** Option A: the pack on a full-bleed aisle-color field, details on paper. */
export default function ProductPoster({
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
  return (
    <>
      <section className="grid lg:grid-cols-2 items-start">
        <div
          style={{ backgroundColor: poster.background }}
          className={`relative lg:sticky lg:top-[75px] lg:h-[calc(100svh-75px)] flex flex-col ${poster.ink ? "text-ink" : "text-paper"}`}
        >
          <Link
            to={`/category/${categorySlug}`}
            className="relative z-10 m-5 md:m-8 self-start text-xs font-semibold uppercase tracking-[0.28em] underline-offset-4 hover:underline"
          >
            {categoryName}
          </Link>
          <div className="relative flex-1 flex items-end justify-center px-10 pb-12 md:pb-16">
            <span
              aria-hidden="true"
              className="absolute bottom-10 md:bottom-14 left-1/2 h-8 w-1/2 -translate-x-1/2 rounded-[50%] bg-black/35 blur-xl"
            />
            <ProductImage
              product={product}
              state={state}
              multiply={false}
              className="w-full h-[320px] sm:h-[440px] lg:h-[min(560px,calc(100svh-260px))]"
              imageClassName="drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)]"
            />
          </div>
        </div>

        <div className="bg-paper px-5 md:px-12 xl:px-16 py-10 md:py-16 lg:min-h-[calc(100svh-75px)] flex flex-col justify-center">
          <h1 className="font-headline font-medium text-ink text-[clamp(3rem,5.6vw,5.75rem)] leading-[0.9] tracking-[-0.03em]">
            {product.name}
          </h1>
          {state.size && (
            <p className="mt-5 text-xl text-on-surface/80">{state.size}</p>
          )}
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-on-surface/90">
            {product.description}
          </p>
          <dl className="mt-8 max-w-xl border-t border-ink">
            {state.facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-baseline justify-between gap-6 border-b border-ink/15 py-3.5"
              >
                <dt className="text-xs uppercase tracking-[0.2em] text-on-surface/70">
                  {fact.label}
                </dt>
                <dd className="text-base font-semibold text-ink text-right">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
          <BuyActions state={state} buyRef={buyingRef} className="mt-9" />
          <ProductDisclosures product={product} className="mt-10 max-w-xl" />
          <AffiliateNote state={state} />
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
