import type { Product } from "../data/products";

const frozenCategoryIds = new Set(["pizza", "gelato", "bread-frozen-appetizers"]);
const amazonStoreUrl =
  "https://www.amazon.com/stores/Tuscanini/page/63CC7208-7FF4-4C25-B5F7-CAC5D4CA1C9A?lp_asin=B07KYWQ22X&store_ref=bl_ast_dp_brandlogo_sto&linkCode=ll2&tag=kaycopromo-20&linkId=723bc4fbe21f9f690cf8fd07d0c98802&language=en_US&ref_=as_li_ss_tl";

// Verified against Tuscanini's official flour page on October 5, 2026:
// https://www.tuscaninifoods.com/copy-of-truffle
// These direct product links do not contain affiliate tags.
const verifiedAmazonProducts: Record<string, string> = {
  "all-purpose-flour-2-2lb": "https://www.amazon.com/dp/B0FLZ52TXC",
  "high-gluten-flour-5lb": "https://www.amazon.com/dp/B0FLZQTYFG",
  "spelt-white-flour-5lb": "https://www.amazon.com/dp/B0FLZFRDTL",
};

// Product-specific destinations require verified SKU links. Shared destinations
// keep store/site labels so visitors know what the link will open.
export function getProductPurchaseLink(product: Pick<Product, "id" | "categoryId">) {
  const productUrl = verifiedAmazonProducts[product.id];
  if (productUrl) {
    return {
      href: productUrl,
      label: "View product on Amazon",
      amazon: true,
      sponsored: false,
    };
  }

  if (frozenCategoryIds.has(product.categoryId)) {
    return {
      href: "https://tuscaninifoods.com",
      label: "Visit Tuscanini Foods",
      amazon: false,
      sponsored: false,
    };
  }

  return {
    href: amazonStoreUrl,
    label: "Visit our Amazon store",
    amazon: true,
    sponsored: true,
  };
}
