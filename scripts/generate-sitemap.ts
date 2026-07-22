import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { categories as fallbackCategories } from "../src/data/products";

interface PublishedContent {
  slug: string;
  data: Record<string, unknown>;
}

interface ListResponse {
  data: PublishedContent[];
  meta: { nextCursor: string | null };
}

const defaultApiUrl = "https://qkatfirzwukmgdrytbue.supabase.co/functions/v1/content-api";
const siteUrl = (process.env.VITE_SITE_URL || "https://tuscanini-site.vercel.app").replace(/\/+$/, "");
const apiUrl = (process.env.VITE_KAYCO_CONTENT_API_URL || defaultApiUrl).replace(/\/+$/, "");

async function listAll(type: "category" | "product"): Promise<PublishedContent[]> {
  const items: PublishedContent[] = [];
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
  } while (cursor);
  return items;
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] ?? character);
}

const paths = new Set<string>(["/", "/about"]);

try {
  const [categoryItems, productItems] = await Promise.all([listAll("category"), listAll("product")]);
  for (const item of categoryItems) paths.add(`/category/${item.slug}`);
  for (const item of productItems) {
    const sourceId = typeof item.data.source_id === "string" && item.data.source_id.trim()
      ? item.data.source_id.trim()
      : item.slug;
    paths.add(`/product/${sourceId}`);
  }
} catch (error) {
  console.warn("CMS sitemap generation failed; using the bundled catalog.", error);
  for (const category of fallbackCategories) {
    paths.add(`/category/${category.slug}`);
    for (const product of category.products) paths.add(`/product/${product.id}`);
  }
}

const urls = [...paths]
  .sort((left, right) => left.localeCompare(right))
  .map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`)
  .join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await writeFile(resolve("public/sitemap.xml"), xml, "utf8");
console.log(`Generated sitemap with ${paths.size} URLs.`);
