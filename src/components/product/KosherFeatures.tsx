import type { KosherFeature, KosherFeatureType } from "../../data/kosherFeatures";
import type { KosherVideo } from "../../lib/kosherVideo";
import { useKosherData } from "./useKosherData";
import KosherVideoCard from "../kosher/KosherVideoCard";
import KosherCredit from "../kosher/KosherCredit";
import KosherVideoRail from "../kosher/KosherVideoRail";

const TYPE_LABEL: Record<KosherFeatureType, string> = {
  recipe: "Recipe",
  article: "Article",
  episode: "Episode",
};

export function KosherFeatureCard({ item }: { item: KosherFeature }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener"
      className="group flex h-full flex-col border border-on-surface/20 bg-aged-cream/50 transition-colors hover:border-olive-deep/50"
    >
      <div className="aspect-[4/3] overflow-hidden bg-on-surface/5">
        {item.image ? (
          <img
            src={item.thumb ?? item.image}
            srcSet={item.thumb ? `${item.thumb} 300w, ${item.image} 1024w` : undefined}
            sizes="(min-width: 1024px) 25vw, 50vw"
            alt={item.title}
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
        <span className="mt-auto pt-3 text-xs font-semibold text-olive-deep">
          {item.type === "episode" ? "Watch" : "Read"} on Kosher.com&nbsp;<span aria-hidden="true">&rarr;</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </span>
      </div>
    </a>
  );
}

/**
 * "Featured on Kosher.com": kosher.com videos, recipes, articles and episodes that name this
 * product. Products with no features render nothing.
 */
export default function KosherFeatures({ productId }: { productId: string }) {
  const data = useKosherData();
  if (!data) return null;
  const items = data.getKosherFeaturesForProduct(productId);
  // The product's best videos first, then every other episode card that has a playable video.
  const videos: KosherVideo[] = [];
  for (const video of [
    ...data.getKosherVideosForProduct(productId),
    ...items.filter((item) => item.type === "episode").map((item) => data.getKosherVideoForUrl(item.url)),
  ]) {
    if (video && !videos.some((known) => known.jw === video.jw)) videos.push(video);
  }
  const videoPages = new Set(videos.map((video) => video.url));
  const cards = items.filter((item) => !videoPages.has(item.url));
  if (!cards.length && !videos.length) return null;

  return (
    <section aria-labelledby="kosher-features-heading" className="px-5 md:px-10 py-12 max-w-7xl mx-auto">
      <div className="mb-8 md:pr-32">
        <h2 id="kosher-features-heading" className="font-headline text-3xl md:text-4xl text-heading">
          Featured on Kosher.com
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-on-surface/80">
          Watch, cook and read along: Kosher.com videos, recipes and stories made with this product.
        </p>
        <KosherCredit className="mt-1" />
      </div>
      {videos.length === 1 && (
        <div aria-label="Video on Kosher.com" className="mb-10 max-w-4xl">
          <KosherVideoCard video={videos[0]} label="Episode" size="lg" />
        </div>
      )}
      {videos.length === 2 && (
        <ul aria-label="Videos on Kosher.com" className="mb-10 grid gap-6 md:gap-8 sm:grid-cols-2">
          {videos.map((video) => (
            <li key={video.jw}>
              <KosherVideoCard video={video} label="Episode" />
            </li>
          ))}
        </ul>
      )}
      {videos.length > 2 && (
        <div className="mb-10 md:pt-2">
          <KosherVideoRail videos={videos} label="Episode" ariaLabel="Videos on Kosher.com" />
        </div>
      )}
      {cards.length > 0 && (
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {cards.map((item) => (
            <li key={item.url}>
              <KosherFeatureCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
