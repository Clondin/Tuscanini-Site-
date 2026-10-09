import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "../../data/products";
import { getResponsiveImageProps } from "../../lib/productImage";

/**
 * Homepage aisles told with photography: Tuscanini campaign images where they
 * exist; the olive grove is one of the About page editorial scenes. A tile is
 * hidden when its category slug is not published.
 */
const tiles = [
  { slug: "pasta-gnocchi", src: "/assets/ads/gnocchi-recipe.jpg", position: "50% 50%" },
  { slug: "pasta-sauces", src: "/assets/ads/tomato-group-tuscanini-web.jpg", position: "60% 55%" },
  { slug: "olive-oil", src: "/assets/Photos/story/olive-harvest.webp", position: "50% 40%" },
  { slug: "beverages", src: "/assets/ads/beverages-wide.jpg", position: "65% 50%" },
  { slug: "pizza", src: "/assets/ads/pizza-banner.jpg", position: "50% 75%" },
];

export default function CollectionsGrid() {
  const shown = tiles.flatMap((tile) => {
    const category = categories.find((entry) => entry.slug === tile.slug);
    return category ? [{ ...tile, category }] : [];
  });

  return (
    <section id="collections" className="bg-paper px-5 md:px-10 py-16 md:py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-headline font-medium text-ink text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.03em]">
            Shop by aisle
          </h2>
          <Link to="/products?view=collections" className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink">
            <span className="underline decoration-ink/30 underline-offset-[6px] group-hover:decoration-ink">All collections</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {shown.map(({ category, src, position }, index) => (
            <li key={category.slug} className={index === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
              <Link
                to={`/category/${category.slug}`}
                className={`group relative block h-full overflow-hidden bg-ink ${index === 0 ? "min-h-[300px] lg:min-h-[620px]" : "min-h-[220px] md:min-h-[300px]"}`}
              >
                <img
                  {...getResponsiveImageProps(src, "(min-width: 1024px) 33vw, 50vw")}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: position }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,18,16,0.85),rgba(20,18,16,0.15)_55%,transparent)]" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 md:p-6 text-paper">
                  <h3 className="font-headline font-medium text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[0.95] tracking-[-0.02em]">
                    {category.name}
                  </h3>
                  <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-transform group-hover:translate-x-1">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
