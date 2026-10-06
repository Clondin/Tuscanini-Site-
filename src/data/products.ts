import { pantryCategories } from "./categories-pantry";
import { mealCategories } from "./categories-meals";
import { snackCategories } from "./categories-snacks";
import { foodserviceCategories } from "./categories-foodservice";
import { mergeKaycoCatalog } from "./kayco-catalog";
import { kaycoSnapshot } from "./kayco-catalog.generated";
import { canonicalProductId } from '../lib/productAliases';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  details?: string;
  ingredients?: string;
  size?: string;
  kosher?: boolean;
  madeInItaly?: boolean;
  frozen?: boolean;
  sku?: string;
  storage?: string;
  preparation?: string[];
  nutritionImage?: string;
  nutritionFacts?: string[];
  nutritionServing?: string;
  nutritionCalories?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  products: Product[];
}

// NOTE: The following chip product images existed before the chips category was removed:
//   - Sun-Dried Tomato Chips: /assets/Chips/IMG_0022-2.jpg
//   - Italian Potato Chips:   /assets/Chips/IMG_0032.jpg

const catalogCategories: Category[] = [
  {
    id: "beverages",
    name: "Beverages",
    slug: "beverages",
    tagline: "Sparkling drinks and juices",
    description: "Sparkling grape juices, lemonades, colas, mineral water, and fruit juices in a range of flavors and bottle sizes.",
    heroImage: "/assets/ads/sparkling-parallax2.jpg",
    products: [
      {
        id: "moscato-grape-juice",
        name: "Moscato Sparkling Grape Juice",
        description: "Non-alcoholic sparkling Moscato grape juice with a light sweetness.",
        image: "/assets/Beverage/Moscato Juice/Mockups/71006931470.jpg",
        categoryId: "beverages",
        details: "Sparkling juice made from Moscato grapes, in the blue Tuscanini bottle.",
        size: "25.4 fl oz (750ml)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "moscato-rose-juice",
        name: "Moscato Rosé Sparkling Grape Juice",
        description: "Non-alcoholic sparkling rosé grape juice with strawberry notes.",
        image: "/assets/Beverage/Moscato Juice/Mockups/71006931471.jpg",
        categoryId: "beverages",
        details: "The rosé version of our sparkling Moscato grape juice, with a pink color and strawberry notes.",
        size: "25.4 fl oz (750ml)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-lemonade",
        name: "Sparkling Lemonade",
        description: "Sparkling lemonade made with Sicilian lemons.",
        image: "/assets/Beverage/730380.png",
        categoryId: "beverages",
        details: "A lightly sweetened, fizzy lemon drink made with Sicilian lemons.",
        size: "Available in 9.3 fl oz and 25.3 fl oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-blood-orange",
        name: "Sparkling Blood Orange",
        description: "Sparkling blood orange drink with a sweet-tart citrus flavor.",
        image: "/assets/Beverage/Sparkling Beverage/Tuscanini Flavored Seltzer Water_Mockups/Tuscanini Flavored Seltzer 0.5L 2.jpg",
        categoryId: "beverages",
        details: "Sicilian blood oranges give this drink its red color and sweet-tart flavor.",
        size: "Available in 9.3 fl oz and 25.3 fl oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "italian-cola",
        name: "Italian Cola",
        description: "Italian cola with natural flavors and a less-sweet taste.",
        image: "/assets/Beverage/Sparkling Beverage/Cola/Images/730382.png",
        categoryId: "beverages",
        details: "Cola with natural flavors, balanced sweetness, and spice notes.",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "flavored-seltzer",
        name: "Flavored Sparkling Water",
        description: "Lightly flavored sparkling water with no calories or sweeteners.",
        image: "/assets/Beverage/Sparkling Beverage/Tuscanini Flavored Seltzer Water_Mockups/Tuscanini Flavored Seltzer 0.5L 3.jpg",
        categoryId: "beverages",
        details: "Sparkling water in several flavors, with no calories or artificial sweeteners.",
        size: "16.9 fl oz (0.5L)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-soda",
        name: "Italian Soda",
        description: "Italian sodas made with fruit extracts and sparkling water.",
        image: "/assets/Beverage/Sparkling Beverage/Tuscanini Flavored Seltzer Water_Mockups/Tuscanini Flavored Seltzer 0.5L 4.jpg",
        categoryId: "beverages",
        details: "Fruit-flavored Italian sodas made with sparkling water.",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "natural-water",
        name: "Natural Mineral Water",
        description: "Italian natural mineral water from alpine springs.",
        image: "/assets/Beverage/Mineral-Water-Still-1L-730395.png",
        categoryId: "beverages",
        details: "Natural mineral water from Italian alpine springs, in still and sparkling varieties.",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-apple-cider",
        name: "Sparkling Apple Cider",
        description: "Sparkling apple cider made with Italian apples.",
        image: "/assets/Beverage/730473.png",
        categoryId: "beverages",
        details: "A sparkling apple drink with a crisp, naturally sweet taste.",
        size: "25.4 fl oz (750ml)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-bianco-grape-juice",
        name: "Sparkling Bianco Grape Juice",
        description: "Non-alcoholic sparkling juice made from Italian white grapes.",
        image: "/assets/Beverage/730474.png",
        categoryId: "beverages",
        details: "Sparkling white grape juice with a light, fruity taste.",
        size: "25.4 fl oz (750ml)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "sparkling-rosato-grape-juice",
        name: "Sparkling Rosato Grape Juice",
        description: "Pink, non-alcoholic sparkling grape juice with a fruity flavor.",
        image: "/assets/Beverage/730475.png",
        categoryId: "beverages",
        details: "Sparkling rosato grape juice with notes of berries and stone fruit.",
        size: "25.4 fl oz (750ml)",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "diet-cola",
        name: "Diet Cola",
        description: "Italian cola with zero sugar.",
        image: "/assets/Beverage/Sparkling Beverage/Cola/Images/730838.png",
        categoryId: "beverages",
        details: "A zero-sugar version of Tuscanini cola, made with natural flavors.",
        size: "9.3 fl oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "blood-orange-juice",
        name: "Blood Orange Juice",
        description: "Italian blood orange juice, not from concentrate.",
        image: "/assets/Beverage/730365.png",
        categoryId: "beverages",
        details: "Juice pressed from Sicilian blood oranges, with a deep red color and sweet citrus flavor.",
        size: "32 fl oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "mandarin-juice",
        name: "Mandarin Juice",
        description: "Italian mandarin juice with a sweet citrus flavor.",
        image: "/assets/Beverage/730366.png",
        categoryId: "beverages",
        details: "Mandarin juice to drink on its own or use as a mixer.",
        size: "32 fl oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "pomegranate-juice",
        name: "Pomegranate Juice",
        description: "Pomegranate juice with a sweet-tart flavor.",
        image: "/assets/Beverage/730367-2.png",
        categoryId: "beverages",
        details: "Pomegranate juice to drink on its own, add to smoothies, or use in cocktails.",
        size: "32 fl oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  {
    id: "chocolate",
    name: "Chocolate",
    slug: "chocolate",
    tagline: "Chocolate bars and truffles",
    description: "Chocolate bars and truffles in milk, dark, hazelnut, and pistachio varieties.",
    heroImage: "/assets/Chocolate Bars/pisa large 3 LARGER OPTION Topaz Gigapixel 2x scale copy.jpg",
    products: [
      {
        id: "chocolate-bar-collection",
        name: "Italian Chocolate Bar Collection",
        description: "Chocolate bars in milk, dark, and other varieties, with Italian landmarks on the packaging.",
        image: "/assets/Chocolate Bars/pisa large 3 LARGER OPTION Topaz Gigapixel 2x scale copy.jpg",
        categoryId: "chocolate",
        details: "Italian chocolate bars packaged with illustrations of Italian landmarks.",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chocolate-truffle-milk",
        name: "Milk Chocolate Truffles",
        description: "Milk chocolate truffles with a smooth center.",
        image: "/assets/Chocolate Truffles/730480.png",
        categoryId: "chocolate",
        details: "Chocolate truffles with a soft center and milk chocolate coating.",
        size: "5.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chocolate-truffle-dark",
        name: "Dark Chocolate Truffles",
        description: "Dark chocolate truffles with a ganache center.",
        image: "/assets/Chocolate Truffles/730481.png",
        categoryId: "chocolate",
        details: "Dark chocolate surrounds a soft ganache center.",
        size: "5.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chocolate-truffle-hazelnut",
        name: "Hazelnut Chocolate Truffles",
        description: "Chocolate truffles with roasted hazelnuts.",
        image: "/assets/Chocolate Truffles/730482.png",
        categoryId: "chocolate",
        details: "Chocolate and roasted hazelnuts in a truffle.",
        size: "5.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chocolate-truffle-pistachio",
        name: "Pistachio Chocolate Truffles",
        description: "Chocolate truffles with pistachios.",
        image: "/assets/Chocolate Truffles/730484.png",
        categoryId: "chocolate",
        details: "Pistachios give these chocolate truffles a nutty flavor.",
        size: "4.4 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "assorted-chocolate-truffles-gift-box",
        name: "Assorted Chocolate Truffles Gift Box",
        description: "A gift box of assorted chocolate truffles.",
        image: "/assets/Chocolate Truffles/730486.png",
        categoryId: "chocolate",
        details: "Milk, dark, and hazelnut chocolate truffles packed in a gift box.",
        size: "6.1 oz",
        kosher: true,
        madeInItaly: true,
      },
      {
        id: "chocolate-gianduiotti",
        name: "Chocolate Gianduiotti",
        description: "Foil-wrapped gianduiotti made with chocolate and roasted hazelnuts.",
        image: "/assets/Chocolate/730598.png",
        categoryId: "chocolate",
        details: "Boat-shaped gianduiotti chocolates with hazelnuts, individually wrapped in foil.",
        size: "4.2 oz",
        kosher: true,
        madeInItaly: true,
      },
    ],
  },
  ...pantryCategories,
  ...mealCategories,
  ...snackCategories,
  ...foodserviceCategories,
];

// Catalog exclusions retained for discontinued or intentionally hidden consumer lines.
const excludedCategoryIds = new Set([
  "gelato",
  "crackers-breadsticks",
  "biscotti",
  "foodservice-olives",
  "dairy-sauces",
  "foodservice-vinegar-citrus",
  "pasta-foodservice",
  "chips-merchandising",
  "foodservice-tuna-tomato-dessert",
]);

const excludedProductIds = new Set([
  "flavored-seltzer",
  "sparkling-soda",
  "natural-water",
  "chocolate-bar-collection",
  "truffle-ketchup",
  "tomato-paste-basil-tube",
  "garlic-chili-grinder",
  "garlic-grinder",
  "large-sliced-black-truffle",
  "large-minced-black-truffle",
  "creamy-ricotta-cheddar-thin-crust-pizza",
  "reserve-bbq-pulled-brisket-pizza",
  "cinnamon-chestnuts",
  "pizza-crust-bulk-16-5",
  "pizza-crust-bulk-9-8",
  "focaccia-bulk-foodservice",
]);

export const bundledCategories: Category[] = catalogCategories
  .filter((category) => !excludedCategoryIds.has(category.id))
  .map((category) => ({
    ...category,
    products: category.products.filter(
      (product) =>
        !excludedProductIds.has(product.id)
    ),
  }));

export let categories: Category[] = mergeKaycoCatalog(bundledCategories, kaycoSnapshot);

export function setCatalogCategories(nextCategories: Category[]): void {
  if (nextCategories.length > 0) categories = nextCategories;
}

// The metric and imperial flour listings used the same retail packages.
// Preserve their former URLs while showing one product per SKU.
export { productAliases, canonicalProductId } from '../lib/productAliases';

export function resolveProductId(id: string): string {
  // Published CMS IDs take precedence if an editor intentionally uses an alias.
  if (categories.some((category) => category.products.some((product) => product.id === id))) return id;
  return canonicalProductId(id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  const resolvedId = resolveProductId(id);
  for (const cat of categories) {
    const product = cat.products.find((p) => p.id === resolvedId);
    if (product) return product;
  }
  return undefined;
}

export function getCategoryForProduct(productId: string): Category | undefined {
  const resolvedId = resolveProductId(productId);
  return categories.find((cat) => cat.products.some((p) => p.id === resolvedId));
}
