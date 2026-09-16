import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Pause, Play } from "lucide-react";
import { getCmsData } from "../../data/cms";
import { getProductById } from "../../data/products";

export default function HeroSection() {
  const cms = getCmsData("page", "home");
  const headline =
    typeof cms?.headline === "string" ? cms.headline : "Italy at Your Table";
  const body =
    typeof cms?.body === "string"
      ? cms.body
      : "Pasta for Sunday lunch. Olive oil for the finishing touch. Something sweet to share.";
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
  const picks = [
    "evoo-750ml",
    "sparkling-lemonade",
    "chocolate-truffle-pistachio",
  ].flatMap((id) => {
    const product = getProductById(id);
    return product?.image ? [product] : [];
  });
  const toggleVideo = () => {
    if (!videoEnabled) {
      setVideoEnabled(true);
      return;
    }
    if (videoRef.current?.paused) void videoRef.current.play();
    else videoRef.current?.pause();
  };
  return (
    <section className="relative bg-dark overflow-hidden">
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
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          src="/assets/Trailer/Tuscanini_Trailer_Screens_Final.mp4"
        />
      ) : (
        <img
          src={
            heroImage || "/assets/Photos/backgrounds/italian-coast-hero.webp"
          }
          alt=""
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
      )}
      <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-16 grid lg:grid-cols-[1fr_1fr] items-center gap-8 lg:gap-14">
        <div>
          <p className="text-gold text-xs uppercase tracking-[0.2em] mb-5">
            Taste Tuscanini. Know Italy.
          </p>
          <h1 className="font-headline text-white text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] max-w-[10ch]">
            {headline}
          </h1>
          <p className="mt-5 md:mt-7 text-white/95 text-base md:text-lg leading-relaxed max-w-md">
            {body}
          </p>
          <div className="flex flex-wrap gap-4 mt-7">
            <a
              href={buttonUrl}
              className="inline-flex items-center justify-center gap-3 min-h-12 px-6 bg-gold text-dark text-sm font-semibold hover:bg-gold-light"
            >
              {buttonLabel}
              <ArrowRight size={17} />
            </a>
            <Link
              to="/about"
              className="inline-flex min-h-12 items-center text-sm text-white underline underline-offset-4"
            >
              Our story
            </Link>
          </div>
          {!heroImage && (
            <button
              onClick={toggleVideo}
              aria-pressed={videoEnabled && !videoPaused}
              aria-label={
                videoEnabled && !videoPaused
                  ? "Pause background film"
                  : "Play background film"
              }
              className="hidden md:inline-flex min-h-11 items-center gap-2 text-white text-xs mt-5"
            >
              {videoEnabled && !videoPaused ? (
                <Pause size={15} />
              ) : (
                <Play size={15} />
              )}
              {videoEnabled && !videoPaused ? "Pause film" : "Watch our film"}
            </button>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/90 mb-4">
            A taste of Tuscanini
          </p>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {picks.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-aged-cream text-heading border border-white/30 p-3 md:p-4"
              >
                <div className="h-24 sm:h-40 lg:h-64 mb-3">
                  <img
                    src={product.image}
                    alt=""
                    className="h-full w-full object-contain transition-transform group-hover:scale-105 motion-reduce:transform-none"
                  />
                </div>
                <h2 className="font-headline text-sm md:text-lg leading-snug">
                  {product.name}
                </h2>
                <ArrowRight size={16} className="mt-3 text-olive-deep" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
