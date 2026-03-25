import { useParams } from "react-router-dom";
import { getProductById, getCategoryForProduct } from "../data/products";
import ProductNotFound from "../components/product/ProductNotFound";
import ProductBreadcrumb from "../components/product/ProductBreadcrumb";
import ProductHero from "../components/product/ProductHero";
import ProductStory from "../components/product/ProductStory";
import RelatedProducts from "../components/product/RelatedProducts";
import RecipeSuggestions from "../components/product/RecipeSuggestions";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const category = id ? getCategoryForProduct(id) : undefined;

  if (!product || !category) {
    return <ProductNotFound />;
  }

  const relatedProducts = category.products.filter((p) => p.id !== product.id);

  return (
    <div className="min-h-screen bg-surface">
      <ProductBreadcrumb
        categoryName={category.name}
        categorySlug={category.slug}
        productName={product.name}
      />
      <ProductHero
        product={product}
        categoryName={category.name}
        categorySlug={category.slug}
      />
      <ProductStory productName={product.name} />
      <RecipeSuggestions productId={product.id} />
      <RelatedProducts products={relatedProducts} categoryName={category.name} />
    </div>
  );
}
