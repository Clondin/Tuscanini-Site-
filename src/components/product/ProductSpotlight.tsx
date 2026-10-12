import { Link } from "react-router-dom";
import type { Product } from "../../data/products";
import { getCategoryAccent, getPosterColor } from "../../data/category-accents";
import { opaquePackShots } from "../../data/opaque-pack-shots.generated";
import { useProductDossier } from "./useProductDossier";
import {
  BuyActions,
  DossierOverlays,
  ProductDisclosures,
  ProductImage,
} from "./ProductParts";

/**
 * Option L: a dark gallery. The pack is lit by a pool of its aisle color on
 * ink, with paper type. Opaque photos sit on a soft-tint plinth instead.
 */
export default function ProductSpotlight({
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
  const glow = getPosterColor(categorySlug).background;
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-paper">
        <div
          aria-hidden="true"
          style={{ background: `radial-gradient(closest-side, ${glow}, transparent)` }}
          className="absolute left-1/2 lg:left-[30%] top-[38%] lg:top-1/2 h-[520px] w-[520px] lg:h-[820px] lg:w-[820px] -translate-x-1/2 -translate-y-1/2 opacity-70"
        />
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-16 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div
            style={opaque ? { backgroundColor: accent.soft } : undefined}
            className={`relative flex items-end justify-center ${opaque ? "p-8" : ""}`}
          >
            {!opaque && (
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-[50%] bg-black/60 blur-lg"
              />
            )}
            <ProductImage
              product={product}
              state={state}
              multiply={opaque}
              className="w-full h-[320px] sm:h-[440px] lg:h-[560px]"
              imageClassName={opaque ? "" : "drop-shadow-[0_40px_50px_rgba(0,0,0,0.5)]"}
            />
          </div>
          <div>
            <Link
              to={`/category/${categorySlug}`}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-lemon underline-offset-4 hover:underline"
            >
              {categoryName}
            </Link>
            <h1 className="mt-5 font-headline font-medium text-[clamp(2.75rem,5.2vw,5.25rem)] leading-[0.92] tracking-[-0.03em]">
              {product.name}
            </h1>
            {state.size && <p className="mt-4 text-xl text-paper/75">{state.size}</p>}
            <p className="mt-7 max-w-[50ch] text-lg leading-relaxed text-paper/85">
              {product.description}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-px bg-paper/15 max-w-lg">
              {state.facts
                .filter((fact) => fact.label !== "Pack size")
                .map((fact) => (
                  <div key={fact.label} className="bg-ink px-4 py-3.5">
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-paper/60">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-base font-semibold">{fact.value}</dd>
                  </div>
                ))}
            </dl>
            <BuyActions state={state} buyRef={buyingRef} tone="dark" className="mt-9" />
            {state.purchase.sponsored && (
              <p className="mt-5 text-xs leading-relaxed text-paper/70">
                As an Amazon Associate, Tuscanini may earn from qualifying purchases.
              </p>
            )}
          </div>
        </div>
      </section>
      <section className="bg-paper px-5 md:px-10 py-12 md:py-16">
        <ProductDisclosures product={product} className="max-w-3xl mx-auto" />
      </section>
      <DossierOverlays product={product} state={state} swatch={accent.soft} />
    </>
  );
}
