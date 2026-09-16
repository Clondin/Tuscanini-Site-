import type { Category, Product } from "../data/products";

export const isFrozenProduct = (product: Product) =>
  Boolean(
    product.frozen ||
      ["pizza", "gelato", "bread-frozen-appetizers"].includes(
        product.categoryId,
      ),
  );
export const isGlutenFreeProduct = (product: Product) =>
  /\bgluten[ -]free\b/i.test(product.name);

export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\bevoo\b/g, "extra virgin olive oil")
    .replace(/\bchilli\b/g, "chili")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function distance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++)
      row[j] = Math.min(
        row[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + Number(a[i - 1] !== b[j - 1]),
      );
    previous = row;
  }
  return previous[b.length];
}

export function searchCatalog(catalog: Category[], query: string) {
  const q = normalizeSearch(query);
  const tokens = q.split(" ").filter(Boolean);
  return catalog
    .flatMap((category) =>
      category.products
        .filter((product) => product.image)
        .flatMap((product) => {
          const name = normalizeSearch(product.name);
          const text = normalizeSearch(
            [
              product.name,
              product.description,
              product.size,
              product.sku,
              category.name,
              isFrozenProduct(product) ? "frozen" : "",
              product.kosher === true ? "kosher" : "",
            ]
              .filter(Boolean)
              .join(" "),
          );
          if (tokens.every((token) => text.includes(token))) {
            return [
              {
                product,
                category,
                approximate: false,
                score:
                  !q || name === q
                    ? 0
                    : name.startsWith(q)
                      ? 1
                      : name.includes(q)
                        ? 2
                        : 3,
              },
            ];
          }
          // Misspellings match product/category words, never an inferred dietary claim.
          const words = normalizeSearch(
            `${product.name} ${category.name}`,
          ).split(" ");
          if (
            tokens.length &&
            tokens.every(
              (token) =>
                text.includes(token) ||
                (token.length >= 5 &&
                  words.some(
                    (word) =>
                      distance(token, word) <= (token.length >= 8 ? 2 : 1),
                  )),
            )
          ) {
            return [{ product, category, approximate: true, score: 5 }];
          }
          return [];
        }),
    )
    .sort((a, b) => a.score - b.score);
}
