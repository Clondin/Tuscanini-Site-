export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  products: string[];
  prepTime: string;
  cookTime: string;
  servings?: number;
  image?: string;
  instructions?: string[];
}

export let recipes: Recipe[] = [
  {
    id: "classic-margherita-pizza",
    name: "Classic Margherita Pizza",
    description:
      "Pizza with tomato sauce, fresh mozzarella, and basil.",
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
      "Spaghetti with tomato sauce, garlic, olive oil, and fresh basil.",
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
      "Melted chocolate truffles with cream, served with fruit and roasted chestnuts.",
    ingredients: [
      "Dark chocolate truffles",
      "Heavy cream",
      "Roasted chestnuts",
      "Fresh strawberries and bananas",
    ],
    products: [
      "chocolate-truffle-dark",
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
      "Penne with tuna in olive oil, capers, Calabrian chili, and white cooking wine.",
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
      "An antipasto board with olives, sun-dried tomatoes, and Calabrian chili jam.",
    ingredients: [
      "Italian olives trio platter",
      "Sun-dried tomatoes",
      "Calabrian chili hot pepper jam",
      "Fresh cheeses and cured meats",
    ],
    products: [
      "italian-olives-trio-platter",
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
      "Potato gnocchi with basil pesto, pine nuts, and olive oil.",
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
      "Fresh mozzarella and tomatoes with balsamic glaze and lemon olive oil.",
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
      "Fettuccine with black truffle olive oil, butter, and Parmigiano-Reggiano.",
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
      "Rigatoni with spicy tomato sauce, Calabrian chili peppers, and garlic olive oil.",
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

export function setRecipes(nextRecipes: Recipe[]): void {
  if (nextRecipes.length > 0) recipes = nextRecipes;
}

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
