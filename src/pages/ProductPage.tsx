import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { getProductById, getCategoryForProduct } from "../data/products";
import ProductNotFound from "../components/product/ProductNotFound";
import ProductBreadcrumb from "../components/product/ProductBreadcrumb";
import ProductDossier from "../components/product/ProductDossier";
import ProductStudio from "../components/product/ProductStudio";
import ProductShelfTag from "../components/product/ProductShelfTag";
import ProductCover from "../components/product/ProductCover";
import ProductSpecSheet, {
  ProductSpecLabelSheet,
  ProductSpecMasthead,
  ProductSpecTint,
} from "../components/product/ProductSpecSheet";
import ProductSpotlight from "../components/product/ProductSpotlight";
import ProductLabel from "../components/product/ProductLabel";
import ProductStory from "../components/product/ProductStory";
import RelatedProducts from "../components/product/RelatedProducts";
import RecipeSuggestions from "../components/product/RecipeSuggestions";
import NewsletterSignup from "../components/home/NewsletterSignup";

/**
 * Design review only: ?layout=studio|shelf|cover|spec|spotlight|label previews alternative
 * product layouts. Without the parameter the current poster renders and no
 * switcher appears. Remove once a layout is chosen.
 */
const layouts = {
  poster: { label: "Current", Component: ProductDossier },
  studio: { label: "H · Studio", Component: ProductStudio },
  shelf: { label: "I · Shelf", Component: ProductShelfTag },
  cover: { label: "J · Cover", Component: ProductCover },
  spec: { label: "K · Spec", Component: ProductSpecSheet },
  "spec-tint": { label: "K2 · Tint", Component: ProductSpecTint },
  "spec-masthead": { label: "K3 · Masthead", Component: ProductSpecMasthead },
  "spec-sheet": { label: "K4 · Label sheet", Component: ProductSpecLabelSheet },
  spotlight: { label: "L · Dark", Component: ProductSpotlight },
  label: { label: "M · Label", Component: ProductLabel },
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
  const choice: LayoutKey =
    requested && requested in layouts ? (requested as LayoutKey) : "poster";
  const { Component: Layout } = layouts[choice];
  const siblings = category.products.filter((p) => p.id !== product.id);

  return (
    <div className="min-h-screen bg-surface">
      <ProductBreadcrumb
        categoryName={category.name}
        categorySlug={category.slug}
        productName={product.name}
      />
      <Layout
        key={`${product.id}-${choice}`}
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
          className="fixed z-40 left-1/2 -translate-x-1/2 bottom-24 lg:bottom-6 flex max-w-[calc(100vw-24px)] overflow-x-auto gap-1 rounded-full bg-ink/90 p-1 shadow-2xl backdrop-blur"
        >
          {(Object.keys(layouts) as LayoutKey[]).map((key) => (
            <Link
              key={key}
              to={`?layout=${key}`}
              replace
              aria-current={key === choice ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3 sm:px-4 py-2 text-xs font-semibold ${
                key === choice ? "bg-paper text-ink" : "text-paper/85 hover:text-paper"
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
