import { canonicalProductId, bundledCategories as fallbackCategories, setCatalogCategories, type Category, type Product } from "./products";
import { setRecipes, type Recipe } from "./recipes";
import { isKaycoProduct, mergeKaycoCatalog, type KaycoProduct } from "./kayco-catalog";
import { kaycoSnapshot } from "./kayco-catalog.generated";

type ContentType = "page" | "category" | "product" | "recipe" | "site_settings" | "navigation" | "footer";

interface PublishedContent {
  slug: string;
  title: string;
  description: string | null;
  data: Record<string, unknown>;
}

interface ListResponse {
  data: PublishedContent[];
  meta: { nextCursor: string | null };
}

const contentByKey = new Map<string, PublishedContent>();
const defaultContentApiUrl = "https://qkatfirzwukmgdrytbue.supabase.co/functions/v1/content-api";

function text(data: Record<string, unknown>, key: string, fallback = ""): string {
  const value = data[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function boolean(data: Record<string, unknown>, key: string): boolean {
  return data[key] === true;
}

function number(data: Record<string, unknown>, key: string, fallback = 0): number {
  const value = Number(data[key]);
  return Number.isFinite(value) ? value : fallback;
}

function stringList(data: Record<string, unknown>, key: string): string[] {
  const value = data[key];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") return value.split("\n").map((item) => item.trim()).filter(Boolean);
  return [];
}

function contentKey(type: ContentType, slug: string): string {
  return `${type}:${slug}`;
}

async function listAll(baseUrl: string, type: ContentType): Promise<PublishedContent[]> {
  const items: PublishedContent[] = [];
  const cursors = new Set<string>();
  let cursor: string | null = null;
  do {
    const params = new URLSearchParams({ limit: "100" });
    if (cursor) params.set("cursor", cursor);
    const response = await fetch(`${baseUrl}/sites/tuscanini/content/${type}?${params}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Kayco content API returned ${response.status} for ${type}`);
    const payload = (await response.json()) as ListResponse;
    items.push(...payload.data);
    cursor = payload.meta.nextCursor;
    if (cursor) {
      if (cursors.has(cursor)) throw new Error(`Kayco content API repeated a ${type} cursor`);
      cursors.add(cursor);
    }
  } while (cursor);
  return items;
}

export function mapCatalog(categoryItems: PublishedContent[], productItems: PublishedContent[]): Category[] {
  const productsByCategory = new Map<string, Product[]>();
  const validCategories = categoryItems.filter((item) => /^[a-z0-9][a-z0-9-]*$/i.test(item.slug.trim()));
  const categorySlugs = new Set(validCategories.map((item) => item.slug.trim()));
  const sortedProducts = [...productItems].sort(
    (left, right) => number(left.data, "display_order") - number(right.data, "display_order"),
  );

  const canonicalItems = new Map<string, PublishedContent>();
  for (const item of sortedProducts) {
    const sourceId = text(item.data, "source_id").trim() || item.slug.trim();
    const id = canonicalProductId(sourceId);
    const categorySlug = text(item.data, "category_slug").trim();
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(id) || !categorySlugs.has(categorySlug)) continue;
    const existing = canonicalItems.get(id);
    const existingId = existing ? text(existing.data, "source_id").trim() || existing.slug.trim() : "";
    if (!existing || (sourceId === id && existingId !== id)) canonicalItems.set(id, item);
  }

  for (const [id, item] of canonicalItems) {
    const categorySlug = text(item.data, "category_slug").trim();
    const ingredientsValue = item.data.ingredients;
    const product: Product = {
      id,
      name: item.title,
      description: item.description ?? "",
      image: text(item.data, "image"),
      categoryId: categorySlug,
      storage: text(item.data, 'storage') || undefined,
      preparation: stringList(item.data, 'prep'),
      nutritionImage: text(item.data, 'nfp_image') || undefined,
      nutritionFacts: stringList(item.data, 'nutrition_facts'),
      nutritionServing: text(item.data, 'nutrition_serving') || undefined,
      nutritionCalories: text(item.data, 'nutrition_calories') || undefined,
      details: text(item.data, "body", item.description ?? ""),
      ingredients: Array.isArray(ingredientsValue)
        ? ingredientsValue.filter((value): value is string => typeof value === "string").join(", ")
        : text(item.data, "ingredients"),
      size: text(item.data, "size"),
      kosher: boolean(item.data, "kosher"),
      madeInItaly: boolean(item.data, "made_in_italy"),
    };
    productsByCategory.set(categorySlug, [...(productsByCategory.get(categorySlug) ?? []), product]);
  }

  return validCategories
    .sort((left, right) => number(left.data, "display_order") - number(right.data, "display_order"))
    .map((item) => ({
      id: text(item.data, "source_id").trim() || item.slug.trim(),
      name: item.title,
      slug: item.slug.trim(),
      tagline: text(item.data, "tagline"),
      description: text(item.data, "body", item.description ?? ""),
      heroImage: text(item.data, "hero_image"),
      products: productsByCategory.get(item.slug.trim()) ?? [],
    }));
}

export function mapRecipes(items: PublishedContent[]): Recipe[] {
  return [...items]
    .sort((left, right) => number(left.data, "display_order") - number(right.data, "display_order"))
    .map((item) => ({
      id: text(item.data, "source_id", item.slug),
      name: item.title,
      description: text(item.data, "body", item.description ?? ""),
      ingredients: stringList(item.data, "ingredients"),
      instructions: stringList(item.data, 'instructions').map(step => step.trim()).filter(Boolean),
      products: [...new Set(stringList(item.data, "related_products").map(id => canonicalProductId(id.trim())))],
      prepTime: text(item.data, "prep_time"),
      cookTime: text(item.data, "cook_time"),
      servings: number(item.data, "servings") > 0 ? number(item.data, "servings") : undefined,
      image: text(item.data, "hero_image") || undefined,
    }));
}

export function getCmsData(type: ContentType, slug: string): Record<string, unknown> | null {
  return contentByKey.get(contentKey(type, slug))?.data ?? null;
}

export function getCmsLinks(type: "navigation" | "footer", slug: string): Array<{ label: string; to: string }> {
  const data = getCmsData(type, slug);
  if (!data) return [];
  return stringList(data, "links")
    .map((item) => {
      const [label, to] = item.split("|").map((part) => part.trim());
      return label && to ? { label, to } : null;
    })
    .filter((item): item is { label: string; to: string } => item !== null);
}

function applySiteSettings(): void {
  if (typeof document === "undefined") return;

  const settings = getCmsData("site_settings", "general");
  if (!settings) return;

  const primaryColor = text(settings, "primary_color");
  if (/^#[0-9a-f]{6}$/i.test(primaryColor)) {
    document.documentElement.style.setProperty("--color-primary", primaryColor);
  }
}

export async function initializeCmsContent(): Promise<boolean> {
  const configuredUrl = import.meta.env.VITE_KAYCO_CONTENT_API_URL?.trim() || defaultContentApiUrl;
  const baseUrl = configuredUrl.replace(/\/+$/, "");

  const types: ContentType[] = ["category", "product", "recipe", "page", "site_settings", "navigation", "footer"];
  const catalogRequest = fetch('/api/catalog', { signal: AbortSignal.timeout(10_000) })
    .then(async response => {
      if (!response.ok) throw new Error('Catalog unavailable');
      const payload = await response.json() as { data: KaycoProduct[] };
      if (!Array.isArray(payload.data) || payload.data.length === 0 || !payload.data.every(isKaycoProduct)) throw new Error('Invalid catalog');
      return payload.data;
    }).catch(() => kaycoSnapshot);
  const [results, kaycoProducts] = await Promise.all([
    Promise.allSettled(types.map((type) => listAll(baseUrl, type))), catalogRequest,
  ]);
  const byType = new Map<ContentType, PublishedContent[]>();

  results.forEach((result, index) => {
    const type = types[index];
    if (result.status === "fulfilled") {
      byType.set(type, result.value);
    } else {
      console.warn(`Kayco CMS ${type} content is unavailable; keeping its bundled fallback.`, result.reason);
    }
  });

  const categoryItems = byType.get("category");
  const productItems = byType.get("product");
  let catalogLoaded = false;
  let baseCategories = fallbackCategories;

  if (categoryItems && productItems) {
    const mappedCategories = mapCatalog(categoryItems, productItems);
    if (mappedCategories.some(category => category.products.length > 0)) {
      baseCategories = mappedCategories;
      catalogLoaded = true;
    }
  }
  setCatalogCategories(mergeKaycoCatalog(baseCategories, kaycoProducts));

  const recipeItems = byType.get("recipe");
  if (recipeItems) {
    const mappedRecipes = mapRecipes(recipeItems);
    if (mappedRecipes.length > 0) setRecipes(mappedRecipes);
  }

  for (const [type, items] of byType) {
    for (const item of items) contentByKey.set(contentKey(type, item.slug), item);
  }
  applySiteSettings();
  return catalogLoaded;
}
