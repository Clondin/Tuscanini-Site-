import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFile, realpath } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import sharp from 'sharp';

export const galleryFiles = ['01-studio.png', '02-kitchen.png', '03-table.png', '04-environment.png'];
const compositeMethod = 'deterministic-original-photo-homography';
type Dimensions = { width: number; height: number };
type Asset = { path: string; sha256: string; dimensions: Dimensions };
type ReviewedSource = { path: string; sha256: string; scope: 'exact-package' | 'qualified-component'; status: string; reviewer: string; notes: string };
export interface GalleryReceiptImage {
  file: string;
  qa?: { accepted?: boolean; visuallyInspected?: boolean };
  originalPath?: string;
  provenance?: { kind: 'source-preserving-composite'; receiptPath: string; promotedFrom?: string; reviewedSources: ReviewedSource[] }
    | { kind: 'source-photo-alpha-restoration'; receiptPath: string; promotedFrom: string; reviewedSources: ReviewedSource[]; parentImage: GalleryReceiptImage };
}
export interface SourceArtworkReview {
  status: string;
  reviewedImages?: string[];
  evidenceFile?: string;
  reviewedBy?: string;
  reviewedImageHashes?: Record<string, string>;
}
interface CompositeReceipt {
  schema_version: string;
  method: string;
  sku: string;
  config: { path: string; sha256: string };
  toolkit: { path: string; sha256: string };
  base: Asset;
  sources: Asset[];
  final: Asset;
  review: { source_and_base_viewed: boolean; reviewer: string; viewed_at: string };
  patches: Array<{ id: string; source_path: string; source_sha256: string; source_quad: number[][]; target_quad: number[][]; source_polygon: number[][]; inverse_homography: number[]; affected_pixels: number; opacity: number; feather_px: number }>;
}
export const sha256 = (bytes: Uint8Array): string => createHash('sha256').update(bytes).digest('hex');
const check = (condition: unknown, message: string): void => { if (!condition) throw new Error(message); };
const readJson = async <T>(path: string): Promise<T> => JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, '')) as T;
const within = (root: string, path: string): boolean => {
  const rel = relative(root, path);
  return !!rel && rel !== '..' && !rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && !isAbsolute(rel);
};
async function samePath(first: string, second: string): Promise<boolean> {
  return await realpath(resolve(first)) === await realpath(resolve(second));
}
async function assetMatches(asset: Asset): Promise<void> {
  check(typeof asset?.path === 'string' && isAbsolute(asset.path), 'Provenance asset requires an absolute path');
  check(/^[a-f0-9]{64}$/.test(asset.sha256), 'Invalid provenance SHA-256');
  const bytes = await readFile(asset.path);
  check(sha256(bytes) === asset.sha256, `Provenance hash mismatch: ${asset.path}`);
  const metadata = await sharp(bytes).metadata();
  check(metadata.autoOrient.width === asset.dimensions?.width && metadata.autoOrient.height === asset.dimensions?.height, `Provenance dimensions mismatch: ${asset.path}`);
}

/** Validate the entire four-file review before accepting any composite in a set. */
export async function validateCompositeArtworkReview(skuRoot: string, review: SourceArtworkReview | undefined): Promise<void> {
  check(review && ['matched', 'matched-components', 'different-revision'].includes(review.status)
    && typeof review.reviewedBy === 'string' && review.reviewedBy.trim()
    && galleryFiles.every(file => review.reviewedImages?.includes(file)), 'Composite requires same-owner artwork review of all four final images');
  for (const file of galleryFiles) {
    check(review?.reviewedImageHashes?.[file] === sha256(await readFile(join(skuRoot, file))), `Artwork review hash does not match final image: ${file}`);
  }
}

interface ProvenanceOptions {
  jobRoot: string; skuRoot: string; sku: string; image: GalleryReceiptImage; imageGenRoot: string;
  toolkitPath: string; artworkReview?: SourceArtworkReview; owners: Map<string, string>;
}

type ParentRecord = { receipt_path: string; receipt_sha256: string; candidate_path: string; candidate_sha256: string };
type OwnerReview = { source_and_base_viewed: boolean; reviewer: string; viewed_at: string };
interface AlphaReceipt {
  schema_version: string; method: string; sku: string;
  config: { path: string; sha256: string }; toolkit: { path: string; sha256: string };
  parent: ParentRecord; source: Asset; final: Asset;
  source_quad: number[][]; target_quad: number[][]; inverse_homography: number[];
  review: OwnerReview; decoded_rgb_sha256: string; alpha_sha256: string;
}

async function validateAlphaRestoration(options: ProvenanceOptions): Promise<void> {
  const { image, sku, skuRoot, jobRoot, artworkReview, toolkitPath } = options;
  const provenance = image.provenance;
  check(provenance?.kind === 'source-photo-alpha-restoration', 'Unknown alpha provenance kind');
  if (provenance?.kind !== 'source-photo-alpha-restoration') return;
  check(image.file === '01-studio.png', 'Source-photo alpha restoration is studio-only');
  check(image.qa?.accepted === true && image.qa.visuallyInspected === true, 'Alpha restoration requires final visual acceptance');
  await validateCompositeArtworkReview(skuRoot, artworkReview);
  const helperPath = join(dirname(toolkitPath), 'source-photo-alpha.py');
  const approval = await readJson<{
    schema_version: string; approved: boolean; approvedBy: string; approvedAt: string; method: string;
    toolkit: { path: string; sha256: string }; skus: string[]; owners: Record<string, string>;
  }>(join(jobRoot, 'source-photo-alpha-approval.json'));
  const method = 'deterministic-original-photo-alpha-homography';
  check(approval.schema_version === 'source-photo-alpha-approval/v1' && approval.approved === true
    && approval.approvedBy === 'user' && Number.isFinite(Date.parse(approval.approvedAt))
    && approval.method === method && approval.skus?.includes(sku), 'Missing explicit user approval for this alpha restoration SKU');
  check(approval.owners?.[sku] === `/root/sku_${sku}` && artworkReview?.reviewedBy === approval.owners[sku], 'Alpha reviewer does not match the existing SKU owner');
  check(await samePath(approval.toolkit.path, helperPath) && sha256(await readFile(helperPath)) === approval.toolkit.sha256, 'Approved alpha helper path or hash mismatch');
  const actualSkuRoot = await realpath(skuRoot);
  const receiptPath = await realpath(provenance.receiptPath);
  check(within(actualSkuRoot, receiptPath), 'Alpha receipt is outside its SKU folder');
  const receipt = await readJson<AlphaReceipt>(receiptPath);
  check(receipt.schema_version === 'source-photo-alpha-receipt/v1' && receipt.method === method && receipt.sku === sku, 'Alpha receipt identity or method mismatch');
  check(await samePath(receipt.toolkit.path, helperPath) && receipt.toolkit.sha256 === approval.toolkit.sha256, 'Alpha receipt helper mismatch');
  const configPath = await realpath(receipt.config.path);
  check(within(actualSkuRoot, configPath) && sha256(await readFile(configPath)) === receipt.config.sha256, 'Alpha configuration path or hash mismatch');
  const config = await readJson<{
    schema_version: string; sku: string; parent: ParentRecord; source: { path: string; sha256: string };
    source_quad: number[][]; target_quad: number[][]; output_path: string; receipt_path: string; review: OwnerReview;
  }>(configPath);
  const configuredPath = (path: string) => resolve(dirname(configPath), path);
  check(config.schema_version === 'source-photo-alpha/v1' && config.sku === sku, 'Alpha configuration identity mismatch');
  const candidatePath = await realpath(receipt.final.path);
  check(within(actualSkuRoot, candidatePath) && await samePath(provenance.promotedFrom, candidatePath)
    && await samePath(configuredPath(config.output_path), candidatePath)
    && await samePath(configuredPath(config.receipt_path), receiptPath), 'Alpha final/promotion/configuration paths mismatch');
  await assetMatches(receipt.final);
  check(sha256(await readFile(join(skuRoot, image.file))) === receipt.final.sha256, 'Alpha candidate differs from the stable final');
  for (const field of ['receipt_path', 'candidate_path'] as const) {
    check(await samePath(configuredPath(config.parent[field]), receipt.parent[field]), 'Alpha parent configuration path mismatch');
    check(within(actualSkuRoot, await realpath(receipt.parent[field])), 'Alpha parent is outside its SKU folder');
  }
  check(config.parent.receipt_sha256 === receipt.parent.receipt_sha256 && config.parent.candidate_sha256 === receipt.parent.candidate_sha256
    && sha256(await readFile(receipt.parent.receipt_path)) === receipt.parent.receipt_sha256
    && sha256(await readFile(receipt.parent.candidate_path)) === receipt.parent.candidate_sha256, 'Alpha parent evidence hash mismatch');
  const parentImage = provenance.parentImage;
  check(parentImage?.provenance?.kind === 'source-preserving-composite', 'Alpha restoration requires an original v1 composite parent');
  check(parentImage.file === basename(receipt.parent.candidate_path)
    && await samePath(join(skuRoot, parentImage.file), receipt.parent.candidate_path)
    && !!parentImage.originalPath && !!image.originalPath && await samePath(parentImage.originalPath, image.originalPath)
    && await samePath(parentImage.provenance!.receiptPath, receipt.parent.receipt_path), 'Alpha parent image does not match the original v1 chain');
  await validateGalleryProvenance({ ...options, image: parentImage });
  await assetMatches(receipt.source);
  const sourcePath = await realpath(receipt.source.path);
  check(within(actualSkuRoot, sourcePath)
    && /^(source(?:-original)?\.(png|webp|jpe?g)|api-reference\.(png|webp|jpe?g)|source-detail-.+\.(png|webp|jpe?g))$/i.test(basename(sourcePath)), 'Alpha source is not an own-SKU exact photograph');
  check(await samePath(configuredPath(config.source.path), sourcePath) && config.source.sha256 === receipt.source.sha256, 'Alpha source configuration mismatch');
  const sources = provenance.reviewedSources;
  check(sources?.length === 1 && await samePath(sources[0].path, sourcePath)
    && sources[0].sha256 === receipt.source.sha256 && sources[0].scope === 'exact-package' && sources[0].status === 'matched'
    && sources[0].reviewer === approval.owners[sku] && typeof sources[0].notes === 'string' && sources[0].notes.trim(), 'Alpha source identity/reviewer qualification is missing');
  check(config.review?.source_and_base_viewed === true && config.review.reviewer === approval.owners[sku]
    && Number.isFinite(Date.parse(config.review.viewed_at)) && JSON.stringify(receipt.review) === JSON.stringify(config.review), 'Alpha source/base review mismatch');
  check(JSON.stringify(receipt.source_quad) === JSON.stringify(config.source_quad)
    && JSON.stringify(receipt.target_quad) === JSON.stringify(config.target_quad)
    && receipt.inverse_homography?.length === 8 && receipt.inverse_homography.every(Number.isFinite), 'Alpha geometry receipt differs from its configuration');
  for (const input of [sourcePath, receipt.parent.candidate_path, receipt.parent.receipt_path, configPath, receiptPath, helperPath, toolkitPath]) {
    check(!await samePath(input, candidatePath), 'Alpha candidate aliases a protected input');
  }
  const parentRgb = await sharp(receipt.parent.candidate_path).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const finalRgb = await sharp(candidatePath).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  check(parentRgb.info.channels === 3 && finalRgb.info.channels === 3
    && parentRgb.info.width === finalRgb.info.width && parentRgb.info.height === finalRgb.info.height
    && parentRgb.data.equals(finalRgb.data) && sha256(finalRgb.data) === receipt.decoded_rgb_sha256, 'Alpha restoration changed parent RGB pixels or dimensions');
  const finalAlpha = await sharp(candidatePath).rotate().extractChannel('alpha').raw().toBuffer();
  const sourceAlpha = await sharp(sourcePath).rotate().extractChannel('alpha').raw().toBuffer();
  check(new Set(finalAlpha).size > 1 && new Set(sourceAlpha).size > 1 && sha256(finalAlpha) === receipt.alpha_sha256, 'Alpha restoration requires genuine varying source/final alpha');
  const python = process.platform === 'win32'
    ? join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe') : 'python3';
  try {
    const { stdout } = await promisify(execFile)(python, [helperPath, '--verify', configPath, receiptPath, candidatePath], { windowsHide: true, timeout: 60_000, maxBuffer: 64 * 1024 });
    const verified = JSON.parse(stdout) as { verified: boolean; method: string; sku: string; final_sha256: string; decoded_rgb_sha256: string; alpha_sha256: string; writes: number };
    check(verified.verified === true && verified.method === method && verified.sku === sku && verified.writes === 0
      && verified.final_sha256 === receipt.final.sha256 && verified.decoded_rgb_sha256 === receipt.decoded_rgb_sha256
      && verified.alpha_sha256 === receipt.alpha_sha256, 'Alpha replay verification response mismatch');
  } catch (error) {
    throw new Error('Pinned alpha helper could not verify deterministic geometry and pixels', { cause: error });
  }
}

export async function validateGalleryProvenance(options: ProvenanceOptions): Promise<void> {
  const { jobRoot, skuRoot, sku, image, imageGenRoot, toolkitPath, artworkReview, owners } = options;
  check(!!image.originalPath, `Missing ImageGen original provenance: ${image.file}`);
  const originalPath = await realpath(resolve(image.originalPath!));
  check(within(await realpath(imageGenRoot), originalPath), `Original is outside the ImageGen output folder: ${image.file}`);
  const originalHash = sha256(await readFile(originalPath));
  const finalPath = join(skuRoot, image.file);
  const finalHash = sha256(await readFile(finalPath));
  if (!image.provenance) {
    check(originalHash === finalHash, `Final PNG differs from its recorded ImageGen original: ${image.file}`);
  } else if (image.provenance.kind === 'source-photo-alpha-restoration') {
    await validateAlphaRestoration(options);
  } else {
    check(image.provenance.kind === 'source-preserving-composite', 'Unknown image provenance kind');
    const approval = await readJson<{
      schema_version: string; approved: boolean; approvedBy: string; approvedAt: string; method: string;
      toolkit: { path: string; sha256: string }; skus: string[]; owners: Record<string, string>;
    }>(join(jobRoot, 'source-preserving-approval.json'));
    check(approval.schema_version === 'source-preserving-approval/v1' && approval.approved === true
      && approval.approvedBy === 'user' && Number.isFinite(Date.parse(approval.approvedAt))
      && approval.method === compositeMethod && approval.skus?.includes(sku), 'Missing explicit user approval for this composite SKU');
    check(await samePath(approval.toolkit.path, toolkitPath), 'Approval does not pin the repository composite toolkit');
    check(sha256(await readFile(toolkitPath)) === approval.toolkit.sha256, 'Approved composite toolkit has changed');
    check(image.qa?.accepted === true && image.qa.visuallyInspected === true, 'Composite requires final visual acceptance');
    check(!!artworkReview?.reviewedBy, 'Composite requires a named same-owner reviewer');
    check(approval.owners?.[sku] === `/root/sku_${sku}` && approval.owners[sku] === artworkReview?.reviewedBy, 'Composite reviewer does not match the existing SKU owner');
    const receiptPath = await realpath(resolve(image.provenance.receiptPath));
    check(within(await realpath(skuRoot), receiptPath), 'Composite receipt is outside its SKU folder');
    const receipt = await readJson<CompositeReceipt>(receiptPath);
    check(receipt.schema_version === 'source-preserving-composite-receipt/v1' && receipt.method === compositeMethod && receipt.sku === sku, 'Composite receipt identity or method mismatch');
    check(await samePath(receipt.toolkit.path, toolkitPath) && receipt.toolkit.sha256 === approval.toolkit.sha256, 'Composite receipt toolkit mismatch');
    check(await samePath(receipt.base.path, originalPath), 'Composite base differs from its recorded ImageGen original');
    const candidatePath = await realpath(receipt.final.path);
    check(within(await realpath(skuRoot), candidatePath), 'Composite candidate is outside its SKU folder');
    const isStableOutput = await samePath(candidatePath, finalPath);
    if (!isStableOutput) check(!!image.provenance.promotedFrom && await samePath(image.provenance.promotedFrom, candidatePath), 'Composite receipt does not name the actual stable final or exact promoted candidate');
    else if (image.provenance.promotedFrom) check(await samePath(image.provenance.promotedFrom, candidatePath), 'Composite promotedFrom differs from its candidate');
    await assetMatches(receipt.base);
    await assetMatches(receipt.final);
    check(receipt.base.sha256 === originalHash && receipt.final.sha256 === finalHash, 'Composite base or final hash mismatch');
    const stableMetadata = await sharp(await readFile(finalPath)).metadata();
    check(stableMetadata.autoOrient.width === receipt.final.dimensions.width && stableMetadata.autoOrient.height === receipt.final.dimensions.height, 'Promoted final dimensions mismatch');
    check(receipt.base.dimensions.width === receipt.final.dimensions.width && receipt.base.dimensions.height === receipt.final.dimensions.height, 'Composite changed base dimensions');
    check(within(await realpath(skuRoot), await realpath(receipt.config.path)), 'Composite configuration is outside its SKU folder');
    check(sha256(await readFile(receipt.config.path)) === receipt.config.sha256, 'Composite configuration hash mismatch');
    const config = await readJson<{
      schema_version: string; sku: string; imagegen_base: { path: string }; output_path: string; receipt_path: string;
      review: { source_and_base_viewed: boolean; reviewer: string; viewed_at: string };
      patches: Array<{ id: string; source_path: string; source_quad: number[][]; target_quad: number[][]; source_polygon?: number[][]; opacity?: number; feather_px?: number }>;
    }>(receipt.config.path);
    const configPath = (path: string) => resolve(dirname(receipt.config.path), path);
    check(config.schema_version === 'source-preserving-composite/v1' && config.sku === sku, 'Composite configuration identity mismatch');
    check(await samePath(configPath(config.imagegen_base.path), originalPath) && await samePath(configPath(config.output_path), candidatePath)
      && await samePath(configPath(config.receipt_path), receiptPath), 'Composite configuration paths mismatch');
    for (const input of [originalPath, receipt.config.path, toolkitPath, receiptPath]) {
      check(!await samePath(input, candidatePath), 'Composite candidate aliases a protected input');
    }
    check(config.review?.source_and_base_viewed === true && config.review.reviewer === artworkReview?.reviewedBy
      && Number.isFinite(Date.parse(config.review.viewed_at)), 'Composite source/base review does not match the SKU owner');
    check(receipt.review?.source_and_base_viewed === true && receipt.review.reviewer === config.review.reviewer
      && receipt.review.viewed_at === config.review.viewed_at, 'Composite receipt review differs from its configuration');
    check(Array.isArray(receipt.sources) && receipt.sources.length > 0 && config.patches?.length > 0, 'Composite has no source patches');
    const reviewedSources = image.provenance.reviewedSources;
    check(Array.isArray(reviewedSources) && reviewedSources.length === receipt.sources.length, 'Composite sources lack individual identity reviews');
    const sourcePaths = new Set<string>();
    for (const source of receipt.sources) {
      await assetMatches(source);
      const sourcePath = await realpath(source.path);
      check(sourcePath !== candidatePath, 'Composite candidate aliases a source');
      check(!sourcePaths.has(sourcePath), 'Repeated composite source');
      sourcePaths.add(sourcePath);
      const review = reviewedSources.find(entry => resolve(entry.path) === resolve(source.path) && entry.sha256 === source.sha256);
      check(review && ['matched', 'matched-components'].includes(review.status) && review.reviewer === artworkReview?.reviewedBy
        && typeof review.notes === 'string' && review.notes.trim(), 'Composite source identity/revision review is missing');
      const ownReference = within(await realpath(skuRoot), sourcePath)
        && /^(source(?:-original)?\.(png|webp|jpe?g)|api-reference\.(png|webp|jpe?g)|source-detail-.+\.(png|webp|jpe?g))$/i.test(basename(sourcePath));
      const componentRoot = join(await realpath(jobRoot), 'artwork-source-recovery', sku);
      const ownComponent = within(componentRoot, sourcePath) && within(await realpath(jobRoot), sourcePath);
      check((review?.scope === 'exact-package' && ownReference)
        || (review?.scope === 'qualified-component' && (ownReference || ownComponent)), 'Composite source is not a reviewed own-SKU reference or qualified component');
    }
    const patchPaths = await Promise.all(config.patches.map(patch => realpath(configPath(patch.source_path))));
    check(patchPaths.every(path => sourcePaths.has(path)) && [...sourcePaths].every(path => patchPaths.includes(path)), 'Composite patch sources disagree with provenance receipt');
    check(Array.isArray(receipt.patches) && receipt.patches.length === config.patches.length
      && new Set(receipt.patches.map(patch => patch.id)).size === receipt.patches.length, 'Composite patch receipt is incomplete');
    for (const [index, patch] of config.patches.entries()) {
      const recorded = receipt.patches[index];
      const source = receipt.sources.find(asset => resolve(asset.path) === resolve(recorded.source_path));
      check(recorded.id === patch.id && await samePath(recorded.source_path, configPath(patch.source_path))
        && recorded.source_sha256 === source?.sha256, 'Composite patch receipt source mismatch');
      check(JSON.stringify(recorded.source_quad) === JSON.stringify(patch.source_quad)
        && JSON.stringify(recorded.target_quad) === JSON.stringify(patch.target_quad)
        && JSON.stringify(recorded.source_polygon) === JSON.stringify(patch.source_polygon ?? patch.source_quad)
        && recorded.opacity === (patch.opacity ?? 1) && recorded.feather_px === (patch.feather_px ?? 0)
        && recorded.affected_pixels > 0 && recorded.inverse_homography?.length === 8
        && recorded.inverse_homography.every(Number.isFinite), 'Composite patch transform differs from its configuration');
    }
  }
  for (const hash of new Set([originalHash, finalHash])) {
    const owner = owners.get(hash);
    check(!owner || owner === sku, `An ImageGen output was reused from SKU ${owner}: ${image.file}`);
  }
  owners.set(originalHash, sku);
  owners.set(finalHash, sku);
}
