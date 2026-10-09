import SourcingMap from "./SourcingMap";

export default function SourcingJourney() {
  return (
    <section
      id="regions"
      className="bg-earth-dark py-20 md:py-28 px-5 md:px-10 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-12 grid gap-4 md:grid-cols-2 md:items-end">
          <h2 className="font-headline font-medium text-ink text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.03em]">
            Italy, region by region
          </h2>
          <p className="max-w-[46ch] text-base md:text-lg leading-relaxed text-on-surface/80 md:justify-self-end">
            Each region has its own foods. Pick one on the map, or take the
            tour from Piedmont down to Sicily.
          </p>
        </div>
        <SourcingMap />
      </div>
    </section>
  );
}
