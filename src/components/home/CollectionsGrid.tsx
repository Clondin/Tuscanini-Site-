import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import ImageWithSkeleton from "../ui/ImageWithSkeleton";
import { categories } from "../../data/products";

const featuredCategorySlugs = [
  "olive-oil",
  "pasta-gnocchi",
  "pasta-sauces",
  "canned-tomatoes",
  "vinegars-glazes",
  "chocolate",
  "pizza",
  "beverages",
  "bread-frozen-appetizers",
  "olives",
  "italian-condiments",
  "potato-chips",
  "chestnuts",
  "tuna-seafood",
  "cooking-wines-citrus",
  "flour-baking",
  "pesto",
  "seasonings-truffles",
  "fruit-spreads",
  "cheese",
];
const featuredOrder = new Map(featuredCategorySlugs.map((slug, index) => [slug, index]));

export default function CollectionsGrid() {
  const [showAll, setShowAll] = useState(false);
  const collections = [...categories].sort(
    (left, right) => (featuredOrder.get(left.slug) ?? Number.MAX_SAFE_INTEGER) - (featuredOrder.get(right.slug) ?? Number.MAX_SAFE_INTEGER),
  );
  const visibleCollections = showAll ? collections : collections.slice(0, 9);

  return (
    <section id="collections" className="bg-aged-cream py-20 md:py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="The Pantry"
          title="Curated Collections"
          action={collections.length > 9 ? {
            label: showAll ? "Show fewer collections" : `All ${collections.length} collections`,
            onClick: () => setShowAll((expanded) => !expanded),
            expanded: showAll,
            controls: "collection-cards",
          } : undefined}
          className="mb-11"
        />

        <div id="collection-cards" className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-9">
          {visibleCollections.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: idx * 0.06, duration: 0.55 }}
            >
              <Link to={`/category/${cat.slug}`} className="group block text-inherit">
                <div className="aspect-[4/3] bg-surface border border-on-surface/10 flex items-center justify-center overflow-hidden">
                  <ImageWithSkeleton
                    className="w-full h-full object-contain p-5 md:p-[26px] drop-shadow-[0_12px_18px_rgba(42,31,22,0.14)] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    wrapperClassName="w-full h-full"
                    skeletonClassName="aspect-auto"
                    src={cat.heroImage}
                    alt={cat.name}
                    sizes="(min-width: 1024px) 400px, 50vw"
                  />
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-headline font-normal text-lg md:text-[21px] text-heading group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-[13px] text-on-surface/60">{cat.tagline}</p>
                  </div>
                  <ArrowRight className="w-[18px] h-[18px] shrink-0 text-primary/75 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
