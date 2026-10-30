import type { Category } from "../../data/products";
import { CATEGORY_INTROS } from "../../data/seo-copy";
import CopyText from "../ui/CopyText";

interface CategoryDescriptionProps {
  category: Category;
}

export default function CategoryDescription({ category }: CategoryDescriptionProps) {
  const intro = CATEGORY_INTROS[category.slug];
  return (
    <section className="bg-dark-surface text-italia-white py-16 md:py-[72px] px-6 md:px-10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="mb-4 font-headline font-normal text-[clamp(1.875rem,3.6vw,2.5rem)] leading-[1.1]">
          {category.tagline}
        </h2>
        <p className="font-serif-alt text-[17px] leading-[1.85] text-italia-white/72 max-w-[58ch] mx-auto text-pretty">
          {category.description}
        </p>
        {intro && (
          <p className="mt-8 text-left font-serif-alt text-[17px] leading-[1.85] text-italia-white/72 max-w-[62ch] mx-auto text-pretty">
            <CopyText paragraph={intro} linkClassName="text-italia-white underline decoration-italia-white/30 underline-offset-4 hover:decoration-italia-white" />
          </p>
        )}
      </div>
    </section>
  );
}
