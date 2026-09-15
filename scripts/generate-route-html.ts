import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Category } from "../src/data/products";
import { readBuildCatalog } from "./load-build-catalog";

interface RouteHtml {
  path: string;
  title: string;
  description: string;
  type: "website" | "product";
  image?: string;
  structuredData: unknown;
}

const siteUrl = (process.env.VITE_SITE_URL || "https://tuscanini-site.vercel.app").replace(/\/+$/, "");
const defaultImage = `${siteUrl}/assets/Photos/backgrounds/italian-coast.jpg`;

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

function catalogRoutes(categories: Category[]): RouteHtml[] {
  const routes: RouteHtml[] = [];
  for (const category of categories) {
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

const routes = catalogRoutes(await readBuildCatalog());
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
