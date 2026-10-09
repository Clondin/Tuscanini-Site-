import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/** Closing poster: one bold call to the full range. */
export default function AboutCTA() {
  return (
    <section className="bg-tomato text-paper px-5 md:px-10 py-20 md:py-28">
      <div className="max-w-7xl mx-auto flex flex-wrap items-end justify-between gap-10">
        <h2 className="font-headline font-medium text-[clamp(3rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.035em] max-w-[10ch]">
          Browse the <em className="font-normal">range.</em>
        </h2>
        <Link
          to="/products?view=collections"
          className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-paper px-8 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          See all collections
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
