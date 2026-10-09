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
  { slug: "olive-oil", label: "Olive oil" },
  { slug: "chocolate", label: "Chocolate" },
  { slug: "beverages", label: "Drinks" },
  { slug: "pizza", label: "Pizza" },
];

/** The brand's own range photograph: crisp at hero size, unlike the small API pack shots. */
const RANGE_PHOTO = "/assets/ads/tomato-group-tuscanini-web.jpg";

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
    <section className="bg-tomato text-paper">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:min-h-[min(820px,calc(100svh-75px))]">
        <div className="relative order-2 lg:order-1 flex flex-col justify-between gap-10 px-5 md:px-10 lg:pl-[max(2.5rem,calc((100vw_-_80rem)/2_+_2.5rem))] lg:pr-12 py-12 md:py-16">
          <p className="hero-rise flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-paper">
            <span aria-hidden="true" className="h-px w-10 bg-paper/60" />
            Tuscanini
          </p>

          <div>
            <h1 className="hero-rise [animation-delay:80ms] font-headline font-medium text-[clamp(3.5rem,8.2vw,8.25rem)] leading-[0.88] tracking-[-0.03em] max-w-[9ch]">
              {headline}
            </h1>
            <p className="hero-rise [animation-delay:160ms] mt-7 max-w-md text-lg md:text-xl leading-relaxed text-paper">
              {body}
            </p>
          </div>

          <div className="hero-rise [animation-delay:240ms]">
            <form
              role="search"
              onSubmit={search}
              className="flex w-full max-w-lg items-stretch bg-paper text-ink focus-within:ring-2 focus-within:ring-ink"
            >
              <label className="flex flex-1 items-center gap-3 pl-4 min-w-0">
                <Search size={19} aria-hidden="true" className="shrink-0" />
                <span className="sr-only">Search products</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search pasta, olive oil, truffles…"
                  className="w-full min-w-0 bg-transparent py-4 text-base outline-none focus-visible:outline-none placeholder:text-ink/50"
                />
              </label>
              <button
                type="submit"
                className="shrink-0 bg-ink px-6 text-sm font-semibold text-paper hover:bg-ink/85 transition-colors"
              >
                Search
              </button>
            </form>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={buttonUrl}
                className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-paper"
              >
                <span className="underline decoration-paper/40 underline-offset-[6px] group-hover:decoration-paper">
                  {buttonLabel}
                </span>
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              {shortcuts.length > 0 && (
                <nav aria-label="Popular aisles" className="flex flex-wrap gap-x-5 gap-y-1">
                  {shortcuts.map((aisle) => (
                    <Link
                      key={aisle.slug}
                      to={`/category/${aisle.slug}`}
                      className="inline-flex min-h-11 items-center text-sm text-paper hover:underline underline-offset-4"
                    >
                      {aisle.label}
                    </Link>
                  ))}
                </nav>
              )}
            </div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 min-h-[300px] sm:min-h-[420px] bg-ink overflow-hidden">
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
              className="absolute inset-0 h-full w-full object-cover"
              src="/assets/Trailer/Tuscanini_Trailer_Web.mp4"
            />
          ) : (
            <img
              {...getResponsiveImageProps(heroImage || RANGE_PHOTO, "(min-width: 1024px) 52vw, 100vw")}
              alt={
                heroImage
                  ? ""
                  : "Tuscanini tomato juice, passata, pasta sauces, and canned tomatoes arranged with fresh tomatoes"
              }
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-[58%_55%] animate-ken-burns"
            />
          )}
          {!heroImage && (
            <button
              onClick={toggleVideo}
              aria-pressed={playing}
              aria-label={playing ? "Pause background film" : "Play background film"}
              className="hidden md:inline-flex absolute left-6 bottom-6 min-h-12 items-center gap-3 rounded-full bg-paper/95 pl-2 pr-5 text-sm font-semibold text-ink shadow-lg hover:bg-paper"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tomato text-paper">
                {playing ? <Pause size={15} /> : <Play size={15} className="translate-x-px" />}
              </span>
              {playing ? "Pause film" : "Watch our film"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
