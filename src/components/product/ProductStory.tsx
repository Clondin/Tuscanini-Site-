interface ProductStoryProps {
  productName: string;
  /** The catalogue's own notes on this product, shown alongside the craft narrative. */
  details?: string;
}

export default function ProductStory({ productName, details }: ProductStoryProps) {
  return (
    <section className="bg-dark-surface text-italia-white py-16 md:py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-14 items-start">
        <div>
          <span className="block mb-3.5 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            The Craft
          </span>
          <h2 className="mb-4 font-headline font-normal italic text-[clamp(1.75rem,3.2vw,2.25rem)] leading-[1.12]">
            A story of Italian mastery
          </h2>
          <p className="font-serif-alt text-base leading-[1.85] text-italia-white/72 text-pretty">
            Discover {productName} and bring the flavors of the Italian table to your kitchen.
          </p>
        </div>

        {details && (
          <div className="border-t border-gold/22 pt-5">
            <span className="block mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-italia-white/50">
              On this product
            </span>
            <p className="font-serif-alt text-[15px] leading-[1.85] text-italia-white/72 text-pretty">
              {details}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
