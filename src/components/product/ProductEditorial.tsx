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

/** Option B: a centered magazine spread with the pack on a colored stage. */
export default function ProductEditorial({
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
      <section className="px-5 md:px-10 pt-10 md:pt-16 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto text-center">
          <Link
            to={`/category/${categorySlug}`}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-tomato underline-offset-4 hover:underline"
          >
            {categoryName}
          </Link>
          <h1 className="mt-5 mx-auto max-w-[14ch] font-headline font-medium text-ink text-[clamp(3rem,8vw,7.75rem)] leading-[0.88] tracking-[-0.035em]">
            {product.name}
          </h1>
          {state.size && (
            <p className="mt-6 font-headline italic text-2xl text-on-surface/80">
              {state.size}
            </p>
          )}
        </div>

        <div className="relative max-w-4xl mx-auto mt-8 md:mt-10 h-[320px] sm:h-[400px] md:h-[440px]">
          <div
            aria-hidden="true"
            style={{ backgroundColor: poster.background }}
            className="absolute left-1/2 bottom-0 h-[86%] aspect-square -translate-x-1/2 rounded-full"
          />
          <ProductImage
            product={product}
            state={state}
            multiply={false}
            className="relative h-full w-full pb-6"
            imageClassName="drop-shadow-[0_30px_35px_rgba(20,18,16,0.3)]"
          />
        </div>

        <div className="max-w-5xl mx-auto mt-12 md:mt-16 grid gap-8 md:grid-cols-[1.3fr_1fr] md:gap-14 border-t border-ink pt-8 md:pt-10">
          <p className="font-headline text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.3] text-ink text-pretty">
            {product.description}
          </p>
          <BuyActions state={state} buyRef={buyingRef} className="md:justify-self-end md:text-right" />
        </div>

        <dl className="max-w-5xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 border-y border-ink/15 divide-x divide-ink/15">
          {state.facts.map((fact) => (
            <div key={fact.label} className="px-4 py-6 text-center">
              <fact.icon size={20} aria-hidden="true" className="mx-auto mb-3 text-tomato" />
              <dt className="text-[11px] uppercase tracking-[0.2em] text-on-surface/70">
                {fact.label}
              </dt>
              <dd className="mt-1.5 font-headline text-lg md:text-xl text-ink">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="max-w-3xl mx-auto mt-10">
          <ProductDisclosures product={product} />
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
