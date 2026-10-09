export interface SourcingRegion {
  id: string;
  geometryName: string;
  name: string;
  eyebrow: string;
  description: string;
  products: string[];
  coordinates: [longitude: number, latitude: number];
  categorySlug: string;
  /**
   * Collections whose food type matches the region's specialties, shown as
   * related products. This links food types only; it is not a statement of
   * where any product is made. The first entry should equal `categorySlug`.
   */
  related: string[];
  color: string;
}

// These coordinates are broad regional anchors, not factory or supplier
// locations. They intentionally communicate provenance without exposing any
// private operational information.
export const sourcingRegions: SourcingRegion[] = [
  {
    id: "piedmont",
    geometryName: "Piemonte",
    name: "Piedmont",
    eyebrow: "Chocolate and hazelnuts",
    description:
      "Piedmont is known for hazelnuts, chocolate, and truffles.",
    products: ["Chocolate", "Hazelnuts", "Truffles"],
    coordinates: [7.8, 45.05],
    categorySlug: "chocolate",
    related: ["chocolate"],
    color: "#8c3b24",
  },
  {
    id: "liguria",
    geometryName: "Liguria",
    name: "Liguria",
    eyebrow: "Basil and pesto",
    description:
      "Basil pesto is one of Liguria's best-known foods. It combines basil with olive oil and other ingredients.",
    products: ["Pesto", "Basil", "Olive Oil"],
    coordinates: [8.75, 44.3],
    categorySlug: "pesto",
    related: ["pesto"],
    color: "#596536",
  },
  {
    id: "emilia-romagna",
    geometryName: "Emilia-Romagna",
    name: "Emilia-Romagna",
    eyebrow: "Pasta and balsamic vinegar",
    description:
      "Emilia-Romagna is known for filled pasta, sauces, and balsamic vinegar.",
    products: ["Pasta", "Sauces", "Balsamic"],
    coordinates: [11.05, 44.55],
    categorySlug: "vinegars-glazes",
    related: ["vinegars-glazes", "pasta-gnocchi"],
    color: "#a75834",
  },
  {
    id: "tuscany",
    geometryName: "Toscana",
    name: "Tuscany",
    eyebrow: "Olive oil and beans",
    description:
      "Olive oil, beans, and wine are staples of Tuscan cooking.",
    products: ["Olive Oil", "Beans", "Cooking Wines"],
    coordinates: [11.0, 43.35],
    categorySlug: "olive-oil",
    related: ["olive-oil"],
    color: "#6c713d",
  },
  {
    id: "campania",
    geometryName: "Campania",
    name: "Campania",
    eyebrow: "Tomatoes, pizza, and pasta",
    description:
      "Campania includes Naples and is known for tomatoes, pizza, and pasta.",
    products: ["Tomatoes", "Pizza", "Pasta"],
    coordinates: [14.75, 40.85],
    categorySlug: "canned-tomatoes",
    related: ["canned-tomatoes", "pasta-sauces", "pizza"],
    color: "#a83e2c",
  },
  {
    id: "puglia",
    geometryName: "Puglia",
    name: "Puglia",
    eyebrow: "Olives and bread",
    description:
      "Puglia, in the heel of Italy, is known for olives, olive oil, and regional breads.",
    products: ["Olives", "Olive Oil", "Crackers"],
    coordinates: [16.65, 41.05],
    categorySlug: "olives",
    related: ["olives"],
    color: "#737443",
  },
  {
    id: "sicily",
    geometryName: "Sicilia",
    name: "Sicily",
    eyebrow: "Citrus, olives, and seafood",
    description:
      "Sicily is known for citrus, olives, and preserved seafood.",
    products: ["Citrus", "Olives", "Seafood"],
    coordinates: [14.2, 37.6],
    categorySlug: "tuna-seafood",
    related: ["tuna-seafood", "olives"],
    color: "#b26332",
  },
];

export const sourcingRegionByGeometry = new Map(
  sourcingRegions.map((region) => [region.geometryName, region]),
);
