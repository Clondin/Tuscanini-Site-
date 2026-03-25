export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  products: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  image?: string;
}

export const recipes: Recipe[] = [
  {
    id: "classic-margherita-pizza",
    name: "Classic Margherita Pizza",
    description:
      "The quintessential Neapolitan pizza with fresh mozzarella, basil, and a rich tomato sauce on a golden crust.",
    ingredients: [
      "Pizza crust",
      "Traditional pizza sauce",
      "Fresh mozzarella",
      "Fresh basil",
      "Extra virgin olive oil",
      "Sea salt",
    ],
    products: ["pizza-crust", "traditional-pizza-sauce", "evoo-750ml"],
    prepTime: "10 min",
    cookTime: "12 min",
    servings: 4,
  },
  {
    id: "pasta-al-pomodoro",
    name: "Pasta al Pomodoro",
    description:
      "A beautifully simple Italian classic — spaghetti tossed in a vibrant, garlicky tomato sauce finished with fresh basil.",
    ingredients: [
      "Spaghetti",
      "Classic marinara sauce",
      "Extra virgin olive oil",
      "Garlic",
      "Fresh basil",
      "Parmigiano-Reggiano",
    ],
    products: ["spaghetti", "classic-marinara-sauce", "evoo-750ml"],
    prepTime: "5 min",
    cookTime: "15 min",
    servings: 4,
  },
  {
    id: "bruschetta-trio",
    name: "Bruschetta Trio",
    description:
      "Crispy Italian flatbread topped three ways: sun-dried tomato pesto, olive tapenade, and garlic olive oil with fresh herbs.",
    ingredients: [
      "Italian flatbread",
      "Sun-dried tomato pesto",
      "Castelvetrano olives",
      "Extra virgin olive oil with garlic",
      "Fresh basil and oregano",
      "Sea salt",
    ],
    products: [
      "flatbread",
      "sun-dried-tomato-pesto",
      "pitted-green-castelvetrano",
      "evoo-garlic-250ml",
    ],
    prepTime: "15 min",
    cookTime: "5 min",
    servings: 6,
  },
  {
    id: "chocolate-truffle-fondue",
    name: "Chocolate Truffle Fondue",
    description:
      "A luxurious melted chocolate fondue using Italian truffles, served with fresh fruit, biscotti, and roasted chestnuts.",
    ingredients: [
      "Dark chocolate truffles",
      "Heavy cream",
      "Almond biscotti",
      "Roasted chestnuts",
      "Fresh strawberries and bananas",
    ],
    products: [
      "chocolate-truffle-dark",
      "almond-biscotti",
      "roasted-chestnuts",
    ],
    prepTime: "5 min",
    cookTime: "10 min",
    servings: 4,
  },
  {
    id: "seafood-pasta",
    name: "Seafood Pasta with Tuna",
    description:
      "Italian tuna in olive oil tossed with penne, capers, Calabrian chili, and a splash of white wine. A quick Mediterranean feast.",
    ingredients: [
      "Penne",
      "Solid light tuna in olive oil",
      "Capers in brine",
      "Calabrian chili peppers",
      "White cooking wine",
      "Fresh parsley",
    ],
    products: [
      "penne",
      "solid-light-tuna-olive-oil-small-jar",
      "capers-in-brine",
      "chopped-calabrian-chili-peppers",
    ],
    prepTime: "10 min",
    cookTime: "15 min",
    servings: 4,
  },
  {
    id: "italian-antipasto-board",
    name: "Italian Antipasto Board",
    description:
      "A stunning spread of olives, crackers, sun-dried tomatoes, and Calabrian chili jam arranged on a rustic board.",
    ingredients: [
      "Italian olives trio platter",
      "Truffle parchment crackers",
      "Sea salt grissini",
      "Sun-dried tomatoes",
      "Calabrian chili hot pepper jam",
      "Fresh cheeses and cured meats",
    ],
    products: [
      "italian-olives-trio-platter",
      "truffle-parchment-crackers",
      "sea-salt-grissini",
      "sun-dried-tomatoes",
      "calabrian-chili-hot-pepper-jam",
    ],
    prepTime: "20 min",
    cookTime: "0 min",
    servings: 8,
  },
  {
    id: "gnocchi-al-pesto",
    name: "Gnocchi al Pesto",
    description:
      "Pillowy potato gnocchi tossed in fragrant basil pesto with toasted pine nuts and a drizzle of fine olive oil.",
    ingredients: [
      "Potato gnocchi",
      "Basil pesto",
      "Extra virgin olive oil",
      "Pine nuts",
      "Parmigiano-Reggiano",
    ],
    products: ["potato-gnocchi", "basil-pesto", "evoo-750ml"],
    prepTime: "5 min",
    cookTime: "5 min",
    servings: 4,
  },
  {
    id: "balsamic-caprese-salad",
    name: "Balsamic Caprese Salad",
    description:
      "Fresh mozzarella and ripe tomatoes drizzled with balsamic glaze and lemon-infused olive oil. Simple Italian elegance.",
    ingredients: [
      "Fresh mozzarella",
      "Ripe tomatoes",
      "Balsamic vinegar glaze of Modena",
      "Extra virgin olive oil with lemon",
      "Fresh basil",
      "Sea salt and black pepper",
    ],
    products: ["balsamic-glaze-modena", "evoo-lemon-250ml"],
    prepTime: "10 min",
    cookTime: "0 min",
    servings: 4,
  },
  {
    id: "truffle-fettuccine",
    name: "Truffle Fettuccine",
    description:
      "Silky fettuccine ribbons finished with black truffle olive oil, butter, and a shower of Parmigiano. Pure indulgence.",
    ingredients: [
      "Fettuccine",
      "Extra virgin olive oil with black truffle",
      "Butter",
      "Parmigiano-Reggiano",
      "Fresh cracked pepper",
    ],
    products: ["fettuccine", "evoo-black-truffle-250ml"],
    prepTime: "5 min",
    cookTime: "12 min",
    servings: 4,
  },
  {
    id: "focaccia-panini",
    name: "Italian Focaccia Panini",
    description:
      "Warm focaccia bread filled with sun-dried tomatoes, olives, fresh mozzarella, and a drizzle of balsamic glaze.",
    ingredients: [
      "Focaccia bread",
      "Sun-dried tomatoes",
      "Pitted green Castelvetrano olives",
      "Fresh mozzarella",
      "Balsamic vinegar glaze of Modena",
      "Arugula",
    ],
    products: [
      "focaccia-bread",
      "sun-dried-tomatoes",
      "pitted-green-castelvetrano",
      "balsamic-glaze-modena",
    ],
    prepTime: "10 min",
    cookTime: "8 min",
    servings: 2,
  },
  {
    id: "citrus-sparkler",
    name: "Italian Citrus Sparkler",
    description:
      "A refreshing non-alcoholic cocktail blending sparkling blood orange soda with fresh lemon juice and mint over ice.",
    ingredients: [
      "Sparkling blood orange soda",
      "Lemon juice",
      "Fresh mint leaves",
      "Ice",
      "Sugar syrup (optional)",
    ],
    products: ["sparkling-blood-orange", "lemon-juice-6oz"],
    prepTime: "5 min",
    cookTime: "0 min",
    servings: 2,
  },
  {
    id: "rigatoni-arrabbiata",
    name: "Rigatoni all'Arrabbiata",
    description:
      "Bold rigatoni in a fiery tomato sauce with Calabrian chili peppers and garlic olive oil. A spicy Roman classic.",
    ingredients: [
      "Rigatoni",
      "Zesty marinara sauce",
      "Chopped Calabrian chili peppers",
      "Extra virgin olive oil with garlic",
      "Fresh parsley",
      "Pecorino Romano",
    ],
    products: [
      "rigatoni",
      "zesty-marinara-sauce",
      "chopped-calabrian-chili-peppers",
      "evoo-garlic-250ml",
    ],
    prepTime: "5 min",
    cookTime: "15 min",
    servings: 4,
  },
];

/** Return all recipes that reference a given product ID. */
export function getRecipesForProduct(productId: string): Recipe[] {
  return recipes.filter((r) => r.products.includes(productId));
}

/** Return all product IDs that appear alongside the given product in any recipe. */
export function getPairedProductIds(productId: string): string[] {
  const ids = new Set<string>();
  for (const r of recipes) {
    if (r.products.includes(productId)) {
      for (const pid of r.products) {
        if (pid !== productId) ids.add(pid);
      }
    }
  }
  return Array.from(ids);
}
