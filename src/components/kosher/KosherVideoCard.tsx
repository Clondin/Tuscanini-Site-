import { useState } from "react";
import {
  formatVideoDuration,
  kosherVideoHlsUrl,
  kosherVideoPosterUrl,
  type KosherVideo,
} from "../../lib/kosherVideo";

/**
 * A kosher.com episode that plays right here: poster + play button, and only on click a native
 * <video> (HLS on Safari, which plays it natively; the 720p mp4 everywhere else). Nothing loads
 * until the play button is pressed. A followed "Watch on Kosher.com" link sits under every video.
 */
export default function KosherVideoCard({ video, label = "Video" }: { video: KosherVideo; label?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const poster = kosherVideoPosterUrl(video.jw);

  const play = () => {
    const probe = document.createElement("video");
    setSrc(probe.canPlayType("application/vnd.apple.mpegurl") ? kosherVideoHlsUrl(video.jw) : video.mp4);
  };

  return (
    <figure className="flex h-full flex-col border border-on-surface/20 bg-aged-cream/50">
      <div className="relative aspect-video overflow-hidden bg-ink">
        {src && !failed ? (
          <video
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
            onError={() => {
              // HLS refused (rare): fall back to the mp4 once, then give up and point to kosher.com.
              if (src !== video.mp4) setSrc(video.mp4);
              else setFailed(true);
            }}
            aria-label={video.title}
            className="absolute inset-0 h-full w-full bg-ink object-contain"
          />
        ) : (
          <button
            type="button"
            onClick={play}
            disabled={failed}
            aria-label={`Play video: ${video.title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer disabled:cursor-default"
          >
            <img
              src={poster}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              {failed ? (
                <span className="bg-ink/85 px-3 py-2 text-xs font-semibold text-paper">
                  This video can&rsquo;t play here. Watch it on Kosher.com below.
                </span>
              ) : (
                <span className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-paper/95 text-ink shadow-lg transition-transform group-hover:scale-105">
                  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="translate-x-0.5">
                    <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
                  </svg>
                </span>
              )}
            </span>
            {video.duration > 0 && (
              <span className="absolute bottom-2 right-2 bg-ink/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-paper">
                {formatVideoDuration(video.duration)}
              </span>
            )}
          </button>
        )}
      </div>
      <figcaption className="flex flex-1 flex-col p-3 md:p-4">
        <span className="text-[11px] md:text-xs uppercase tracking-wider text-olive-deep font-semibold">{label}</span>
        <span className="mt-1.5 font-headline text-base md:text-lg leading-snug text-heading line-clamp-2">
          {video.title}
        </span>
        <a
          href={video.url}
          target="_blank"
          rel="noopener"
          className="mt-auto inline-flex min-h-10 items-end pt-2 text-xs font-semibold text-olive-deep underline decoration-olive-deep/30 underline-offset-4 hover:decoration-olive-deep"
        >
          Watch on Kosher.com&nbsp;<span aria-hidden="true">&rarr;</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
