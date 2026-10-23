import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { formatVideoDuration, kosherVideoHlsUrl, type KosherVideo } from "../../lib/kosherVideo";

/**
 * Full-screen lightbox player for a kosher.com episode: dark backdrop, close button, ESC and
 * backdrop click close it, and it autoplays on open. Native <video> only (HLS on Safari, which
 * plays it natively; the 720p mp4 everywhere else). The followed "Watch on Kosher.com" link sits
 * under the player.
 */
export default function KosherVideoModal({
  video,
  poster,
  label,
  onClose,
}: {
  video: KosherVideo;
  poster: string;
  label?: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [src, setSrc] = useState<string>(() => {
    const probe = document.createElement("video");
    return probe.canPlayType("application/vnd.apple.mpegurl") ? kosherVideoHlsUrl(video.jw) : video.mp4;
  });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      opener?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose}
      className="kv-modal fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(10,9,8,0.92)] p-0 sm:p-6 md:p-10 backdrop-blur-sm"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-3 top-3 md:right-6 md:top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-paper ring-1 ring-paper/25 transition-colors hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
      >
        <X size={22} aria-hidden="true" />
      </button>
      <div className="kv-modal-panel w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
        <div className="relative aspect-video w-full overflow-hidden bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
          {failed ? (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-paper/85">
              This video can&rsquo;t play here right now. You can watch it on Kosher.com below.
            </div>
          ) : (
            <video
              key={src}
              src={src}
              poster={poster}
              controls
              autoPlay
              playsInline
              preload="auto"
              onError={() => {
                // HLS refused (rare): fall back to the mp4 once, then point to kosher.com.
                if (src !== video.mp4) setSrc(video.mp4);
                else setFailed(true);
              }}
              aria-label={video.title}
              className="absolute inset-0 h-full w-full bg-black object-contain"
            />
          )}
        </div>
        <div className="flex flex-col gap-2 px-4 py-4 sm:px-0 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="min-w-0">
            {label && (
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">{label}</p>
            )}
            <p className="mt-1 font-headline text-xl md:text-2xl leading-snug text-paper">{video.title}</p>
          </div>
          <div className="flex shrink-0 items-center gap-4 text-sm text-paper/70">
            {video.duration > 0 && <span className="tabular-nums">{formatVideoDuration(video.duration)}</span>}
            <a
              href={video.url}
              target="_blank"
              rel="noopener"
              className="font-semibold text-paper/90 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper hover:decoration-paper"
            >
              Watch on Kosher.com&nbsp;<span aria-hidden="true">&rarr;</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
