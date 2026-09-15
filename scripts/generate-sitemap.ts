import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prepareBuildCatalog } from "./load-build-catalog";

const siteUrl = (process.env.VITE_SITE_URL || "https://tuscanini-site.vercel.app").replace(/\/+$/, "");

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

const catalog = await prepareBuildCatalog();
for (const category of catalog) {
  paths.add(`/category/${category.slug}`);
  for (const product of category.products) paths.add(`/product/${product.id}`);
}

const urls = [...paths]
  .sort((left, right) => left.localeCompare(right))
  .map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`)
  .join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await writeFile(resolve("public/sitemap.xml"), xml, "utf8");
console.log(`Generated sitemap with ${paths.size} URLs.`);
