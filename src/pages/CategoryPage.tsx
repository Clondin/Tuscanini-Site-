import { useParams } from "react-router-dom";
import { getCategoryBySlug, categories } from "../data/products";
import CategoryNotFound from "../components/category/CategoryNotFound";
import CategoryShelf from "../components/category/CategoryShelf";
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
      <CategoryShelf key={category.id} category={category} />
      <CategoryDescription category={category} />
      <RelatedCategories currentCategoryId={category.id} allCategories={categories} />
      <CategoryClosing category={category} />
    </div>
  );
}
