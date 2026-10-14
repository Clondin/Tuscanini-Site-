/**
 * Recipe pages at /recipes and /recipes/:slug. Original recipes written for this site,
 * each built around Tuscanini products from the catalog (product ids in `products`,
 * main product first; its pack shot is the recipe's picture).
 * Kept separate from `recipes.ts` (which the CMS can replace at runtime) so these
 * routes, their pre-rendered HTML and the sitemap always match.
 */
export interface RecipePage {
  slug: string;
  title: string;
  intro: string;
  /** "Dairy" when the recipe uses dairy ingredients; "Pareve" when it uses none. */
  kosher: "Dairy" | "Pareve";
  course: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  products: string[];
  keywords: string[];
}

export const recipePages: RecipePage[] = [
  {
    slug: "pesto-gnocchi-cherry-tomatoes",
    title: "Pesto Gnocchi with Cherry Tomatoes",
    intro: "Soft potato gnocchi tossed in basil pesto with warm cherry tomatoes. Dinner in about fifteen minutes.",
    kosher: "Dairy",
    course: "Main course",
    prepMinutes: 5,
    cookMinutes: 10,
    servings: 3,
    ingredients: [
      "1 package (16 oz) Tuscanini Potato Gnocchi",
      "1 jar (6.7 oz) Tuscanini Basil Pesto",
      "1 can (14.1 oz) Tuscanini Whole Cherry Tomatoes, drained",
      "1 tbsp Tuscanini Extra Virgin Olive Oil",
      "Grated Parmesan and fresh basil, to serve",
      "Salt and black pepper",
    ],
    steps: [
      "Bring a large pot of salted water to a boil.",
      "Warm the olive oil in a wide pan over medium heat, add the drained cherry tomatoes and cook for 4–5 minutes until they start to burst.",
      "Cook the gnocchi in the boiling water until they float, about 2–3 minutes. Scoop them out and save a splash of the cooking water.",
      "Add the gnocchi to the pan, turn off the heat and stir in the pesto with 2–3 tablespoons of the cooking water until glossy.",
      "Season with salt and pepper and serve topped with Parmesan and basil.",
    ],
    products: ["potato-gnocchi", "basil-pesto", "whole-cherry-tomatoes", "evoo-750ml"],
    keywords: ["pesto gnocchi", "gnocchi recipe", "basil pesto", "quick dinner"],
  },
  {
    slug: "black-truffle-fettuccine",
    title: "Creamy Black Truffle Fettuccine",
    intro: "Fettuccine in a light cream sauce with black truffle sauce stirred through and a few drops of truffle oil to finish.",
    kosher: "Dairy",
    course: "Main course",
    prepMinutes: 5,
    cookMinutes: 15,
    servings: 4,
    ingredients: [
      "1 package (16 oz) Tuscanini Bronze Cut Fettuccine",
      "3 tbsp Tuscanini Black Truffle Sauce",
      "1 cup heavy cream",
      "2 tbsp butter",
      "1/2 cup grated Parmesan",
      "Tuscanini Extra Virgin Olive Oil with Black Truffle, to finish",
      "Salt and black pepper",
    ],
    steps: [
      "Cook the fettuccine in well-salted boiling water until al dente. Save 1/2 cup of the cooking water, then drain.",
      "Meanwhile, melt the butter in a large pan over low heat, add the cream and simmer gently for 3 minutes.",
      "Stir the black truffle sauce into the cream.",
      "Add the fettuccine and Parmesan and toss, adding cooking water a little at a time until the sauce coats the pasta.",
      "Season with salt and pepper, divide into bowls and finish each with a few drops of truffle oil.",
    ],
    products: ["fettuccine", "black-truffle-sauce", "evoo-black-truffle-250ml"],
    keywords: ["truffle pasta", "truffle fettuccine", "black truffle sauce", "creamy pasta"],
  },
  {
    slug: "balsamic-roasted-vegetables",
    title: "Balsamic Roasted Vegetables",
    intro: "A sheet pan of roasted peppers, zucchini and red onion finished with balsamic glaze. Good as a side or over pasta.",
    kosher: "Pareve",
    course: "Side dish",
    prepMinutes: 15,
    cookMinutes: 30,
    servings: 4,
    ingredients: [
      "2 bell peppers, cut into strips",
      "2 zucchini, sliced into half-moons",
      "1 red onion, cut into wedges",
      "1 cup cherry tomatoes",
      "3 tbsp Tuscanini Extra Virgin Olive Oil",
      "1 tsp dried oregano",
      "2–3 tbsp Tuscanini Balsamic Vinegar Glaze of Modena",
      "Salt and black pepper",
    ],
    steps: [
      "Heat the oven to 425°F (220°C).",
      "Toss the vegetables with the olive oil, oregano, salt and pepper and spread them out on a large sheet pan.",
      "Roast for 25–30 minutes, turning once, until soft and browned at the edges.",
      "Move to a platter and drizzle with the balsamic glaze just before serving.",
    ],
    products: ["balsamic-glaze-modena", "evoo-750ml"],
    keywords: ["balsamic glaze", "roasted vegetables", "sheet pan", "pareve side dish"],
  },
  {
    slug: "spaghetti-garlic-oil-calabrian-chili",
    title: "Spaghetti with Garlic Oil and Calabrian Chili",
    intro: "A pantry pasta: spaghetti tossed with garlic olive oil, chopped Calabrian chili and parsley.",
    kosher: "Pareve",
    course: "Main course",
    prepMinutes: 5,
    cookMinutes: 12,
    servings: 4,
    ingredients: [
      "1 package (16 oz) Tuscanini Bronze Cut Spaghetti",
      "1/3 cup Tuscanini Extra Virgin Olive Oil with Garlic",
      "1–2 tbsp Tuscanini Chopped Calabrian Chili Peppers in Oil",
      "2 cloves garlic, thinly sliced",
      "Large handful fresh parsley, chopped",
      "Salt",
    ],
    steps: [
      "Cook the spaghetti in well-salted boiling water until al dente. Save 1 cup of the cooking water.",
      "While it cooks, warm the garlic olive oil and sliced garlic in a large pan over low heat until the garlic is pale gold. Stir in the chopped chili.",
      "Add the drained spaghetti with 1/2 cup of the cooking water and toss over medium heat for 1–2 minutes until the sauce clings.",
      "Stir in the parsley, add salt to taste and serve.",
    ],
    products: ["spaghetti", "evoo-garlic-250ml", "chopped-calabrian-chili-peppers"],
    keywords: ["aglio e olio", "garlic spaghetti", "calabrian chili", "pareve pasta"],
  },
  {
    slug: "penne-marinara-olives-capers",
    title: "Penne with Marinara, Olives and Capers",
    intro: "Marinara sauce made bolder with Castelvetrano olives and capers. Ready in the time it takes to boil the pasta.",
    kosher: "Pareve",
    course: "Main course",
    prepMinutes: 5,
    cookMinutes: 15,
    servings: 4,
    ingredients: [
      "1 package (16 oz) Tuscanini Bronze Cut Penne",
      "1 jar (24 oz) Tuscanini Classic Marinara Sauce",
      "1/2 cup Tuscanini Pitted Green Castelvetrano Olives, halved",
      "2 tbsp Tuscanini Capers in Brine, drained",
      "1 tbsp Tuscanini Extra Virgin Olive Oil",
      "Pinch of red pepper flakes (optional)",
      "Fresh basil, to serve",
    ],
    steps: [
      "Cook the penne in well-salted boiling water until al dente.",
      "Warm the olive oil in a saucepan, add the olives, capers and pepper flakes and cook for 1 minute.",
      "Pour in the marinara sauce and simmer for 5 minutes.",
      "Drain the penne, toss it with the sauce and serve with torn basil.",
    ],
    products: ["penne", "classic-marinara-sauce", "pitted-green-castelvetrano", "capers-in-brine"],
    keywords: ["penne marinara", "olives and capers", "weeknight pasta", "pareve pasta"],
  },
  {
    slug: "sun-dried-tomato-pesto-pasta-salad",
    title: "Sun-Dried Tomato Pesto Pasta Salad",
    intro: "Fusilli, sun-dried tomato pesto, mozzarella and greens. Make it ahead for lunches or a picnic.",
    kosher: "Dairy",
    course: "Salad",
    prepMinutes: 15,
    cookMinutes: 12,
    servings: 6,
    ingredients: [
      "1 package (16 oz) Tuscanini Bronze Cut Fusilli",
      "1 jar (6.7 oz) Tuscanini Sun-Dried Tomato Pesto",
      "1/2 cup Tuscanini Sun Dried Tomatoes, chopped",
      "8 oz fresh mozzarella pearls",
      "2 cups baby arugula",
      "2 tbsp Tuscanini Red Wine Vinegar",
      "2 tbsp Tuscanini Extra Virgin Olive Oil",
      "Salt and black pepper",
    ],
    steps: [
      "Cook the fusilli until al dente, drain and rinse under cold water. Drain well.",
      "In a large bowl, whisk the pesto with the red wine vinegar and olive oil.",
      "Add the pasta and chopped sun-dried tomatoes and toss to coat.",
      "Fold in the mozzarella and arugula, season with salt and pepper and serve, or chill for up to a day.",
    ],
    products: ["fusilli", "sun-dried-tomato-pesto", "sun-dried-tomatoes", "red-wine-vinegar"],
    keywords: ["pasta salad", "sun-dried tomato pesto", "make ahead", "fusilli"],
  },
  {
    slug: "tuna-white-bean-salad-lemon",
    title: "Tuna and White Bean Salad with Lemon Oil",
    intro: "Tuna fillets in olive oil with white beans, red onion and parsley, dressed with lemon olive oil. No cooking needed.",
    kosher: "Pareve",
    course: "Salad",
    prepMinutes: 10,
    cookMinutes: 0,
    servings: 2,
    ingredients: [
      "1 jar (6 oz) Tuscanini Tuna Fillet in Olive Oil, drained",
      "1 can (15 oz) cannellini beans, rinsed and drained",
      "1/2 small red onion, thinly sliced",
      "1 cup cherry tomatoes, halved",
      "Handful fresh parsley, chopped",
      "2 tbsp Tuscanini Extra Virgin Olive Oil with Lemon",
      "1 tbsp Tuscanini White Wine Vinegar",
      "Salt and black pepper",
    ],
    steps: [
      "Soak the sliced onion in cold water for 5 minutes to soften its bite, then drain.",
      "Combine the beans, onion, tomatoes and parsley in a bowl.",
      "Whisk the lemon olive oil with the vinegar, salt and pepper and toss with the beans.",
      "Break the tuna into large flakes over the top and serve.",
    ],
    products: ["tuna-fillet-olive-oil-tall-jar", "evoo-lemon-250ml", "white-wine-vinegar"],
    keywords: ["tuna salad", "white bean salad", "no cook", "pareve lunch"],
  },
  {
    slug: "eggs-in-spicy-tomato-sauce",
    title: "Eggs in Spicy Tomato Sauce",
    intro: "Eggs gently cooked in crushed tomatoes with Calabrian chili. Serve straight from the pan with crusty bread.",
    kosher: "Pareve",
    course: "Breakfast",
    prepMinutes: 5,
    cookMinutes: 20,
    servings: 3,
    ingredients: [
      "1 can (24.7 oz) Tuscanini Crushed Tomatoes",
      "1–2 Tuscanini Calabrian Chili Peppers in Oil, chopped",
      "2 tbsp Tuscanini Extra Virgin Olive Oil",
      "1 onion, finely chopped",
      "2 cloves garlic, sliced",
      "6 eggs",
      "Salt, fresh basil or parsley, and crusty bread to serve",
    ],
    steps: [
      "Warm the olive oil in a large skillet over medium heat and cook the onion for 5 minutes until soft. Add the garlic and chili and cook 1 minute more.",
      "Pour in the crushed tomatoes, season with salt and simmer for 8–10 minutes until slightly thickened.",
      "Make six small wells in the sauce and crack an egg into each.",
      "Cover and cook on low for 5–7 minutes, until the whites are set and the yolks are still soft.",
      "Scatter with herbs and serve with bread.",
    ],
    products: ["crushed-tomatoes-24oz", "calabrian-chili-peppers", "evoo-750ml"],
    keywords: ["eggs in tomato sauce", "shakshuka style", "brunch", "pareve breakfast"],
  },
  {
    slug: "crispy-cauliflower-gnocchi-garlic-lemon",
    title: "Crispy Cauliflower Gnocchi with Garlic and Lemon",
    intro: "Cauliflower gnocchi pan-fried until golden, then tossed with garlic and lemon olive oils and spinach.",
    kosher: "Pareve",
    course: "Main course",
    prepMinutes: 5,
    cookMinutes: 12,
    servings: 2,
    ingredients: [
      "1 package (16 oz) Tuscanini Cauliflower Gnocchi",
      "2 tbsp Tuscanini Extra Virgin Olive Oil with Garlic",
      "1 tbsp Tuscanini Extra Virgin Olive Oil with Lemon",
      "2 cups baby spinach",
      "Zest of 1/2 lemon",
      "Salt and black pepper",
    ],
    steps: [
      "Heat the garlic olive oil in a large nonstick skillet over medium-high heat.",
      "Add the gnocchi in a single layer and cook without stirring for 4 minutes until golden underneath. Turn and cook 3–4 minutes more.",
      "Add the spinach and stir until just wilted.",
      "Turn off the heat, drizzle with the lemon olive oil, add the lemon zest, season and serve.",
    ],
    products: ["cauliflower-gnocchi", "evoo-garlic-250ml", "evoo-lemon-250ml"],
    keywords: ["cauliflower gnocchi", "crispy gnocchi", "garlic lemon", "pareve dinner"],
  },
  {
    slug: "easy-vegetable-lasagna",
    title: "Easy Vegetable Lasagna",
    intro: "Oven-ready lasagna sheets layered with Napoletana sauce, ricotta, spinach and mozzarella. No boiling the noodles.",
    kosher: "Dairy",
    course: "Main course",
    prepMinutes: 20,
    cookMinutes: 50,
    servings: 8,
    ingredients: [
      "1 package (17.6 oz) Tuscanini Oven Ready Lasagna",
      "2 jars (24 oz each) Tuscanini Napoletana Pasta Sauce",
      "15 oz ricotta",
      "1 egg",
      "3 cups baby spinach, chopped",
      "3 cups shredded mozzarella",
      "1/2 cup grated Parmesan",
      "1 tbsp Tuscanini Extra Virgin Olive Oil",
    ],
    steps: [
      "Heat the oven to 375°F (190°C) and brush a 9x13-inch baking dish with the olive oil.",
      "Mix the ricotta, egg, spinach and half the Parmesan in a bowl.",
      "Spread 1 cup of sauce in the dish. Layer lasagna sheets, a third of the ricotta mixture, a cup of mozzarella and a cup of sauce. Repeat twice, then finish with sheets, the remaining sauce, mozzarella and Parmesan. Make sure the top sheets are covered with sauce.",
      "Cover with foil and bake for 35 minutes. Uncover and bake 15 minutes more until bubbling and golden.",
      "Rest for 10 minutes before slicing.",
    ],
    products: ["oven-ready-lasagna", "napoletana-pasta-sauce", "evoo-750ml"],
    keywords: ["vegetable lasagna", "oven ready lasagna", "dairy dinner", "make ahead"],
  },
  {
    slug: "strawberries-raspberry-balsamic-glaze",
    title: "Strawberries with Raspberry Balsamic Glaze",
    intro: "Fresh strawberries and mint with a drizzle of raspberry balsamic glaze. A simple dessert that takes five minutes.",
    kosher: "Pareve",
    course: "Dessert",
    prepMinutes: 10,
    cookMinutes: 0,
    servings: 4,
    ingredients: [
      "1 lb strawberries, hulled and halved",
      "1 tbsp sugar (optional)",
      "2 tbsp Tuscanini Raspberry Balsamic Vinegar Glaze of Modena",
      "Fresh mint leaves",
      "Freshly ground black pepper (optional)",
    ],
    steps: [
      "Toss the strawberries with the sugar, if using, and let them sit for 10 minutes.",
      "Spoon into bowls and drizzle with the raspberry balsamic glaze.",
      "Finish with torn mint and a light grind of black pepper, if you like.",
    ],
    products: ["raspberry-balsamic-glaze-modena"],
    keywords: ["strawberries balsamic", "raspberry balsamic glaze", "easy dessert", "pareve dessert"],
  },
  {
    slug: "homemade-margherita-pizza",
    title: "Homemade Margherita Pizza",
    intro: "A simple dough made with Tuscanini flour, topped with pizza sauce, mozzarella and basil.",
    kosher: "Dairy",
    course: "Main course",
    prepMinutes: 20,
    cookMinutes: 12,
    servings: 4,
    ingredients: [
      "3 1/2 cups (450 g) Tuscanini All Purpose Flour",
      "1 1/2 cups (350 ml) warm water",
      "2 1/4 tsp (1 packet) instant yeast",
      "2 tsp salt",
      "2 tbsp Tuscanini Extra Virgin Olive Oil, plus more for drizzling",
      "1 cup Tuscanini Traditional Pizza Sauce",
      "8 oz fresh mozzarella, torn",
      "Fresh basil leaves",
    ],
    steps: [
      "Mix the flour, yeast and salt in a large bowl. Add the warm water and olive oil and stir into a shaggy dough.",
      "Knead on a floured counter for 8 minutes until smooth. Cover and let rise for 1 to 1 1/2 hours until doubled.",
      "Heat the oven to its highest setting, 500°F (260°C) or more, with a baking sheet or pizza stone inside.",
      "Divide the dough in two and stretch each piece into a 12-inch round on parchment.",
      "Spread with pizza sauce, add the mozzarella and slide onto the hot sheet. Bake 10–12 minutes until the crust is browned.",
      "Top with basil and a drizzle of olive oil and serve.",
    ],
    products: ["all-purpose-flour-2-2lb", "traditional-pizza-sauce", "evoo-750ml"],
    keywords: ["margherita pizza", "homemade pizza dough", "pizza sauce", "dairy dinner"],
  },
];

export function getRecipePage(slug: string): RecipePage | undefined {
  return recipePages.find((recipe) => recipe.slug === slug);
}

export function getRecipePagesForProduct(productId: string): RecipePage[] {
  return recipePages.filter((recipe) => recipe.products.includes(productId));
}

export function recipeTotalMinutes(recipe: RecipePage): number {
  return recipe.prepMinutes + recipe.cookMinutes;
}

/** Minutes as an ISO 8601 duration (PT1H5M) for Recipe structured data. */
export function isoDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `PT${hours ? `${hours}H` : ""}${rest || !hours ? `${rest}M` : ""}`;
}

export function recipeDescription(recipe: RecipePage): string {
  return `${recipe.intro} ${recipe.kosher} recipe with Tuscanini products.`;
}

/** schema.org/Recipe for one recipe page; `imageUrls` are absolute pack-shot URLs. */
export function recipeStructuredData(recipe: RecipePage, siteUrl: string, imageUrls: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipeDescription(recipe),
    image: imageUrls.length ? imageUrls : undefined,
    author: { "@type": "Organization", name: "Tuscanini" },
    publisher: { "@type": "Organization", name: "Tuscanini", url: siteUrl },
    url: `${siteUrl}/recipes/${recipe.slug}`,
    prepTime: isoDuration(recipe.prepMinutes),
    cookTime: isoDuration(recipe.cookMinutes),
    totalTime: isoDuration(recipeTotalMinutes(recipe)),
    recipeYield: `${recipe.servings} servings`,
    recipeCategory: recipe.course,
    recipeCuisine: "Italian",
    keywords: [...recipe.keywords, "kosher", recipe.kosher.toLowerCase()].join(", "),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
  };
}

export function recipesIndexDescription(): string {
  return "Simple kosher recipes made with Tuscanini pasta, sauces, olive oils, pesto, balsamic glaze and more.";
}
