import type { Product } from "../data/products";
import { formatProductSize } from "./formatProductSize";

/**
 * Extra schema.org/Product fields shared by the live page metadata and the pre-rendered HTML:
 * the description with a kosher note when the product is marked kosher, the pack size and the SKU.
 * No offers: the site has no prices, so none are published.
 */
export function productSchemaFields(product: Pick<Product, "description" | "kosher" | "size" | "sku">) {
  const description = (product.description || "").trim();
  const kosherNote = product.kosher ? "Certified kosher." : "";
  const size = formatProductSize(product.size);
  return {
    description: [description, kosherNote].filter(Boolean).join(" "),
    ...(size ? { size } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
  };
}
