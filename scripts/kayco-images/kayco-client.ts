export const KAYCO_ORIGIN = "https://www.kayco.com";
export const KAYCO_USER_AGENT =
  "TuscaniniSiteImageAudit/1.0 (+https://tuscanini-site.vercel.app)";

const KAYCO_API_ROOT = `${KAYCO_ORIGIN}/wp-json/wp/v2`;
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 500;
const DEFAULT_PER_PAGE = 100;
const MAX_WORDPRESS_PAGES = 1_000;
const MAX_REDIRECTS = 5;
const MAX_JSON_BYTES = 32 * 1024 * 1024;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

export type KaycoUrlPurpose = "api" | "brand" | "product" | "media";

export interface KaycoBrandRecord {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  pageUrl: string;
}

export interface KaycoImageSize {
  name: string;
  sourceUrl: string | null;
  filename: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  mimeType: string | null;
}

export interface KaycoImageMetadata {
  id: number;
  sourceUrl: string;
  filename: string;
  filePath: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  mediaType: string;
  mimeType: string | null;
  altText: string;
  title: string;
  caption: string;
  sizes: Record<string, KaycoImageSize>;
  placeholder: boolean;
}

export interface KaycoProductRecord {
  id: number;
  skuClue: string | null;
  title: string;
  slug: string;
  pageUrl: string;
  image: KaycoImageMetadata | null;
  placeholder: boolean;
}

export interface KaycoCatalogSnapshot {
  brand: KaycoBrandRecord;
  products: KaycoProductRecord[];
}

export interface KaycoClientOptions {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  maxAttempts?: number;
  retryDelayMs?: number;
  perPage?: number;
  authorizeUrl?: (url: URL) => void | Promise<void>;
}

interface ResolvedClientOptions {
  fetchImpl: typeof fetch;
  timeoutMs: number;
  maxAttempts: number;
  retryDelayMs: number;
  perPage: number;
  authorizeUrl?: (url: URL) => void | Promise<void>;
}

interface JsonResponse {
  body: unknown;
  headers: Headers;
}

type UnknownRecord = Record<string, unknown>;

class KaycoRedirectError extends Error {}
class KaycoAuthorizationError extends Error {}

const namedHtmlEntities: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  hellip: "…",
  laquo: "«",
  ldquo: "“",
  lsquo: "‘",
  lt: "<",
  mdash: "—",
  nbsp: " ",
  ndash: "–",
  quot: '"',
  raquo: "»",
  rdquo: "”",
  rsquo: "’",
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Kayco ${label} must be a non-empty string.`);
  }
  return value.trim();
}

function asPositiveInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Kayco ${label} must be a positive integer.`);
  }
  return value;
}

function asOptionalNonNegativeInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value
    : null;
}

function renderedText(value: unknown, label: string): string {
  if (!isRecord(value)) throw new Error(`Kayco ${label} is missing its rendered text.`);
  const rendered = asNonEmptyString(value.rendered, `${label}.rendered`);
  return decodeHtmlEntities(rendered.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function optionalRenderedText(value: unknown): string {
  if (!isRecord(value) || typeof value.rendered !== "string") return "";
  return decodeHtmlEntities(value.rendered.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function decodeSafePathname(url: URL): string {
  let pathname: string;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    throw new Error(`Kayco URL contains an invalid encoded path: ${url.href}`);
  }

  if (pathname.includes("\\") || pathname.includes("\0")) {
    throw new Error(`Kayco URL contains an unsafe path: ${url.href}`);
  }
  if (pathname.split("/").some((segment) => segment === "." || segment === "..")) {
    throw new Error(`Kayco URL contains path traversal: ${url.href}`);
  }
  return pathname;
}

/** Validate a Kayco-owned URL before requesting it or retaining it as source metadata. */
export function validateKaycoUrl(value: string, purpose: KaycoUrlPurpose): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid Kayco ${purpose} URL: ${value}`);
  }

  if (
    url.protocol !== "https:" ||
    url.hostname.toLowerCase() !== "www.kayco.com" ||
    url.port ||
    url.username ||
    url.password ||
    url.hash
  ) {
    throw new Error(`Kayco ${purpose} URL must use the canonical HTTPS origin: ${value}`);
  }

  const pathname = decodeSafePathname(url);
  switch (purpose) {
    case "api":
      if (pathname !== "/wp-json/wp/v2/brands" && pathname !== "/wp-json/wp/v2/product") {
        throw new Error(`Kayco API URL uses an unexpected path: ${value}`);
      }
      break;
    case "brand":
      if (!/^\/brands\/[a-z0-9][a-z0-9-]*\/$/.test(pathname) || url.search) {
        throw new Error(`Kayco brand URL uses an unexpected path: ${value}`);
      }
      break;
    case "product":
      if (!/^\/product\/[a-z0-9][a-z0-9-]*\/$/.test(pathname) || url.search) {
        throw new Error(`Kayco product URL uses an unexpected path: ${value}`);
      }
      break;
    case "media":
      if (!pathname.startsWith("/wp-content/uploads/") || pathname.endsWith("/") || url.search) {
        throw new Error(`Kayco media URL uses an unexpected path: ${value}`);
      }
      break;
  }

  return url;
}

/** Decode the entity forms used by WordPress titles without requiring a browser DOM. */
export function decodeHtmlEntities(value: string): string {
  return value.replace(/&(?:#(x[0-9a-f]+|\d+)|([a-z]+));/gi, (entity, numeric, named) => {
    if (numeric) {
      const codePoint = numeric[0].toLowerCase() === "x"
        ? Number.parseInt(numeric.slice(1), 16)
        : Number.parseInt(numeric, 10);
      if (
        !Number.isInteger(codePoint) ||
        codePoint <= 0 ||
        codePoint > 0x10ffff ||
        (codePoint >= 0xd800 && codePoint <= 0xdfff)
      ) {
        return entity;
      }
      return String.fromCodePoint(codePoint);
    }

    return namedHtmlEntities[String(named).toLowerCase()] ?? entity;
  });
}

/** Extract Kayco's SKU-looking numeric prefix from an original media filename. */
export function extractSkuClue(filename: string | null | undefined): string | null {
  if (!filename) return null;
  const basename = filename.split(/[\\/]/).at(-1) ?? "";
  const withoutExtension = basename.replace(/\.[a-z0-9]{2,8}$/i, "");
  return withoutExtension.match(/(?:^|\D)(\d{5,14})(?=\D|$)/)?.[1] ?? null;
}

/** Identify Kayco/WordPress stand-ins that should never replace a real catalog image. */
export function isPlaceholderImage(value: string | null | undefined): boolean {
  if (!value) return true;
  const filename = value.split(/[\\/]/).at(-1)?.toLowerCase() ?? "";
  return /(?:coming[-_ ]?soon|pack[-_ ]?shot[-_ ]?pending|(?:^|[-_ ])pending(?:[-_ .]|$)|placeholder|no[-_ ]?(?:image|photo)|image[-_ ]?(?:missing|unavailable))/.test(
    filename,
  );
}

function safeMediaFilename(value: unknown, sourceUrl: URL): { filePath: string | null; filename: string } {
  const rawPath = typeof value === "string" && value.trim() ? value.trim() : null;
  if (rawPath) {
    if (rawPath.includes("\\") || rawPath.split("/").some((part) => part === "." || part === "..")) {
      throw new Error(`Kayco media metadata contains an unsafe file path: ${rawPath}`);
    }
  }

  const sourceFilename = decodeSafePathname(sourceUrl).split("/").at(-1) ?? "";
  const filename = rawPath?.split("/").at(-1) || sourceFilename;
  if (!filename || filename === "." || filename === "..") {
    throw new Error(`Kayco media metadata has no usable filename: ${sourceUrl.href}`);
  }

  return { filePath: rawPath, filename };
}

function parseImageSize(name: string, value: unknown): KaycoImageSize {
  if (!isRecord(value)) throw new Error(`Kayco media size ${name} is not an object.`);

  const sourceUrl = typeof value.source_url === "string" && value.source_url.trim()
    ? validateKaycoUrl(value.source_url.trim(), "media")
    : null;
  const filename = typeof value.file === "string" && value.file.trim()
    ? value.file.trim().split(/[\\/]/).at(-1) ?? null
    : sourceUrl
      ? decodeSafePathname(sourceUrl).split("/").at(-1) ?? null
      : null;

  return {
    name,
    sourceUrl: sourceUrl?.href ?? null,
    filename,
    width: asOptionalNonNegativeInteger(value.width),
    height: asOptionalNonNegativeInteger(value.height),
    fileSize: asOptionalNonNegativeInteger(value.filesize),
    mimeType: typeof value.mime_type === "string" && value.mime_type.trim()
      ? value.mime_type.trim().toLowerCase()
      : null,
  };
}

/** Parse one embedded WordPress featured-media record into stable image metadata. */
export function parseKaycoImage(value: unknown): KaycoImageMetadata {
  if (!isRecord(value)) throw new Error("Kayco featured media is not an object.");

  const id = asPositiveInteger(value.id, "featured media id");
  const sourceUrl = validateKaycoUrl(asNonEmptyString(value.source_url, "media source_url"), "media");
  const mediaDetails = isRecord(value.media_details) ? value.media_details : {};
  const { filePath, filename } = safeMediaFilename(mediaDetails.file, sourceUrl);
  const mediaType = typeof value.media_type === "string" && value.media_type.trim()
    ? value.media_type.trim().toLowerCase()
    : "image";
  if (mediaType !== "image") throw new Error(`Kayco featured media ${id} is not an image.`);

  const sizes: Record<string, KaycoImageSize> = {};
  if (isRecord(mediaDetails.sizes)) {
    for (const [name, size] of Object.entries(mediaDetails.sizes)) {
      sizes[name] = parseImageSize(name, size);
    }
  }

  const placeholder = isPlaceholderImage(filename) || isPlaceholderImage(sourceUrl.pathname);
  return {
    id,
    sourceUrl: sourceUrl.href,
    filename,
    filePath,
    width: asOptionalNonNegativeInteger(mediaDetails.width),
    height: asOptionalNonNegativeInteger(mediaDetails.height),
    fileSize: asOptionalNonNegativeInteger(mediaDetails.filesize),
    mediaType,
    mimeType: typeof value.mime_type === "string" && value.mime_type.trim()
      ? value.mime_type.trim().toLowerCase()
      : null,
    altText: typeof value.alt_text === "string" ? decodeHtmlEntities(value.alt_text).trim() : "",
    title: optionalRenderedText(value.title),
    caption: optionalRenderedText(value.caption),
    sizes,
    placeholder,
  };
}

function embeddedFeaturedMedia(value: UnknownRecord): unknown | null {
  if (!isRecord(value._embedded)) return null;
  const media = value._embedded["wp:featuredmedia"];
  if (!Array.isArray(media)) return null;
  return media.find((candidate) => isRecord(candidate) && typeof candidate.source_url === "string") ?? null;
}

/** Parse one WordPress product response, including its embedded original featured image. */
export function parseKaycoProduct(value: unknown): KaycoProductRecord {
  if (!isRecord(value)) throw new Error("Kayco product is not an object.");

  const id = asPositiveInteger(value.id, "product id");
  const slug = asNonEmptyString(value.slug, `product ${id} slug`).toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new Error(`Kayco product ${id} has an unsafe slug: ${slug}`);
  }

  const pageUrl = validateKaycoUrl(asNonEmptyString(value.link, `product ${id} link`), "product");
  if (pageUrl.pathname !== `/product/${slug}/`) {
    throw new Error(`Kayco product ${id} link does not match its slug.`);
  }

  const featuredMediaId = asOptionalNonNegativeInteger(value.featured_media) ?? 0;
  const embeddedMedia = embeddedFeaturedMedia(value);
  const image = embeddedMedia ? parseKaycoImage(embeddedMedia) : null;
  if (featuredMediaId > 0 && image && image.id !== featuredMediaId) {
    throw new Error(`Kayco product ${id} embedded the wrong featured media record.`);
  }

  const placeholder = image?.placeholder ?? true;
  return {
    id,
    skuClue: placeholder ? null : extractSkuClue(image?.filename),
    title: renderedText(value.title, `product ${id} title`),
    slug,
    pageUrl: pageUrl.href,
    image,
    placeholder,
  };
}

/** Parse a WordPress product page. Exported separately so fixtures can test it without I/O. */
export function parseKaycoProductPage(value: unknown): KaycoProductRecord[] {
  if (!Array.isArray(value)) throw new Error("Kayco product response must be an array.");
  return value.map(parseKaycoProduct);
}

function parseBrandTerm(value: unknown): KaycoBrandRecord {
  if (!isRecord(value)) throw new Error("Kayco brand term is not an object.");
  const id = asPositiveInteger(value.id, "brand id");
  const slug = asNonEmptyString(value.slug, `brand ${id} slug`).toLowerCase();
  const name = decodeHtmlEntities(asNonEmptyString(value.name, `brand ${id} name`));
  if (value.taxonomy !== undefined && value.taxonomy !== "brands") {
    throw new Error(`Kayco brand ${id} came from an unexpected taxonomy.`);
  }
  if (slug !== "tuscanini" || name.toLowerCase() !== "tuscanini") {
    throw new Error(`Kayco brand ${id} is not the Tuscanini term.`);
  }

  const pageUrl = validateKaycoUrl(asNonEmptyString(value.link, `brand ${id} link`), "brand");
  if (pageUrl.pathname !== "/brands/tuscanini/") {
    throw new Error("Kayco's Tuscanini brand link uses an unexpected path.");
  }

  return {
    id,
    name,
    slug,
    productCount: asOptionalNonNegativeInteger(value.count) ?? 0,
    pageUrl: pageUrl.href,
  };
}

/** Locate the exact Tuscanini term in a WordPress brand-search response. */
export function parseTuscaniniBrandResponse(value: unknown): KaycoBrandRecord {
  if (!Array.isArray(value)) throw new Error("Kayco brand response must be an array.");
  const matches = value.filter((candidate) => {
    if (!isRecord(candidate)) return false;
    const slug = typeof candidate.slug === "string" ? candidate.slug.trim().toLowerCase() : "";
    const name = typeof candidate.name === "string"
      ? decodeHtmlEntities(candidate.name).trim().toLowerCase()
      : "";
    return slug === "tuscanini" || name === "tuscanini";
  });
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one Tuscanini brand term; received ${matches.length}.`);
  }
  return parseBrandTerm(matches[0]);
}

/** Parse WordPress pagination headers with a defensive upper bound. */
export function parseWordPressPageCount(headers: Pick<Headers, "get">): number {
  const raw = headers.get("x-wp-totalpages");
  if (!raw || !/^\d+$/.test(raw.trim())) {
    throw new Error("Kayco response is missing a valid X-WP-TotalPages header.");
  }
  const totalPages = Number(raw);
  if (!Number.isSafeInteger(totalPages) || totalPages < 1 || totalPages > MAX_WORDPRESS_PAGES) {
    throw new Error(`Kayco returned an unsafe page count: ${raw}`);
  }
  return totalPages;
}

function parseWordPressTotal(headers: Pick<Headers, "get">): number | null {
  const raw = headers.get("x-wp-total");
  if (raw === null) return null;
  if (!/^\d+$/.test(raw.trim())) throw new Error(`Kayco returned an invalid total count: ${raw}`);
  const total = Number(raw);
  return Number.isSafeInteger(total) && total >= 0 ? total : null;
}

function boundedInteger(value: number | undefined, fallback: number, min: number, max: number, label: string): number {
  const resolved = value ?? fallback;
  if (!Number.isSafeInteger(resolved) || resolved < min || resolved > max) {
    throw new Error(`${label} must be an integer between ${min} and ${max}.`);
  }
  return resolved;
}

function resolveOptions(options: KaycoClientOptions): ResolvedClientOptions {
  return {
    fetchImpl: options.fetchImpl ?? fetch,
    timeoutMs: boundedInteger(options.timeoutMs, DEFAULT_TIMEOUT_MS, 1, 120_000, "timeoutMs"),
    maxAttempts: boundedInteger(options.maxAttempts, DEFAULT_MAX_ATTEMPTS, 1, 10, "maxAttempts"),
    retryDelayMs: boundedInteger(options.retryDelayMs, DEFAULT_RETRY_DELAY_MS, 0, 30_000, "retryDelayMs"),
    perPage: boundedInteger(options.perPage, DEFAULT_PER_PAGE, 1, 100, "perPage"),
    authorizeUrl: options.authorizeUrl,
  };
}

function retryableStatus(status: number): boolean {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function cancelResponseBody(response: Response): Promise<void> {
  try {
    await response.body?.cancel();
  } catch {
    // The response is being discarded, so a cancellation failure is not actionable.
  }
}

async function readBoundedJsonBody(response: Response): Promise<unknown> {
  const declaredLengthHeader = response.headers.get("content-length");
  const declaredLength = declaredLengthHeader === null ? null : Number(declaredLengthHeader);
  if (declaredLength !== null && Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BYTES) {
    await cancelResponseBody(response);
    throw new Error(`Kayco API response exceeds the ${MAX_JSON_BYTES}-byte limit.`);
  }
  if (!response.body) throw new Error("Kayco API response contained no body.");

  const chunks: Uint8Array[] = [];
  const reader = response.body.getReader();
  let byteCount = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      byteCount += value.byteLength;
      if (byteCount > MAX_JSON_BYTES) {
        try {
          await reader.cancel();
        } catch {
          // Preserve the response-size error if cancellation also fails.
        }
        throw new Error(`Kayco API response exceeds the ${MAX_JSON_BYTES}-byte limit.`);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const merged = new Uint8Array(byteCount);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const text = new TextDecoder("utf-8", { fatal: true }).decode(merged).replace(/^\uFEFF/, "");
  return JSON.parse(text) as unknown;
}

function resolveApiRedirect(location: string | null, currentUrl: URL): URL {
  if (!location) throw new KaycoRedirectError("Kayco API redirect is missing a Location header.");

  let target: URL;
  try {
    target = new URL(location, currentUrl);
  } catch (error) {
    throw new KaycoRedirectError("Kayco API redirect has an invalid Location header.", {
      cause: error,
    });
  }

  try {
    return validateKaycoUrl(target.href, "api");
  } catch (error) {
    throw new KaycoRedirectError(`Refusing unsafe Kayco API redirect: ${target.href}`, {
      cause: error,
    });
  }
}

async function authorizeRequestUrl(url: URL, options: ResolvedClientOptions): Promise<void> {
  try {
    await options.authorizeUrl?.(url);
  } catch (error) {
    throw new KaycoAuthorizationError(`Kayco API request was not authorized: ${url.pathname}${url.search}`, {
      cause: error,
    });
  }
}

async function requestApiResponse(
  url: URL,
  options: ResolvedClientOptions,
  signal: AbortSignal,
): Promise<Response> {
  let requestUrl = url;

  for (let redirects = 0; ; redirects += 1) {
    await authorizeRequestUrl(requestUrl, options);
    const response = await options.fetchImpl(requestUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": KAYCO_USER_AGENT,
      },
      method: "GET",
      redirect: "manual",
      signal,
    });

    if (response.url) {
      let returnedUrl: URL;
      try {
        returnedUrl = validateKaycoUrl(response.url, "api");
      } catch (error) {
        await cancelResponseBody(response);
        throw new KaycoRedirectError("Kayco fetch returned an unsafe response URL.", { cause: error });
      }
      if (returnedUrl.href !== requestUrl.href) {
        await cancelResponseBody(response);
        throw new KaycoRedirectError("Kayco fetch followed a redirect outside the validated redirect loop.");
      }
    }

    if (!REDIRECT_STATUSES.has(response.status)) return response;

    if (redirects >= MAX_REDIRECTS) {
      await cancelResponseBody(response);
      throw new KaycoRedirectError(`Kayco API exceeded the ${MAX_REDIRECTS}-redirect limit.`);
    }

    const location = response.headers.get("location");
    await cancelResponseBody(response);
    requestUrl = resolveApiRedirect(location, requestUrl);
  }
}

async function requestJson(urlValue: string, options: ResolvedClientOptions): Promise<JsonResponse> {
  const url = validateKaycoUrl(urlValue, "api");
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs);
    let response: Response;
    try {
      response = await requestApiResponse(url, options, controller.signal);
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof KaycoRedirectError || error instanceof KaycoAuthorizationError) throw error;
      lastError = error;
      if (attempt === options.maxAttempts) break;
      await delay(options.retryDelayMs * attempt);
      continue;
    }

    try {
      if (response.url) validateKaycoUrl(response.url, "api");
      if (!response.ok) {
        await cancelResponseBody(response);
        const error = new Error(`Kayco API returned ${response.status} for ${url.pathname}.`);
        if (!retryableStatus(response.status) || attempt === options.maxAttempts) throw error;
        lastError = error;
        clearTimeout(timeout);
        await delay(options.retryDelayMs * attempt);
        continue;
      }

      let body: unknown;
      try {
        body = await readBoundedJsonBody(response);
      } catch (error) {
        throw new Error(`Kayco API returned invalid JSON for ${url.pathname}.`, { cause: error });
      }
      return { body, headers: response.headers };
    } finally {
      // Keep the timeout active until the response body has been consumed.
      clearTimeout(timeout);
    }
  }

  throw new Error(`Kayco API request failed after ${options.maxAttempts} attempts: ${url.pathname}`, {
    cause: lastError,
  });
}

async function fetchTuscaniniBrand(options: ResolvedClientOptions): Promise<KaycoBrandRecord> {
  const params = new URLSearchParams({
    _fields: "id,name,slug,count,link,taxonomy",
    per_page: "100",
    search: "Tuscanini",
    slug: "tuscanini",
  });
  const response = await requestJson(`${KAYCO_API_ROOT}/brands?${params}`, options);
  return parseTuscaniniBrandResponse(response.body);
}

async function fetchProductPage(
  brandId: number,
  page: number,
  options: ResolvedClientOptions,
): Promise<JsonResponse> {
  const params = new URLSearchParams({
    _embed: "wp:featuredmedia",
    brands: String(brandId),
    order: "asc",
    orderby: "id",
    page: String(page),
    per_page: String(options.perPage),
  });
  return requestJson(`${KAYCO_API_ROOT}/product?${params}`, options);
}

/** Discover the live Tuscanini brand term and collect every public product page. */
export async function fetchTuscaniniCatalog(
  clientOptions: KaycoClientOptions = {},
): Promise<KaycoCatalogSnapshot> {
  const options = resolveOptions(clientOptions);
  const brand = await fetchTuscaniniBrand(options);
  const firstPage = await fetchProductPage(brand.id, 1, options);
  const pageCount = parseWordPressPageCount(firstPage.headers);
  const expectedTotal = parseWordPressTotal(firstPage.headers);
  const products = parseKaycoProductPage(firstPage.body);

  for (let page = 2; page <= pageCount; page += 1) {
    const response = await fetchProductPage(brand.id, page, options);
    products.push(...parseKaycoProductPage(response.body));
  }

  const ids = new Set<number>();
  for (const product of products) {
    if (ids.has(product.id)) throw new Error(`Kayco returned duplicate product id ${product.id}.`);
    ids.add(product.id);
  }
  if (expectedTotal !== null && products.length !== expectedTotal) {
    throw new Error(`Kayco advertised ${expectedTotal} products but returned ${products.length}.`);
  }

  return { brand, products };
}

/** Convenience wrapper for consumers that only need normalized product records. */
export async function fetchTuscaniniProducts(
  options: KaycoClientOptions = {},
): Promise<KaycoProductRecord[]> {
  return (await fetchTuscaniniCatalog(options)).products;
}
