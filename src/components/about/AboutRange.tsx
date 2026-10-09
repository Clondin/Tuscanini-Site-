import { Link } from "react-router-dom";
import { categories, type Product } from "../../data/products";
import { collectionGroups } from "../../data/collection-groups";
import { getPosterColor } from "../../data/category-accents";
import { isMissingProductImage } from "../../lib/productImage";
import PackFan from "../ui/PackFan";

/**
 * Rotates through the aisle's collections so the fan shows its spread; an aisle
 * with a single collection still gets three different packs.
 */
function aisleProducts(items: { products: Product[] }[]): Product[] {
  const lists = items.map((category) =>
    category.products.filter((product) => !isMissingProductImage(product.image)),
  );
  const picked: Product[] = [];
  // Extra candidates let colored panels skip opaque photos (PackFan shows three).
  for (let round = 0; picked.length < 6; round++) {
    const row = lists.flatMap((list) => (list[round] ? [list[round]] : []));
    if (!row.length) break;
    picked.push(...row.slice(0, 6 - picked.length));
  }
  return picked;
}

export default function AboutRange() {
  const aisles = collectionGroups(categories).filter(
    (group) => aisleProducts(group.items).length > 0,
  );
  if (!aisles.length) return null;

  return (
    <section
      id="range"
      className="bg-paper py-20 md:py-28 px-5 md:px-10 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="font-headline font-medium text-ink text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.03em] mb-10 md:mb-12">
          The range
        </h2>
        <div className="grid gap-4 md:gap-5 md:grid-cols-2">
          {aisles.map((aisle, index) => {
            const poster = getPosterColor(aisle.items[0]?.slug);
            const wide = index === 0;
            return (
              <article
                key={aisle.label}
                style={{ backgroundColor: poster.background }}
                className={`group relative overflow-hidden ${poster.ink ? "text-ink" : "text-paper"} ${
                  wide
                    ? "md:col-span-2 md:grid md:grid-cols-[1fr_1.1fr] md:items-stretch"
                    : "flex flex-col"
                }`}
              >
                <div className="relative p-6 md:p-9">
                  <h3 className="font-headline font-medium text-[clamp(2.25rem,4vw,3.75rem)] leading-[0.92] tracking-[-0.025em]">
                    {aisle.label}
                  </h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {aisle.items.map((category) => (
                      <li key={category.slug}>
                        <Link
                          to={`/category/${category.slug}`}
                          className="inline-flex min-h-10 items-center rounded-full bg-paper px-4 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`relative px-8 pt-2 ${wide ? "h-[260px] md:h-auto md:min-h-[340px] md:py-8" : "h-[240px] md:h-[280px] mt-auto"}`}
                >
                  <PackFan
                    products={aisleProducts(aisle.items)}
                    onColor
                    sizes="(min-width: 1024px) 280px, 50vw"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
