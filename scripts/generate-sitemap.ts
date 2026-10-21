import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prepareBuildCatalog } from "./load-build-catalog";
import { renderSitemap } from "./sitemap-xml";
import { resolveSiteUrl } from "../src/lib/siteUrl";
import { recipePages } from "../src/data/recipe-pages";

const siteUrl = resolveSiteUrl(process.env.VITE_SITE_URL);

const paths = new Set<string>(["/", "/about", "/products", "/terms", "/recipes"]);
for (const recipe of recipePages) paths.add(`/recipes/${recipe.slug}`);

const catalog = await prepareBuildCatalog();
for (const category of catalog) {
  paths.add(`/category/${category.slug}`);
  for (const product of category.products) paths.add(`/product/${product.id}`);
}

await writeFile(resolve("public/sitemap.xml"), renderSitemap(paths, siteUrl), "utf8");
console.log(`Generated sitemap with ${paths.size} URLs.`);
