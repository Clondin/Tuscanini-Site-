import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { productRouteTitle } from "../src/lib/routeTitle";
import { getOptimizedImageUrl, isMissingProductImage } from "../src/lib/productImage";
import { renderSitemap } from "./sitemap-xml";
import { productSchemaFields } from "../src/lib/productSchema";
import { formatProductSize } from "../src/lib/formatProductSize";
import { recipePages, recipeDescription, recipeStructuredData, recipesIndexDescription } from "../src/data/recipe-pages";
import type { Category, Product } from "../src/data/products";
import { readBuildCatalog } from "./load-build-catalog";
import { resolveSiteUrl } from "../src/lib/siteUrl";

interface RouteHtml {
  path: string;
  title: string;
  description: string;
  type: "website" | "product";
  image?: string;
  structuredData: unknown;
  /** Visible HTML placed inside #root so crawlers and no-JS readers see the page; React replaces it on mount. */
  content: string;
}

const siteUrl = resolveSiteUrl(process.env.VITE_SITE_URL);
const defaultImage = `${siteUrl}/assets/Photos/backgrounds/italian-coast.jpg`;

function safeSlug(value: string): string | null {
  return /^[a-z0-9][a-z0-9-]*$/i.test(value) ? value : null;
}

function absoluteUrl(value: string | undefined): string {
  if (!value || isMissingProductImage(value)) return defaultImage;
  try {
    return new URL(getOptimizedImageUrl(value), `${siteUrl}/`).toString();
  } catch {
    return defaultImage;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function replaceMeta(html: string, pattern: RegExp, replacement: string): string {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `    ${replacement}\n  </head>`);
}


function imageSrc(value: string | undefined): string | null {
  if (!value || isMissingProductImage(value)) return null;
  return encodeURI(getOptimizedImageUrl(value));
}

function thumbnailSrc(product: Product): string | null {
  const gallery = product.imageGallery?.[0];
  if (gallery?.thumbnail) return encodeURI(gallery.thumbnail);
  return imageSrc(product.image);
}

const prerenderStyles = `<style id="prerender-styles">
.prerender{max-width:72rem;margin:0 auto;padding:2.5rem 1.5rem 4rem;font-family:Georgia,"Times New Roman",serif;color:#2a1f16;background:#faf7f2;line-height:1.6}
.prerender a{color:#8c3b24}
.prerender nav a{color:#69594e}
.prerender h1{font-size:2rem;line-height:1.2;margin:.5rem 0 1rem}
.prerender h2{font-size:1.3rem;margin:2rem 0 .75rem}
.prerender p{margin:0 0 .75rem;color:#4a3f36}
.prerender ul{margin:0;padding:0;list-style:none}
.prerender .pr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(10rem,1fr));gap:1.25rem}
.prerender .pr-grid img{display:block;width:100%;height:10rem;object-fit:contain;background:#fff;border:1px solid #eee3d6;margin-bottom:.5rem}
.prerender .pr-hero{display:grid;gap:1.5rem;grid-template-columns:minmax(0,20rem) 1fr;align-items:start}
.prerender .pr-hero img{display:block;width:100%;max-width:20rem;height:auto;background:#fff;border:1px solid #eee3d6}
.prerender .pr-facts{color:#69594e;font-size:.95rem}
@media (max-width:40rem){.prerender .pr-hero{grid-template-columns:1fr}}
</style>`;

function breadcrumbHtml(items: Array<{ name: string; href?: string }>): string {
  const parts = items.map((item) =>
    item.href ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.name)}</a>` : `<span>${escapeHtml(item.name)}</span>`,
  );
  return `<nav aria-label="Breadcrumb"><p>${parts.join(" &rsaquo; ")}</p></nav>`;
}

function productCardHtml(product: Product): string {
  const thumb = thumbnailSrc(product);
  const size = formatProductSize(product.size);
  return `<li>${thumb ? `<a href="/product/${escapeHtml(product.id)}"><img src="${escapeHtml(thumb)}" alt="${escapeHtml(product.name)}" loading="lazy" /></a>` : ""}<a href="/product/${escapeHtml(product.id)}">${escapeHtml(product.name)}</a>${size ? `<div class="pr-facts">${escapeHtml(size)}</div>` : ""}</li>`;
}

function wrap(inner: string): string {
  return `<div class="prerender" data-prerender="true">${inner}</div>`;
}

function homeContent(categories: Category[]): string {
  const list = categories
    .map((category) => `<li><a href="/category/${escapeHtml(category.slug)}">${escapeHtml(category.name)}</a> &mdash; ${escapeHtml(category.tagline || category.description)}</li>`)
    .join("");
  return wrap(`<h1>Tuscanini &mdash; Italian Food</h1><p>Taste Tuscanini. Know Italy. Pasta, sauces, olive oils, drinks, snacks, and frozen foods imported from Italy.</p><p><a href="/products">Explore all products</a> &middot; <a href="/recipes">Recipes</a> &middot; <a href="/about">Our story</a></p><h2>Shop by category</h2><ul>${list}</ul>`);
}

function productsContent(categories: Category[]): string {
  const sections = categories
    .map((category) => `<h2><a href="/category/${escapeHtml(category.slug)}">${escapeHtml(category.name)}</a></h2><p>${escapeHtml(category.description || category.tagline)}</p><ul class="pr-grid">${category.products.map(productCardHtml).join("")}</ul>`)
    .join("");
  return wrap(`${breadcrumbHtml([{ name: "Home", href: "/" }, { name: "Products" }])}<h1>Explore Our Products</h1><p>Browse Tuscanini pasta, sauces, olive oils, drinks, snacks, and frozen foods.</p>${sections}`);
}

function categoryContent(category: Category): string {
  return wrap(
    `${breadcrumbHtml([{ name: "Home", href: "/" }, { name: "Products", href: "/products" }, { name: category.name }])}` +
      `<h1>${escapeHtml(category.name)}</h1>` +
      (category.tagline ? `<p><em>${escapeHtml(category.tagline)}</em></p>` : "") +
      `<p>${escapeHtml(category.description)}</p>` +
      `<h2>${category.products.length} products</h2><ul class="pr-grid">${category.products.map(productCardHtml).join("")}</ul>`,
  );
}

function productContent(product: Product, category: Category): string {
  const main = imageSrc(product.image);
  const alt = product.imageGallery?.find((galleryImage) => galleryImage.src === product.image)?.alt || product.name;
  const size = formatProductSize(product.size);
  const facts = [
    size ? `Size: ${size}` : "",
    product.kosher ? "Certified kosher" : "",
    product.madeInItaly ? "Made in Italy" : "",
    product.frozen ? "Keep frozen" : "",
    product.sku ? `SKU ${product.sku}` : "",
  ].filter(Boolean);
  const siblings = category.products.filter((other) => other.id !== product.id).slice(0, 8);
  return wrap(
    `${breadcrumbHtml([{ name: "Home", href: "/" }, { name: "Products", href: "/products" }, { name: category.name, href: `/category/${category.slug}` }, { name: product.name }])}` +
      `<div class="pr-hero">${main ? `<img src="${escapeHtml(main)}" alt="${escapeHtml(alt)}" />` : "<div></div>"}<div>` +
      `<h1>${escapeHtml(product.name)}</h1>` +
      `<p>${escapeHtml(product.description)}</p>` +
      (product.details ? `<p>${escapeHtml(product.details)}</p>` : "") +
      (product.ingredients ? `<p><strong>Ingredients:</strong> ${escapeHtml(product.ingredients)}</p>` : "") +
      (facts.length ? `<p class="pr-facts">${facts.map(escapeHtml).join(" &middot; ")}</p>` : "") +
      `<p>Part of <a href="/category/${escapeHtml(category.slug)}">${escapeHtml(category.name)}</a> &middot; <a href="/products">All products</a></p>` +
      `</div></div>` +
      (siblings.length ? `<h2>More from ${escapeHtml(category.name)}</h2><ul class="pr-grid">${siblings.map(productCardHtml).join("")}</ul>` : ""),
  );
}

function simpleContent(title: string, description: string, extra = ""): string {
  return wrap(`${breadcrumbHtml([{ name: "Home", href: "/" }, { name: title }])}<h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p>${extra}<p><a href="/products">Explore our products</a></p>`);
}

function renderRouteHtml(baseHtml: string, route: RouteHtml): string {
  const canonical = `${siteUrl}${route.path}`;
  const image = absoluteUrl(route.image);
  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)
    .replace(
      /<noscript>[\s\S]*?<\/noscript>/,
      `<noscript><main><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.description)}</p><a href="/">Return to Tuscanini</a></main></noscript>`,
    );

  const replacements: Array<[RegExp, string]> = [
    [/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(route.description)}" />`],
    [/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(route.title)}" />`],
    [/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(route.description)}" />`],
    [/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${route.type}" />`],
    [/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`],
    [/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${escapeHtml(image)}" />`],
    [/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`],
    [/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`],
    [/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${escapeHtml(image)}" />`],
    [/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`],
  ];
  for (const [pattern, replacement] of replacements) html = replaceMeta(html, pattern, replacement);

  // Visible, crawlable page body. React's createRoot clears #root on mount, so the app renders exactly as before.
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${route.content}</div>`);
  if (!html.includes('id="prerender-styles"')) html = html.replace("</head>", `    ${prerenderStyles}\n  </head>`);

  const jsonLd = JSON.stringify(route.structuredData).replace(/</g, "\\u003c");
  html = html.replace(
    /<script id="route-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script id="route-structured-data" type="application/ld+json">${jsonLd}</script>`,
  );
  return html;
}

function catalogRoutes(categories: Category[]): RouteHtml[] {
  const routes: RouteHtml[] = [];
  for (const category of categories) {
    routes.push({
      path: `/category/${category.slug}`,
      title: `${category.name} | Tuscanini`,
      description: category.description || category.tagline,
      type: "website",
      image: category.heroImage,
      content: categoryContent(category),
      structuredData: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.name,
          description: category.description || category.tagline,
          url: `${siteUrl}/category/${category.slug}`,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
            { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products` },
            { "@type": "ListItem", position: 3, name: category.name, item: `${siteUrl}/category/${category.slug}` },
          ],
        },
      ],
    });
    for (const product of category.products) {
      routes.push({
        path: `/product/${product.id}`,
        title: productRouteTitle(product.name),
        description: product.description,
        type: "product",
        image: product.image,
        content: productContent(product, category),
        structuredData: productStructuredData(product, category.name, category.slug),
      });
    }
  }
  return routes;
}

function productStructuredData(
  product: Product,
  categoryName: string,
  categorySlug: string,
): unknown {
  const { name, image, id } = product;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      ...productSchemaFields(product),
      image: product.imageGallery?.length
        ? product.imageGallery.map((galleryImage) => absoluteUrl(galleryImage.src))
        : image && !isMissingProductImage(image)
          ? [absoluteUrl(image)]
          : undefined,
      category: categoryName,
      brand: { "@type": "Brand", name: "Tuscanini" },
      url: `${siteUrl}/product/${id}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: categoryName, item: `${siteUrl}/category/${categorySlug}` },
        { "@type": "ListItem", position: 3, name, item: `${siteUrl}/product/${id}` },
      ],
    },
  ];
}

const baseHtml = await readFile(resolve("dist/index.html"), "utf8");
const home: RouteHtml = {
  path: "/",
  title: "Tuscanini | Italian Food",
  description: "Pasta, sauces, olive oils, drinks, snacks, and frozen foods from Tuscanini.",
  type: "website",
  image: defaultImage,
  content: "",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tuscanini",
    url: `${siteUrl}/`,
    logo: `${siteUrl}/favicon.svg`,
    sameAs: ["https://www.instagram.com/tuscaninifoods/", "https://www.youtube.com/@TuscaniniFoods"],
  },
};
const about: RouteHtml = {
  path: "/about",
  title: "Our Story | Tuscanini",
  image: `${siteUrl}/assets/Photos/story/italian-hillside-village-hero.webp`,
  description: "Learn about Tuscanini pasta, sauces, olive oils, drinks, and other Italian foods.",
  type: "website",
  content: simpleContent("Our Story", "Learn about Tuscanini pasta, sauces, olive oils, drinks, and other Italian foods."),
  structuredData: {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Our Story",
    url: `${siteUrl}/about`,
  },
};

function recipeRoutes(categories: Category[]): RouteHtml[] {
  const productsById = new Map<string, Product>();
  for (const category of categories) for (const product of category.products) productsById.set(product.id, product);
  const imagesFor = (ids: string[]) => ids
    .map((id) => productsById.get(id)?.image)
    .filter((image): image is string => Boolean(image) && !isMissingProductImage(image))
    .map((image) => absoluteUrl(image));
  const routes: RouteHtml[] = [{
    path: "/recipes",
    title: "Recipes | Tuscanini",
    description: recipesIndexDescription(),
    type: "website",
    image: recipePages[0]?.image,
    content: simpleContent("Recipes", recipesIndexDescription(), `<ul>${recipePages.map((recipe) => `<li><a href="/recipes/${escapeHtml(recipe.slug)}">${escapeHtml(recipe.title)}</a> &middot; by ${escapeHtml(recipe.author)} (<a href="${escapeHtml(recipe.sourceUrl)}">Kosher.com</a>)</li>`).join("")}</ul><p>Recipes &amp; stories from <a href="https://www.kosher.com/">Kosher.com</a>.</p>`),
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Recipes",
      description: recipesIndexDescription(),
      url: `${siteUrl}/recipes`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: recipePages.map((recipe, index) => ({ "@type": "ListItem", position: index + 1, name: recipe.title, url: `${siteUrl}/recipes/${recipe.slug}` })),
      },
    },
  }];
  for (const recipe of recipePages) {
    routes.push({
      path: `/recipes/${recipe.slug}`,
      title: `${recipe.title} | Tuscanini Recipes`,
      description: recipeDescription(recipe),
      type: "website",
      image: recipe.image,
      content: simpleContent(recipe.title, recipeDescription(recipe), `<p>Recipe from <a href="https://www.kosher.com/">Kosher.com</a> by ${escapeHtml(recipe.author)}. <a href="${escapeHtml(recipe.sourceUrl)}">View this recipe on Kosher.com</a>.</p><h2>Ingredients</h2><ul>${recipe.ingredients.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><h2>Method</h2><ol>${recipe.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol><h2>Tuscanini products in this recipe</h2><ul class="pr-grid">${recipe.products.map((id) => productsById.get(id)).filter((product): product is Product => Boolean(product)).map(productCardHtml).join("")}</ul>`),
      structuredData: recipeStructuredData(recipe, siteUrl, imagesFor(recipe.products)),
    });
  }
  return routes;
}

const buildCatalog = await readBuildCatalog();
const routes = catalogRoutes(buildCatalog);
routes.push(...recipeRoutes(buildCatalog));
routes.push(about);
routes.push({ path: '/terms', title: 'Terms & Conditions | Tuscanini', description: 'Terms and conditions for the Tuscanini website, including our Amazon Associates disclosure.', type: 'website', content: simpleContent('Terms & Conditions', 'Terms and conditions for the Tuscanini website, including our Amazon Associates disclosure.'), structuredData: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Terms & Conditions', url: `${siteUrl}/terms` } });
routes.push({ path: '/products', title: 'Explore Our Products | Tuscanini', description: 'Browse Tuscanini pasta, sauces, olive oils, drinks, snacks, and frozen foods.', type: 'website', content: productsContent(buildCatalog), structuredData: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Explore Our Products', url: `${siteUrl}/products` } });

home.content = homeContent(buildCatalog);
await writeFile(resolve("dist/index.html"), renderRouteHtml(baseHtml, home), "utf8");
const writtenPaths = new Set<string>(["/"]);
for (const route of routes) {
  const segments = route.path.split("/").filter(Boolean);
  if (segments.some((segment) => !safeSlug(segment))) continue;
  const outputPath = resolve("dist", `${segments.join("/")}.html`);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderRouteHtml(baseHtml, route), "utf8");
  writtenPaths.add(route.path);
}

// The deployed sitemap must use the same catalog snapshot as these route files,
// even if CMS publication or availability changes after prebuild.
await writeFile(resolve("dist/sitemap.xml"), renderSitemap(writtenPaths, siteUrl), "utf8");
console.log(`Generated ${writtenPaths.size} clean-URL route HTML files and matching sitemap.`);
