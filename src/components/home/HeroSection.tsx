import { getResponsiveImageProps } from "../../lib/productImage";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Pause, Play } from "lucide-react";
import { getCmsData } from "../../data/cms";

/** The original full-bleed coast hero, set in the new type and colors. */
export default function HeroSection() {
  const cms = getCmsData("page", "home");
  const headline =
    typeof cms?.headline === "string" ? cms.headline : "Italy at Your Table";
  const body =
    typeof cms?.body === "string"
      ? cms.body
      : "Pasta, sauces, olive oils, drinks, and more from Tuscanini.";
  const buttonLabel =
    typeof cms?.cta_label === "string" ? cms.cta_label : "Explore products";
  const buttonUrl =
    typeof cms?.cta_url === "string" && cms.cta_url.trim()
      ? cms.cta_url
      : "/products";
  const heroImage = typeof cms?.hero_image === "string" ? cms.hero_image : "";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const toggleVideo = () => {
    if (!videoEnabled) {
      setVideoEnabled(true);
      return;
    }
    if (videoRef.current?.paused) void videoRef.current.play();
    else videoRef.current?.pause();
  };
  const playing = videoEnabled && !videoPaused;

  return (
    <section className="relative bg-ink overflow-hidden min-h-[560px] md:min-h-[min(700px,calc(100svh-75px))] flex items-end">
      {videoEnabled && !heroImage ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/assets/Photos/backgrounds/italian-coast-hero.webp"
          onPlay={() => setVideoPaused(false)}
          onPause={() => setVideoPaused(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          src="/assets/Trailer/Tuscanini_Trailer_Web.mp4"
        />
      ) : (
        <img
          {...getResponsiveImageProps(
            heroImage || "/assets/Photos/backgrounds/italian-coast-hero.webp",
            "100vw",
          )}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-75 animate-ken-burns"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,18,16,0.85)_0%,rgba(20,18,16,0.55)_45%,rgba(20,18,16,0.1)_80%),linear-gradient(to_top,rgba(20,18,16,0.7),transparent_45%)]"
      />

      <div className="relative w-full max-w-7xl mx-auto px-5 md:px-10 pt-20 pb-12 md:pb-16">
        <p className="hero-rise flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-lemon">
          <span aria-hidden="true" className="h-px w-10 bg-lemon/70" />
          Taste Tuscanini. Know Italy.
        </p>
        <h1 className="hero-rise [animation-delay:80ms] mt-6 font-headline font-medium text-paper text-[clamp(3.25rem,7.5vw,7rem)] leading-[0.9] tracking-[-0.03em] max-w-[10ch]">
          {headline}
        </h1>
        <p className="hero-rise [animation-delay:160ms] mt-6 max-w-md text-lg md:text-xl leading-relaxed text-paper/90">
          {body}
        </p>
        <div className="hero-rise [animation-delay:240ms] mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a
            href={buttonUrl}
            className="group inline-flex min-h-13 items-center gap-3 rounded-full bg-lemon px-7 text-sm font-semibold text-ink transition-colors hover:bg-paper"
          >
            {buttonLabel}
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
          <Link
            to="/about"
            className="inline-flex min-h-12 items-center text-sm font-semibold text-paper underline decoration-paper/40 underline-offset-[6px] hover:decoration-paper"
          >
            Our story
          </Link>
          {!heroImage && (
            <button
              onClick={toggleVideo}
              aria-pressed={playing}
              aria-label={playing ? "Pause background film" : "Play background film"}
              className="hidden md:inline-flex min-h-12 items-center gap-3 text-sm text-paper/90 hover:text-paper"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/40">
                {playing ? <Pause size={16} /> : <Play size={16} className="translate-x-px" />}
              </span>
              {playing ? "Pause film" : "Watch our film"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
