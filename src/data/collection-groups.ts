import type { Category } from "./products";

const definitions = [
  {
    label: "Pasta & Sauces",
    slugs: ["pasta-gnocchi", "pasta-sauces", "pesto", "canned-tomatoes"],
  },
  {
    label: "Pantry",
    slugs: [
      "olive-oil",
      "vinegars-glazes",
      "cooking-wines-citrus",
      "olives",
      "italian-condiments",
      "seasonings-truffles",
      "flour-baking",
      "tuna-seafood",
      "cheese",
    ],
  },
  {
    label: "Snacks & Sweets",
    slugs: [
      "chocolate",
      "potato-chips",
      "chestnuts",
      "fruit-spreads",
      "dessert-sauces",
      "crackers-breadsticks",
    ],
  },
  { label: "Drinks", slugs: ["beverages"] },
  { label: "Frozen", slugs: ["pizza", "bread-frozen-appetizers", "gelato"] },
];
export function collectionGroups(categories: Category[]) {
  const known = new Set(definitions.flatMap((group) => group.slugs));
  return definitions
    .map((group) => ({
      label: group.label,
      items: categories.filter(
        (category) =>
          group.slugs.includes(category.slug) ||
          (group.label === "Pantry" && !known.has(category.slug)),
      ),
    }))
    .filter((group) => group.items.length);
}
