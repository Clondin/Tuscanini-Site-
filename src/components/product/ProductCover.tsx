import { Link } from "react-router-dom";
import type { Product } from "../../data/products";
import { getCategoryAccent, getPosterColor } from "../../data/category-accents";
import { opaquePackShots } from "../../data/opaque-pack-shots.generated";
import { useProductDossier } from "./useProductDossier";
import {
  AffiliateNote,
  BuyActions,
  DossierOverlays,
  ProductDisclosures,
  ProductImage,
} from "./ProductParts";

/**
 * Option J: a magazine cover. The name runs large and centered above the
 * pack on the aisle color, with the facts as a strip along the bottom.
 */
export default function ProductCover({
  product,
  categoryName,
  categorySlug,
}: {
  product: Product;
  categoryName: string;
  categorySlug: string;
}) {
  const { state, buyingRef } = useProductDossier(product, categoryName);
  const opaque = opaquePackShots.has(product.image);
  const accent = getCategoryAccent(categorySlug);
  const poster = opaque
    ? { background: accent.soft, ink: true }
    : getPosterColor(categorySlug);
  return (
    <>
      <section
        style={{ backgroundColor: poster.background }}
        className={`overflow-hidden ${poster.ink ? "text-ink" : "text-paper"}`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-10 md:pt-14 text-center">
          <Link
            to={`/category/${categorySlug}`}
            className="text-xs font-semibold uppercase tracking-[0.28em] underline-offset-4 hover:underline"
          >
            {categoryName}
          </Link>
          <h1 className="mx-auto mt-5 max-w-[14ch] font-headline font-medium text-[clamp(3rem,8.5vw,8.5rem)] leading-[0.86] tracking-[-0.04em]">
            {product.name}
          </h1>
          <div className="relative mx-auto mt-6 md:mt-8 max-w-3xl">
            <span
              aria-hidden="true"
              className="absolute bottom-3 left-1/2 h-8 w-1/2 -translate-x-1/2 rounded-[50%] bg-black/30 blur-xl"
            />
            <ProductImage
              product={product}
              state={state}
              multiply={opaque}
              className="w-full h-[280px] sm:h-[400px] lg:h-[480px] pb-6"
              imageClassName={opaque ? "" : "drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)]"}
            />
          </div>
        </div>
        <div className="border-t border-current/25">
          <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col lg:flex-row lg:items-center gap-6 py-6">
            <dl className="flex flex-1 flex-wrap gap-y-4">
              {state.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="basis-1/2 sm:basis-auto sm:flex-1 sm:border-l sm:border-current/25 sm:px-5 sm:first:border-l-0 sm:first:pl-0"
                >
                  <dt className="text-[11px] uppercase tracking-[0.2em] opacity-80">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-headline text-xl md:text-2xl">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
            <BuyActions
              state={state}
              buyRef={buyingRef}
              tone={poster.ink ? "paper" : "dark"}
              className="shrink-0"
            />
          </div>
        </div>
      </section>
      <section className="bg-paper px-5 md:px-10 py-14 md:py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
          <p className="font-headline text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.2] text-ink">
            {product.description}
          </p>
          <div>
            <ProductDisclosures product={product} />
            <AffiliateNote state={state} />
          </div>
        </div>
      </section>
      <DossierOverlays product={product} state={state} swatch={accent.soft} />
    </>
  );
}
