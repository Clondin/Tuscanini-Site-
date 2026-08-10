export interface SourcingRegion {
  id: string;
  geometryName: string;
  name: string;
  eyebrow: string;
  description: string;
  products: string[];
  coordinates: [longitude: number, latitude: number];
  categorySlug: string;
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
    eyebrow: "Alpine craft",
    description:
      "At the foot of the Alps, generations of confectioners pair deeply roasted hazelnuts with fine chocolate and the region's celebrated truffles.",
    products: ["Chocolate", "Hazelnuts", "Truffles"],
    coordinates: [7.8, 45.05],
    categorySlug: "chocolate",
    color: "#8c3b24",
  },
  {
    id: "liguria",
    geometryName: "Liguria",
    name: "Liguria",
    eyebrow: "The basil coast",
    description:
      "Terraced coastal hills, sea air and fragrant basil give Ligurian pesto its unmistakably vivid, herbaceous character.",
    products: ["Pesto", "Basil", "Olive Oil"],
    coordinates: [8.75, 44.3],
    categorySlug: "pesto",
    color: "#596536",
  },
  {
    id: "emilia-romagna",
    geometryName: "Emilia-Romagna",
    name: "Emilia-Romagna",
    eyebrow: "Italy's food valley",
    description:
      "A region of patient aging and time-honored kitchens, renowned for filled pastas, rich sauces and the heritage of balsamic vinegar.",
    products: ["Pasta", "Sauces", "Balsamic"],
    coordinates: [11.05, 44.55],
    categorySlug: "vinegars-glazes",
    color: "#a75834",
  },
  {
    id: "tuscany",
    geometryName: "Toscana",
    name: "Tuscany",
    eyebrow: "The olive hills",
    description:
      "Rolling groves and a table built on simplicity shape the peppery oils, rustic pantry staples and generous flavors of central Italy.",
    products: ["Olive Oil", "Beans", "Cooking Wines"],
    coordinates: [11.0, 43.35],
    categorySlug: "olive-oil",
    color: "#6c713d",
  },
  {
    id: "campania",
    geometryName: "Campania",
    name: "Campania",
    eyebrow: "Volcanic abundance",
    description:
      "Sun, mineral-rich soil and the culinary traditions around Naples inspire vibrant tomatoes, classic pizza and soulful pasta dishes.",
    products: ["Tomatoes", "Pizza", "Pasta"],
    coordinates: [14.75, 40.85],
    categorySlug: "canned-tomatoes",
    color: "#a83e2c",
  },
  {
    id: "puglia",
    geometryName: "Puglia",
    name: "Puglia",
    eyebrow: "Ancient olive country",
    description:
      "Silver-leaved groves and fertile plains define the heel of Italy, home to monumental olives, golden oils and crisp regional breads.",
    products: ["Olives", "Olive Oil", "Crackers"],
    coordinates: [16.65, 41.05],
    categorySlug: "olives",
    color: "#737443",
  },
  {
    id: "sicily",
    geometryName: "Sicilia",
    name: "Sicily",
    eyebrow: "The Mediterranean island",
    description:
      "Sicily's volcanic earth and surrounding sea yield intensely fragrant citrus, distinctive olives and a proud tradition of preserved seafood.",
    products: ["Citrus", "Olives", "Seafood"],
    coordinates: [14.2, 37.6],
    categorySlug: "tuna-seafood",
    color: "#b26332",
  },
];

export const sourcingRegionByGeometry = new Map(
  sourcingRegions.map((region) => [region.geometryName, region]),
);
