import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { KosherVideo } from "../../lib/kosherVideo";
import KosherVideoCard from "./KosherVideoCard";

/**
 * A horizontal, snap-scrolling row of video cards with prev/next arrows on larger screens.
 * Cards keep one consistent 16:9 size; on phones the next card peeks in to invite a swipe.
 */
export default function KosherVideoRail({
  videos,
  label,
  tone = "light",
  ariaLabel,
}: {
  videos: KosherVideo[];
  label: string;
  tone?: "light" | "dark";
  ariaLabel: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [videos.length]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const width = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * width * Math.max(1, Math.floor(el.clientWidth / width)), behavior: "smooth" });
  };

  const dark = tone === "dark";
  const arrow = `hidden md:flex h-11 w-11 items-center justify-center rounded-full transition-colors disabled:opacity-30 disabled:cursor-default ${
    dark
      ? "ring-1 ring-paper/30 text-paper hover:enabled:bg-paper hover:enabled:text-ink"
      : "ring-1 ring-ink/20 text-ink hover:enabled:bg-ink hover:enabled:text-paper"
  }`;

  return (
    <div className="relative">
      {videos.length > 1 && (
        <div className="absolute -top-16 right-0 hidden md:flex gap-2">
          <button type="button" className={arrow} onClick={() => step(-1)} disabled={edge.start} aria-label="Previous videos">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" className={arrow} onClick={() => step(1)} disabled={edge.end} aria-label="More videos">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      )}
      <ul
        ref={track}
        aria-label={ariaLabel}
        className="kv-rail -mx-5 md:mx-0 flex snap-x snap-mandatory gap-4 md:gap-6 overflow-x-auto scroll-px-5 md:scroll-px-0 px-5 md:px-0 pb-2"
      >
        {videos.map((video) => (
          <li key={video.jw} className="w-[82%] sm:w-[46%] lg:w-[calc((100%-3rem)/3)] shrink-0 snap-start">
            <KosherVideoCard video={video} label={label} tone={tone} />
          </li>
        ))}
      </ul>
    </div>
  );
}
