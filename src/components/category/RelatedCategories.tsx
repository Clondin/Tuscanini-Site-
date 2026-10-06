import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Category } from "../../data/products";
import { shelfSizing } from "../../lib/packSize";
import { getResponsiveImageProps, isMissingProductImage } from "../../lib/productImage";
import SectionHeading from "../ui/SectionHeading";
import ProductImagePlaceholder from "../ui/ProductImagePlaceholder";

interface RelatedCategoriesProps {
  currentCategoryId: string;
  allCategories: Category[];
}

const PREVIEW_COUNT = 4;

function MiniShelf({ category }: { category: Category }) {
  const preview = category.products.slice(0, PREVIEW_COUNT);
  const sizing = useMemo(
    () => shelfSizing(preview, { base: 150, min: 100, max: 200 }),
    [preview],
  );

  if (preview.length === 0) return null;

  return (
    <div className="pt-[30px]">
      <div className="mb-3 flex items-end justify-between gap-6">
        <Link
          to={`/category/${category.slug}`}
          className="font-headline text-[23px] text-heading hover:text-primary transition-colors"
        >
          {category.name}
        </Link>
        <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-on-surface/80">
          {category.products.length}{" "}
          {category.products.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex items-end overflow-x-auto px-1">
        {preview.map((product) => {
          const { height, width } = sizing[product.id];
          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              aria-label={product.name}
              style={{ width, height: 200 }}
              className="flex shrink-0 items-end justify-center px-3.5 group"
            >
              {isMissingProductImage(product.image) ? (
                <ProductImagePlaceholder productName={product.name} className="w-full min-h-32 border border-on-surface/10" />
              ) : (
                <img
                  {...getResponsiveImageProps(product.image, "200px")}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  style={{ maxHeight: height }}
                  className="max-w-full w-auto object-contain drop-shadow-[0_12px_16px_rgba(42,31,22,0.2)] group-hover:-translate-y-1 transition-transform duration-300"
                />
              )}
            </Link>
          );
        })}
      </div>
      <div className="h-3 shelf-edge" />
    </div>
  );
}

export default function RelatedCategories({
  currentCategoryId,
  allCategories,
}: RelatedCategoriesProps) {
  const relatedCategories = useMemo(() => {
    // Deterministic rotation, not a shuffle — a random order would differ between
    // the server-rendered HTML and the client, and re-order on every re-render.
    const others = allCategories
      .filter(
        (category) =>
          category.id !== currentCategoryId && category.products.length > 0,
      )
      .sort((left, right) => left.name.localeCompare(right.name));
    const offset = [...currentCategoryId].reduce(
      (total, char) => total + char.charCodeAt(0),
      0,
    );
    const pivot = offset % Math.max(others.length, 1);
    return [...others.slice(pivot), ...others.slice(0, pivot)].slice(0, 3);
  }, [currentCategoryId, allCategories]);

  if (relatedCategories.length === 0) return null;

  return (
    <section className="bg-earth-dark py-16 md:py-[72px] px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="More collections"
          rule="ink"
          action={{
            label: `All ${allCategories.length}`,
            to: "/products?view=collections",
          }}
        />
        {relatedCategories.map((category) => (
          <MiniShelf key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
