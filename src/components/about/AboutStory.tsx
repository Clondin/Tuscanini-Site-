import { ABOUT_STORY, WHERE_TO_BUY } from "../../data/seo-copy";
import CopyText from "../ui/CopyText";

const link = "underline decoration-heading/30 underline-offset-4 hover:decoration-heading";

/** Who we are: Tuscanini as Kayco's Italian food brand, from public Kayco sources. Same words as the prerendered /about HTML. */
export default function AboutStory() {
  return (
    <section id="who-we-are" aria-labelledby="about-story-heading" className="bg-surface pb-20 md:pb-28 px-5 md:px-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start border-t border-heading/15 pt-14 md:pt-20">
        <h2 id="about-story-heading" className="lg:col-span-4 font-headline font-medium text-heading text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.03em]">
          {ABOUT_STORY.heading}
        </h2>
        <div className="lg:col-span-8 max-w-[64ch] space-y-5 text-base md:text-lg leading-relaxed text-on-surface/85">
          {ABOUT_STORY.paragraphs.map((paragraph, index) => (
            <p key={index}>
              <CopyText paragraph={paragraph} linkClassName={link} />
            </p>
          ))}
          <h3 className="pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-heading/80">{WHERE_TO_BUY.heading}</h3>
          <p className="text-sm md:text-base">
            <CopyText paragraph={WHERE_TO_BUY.paragraph} linkClassName={link} />
          </p>
          <p className="text-xs text-on-surface/60">
            Sources:{" "}
            {ABOUT_STORY.sources.map((source, index) => (
              <span key={source.url}>
                {index > 0 ? " · " : ""}
                <a href={source.url} target="_blank" rel="noopener" className="underline underline-offset-2">
                  {source.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
