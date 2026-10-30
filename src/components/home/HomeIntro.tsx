import { HOME_INTRO, WHERE_TO_BUY } from "../../data/seo-copy";
import CopyText from "../ui/CopyText";

const link = "underline decoration-ink/30 underline-offset-4 hover:decoration-ink";

/** Plain-language introduction to the brand, with where-to-buy facts. Same words as the prerendered homepage HTML. */
export default function HomeIntro() {
  return (
    <section id="about-tuscanini" aria-labelledby="home-intro-heading" className="bg-paper px-5 md:px-10 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-16 items-start">
        <h2 id="home-intro-heading" className="font-headline font-medium text-ink text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.03em]">
          {HOME_INTRO.heading}
        </h2>
        <div className="max-w-[62ch]">
          <p className="text-base md:text-lg leading-relaxed text-ink/85">
            <CopyText paragraph={HOME_INTRO.paragraph} linkClassName={link} />
          </p>
          <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-ink/70">{WHERE_TO_BUY.heading}</h3>
          <p className="mt-2 text-sm md:text-base leading-relaxed text-ink/75">
            <CopyText paragraph={WHERE_TO_BUY.paragraph} linkClassName={link} />
          </p>
        </div>
      </div>
    </section>
  );
}
