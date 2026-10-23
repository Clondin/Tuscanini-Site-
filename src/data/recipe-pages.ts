/**
 * Recipe pages at /recipes and /recipes/:slug: Tuscanini recipes from Kosher.com, hosted here with
 * credit and a followed link back to the original on kosher.com (`sourceUrl`). Text, photo and author
 * come from the kosher.com Developer API (cached 2026-10-22); `products` are the catalog ids of the
 * Tuscanini products each recipe names (main product first).
 * Kept separate from `recipes.ts` (which the CMS can replace at runtime) so these
 * routes, their pre-rendered HTML and the sitemap always match.
 */
export interface RecipePage {
  slug: string;
  title: string;
  intro: string;
  kosher: "Dairy" | "Pareve" | "Meat";
  course: string;
  /** Total time in minutes, as kosher.com lists it. */
  totalMinutes: number;
  /** As kosher.com lists it, e.g. "4-6". */
  servings: string;
  difficulty?: string;
  /** The recipe's author on kosher.com. */
  author: string;
  /** The original recipe on kosher.com. */
  sourceUrl: string;
  datePublished: string;
  /** kosher.com photo (large) and a smaller version for cards. */
  image: string;
  imageThumb: string;
  ingredients: string[];
  steps: string[];
  products: string[];
  keywords: string[];
}

export const KOSHER_COM_URL = "https://www.kosher.com/";

export const recipePages: RecipePage[] = [
  {
    slug: "celeriac-mashed-potatoes-truffle-salt",
    title: "Celeriac Mashed Potatoes with Tuscanini Truffle Salt",
    intro: "A steaming mound of creamy mashed potatoes is the ultimate in comfort food. I added celery root to the mixture for the mineral-y taste it contributes and topped it off with an extra dose of Tuscanini’s truffle salt. That extra boost of flavor elevates the dish in a simple yet impactful way. I added a modest spoonful but feel free to sprinkle as generously as you wish.",
    kosher: "Pareve",
    course: "Side dish",
    totalMinutes: 40,
    servings: "4-6",
    difficulty: "Easy",
    author: "Sina Mizrahi",
    sourceUrl: "https://www.kosher.com/recipe/celeriac-mashed-potatoes-with-tuscanini-truffle-salt/",
    datePublished: "2024-01-31",
    image: "https://images.kosher.com/uploads/Mizrahi-Sina-Celeriac-Mashed-Potatoes-with-Truffle-Salt-1024x681.webp",
    imageThumb: "https://images.kosher.com/uploads/Mizrahi-Sina-Celeriac-Mashed-Potatoes-with-Truffle-Salt-300x200.webp",
    ingredients: [
      "2 and 1/2 pounds Yukon Gold potatoes (about 8), peeled and cubed",
      "1 and 1/2 pounds celery root (1 large), peeled and cubed",
      "1 stick (113 grams) vegan butter",
      "2 cloves garlic, minced or 2 cubes Gefen Frozen Garlic",
      "1/2 teaspoon sea salt",
      "1/2 teaspoon Tuscanini Truffle Salt, plus more for sprinkling",
      "Tuscanini Extra-Virgin Olive Oil",
    ],
    steps: [
      "Place potatoes and celery root in a pot and cover with cool water. Bring to a boil over medium high heat. Cook, covered, for 20 to 25 minutes. Reserve one cup cooking water; drain the potatoes.",
      "Return the pot as-is over the fire and reduce heat to low. Add vegan butter and stir until melted. Add the garlic, salt, and truffle salt and mix well.",
      "Return the chopped potato mixture and add half a cup reserved water. Mash with a potato masher, add another quarter cup cooking water, and mash until smooth.",
      "To serve, spoon onto plate and sprinkle more truffle salt. Serve hot.",
    ],
    products: ["truffle-salt", "evoo-750ml"],
    keywords: ["truffle mashed potatoes", "celeriac mash", "truffle salt", "pareve side"],
  },
  {
    slug: "chicken-tuscanini-cacciatore",
    title: "Tuscanini Chicken Cacciatore aka “Chicken Tuscanini”",
    intro: "I love a good chicken cacciatore, “hunter’s chicken” in Italian. It’s a throw-everything-you-have-into-a-pan and let cook for a long time until all the flavors blend together into one bowl of deliciousness. One Friday, I was making my own version out of whatever I had in my house and the dish morphed into a list of TUSCANINI’S GREATEST HITS of ingredients. So the dish got an upgrade in flavor and a new name befitting its superb quality of ingredients! It has quickly become a staple in my house and is the perfect holiday chicken recipe!",
    kosher: "Meat",
    course: "Main course",
    totalMinutes: 105,
    servings: "6",
    difficulty: "Easy",
    author: "Danielle Renov",
    sourceUrl: "https://www.kosher.com/recipe/chicken-tuscanini-15513/",
    datePublished: "2023-02-28",
    image: "https://images.kosher.com/details.slide/r/e/Renov_Danielle_Chicken_Tuscanini_crop.jpg",
    imageThumb: "https://images.kosher.com/details.slide/r/e/Renov_Danielle_Chicken_Tuscanini_crop.jpg",
    ingredients: [
      "18 thin chicken cutlets, sliced in half cross wise",
      "1 cup flour",
      "3 teaspoons kosher salt",
      "1 teaspoon coarse black pepper",
      "1 teaspoon granulated onion",
      "4 teaspoons olive oil",
      "1 large yellow onion, diced",
      "2 zucchini, halved lengthwise, thinly sliced",
      "4 cloves garlic, smashed",
      "1/2 a Tuscanini Calabrian Chile",
      "2 tablespoons capers",
      "1 cup Tuscanini Castelvetrano Olives, pitted and halved",
      "2 cups kale, stems removed and packed",
      "1/2 cup Tuscanini Red Cooking Wine",
      "1 (17.6-ounce) box Tuscanini Tomato Sauce",
      "3/4 cup chicken stock (or water)",
    ],
    steps: [
      "In a bowl combine flour, two teaspoons salt, pepper, and granulated onion. Add chicken pieces. Mix to coat.",
      "Heat large pan (with a lid) over medium high heat. Add oil. Brown chicken in small batches so as not to overcrowd for two minutes on each side. Remove and set aside.",
      "Add onions. Stir and cook for six minutes. Add zucchini, stir and then cook for 15 minutes only stirring every seven minutes to allow zucchini to slightly caramelize. Add garlic, chiles, capers, olives and kale. Stir to combine.",
      "Then pour wine, scraping up any bits from the bottom of the pan. Add remaining ingredients and bring to a boil.",
      "Return chicken to pan, making sure each piece is nestled in the sauce. Lower heat to a gentle simmer, cover tightly and cook for one hour. The chicken will be soft and tender and the sauce rich and flavorful! Serve over pasta or rice and enjoy!",
    ],
    products: ["tomato-sauce-box", "red-cooking-wine", "calabrian-chili-peppers", "sweet-sicilian-castelvetrano"],
    keywords: ["chicken cacciatore", "chicken tuscanini", "holiday chicken", "meat main"],
  },
  {
    slug: "olive-oil-crackers",
    title: "Tuscanini Olive Oil Crackers",
    intro: "I’ve been using Tuscanini’s Extra Virgin Olive Oil on everything lately. From salads to cooking to baking, I love the rich flavor it has. Also, the bottle just looks so beautiful on my counter that I grab it at every opportunity (drizzle some over your toast next time). By the time I was on my second bottle, I knew I wanted to make crispy crackers with it.",
    kosher: "Pareve",
    course: "Snack",
    totalMinutes: 50,
    servings: "4",
    difficulty: "Easy",
    author: "Sina Mizrahi",
    sourceUrl: "https://www.kosher.com/recipe/tuscanini-olive-oil-crackers-15081/",
    datePublished: "2023-02-28",
    image: "https://images.kosher.com/details.slide/m/i/Mizrahi_Sina_Tuscanini_Olive_Oil_Crackers_crop.jpg",
    imageThumb: "https://images.kosher.com/details.slide/m/i/Mizrahi_Sina_Tuscanini_Olive_Oil_Crackers_crop.jpg",
    ingredients: [
      "2 cups (250 grams) all-purpose flour",
      "1 teaspoon (5 grams) baking powder",
      "1/2 teaspoon cumin (optional)",
      "1/2 teaspoon salt",
      "1/4 teaspoon black pepper",
      "1/2 cup water",
      "1/4 cup Tuscanini Cold Pressed Extra Virgin Olive Oil, plus more for brushing",
      "sesame seeds, for sprinkling",
      "nigella seeds for sprinkling (optional)",
    ],
    steps: [
      "In a bowl, combine flour, baking powder, cumin, salt, and pepper. Add water and oil and knead until dough comes together. If it’s a bit dry, add one teaspoon of water at a time until the dough feels soft and elastic and doesn’t stick to your fingers. Brush with olive oil, cover, and rest in the fridge for at least 30 minutes. This allows the gluten to relax and makes it easy to roll out.",
      "Heat oven to 425 degrees Fahrenheit. Divide the dough into two. Roll out as thinly as possible over parchment paper. With a sharp knife, cut into squares. Transfer parchment paper to baking sheet. Bake for 10 to 12 minutes, depending on thickness. Keep an eye out, you want them golden brown, not burnt. Repeat with remaining dough.",
      "Cool. Transfer to an airtight container for up to five days.",
    ],
    products: ["evoo-750ml"],
    keywords: ["olive oil crackers", "homemade crackers", "pareve snack"],
  },
  {
    slug: "cream-sauce-pasta",
    title: "Tuscanini Cream Sauce Pasta",
    intro: "If it was up to my kids, we would have pasta seven days a week! Noodles! Any kind, as long as it’s noodles! The “slurpier the better!!” This creamy sauce does not disappoint! Shavuos is coming up. This is the perfect dish for your milchig meal. The sauce can be made in advance and frozen. Feel free to use your favorite variety of pasta. For more great ideas, watch Just Make It !",
    kosher: "Dairy",
    course: "Main course",
    totalMinutes: 30,
    servings: "6",
    difficulty: "Easy",
    author: "Faigy Murray",
    sourceUrl: "https://www.kosher.com/recipe/tuscanini-cream-sauce-pasta-14711/",
    datePublished: "2023-02-28",
    image: "https://images.kosher.com/details.slide/t/u/Tuscanini_Cream_Sauce_Pasta.jpg",
    imageThumb: "https://images.kosher.com/details.slide/t/u/Tuscanini_Cream_Sauce_Pasta.jpg",
    ingredients: [
      "1 box rigatoni, cooked according to package directions",
      "3 cloves garlic, crushed or 3 cubes Gefen Frozen Garlic",
      "2 teaspoons oil",
      "1 bottle (24.7 ounces) Tuscanini Crushed Tomatoes",
      "1 (8-ounce) bottle heavy cream",
      "1 teaspoon crushed red pepper (optional for extra heat)",
      "salt, to taste",
      "pepper, to taste",
    ],
    steps: [
      "In a pot, heat the oil add the garlic. Saute until nice and fragrant, about three minutes.",
      "Add the crushed tomatoes, cream and spices.",
      "Bring to a boil. Lower to a simmer. Add the pasta and toss together.",
    ],
    products: ["crushed-tomatoes-24oz"],
    keywords: ["cream sauce pasta", "pink sauce", "rigatoni", "dairy dinner"],
  },
  {
    slug: "olive-oil-baked-feta",
    title: "Tuscanini Olive Oil Baked Feta",
    intro: "While cheese is not really a seasonal food, there are times when I associate feta cheese with a warmer climate. In the winter months, I’ve found that this baked version is so comforting. The olive oil is clean and makes the whole dish super creamy, warm and wonderful! The salty, briny feta works super well with the caramelized garlic, and sweet slow roasted tomatoes and crusty bread. This dish is a perfect appetizer or party bite, and works really well cut into chunks and served over other dishes as well.",
    kosher: "Dairy",
    course: "Main course",
    totalMinutes: 40,
    servings: "6",
    difficulty: "Easy",
    author: "Shushy Turin",
    sourceUrl: "https://www.kosher.com/recipe/tuscanini-olive-oil-baked-feta-10405/",
    datePublished: "2023-02-28",
    image: "https://images.kosher.com/details.slide/t/u/Turin%2C_Shushy._Baked_Feta_crop.jpg",
    imageThumb: "https://images.kosher.com/details.slide/t/u/Turin%2C_Shushy._Baked_Feta_crop.jpg",
    ingredients: [
      "1 block of feta",
      "1 container of cherry tomatoes on the vine",
      "1 head of garlic, halved",
      "2–3 sprigs fresh oregano and thyme, leaves picked",
      "Tuscanini Olive Oil",
      "zest of 1 lemon",
      "red pepper flakes, to taste",
      "kosher salt, to taste",
      "freshly ground Gefen Black Pepper, to taste",
      "sliced bread",
    ],
    steps: [
      "In an ovenproof pan or container place the feta in the center.",
      "Arrange the tomatoes and garlic around the feta. Sprinkle a bit of salt over the tomatoes and garlic. Sprinkle the thyme, oregano, lemon zest and pepper flakes over the feta.",
      "Drizzle with Tuscanini Olive Oil so that everything in the dish has a light coating of olive oil.",
      "Bake at 400 degrees Fahrenheit for 20–25 minutes or until lightly browned.",
      "In the meantime, drizzle the bread with olive oil.",
      "Place the feta and the bread under the broiler on low until it becomes deep golden in color. Serve the baked feta with the toast.",
    ],
    products: ["evoo-750ml"],
    keywords: ["baked feta", "olive oil", "cherry tomatoes", "dairy"],
  },
];

/** Slugs of the recipe pages this site used to host; vercel.json redirects them to /recipes. */
export const retiredRecipeSlugs = ["pesto-gnocchi-cherry-tomatoes", "black-truffle-fettuccine", "balsamic-roasted-vegetables", "spaghetti-garlic-oil-calabrian-chili", "penne-marinara-olives-capers", "sun-dried-tomato-pesto-pasta-salad", "tuna-white-bean-salad-lemon", "eggs-in-spicy-tomato-sauce", "crispy-cauliflower-gnocchi-garlic-lemon", "easy-vegetable-lasagna", "strawberries-raspberry-balsamic-glaze", "homemade-margherita-pizza"];

export function getRecipePage(slug: string): RecipePage | undefined {
  return recipePages.find((recipe) => recipe.slug === slug);
}

export function getRecipePagesForProduct(productId: string): RecipePage[] {
  return recipePages.filter((recipe) => recipe.products.includes(productId));
}

export function recipeTotalMinutes(recipe: RecipePage): number {
  return recipe.totalMinutes;
}

/** Minutes as an ISO 8601 duration (PT1H5M) for Recipe structured data. */
export function isoDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `PT${hours ? `${hours}H` : ""}${rest || !hours ? `${rest}M` : ""}`;
}

/** First sentence or two of the author's intro, for meta descriptions and cards. */
export function recipeSummary(recipe: RecipePage, max = 155): string {
  if (recipe.intro.length <= max) return recipe.intro;
  const cut = recipe.intro.slice(0, max);
  const stop = cut.lastIndexOf(". ");
  return stop > 60 ? cut.slice(0, stop + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function recipeDescription(recipe: RecipePage): string {
  return `${recipeSummary(recipe, 120)} A ${recipe.kosher.toLowerCase()} recipe by ${recipe.author}, from Kosher.com.`;
}

/** schema.org/Recipe for one recipe page; `imageUrls` are extra absolute image URLs (pack shots). */
export function recipeStructuredData(recipe: RecipePage, siteUrl: string, imageUrls: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipeSummary(recipe, 300),
    image: [recipe.image, ...imageUrls],
    author: { "@type": "Person", name: recipe.author },
    publisher: { "@type": "Organization", name: "Kosher.com", url: KOSHER_COM_URL },
    datePublished: recipe.datePublished,
    url: `${siteUrl}/recipes/${recipe.slug}`,
    isBasedOn: recipe.sourceUrl,
    totalTime: isoDuration(recipe.totalMinutes),
    recipeYield: `${recipe.servings} servings`,
    recipeCategory: recipe.course,
    recipeCuisine: "Italian",
    keywords: [...recipe.keywords, "kosher", recipe.kosher.toLowerCase(), "Tuscanini"].join(", "),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
  };
}

export function recipesIndexDescription(): string {
  return "Kosher recipes made with Tuscanini olive oil, truffle salt, tomatoes and more, from the cooks at Kosher.com.";
}
