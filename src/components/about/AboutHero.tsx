import { getCmsData } from "../../data/cms";
import { getResponsiveImageProps } from "../../lib/productImage";

const chapters = [
  { id: "range", label: "The range" },
  { id: "campaigns", label: "Campaigns" },
  { id: "regions", label: "Regions" },
  { id: "table", label: "At the table" },
];

export default function AboutHero() {
  const cms = getCmsData("page", "about");
  const headline =
    typeof cms?.headline === "string" ? cms.headline : "Our Story";
  const body =
    typeof cms?.body === "string"
      ? cms.body
      : "Italian pasta, sauces, olive oils, drinks, and more.";

  return (
    <section className="relative bg-dark overflow-hidden min-h-[560px] md:min-h-[min(720px,calc(100svh-75px))] flex items-end">
      <img
        alt="Stone village lane overlooking olive-covered Italian hills at sunset."
        width={1672}
        height={941}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-75 animate-ken-burns"
        {...getResponsiveImageProps(
          "/assets/Photos/story/italian-hillside-village-hero.webp",
          "100vw",
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,#1a1209_0%,rgba(26,18,9,0.7)_38%,rgba(26,18,9,0.1)_80%),linear-gradient(to_right,rgba(26,18,9,0.65),transparent_60%)]"
      />

      <div className="relative w-full max-w-7xl mx-auto px-5 md:px-10 pt-24 pb-8 md:pb-10">
        <p className="hero-rise text-gold text-xs uppercase tracking-[0.28em] mb-5 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
          Tuscanini
        </p>
        <h1 className="hero-rise [animation-delay:80ms] font-headline text-white text-[clamp(3.25rem,8vw,7rem)] leading-[0.95] max-w-[12ch]">
          {headline}
        </h1>
        <p className="hero-rise [animation-delay:160ms] mt-6 max-w-xl font-serif-alt italic text-white/85 text-lg md:text-2xl leading-relaxed">
          {body}
        </p>

        <nav
          aria-label="On this page"
          className="hero-rise [animation-delay:240ms] mt-12 md:mt-16 pt-5 border-t border-white/15 flex flex-wrap gap-x-8 gap-y-2"
        >
          {chapters.map((chapter) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              className="group inline-flex min-h-11 items-center gap-3 text-sm text-white/80 hover:text-white"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold/80" />
              <span className="underline-offset-4 group-hover:underline">
                {chapter.label}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
