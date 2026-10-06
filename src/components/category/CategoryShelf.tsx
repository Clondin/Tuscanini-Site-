import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MoveHorizontal } from "lucide-react";
import type { Category } from "../../data/products";
import { shelfSizing } from "../../lib/packSize";
import { formatProductSize } from "../../lib/formatProductSize";
import { getResponsiveImageProps, isMissingProductImage } from "../../lib/productImage";
import CategoryBreadcrumbs from "./CategoryBreadcrumbs";
import ProductImagePlaceholder from "../ui/ProductImagePlaceholder";

interface CategoryShelfProps {
  category: Category;
}

export default function CategoryShelf({ category }: CategoryShelfProps) {
  const products = category.products;
  const [selectedId, setSelectedId] = useState(products[0]?.id);

  const sizing = useMemo(() => shelfSizing(products), [products]);
  const selected = products.find((p) => p.id === selectedId) ?? products[0];

  if (!selected) return null;

  const facts = [
    selected.size ? { label: "Size", value: formatProductSize(selected.size) } : null,
    selected.madeInItaly ? { label: "Origin", value: "Italy" } : null,
    selected.kosher ? { label: "Certification", value: "Kosher" } : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <>
      <section className="bg-earth-dark">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-11 pb-1 flex items-end justify-between gap-8">
          <div>
            <CategoryBreadcrumbs categoryName={category.name} />
            <h1 className="font-headline font-normal text-heading text-[clamp(2.5rem,5.2vw,3.625rem)] leading-none">
              {category.name}
            </h1>
            <p className="mt-4 font-script italic text-[clamp(1.1875rem,2vw,1.4375rem)] text-on-surface/65">
              {category.tagline}
            </p>
          </div>
          {products.length > 1 && (
            <span className="hidden md:inline-flex items-center gap-2.5 pb-2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface/50">
              Drag sideways
              <MoveHorizontal className="w-[15px] h-[15px]" />
            </span>
          )}
        </div>

        <p className="max-w-7xl mx-auto px-6 md:px-10 pt-4 text-[10px] uppercase tracking-[0.16em] text-on-surface/45">
          Scaled by pack size &mdash; tap one to pull it out
        </p>

        <div className="overflow-x-auto pt-5">
          <div className="flex flex-col w-max min-w-full">
            <div className="flex items-end px-6 md:px-10">
              {products.map((product) => {
                const { height, width } = sizing[product.id];
                const isSelected = product.id === selected.id;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedId(product.id)}
                    aria-pressed={isSelected}
                    aria-label={product.name}
                    style={{ width, height: 300 }}
                    className={`flex shrink-0 items-end justify-center border-0 bg-transparent px-5 cursor-pointer transition-opacity duration-200 ${
                      isSelected ? "opacity-100" : "opacity-60 hover:opacity-85"
                    }`}
                  >
                    {isMissingProductImage(product.image) ? (
                      <ProductImagePlaceholder productName={product.name} className="w-full min-h-40 border border-on-surface/10" />
                    ) : (
                      <img
                        {...getResponsiveImageProps(product.image, "240px")}
                        alt={product.name}
                        loading="lazy"
                        style={{ maxHeight: height }}
                        className="max-w-full w-auto object-contain drop-shadow-[0_16px_20px_rgba(42,31,22,0.24)]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-full shelf-edge" />

            <div className="flex px-6 md:px-10 pt-[18px] pb-2">
              {products.map((product) => {
                const { width } = sizing[product.id];
                const isSelected = product.id === selected.id;
                return (
                  <span
                    key={product.id}
                    style={{ width }}
                    className="shrink-0 px-5 text-center"
                  >
                    <span
                      className={`block font-headline text-[15px] leading-tight line-clamp-2 ${
                        isSelected ? "text-olive-accent" : "text-on-surface/75"
                      }`}
                    >
                      {product.name}
                    </span>
                    {product.size && (
                      <span className="mt-1.5 block text-[10px] tracking-[0.16em] text-on-surface/45">
                        {formatProductSize(product.size)}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-earth-dark px-6 md:px-10 pt-8 pb-14">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-11 items-center bg-surface border border-on-surface/12 p-9 md:px-10">
          <div className="aspect-square max-w-[280px] w-full mx-auto md:mx-0 flex items-center justify-center p-6 pack-well">
            {isMissingProductImage(selected.image) ? (
              <ProductImagePlaceholder productName={selected.name} className="w-full h-full text-xl" />
            ) : (
              <img
                {...getResponsiveImageProps(selected.image, "280px")}
                alt={selected.name}
                className="w-full h-full object-contain drop-shadow-[0_16px_22px_rgba(42,31,22,0.18)]"
              />
            )}
          </div>

          <div>
            <span className="block mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-olive-accent">
              Off the shelf
            </span>
            <h2 className="mb-3.5 font-headline font-normal text-heading text-[clamp(1.75rem,3.4vw,2.375rem)] leading-[1.08]">
              {selected.name}
            </h2>
            <p className="mb-[22px] text-base leading-[1.75] text-on-surface/70 max-w-[52ch] text-pretty">
              {selected.description}
            </p>

            {facts.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-9 py-[18px] border-y border-on-surface/14">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface/42">
                      {fact.label}
                    </p>
                    <p className="mt-[7px] font-headline text-[18px] text-heading">{fact.value}</p>
                  </div>
                ))}
              </div>
            )}

            <Link
              to={`/product/${selected.id}`}
              className="inline-flex items-center gap-2.5 px-7 py-[15px] bg-olive-accent text-white text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-olive-accent-dark transition-colors"
            >
              View this product
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
