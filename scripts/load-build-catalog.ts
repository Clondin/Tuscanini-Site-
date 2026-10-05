import { canonicalProductId, categories as fallbackCategories, type Category, type Product } from "../src/data/products";

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

const defaultApiUrl = "https://qkatfirzwukmgdrytbue.supabase.co/functions/v1/content-api";

function text(data: Record<string, unknown>, key: string, fallback = ""): string {
  const value = data[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

export function safeSlug(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/i.test(value);
}

function productSourceId(item: PublishedContent): string {
  return text(item.data, "source_id").trim() || item.slug.trim();
}

export function mapBuildCatalog(categoryItems: PublishedContent[], productItems: PublishedContent[]): Category[] {
  const categories = categoryItems.flatMap((item): Category[] => {
    const slug = item.slug.trim();
    if (!safeSlug(slug)) return [];
    return [{
      id: text(item.data, "source_id").trim() || slug,
      name: item.title,
      slug,
      tagline: text(item.data, "tagline"),
      description: text(item.data, "body", item.description ?? ""),
      heroImage: text(item.data, "hero_image"),
      products: [],
    }];
  });
  const bySlug = new Map(categories.map((category) => [category.slug, category]));

  const sortedProducts = [...productItems].sort((left, right) => {
    const leftId = productSourceId(left);
    const rightId = productSourceId(right);
    return Number(leftId !== canonicalProductId(leftId)) - Number(rightId !== canonicalProductId(rightId));
  });
  const seenProductIds = new Set<string>();
  for (const item of sortedProducts) {
    const id = canonicalProductId(productSourceId(item));
    const category = bySlug.get(text(item.data, "category_slug").trim());
    if (!safeSlug(id) || !category || seenProductIds.has(id)) continue;
    seenProductIds.add(id);
    const product: Product = {
      id,
      name: item.title,
      description: item.description ?? "",
      image: text(item.data, "image"),
      categoryId: category.slug,
    };
    category.products.push(product);
  }
  return categories;
}

async function listAll(apiUrl: string, type: "category" | "product"): Promise<PublishedContent[]> {
  const items: PublishedContent[] = [];
  const cursors = new Set<string>();
  let cursor: string | null = null;
  do {
    const params = new URLSearchParams({ limit: "100" });
    if (cursor) params.set("cursor", cursor);
    const response = await fetch(`${apiUrl}/sites/tuscanini/content/${type}?${params}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Content API returned ${response.status} for ${type}`);
    const payload = (await response.json()) as ListResponse;
    items.push(...payload.data);
    cursor = payload.meta.nextCursor;
    if (cursor) {
      if (cursors.has(cursor)) throw new Error(`Content API repeated a ${type} cursor`);
      cursors.add(cursor);
    }
  } while (cursor);
  return items;
}

export async function loadBuildCatalog(): Promise<Category[]> {
  const apiUrl = (process.env.VITE_KAYCO_CONTENT_API_URL?.trim() || defaultApiUrl).replace(/\/+$/, "");
  try {
    const [categoryItems, productItems] = await Promise.all([listAll(apiUrl, "category"), listAll(apiUrl, "product")]);
    const categories = mapBuildCatalog(categoryItems, productItems);
    if (categories.length === 0) throw new Error("Content API returned no usable categories");
    return categories;
  } catch (error) {
    console.warn("CMS build catalog is unavailable; using the bundled catalog.", error);
    return fallbackCategories;
  }
}
