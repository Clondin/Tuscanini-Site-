import { useState } from "react";
import { tuscaniniKosherVideos } from "../../data/kosherBrandVideos";
import KosherVideoCard from "../kosher/KosherVideoCard";
import KosherCredit from "../kosher/KosherCredit";

const FIRST = 6;

/** "Videos from Kosher.com": the Tuscanini-sponsored kosher.com episodes, playable right here. */
export default function KosherVideosStrip() {
  const [showAll, setShowAll] = useState(false);
  const videos = showAll ? tuscaniniKosherVideos : tuscaniniKosherVideos.slice(0, FIRST);
  const more = tuscaniniKosherVideos.length - FIRST;
  if (!videos.length) return null;

  return (
    <section aria-labelledby="kosher-videos-heading" className="bg-aged-cream">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-20">
        <div className="mb-8 md:mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-olive-deep font-semibold">Watch &amp; cook</p>
          <h2 id="kosher-videos-heading" className="mt-3 font-headline text-3xl md:text-5xl text-heading">
            Videos from Kosher.com
          </h2>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-on-surface/80">
            Tuscanini-sponsored episodes from the Kosher.com kitchen: better pasta, better pizza, capers, tuna and more.
            Press play to watch right here.
          </p>
          <KosherCredit className="mt-2" />
        </div>
        <ul className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <li key={video.jw}>
              <KosherVideoCard video={video} label="Sponsored by Tuscanini" />
            </li>
          ))}
        </ul>
        {!showAll && more > 0 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex min-h-11 items-center rounded-full border border-ink/20 bg-paper px-6 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Show {more} more videos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
