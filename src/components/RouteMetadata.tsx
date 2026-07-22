import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCmsData } from "../data/cms";
import { getCategoryBySlug, getCategoryForProduct, getProductById } from "../data/products";

const defaultSiteUrl = "https://tuscanini-site.vercel.app";
const defaultBrand = "Tuscanini";
const defaultDescription = "Taste Tuscanini. Know Italy.";

interface Metadata {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "product";
  robots?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

interface RouteMetadataProps {
  contentVersion: number;
}

function setMeta(selector: string, attributes: Record<string, string>): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.append(element);
  }
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
}

function absoluteUrl(value: string, siteUrl: string): string {
  try {
    return new URL(value, siteUrl).toString();
  } catch {
    return siteUrl;
  }
}

export default function RouteMetadata({ contentVersion }: RouteMetadataProps) {
  const location = useLocation();
  const settings = getCmsData("site_settings", "general");
  const siteTitle = typeof settings?.site_title === "string" && settings.site_title.trim()
    ? settings.site_title.trim()
    : defaultBrand;
  const tagline = typeof settings?.tagline === "string" && settings.tagline.trim()
    ? settings.tagline.trim()
    : defaultDescription;
  const siteUrl = (import.meta.env.VITE_SITE_URL?.trim() || defaultSiteUrl).replace(/\/+$/, "");

  useEffect(() => {
    const pathname = location.pathname.replace(/\/+$/, "") || "/";
    let metadata: Metadata;

    if (pathname === "/") {
      const page = getCmsData("page", "home");
      const headline = typeof page?.headline === "string" ? page.headline : "Authentic Italian Excellence";
      const body = typeof page?.body === "string" ? page.body : tagline;
      const image = typeof page?.hero_image === "string" && page.hero_image
        ? page.hero_image
        : "/assets/Photos/backgrounds/italian-coast.jpg";
      metadata = {
        title: `${siteTitle} | ${headline}`,
        description: body,
        image,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteTitle,
          url: siteUrl,
          logo: absoluteUrl("/favicon.svg", siteUrl),
          sameAs: [
            "https://www.instagram.com/tuscaninifoods/",
            "https://www.youtube.com/@TuscaniniFoods",
          ],
        },
      };
    } else if (pathname === "/about") {
      const page = getCmsData("page", "about");
      metadata = {
        title: `${typeof page?.headline === "string" ? page.headline : "Our Story"} | ${siteTitle}`,
        description: typeof page?.body === "string"
          ? page.body
          : "Discover Tuscanini's commitment to authentic Italian ingredients, regional craft, and family tradition.",
      };
    } else if (pathname.startsWith("/category/")) {
      const slug = decodeURIComponent(pathname.slice("/category/".length));
      const category = getCategoryBySlug(slug);
      metadata = category
        ? {
            title: `${category.name} | ${siteTitle}`,
            description: category.description || category.tagline,
            image: category.heroImage,
            structuredData: {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: category.name,
              description: category.description || category.tagline,
              url: `${siteUrl}${pathname}`,
            },
          }
        : { title: `Category Not Found | ${siteTitle}`, description: tagline, robots: "noindex, nofollow" };
    } else if (pathname.startsWith("/product/")) {
      const id = decodeURIComponent(pathname.slice("/product/".length));
      const product = getProductById(id);
      const category = product ? getCategoryForProduct(product.id) : undefined;
      metadata = product
        ? {
            title: `${product.name} | ${siteTitle}`,
            description: product.description,
            image: product.image,
            type: "product",
            structuredData: [
              {
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.name,
                description: product.description,
                image: product.image ? [absoluteUrl(product.image, siteUrl)] : undefined,
                category: category?.name,
                brand: { "@type": "Brand", name: siteTitle },
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                  ...(category
                    ? [{ "@type": "ListItem", position: 2, name: category.name, item: `${siteUrl}/category/${category.slug}` }]
                    : []),
                  { "@type": "ListItem", position: category ? 3 : 2, name: product.name, item: `${siteUrl}${pathname}` },
                ],
              },
            ],
          }
        : { title: `Product Not Found | ${siteTitle}`, description: tagline, robots: "noindex, nofollow" };
    } else {
      metadata = {
        title: `Page Not Found | ${siteTitle}`,
        description: "The page you requested could not be found.",
        robots: "noindex, nofollow",
      };
    }

    const canonical = `${siteUrl}${pathname === "/" ? "/" : pathname}`;
    const socialImage = absoluteUrl(metadata.image || "/assets/Photos/backgrounds/italian-coast.jpg", siteUrl);
    document.title = metadata.title;
    setMeta('meta[name="description"]', { name: "description", content: metadata.description });
    setMeta('meta[name="robots"]', { name: "robots", content: metadata.robots || "index, follow" });
    setMeta('meta[property="og:title"]', { property: "og:title", content: metadata.title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: metadata.description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: metadata.type || "website" });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    setMeta('meta[property="og:image"]', { property: "og:image", content: socialImage });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: metadata.title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: metadata.description });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: socialImage });

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.append(canonicalLink);
    }
    canonicalLink.href = canonical;

    let structuredData = document.getElementById("route-structured-data") as HTMLScriptElement | null;
    if (metadata.structuredData) {
      if (!structuredData) {
        structuredData = document.createElement("script");
        structuredData.id = "route-structured-data";
        structuredData.type = "application/ld+json";
        document.head.append(structuredData);
      }
      structuredData.text = JSON.stringify(metadata.structuredData);
    } else {
      structuredData?.remove();
    }
  }, [contentVersion, location.pathname, siteTitle, siteUrl, tagline]);

  return null;
}
