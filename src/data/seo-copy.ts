/**
 * Crawlable page copy and organization facts shared by the React pages and the
 * build-time route HTML (scripts/generate-route-html.ts), so the served HTML and
 * the rendered page say the same thing. Hardcoded in this repository (not CMS).
 *
 * Every statement here is either read from this site's own catalog or from a public
 * Kayco source: https://www.kayco.com/about/ , https://www.kayco.com/brands/tuscanini/
 * and Kayco's June 11, 2024 Summer Fancy Food Show release on specialtyfood.com.
 * Keep it that way: no invented people, quotes, dates, awards or origin claims.
 */

/** A run of text, or a run that links to an internal path. */
export type CopySegment = string | { text: string; to: string };
export type CopyParagraph = CopySegment[];

export function copyText(paragraph: CopyParagraph): string {
  return paragraph.map((segment) => (typeof segment === "string" ? segment : segment.text)).join("");
}

export const SITE_NAME = "Tuscanini";

/** Page titles, each 30 to 60 characters. */
export const PAGE_TITLES = {
  home: "Tuscanini | Kosher Italian Pasta, Olive Oil & Sauces",
  about: "Our Story | Tuscanini, the Italian Food Brand of Kayco",
  recipes: "Recipes | Kosher Italian Cooking with Tuscanini",
  products: "Explore Our Products | Tuscanini",
} as const;

export const PAGE_DESCRIPTIONS = {
  home: "Tuscanini is Kayco's Italian food brand: pasta and gnocchi, pasta sauces, olive oils, balsamic vinegar, sparkling drinks, chocolate, snacks and frozen pizza.",
  about: "Tuscanini is the Italian food brand of Kayco, a family-owned kosher food company. Our story, our range, and recipes.",
} as const;

/** "<Category> | Tuscanini Italian Foods", or "<Category> | Tuscanini" when that would pass 60 characters. */
export function categoryTitle(name: string): string {
  const long = `${name} | Tuscanini Italian Foods`;
  return long.length <= 60 ? long : `${name} | ${SITE_NAME}`;
}

/** Search description for a product page, built only from catalog fields and its write-up; at most 160 characters. */
export function productMetaDescription(product: {
  name: string;
  description?: string;
  size?: string;
  madeInItaly?: boolean;
  kosher?: boolean;
}, formattedSize = "", story = ""): string {
  const facts = [
    formattedSize ? formattedSize : "",
    product.madeInItaly ? "made in Italy" : "",
    product.kosher ? "certified kosher" : "",
  ].filter(Boolean);
  const lead = `Tuscanini ${product.name.replace(/^Tuscanini\s+/i, "")}${facts.length ? `, ${facts.join(", ")}` : ""}.`;
  // The first sentence of the product's "About this product" write-up says more than the short description.
  const firstSentence = story.trim().match(/^.*?[.!?](?=\s|$)/)?.[0] ?? "";
  const body = (firstSentence || product.description || "").trim();
  const full = body ? `${lead} ${body}` : lead;
  if (full.length <= 160) return full;
  const cut = full.slice(0, 157);
  return `${cut.slice(0, cut.lastIndexOf(" "))}...`;
}

export const KAYCO = {
  name: "Kayco",
  url: "https://www.kayco.com/",
} as const;

/** Official Tuscanini profiles. Each was checked to load (not 404) on Oct 30, 2026. */
export const SOCIAL_PROFILES = {
  instagram: "https://www.instagram.com/tuscaninifoods/",
  facebook: "https://www.facebook.com/TuscaniniFoods/",
  youtube: "https://www.youtube.com/@tuscaninifoods9840",
} as const;

export function organizationStructuredData(siteUrl: string): Record<string, unknown> {
  const base = siteUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: SITE_NAME,
    alternateName: "Tuscanini Foods",
    url: `${base}/`,
    logo: `${base}/favicon.svg`,
    description: PAGE_DESCRIPTIONS.home,
    sameAs: Object.values(SOCIAL_PROFILES),
    parentOrganization: {
      "@type": "Organization",
      name: KAYCO.name,
      url: KAYCO.url,
    },
  };
}

/** Homepage aisle tiles and spotlight products (also used by the route HTML). */
export const HOME_AISLE_SLUGS = ["pasta-gnocchi", "pasta-sauces", "olive-oil", "beverages", "pizza"] as const;
export const HOME_SPOTLIGHT_PRODUCT_IDS = [
  "evoo-750ml",
  "napoletana-pasta-sauce",
  "sparkling-lemonade",
  "chocolate-truffle-pistachio",
] as const;

export const HOME_INTRO = {
  heading: "Kosher Italian foods from Tuscanini",
  paragraph: [
    "Tuscanini is the Italian food brand of Kayco, the family-owned kosher food company. The range covers the everyday Italian pantry: dry pasta and potato gnocchi, tomato and cream sauces, pesto, extra virgin and extra light olive oils, balsamic vinegar of Modena and glazes, olives, capers and Calabrian chili peppers, sparkling drinks and juices, chocolate, crackers and potato chips, and frozen pizza. Sizes run from 9.3 oz sparkling drinks to 3-liter extra light olive oil. Almost every item in our catalog is listed as made in Italy, and each product page shows the package size and the details we have on file. Start with ",
    { text: "pasta and gnocchi", to: "/category/pasta-gnocchi" },
    ", ",
    { text: "pasta sauces", to: "/category/pasta-sauces" },
    ", ",
    { text: "olive oil", to: "/category/olive-oil" },
    ", ",
    { text: "beverages", to: "/category/beverages" },
    " or ",
    { text: "frozen pizza", to: "/category/pizza" },
    ", or ",
    { text: "browse every product", to: "/products" },
    ". For ideas on what to cook, our ",
    { text: "recipes", to: "/recipes" },
    " come from the Kosher.com kitchen and use Tuscanini products.",
  ] as CopyParagraph,
};

export const ABOUT_STORY = {
  heading: "Who we are",
  paragraphs: [
    [
      "Tuscanini is the Italian food brand of Kayco, a family-owned kosher food company. Kayco has been in business since 1948, and its story began with the first bottle of Kedem grape juice, bottled in upstate New York. Its brands today include Kedem, Manischewitz and Tuscanini.",
    ],
    [
      "Kayco presented Tuscanini Foods to the specialty food trade at the 2024 Summer Fancy Food Show, describing a line of olive oils, aged balsamic vinegars, pasta, traditional sauces, and frozen and refrigerated foods. The same show introduced Tuscanini Reserve, starting with Margherita and Supermargherita frozen pizzas.",
    ],
    [
      "The range on this site includes ",
      { text: "pasta and gnocchi", to: "/category/pasta-gnocchi" },
      ", ",
      { text: "pasta sauces", to: "/category/pasta-sauces" },
      ", ",
      { text: "olive oil", to: "/category/olive-oil" },
      ", ",
      { text: "sparkling drinks and juices", to: "/category/beverages" },
      " and ",
      { text: "frozen pizza", to: "/category/pizza" },
      ", along with vinegars, olives, condiments, chocolate and snacks. Each product page lists the package size and, where we have them, the ingredients and kosher details. For cooking ideas, see our ",
      { text: "recipes", to: "/recipes" },
      " from the Kosher.com kitchen, or ",
      { text: "browse every product", to: "/products" },
      ".",
    ],
  ] as CopyParagraph[],
  sources: [
    { label: "Kayco: About", url: "https://www.kayco.com/about/" },
    { label: "Kayco: Tuscanini", url: "https://www.kayco.com/brands/tuscanini/" },
    {
      label: "Specialty Food Association, June 11, 2024",
      url: "https://www.specialtyfood.com/news-media/news-features/member-press-releases/kayco-unveils-rebranding-of-iconic-manischewitz-%C2%AEbrand/",
    },
  ],
};

/** Main-content paragraphs for the main category pages, built from that category's own catalog entries. */
export const CATEGORY_INTROS: Record<string, CopyParagraph> = {
  "pasta-gnocchi": [
    "Tuscanini pasta comes in the shapes most kitchens reach for: spaghetti, fettuccine, penne, rigatoni, fusilli, elbows and oven-ready lasagna, plus a bronze-cut line that adds pappardelle, cavatappi and farfalle. The dry pasta is sold in 16 oz packs, and the oven-ready lasagna in a 17.6 oz pack. On the gnocchi side there are potato, mini, cauliflower and gluten-free potato gnocchi in 16 oz packs, and frozen potato, potato with spinach, cauliflower and gluten-free potato gnocchi in 17.6 oz packs. Bronze cut means the pasta is pressed through bronze dies, which leaves a rougher surface for sauce to hold onto. Pair a shape with one of our ",
    { text: "pasta sauces", to: "/category/pasta-sauces" },
    " or a jar of ",
    { text: "pesto", to: "/category/pesto" },
    ", finish it with ",
    { text: "olive oil", to: "/category/olive-oil" },
    ", and look through our ",
    { text: "recipes", to: "/recipes" },
    " for ideas. Each product page lists the package size and the details we have on file, and many have a Buy on Amazon button.",
  ],
  "pasta-sauces": [
    "Tuscanini pasta sauces come in two groups. The tomato sauces are Classic Marinara, Zesty Marinara, Napoletana and a Traditional Pizza Sauce, each in a 24 oz size. The creamy sauces are Alfredo, Mushroom Alfredo, Vodka Sauce and a Mac & Cheese Sauce, each in a 14.5 oz size. Use the marinara or Napoletana with spaghetti, penne or rigatoni from our ",
    { text: "pasta and gnocchi", to: "/category/pasta-gnocchi" },
    " collection, spread the pizza sauce on a homemade crust, toss gnocchi in Alfredo or vodka sauce, or stir the Mac & Cheese Sauce into elbows. For a sauce you build yourself, start from our ",
    { text: "canned tomatoes and paste", to: "/category/canned-tomatoes" },
    " and a pour of ",
    { text: "olive oil", to: "/category/olive-oil" },
    ". You will find more ways to cook with them in our ",
    { text: "recipes", to: "/recipes" },
    ". Each product page lists the size and the details we have on file, and many have a Buy on Amazon button.",
  ],
  "olive-oil": [
    "Tuscanini olive oil comes in two styles. Extra light olive oil has a mild taste for everyday cooking and baking, and is sold in 1 liter, 2 liter and 3 liter sizes. Extra virgin olive oil is for salad dressings, dipping bread and finishing dishes: the classic bottle is 750 mL, Sicilian extra virgin olive oil comes in 500 mL, and three flavored extra virgin oils, with garlic, with lemon and with black truffle, come in 250 mL bottles. Drizzle the garlic or truffle oil over pasta from our ",
    { text: "pasta and gnocchi", to: "/category/pasta-gnocchi" },
    " shelf, whisk extra virgin oil with something from our ",
    { text: "vinegars and glazes", to: "/category/vinegars-glazes" },
    " for a quick dressing, or brush it on a ",
    { text: "frozen pizza", to: "/category/pizza" },
    " before baking. Our ",
    { text: "recipes", to: "/recipes" },
    " use these oils too. Each product page lists the bottle size and the details we have on file, and many have a Buy on Amazon button.",
  ],
  beverages: [
    "Tuscanini drinks cover sparkling grape juices, sodas, lemonade and fruit juices. The sparkling grape juices are Moscato, Moscato Rosé, Bianco, Rosato and Malvasia, in 25.4 oz bottles, alongside a 25.4 oz sparkling apple cider; the 25.4 oz bottles are 750 mL each, a size made for sharing at the table. The organic sodas are Sparkling Lemon, Sparkling Blood Orange and Italian Cola, with a Diet Cola beside them, all in 9.3 oz sizes. Sparkling Lemonade and Sparkling Blood Orange Aranciata come in 9.3 oz and larger 25.3 oz bottles, and the 32 oz juices are blood orange, mandarin, pomegranate and lemonade. To go with them, browse our ",
    { text: "pasta and gnocchi", to: "/category/pasta-gnocchi" },
    ", ",
    { text: "frozen pizza", to: "/category/pizza" },
    " and ",
    { text: "chocolate", to: "/category/chocolate" },
    ", or see ",
    { text: "every product", to: "/products" },
    ". Each product page lists the bottle size and the details we have on file, and many have a Buy on Amazon button.",
  ],
  pizza: [
    "Tuscanini frozen pizza starts with the classic 14.1 oz pies, Four Cheese, Classico Margherita and Mushroom, and a 15 oz Grilled Vegetable pizza. The thin-crust options are the 8.3 oz Personal Pie and the 7.2 oz Bianca White. The Reserve line, which Kayco introduced at the 2024 Summer Fancy Food Show, includes Reserve Margherita, Reserve Supermargherita and a Reserve BBQ Ground Beef pizza. Mini Margherita Calzones and Mini Mushroom Pizza Calzones come in 8.47 oz packs for snacks and lunches. Keep them frozen until baking, and follow the time and temperature on the box. Add a drizzle of ",
    { text: "olive oil", to: "/category/olive-oil" },
    " or our ",
    { text: "Calabrian chili peppers", to: "/category/italian-condiments" },
    " after baking, pour something from our ",
    { text: "beverages", to: "/category/beverages" },
    ", or make your own pie with our ",
    { text: "pasta sauces", to: "/category/pasta-sauces" },
    " and ",
    { text: "flour", to: "/category/flour-baking" },
    ". Each product page lists the size and the details we have on file, and many have a Buy on Amazon button.",
  ],
};
