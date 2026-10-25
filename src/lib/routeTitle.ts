import { formatProductSize } from "./formatProductSize";

const compactProductNames: Record<string, string> = {
  "Solid Light Tuna in Olive Oil with Chili Peppers - Can": "Tuna in Olive Oil with Chili - Can",
  "Solid Light Tuna in Olive Oil with Chili Peppers - Three Pack": "Tuna in Olive Oil with Chili - 3 Pack",
};

export function productRouteTitle(name: string, siteTitle = "Tuscanini"): string {
  return `${compactProductNames[name] ?? name} | ${siteTitle}`;
}

/**
 * Search-result title for a product page: "Tuscanini <name> <size> | Imported from Italy"
 * (or "| Italian Food" when the product is not marked made in Italy), shortened step by
 * step to stay within 60 characters, falling back to "<name> | Tuscanini".
 */
export function productSeoTitle(
  product: { name: string; size?: string; madeInItaly?: boolean },
  siteTitle = "Tuscanini",
): string {
  const name = compactProductNames[product.name] ?? product.name;
  const branded = new RegExp(`^${siteTitle}\\b`, "i").test(name) ? name : `${siteTitle} ${name}`;
  const formattedSize = formatProductSize(product.size);
  const squash = (value: string) => value.replace(/\s+/g, "").toLowerCase();
  const size = formattedSize && !squash(name).includes(squash(formattedSize)) ? formattedSize : "";
  const suffix = product.madeInItaly ? "Imported from Italy" : "Italian Food";
  const candidates = [
    size ? `${branded} ${size} | ${suffix}` : "",
    `${branded} | ${suffix}`,
    size ? `${branded} ${size}` : "",
  ].filter(Boolean);
  return candidates.find((title) => title.length <= 60) ?? productRouteTitle(product.name, siteTitle);
}
