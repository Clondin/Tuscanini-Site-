import { getCmsData } from "../../data/cms";
import { getResponsiveImageProps } from "../../lib/productImage";

const chapters = [
  { id: "range", label: "The range" },
  { id: "campaigns", label: "Campaigns" },
  { id: "regions", label: "Regions" },
  { id: "table", label: "At the table" },
];

/** Split poster like the home hero, in ink: type and chapters beside the hillside photo. */
export default function AboutHero() {
  const cms = getCmsData("page", "about");
  const headline =
    typeof cms?.headline === "string" ? cms.headline : "Our Story";
  const body =
    typeof cms?.body === "string"
      ? cms.body
      : "Italian pasta, sauces, olive oils, drinks, and more.";

  return (
    <section className="bg-ink text-paper">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:min-h-[min(780px,calc(100svh-75px))]">
        <div className="order-2 lg:order-1 flex flex-col justify-between gap-12 px-5 md:px-10 lg:pl-[max(2.5rem,calc((100vw_-_80rem)/2_+_2.5rem))] lg:pr-12 py-12 md:py-16">
          <p className="hero-rise flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-lemon">
            <span aria-hidden="true" className="h-px w-10 bg-lemon/70" />
            Tuscanini
          </p>
          <div>
            <h1 className="hero-rise [animation-delay:80ms] font-headline font-medium text-[clamp(3.5rem,8.5vw,8.5rem)] leading-[0.88] tracking-[-0.035em] max-w-[8ch]">
              {headline}
            </h1>
            <p className="hero-rise [animation-delay:160ms] mt-7 max-w-md font-headline italic text-xl md:text-2xl leading-snug text-paper/90">
              {body}
            </p>
          </div>
          <nav
            aria-label="On this page"
            className="hero-rise [animation-delay:240ms] border-t border-paper/20 pt-5 grid grid-cols-2 gap-x-6 gap-y-1"
          >
            {chapters.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className="group inline-flex min-h-11 items-center gap-3 text-sm text-paper/90 hover:text-paper"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lemon transition-transform group-hover:scale-150" />
                <span className="underline-offset-4 group-hover:underline">
                  {chapter.label}
                </span>
              </a>
            ))}
          </nav>
        </div>

        <div className="relative order-1 lg:order-2 min-h-[300px] sm:min-h-[420px] overflow-hidden">
          <img
            alt="Stone village lane overlooking olive-covered Italian hills at sunset."
            width={1672}
            height={941}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[55%_50%] animate-ken-burns"
            {...getResponsiveImageProps(
              "/assets/Photos/story/italian-hillside-village-hero.webp",
              "(min-width: 1024px) 52vw, 100vw",
            )}
          />
        </div>
      </div>
    </section>
  );
}
