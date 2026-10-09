import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "../../data/products";
import { getResponsiveImageProps } from "../../lib/productImage";

/** Full-bleed Tuscanini campaign image; links to drinks when that collection is published. */
export default function CampaignPoster() {
  const linked = categories.some((category) => category.slug === "beverages");
  return (
    <section className="relative bg-ink overflow-hidden">
      <img
        {...getResponsiveImageProps("/assets/ads/sparkling-parallax2.jpg", "100vw")}
        alt="Friends raising Tuscanini sparkling drinks beside a market cart, with the word Saluti."
        loading="lazy"
        decoding="async"
        className="block w-full h-[420px] md:h-[640px] object-cover object-[50%_40%]"
      />
      {linked && (
        <Link
          to="/category/beverages"
          className="group absolute left-5 md:left-10 bottom-5 md:bottom-10 inline-flex items-center gap-4 bg-paper pl-6 pr-3 py-3 text-ink shadow-xl"
        >
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-tomato">
              Shop
            </span>
            <span className="block font-headline text-2xl md:text-3xl font-medium leading-tight">
              Sparkling drinks
            </span>
          </span>
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper transition-transform group-hover:translate-x-1"
          >
            <ArrowRight size={18} />
          </span>
        </Link>
      )}
    </section>
  );
}
