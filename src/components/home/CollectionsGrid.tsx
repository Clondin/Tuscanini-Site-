import { categories } from "../../data/products";
import SectionHeading from "../ui/SectionHeading";
import CollectionCards from "../category/CollectionCards";

export default function CollectionsGrid() {
  const order = [
    "olive-oil",
    "pasta-gnocchi",
    "pasta-sauces",
    "chocolate",
    "beverages",
    "pizza",
  ];
  const featured = order.flatMap((slug) => {
    const category = categories.find((entry) => entry.slug === slug);
    return category ? [category] : [];
  });
  return (
    <section
      id="collections"
      className="bg-aged-cream px-5 md:px-10 py-12 md:py-16 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Find your favorites"
          title="Explore the pantry"
          action={{
            label: `All ${categories.length} collections`,
            to: "/products?view=collections",
          }}
          className="mb-8"
        />
        <CollectionCards categories={featured} />
        <div id="more-collections" className="scroll-mt-24 mt-8">
          <a
            href="/products?view=collections"
            className="min-h-11 inline-flex items-center text-sm font-semibold text-olive-deep underline underline-offset-4"
          >
            Discover all {categories.length} collections
          </a>
        </div>
      </div>
    </section>
  );
}
