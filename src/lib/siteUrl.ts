/**
 * The one public address of the site. Every canonical, og:url, sitemap entry and
 * JSON-LD url is built from this, on the server (build scripts) and in the browser.
 *
 * VITE_SITE_URL may override it for previews, but the retired Vercel hostname is
 * ignored on purpose: it 301s to the apex now and must never be published again.
 */
export const CANONICAL_SITE_URL = "https://tuscaninifoods.com";

const retiredHosts = new Set(["tuscanini-site.vercel.app", "www.tuscaninifoods.com"]);

export function resolveSiteUrl(configured?: string | null): string {
  const value = (configured ?? "").trim().replace(/\/+$/, "");
  if (!value) return CANONICAL_SITE_URL;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || retiredHosts.has(url.hostname)) return CANONICAL_SITE_URL;
    return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return CANONICAL_SITE_URL;
  }
}
