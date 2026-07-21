import { useParams } from "react-router-dom";
import { getProductById, getCategoryForProduct } from "../data/products";
import { getCategoryAccent } from "../data/category-accents";
import ProductNotFound from "../components/product/ProductNotFound";
import ProductBreadcrumb from "../components/product/ProductBreadcrumb";
import ProductHero from "../components/product/ProductHero";
import ProductStory from "../components/product/ProductStory";
import RecipeSuggestions from "../components/product/RecipeSuggestions";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const category = id ? getCategoryForProduct(id) : undefined;

  if (!product || !category) {
    return <ProductNotFound />;
  }

  const accent = getCategoryAccent(category.slug);

  return (
    <div className="min-h-screen bg-surface">
      <ProductBreadcrumb
        categoryName={category.name}
        categorySlug={category.slug}
        productName={product.name}
      />
      <ProductHero product={product} categoryName={category.name} accent={accent}>
        <ProductStory productName={product.name} accent={accent} inline />
      </ProductHero>
      <RecipeSuggestions productId={product.id} />
    </div>
  );
}
