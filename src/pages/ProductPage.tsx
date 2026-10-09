import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { getProductById, getCategoryForProduct } from "../data/products";
import ProductNotFound from "../components/product/ProductNotFound";
import ProductBreadcrumb from "../components/product/ProductBreadcrumb";
import ProductDossier from "../components/product/ProductDossier";
import ProductPoster from "../components/product/ProductPoster";
import ProductEditorial from "../components/product/ProductEditorial";
import ProductSpec from "../components/product/ProductSpec";
import ProductStory from "../components/product/ProductStory";
import RelatedProducts from "../components/product/RelatedProducts";
import RecipeSuggestions from "../components/product/RecipeSuggestions";
import NewsletterSignup from "../components/home/NewsletterSignup";

/**
 * Design review only: \`?layout=poster|editorial|spec\` previews alternative
 * product layouts. Without the parameter the default layout renders and no
 * switcher appears. Remove once a layout is chosen.
 */
const layouts = {
  current: { label: "Current", Component: ProductDossier },
  poster: { label: "A · Poster", Component: ProductPoster },
  editorial: { label: "B · Editorial", Component: ProductEditorial },
  spec: { label: "C · Spec sheet", Component: ProductSpec },
} as const;
type LayoutKey = keyof typeof layouts;

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const product = id ? getProductById(id) : undefined;
  const category = id ? getCategoryForProduct(id) : undefined;

  if (!product || !category) {
    return <ProductNotFound />;
  }

  if (id !== product.id) {
    return <Navigate replace to={`/product/${product.id}`} />;
  }

  const requested = params.get("layout");
  const layout: LayoutKey =
    requested && requested in layouts ? (requested as LayoutKey) : "current";
  const { Component } = layouts[layout];
  const siblings = category.products.filter((p) => p.id !== product.id);

  return (
    <div className="min-h-screen bg-surface">
      <ProductBreadcrumb
        categoryName={category.name}
        categorySlug={category.slug}
        productName={product.name}
      />
      <Component
        key={`${product.id}-${layout}`}
        product={product}
        categoryName={category.name}
        categorySlug={category.slug}
      />
      {product.details && product.details !== product.description && <ProductStory details={product.details} />}
      <RelatedProducts
        products={siblings}
        categorySlug={category.slug}
      />
      <RecipeSuggestions productId={product.id} />
      <NewsletterSignup />
      {requested !== null && (
        <nav
          aria-label="Product layout options"
          className="fixed z-40 left-1/2 -translate-x-1/2 bottom-24 lg:bottom-6 flex gap-1 rounded-full bg-ink/90 p-1 shadow-2xl backdrop-blur"
        >
          {(Object.keys(layouts) as LayoutKey[]).map((key) => (
            <Link
              key={key}
              to={`?layout=${key}`}
              replace
              aria-current={key === layout ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3 sm:px-4 py-2 text-xs font-semibold ${
                key === layout ? "bg-paper text-ink" : "text-paper/85 hover:text-paper"
              }`}
            >
              {layouts[key].label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
