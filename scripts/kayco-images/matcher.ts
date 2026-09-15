const UUID_PATTERN =
  "[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";

const UUID_PREFIX = new RegExp(
  `(^|[/\\\\])${UUID_PATTERN}(?:[-_ ]+|[/\\\\])`,
  "gi",
);
const SKU_PATTERN = /(?<!\d)\d{5,14}(?!\d)/g;
const PLACEHOLDER_PATTERN =
  /(?:^|[/\\_. -])(?:placeholder|no[ _-]?image|image[ _-]?unavailable|pack[ _-]?shot[ _-]?pending|coming[ _-]?soon|pending)(?:$|[/\\_. -])/i;

export interface MatchableCmsProduct {
  title?: string;
  name?: string;
  slug?: string;
  sourceId?: string | null;
  source_id?: string | null;
  sku?: string | number | null;
  image?: unknown;
  data?: unknown;
}

export interface MatchableKaycoProduct {
  title?: string;
  name?: string;
  slug?: string;
  sku?: string | number | null;
  skuClue?: string | null;
  pageUrl?: string;
  image?: unknown;
  placeholder?: boolean;
}

export type MatchMethod = "sku" | "title" | "fuzzy" | "none";
export type MatchStatus = "matched" | "ambiguous" | "suggested" | "unmatched";

export interface MatchSuggestion<TKayco> {
  product: TKayco;
  score: number;
  method: Exclude<MatchMethod, "none">;
  clues: string[];
}

export interface MatchResult<TCms, TKayco> {
  cmsProduct: TCms;
  match: MatchSuggestion<TKayco> | null;
  method: MatchMethod;
  status: MatchStatus;
  suggestions: MatchSuggestion<TKayco>[];
  runnerUp: MatchSuggestion<TKayco> | null;
  confidence: number;
  reason: string;
  requiresReview: true;
  autoPublish: false;
}

export interface MatchOptions {
  /** Minimum score at which the best fuzzy candidate is worth reviewing. */
  fuzzyThreshold?: number;
  /** A best/second-best gap at or below this value is considered ambiguous. */
  runnerUpMargin?: number;
  maxSuggestions?: number;
}

const DEFAULT_OPTIONS: Required<MatchOptions> = {
  fuzzyThreshold: 0.55,
  runnerUpMargin: 0.08,
  maxSuggestions: 3,
};
const IMAGE_SKU_TITLE_MINIMUM = 0.45;
const PACKAGE_SIZE_RELATIVE_TOLERANCE = 0.04;

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function nonEmptyString(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Supabase uploads are commonly named `<uuid>-<original filename>`. Removing
 * that generated prefix prevents UUID fragments from being mistaken for SKUs.
 */
export function stripSupabaseUuidPrefix(value: string): string {
  return value.replace(UUID_PREFIX, "$1");
}

export const stripUuidPrefix = stripSupabaseUuidPrefix;

function flattenValues(value: unknown, target: string[]): void {
  const text = nonEmptyString(value);
  if (text !== null) {
    target.push(text);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) flattenValues(item, target);
    return;
  }
  const record = asRecord(value);
  if (record) {
    for (const item of Object.values(record)) flattenValues(item, target);
  }
}

/** Extract conservative numeric SKU/UPC clues without harvesting UUID chunks. */
export function extractSkuClues(...values: unknown[]): string[] {
  const flattened: string[] = [];
  for (const value of values) flattenValues(value, flattened);

  const clues = new Set<string>();
  for (const value of flattened) {
    const cleaned = stripSupabaseUuidPrefix(decode(value));
    for (const match of cleaned.matchAll(SKU_PATTERN)) clues.add(match[0]);
  }
  return [...clues];
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&nbsp;/gi, " ");
}

/** Canonical form used only for exact-title comparison and fuzzy ranking. */
export function normalizeTitle(value: string): string {
  const withoutUrlParts = decode(value).split(/[?#]/, 1)[0] ?? "";
  return decodeHtmlEntities(stripSupabaseUuidPrefix(withoutUrlParts))
    .replace(/\.(?:avif|gif|jpe?g|png|svg|tiff?|webp)$/i, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[®™©]/g, " ")
    .replace(SKU_PATTERN, " ")
    .toLowerCase()
    .replace(/^\s*(?:tuscanini|kayco)\b[\s:|\-–—]*/i, "")
    .replace(/&|\+/g, " and ")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function isPlaceholderImage(value: unknown): boolean {
  const image = nonEmptyString(value);
  return image === null || PLACEHOLDER_PATTERN.test(decode(image));
}

function fieldValues(record: Record<string, unknown>, keys: readonly string[]): unknown[] {
  const values = keys.map((key) => record[key]);
  const data = asRecord(record.data);
  if (data) values.push(...keys.map((key) => data[key]));
  return values;
}

function productTitle(product: unknown): string {
  const record = asRecord(product);
  if (!record) return "";
  for (const value of fieldValues(record, ["title", "name", "slug"])) {
    const title = nonEmptyString(value);
    if (title !== null) return title;
  }
  return "";
}

type PackageDimension = "ounces" | "mass" | "volume";

interface PackageSize {
  dimension: PackageDimension;
  normalizedValue: number;
  label: string;
}

const PACKAGE_SIZE_PATTERN = /(?<![\d.])(\d+(?:\.\d+)?|\.\d+)\s*(fl\s*oz|ml|kg|lbs?|oz|g|l)\b/gi;

function productPackageSizes(product: unknown): PackageSize[] {
  const record = asRecord(product);
  if (!record) return [];
  const values = [...fieldValues(record, ["size", "packSize", "pack_size"]), productTitle(product)];
  const sizes: PackageSize[] = [];
  const seen = new Set<string>();

  for (const rawValue of values) {
    const value = nonEmptyString(rawValue);
    if (!value) continue;
    for (const match of value.matchAll(PACKAGE_SIZE_PATTERN)) {
      const quantity = Number(match[1]);
      const unit = match[2].toLowerCase().replace(/\s+/g, "");
      if (!Number.isFinite(quantity) || quantity <= 0) continue;

      let dimension: PackageDimension;
      let normalizedValue: number;
      if (unit === "oz" || unit === "floz") {
        dimension = "ounces";
        normalizedValue = quantity;
      } else if (unit === "ml") {
        dimension = "volume";
        normalizedValue = quantity;
      } else if (unit === "l") {
        dimension = "volume";
        normalizedValue = quantity * 1_000;
      } else if (unit === "g") {
        dimension = "mass";
        normalizedValue = quantity;
      } else if (unit === "kg") {
        dimension = "mass";
        normalizedValue = quantity * 1_000;
      } else {
        dimension = "mass";
        normalizedValue = quantity * 453.59237;
      }

      const key = `${dimension}:${normalizedValue.toFixed(4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      sizes.push({ dimension, normalizedValue, label: `${match[1]} ${match[2]}` });
    }
  }
  return sizes;
}

function packageSizeConflict(left: unknown, right: unknown): string | null {
  const leftSizes = productPackageSizes(left);
  const rightSizes = productPackageSizes(right);
  if (leftSizes.length === 0 || rightSizes.length === 0) return null;

  const comparable = leftSizes.flatMap((leftSize) =>
    rightSizes
      .filter(({ dimension }) => dimension === leftSize.dimension)
      .map((rightSize) => ({ leftSize, rightSize })),
  );
  if (comparable.length === 0) return null;

  const compatible = comparable.some(({ leftSize, rightSize }) => {
    const difference = Math.abs(leftSize.normalizedValue - rightSize.normalizedValue);
    return difference / Math.max(leftSize.normalizedValue, rightSize.normalizedValue) <=
      PACKAGE_SIZE_RELATIVE_TOLERANCE;
  });
  if (compatible) return null;

  return `CMS size ${leftSizes.map(({ label }) => label).join(" / ")} conflicts with Kayco size ${
    rightSizes.map(({ label }) => label).join(" / ")
  }.`;
}

type SkuClueProvenance = "explicit" | "image" | "identity";

interface SkuClueEvidence {
  clue: string;
  provenance: SkuClueProvenance;
}

function scalarSkuClues(values: readonly unknown[]): string[] {
  return extractSkuClues(
    ...values.map((value) => nonEmptyString(value)).filter((value) => value !== null),
  );
}

function productSkuEvidence(product: unknown): SkuClueEvidence[] {
  const record = asRecord(product);
  if (!record) return [];
  const data = asRecord(record.data);
  const imageValues = [record.image, data?.image];
  const safeImageClues: unknown[] = [];
  for (const image of imageValues) {
    const imageText = nonEmptyString(image);
    if (imageText !== null) {
      safeImageClues.push(imageText);
      continue;
    }
    const imageRecord = asRecord(image);
    if (!imageRecord) continue;
    safeImageClues.push(
      imageRecord.url,
      imageRecord.sourceUrl,
      imageRecord.source_url,
      imageRecord.filename,
      imageRecord.filePath,
      imageRecord.file_path,
    );
  }

  const byProvenance: Array<{
    provenance: SkuClueProvenance;
    clues: string[];
  }> = [
    {
      provenance: "explicit",
      clues: scalarSkuClues(fieldValues(record, ["sku", "skuClue", "sku_clue"])),
    },
    {
      provenance: "image",
      clues: scalarSkuClues([
        ...fieldValues(record, ["imageUrl", "image_url"]),
        ...safeImageClues,
      ]),
    },
    {
      provenance: "identity",
      clues: scalarSkuClues(fieldValues(record, ["sourceId", "source_id", "slug"])),
    },
  ];

  return byProvenance.flatMap(({ provenance, clues }) =>
    clues.map((clue) => ({ clue, provenance })),
  );
}

/**
 * Direct SKU fields take precedence over filename clues. Stable IDs and slugs
 * are retained as provenance, but never establish an exact SKU match: their
 * numbers may be unrelated CMS/WordPress identifiers.
 */
function exactSkuClues(evidence: readonly SkuClueEvidence[]): string[] {
  const explicit = evidence
    .filter(({ provenance }) => provenance === "explicit")
    .map(({ clue }) => clue);
  if (explicit.length > 0) return explicit;
  return evidence
    .filter(({ provenance }) => provenance === "image")
    .map(({ clue }) => clue);
}

function isPlaceholderProduct(product: unknown): boolean {
  const record = asRecord(product);
  if (!record) return false;
  if (record.placeholder === true || record.isPlaceholder === true) return true;

  const imageValues = fieldValues(record, ["image", "imageUrl", "image_url"]);
  const images: string[] = [];
  for (const value of imageValues) flattenValues(value, images);
  return images.length > 0 && images.every((image) => isPlaceholderImage(image));
}

function levenshteinSimilarity(left: string, right: string): number {
  if (left === right) return 1;
  if (left.length === 0 || right.length === 0) return 0;

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitution = previous[rightIndex - 1] +
        (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1);
      current[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        current[rightIndex - 1] + 1,
        substitution,
      );
    }
    previous = current;
  }
  return 1 - previous[right.length] / Math.max(left.length, right.length);
}

function tokenDice(left: string, right: string): number {
  const leftTokens = new Set(left.split(" ").filter(Boolean));
  const rightTokens = new Set(right.split(" ").filter(Boolean));
  if (leftTokens.size === 0 || rightTokens.size === 0) return 0;
  let intersection = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) intersection += 1;
  }
  return (2 * intersection) / (leftTokens.size + rightTokens.size);
}

export function titleSimilarity(left: string, right: string): number {
  const normalizedLeft = normalizeTitle(left);
  const normalizedRight = normalizeTitle(right);
  if (!normalizedLeft || !normalizedRight) return 0;
  if (normalizedLeft === normalizedRight) return 1;
  const score =
    tokenDice(normalizedLeft, normalizedRight) * 0.7 +
    levenshteinSimilarity(normalizedLeft, normalizedRight) * 0.3;
  return Number(score.toFixed(6));
}

function optionsWithDefaults(options: MatchOptions): Required<MatchOptions> {
  return {
    fuzzyThreshold: Math.min(1, Math.max(0, options.fuzzyThreshold ?? DEFAULT_OPTIONS.fuzzyThreshold)),
    runnerUpMargin: Math.min(1, Math.max(0, options.runnerUpMargin ?? DEFAULT_OPTIONS.runnerUpMargin)),
    maxSuggestions: Math.max(1, Math.floor(options.maxSuggestions ?? DEFAULT_OPTIONS.maxSuggestions)),
  };
}

function result<TCms, TKayco>(
  cmsProduct: TCms,
  values: Omit<
    MatchResult<TCms, TKayco>,
    "cmsProduct" | "requiresReview" | "autoPublish"
  >,
): MatchResult<TCms, TKayco> {
  return {
    cmsProduct,
    ...values,
    requiresReview: true,
    autoPublish: false,
  };
}

export function matchProduct<TCms extends object, TKayco extends object>(
  cmsProduct: TCms,
  kaycoProducts: readonly TKayco[],
  options: MatchOptions = {},
): MatchResult<TCms, TKayco> {
  const settings = optionsWithDefaults(options);
  const eligible = kaycoProducts.filter((product) => !isPlaceholderProduct(product));
  const cmsEvidence = productSkuEvidence(cmsProduct);
  const cmsClues = exactSkuClues(cmsEvidence);
  const cmsHasExplicitSku = cmsEvidence.some(({ provenance }) => provenance === "explicit");
  const cmsClueSet = new Set(cmsClues);
  const candidateEvidence = eligible
    .map((product) => ({
      product,
      clues: exactSkuClues(productSkuEvidence(product)),
    }))
    .map(({ product, clues }) => {
      const shared = clues.filter((clue) => cmsClueSet.has(clue));
      return {
        product,
        shared,
        contradictory:
          cmsClues.length > 0 && clues.length > 0 && shared.length === 0,
      };
    });
  const skuCandidates = candidateEvidence.filter(({ shared }) => shared.length > 0);

  if (skuCandidates.length === 1) {
    const suggestion: MatchSuggestion<TKayco> = {
      product: skuCandidates[0].product,
      score: 1,
      method: "sku",
      clues: skuCandidates[0].shared,
    };
    const corroboratingTitleScore = titleSimilarity(
      productTitle(cmsProduct),
      productTitle(suggestion.product),
    );
    const sizeConflict = packageSizeConflict(cmsProduct, suggestion.product);
    if (sizeConflict) {
      return result(cmsProduct, {
        match: null,
        method: "sku",
        status: "ambiguous",
        suggestions: [suggestion],
        runnerUp: null,
        confidence: Math.min(0.75, corroboratingTitleScore),
        reason: sizeConflict,
      });
    }
    if (!cmsHasExplicitSku && corroboratingTitleScore < IMAGE_SKU_TITLE_MINIMUM) {
      return result(cmsProduct, {
        match: null,
        method: "sku",
        status: "ambiguous",
        suggestions: [suggestion],
        runnerUp: null,
        confidence: corroboratingTitleScore,
        reason:
          `Image-derived SKU clue ${suggestion.clues.join(", ")} conflicts with the product titles ` +
          `(similarity ${corroboratingTitleScore.toFixed(3)}).`,
      });
    }
    return result(cmsProduct, {
      match: suggestion,
      method: "sku",
      status: "matched",
      suggestions: [suggestion],
      runnerUp: null,
      confidence: 1,
      reason: `Unique exact SKU clue: ${suggestion.clues.join(", ")}`,
    });
  }

  const normalizedCmsTitle = normalizeTitle(productTitle(cmsProduct));
  const titleCandidateEvidence = normalizedCmsTitle
    ? candidateEvidence.filter(
        ({ product }) => normalizeTitle(productTitle(product)) === normalizedCmsTitle,
      )
    : [];
  const titleCandidates = titleCandidateEvidence.map(({ product }) => product);

  if (titleCandidates.length === 1) {
    const suggestion: MatchSuggestion<TKayco> = {
      product: titleCandidates[0],
      score: 0.99,
      method: "title",
      clues: [normalizedCmsTitle],
    };
    if (titleCandidateEvidence[0].contradictory) {
      return result(cmsProduct, {
        match: null,
        method: "title",
        status: "ambiguous",
        suggestions: [suggestion],
        runnerUp: null,
        confidence: suggestion.score,
        reason: "The exact title conflicts with explicit/current-image SKU evidence",
      });
    }
    return result(cmsProduct, {
      match: suggestion,
      method: "title",
      status: "matched",
      suggestions: [suggestion],
      runnerUp: null,
      confidence: suggestion.score,
      reason: "Unique exact normalized title",
    });
  }

  if (skuCandidates.length > 1 || titleCandidates.length > 1) {
    const useSku = skuCandidates.length > 1;
    const ambiguous = useSku
      ? skuCandidates.map(({ product, shared }) => ({
          product,
          score: 1,
          method: "sku" as const,
          clues: shared,
        }))
      : titleCandidates.map((product) => ({
          product,
          score: 0.99,
          method: "title" as const,
          clues: [normalizedCmsTitle],
        }));
    const suggestions = ambiguous.slice(0, settings.maxSuggestions);
    return result(cmsProduct, {
      match: null,
      method: useSku ? "sku" : "title",
      status: "ambiguous",
      suggestions,
      runnerUp: suggestions[1] ?? null,
      confidence: suggestions[0]?.score ?? 0,
      reason: useSku
        ? "An exact SKU clue identifies more than one Kayco record"
        : "The normalized title identifies more than one Kayco record",
    });
  }

  const suggestions = eligible
    .map((product, index) => ({
      index,
      suggestion: {
        product,
        score: titleSimilarity(productTitle(cmsProduct), productTitle(product)),
        method: "fuzzy" as const,
        clues: [normalizeTitle(productTitle(product))].filter(Boolean),
      },
    }))
    .filter(({ suggestion }) => suggestion.score > 0)
    .sort(
      (left, right) =>
        right.suggestion.score - left.suggestion.score || left.index - right.index,
    )
    .slice(0, settings.maxSuggestions)
    .map(({ suggestion }) => suggestion);

  const best = suggestions[0] ?? null;
  const runnerUp = suggestions[1] ?? null;
  if (!best || best.score < settings.fuzzyThreshold) {
    return result(cmsProduct, {
      match: null,
      method: "none",
      status: "unmatched",
      suggestions,
      runnerUp,
      confidence: best?.score ?? 0,
      reason: best
        ? "No fuzzy suggestion met the review threshold"
        : "No usable Kayco candidates",
    });
  }

  const closeRunnerUp =
    runnerUp !== null && best.score - runnerUp.score <= settings.runnerUpMargin;
  return result(cmsProduct, {
    match: null,
    method: "fuzzy",
    status: closeRunnerUp ? "ambiguous" : "suggested",
    suggestions,
    runnerUp,
    confidence: best.score,
    reason: closeRunnerUp
      ? "The top fuzzy suggestion is too close to the runner-up"
      : "Fuzzy suggestion requires manual review",
  });
}

/**
 * Batch matching additionally rejects one Kayco record being selected for more
 * than one CMS product. It never changes the review-only/non-publishing flags.
 */
export function matchProducts<TCms extends object, TKayco extends object>(
  cmsProducts: readonly TCms[],
  kaycoProducts: readonly TKayco[],
  options: MatchOptions = {},
): MatchResult<TCms, TKayco>[] {
  const matches = cmsProducts.map((product) =>
    matchProduct(product, kaycoProducts, options),
  );
  const selected = new Map<TKayco, number[]>();
  matches.forEach((match, index) => {
    if (!match.match) return;
    const indexes = selected.get(match.match.product) ?? [];
    indexes.push(index);
    selected.set(match.match.product, indexes);
  });

  for (const indexes of selected.values()) {
    if (indexes.length < 2) continue;
    for (const index of indexes) {
      const current = matches[index];
      matches[index] = {
        ...current,
        match: null,
        status: "ambiguous",
        reason: "The Kayco record was also selected for another CMS product",
      };
    }
  }
  return matches;
}

export const matchCmsProducts = matchProducts;
