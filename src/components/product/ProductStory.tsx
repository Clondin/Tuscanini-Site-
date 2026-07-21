import { CategoryAccent } from "../../data/category-accents";

interface ProductStoryProps {
  productName: string;
  accent?: CategoryAccent;
  /** Compact block that lives inside the product page's scrolling column
      (next to the pinned image) instead of a standalone full-width section. */
  inline?: boolean;
}

export default function ProductStory({ productName, accent, inline }: ProductStoryProps) {
  if (inline) {
    return (
      <div className="mt-10 pt-8 border-t border-on-surface/10">
        <span
          className="font-bold tracking-[0.3em] text-[10px] uppercase block mb-3"
          style={{ color: accent?.deep }}
        >
          The Craft
        </span>
        <h2 className="font-headline text-2xl md:text-3xl text-heading italic mb-4">
          A Story of Italian Mastery
        </h2>
        <p className="text-on-surface/70 text-base leading-relaxed font-light">
          Our {productName} is crafted by generations of Italian artisans who share a reverence for authenticity.
          From sun-drenched fields to meticulous production, every step honors the belief that the finest
          ingredients need only the simplest preparations. When you choose Tuscanini, you choose to preserve
          the soul of the Italian kitchen.
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-earth-dark relative overflow-hidden">
      <div className="absolute inset-0 sketch-overlay opacity-[0.03]"></div>
      <div className="max-w-3xl mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center">
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
            The Craft
          </span>
          <h2 className="font-headline text-4xl md:text-5xl text-heading italic mb-4">
            A Story of Italian Mastery
          </h2>
          <div className="flex justify-center items-center gap-4 mt-5 mb-8">
            <div className="w-16 h-px bg-primary/30"></div>
            <div className="w-2 h-2 rounded-full bg-primary/40"></div>
            <div className="w-16 h-px bg-primary/30"></div>
          </div>
          <p className="text-on-surface/80 text-base md:text-lg leading-relaxed font-light">
            Our {productName} is crafted by generations of Italian artisans who share a reverence for authenticity.
            From sun-drenched fields to meticulous production, every step honors the belief that the finest
            ingredients need only the simplest preparations. When you choose Tuscanini, you choose to preserve
            the soul of the Italian kitchen.
          </p>
        </div>
      </div>
    </section>
  );
}
