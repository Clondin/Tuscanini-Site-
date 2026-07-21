import { categories as fallbackCategories, setCatalogCategories, type Category, type Product } from "./products";
import { setRecipes, type Recipe } from "./recipes";

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
  } while (cursor);
  return items;
}

function mapCatalog(categoryItems: PublishedContent[], productItems: PublishedContent[]): Category[] {
  const productsByCategory = new Map<string, Product[]>();
  const sortedProducts = [...productItems].sort(
    (left, right) => number(left.data, "display_order") - number(right.data, "display_order"),
  );

  for (const item of sortedProducts) {
    const categorySlug = text(item.data, "category_slug");
    if (!categorySlug) continue;
    const ingredientsValue = item.data.ingredients;
    const product: Product = {
      id: text(item.data, "source_id", item.slug),
      name: item.title,
      description: item.description ?? "",
      image: text(item.data, "image"),
      categoryId: categorySlug,
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

  return [...categoryItems]
    .sort((left, right) => number(left.data, "display_order") - number(right.data, "display_order"))
    .map((item) => ({
      id: text(item.data, "source_id", item.slug),
      name: item.title,
      slug: item.slug,
      tagline: text(item.data, "tagline"),
      description: text(item.data, "body", item.description ?? ""),
      heroImage: text(item.data, "hero_image"),
      products: productsByCategory.get(item.slug) ?? [],
    }));
}

function mapRecipes(items: PublishedContent[]): Recipe[] {
  return [...items]
    .sort((left, right) => number(left.data, "display_order") - number(right.data, "display_order"))
    .map((item) => ({
      id: text(item.data, "source_id", item.slug),
      name: item.title,
      description: text(item.data, "body", item.description ?? ""),
      ingredients: stringList(item.data, "ingredients"),
      products: stringList(item.data, "related_products"),
      prepTime: text(item.data, "prep_time"),
      cookTime: text(item.data, "cook_time"),
      servings: number(item.data, "servings", 1),
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

  const siteTitle = text(settings, "site_title");
  if (siteTitle) document.title = siteTitle;

  const tagline = text(settings, "tagline");
  if (tagline) {
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.append(description);
    }
    description.content = tagline;
  }

  const primaryColor = text(settings, "primary_color");
  if (/^#[0-9a-f]{6}$/i.test(primaryColor)) {
    document.documentElement.style.setProperty("--color-primary", primaryColor);
  }
}

export async function initializeCmsContent(): Promise<boolean> {
  const configuredUrl = import.meta.env.VITE_KAYCO_CONTENT_API_URL?.trim() || defaultContentApiUrl;
  const baseUrl = configuredUrl.replace(/\/+$/, "");

  try {
    const types: ContentType[] = ["category", "product", "recipe", "page", "site_settings", "navigation", "footer"];
    const results = await Promise.all(types.map((type) => listAll(baseUrl, type)));
    const byType = new Map(types.map((type, index) => [type, results[index]]));
    const categoryItems = byType.get("category") ?? [];
    const productItems = byType.get("product") ?? [];
    const mappedCategories = mapCatalog(categoryItems, productItems);
    if (mappedCategories.length > 0) setCatalogCategories(mappedCategories);

    const mappedRecipes = mapRecipes(byType.get("recipe") ?? []);
    if (mappedRecipes.length > 0) setRecipes(mappedRecipes);

    for (const [type, items] of byType) {
      for (const item of items) contentByKey.set(contentKey(type, item.slug), item);
    }
    applySiteSettings();
    return mappedCategories.length > 0;
  } catch (error) {
    console.warn("Kayco CMS is unavailable; using the bundled Tuscanini content.", error);
    setCatalogCategories(fallbackCategories);
    return false;
  }
}
