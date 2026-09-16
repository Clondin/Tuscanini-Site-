import type { Category } from "../../data/products";

interface CategoryDescriptionProps {
  category: Category;
}

export default function CategoryDescription({ category }: CategoryDescriptionProps) {
  return (
    <section className="bg-dark-surface text-italia-white py-16 md:py-[72px] px-6 md:px-10">
      <div className="max-w-3xl mx-auto text-center">
        <span className="block mb-3.5 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
          The Collection
        </span>
        <h2 className="mb-4 font-headline font-normal text-[clamp(1.875rem,3.6vw,2.5rem)] leading-[1.1]">
          {category.tagline}
        </h2>
        <p className="font-serif-alt text-[17px] leading-[1.85] text-italia-white/72 max-w-[58ch] mx-auto text-pretty">
          {category.description}
        </p>
      </div>
    </section>
  );
}
