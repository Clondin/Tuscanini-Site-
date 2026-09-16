import { useParams } from "react-router-dom";
import { getProductById, getCategoryForProduct } from "../data/products";
import ProductNotFound from "../components/product/ProductNotFound";
import ProductBreadcrumb from "../components/product/ProductBreadcrumb";
import ProductDossier from "../components/product/ProductDossier";
import ProductStory from "../components/product/ProductStory";
import RelatedProducts from "../components/product/RelatedProducts";
import RecipeSuggestions from "../components/product/RecipeSuggestions";
import NewsletterSignup from "../components/home/NewsletterSignup";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const category = id ? getCategoryForProduct(id) : undefined;

  if (!product || !category) {
    return <ProductNotFound />;
  }

  const siblings = category.products.filter((p) => p.id !== product.id);

  return (
    <div className="min-h-screen bg-surface">
      <ProductBreadcrumb
        categoryName={category.name}
        categorySlug={category.slug}
        productName={product.name}
      />
      <ProductDossier
        key={product.id}
        product={product}
        categoryName={category.name}
        categorySlug={category.slug}
      />
      {product.details && product.details !== product.description && <ProductStory productName={product.name} details={product.details} />}
      <RelatedProducts
        products={siblings}
        categorySlug={category.slug}
        totalInCategory={category.products.length}
      />
      <RecipeSuggestions productId={product.id} />
      <NewsletterSignup />
    </div>
  );
}
