import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import sharp from "sharp";
import { validateKaycoUrl } from "./kayco-client";

export interface StageableKaycoImage {
  id: number;
  skuClue: string | null;
  title: string;
  image: {
    sourceUrl: string;
    filename: string;
    fileSize: number | null;
  };
  placeholder: boolean;
}

export interface StagedImage {
  kaycoId: number;
  sku: string | null;
  title: string;
  sourceUrl: string;
  localFilename: string | null;
  bytes: number;
  width: number | null;
  height: number | null;
  sha256: string | null;
  status: "downloaded" | "cached" | "placeholder" | "failed";
  error?: string;
}

export type StageUrlAuthorizer = (url: URL) => void | Promise<void>;

const userAgent = "TuscaniniSiteImageAudit/1.0 (+https://tuscanini-site.vercel.app)";
const maxImageBytes = 32 * 1024 * 1024;
const maxRedirects = 5;
const redirectStatuses = new Set([301, 302, 303, 307, 308]);

class ImageRedirectError extends Error {}
class ImageAuthorizationError extends Error {}

function assertAllowedImageUrl(value: string): URL {
  return validateKaycoUrl(value, "media");
}

function outputFilename(product: StageableKaycoImage): string {
  const url = assertAllowedImageUrl(product.image.sourceUrl);
  const extension = extname(url.pathname).toLowerCase() || ".img";
  const identifier = product.skuClue ?? `kayco-${product.id}`;
  return `${identifier}--${product.id}${extension}`;
}

async function cancelResponseBody(response: Response): Promise<void> {
  try {
    await response.body?.cancel();
  } catch {
    // The response is being discarded, so a cancellation failure is not actionable.
  }
}

function resolveImageRedirect(location: string | null, currentUrl: URL): URL {
  if (!location) throw new ImageRedirectError("Kayco image redirect is missing a Location header");

  let target: URL;
  try {
    target = new URL(location, currentUrl);
  } catch (error) {
    throw new ImageRedirectError("Kayco image redirect has an invalid Location header", {
      cause: error,
    });
  }

  try {
    return assertAllowedImageUrl(target.href);
  } catch (error) {
    throw new ImageRedirectError(`Refusing unsafe Kayco image redirect: ${target.href}`, {
      cause: error,
    });
  }
}

async function authorizeImageUrl(url: URL, authorizeUrl?: StageUrlAuthorizer): Promise<void> {
  try {
    await authorizeUrl?.(url);
  } catch (error) {
    throw new ImageAuthorizationError(`Kayco image request was not authorized: ${url.pathname}`, {
      cause: error,
    });
  }
}

async function requestImage(url: URL, authorizeUrl?: StageUrlAuthorizer): Promise<Response> {
  let requestUrl = url;

  for (let redirects = 0; ; redirects += 1) {
    await authorizeImageUrl(requestUrl, authorizeUrl);
    const response = await fetch(requestUrl, {
      headers: { Accept: "image/*", "User-Agent": userAgent },
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
    });

    if (response.url) {
      let returnedUrl: URL;
      try {
        returnedUrl = assertAllowedImageUrl(response.url);
      } catch (error) {
        await cancelResponseBody(response);
        throw new ImageRedirectError("Image fetch returned an unsafe response URL", { cause: error });
      }
      if (returnedUrl.href !== requestUrl.href) {
        await cancelResponseBody(response);
        throw new ImageRedirectError("Image fetch followed a redirect outside the validated redirect loop");
      }
    }

    if (!redirectStatuses.has(response.status)) return response;

    if (redirects >= maxRedirects) {
      await cancelResponseBody(response);
      throw new ImageRedirectError(`Kayco image exceeded the ${maxRedirects}-redirect limit`);
    }

    const location = response.headers.get("location");
    await cancelResponseBody(response);
    requestUrl = resolveImageRedirect(location, requestUrl);
  }
}

async function readBoundedImageBody(response: Response): Promise<Buffer> {
  if (!response.body) throw new Error("Image response contained no body");

  const chunks: Buffer[] = [];
  const reader = response.body.getReader();
  let byteCount = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      byteCount += value.byteLength;
      if (byteCount > maxImageBytes) {
        try {
          await reader.cancel();
        } catch {
          // Preserve the staging-limit error if stream cancellation also fails.
        }
        throw new Error(`Image exceeds ${maxImageBytes} byte staging limit`);
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(chunks, byteCount);
}

async function fetchImage(
  url: URL,
  authorizeUrl?: StageUrlAuthorizer,
  attempt = 1,
): Promise<{ bytes: Buffer; contentType: string }> {
  let response: Response;
  try {
    response = await requestImage(url, authorizeUrl);
  } catch (error) {
    if (error instanceof ImageRedirectError || error instanceof ImageAuthorizationError) throw error;
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      return fetchImage(url, authorizeUrl, attempt + 1);
    }
    throw error;
  }

  if (!response.ok) {
    if ((response.status === 429 || response.status >= 500) && attempt < 3) {
      await cancelResponseBody(response);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
      return fetchImage(url, authorizeUrl, attempt + 1);
    }
    await cancelResponseBody(response);
    throw new Error(`Image request returned ${response.status}`);
  }

  const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() ?? "";
  if (!contentType.startsWith("image/")) {
    await cancelResponseBody(response);
    throw new Error(`Expected image content, received ${contentType || "unknown"}`);
  }

  const declaredLengthHeader = response.headers.get("content-length");
  const declaredLength = declaredLengthHeader === null ? null : Number(declaredLengthHeader);
  if (declaredLength !== null && Number.isFinite(declaredLength) && declaredLength > maxImageBytes) {
    await cancelResponseBody(response);
    throw new Error(`Image exceeds ${maxImageBytes} byte staging limit`);
  }

  const bytes = await readBoundedImageBody(response);
  return { bytes, contentType };
}

async function inspectImage(bytes: Buffer): Promise<{ width: number; height: number; sha256: string }> {
  if (bytes.length > maxImageBytes) throw new Error(`Image exceeds ${maxImageBytes} byte staging limit`);
  const metadata = await sharp(bytes, { failOn: "error" }).metadata();
  if (!metadata.width || !metadata.height) throw new Error("Image decoder returned no dimensions");
  return {
    width: metadata.width,
    height: metadata.height,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

async function stageOne(
  product: StageableKaycoImage,
  outputDir: string,
  authorizeUrl?: StageUrlAuthorizer,
): Promise<StagedImage> {
  if (product.placeholder) {
    return {
      kaycoId: product.id,
      sku: product.skuClue,
      title: product.title,
      sourceUrl: product.image.sourceUrl,
      localFilename: null,
      bytes: 0,
      width: null,
      height: null,
      sha256: null,
      status: "placeholder",
    };
  }

  try {
    const filename = outputFilename(product);
    const outputPath = join(outputDir, filename);
    // A local file's size and dimensions cannot prove which source URL produced it.
    // Until staging has a persisted source/validator manifest, resume always re-downloads.
    const { bytes } = await fetchImage(assertAllowedImageUrl(product.image.sourceUrl), authorizeUrl);
    const inspected = await inspectImage(bytes);

    await writeFile(outputPath, bytes);
    return {
      kaycoId: product.id,
      sku: product.skuClue,
      title: product.title,
      sourceUrl: product.image.sourceUrl,
      localFilename: filename,
      bytes: bytes.length,
      ...inspected,
      status: "downloaded",
    };
  } catch (error) {
    return {
      kaycoId: product.id,
      sku: product.skuClue,
      title: product.title,
      sourceUrl: product.image.sourceUrl,
      localFilename: null,
      bytes: 0,
      width: null,
      height: null,
      sha256: null,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function stageKaycoImages(
  products: StageableKaycoImage[],
  outputDir: string,
  onProgress?: (completed: number, total: number, result: StagedImage) => void,
  authorizeUrl?: StageUrlAuthorizer,
): Promise<StagedImage[]> {
  await mkdir(outputDir, { recursive: true });
  const results: StagedImage[] = [];
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < products.length) {
      const product = products[nextIndex++];
      const result = await stageOne(product, outputDir, authorizeUrl);
      results.push(result);
      onProgress?.(results.length, products.length, result);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  await Promise.all([worker(), worker()]);
  return results.sort((left, right) => left.kaycoId - right.kaycoId);
}
