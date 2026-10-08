import { getResponsiveImageProps } from "../../lib/productImage";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Pause, Play, Search } from "lucide-react";
import { getCmsData } from "../../data/cms";
import { categories } from "../../data/products";

/** Quick aisle shortcuts under the hero search; missing collections are skipped. */
const aisles = [
  { slug: "pasta-gnocchi", label: "Pasta" },
  { slug: "pasta-sauces", label: "Sauces" },
  { slug: "olive-oil", label: "Olive Oil" },
  { slug: "chocolate", label: "Chocolate" },
  { slug: "beverages", label: "Drinks" },
  { slug: "pizza", label: "Pizza" },
];

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
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
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
  const search = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };
  const shortcuts = aisles.filter((aisle) =>
    categories.some((category) => category.slug === aisle.slug),
  );
  const playing = videoEnabled && !videoPaused;
  return (
    <section className="relative bg-dark overflow-hidden min-h-[600px] md:min-h-[min(760px,calc(100svh-75px))] flex items-end">
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
          className="absolute inset-0 w-full h-full object-cover opacity-60"
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
          className="absolute inset-0 w-full h-full object-cover opacity-70 animate-ken-burns"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,#1a1209_0%,rgba(26,18,9,0.75)_35%,rgba(26,18,9,0.15)_75%),linear-gradient(to_right,rgba(26,18,9,0.7),transparent_65%)]"
      />
      <div className="absolute inset-0 film-grain opacity-[0.06] mix-blend-overlay pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-5 md:px-10 pt-24 pb-10 md:pb-14">
        <p className="hero-rise text-gold text-xs uppercase tracking-[0.28em] mb-5 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
          Taste Tuscanini. Know Italy.
        </p>
        <h1 className="hero-rise [animation-delay:80ms] font-headline text-white text-[clamp(3rem,7.5vw,6.75rem)] leading-[0.98] tracking-[-0.01em] max-w-[11ch]">
          {headline}
        </h1>
        <p className="hero-rise [animation-delay:160ms] mt-6 text-white/90 text-base md:text-xl leading-relaxed max-w-lg">
          {body}
        </p>

        <div className="hero-rise [animation-delay:240ms] mt-8 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <form
            role="search"
            onSubmit={search}
            className="flex w-full max-w-xl items-stretch bg-white/95 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] focus-within:ring-2 focus-within:ring-gold"
          >
            <label className="flex flex-1 items-center gap-3 pl-4 min-w-0">
              <Search size={19} aria-hidden="true" className="text-olive-deep shrink-0" />
              <span className="sr-only">Search products</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pasta, olive oil, truffles…"
                className="w-full min-w-0 bg-transparent py-4 text-base text-heading outline-none focus-visible:outline-none"
              />
            </label>
            <button
              type="submit"
              className="shrink-0 px-5 md:px-6 bg-gold text-dark text-sm font-semibold hover:bg-gold-light transition-colors"
            >
              Search
            </button>
          </form>
          <div className="flex items-center gap-5">
            <a
              href={buttonUrl}
              className="group inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-white"
            >
              {buttonLabel}
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <Link
              to="/about"
              className="inline-flex min-h-12 items-center text-sm text-white/85 underline underline-offset-4 hover:text-white"
            >
              Our story
            </Link>
          </div>
        </div>

        <div className="hero-rise [animation-delay:320ms] mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-5">
          {shortcuts.length > 0 && (
            <nav aria-label="Popular aisles" className="flex flex-wrap gap-2">
              {shortcuts.map((aisle) => (
                <Link
                  key={aisle.slug}
                  to={`/category/${aisle.slug}`}
                  className="inline-flex min-h-10 items-center px-4 rounded-full border border-white/25 bg-white/5 backdrop-blur-sm text-sm text-white/90 hover:bg-white hover:text-dark transition-colors"
                >
                  {aisle.label}
                </Link>
              ))}
            </nav>
          )}
          {!heroImage && (
            <button
              onClick={toggleVideo}
              aria-pressed={playing}
              aria-label={playing ? "Pause background film" : "Play background film"}
              className="hidden md:inline-flex min-h-11 items-center gap-3 text-white text-sm"
            >
              <span className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-dark transition-colors">
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
