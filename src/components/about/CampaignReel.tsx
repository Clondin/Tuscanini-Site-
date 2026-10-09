import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { categories } from "../../data/products";
import { getResponsiveImageProps } from "../../lib/productImage";

/** Tuscanini advertising photography; each frame links to its collection when it exists. */
const campaigns = [
  {
    src: "/assets/ads/beverages-wide.jpg",
    alt: "Tuscanini organic sparkling blood orange soda with sliced blood oranges on a wooden table.",
    caption: "Organic sodas",
    categorySlug: "beverages",
  },
  {
    src: "/assets/ads/balsamic-parallax.jpg",
    alt: "Tuscanini balsamic vinegar and glaze bottles in front of a cypress-lined Tuscan road at sunset.",
    caption: "Balsamic vinegar and glaze",
    categorySlug: "vinegars-glazes",
  },
  {
    src: "/assets/ads/marinara-banner.jpg",
    alt: "Tuscanini pasta sauce bottles on a red background with the headline Made From Premium Tuscan Tomatoes.",
    caption: "Pasta sauces",
    categorySlug: "pasta-sauces",
  },
  {
    src: "/assets/ads/lemon-juice-parallax.jpg",
    alt: "Tuscanini lemon juice bottles with lemons overlooking a Sicilian bay.",
    caption: "Lemon juice",
    categorySlug: "cooking-wines-citrus",
  },
  {
    src: "/assets/ads/sparkling-parallax2.jpg",
    alt: "Friends raising Tuscanini sparkling drinks beside a market cart, with the word Saluti.",
    caption: "Sparkling drinks",
    categorySlug: "beverages",
  },
];

export default function CampaignReel() {
  const rail = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () =>
      setEdges({
        start: element.scrollLeft < 4,
        end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
      });
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, []);
  const move = (direction: number) => {
    const element = rail.current;
    const card = element?.querySelector("li");
    if (!element || !card) return;
    element.scrollBy({
      left: direction * (card.getBoundingClientRect().width + 20),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };
  const known = new Set(categories.map((category) => category.slug));

  return (
    <section
      id="campaigns"
      className="bg-dark text-aged-cream py-20 md:py-28 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-headline font-medium text-paper text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.03em]">
          From our campaigns
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={edges.start}
            aria-label="Previous campaign"
            className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center transition-colors hover:bg-white hover:text-dark disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-aged-cream"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={edges.end}
            aria-label="Next campaign"
            className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center transition-colors hover:bg-white hover:text-dark disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-aged-cream"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <ul
        ref={rail}
        tabIndex={0}
        aria-label="Campaign images, scroll horizontally"
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-5 md:scroll-px-[max(2.5rem,calc((100vw_-_80rem)/2_+_2.5rem))] px-5 md:px-[max(2.5rem,calc((100vw_-_80rem)/2_+_2.5rem))] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {campaigns.map((campaign) => {
          const linked = known.has(campaign.categorySlug);
          const body = (
            <>
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  {...getResponsiveImageProps(
                    campaign.src,
                    "(min-width: 1024px) 760px, 85vw",
                  )}
                  alt={campaign.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none"
                />
              </div>
              <p className="mt-4 flex items-center justify-between gap-4 text-sm">
                <span className="font-headline text-lg text-white">
                  {campaign.caption}
                </span>
                {linked && (
                  <span className="inline-flex items-center gap-1.5 text-gold">
                    Shop
                    <ArrowRight
                      size={15}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                )}
              </p>
            </>
          );
          return (
            <li
              key={campaign.src}
              className="snap-start shrink-0 w-[85vw] sm:w-[70vw] lg:w-[760px]"
            >
              {linked ? (
                <Link
                  to={`/category/${campaign.categorySlug}`}
                  className="group block"
                >
                  {body}
                </Link>
              ) : (
                <div className="group">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
