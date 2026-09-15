import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fetchCmsCatalog } from "./cms-client";
import {
  KAYCO_ORIGIN,
  KAYCO_USER_AGENT,
  fetchTuscaniniCatalog,
  type KaycoProductRecord,
} from "./kayco-client";
import { extractSkuClues, matchProducts } from "./matcher";
import {
  sanitizePublicUrl,
  writeImageAuditReports,
  type ProductImageAuditRecord,
} from "./report";
import {
  ROBOTS_PRODUCT_TOKEN,
  evaluateRobotsPath,
  parseRobotsTxt,
  type RobotsPolicy,
} from "./robots";
import { stageKaycoImages, type StagedImage } from "./stage";

interface CliOptions {
  download: boolean;
  outputDirectory: string;
}

interface RunSummary {
  generatedAt: string;
  source: {
    brandId: number;
    advertisedProducts: number;
    returnedProducts: number;
    usableImages: number;
    placeholders: number;
  };
  cms: {
    siteKey: "tuscanini";
    products: number;
    currentImages: number;
  };
  matches: Record<"matched" | "suggested" | "ambiguous" | "unmatched", number>;
  staging: {
    requested: boolean;
    downloaded: number;
    cached: number;
    placeholders: number;
    failed: number;
    bytes: number;
  };
}

const help = `Audit Kayco's public Tuscanini product images against the live Tuscanini CMS.

Usage:
  pnpm kayco:images:audit [-- --out <directory>] [--download]

Options:
  --out <directory>  Artifact directory (defaults to a timestamped .artifacts path)
  --download         Stage full-resolution, non-placeholder Kayco images locally
  --help             Show this message

This command is read-only with respect to Kayco and the CMS. Downloaded files are
review artifacts; it never uploads media, edits drafts, or publishes content.
`;

function defaultOutputDirectory(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return resolve(".artifacts", "kayco-images", timestamp);
}

function parseArgs(args: string[]): CliOptions | null {
  let download = false;
  let outputDirectory: string | null = null;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--") continue;
    if (argument === "--help" || argument === "-h") return null;
    if (argument === "--download") {
      download = true;
      continue;
    }
    if (argument === "--out") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error("--out requires a directory");
      outputDirectory = resolve(value);
      index += 1;
      continue;
    }
    if (argument.startsWith("--out=")) {
      const value = argument.slice("--out=".length);
      if (!value) throw new Error("--out requires a directory");
      outputDirectory = resolve(value);
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }

  return { download, outputDirectory: outputDirectory ?? defaultOutputDirectory() };
}

async function fetchRobotsPolicy(): Promise<RobotsPolicy> {
  const robotsUrl = `${KAYCO_ORIGIN}/robots.txt`;
  const response = await fetch(robotsUrl, {
    headers: { Accept: "text/plain", "User-Agent": KAYCO_USER_AGENT },
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Kayco robots.txt returned ${response.status}`);
  if (response.url && response.url !== robotsUrl) throw new Error("Kayco robots.txt redirected unexpectedly");
  return parseRobotsTxt(await response.text());
}

function assertRobotsAllowsPath(policy: RobotsPolicy, url: URL): void {
  const decision = evaluateRobotsPath(policy, url.href, ROBOTS_PRODUCT_TOKEN);
  if (decision.allowed) return;
  const rule = decision.matchedRule;
  throw new Error(
    `Kayco robots.txt blocks ${decision.path} via ${rule?.directive ?? "unknown"}: ${rule?.pattern ?? "unknown"}`,
  );
}

function firstCmsSkuClue(imageUrl: string): string | null {
  return extractSkuClues(imageUrl)[0] ?? null;
}

function candidateForReport(product: KaycoProductRecord | null) {
  if (!product) return null;
  return {
    id: String(product.id),
    title: product.title,
    sku: product.skuClue,
    pageUrl: product.pageUrl,
    image: {
      url: product.image?.sourceUrl ?? null,
      width: product.image?.width ?? null,
      height: product.image?.height ?? null,
    },
  };
}

function warningsForMatch(
  status: "matched" | "suggested" | "ambiguous" | "unmatched",
  reason: string,
  candidate: KaycoProductRecord | null,
  currentImageUrl: string,
): string[] {
  const warnings = [reason];
  if (status === "matched") warnings.push("Review product identity and package size before creating a CMS draft.");
  if (status === "suggested") warnings.push("Fuzzy suggestion only; manual approval is required before download or import.");
  if (status === "ambiguous") warnings.push("Multiple plausible mappings exist; do not import until an override is reviewed.");
  if (status === "unmatched") warnings.push("No safe Kayco mapping was found.");
  if (/pack[-_ ]shot[-_ ]pending|coming[-_ ]soon|placeholder/i.test(currentImageUrl)) {
    warnings.push("The current CMS image is a placeholder.");
  }
  if (candidate?.placeholder || !candidate?.image) warnings.push("The Kayco candidate has no usable featured image.");
  if (
    candidate?.image?.width &&
    candidate.image.height &&
    Math.min(candidate.image.width, candidate.image.height) < 600
  ) {
    warnings.push("The Kayco source has a short side below 600 px; inspect it at the intended crop before approval.");
  }
  return warnings;
}

function stagingSummary(staged: StagedImage[]): RunSummary["staging"] {
  return {
    requested: staged.length > 0,
    downloaded: staged.filter(({ status }) => status === "downloaded").length,
    cached: staged.filter(({ status }) => status === "cached").length,
    placeholders: staged.filter(({ status }) => status === "placeholder").length,
    failed: staged.filter(({ status }) => status === "failed").length,
    bytes: staged.reduce((total, image) => total + image.bytes, 0),
  };
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function publicCmsSnapshot(cms: Awaited<ReturnType<typeof fetchCmsCatalog>>) {
  return {
    ...cms,
    apiUrl: sanitizePublicUrl(cms.apiUrl),
    products: cms.products.map((product) => ({
      ...product,
      imageUrl: sanitizePublicUrl(product.imageUrl),
    })),
  };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (!options) {
    console.log(help);
    return;
  }

  await mkdir(options.outputDirectory, { recursive: true });
  const robotsPolicy = await fetchRobotsPolicy();
  const authorizeKaycoUrl = (url: URL) => assertRobotsAllowsPath(robotsPolicy, url);

  const [kayco, cms] = await Promise.all([
    fetchTuscaniniCatalog({ authorizeUrl: authorizeKaycoUrl }),
    fetchCmsCatalog(),
  ]);
  console.log("Kayco robots.txt allows every requested public catalog path.");
  console.log(`Fetched ${kayco.products.length} Kayco records and ${cms.products.length} CMS products.`);

  const matches = matchProducts(cms.products, kayco.products);
  const records: ProductImageAuditRecord[] = matches.map((result) => {
    const leading = result.status === "unmatched"
      ? null
      : result.match?.product ?? result.suggestions[0]?.product ?? null;
    return {
      cms: {
        id: result.cmsProduct.sourceId,
        slug: result.cmsProduct.slug,
        title: result.cmsProduct.title,
        sku: firstCmsSkuClue(result.cmsProduct.imageUrl),
        image: { url: result.cmsProduct.imageUrl || null, width: null, height: null },
      },
      candidate: candidateForReport(leading),
      alternatives: result.status === "unmatched"
        ? []
        : result.suggestions
            .map(({ product }) => product)
            .filter((product) => product !== leading)
            .map((product) => candidateForReport(product))
            .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null),
      match: {
        status: result.status,
        method: result.method,
        confidence: result.confidence,
        warnings: warningsForMatch(
          result.status,
          result.reason,
          leading,
          result.cmsProduct.imageUrl,
        ),
      },
    };
  });

  const generatedAt = new Date().toISOString();
  const reportPaths = await writeImageAuditReports(
    { generatedAt, records },
    { outputDirectory: options.outputDirectory, title: "Tuscanini CMS vs Kayco image audit" },
  );

  await Promise.all([
    writeJson(resolve(options.outputDirectory, "source-kayco.json"), kayco),
    writeJson(resolve(options.outputDirectory, "target-cms.json"), publicCmsSnapshot(cms)),
  ]);

  let staged: StagedImage[] = [];
  if (options.download) {
    const stageable = kayco.products.filter(
      (product): product is KaycoProductRecord & { image: NonNullable<KaycoProductRecord["image"]> } =>
        product.image !== null,
    );
    staged = await stageKaycoImages(
      stageable,
      resolve(options.outputDirectory, "staged"),
      (completed, total, result) => {
        if (completed === total || completed % 10 === 0 || result.status === "failed") {
          console.log(`Staged ${completed}/${total}: ${result.status} ${result.sku ?? result.kaycoId}`);
        }
      },
      authorizeKaycoUrl,
    );
    await writeJson(resolve(options.outputDirectory, "staged-images.json"), staged);
  }

  const statusCounts: RunSummary["matches"] = {
    matched: matches.filter(({ status }) => status === "matched").length,
    suggested: matches.filter(({ status }) => status === "suggested").length,
    ambiguous: matches.filter(({ status }) => status === "ambiguous").length,
    unmatched: matches.filter(({ status }) => status === "unmatched").length,
  };
  const summary: RunSummary = {
    generatedAt,
    source: {
      brandId: kayco.brand.id,
      advertisedProducts: kayco.brand.productCount,
      returnedProducts: kayco.products.length,
      usableImages: kayco.products.filter((product) => product.image && !product.placeholder).length,
      placeholders: kayco.products.filter((product) => product.placeholder).length,
    },
    cms: {
      siteKey: cms.siteKey,
      products: cms.products.length,
      currentImages: cms.products.filter((product) => product.imageUrl).length,
    },
    matches: statusCounts,
    staging: options.download
      ? stagingSummary(staged)
      : { requested: false, downloaded: 0, cached: 0, placeholders: 0, failed: 0, bytes: 0 },
  };
  await writeJson(resolve(options.outputDirectory, "summary.json"), summary);

  console.log(`Reports written to ${options.outputDirectory}`);
  console.log(`Review page: ${reportPaths.html}`);
  console.log(`Matches: ${JSON.stringify(statusCounts)}`);
  if (summary.staging.failed > 0) process.exitCode = 2;
}

await main();
