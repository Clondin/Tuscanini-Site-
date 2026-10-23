import { lazy, Suspense, useCallback, useState } from "react";
import { formatVideoDuration, kosherVideoPosterUrl, type KosherVideo } from "../../lib/kosherVideo";

const KosherVideoModal = lazy(() => import("./KosherVideoModal"));

/** The episode's poster: a baked-in `poster` when the data carries one, else the JW CDN still. */
export function kosherPoster(video: KosherVideo, width = 720): string {
  const baked = (video as KosherVideo & { poster?: string }).poster;
  return baked || kosherVideoPosterUrl(video.jw, width);
}

/**
 * A kosher.com episode card: a crisp 16:9 poster with a play button and duration badge, the title
 * below, and a quiet followed "Watch on Kosher.com" line. Pressing play opens the lightbox player,
 * which autoplays; nothing video-related loads before that.
 */
export default function KosherVideoCard({
  video,
  label = "Video",
  tone = "light",
  size = "md",
}: {
  video: KosherVideo;
  label?: string;
  tone?: "light" | "dark";
  size?: "md" | "lg";
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const poster = kosherPoster(video);
  const dark = tone === "dark";

  return (
    <figure className="group/video flex h-full flex-col">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play video: ${video.title}`}
        aria-haspopup="dialog"
        className="relative block aspect-video w-full cursor-pointer overflow-hidden bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive-deep"
      >
        <img
          src={poster}
          srcSet={`${kosherPoster(video, 480)} 480w, ${poster} 720w, ${kosherPoster(video, 1280)} 1280w`}
          sizes={size === "lg" ? "(min-width: 1024px) 60vw, 92vw" : "(min-width: 1024px) 420px, 85vw"}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/video:scale-[1.04] motion-reduce:transform-none"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0 transition-colors duration-300 group-hover/video:from-black/55"
        />
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <span
            className={`flex items-center justify-center rounded-full bg-paper/95 text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] ring-1 ring-black/5 transition-transform duration-300 group-hover/video:scale-110 motion-reduce:transform-none ${
              size === "lg" ? "h-16 w-16 md:h-20 md:w-20" : "h-12 w-12 md:h-14 md:w-14"
            }`}
          >
            <svg viewBox="0 0 24 24" className={`${size === "lg" ? "h-7 w-7 md:h-8 md:w-8" : "h-5 w-5 md:h-6 md:w-6"} translate-x-[2px]`}>
              <path d="M7.5 4.8v14.4L19 12z" fill="currentColor" />
            </svg>
          </span>
        </span>
        {video.duration > 0 && (
          <span className="absolute bottom-2.5 right-2.5 rounded-[3px] bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide tabular-nums text-white">
            {formatVideoDuration(video.duration)}
          </span>
        )}
      </button>
      <figcaption className="flex flex-1 flex-col pt-3.5">
        <span
          className={`text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-semibold ${dark ? "text-gold" : "text-olive-deep"}`}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`mt-1.5 text-left font-headline leading-snug line-clamp-2 transition-colors ${
            size === "lg" ? "text-xl md:text-2xl" : "text-[17px] md:text-lg"
          } ${dark ? "text-paper hover:text-gold-light" : "text-heading hover:text-olive-accent"}`}
        >
          {video.title}
        </button>
        <a
          href={video.url}
          target="_blank"
          rel="noopener"
          className={`mt-auto inline-flex w-fit items-center pt-2 text-xs transition-colors ${
            dark ? "text-paper/60 hover:text-paper" : "text-on-surface/65 hover:text-olive-deep"
          }`}
        >
          Watch on Kosher.com&nbsp;<span aria-hidden="true">&rarr;</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </figcaption>
      {open && (
        <Suspense fallback={null}>
          <KosherVideoModal video={video} poster={kosherPoster(video, 1280)} label={label} onClose={close} />
        </Suspense>
      )}
    </figure>
  );
}
