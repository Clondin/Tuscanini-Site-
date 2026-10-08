import { useParams } from "react-router-dom";
import { getCategoryBySlug, categories } from "../data/products";
import { getCategoryAccent } from "../data/category-accents";
import CategoryNotFound from "../components/category/CategoryNotFound";
import CatalogBrowser from "../components/category/CatalogBrowser";
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
  const accent = getCategoryAccent(category.slug);

  return (
    <div className="min-h-screen bg-earth-dark selection:bg-burnt-terracotta selection:text-white">
      <header
        style={{ backgroundColor: accent.soft }}
        className="relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-6 md:pt-8 grid md:grid-cols-[1.15fr_0.85fr] gap-6 items-end">
          <div className="pb-8 md:pb-14">
            <CategoryBreadcrumbs categoryName={category.name} />
            <h1 className="font-headline text-[clamp(2.5rem,6vw,4.75rem)] leading-[1] text-heading">
              {category.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg text-on-surface/85 leading-relaxed">
              {category.description}
            </p>
          </div>
          <div className="hidden md:block h-[280px] lg:h-[330px]">
            <PackFan
              products={category.products}
              eager
              sizes="(min-width: 1024px) 300px, 30vw"
            />
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-8 pb-16">
        <CatalogBrowser
          key={category.id}
          categories={categories}
          category={category}
        />
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
