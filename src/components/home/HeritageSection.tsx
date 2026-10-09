import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/** Type-only brand statement; the range photograph now leads the hero. */
export default function HeritageSection() {
  return (
    <section id="heritage" className="bg-ink text-paper px-5 md:px-10 py-20 md:py-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-end">
        <h2 className="font-headline font-medium text-[clamp(3rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.035em]">
          An Italian
          <br />
          <em className="font-normal">pantry.</em>
        </h2>
        <div className="lg:pb-4">
          <p className="text-lg md:text-xl leading-relaxed text-paper/85 max-w-[40ch]">
            Pasta and sauces, olive oils and vinegars, sparkling drinks,
            chocolate, and frozen favorites.
          </p>
          <Link
            to="/about"
            className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-lemon px-6 text-sm font-semibold text-ink hover:bg-paper transition-colors"
          >
            Read our story
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
