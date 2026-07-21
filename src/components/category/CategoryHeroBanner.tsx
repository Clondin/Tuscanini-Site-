import { Category } from "../../data/products";
import CategoryBreadcrumbs from "./CategoryBreadcrumbs";

interface CategoryHeroBannerProps {
  category: Category;
}

const editorialCategoryIds = new Set([
  "beverages",
  "chocolate",
  "vinegars-glazes",
  "pasta-sauces",
  "pasta-gnocchi",
  "pizza",
  "tuna-seafood",
  "bread-frozen-appetizers",
]);

const imagePositions: Record<string, string> = {
  beverages: "center 45%",
  chocolate: "center 52%",
  "vinegars-glazes": "center 48%",
  "pasta-sauces": "center 46%",
  "pasta-gnocchi": "center 52%",
  pizza: "center 48%",
  "tuna-seafood": "center 45%",
  "bread-frozen-appetizers": "center 48%",
};

export default function CategoryHeroBanner({ category }: CategoryHeroBannerProps) {
  const isEditorial = editorialCategoryIds.has(category.id);
  const imagePosition = imagePositions[category.id] ?? "center";

  if (isEditorial) {
    return (
      <section className="relative min-h-[400px] md:min-h-[460px] flex items-end overflow-hidden bg-heading">
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          src={category.heroImage}
          style={{ objectPosition: imagePosition }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-heading/90 via-heading/55 to-heading/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-heading/75 via-transparent to-heading/15" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-10 md:pb-14 pt-28">
          <div className="max-w-3xl">
            <CategoryBreadcrumbs categoryName={category.name} inverted />
            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl text-white mb-3 leading-[0.98] text-balance drop-shadow-sm">
              {category.name}
            </h1>
            <p className="font-serif-alt italic text-white/85 text-lg md:text-xl max-w-xl">
              {category.tagline}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 stone-texture z-20" />
      </section>
    );
  }

  return (
    <section className="relative min-h-[400px] md:min-h-[460px] overflow-hidden bg-aged-cream">
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-15"
        src={category.heroImage}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-aged-cream via-aged-cream/95 to-aged-cream/65" />

      <div className="relative z-10 max-w-7xl mx-auto min-h-[400px] md:min-h-[460px] px-6 md:px-10 pt-24 pb-8 grid grid-cols-[minmax(0,1.05fr)_minmax(130px,.95fr)] md:grid-cols-2 gap-3 md:gap-12 items-center">
        <div className="min-w-0 py-4">
          <CategoryBreadcrumbs categoryName={category.name} />
          <h1 className="font-headline text-[clamp(2.15rem,5vw,4.5rem)] text-heading mb-3 leading-[0.98] text-balance">
            {category.name}
          </h1>
          <p className="font-serif-alt italic text-on-surface/75 text-base md:text-xl max-w-lg">
            {category.tagline}
          </p>
        </div>

        <div className="relative h-[260px] md:h-[350px] min-w-0 flex items-center justify-center">
          <div className="absolute inset-3 md:inset-6 rounded-full bg-white/65 blur-2xl" />
          <img
            alt={`${category.name} collection`}
            className="relative z-10 h-full w-full object-contain drop-shadow-[0_24px_30px_rgba(42,31,22,0.18)]"
            src={category.heroImage}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-2 stone-texture z-20" />
    </section>
  );
}
