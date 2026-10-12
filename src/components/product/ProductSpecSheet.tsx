import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../data/products";
import { getCategoryAccent, getPosterColor } from "../../data/category-accents";
import { getResponsiveImageProps } from "../../lib/productImage";
import { useProductDossier } from "./useProductDossier";
import {
  AffiliateNote,
  BuyActions,
  DossierOverlays,
  ProductDisclosures,
  ProductImage,
} from "./ProductParts";

type Variant = "base" | "tint" | "masthead" | "sheet";

interface Props {
  product: Product;
  categoryName: string;
  categorySlug: string;
}

/**
 * Option K and its iterations: a three-column spec sheet on paper between
 * hairline rules. `tint` sets the pack on its aisle tint, `masthead` runs the
 * name across the full sheet, `sheet` prints the label details open below.
 */
function SpecSheet({
  product,
  categoryName,
  categorySlug,
  variant,
}: Props & { variant: Variant }) {
  const { state, buyingRef } = useProductDossier(product, categoryName);
  const accent = getCategoryAccent(categorySlug);
  const poster = getPosterColor(categorySlug);
  const masthead = variant === "masthead";

  const category = (
    <Link
      to={`/category/${categorySlug}`}
      className="self-start inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-ink underline-offset-4 hover:underline"
    >
      <span aria-hidden="true" style={{ backgroundColor: poster.background }} className="h-3 w-3 rounded-full" />
      {categoryName}
    </Link>
  );
  const title = (
    <h1
      className={`font-headline font-medium text-ink tracking-[-0.03em] ${
        masthead
          ? "text-[clamp(3rem,8vw,8rem)] leading-[0.86]"
          : "mt-6 text-[clamp(2.5rem,4.2vw,4.25rem)] leading-[0.92]"
      }`}
    >
      {product.name}
    </h1>
  );

  return (
    <>
      <section className="bg-paper px-5 md:px-10 py-10 md:py-14">
        <div className="max-w-7xl mx-auto">
          {variant === "sheet" && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-ink text-paper px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em]">
              <span>Tuscanini</span>
              <span>{categoryName}</span>
              {state.size && <span>{state.size}</span>}
            </div>
          )}
          {masthead && (
            <div className="border-t border-ink pt-6 pb-8 md:pb-10">
              {category}
              <div className="mt-5">{title}</div>
            </div>
          )}
          <div
            className={`grid lg:grid-cols-[1fr_1.15fr_1fr] border-y border-ink ${
              variant === "sheet" ? "border-t-0" : ""
            }`}
          >
            <div className="py-8 lg:py-12 lg:pr-10 flex flex-col">
              {!masthead && (
                <>
                  {category}
                  {title}
                </>
              )}
              <p
                className={`${
                  masthead
                    ? "font-headline text-[clamp(1.4rem,2vw,1.85rem)] leading-[1.3] text-ink"
                    : "mt-6 text-base leading-relaxed text-on-surface/90 lg:mt-auto lg:pt-10"
                }`}
              >
                {product.description}
              </p>
            </div>
            <div
              style={variant === "tint" ? { backgroundColor: accent.soft } : undefined}
              className="border-y lg:border-y-0 lg:border-x border-ink/20 flex items-end justify-center px-8 py-10"
            >
              <ProductImage
                product={product}
                state={state}
                className="w-full h-[320px] sm:h-[420px] lg:h-[520px]"
              />
            </div>
            <div className="py-8 lg:py-12 lg:pl-10 flex flex-col">
              <dl className="border-t border-ink">
                {state.facts
                  .filter((fact) => variant !== "sheet" || fact.label !== "Collection")
                  .map((fact) => (
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
          {variant === "sheet" ? (
            <LabelDetails product={product} />
          ) : (
            <ProductDisclosures product={product} className="max-w-3xl mx-auto mt-12" />
          )}
        </div>
      </section>
      <DossierOverlays product={product} state={state} swatch={accent.soft} />
    </>
  );
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="py-8 md:px-8 md:first:pl-0 md:last:pr-0">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-on-surface/90">{children}</div>
    </div>
  );
}

/** The label details printed open in columns, each shown only when recorded. */
function LabelDetails({ product }: { product: Product }) {
  const hasPrep = Boolean(product.preparation?.length || product.storage);
  const hasNutrition = Boolean(
    product.nutritionImage ||
      product.nutritionFacts?.length ||
      product.nutritionServing ||
      product.nutritionCalories,
  );
  if (!product.ingredients && !hasPrep && !hasNutrition) return null;
  return (
    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/15 border-b border-ink">
      {product.ingredients && (
        <Column title="Ingredients">
          <p>{product.ingredients}</p>
          <p className="text-xs text-on-surface/75">
            Check the packaging for the latest ingredient and allergen information.
          </p>
        </Column>
      )}
      {hasPrep && (
        <Column title={product.storage ? "Preparation & storage" : "Preparation"}>
          {product.preparation?.map((step, index) => (
            <p key={index}>{step.replace(/\s*\|\s*/, ": ")}</p>
          ))}
          {product.storage && <p>{product.storage}</p>}
        </Column>
      )}
      {hasNutrition && (
        <Column title="Nutrition">
          {product.nutritionServing && <p>Serving size: {product.nutritionServing}</p>}
          {product.nutritionCalories && <p>Calories: {product.nutritionCalories}</p>}
          {product.nutritionFacts?.map((fact, index) => (
            <p key={index}>{fact.replace(/\s*\|\s*/, ": ")}</p>
          ))}
          {product.nutritionImage && (
            <img
              {...getResponsiveImageProps(product.nutritionImage, "(min-width: 768px) 33vw, 100vw")}
              alt={`Nutrition facts for ${product.name}`}
              loading="lazy"
              className="w-full max-w-xs h-auto"
            />
          )}
          <p className="text-xs text-on-surface/75">
            Refer to the packaging for the latest nutrition information.
          </p>
        </Column>
      )}
    </div>
  );
}

export default function ProductSpecSheet(props: Props) {
  return <SpecSheet {...props} variant="base" />;
}
export function ProductSpecTint(props: Props) {
  return <SpecSheet {...props} variant="tint" />;
}
export function ProductSpecMasthead(props: Props) {
  return <SpecSheet {...props} variant="masthead" />;
}
export function ProductSpecLabelSheet(props: Props) {
  return <SpecSheet {...props} variant="sheet" />;
}
