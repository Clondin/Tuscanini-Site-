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
 * Option M: an old Italian grocery label. Details are set centered inside a
 * double-ruled frame in the aisle color, beside the pack on its soft tint.
 */
export default function ProductLabel({
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
  const rule = getPosterColor(categorySlug).background;
  return (
    <>
      <section style={{ backgroundColor: accent.soft }} className="px-5 md:px-10 py-10 md:py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <ProductImage
            product={product}
            state={state}
            className="w-full h-[320px] sm:h-[440px] lg:h-[580px]"
          />
          <div
            style={{ borderColor: rule }}
            className="bg-paper border-[3px] p-1.5 shadow-[0_24px_40px_-24px_rgba(20,18,16,0.45)]"
          >
            <div
              style={{ borderColor: rule }}
              className="border px-6 md:px-12 py-10 md:py-12 text-center"
            >
              <Link
                to={`/category/${categorySlug}`}
                className="text-xs font-semibold uppercase tracking-[0.32em] text-ink/80 underline-offset-4 hover:underline"
              >
                {categoryName}
              </Link>
              <div aria-hidden="true" className="mx-auto mt-5 flex items-center justify-center gap-3">
                <span style={{ backgroundColor: rule }} className="h-px w-12" />
                <span style={{ backgroundColor: rule }} className="h-1.5 w-1.5 rotate-45" />
                <span style={{ backgroundColor: rule }} className="h-px w-12" />
              </div>
              <h1 className="mt-5 font-headline font-medium text-ink text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[0.95] tracking-[-0.02em]">
                {product.name}
              </h1>
              {state.size && (
                <p className="mt-4 font-headline italic text-2xl text-ink/80">{state.size}</p>
              )}
              <p className="mx-auto mt-6 max-w-[44ch] text-base leading-relaxed text-on-surface/90">
                {product.description}
              </p>
              <ul className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/80">
                {state.facts
                  .filter((fact) => fact.label !== "Pack size" && fact.label !== "Collection")
                  .map((fact) => (
                    <li key={fact.label}>{fact.value}</li>
                  ))}
              </ul>
              <BuyActions
                state={state}
                buyRef={buyingRef}
                className="mt-8 flex flex-col items-center [&>div]:justify-center"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-paper px-5 md:px-10 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <ProductDisclosures product={product} />
          <AffiliateNote state={state} />
        </div>
      </section>
      <DossierOverlays product={product} state={state} swatch={accent.soft} />
    </>
  );
}
