// Per-category accent colors, each derived from the product itself
// (tomato red, basil green, Moscato blue, ...). Keyed by category slug;
// category ids match slugs in the catalog data, so either works.
export interface CategoryAccent {
  /** Rich mid-tone — dots, bars, decorative fills */
  accent: string;
  /** Dark shade — text, buttons (readable on light surfaces) */
  deep: string;
  /** Very light tint — soft backdrops behind product imagery */
  soft: string;
}

const FALLBACK: CategoryAccent = {
  accent: "#b85c38",
  deep: "#8c3b24",
  soft: "#f3e6dc",
};

export const categoryAccents: Record<string, CategoryAccent> = {
  beverages: { accent: "#5b6f94", deep: "#3d4d6b", soft: "#e8ecf3" },
  "pasta-gnocchi": { accent: "#c99a3f", deep: "#8a6524", soft: "#f5edda" },
  pizza: { accent: "#a83a2e", deep: "#7c2a20", soft: "#f5e2de" },
  "olive-oil": { accent: "#8a8f3c", deep: "#5e6226", soft: "#eff0dd" },
  "vinegars-glazes": { accent: "#6b3a52", deep: "#4d2939", soft: "#efe2e9" },
  "pasta-sauces": { accent: "#b23a2a", deep: "#822a1e", soft: "#f6e2de" },
  "canned-tomatoes": { accent: "#c04030", deep: "#8c2e22", soft: "#f7e3df" },
  chocolate: { accent: "#6b4a33", deep: "#4b3323", soft: "#ede4dd" },
  olives: { accent: "#5f6b3c", deep: "#424a29", soft: "#e9ecdd" },
  "italian-condiments": { accent: "#b5522e", deep: "#833a20", soft: "#f6e6dd" },
  "potato-chips": { accent: "#c9932f", deep: "#8f671f", soft: "#f5ecd8" },
  chestnuts: { accent: "#7d4f2e", deep: "#583720", soft: "#efe4da" },
  "tuna-seafood": { accent: "#3f6d84", deep: "#2c4d5e", soft: "#e1ebf0" },
  "cooking-wines-citrus": { accent: "#8a3a4d", deep: "#622a37", soft: "#f2e1e6" },
  "flour-baking": { accent: "#a08a5f", deep: "#6f5f40", soft: "#f1ece1" },
  pesto: { accent: "#4d7038", deep: "#364f27", soft: "#e4edde" },
  "seasonings-truffles": { accent: "#55483a", deep: "#3b3228", soft: "#e9e5e0" },
  "fruit-spreads": { accent: "#9c3a56", deep: "#6e293d", soft: "#f4e1e8" },
  cheese: { accent: "#c9a13f", deep: "#8d702b", soft: "#f5eeda" },
  biscotti: { accent: "#a5793d", deep: "#745428", soft: "#f2e9db" },
  "crackers-breadsticks": { accent: "#b08a45", deep: "#7c612f", soft: "#f3ecdd" },
  gelato: { accent: "#c27a8a", deep: "#8a5361", soft: "#f7e9ec" },
  "bread-frozen-appetizers": { accent: "#9c6b3d", deep: "#6e4b29", soft: "#f1e7da" },
  "dairy-sauces": { accent: "#b09a6b", deep: "#7b6b48", soft: "#f3efe4" },
  "chips-merchandising": { accent: "#c9932f", deep: "#8f671f", soft: "#f5ecd8" },
  "foodservice-olives": { accent: "#5f6b3c", deep: "#424a29", soft: "#e9ecdd" },
  "foodservice-tuna-tomato-dessert": { accent: "#3f6d84", deep: "#2c4d5e", soft: "#e1ebf0" },
  "foodservice-vinegar-citrus": { accent: "#8a3a4d", deep: "#622a37", soft: "#f2e1e6" },
  "pasta-foodservice": { accent: "#c99a3f", deep: "#8a6524", soft: "#f5edda" },
};

export function getCategoryAccent(slugOrId: string | undefined): CategoryAccent {
  if (!slugOrId) return FALLBACK;
  return categoryAccents[slugOrId] ?? FALLBACK;
}
