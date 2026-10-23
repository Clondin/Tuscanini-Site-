import { KosherFeatureCard } from "../product/KosherFeatures";
import { useKosherData } from "../product/useKosherData";
import type { KosherFeature } from "../../data/kosherFeatures";
import KosherCredit from "../kosher/KosherCredit";

/** A strip of Kosher.com recipes and stories made with this category's products. Hidden when there are none. */
export default function KosherCategoryStrip({ productIds, categoryName }: { productIds: string[]; categoryName: string }) {
  const data = useKosherData();
  if (!data) return null;

  // Round-robin across the category's products so one product doesn't fill the strip.
  const lists = productIds.map((id) => data.getKosherFeaturesForProduct(id).filter((item) => item.image));
  const picked: KosherFeature[] = [];
  const seen = new Set<string>();
  for (let round = 0; picked.length < 4 && lists.some((list) => list.length > round); round++) {
    for (const list of lists) {
      const item = list[round];
      if (!item || seen.has(item.url)) continue;
      seen.add(item.url);
      picked.push(item);
      if (picked.length === 4) break;
    }
  }
  if (picked.length < 2) return null;

  return (
    <section aria-labelledby="kosher-category-heading" className="max-w-7xl mx-auto px-5 md:px-10 py-12">
      <div className="mb-6">
        <h2 id="kosher-category-heading" className="font-headline text-3xl md:text-4xl text-heading">
          From the Kosher.com kitchen
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-on-surface/80">
          Recipes and stories made with Tuscanini {categoryName.toLowerCase()}.
        </p>
        <KosherCredit className="mt-1" />
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {picked.map((item) => (
          <li key={item.url}>
            <KosherFeatureCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
