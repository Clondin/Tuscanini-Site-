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

/** Option H: a contained studio layout, the pack on a soft tint beside its details. */
export default function ProductStudio({
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
      <section className="bg-paper px-5 md:px-10 pt-6 pb-14 md:pt-12 md:pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 items-start">
          <div
            style={{ backgroundColor: accent.soft }}
            className="relative aspect-square lg:sticky lg:top-[100px] flex items-end justify-center p-10 md:p-16"
          >
            <ProductImage product={product} state={state} className="h-full w-full" />
          </div>
          <div className="lg:py-8">
            <Link
              to={`/category/${categorySlug}`}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-tomato underline-offset-4 hover:underline"
            >
              {categoryName}
            </Link>
            <h1 className="mt-4 font-headline font-medium text-ink text-[clamp(2.5rem,4.6vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
              {product.name}
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-on-surface/90">
              {product.description}
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {state.facts.map(({ label, value, icon: Icon }) => (
                <li
                  key={label}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-sm text-ink"
                >
                  <Icon size={15} aria-hidden="true" className="text-on-surface/70" />
                  <span className="sr-only">{label}: </span>
                  {value}
                </li>
              ))}
            </ul>
            <BuyActions state={state} buyRef={buyingRef} className="mt-9" />
            <ProductDisclosures product={product} className="mt-10" />
            <AffiliateNote state={state} />
          </div>
        </div>
      </section>
      <DossierOverlays product={product} state={state} swatch={accent.soft} />
    </>
  );
}
