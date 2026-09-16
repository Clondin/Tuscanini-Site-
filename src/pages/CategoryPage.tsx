import { useParams } from "react-router-dom";
import { getCategoryBySlug, categories } from "../data/products";
import CategoryNotFound from "../components/category/CategoryNotFound";
import CatalogBrowser from "../components/category/CatalogBrowser";
import CategoryBreadcrumbs from "../components/category/CategoryBreadcrumbs";
import CategoryDescription from "../components/category/CategoryDescription";
import RelatedCategories from "../components/category/RelatedCategories";
import CategoryClosing from "../components/category/CategoryClosing";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;

  if (!category) {
    return <CategoryNotFound />;
  }

  return (
    <div className="min-h-screen bg-earth-dark selection:bg-burnt-terracotta selection:text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-6 pb-16">
        <CategoryBreadcrumbs categoryName={category.name} />
        <div className="mb-6">
          <h1 className="font-headline text-4xl md:text-5xl text-heading">
            {category.name}
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-on-surface/85 leading-relaxed">
            {category.description}
          </p>
        </div>
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
