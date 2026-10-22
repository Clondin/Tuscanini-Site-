import { useEffect, useState } from "react";
import type { KosherFeature, KosherFeatureType } from "../../data/kosherFeatures";

const TYPE_LABEL: Record<KosherFeatureType, string> = {
  recipe: "Recipe",
  article: "Article",
  episode: "Episode",
};

/**
 * "Featured on Kosher.com": kosher.com recipes, articles and episodes that name this product.
 * The data module is loaded on demand so it stays out of the product page bundle; products
 * with no features render nothing.
 */
export default function KosherFeatures({ productId }: { productId: string }) {
  const [loaded, setLoaded] = useState<{ id: string; items: KosherFeature[] } | null>(null);

  useEffect(() => {
    let active = true;
    import("../../data/kosherFeatures")
      .then(({ getKosherFeaturesForProduct }) => {
        if (active) setLoaded({ id: productId, items: getKosherFeaturesForProduct(productId) });
      })
      .catch(() => {
        if (active) setLoaded({ id: productId, items: [] });
      });
    return () => {
      active = false;
    };
  }, [productId]);

  const items = loaded?.id === productId ? loaded.items : [];
  if (!items.length) return null;

  return (
    <section aria-labelledby="kosher-features-heading" className="px-5 md:px-10 py-12 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 id="kosher-features-heading" className="font-headline text-3xl md:text-4xl text-heading">
          Featured on Kosher.com
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-on-surface/80">
          Recipes, articles and episodes from Kosher.com made with this product.
        </p>
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {items.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col border border-on-surface/20 bg-aged-cream/50 transition-colors hover:border-olive-deep/50"
            >
              <div className="aspect-[4/3] overflow-hidden bg-on-surface/5">
                {item.image ? (
                  <img
                    src={item.thumb ?? item.image}
                    srcSet={item.thumb ? `${item.thumb} 300w, ${item.image} 1024w` : undefined}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-3 md:p-4">
                <span className="text-[11px] md:text-xs uppercase tracking-wider text-olive-deep font-semibold">
                  {TYPE_LABEL[item.type]}
                </span>
                <span className="mt-1.5 font-headline text-base md:text-lg leading-snug text-heading group-hover:text-olive-accent line-clamp-3">
                  {item.title}
                </span>
                <span className="mt-auto pt-3 text-xs font-semibold text-on-surface/70">
                  kosher.com <span aria-hidden="true">&#8599;</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
