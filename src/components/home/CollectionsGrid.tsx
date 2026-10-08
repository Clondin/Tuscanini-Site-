import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "../../data/products";
import { isMissingProductImage } from "../../lib/productImage";
import SectionHeading from "../ui/SectionHeading";
import CollectionTile from "../category/CollectionTile";

/** First entry is the oversized feature tile; the last one spans two columns. */
const order = [
  "pasta-sauces",
  "olive-oil",
  "pasta-gnocchi",
  "chocolate",
  "beverages",
  "pizza",
];

export default function CollectionsGrid() {
  const featured = order.flatMap((slug) => {
    const category = categories.find((entry) => entry.slug === slug);
    return category ? [category] : [];
  });
  const productCount = categories.reduce(
    (total, category) =>
      total +
      category.products.filter((product) => !isMissingProductImage(product.image))
        .length,
    0,
  );
  const last = featured.length - 1;
  return (
    <section
      id="collections"
      className="bg-aged-cream px-5 md:px-10 py-14 md:py-20 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Shop by aisle"
          title="Browse by category"
          action={{
            label: `All ${categories.length} collections`,
            to: "/products?view=collections",
          }}
          className="mb-8 md:mb-10"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[210px] md:auto-rows-[250px] gap-3 md:gap-5">
          {featured.map((category, index) => (
            <CollectionTile
              key={category.slug}
              category={category}
              feature={index === 0}
              className={
                index === 0
                  ? "col-span-2 row-span-2"
                  : index === last
                    ? "col-span-2"
                    : ""
              }
            />
          ))}
          <Link
            id="more-collections"
            to="/products?view=collections"
            aria-label={`View all ${categories.length} collections`}
            className="group col-span-2 scroll-mt-24 relative overflow-hidden bg-dark text-aged-cream p-6 md:p-8 flex flex-col justify-between"
          >
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-gold/20 transition-transform duration-700 group-hover:scale-110"
            />
            <div
              aria-hidden="true"
              className="absolute -right-4 -top-4 w-40 h-40 rounded-full border border-gold/30 transition-transform duration-700 group-hover:scale-110"
            />
            <p className="relative text-[11px] uppercase tracking-[0.22em] text-gold">
              {categories.length} collections · {productCount} products
            </p>
            <div className="relative flex items-end justify-between gap-4">
              <p className="font-headline text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight max-w-[14ch]">
                View all {categories.length} collections
              </p>
              <span className="shrink-0 w-12 h-12 rounded-full bg-gold text-dark flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={20} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
