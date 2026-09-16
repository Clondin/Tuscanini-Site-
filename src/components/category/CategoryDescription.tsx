import type { Category } from "../../data/products";

interface CategoryDescriptionProps {
  category: Category;
}

export default function CategoryDescription({ category }: CategoryDescriptionProps) {
  const products = category.products;
  const italian = products.filter((p) => p.madeInItaly).length;
  const formats = new Set(products.map((p) => p.size).filter(Boolean)).size;

  const allOrCount = (n: number) => (n === products.length ? "All" : `${n} of ${products.length}`);

  const facts = [
    { label: "On this shelf", value: `${products.length} ${products.length === 1 ? "item" : "items"}` },
    formats > 0 ? { label: "Formats", value: `${formats}` } : null,
    italian > 0 ? { label: "Made in Italy", value: allOrCount(italian) } : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <section className="bg-dark-surface text-italia-white py-16 md:py-[72px] px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-14 items-center">
        <div>
          <span className="block mb-3.5 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            The Collection
          </span>
          <h2 className="mb-4 font-headline font-normal text-[clamp(1.875rem,3.6vw,2.5rem)] leading-[1.1]">
            {category.tagline}
          </h2>
          <p className="font-serif-alt text-[17px] leading-[1.85] text-italia-white/72 max-w-[58ch] text-pretty">
            {category.description}
          </p>
        </div>

        <div>
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-baseline justify-between gap-5 py-3.5 border-t border-gold/22"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-italia-white/85">
                {fact.label}
              </span>
              <span className="font-headline text-xl text-gold">{fact.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
