import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { categories as fallbackCategories } from "../src/data/products";

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

interface RouteHtml {
  path: string;
  title: string;
  description: string;
  type: "website" | "product";
  image?: string;
  structuredData: unknown;
}

const defaultApiUrl = "https://qkatfirzwukmgdrytbue.supabase.co/functions/v1/content-api";
const siteUrl = (process.env.VITE_SITE_URL || "https://tuscanini-site.vercel.app").replace(/\/+$/, "");
const apiUrl = (process.env.VITE_KAYCO_CONTENT_API_URL || defaultApiUrl).replace(/\/+$/, "");
const defaultImage = `${siteUrl}/assets/Photos/backgrounds/italian-coast.jpg`;

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

function text(data: Record<string, unknown>, key: string, fallback = ""): string {
  const value = data[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function safeSlug(value: string): string | null {
  return /^[a-z0-9][a-z0-9-]*$/i.test(value) ? value : null;
}

function absoluteUrl(value: string | undefined): string {
  if (!value) return defaultImage;
  try {
    return new URL(value, `${siteUrl}/`).toString();
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

  const jsonLd = JSON.stringify(route.structuredData).replace(/</g, "\\u003c");
  html = html.replace(
    /<script id="route-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script id="route-structured-data" type="application/ld+json">${jsonLd}</script>`,
  );
  return html;
}

function fallbackRoutes(): RouteHtml[] {
  const routes: RouteHtml[] = [];
  for (const category of fallbackCategories) {
    routes.push({
      path: `/category/${category.slug}`,
      title: `${category.name} | Tuscanini`,
      description: category.description || category.tagline,
      type: "website",
      image: category.heroImage,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: category.name,
        description: category.description || category.tagline,
        url: `${siteUrl}/category/${category.slug}`,
      },
    });
    for (const product of category.products) {
      routes.push({
        path: `/product/${product.id}`,
        title: `${product.name} | Tuscanini`,
        description: product.description,
        type: "product",
        image: product.image,
        structuredData: productStructuredData(product.name, product.description, product.image, product.id, category.name, category.slug),
      });
    }
  }
  return routes;
}

function productStructuredData(
  name: string,
  description: string,
  image: string | undefined,
  id: string,
  categoryName: string,
  categorySlug: string,
): unknown {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      description,
      image: image ? [absoluteUrl(image)] : undefined,
      category: categoryName,
      brand: { "@type": "Brand", name: "Tuscanini" },
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

async function cmsRoutes(): Promise<RouteHtml[]> {
  const [categories, products] = await Promise.all([listAll("category"), listAll("product")]);
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  const routes: RouteHtml[] = [];

  for (const category of categories) {
    if (!safeSlug(category.slug)) continue;
    const description = text(category.data, "body", category.description || text(category.data, "tagline"));
    routes.push({
      path: `/category/${category.slug}`,
      title: `${category.title} | Tuscanini`,
      description,
      type: "website",
      image: text(category.data, "hero_image"),
      structuredData: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: category.title,
        description,
        url: `${siteUrl}/category/${category.slug}`,
      },
    });
  }

  for (const product of products) {
    const id = text(product.data, "source_id", product.slug);
    const categorySlug = text(product.data, "category_slug");
    const category = categoryBySlug.get(categorySlug);
    if (!safeSlug(id) || !category) continue;
    const description = product.description || text(product.data, "body");
    const image = text(product.data, "image");
    routes.push({
      path: `/product/${id}`,
      title: `${product.title} | Tuscanini`,
      description,
      type: "product",
      image,
      structuredData: productStructuredData(product.title, description, image, id, category.title, categorySlug),
    });
  }
  return routes;
}

const baseHtml = await readFile(resolve("dist/index.html"), "utf8");
const home: RouteHtml = {
  path: "/",
  title: "Tuscanini | Authentic Italian Excellence",
  description: "Authentic Italian foods sourced from the heart of Italy.",
  type: "website",
  image: defaultImage,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tuscanini",
    url: `${siteUrl}/`,
    logo: `${siteUrl}/favicon.svg`,
  },
};
const about: RouteHtml = {
  path: "/about",
  title: "Our Story | Tuscanini",
  description: "Discover Tuscanini's commitment to authentic Italian food, regional sourcing, and time-honored craft.",
  type: "website",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Our Story",
    url: `${siteUrl}/about`,
  },
};

let routes: RouteHtml[];
try {
  routes = await cmsRoutes();
} catch (error) {
  console.warn("CMS route generation failed; using the bundled catalog.", error);
  routes = fallbackRoutes();
}
routes.push(about);

await writeFile(resolve("dist/index.html"), renderRouteHtml(baseHtml, home), "utf8");
let written = 1;
for (const route of routes) {
  const segments = route.path.split("/").filter(Boolean);
  if (segments.some((segment) => !safeSlug(segment))) continue;
  const outputPath = resolve("dist", `${segments.join("/")}.html`);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderRouteHtml(baseHtml, route), "utf8");
  written += 1;
}

console.log(`Generated ${written} clean-URL route HTML files.`);
