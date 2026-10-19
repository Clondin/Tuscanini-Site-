import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFile, realpath } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { promisify } from 'node:util';
import sharp from 'sharp';

/** Additive story-only validation. Old gallery/v1 validation remains independent. */
export const storyFiles = ['01-studio.png', '02-use.png', '03-occasion.png', '04-family.png'];
export const storyCompositeMethod = 'deterministic-original-photo-homography-v2';
const rendererSha = 'a93724364d50bbf3ff8eb37466e2cb2540a417002f08bfb3dd65d0791a7506da';
type Pin = { path: string; sha256: string };
type Asset = Pin & { dimensions: { width: number; height: number } };
export type StoryRole = 'product' | 'use' | 'occasion' | 'family';
export type StorySourceReview = Pin & {
  sourceSku: string; scope: 'exact-package' | 'qualified-component';
  status: 'matched' | 'matched-components'; reviewer: string; notes: string;
};
export interface StoryCompositeImage {
  file: string;
  originalPath?: string;
  qa?: { accepted?: boolean; visuallyInspected?: boolean; reviewedBy?: string };
  provenance?: {
    kind: 'source-preserving-story-composite'; receiptPath: string;
    promotedFrom?: string; reviewedSources: StorySourceReview[];
  };
}
export interface StoryArtworkReview {
  status: string; reviewedImages?: string[]; reviewedImageHashes?: Record<string, string>;
  reviewedBy?: string; evidenceFile?: string;
}
export interface StoryProvenanceOptions {
  jobRoot: string; skuRoot: string; sku: string; role: StoryRole; image: StoryCompositeImage;
  imageGenRoot: string; toolkitPath: string; owners: Map<string, string>;
  artworkReview?: StoryArtworkReview; expectedFiles?: string[];
}
type Source = Asset & Omit<StorySourceReview, 'sourceSku'> & { source_sku: string };
interface Receipt {
  schema_version: string; method: string; sku: string; role: StoryRole;
  config: Pin; approval: Pin; creativePlan: Pin; toolkit: Pin; renderer: Pin;
  base: Asset; final: Asset; sources: Source[];
  assignment: { heroSku: string; companionSkus: string[] };
  review: { source_and_base_viewed: boolean; reviewer: string; viewed_at: string };
  decoded_rgba_sha256: string; identity_verified: boolean;
}
interface Approval {
  schema_version: string; approved: boolean; approvedBy: string; approvedAt: string; method: string;
  toolkit: Pin; renderer: Pin; creativePlan: Pin; skus: string[]; owners: Record<string, string>;
  sourceRoots: Record<string, string>; componentRoots?: Record<string, string>;
  sourceCatalog: Record<string, Array<Pin & { scope: string; status: string; reviewer: string; notes: string }>>;
}
const check: (value: unknown, message: string) => asserts value = (value, message) => { if (!value) throw new Error(message); };
const hash = (data: Uint8Array): string => createHash('sha256').update(data).digest('hex');
const fileHash = async (path: string): Promise<string> => hash(await readFile(path));
const json = async <T>(path: string): Promise<T> => JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, '')) as T;
const within = (root: string, path: string): boolean => {
  const rel = relative(root, path);
  return !!rel && rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
};
const actual = async (path: string): Promise<string> => { check(typeof path === 'string' && isAbsolute(path), 'Absolute provenance path required'); return realpath(path); };
async function pin(record: Pin): Promise<string> {
  const path = await actual(record?.path);
  check(/^[a-f0-9]{64}$/.test(record.sha256) && await fileHash(path) === record.sha256, `Pinned file hash mismatch: ${path}`);
  return path;
}
async function asset(record: Asset): Promise<string> {
  const path = await pin(record);
  const meta = await sharp(path).metadata();
  check(meta.autoOrient.width === record.dimensions?.width && meta.autoOrient.height === record.dimensions?.height, `Asset dimensions mismatch: ${path}`);
  return path;
}

export async function validateStoryArtworkReview(skuRoot: string, review: StoryArtworkReview | undefined, expectedFiles = storyFiles): Promise<void> {
  check(expectedFiles.length === 4 && new Set(expectedFiles).size === 4 && expectedFiles.every(f => basename(f) === f), 'Expected four distinct simple image names');
  check(review && ['matched', 'matched-components', 'different-revision'].includes(review.status)
    && !!review.reviewedBy?.trim() && expectedFiles.every(f => review.reviewedImages?.includes(f)), 'Story composite requires owner artwork review of all four final images');
  for (const file of expectedFiles) {
    const path = await realpath(join(skuRoot, file));
    check(within(await realpath(skuRoot), path), 'Reviewed image escapes SKU folder');
    check(review.reviewedImageHashes?.[file] === await fileHash(path), `Story artwork review hash mismatch: ${file}`);
  }
}

/** Validates a v2 composite and its byte-identical promoted copy; does not publish or mutate files.
 * Family identity review of all three visible products is a separate importer gate.
 */
export async function validateStoryCompositeProvenance(options: StoryProvenanceOptions): Promise<void> {
  const { sku, role, image, owners, artworkReview } = options;
  check(/^\d+$/.test(sku) && ['product', 'use', 'occasion', 'family'].includes(role), 'Invalid story SKU/role');
  const expectedFiles = options.expectedFiles ?? storyFiles;
  check(image.file === expectedFiles[{ product: 0, use: 1, occasion: 2, family: 3 }[role]], 'Story image filename/role mismatch');
  const jobRoot = await realpath(options.jobRoot), skuRoot = await realpath(options.skuRoot);
  check(skuRoot === await realpath(join(jobRoot, 'skus', sku)), 'Story SKU root mismatch');
  check(image.qa?.accepted === true && image.qa.visuallyInspected === true, 'Final story must be visually accepted by its owner');
  await validateStoryArtworkReview(skuRoot, artworkReview, expectedFiles);
  const owner = `/root/sku_${sku}`;
  check(artworkReview?.reviewedBy === owner && (!image.qa.reviewedBy || image.qa.reviewedBy === owner), 'Story final review is not by original hero owner');
  const provenance = image.provenance;
  check(provenance?.kind === 'source-preserving-story-composite', 'Missing story composite provenance');
  const receiptPath = await actual(provenance.receiptPath);
  check(within(skuRoot, receiptPath), 'Story receipt escapes hero folder');
  const receiptHash = await fileHash(receiptPath);
  const receipt = await json<Receipt>(receiptPath);
  check(receipt.schema_version === 'source-preserving-stories-receipt/v2' && receipt.method === storyCompositeMethod
    && receipt.sku === sku && receipt.role === role && receipt.identity_verified === false, 'Story receipt schema/identity mismatch');
  const configPath = await pin(receipt.config);
  check(within(skuRoot, configPath), 'Story config escapes hero folder');
  const config = await json<{ sku: string; role: string; approval: Pin; imagegen_base: Pin; output_path: string; receipt_path: string }>(configPath);
  check(config.sku === sku && config.role === role, 'Config SKU/role mismatch');
  const configRelative = (path: string): string => resolve(dirname(configPath), path);
  const candidatePath = await asset(receipt.final);
  check(within(skuRoot, candidatePath) && await realpath(configRelative(config.output_path)) === candidatePath
    && await realpath(configRelative(config.receipt_path)) === receiptPath, 'Config final/receipt paths mismatch');
  const promoted = await realpath(join(skuRoot, image.file));
  check(within(skuRoot, promoted) && await fileHash(promoted) === receipt.final.sha256, 'Promoted story bytes differ from candidate');
  check(!provenance.promotedFrom || await actual(provenance.promotedFrom) === candidatePath, 'Promoted-from candidate mismatch');
  check(candidatePath === promoted || !!provenance.promotedFrom, 'Promoted copy needs its actual candidate path');
  const basePath = await asset(receipt.base);
  check(image.originalPath && await actual(image.originalPath) === basePath
    && within(await realpath(options.imageGenRoot), basePath), 'Story original is not its actual ImageGen raw');
  check(configRelative(config.imagegen_base.path) === basePath && config.imagegen_base.sha256 === receipt.base.sha256, 'Config raw pin mismatch');
  const approvalPath = await pin(receipt.approval);
  check(within(jobRoot, approvalPath) && await realpath(configRelative(config.approval.path)) === approvalPath
    && config.approval.sha256 === receipt.approval.sha256, 'Versioned approval must be pinned inside this job');
  const approval = await json<Approval>(approvalPath);
  check(approval.schema_version === 'source-preserving-stories-approval/v2' && approval.approved === true
    && approval.approvedBy === 'user' && Number.isFinite(Date.parse(approval.approvedAt))
    && approval.method === storyCompositeMethod && approval.skus.includes(sku) && approval.owners[sku] === owner, 'Explicit bounded story approval required');
  const toolkitPath = await pin(receipt.toolkit), rendererPath = await pin(receipt.renderer), planPath = await pin(receipt.creativePlan);
  check(toolkitPath === await actual(options.toolkitPath) && await pin(approval.toolkit) === toolkitPath
    && approval.toolkit.sha256 === receipt.toolkit.sha256, 'Story helper pin mismatch');
  check(rendererPath === await actual(join(dirname(toolkitPath), 'source-preserving-composite.py'))
    && receipt.renderer.sha256 === rendererSha && await pin(approval.renderer) === rendererPath
    && approval.renderer.sha256 === rendererSha, 'Unchanged v1 renderer pin required');
  check(await pin(approval.creativePlan) === planPath && approval.creativePlan.sha256 === receipt.creativePlan.sha256, 'Creative plan pin mismatch');
  const plan = await json<{ schema_version: string; skuAssignments: Array<{ sku: string; companionSkus: string[] }>; sourceCatalog: Record<string, unknown> }>(planPath);
  const assigned = plan.skuAssignments.filter(item => item.sku === sku);
  check(plan.schema_version === 'tuscanini-catalog-creative-reset/v1' && assigned.length === 1, 'Missing unique creative assignment');
  const companions = assigned[0].companionSkus;
  check(companions.length === 2 && new Set([sku, ...companions]).size === 3
    && [sku, ...companions].every(member => /^\d+$/.test(member) && !!plan.sourceCatalog[member])
    && receipt.assignment.heroSku === sku && JSON.stringify(receipt.assignment.companionSkus) === JSON.stringify(companions), 'Family assignment mismatch');
  check(receipt.review?.source_and_base_viewed === true && receipt.review.reviewer === owner
    && Number.isFinite(Date.parse(receipt.review.viewed_at)), 'Hero owner must review original photo and raw before compositing');
  const allowed = new Set(role === 'family' ? [sku, ...companions] : [sku]);
  check(Array.isArray(receipt.sources) && receipt.sources.length > 0 && provenance.reviewedSources?.length === receipt.sources.length, 'Consumed source reviews required');
  const sourcePaths: string[] = [], reviewedPaths = new Set<string>();
  for (const reviewed of provenance.reviewedSources) {
    const path = await actual(reviewed.path);
    check(!reviewedPaths.has(path), 'Duplicate reviewed source aliases');
    reviewedPaths.add(path);
  }
  for (const source of receipt.sources) {
    const path = await asset(source), sourceOwner = `/root/sku_${source.source_sku}`;
    check(allowed.has(source.source_sku), 'Source SKU outside this role/assigned family');
    check(!sourcePaths.includes(path), 'Duplicate consumed source aliases');
    sourcePaths.push(path);
    check(source.reviewer === owner && !!source.notes?.trim() && ['exact-package', 'qualified-component'].includes(source.scope)
      && ['matched', 'matched-components'].includes(source.status), 'Source requires original hero-owner review');
    const reviewed = provenance.reviewedSources.filter(s => s.sourceSku === source.source_sku && resolve(s.path) === path
      && s.sha256 === source.sha256 && s.scope === source.scope && s.status === source.status && s.reviewer === owner && s.notes === source.notes);
    check(reviewed.length === 1, 'Receipt source differs from accepted reviewedSources');
    const qualifications = approval.sourceCatalog[source.source_sku]?.filter(s => resolve(s.path) === path
      && s.sha256 === source.sha256 && s.scope === source.scope && s.status === source.status);
    check(qualifications?.length === 1 && qualifications[0].reviewer === sourceOwner && !!qualifications[0].notes?.trim()
      && approval.owners[source.source_sku] === sourceOwner, 'Original source-SKU qualification missing');
    const ownRoot = await actual(approval.sourceRoots[source.source_sku]);
    check(basename(ownRoot) === source.source_sku && basename(dirname(ownRoot)) === 'skus', 'Source root is not its own SKU');
    const ownPhoto = within(ownRoot, path) && /^(source(?:-original)?\.(png|webp|jpe?g)|api-reference\.(png|webp|jpe?g)|source-detail-.+\.(png|webp|jpe?g))$/i.test(basename(path));
    const componentRoot = approval.componentRoots?.[source.source_sku] ? await actual(approval.componentRoots[source.source_sku]) : undefined;
    const component = componentRoot && basename(componentRoot) === source.source_sku && within(componentRoot, path);
    check(source.scope === 'exact-package' ? ownPhoto : ownPhoto || component, 'Source violates its own qualification boundary');
  }
  const protectedPaths = [receiptPath, configPath, approvalPath, toolkitPath, rendererPath, planPath, basePath, ...sourcePaths];
  check(new Set(protectedPaths).size === protectedPaths.length && !protectedPaths.includes(candidatePath)
    && !protectedPaths.includes(promoted), 'Story output/input aliases are forbidden');
  for (const value of [receipt.base.sha256, receipt.final.sha256]) check(!owners.has(value) || owners.get(value) === sku, 'Story raw/final reused across hero SKUs');
  const python = process.platform === 'win32'
    ? join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe') : 'python3';
  const { stdout } = await promisify(execFile)(python, [toolkitPath, '--verify', configPath, receiptPath, candidatePath], {
    windowsHide: true, timeout: 120_000, maxBuffer: 64 * 1024,
  });
  const replay = JSON.parse(stdout) as { verified: boolean; sku: string; role: string; writes: number; final_sha256: string; decoded_rgba_sha256: string };
  check(replay.verified === true && replay.sku === sku && replay.role === role && replay.writes === 0
    && replay.final_sha256 === receipt.final.sha256 && replay.decoded_rgba_sha256 === receipt.decoded_rgba_sha256, 'Deterministic story pixel replay failed');
  // Detect changes made while the Python replay was running, before registering ownership.
  check(await fileHash(receiptPath) === receiptHash && await fileHash(promoted) === receipt.final.sha256, 'Story files changed during verification');
  for (const value of [receipt.base.sha256, receipt.final.sha256]) owners.set(value, sku);
}
