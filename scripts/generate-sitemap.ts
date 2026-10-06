import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prepareBuildCatalog } from "./load-build-catalog";
import { renderSitemap } from "./sitemap-xml";

const siteUrl = (process.env.VITE_SITE_URL || "https://tuscanini-site.vercel.app").replace(/\/+$/, "");

const paths = new Set<string>(["/", "/about", "/products"]);

const catalog = await prepareBuildCatalog();
for (const category of catalog) {
  paths.add(`/category/${category.slug}`);
  for (const product of category.products) paths.add(`/product/${product.id}`);
}

await writeFile(resolve("public/sitemap.xml"), renderSitemap(paths, siteUrl), "utf8");
console.log(`Generated sitemap with ${paths.size} URLs.`);
