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
 * Option K: a three-column spec sheet on paper. Name and description on the
 * left, the pack centered between hairline rules, facts and buying on the right.
 */
export default function ProductSpecSheet({
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
  const poster = getPosterColor(categorySlug);
  return (
    <>
      <section className="bg-paper px-5 md:px-10 py-10 md:py-14">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.15fr_1fr] border-y border-ink">
          <div className="py-8 lg:py-12 lg:pr-10 flex flex-col">
            <Link
              to={`/category/${categorySlug}`}
              className="self-start inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-ink underline-offset-4 hover:underline"
            >
              <span aria-hidden="true" style={{ backgroundColor: poster.background }} className="h-3 w-3 rounded-full" />
              {categoryName}
            </Link>
            <h1 className="mt-6 font-headline font-medium text-ink text-[clamp(2.5rem,4.2vw,4.25rem)] leading-[0.92] tracking-[-0.03em]">
              {product.name}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-on-surface/90 lg:mt-auto lg:pt-10">
              {product.description}
            </p>
          </div>
          <div className="border-y lg:border-y-0 lg:border-x border-ink/20 flex items-end justify-center px-8 py-10">
            <ProductImage
              product={product}
              state={state}
              className="w-full h-[320px] sm:h-[420px] lg:h-[520px]"
            />
          </div>
          <div className="py-8 lg:py-12 lg:pl-10 flex flex-col">
            <dl className="border-t border-ink">
              {state.facts.map((fact) => (
                <div key={fact.label} className="border-b border-ink/15 py-3.5">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-on-surface/70">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-headline text-2xl text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <BuyActions state={state} buyRef={buyingRef} className="mt-8 lg:mt-auto lg:pt-10" />
            <AffiliateNote state={state} />
          </div>
        </div>
        <ProductDisclosures product={product} className="max-w-3xl mx-auto mt-12" />
      </section>
      <DossierOverlays product={product} state={state} swatch={accent.soft} />
    </>
  );
}
