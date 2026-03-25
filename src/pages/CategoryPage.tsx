import { useParams } from "react-router-dom";
import { getCategoryBySlug, categories } from "../data/products";
import CategoryNotFound from "../components/category/CategoryNotFound";
import CategoryHeroBanner from "../components/category/CategoryHeroBanner";
import CategoryDescription from "../components/category/CategoryDescription";
import ProductGrid from "../components/category/ProductGrid";
import RelatedCategories from "../components/category/RelatedCategories";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;

  if (!category) {
    return <CategoryNotFound />;
  }

  return (
    <div className="min-h-screen bg-surface selection:bg-burnt-terracotta selection:text-white">
      <CategoryHeroBanner category={category} />
      <CategoryDescription description={category.description} />
      <ProductGrid products={category.products} />
      <RelatedCategories currentCategoryId={category.id} allCategories={categories} />
    </div>
  );
}
