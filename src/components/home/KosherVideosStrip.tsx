import { tuscaniniKosherVideos } from "../../data/kosherBrandVideos";
import KosherVideoRail from "../kosher/KosherVideoRail";
import { KOSHER_COM_HOME } from "../../lib/kosherVideo";

/** "Videos from Kosher.com": the Tuscanini-sponsored kosher.com episodes in a swipeable row; each plays in a lightbox. */
export default function KosherVideosStrip() {
  const videos = tuscaniniKosherVideos;
  if (!videos.length) return null;

  return (
    <section aria-labelledby="kosher-videos-heading" className="bg-dark-surface text-paper">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-24">
        <div className="mb-8 md:mb-12 max-w-2xl md:pr-32">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold font-semibold">Watch &amp; cook</p>
          <h2 id="kosher-videos-heading" className="mt-3 font-headline text-[2.1rem] leading-[1.05] md:text-5xl text-paper">
            Videos from Kosher.com
          </h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-paper/70">
            Tuscanini-sponsored episodes from the Kosher.com kitchen: better pasta, better pizza, capers, tuna and more.
            Press play to watch right here.
          </p>
        </div>
        <KosherVideoRail videos={videos} label="Sponsored by Tuscanini" tone="dark" ariaLabel="Tuscanini videos on Kosher.com" />
        <p className="mt-8 text-xs md:text-sm text-paper/55">
          {videos.length} episodes &middot; Recipes &amp; stories from{" "}
          <a
            href={KOSHER_COM_HOME}
            target="_blank"
            rel="noopener"
            className="font-semibold text-paper/80 underline decoration-paper/25 underline-offset-4 hover:text-paper hover:decoration-paper"
          >
            Kosher.com
          </a>
        </p>
      </div>
    </section>
  );
}
