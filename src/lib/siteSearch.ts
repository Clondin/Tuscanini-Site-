import { categories as catalogCategories, type Category, type Product } from "../data/products";
import { recipePages, type RecipePage } from "../data/recipe-pages";
import { getKosherFeaturesForProduct, getKosherVideosForProduct } from "../data/kosherFeatures";
import { tuscaniniKosherVideos } from "../data/kosherBrandVideos";
import type { KosherVideo } from "./kosherVideo";
import { isMissingProductImage } from "./productImage";
import { normalizeSearch } from "./catalog-search";
import { editDistance, stem, tokenMatch } from "./searchText";

/**
 * Site-wide instant search: products, collections, recipes and kosher.com videos.
 * Small, dependency-free scoring that tolerates plurals, typos, item numbers and word prefixes.
 */

export type SearchKind = "product" | "category" | "recipe" | "video";

export interface ProductHit { kind: "product"; product: Product; category: Category; score: number; approximate: boolean }
export interface CategoryHit { kind: "category"; category: Category; count: number; score: number }
export interface RecipeHit {
  kind: "recipe";
  title: string;
  /** Internal path for recipes hosted on this site, otherwise the kosher.com URL. */
  href: string;
  external: boolean;
  image?: string;
  minutes?: number;
  author?: string;
  score: number;
}
export interface VideoHit { kind: "video"; video: KosherVideo; productId?: string; score: number }

export interface SiteSearchResults {
  query: string;
  products: ProductHit[];
  categories: CategoryHit[];
  recipes: RecipeHit[];
  videos: VideoHit[];
  total: number;
  approximate: boolean;
}

interface Field { words: string[]; weight: number; raw: string }
interface Doc<T> { item: T; fields: Field[]; title: string }

const words = (value: string) => normalizeSearch(value).split(" ").filter(Boolean);
const field = (value: string | undefined, weight: number): Field => ({ words: words(value || ""), weight, raw: normalizeSearch(value || "") });

/** Scores a doc against tokens. Every token must match somewhere; returns 0 when one does not. */
function scoreDoc<T>(doc: Doc<T>, tokens: string[], phrase: string): { score: number; approximate: boolean } {
  let total = 0;
  let approximate = false;
  for (const token of tokens) {
    let best = 0;
    for (const f of doc.fields) {
      for (const w of f.words) {
        const m = tokenMatch(token, w);
        if (m) best = Math.max(best, m * f.weight);
      }
    }
    if (!best) return { score: 0, approximate: false };
    const exactSomewhere = doc.fields.some((f) => f.words.some((w) => w === token || stem(w) === stem(token) || w.startsWith(token)));
    if (!exactSomewhere) approximate = true;
    total += best;
  }
  const title = normalizeSearch(doc.title);
  if (phrase && title === phrase) total += 12;
  else if (phrase && title.startsWith(phrase)) total += 7;
  else if (phrase.length > 2 && title.includes(phrase)) total += 4;
  // Shorter names win ties: "Penne" before "Penne Rigate with ..."
  total += Math.max(0, 3 - title.split(" ").length * 0.25);
  return { score: total, approximate };
}

let cache: {
  source: Category[];
  products: Doc<{ product: Product; category: Category }>[];
  categories: Doc<Category>[];
  recipes: Doc<Omit<RecipeHit, "score">>[];
  videos: Doc<{ video: KosherVideo; productId?: string }>[];
  vocabulary: string[];
} | null = null;

function buildIndex(source: Category[]) {
  if (cache && cache.source === source) return cache;
  const products: NonNullable<typeof cache>["products"] = [];
  const categoryDocs: NonNullable<typeof cache>["categories"] = [];
  const recipes: NonNullable<typeof cache>["recipes"] = [];
  const videos: NonNullable<typeof cache>["videos"] = [];
  const seenVideo = new Set<string>();
  const seenRecipe = new Set<string>();
  const vocabulary = new Set<string>();

  for (const p of recipePages) {
    seenRecipe.add(p.sourceUrl);
    const item = { kind: "recipe" as const, title: p.title, href: `/recipes/${p.slug}`, external: false, image: p.imageThumb || p.image, minutes: p.totalMinutes, author: p.author };
    recipes.push({ item, title: p.title, fields: [field(p.title, 10), field(p.keywords.join(" "), 5), field(p.course, 3), field(p.ingredients.join(" "), 1.5), field(p.author, 2)] });
    words(p.title).forEach((w) => vocabulary.add(w));
  }
  const addVideo = (video: KosherVideo, productId?: string, productName?: string) => {
    if (seenVideo.has(video.jw)) return;
    seenVideo.add(video.jw);
    videos.push({ item: { video, productId }, title: video.title, fields: [field(video.title, 10), field(productName, 2)] });
  };
  tuscaniniKosherVideos.forEach((v) => addVideo(v));

  for (const category of source) {
    let count = 0;
    for (const product of category.products) {
      if (!product.image || isMissingProductImage(product.image)) continue;
      count++;
      const sku = [product.sku, product.id.match(/\d{5,}/)?.[0]].filter(Boolean).join(" ");
      products.push({
        item: { product, category },
        title: product.name,
        fields: [
          field(product.name, 10),
          field(sku, 9),
          field(category.name, 4),
          field(product.size, 1.5),
          field(product.description, 1),
          field([product.frozen || ["pizza", "gelato", "bread-frozen-appetizers"].includes(product.categoryId) ? "frozen" : "", /gluten[ -]free/i.test(product.name) ? "gluten free gf" : ""].join(" "), 3),
        ],
      });
      words(product.name).forEach((w) => vocabulary.add(w));
      for (const f of getKosherFeaturesForProduct(product.id)) {
        if (f.type !== "recipe" || seenRecipe.has(f.url)) continue;
        seenRecipe.add(f.url);
        recipes.push({ item: { kind: "recipe", title: f.title, href: f.url, external: true, image: f.thumb || f.image }, title: f.title, fields: [field(f.title, 9), field(product.name, 1.5)] });
      }
      for (const v of getKosherVideosForProduct(product.id)) addVideo(v, product.id, product.name);
    }
    if (count) {
      categoryDocs.push({ item: category, title: category.name, fields: [field(category.name, 10), field(category.tagline, 2)] });
      words(category.name).forEach((w) => vocabulary.add(w));
    }
  }
  cache = { source, products, categories: categoryDocs, recipes, videos, vocabulary: [...vocabulary].filter((w) => w.length > 2) };
  return cache;
}

function rank<T>(docs: Doc<T>[], tokens: string[], phrase: string, floor = 0) {
  const out: { item: T; score: number; approximate: boolean }[] = [];
  for (const doc of docs) {
    const r = scoreDoc(doc, tokens, phrase);
    if (r.score > floor) out.push({ item: doc.item, ...r });
  }
  return out.sort((a, b) => b.score - a.score);
}

export function searchSite(query: string, source: Category[] = catalogCategories): SiteSearchResults {
  const phrase = normalizeSearch(query);
  const tokens = phrase.split(" ").filter(Boolean);
  const empty: SiteSearchResults = { query, products: [], categories: [], recipes: [], videos: [], total: 0, approximate: false };
  if (!tokens.length) return empty;
  const index = buildIndex(source);
  const counts = new Map<string, number>();
  const products = rank(index.products, tokens, phrase).map((r) => {
    counts.set(r.item.category.slug, (counts.get(r.item.category.slug) || 0) + 1);
    return { kind: "product" as const, product: r.item.product, category: r.item.category, score: r.score, approximate: r.approximate };
  });
  // A precise result set hides the fuzzy tail: "penne" should not also list "pesto".
  const precise = products.filter((p) => !p.approximate);
  const shownProducts = precise.length >= 3 ? precise : products;
  const categoryHits = rank(index.categories, tokens, phrase).map((r) => ({ kind: "category" as const, category: r.item, count: r.item.products.length, score: r.score }));
  const recipes = rank(index.recipes, tokens, phrase).map((r) => ({ ...r.item, score: r.score }));
  const videos = rank(index.videos, tokens, phrase).map((r) => ({ kind: "video" as const, video: r.item.video, productId: r.item.productId, score: r.score }));
  return {
    query,
    products: shownProducts,
    categories: categoryHits,
    recipes,
    videos,
    total: shownProducts.length + categoryHits.length + recipes.length + videos.length,
    approximate: shownProducts.some((p) => p.approximate),
  };
}

/** A "did you mean" for a query with no results, from the words in product and collection names. */
export function suggestQuery(query: string, source: Category[] = catalogCategories): string | null {
  const tokens = normalizeSearch(query).split(" ").filter(Boolean);
  if (!tokens.length) return null;
  const { vocabulary } = buildIndex(source);
  let changed = false;
  const fixed = tokens.map((t) => {
    if (vocabulary.includes(t)) return t;
    let best: string | null = null;
    let bestD = 3;
    for (const w of vocabulary) {
      const d = editDistance(t, w, 2);
      if (d < bestD && d <= Math.max(1, Math.min(2, Math.floor(t.length / 3)))) { best = w; bestD = d; }
    }
    if (best) { changed = true; return best; }
    return t;
  });
  if (!changed) return null;
  const s = fixed.join(" ");
  return searchSite(s, source).total ? s : null;
}

export { POPULAR_SEARCHES, getRecentSearches, saveRecentSearch, clearRecentSearches, highlightRanges } from "./searchText";
export type { RecipePage };
