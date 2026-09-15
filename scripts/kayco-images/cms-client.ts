export interface CmsProductRecord {
  slug: string;
  sourceId: string;
  title: string;
  description: string;
  categorySlug: string;
  size: string;
  imageUrl: string;
}

export interface CmsCatalogSnapshot {
  apiUrl: string;
  siteKey: "tuscanini";
  products: CmsProductRecord[];
}

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
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : fallback;
}

async function fetchPage(url: string, attempt = 1): Promise<ListResponse> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "TuscaniniSiteImageAudit/1.0 (+https://tuscanini-site.vercel.app)",
      },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      return fetchPage(url, attempt + 1);
    }
    throw error;
  }

  if (!response.ok) {
    if ((response.status === 429 || response.status >= 500) && attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      return fetchPage(url, attempt + 1);
    }
    throw new Error(`Content API returned ${response.status} for ${url}`);
  }

  return (await response.json()) as ListResponse;
}

export async function fetchCmsCatalog(
  configuredApiUrl = process.env.VITE_KAYCO_CONTENT_API_URL || defaultApiUrl,
): Promise<CmsCatalogSnapshot> {
  const apiUrl = configuredApiUrl.replace(/\/+$/, "");
  const products: PublishedContent[] = [];
  const seenCursors = new Set<string>();
  let cursor: string | null = null;
  let pageCount = 0;

  do {
    pageCount += 1;
    if (pageCount > 1_000) throw new Error("Content API pagination exceeded 1,000 pages");
    if (cursor) {
      if (seenCursors.has(cursor)) throw new Error("Content API returned a repeated pagination cursor");
      seenCursors.add(cursor);
    }
    const params = new URLSearchParams({ limit: "100" });
    if (cursor) params.set("cursor", cursor);
    const payload = await fetchPage(`${apiUrl}/sites/tuscanini/content/product?${params}`);
    if (!Array.isArray(payload.data) || !payload.meta || !("nextCursor" in payload.meta)) {
      throw new Error("Content API returned an invalid product list payload");
    }
    products.push(...payload.data);
    const nextCursor = payload.meta.nextCursor;
    if (nextCursor !== null && typeof nextCursor !== "string") {
      throw new Error("Content API returned an invalid pagination cursor");
    }
    cursor = nextCursor;
  } while (cursor);

  const normalizedProducts = products
    .map((product) => ({
      slug: product.slug,
      sourceId: text(product.data, "source_id", product.slug),
      title: product.title,
      description: product.description ?? "",
      categorySlug: text(product.data, "category_slug"),
      size: text(product.data, "size"),
      imageUrl: text(product.data, "image"),
    }))
    .sort((left, right) => left.sourceId.localeCompare(right.sourceId));
  const sourceIds = new Set<string>();
  for (const product of normalizedProducts) {
    if (!product.sourceId) throw new Error(`CMS product ${product.slug} has no stable source_id`);
    if (sourceIds.has(product.sourceId)) throw new Error(`CMS returned duplicate source_id ${product.sourceId}`);
    sourceIds.add(product.sourceId);
  }

  return {
    apiUrl,
    siteKey: "tuscanini",
    products: normalizedProducts,
  };
}
