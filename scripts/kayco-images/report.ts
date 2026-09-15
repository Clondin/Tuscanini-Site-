import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export type AuditMatchMethod = "sku" | "title" | "fuzzy" | "none";
export type AuditMatchStatus = "matched" | "suggested" | "ambiguous" | "unmatched";

export interface AuditedImage {
  url: string | null;
  width: number | null;
  height: number | null;
}

export interface CmsAuditProduct {
  id: string;
  slug: string;
  title: string;
  sku: string | null;
  image: AuditedImage;
}

export interface KaycoAuditCandidate {
  id: string;
  title: string;
  sku: string | null;
  pageUrl: string | null;
  image: AuditedImage;
}

export interface AuditMatchDetails {
  status: AuditMatchStatus;
  method: AuditMatchMethod;
  /** A normalized score from 0 through 1, or null when no score exists. */
  confidence: number | null;
  warnings: readonly string[];
}

export interface ProductImageAuditRecord {
  cms: CmsAuditProduct;
  /** The selected exact match or the leading review suggestion. */
  candidate: KaycoAuditCandidate | null;
  /** Additional review candidates, ordered by matcher score. */
  alternatives?: readonly KaycoAuditCandidate[];
  match: AuditMatchDetails;
}

export interface NormalizedImageAudit {
  /** Optional on purpose: report generation never inserts a nondeterministic timestamp. */
  generatedAt?: string | null;
  records: readonly ProductImageAuditRecord[];
}

export interface ImageAuditSummary {
  totalProducts: number;
  matchedProducts: number;
  suggestedProducts: number;
  ambiguousProducts: number;
  unmatchedProducts: number;
  currentImages: number;
  candidateImages: number;
  changedImageUrls: number;
  productsWithWarnings: number;
  warnings: number;
}

export interface ImageAuditReport {
  schemaVersion: 1;
  generatedAt: string | null;
  summary: ImageAuditSummary;
  records: ProductImageAuditRecord[];
}

export interface WriteImageAuditReportsOptions {
  outputDirectory: string;
  fileStem?: string;
  title?: string;
}

export interface ImageAuditReportPaths {
  json: string;
  csv: string;
  html: string;
}

const defaultTitle = "Tuscanini product image audit";
const safeFileStemPattern = /^[a-z0-9](?:[a-z0-9_-]{0,78}[a-z0-9])?$/i;
const matchMethods = new Set<AuditMatchMethod>(["sku", "title", "fuzzy", "none"]);
const matchStatuses = new Set<AuditMatchStatus>(["matched", "suggested", "ambiguous", "unmatched"]);

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeText(value: string): string {
  return redactSensitiveText(value.trim().replace(/\r\n?/g, "\n"));
}

function positiveIntegerOrNull(value: number | null): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.round(value)
    : null;
}

function confidenceOrNull(value: number | null): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : null;
}

/**
 * Returns a public HTTP(S) URL suitable for an artifact. Credentials, query
 * parameters, and fragments are deliberately removed so signed URLs and tokens
 * cannot be copied into JSON, CSV, or HTML output.
 */
export function sanitizePublicUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    url.username = "";
    url.password = "";
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

/** Removes common credential forms from free-form fields such as warnings. */
export function redactSensitiveText(value: string): string {
  return value
    .replace(/\bhttps?:\/\/[^\s<>"']+/gi, (url) => sanitizePublicUrl(url) ?? "[REDACTED URL]")
    .replace(/\b(bearer|basic)\s+[a-z0-9._~+/=-]+/gi, "$1 [REDACTED]")
    .replace(
      /(\b(?:api[-_ ]?key|access[-_ ]?token|refresh[-_ ]?token|token|secret|password|authorization)\b\s*[:=]\s*)[^\s,;]+/gi,
      "$1[REDACTED]",
    )
    .replace(/\beyJ[a-z0-9_-]{8,}\.[a-z0-9_-]{8,}\.[a-z0-9_-]{8,}\b/gi, "[REDACTED JWT]");
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

/** Quotes a CSV value and neutralizes spreadsheet-formula prefixes. */
export function escapeCsvCell(value: string | number | null): string {
  let text = value === null ? "" : String(value).replace(/\r\n?/g, "\n");
  if (/^\s*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function normalizeImage(image: AuditedImage): AuditedImage {
  return {
    url: sanitizePublicUrl(image.url),
    width: positiveIntegerOrNull(image.width),
    height: positiveIntegerOrNull(image.height),
  };
}

function normalizeCandidate(candidate: KaycoAuditCandidate): KaycoAuditCandidate {
  return {
    id: normalizeText(candidate.id),
    title: normalizeText(candidate.title),
    sku: candidate.sku ? normalizeText(candidate.sku) : null,
    pageUrl: sanitizePublicUrl(candidate.pageUrl),
    image: normalizeImage(candidate.image),
  };
}

function normalizeRecord(record: ProductImageAuditRecord): ProductImageAuditRecord {
  const warnings = [...new Set(record.match.warnings.map(normalizeText).filter(Boolean))]
    .sort(compareText);
  const method = matchMethods.has(record.match.method) ? record.match.method : "none";
  const status = matchStatuses.has(record.match.status) ? record.match.status : "unmatched";

  return {
    cms: {
      id: normalizeText(record.cms.id),
      slug: normalizeText(record.cms.slug),
      title: normalizeText(record.cms.title),
      sku: record.cms.sku ? normalizeText(record.cms.sku) : null,
      image: normalizeImage(record.cms.image),
    },
    candidate: record.candidate ? normalizeCandidate(record.candidate) : null,
    alternatives: (record.alternatives ?? [])
      .map(normalizeCandidate),
    match: {
      status,
      method,
      confidence: confidenceOrNull(record.match.confidence),
      warnings,
    },
  };
}

function recordSortKey(record: ProductImageAuditRecord): string {
  return [record.cms.sku ?? "", record.cms.slug, record.cms.id, record.cms.title]
    .map((value) => value.toLowerCase())
    .join("\u0000");
}

export function summarizeImageAudit(records: readonly ProductImageAuditRecord[]): ImageAuditSummary {
  const summary: ImageAuditSummary = {
    totalProducts: records.length,
    matchedProducts: 0,
    suggestedProducts: 0,
    ambiguousProducts: 0,
    unmatchedProducts: 0,
    currentImages: 0,
    candidateImages: 0,
    changedImageUrls: 0,
    productsWithWarnings: 0,
    warnings: 0,
  };

  for (const record of records) {
    if (record.match.status === "matched") summary.matchedProducts += 1;
    if (record.match.status === "suggested") summary.suggestedProducts += 1;
    if (record.match.status === "ambiguous") summary.ambiguousProducts += 1;
    if (record.match.status === "unmatched") summary.unmatchedProducts += 1;
    if (record.cms.image.url) summary.currentImages += 1;
    if (record.candidate?.image.url) summary.candidateImages += 1;
    if (
      record.cms.image.url
      && record.candidate?.image.url
      && record.cms.image.url !== record.candidate.image.url
    ) {
      summary.changedImageUrls += 1;
    }
    if (record.match.warnings.length > 0) summary.productsWithWarnings += 1;
    summary.warnings += record.match.warnings.length;
  }

  return summary;
}

export function buildImageAuditReport(audit: NormalizedImageAudit): ImageAuditReport {
  const records = audit.records
    .map(normalizeRecord)
    .sort((left, right) => compareText(recordSortKey(left), recordSortKey(right)));

  return {
    schemaVersion: 1,
    generatedAt: audit.generatedAt ? normalizeText(audit.generatedAt) : null,
    summary: summarizeImageAudit(records),
    records,
  };
}

export function renderImageAuditJson(audit: NormalizedImageAudit): string {
  return `${JSON.stringify(buildImageAuditReport(audit), null, 2)}\n`;
}

export function renderImageAuditCsv(audit: NormalizedImageAudit): string {
  const report = buildImageAuditReport(audit);
  const headings = [
    "cms_id",
    "cms_slug",
    "product_name",
    "cms_sku",
    "match_status",
    "match_method",
    "confidence",
    "cms_image_url",
    "cms_width",
    "cms_height",
    "kayco_id",
    "kayco_title",
    "kayco_sku",
    "kayco_product_url",
    "kayco_image_url",
    "kayco_width",
    "kayco_height",
    "alternative_count",
    "alternatives",
    "warnings",
  ];
  const rows = report.records.map((record) => [
    record.cms.id,
    record.cms.slug,
    record.cms.title,
    record.cms.sku,
    record.match.status,
    record.match.method,
    record.match.confidence,
    record.cms.image.url,
    record.cms.image.width,
    record.cms.image.height,
    record.candidate?.id ?? null,
    record.candidate?.title ?? null,
    record.candidate?.sku ?? null,
    record.candidate?.pageUrl ?? null,
    record.candidate?.image.url ?? null,
    record.candidate?.image.width ?? null,
    record.candidate?.image.height ?? null,
    record.alternatives?.length ?? 0,
    (record.alternatives ?? [])
      .map((candidate) => [candidate.sku ?? "no-sku", candidate.title, candidate.pageUrl ?? "no-url"].join(" | "))
      .join("\n"),
    record.match.warnings.join(" | "),
  ]);

  return [headings, ...rows]
    .map((row) => row.map((value) => escapeCsvCell(value)).join(","))
    .join("\n") + "\n";
}

function formatDimensions(image: AuditedImage): string {
  return image.width && image.height ? `${image.width} × ${image.height} px` : "Unknown dimensions";
}

function formatConfidence(confidence: number | null): string {
  if (confidence === null) return "Not scored";
  const percent = Math.round(confidence * 1_000) / 10;
  return `${Number.isInteger(percent) ? percent.toFixed(0) : percent.toFixed(1)}%`;
}

function renderImagePanel(label: string, title: string, image: AuditedImage): string {
  const safeLabel = escapeHtml(label);
  const safeTitle = escapeHtml(title);
  const safeUrl = image.url ? escapeHtml(image.url) : null;
  const media = safeUrl
    ? `<a class="image-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer"><img src="${safeUrl}" alt="${safeLabel} for ${safeTitle}" loading="lazy" decoding="async" referrerpolicy="no-referrer"></a>`
    : `<div class="empty-image" role="img" aria-label="No ${safeLabel.toLowerCase()} available">No image</div>`;
  const url = safeUrl
    ? `<a class="url" href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeUrl}</a>`
    : `<span class="muted">No URL</span>`;

  return `<section class="image-panel">
          <h3>${safeLabel}</h3>
          ${media}
          <p class="dimensions">${escapeHtml(formatDimensions(image))}</p>
          ${url}
        </section>`;
}

function renderRecord(record: ProductImageAuditRecord): string {
  const candidate = record.candidate;
  const candidatePanel = candidate
    ? renderImagePanel("Kayco candidate", candidate.title, candidate.image)
    : renderImagePanel("Kayco candidate", record.cms.title, { url: null, width: null, height: null });
  const warnings = record.match.warnings.length > 0
    ? `<ul class="warnings">${record.match.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul>`
    : `<p class="muted">No warnings</p>`;
  const candidateMeta = candidate
    ? `<span>Kayco SKU: <strong>${escapeHtml(candidate.sku ?? "Not found")}</strong></span>
        ${candidate.pageUrl ? `<a href="${escapeHtml(candidate.pageUrl)}" target="_blank" rel="noopener noreferrer">Kayco product page</a>` : ""}`
    : `<span>Kayco SKU: <strong>Not found</strong></span>`;
  const alternatives = record.alternatives && record.alternatives.length > 0
    ? `<div class="alternative-block"><h3>Other candidates</h3><ul class="alternatives">${record.alternatives.map((alternative) => {
        const label = `${alternative.sku ?? "No SKU"} Â· ${alternative.title}`;
        return alternative.pageUrl
          ? `<li><a href="${escapeHtml(alternative.pageUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a></li>`
          : `<li>${escapeHtml(label)}</li>`;
      }).join("")}</ul></div>`
    : "";

  return `<article class="record">
      <header class="record-header">
        <div>
          <p class="eyebrow">${escapeHtml(record.cms.slug)} · ${escapeHtml(record.cms.id)}</p>
          <h2>${escapeHtml(record.cms.title)}</h2>
        </div>
        <span class="status status-${record.match.status}">${escapeHtml(record.match.status)}</span>
      </header>
      <div class="meta">
        <span>CMS SKU: <strong>${escapeHtml(record.cms.sku ?? "Not found")}</strong></span>
        ${candidateMeta}
        <span>Method: <strong>${escapeHtml(record.match.method)}</strong></span>
        <span>Confidence: <strong>${escapeHtml(formatConfidence(record.match.confidence))}</strong></span>
      </div>
      <div class="comparison">
        ${renderImagePanel("CMS current", record.cms.title, record.cms.image)}
        ${candidatePanel}
      </div>
      ${alternatives}
      <div class="warning-block"><h3>Review notes</h3>${warnings}</div>
    </article>`;
}

export function renderImageAuditHtml(
  audit: NormalizedImageAudit,
  title = defaultTitle,
): string {
  const report = buildImageAuditReport(audit);
  const safeTitle = escapeHtml(normalizeText(title));
  const summaryItems: Array<[string, number]> = [
    ["Products", report.summary.totalProducts],
    ["Matched", report.summary.matchedProducts],
    ["Suggested", report.summary.suggestedProducts],
    ["Ambiguous", report.summary.ambiguousProducts],
    ["Unmatched", report.summary.unmatchedProducts],
    ["Current images", report.summary.currentImages],
    ["Candidate images", report.summary.candidateImages],
    ["Changed URLs", report.summary.changedImageUrls],
    ["With warnings", report.summary.productsWithWarnings],
    ["Warnings", report.summary.warnings],
  ];
  const generatedAt = report.generatedAt
    ? `<p class="generated">Audit timestamp: ${escapeHtml(report.generatedAt)}</p>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src http: https:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; object-src 'none'">
  <title>${safeTitle}</title>
  <style>
    :root { color-scheme: light; font: 16px/1.5 system-ui, sans-serif; color: #29251f; background: #f4f0e8; }
    * { box-sizing: border-box; }
    body { margin: 0; }
    main { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 40px 0 72px; }
    h1, h2, h3, p { margin-top: 0; }
    h1 { margin-bottom: 8px; font-family: Georgia, serif; font-size: clamp(2rem, 5vw, 3.5rem); }
    h2 { margin-bottom: 0; font: 700 1.5rem/1.2 Georgia, serif; }
    h3 { margin-bottom: 10px; font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; }
    a { color: #205b45; overflow-wrap: anywhere; }
    .generated, .muted { color: #6f695f; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(125px, 1fr)); gap: 10px; margin: 28px 0; }
    .summary div { padding: 14px; border: 1px solid #d8d0c2; border-radius: 10px; background: #fff; }
    .summary dt { color: #6f695f; font-size: .8rem; }
    .summary dd { margin: 2px 0 0; font-size: 1.55rem; font-weight: 750; }
    .record { margin-top: 20px; padding: clamp(18px, 3vw, 30px); border: 1px solid #d8d0c2; border-radius: 14px; background: #fff; box-shadow: 0 6px 24px rgb(40 32 20 / 6%); }
    .record-header { display: flex; align-items: start; justify-content: space-between; gap: 16px; }
    .eyebrow { margin-bottom: 6px; color: #6f695f; font: 600 .72rem/1.3 ui-monospace, monospace; overflow-wrap: anywhere; }
    .status { flex: none; padding: 5px 10px; border-radius: 999px; font-size: .75rem; font-weight: 750; text-transform: uppercase; }
    .status-matched { color: #135d3b; background: #dff3e8; }
    .status-suggested { color: #735412; background: #fff1bd; }
    .status-ambiguous { color: #793b11; background: #ffe3c5; }
    .status-unmatched { color: #7c2c2c; background: #f9dddd; }
    .meta { display: flex; flex-wrap: wrap; gap: 7px 18px; margin: 18px 0; color: #5e584f; font-size: .88rem; }
    .comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .image-panel { min-width: 0; padding: 14px; border: 1px solid #e2ddd3; border-radius: 10px; background: #faf8f4; }
    .image-link, .empty-image { display: grid; width: 100%; aspect-ratio: 4 / 3; place-items: center; border-radius: 7px; background: #fff; overflow: hidden; }
    img { display: block; width: 100%; height: 100%; object-fit: contain; }
    .empty-image { border: 1px dashed #c9c1b4; color: #81796d; }
    .dimensions { margin: 10px 0 4px; color: #5e584f; font-size: .82rem; }
    .url { display: block; font: .72rem/1.45 ui-monospace, monospace; }
    .warning-block { margin-top: 18px; }
    .alternative-block { margin-top: 18px; padding: 12px 14px; border: 1px solid #ead8bb; border-radius: 9px; background: #fff9ec; }
    .alternatives { margin: 0; padding-left: 20px; }
    .warnings { margin: 0; padding-left: 20px; color: #753b16; }
    @media (max-width: 700px) { .comparison { grid-template-columns: 1fr; } .record-header { display: block; } .status { display: inline-block; margin-top: 12px; } }
  </style>
</head>
<body>
  <main>
    <header><h1>${safeTitle}</h1><p>Static review artifact. No CMS content is changed by this report.</p>${generatedAt}</header>
    <dl class="summary">${summaryItems.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${value}</dd></div>`).join("")}</dl>
    ${report.records.map(renderRecord).join("\n    ")}
  </main>
</body>
</html>
`;
}

export async function writeImageAuditReports(
  audit: NormalizedImageAudit,
  options: WriteImageAuditReportsOptions,
): Promise<ImageAuditReportPaths> {
  const fileStem = options.fileStem ?? "kayco-image-audit";
  if (!safeFileStemPattern.test(fileStem)) {
    throw new Error("fileStem must contain only letters, numbers, hyphens, and underscores");
  }

  const outputDirectory = resolve(options.outputDirectory);
  const paths: ImageAuditReportPaths = {
    json: resolve(outputDirectory, `${fileStem}.json`),
    csv: resolve(outputDirectory, `${fileStem}.csv`),
    html: resolve(outputDirectory, `${fileStem}.html`),
  };

  await mkdir(outputDirectory, { recursive: true });
  await Promise.all([
    writeFile(paths.json, renderImageAuditJson(audit), "utf8"),
    writeFile(paths.csv, renderImageAuditCsv(audit), "utf8"),
    writeFile(paths.html, renderImageAuditHtml(audit, options.title), "utf8"),
  ]);

  return paths;
}
