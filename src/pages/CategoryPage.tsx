import { useParams } from "react-router-dom";
import { getCategoryBySlug, categories } from "../data/products";
import { getPosterColor } from "../data/category-accents";
import CategoryNotFound from "../components/category/CategoryNotFound";
import CategoryProducts from "../components/category/CategoryProducts";
import CategoryBreadcrumbs from "../components/category/CategoryBreadcrumbs";
import CategoryDescription from "../components/category/CategoryDescription";
import RelatedCategories from "../components/category/RelatedCategories";
import CategoryClosing from "../components/category/CategoryClosing";
import PackFan from "../components/ui/PackFan";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;

  if (!category) {
    return <CategoryNotFound />;
  }
  const poster = getPosterColor(category.slug);

  return (
    <div className="min-h-screen bg-paper selection:bg-tomato selection:text-paper">
      <header
        style={{ backgroundColor: poster.background }}
        className={`relative overflow-hidden ${poster.ink ? "text-ink" : "text-paper"}`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-7 md:pt-10 grid md:grid-cols-[1.2fr_0.8fr] gap-6 items-end">
          <div className="pb-10 md:pb-16">
            <CategoryBreadcrumbs categoryName={category.name} />
            <h1 className="font-headline font-medium text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.03em]">
              {category.name}
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed">
              {category.description}
            </p>
          </div>
          <div className="hidden md:block h-[300px] lg:h-[360px]">
            <PackFan
              products={category.products}
              eager
              onColor
              sizes="(min-width: 1024px) 320px, 30vw"
            />
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-8 pb-16">
        <CategoryProducts key={category.id} category={category} />
      </div>
      <CategoryDescription category={category} />
      <RelatedCategories
        currentCategoryId={category.id}
        allCategories={categories}
      />
      <CategoryClosing category={category} />
    </div>
  );
}
