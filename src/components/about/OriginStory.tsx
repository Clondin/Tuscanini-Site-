import { getResponsiveImageProps } from "../../lib/productImage";

export default function OriginStory() {
  return (
    <section className="bg-surface py-20 md:py-28 px-5 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-14 lg:gap-16 items-center">
        <div className="lg:col-span-7">
          <p className="font-headline text-heading text-[clamp(1.75rem,3.4vw,2.875rem)] leading-[1.22] text-pretty">
            Tuscanini brings Italian pantry foods to your table: pasta and
            sauces, olive oils and vinegars, sparkling drinks, chocolate,
            snacks, and frozen pizza.
          </p>
          <p className="mt-8 max-w-[52ch] text-base md:text-lg leading-relaxed text-on-surface/80">
            Most of the range is made in Italy, and much of it is certified
            kosher.
          </p>
          <p className="mt-8 font-script italic text-2xl text-burnt-terracotta">
            Taste Tuscanini. Know Italy.
          </p>
        </div>

        <div className="lg:col-span-5 relative h-[440px] sm:h-[520px]">
          <figure className="absolute right-0 top-0 w-[72%] h-[82%] overflow-hidden">
            <img
              {...getResponsiveImageProps(
                "/assets/Photos/story/village-produce-market.webp",
                "(min-width: 1024px) 30vw, 70vw",
              )}
              alt="Market vendor arranging lemons and tomatoes for shoppers on a stone village lane."
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </figure>
          <figure className="absolute left-0 bottom-0 w-[52%] aspect-square overflow-hidden ring-8 ring-surface">
            <img
              {...getResponsiveImageProps(
                "/assets/Photos/story/olive-harvest.webp",
                "(min-width: 1024px) 22vw, 50vw",
              )}
              alt="Two people harvesting olives by hand in a sunlit grove."
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </figure>
          <div
            aria-hidden="true"
            className="absolute left-[18%] top-[8%] h-24 w-24 rounded-full border border-gold/50"
          />
        </div>
      </div>
    </section>
  );
}
