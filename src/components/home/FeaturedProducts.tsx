import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { getCategoryForProduct, getProductById } from "../../data/products";
import { formatProductSize } from "../../lib/formatProductSize";
import {
  getResponsiveImageProps,
  isMissingProductImage,
} from "../../lib/productImage";

/**
 * Code-selected spotlight, one product from each core aisle. Names, images,
 * sizes, and collections come from the merged catalog; an unknown or
 * photo-less ID is skipped rather than rendered as an empty card.
 */
const SPOTLIGHT_PRODUCT_IDS = [
  "evoo-750ml",
  "napoletana-pasta-sauce",
  "sparkling-lemonade",
  "chocolate-truffle-pistachio",
];

export default function FeaturedProducts() {
  const featured = SPOTLIGHT_PRODUCT_IDS.flatMap((id) => {
    const product = getProductById(id);
    if (!product || isMissingProductImage(product.image)) return [];
    return [{ product, collection: getCategoryForProduct(product.id)?.name }];
  });
  if (featured.length === 0) return null;

  return (
    <section
      id="spotlight"
      className="bg-surface py-16 md:py-24 px-5 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Pantry favorites"
          action={{ label: "Shop all products", to: "/products" }}
          className="mb-10"
        />

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8">
          {featured.map(({ product, collection }) => (
            <li key={product.id}>
              <Link
                to={`/product/${product.id}`}
                className="group block text-inherit"
              >
                <div className="relative aspect-[4/5] flex items-end justify-center overflow-hidden bg-aged-cream px-6 pt-8 pb-10">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-6 bottom-6 h-6 rounded-[50%] bg-heading/15 blur-md transition-transform duration-500 group-hover:scale-x-90 motion-reduce:transition-none"
                  />
                  <img
                    {...getResponsiveImageProps(
                      product.image,
                      "(min-width: 1024px) 300px, 45vw",
                    )}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="relative h-full w-full object-contain object-bottom mix-blend-multiply transition-transform duration-500 ease-out group-hover:-translate-y-2 motion-reduce:transform-none"
                  />
                </div>
                {collection && (
                  <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-burnt-terracotta">
                    {collection}
                  </p>
                )}
                <h3 className="mt-2 font-headline text-xl md:text-[23px] leading-snug text-heading group-hover:text-olive-accent transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-on-surface/75">
                  {formatProductSize(product.size)}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-olive-deep">
                  View product
                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
