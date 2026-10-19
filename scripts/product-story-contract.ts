import { readFile, realpath } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import type { GalleryReceiptImage, SourceArtworkReview } from './gallery-provenance';
import { sha256, validateGalleryProvenance } from './gallery-provenance';

export const storyFiles = ['01-studio.png', '02-use.png', '03-occasion.png', '04-family.png'] as const;
export const storyRoles = ['product', 'use', 'occasion', 'family'] as const;
export type StoryRole = typeof storyRoles[number];
export interface StoryReference {
  sku: string; path: string; sha256: string; status: 'matched' | 'matched-components' | 'different-revision'; notes: string;
}
export interface StoryImage {
  file: string; role: StoryRole; originalPath: string;
  qa: { accepted: boolean; visuallyInspected: boolean };
  labelReview: { reviewedBy: string; reviewedAt: string; visiblePackageTextMatched: boolean; references: StoryReference[]; notes: string };
  provenance?: {
    kind: string; receiptPath?: string; promotedFrom?: string; reviewedSources?: Array<{
      sourceSku: string; path: string; sha256: string; scope: 'exact-package' | 'qualified-component'; status: string; reviewer: string; notes: string;
    }>;
    oldJobRoot?: string; oldSkuRoot?: string; oldReceiptPath?: string; oldImage?: GalleryReceiptImage;
  };
}
export interface StoryReceipt {
  schema_version: 'tuscanini-product-story-receipt/v1'; sku: string; status: string; images: StoryImage[];
  sourceArtworkReview: SourceArtworkReview;
  creativeReview: {
    status: string; reviewedBy: string; reviewedAt: string; evidenceFile: string;
    reviewedImages: string[]; reviewedImageHashes: Record<string, string>; companionSkus: string[];
    checks: { productIdentifiable: boolean; meaningfulUseAction: boolean; foodOrUseLeads: boolean; distinctOccasion: boolean; realProductFamily: boolean; heroLeadsFamily: boolean; distinctThumbnailRoles: boolean };
  };
}
export interface StoryPlanItem {
  sku: string; id: string; name: string; owner: { taskName: string; threadId: string };
  creative: { companions: Array<{ sku: string; name: string; sourcePath: string }> };
  retainedStudio: { path: string; exists: boolean; sha256: string | null; acceptedInOldReceipt: boolean; oldReceiptPath: string };
  sourceAuthority: { primaryReferencePath: string; excludedApiReferencePath?: string; packageSizeAuthority?: unknown };
}
export interface StoryPlan { oldJobRoot: string; items: StoryPlanItem[] }
export const readStoryJson = async <T>(path: string): Promise<T> => JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, '')) as T;
export function requireStory(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const exactSet = (first: string[], second: readonly string[]) => first.length === second.length && new Set(first).size === first.length && first.every(value => second.includes(value));
export function insideStoryRoot(root: string, path: string): boolean {
  const value = relative(root, path);
  return !!value && value !== '..' && !value.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && !isAbsolute(value);
}

/** Review identity, roles, labels and hash bindings before exporting a complete new set. */
export async function validateStoryReview(options: { jobRoot: string; skuRoot: string; item: StoryPlanItem; plan: StoryPlan; receipt: StoryReceipt }): Promise<void> {
  const { skuRoot, item, plan, receipt } = options;
  const owner = `/root/sku_${item.sku}`;
  requireStory(item.owner.taskName === owner && receipt.schema_version === 'tuscanini-product-story-receipt/v1' && receipt.sku === item.sku && receipt.status === 'ready', 'Story receipt identity, owner or schema does not match');
  requireStory(Array.isArray(receipt.images) && receipt.images.length === 4 && exactSet(receipt.images.map(image => image.file), storyFiles), 'Story requires exactly the four new canonical images');
  const artwork = receipt.sourceArtworkReview;
  const creative = receipt.creativeReview;
  requireStory(artwork && ['matched', 'matched-components', 'different-revision'].includes(artwork.status) && artwork.reviewedBy === owner && exactSet(artwork.reviewedImages ?? [], storyFiles), 'All four new images require same-owner package artwork review');
  requireStory(creative?.status === 'accepted' && creative.reviewedBy === owner && Number.isFinite(Date.parse(creative.reviewedAt)) && exactSet(creative.reviewedImages ?? [], storyFiles), 'Missing same-owner creative acceptance of the four roles');
  const requiredChecks = ['productIdentifiable', 'meaningfulUseAction', 'foodOrUseLeads', 'distinctOccasion', 'realProductFamily', 'heroLeadsFamily', 'distinctThumbnailRoles'] as const;
  requireStory(requiredChecks.every(key => creative.checks?.[key] === true), 'The four shopper roles have not passed creative review');
  const companions = item.creative.companions.map(entry => entry.sku);
  requireStory(companions.length === 2 && !companions.includes(item.sku) && new Set(companions).size === 2 && exactSet(creative.companionSkus ?? [], companions), 'Product family differs from the approved real companions');
  for (const evidenceFile of [creative.evidenceFile, artwork.evidenceFile]) {
    requireStory(typeof evidenceFile === 'string' && !!evidenceFile.trim(), 'Review evidence file is missing');
    const path = await realpath(isAbsolute(evidenceFile) ? evidenceFile : join(skuRoot, evidenceFile));
    requireStory(insideStoryRoot(await realpath(skuRoot), path) && (await readFile(path)).length > 0, 'Review evidence must be a nonempty file within this SKU');
  }
  for (const [index, file] of storyFiles.entries()) {
    const image = receipt.images.find(entry => entry.file === file)!;
    requireStory(image.role === storyRoles[index] && image.qa?.accepted === true && image.qa.visuallyInspected === true, `Missing final visual acceptance for ${file}`);
    const digest = sha256(await readFile(join(skuRoot, file)));
    requireStory(artwork.reviewedImageHashes?.[file] === digest && creative.reviewedImageHashes?.[file] === digest, `Final pixels changed after the package/creative review: ${file}`);
    const label = image.labelReview;
    const expectedMembers = index === 3 ? [item.sku, ...companions] : [item.sku];
    requireStory(label?.reviewedBy === owner && Number.isFinite(Date.parse(label.reviewedAt)) && label.visiblePackageTextMatched === true && typeof label.notes === 'string' && !!label.notes.trim(), `Labels require a named source comparison: ${file}`);
    requireStory(Array.isArray(label.references) && expectedMembers.every(sku => label.references.some(reference => reference.sku === sku)) && label.references.every(reference => expectedMembers.includes(reference.sku)), `Label references do not cover the actual visible product family: ${file}`);
    for (const memberSku of expectedMembers) {
      const primary = await realpath(plan.items.find(entry => entry.sku === memberSku)!.sourceAuthority.primaryReferencePath);
      const primaryHash = sha256(await readFile(primary));
      let primaryCompared = false;
      for (const reference of label.references.filter(entry => entry.sku === memberSku)) {
        const path = await realpath(reference.path);
        // Original-preservation copies can have different own-SKU names but identical source bytes.
        if (path === primary || sha256(await readFile(path)) === primaryHash) primaryCompared = true;
      }
      requireStory(primaryCompared, `Visible package was not compared with its approved primary photograph: ${memberSku}`);
    }
    const duplicateReferences = new Set<string>();
    for (const reference of label.references) {
      const member = plan.items.find(entry => entry.sku === reference.sku);
      requireStory(member && /^[a-f0-9]{64}$/.test(reference.sha256) && ['matched', 'matched-components', 'different-revision'].includes(reference.status) && typeof reference.notes === 'string' && !!reference.notes.trim(), 'Invalid label identity/revision reference');
      const path = await realpath(resolve(reference.path));
      const expectedPrimary = await realpath(member.sourceAuthority.primaryReferencePath);
      const componentRoot = join(await realpath(plan.oldJobRoot), 'artwork-source-recovery', member.sku);
      const memberRoot = join(await realpath(plan.oldJobRoot), 'skus', member.sku);
      const qualifiedPath = path === expectedPrimary || insideStoryRoot(componentRoot, path)
        || (insideStoryRoot(memberRoot, path) && /^(source(?:-original)?\.(png|webp|jpe?g)|api-reference\.(png|webp|jpe?g)|source-detail-.+\.(png|webp|jpe?g))$/i.test(path.split(/[\\/]/).at(-1)!));
      requireStory(qualifiedPath, 'Label reference does not belong to the declared source SKU');
      if (member.sourceAuthority.excludedApiReferencePath) requireStory(path !== await realpath(member.sourceAuthority.excludedApiReferencePath), 'Known incorrect API image cannot qualify package labels');
      requireStory(sha256(await readFile(path)) === reference.sha256, 'Label source reference hash changed');
      const key = `${reference.sku}:${path}`;
      requireStory(!duplicateReferences.has(key), 'Repeated label source reference');
      duplicateReferences.add(key);
    }
  }
}

/** Retaining a studio preserves its whole original chain; it does not transfer scene acceptance. */
export async function validateRetainedStoryStudio(options: { item: StoryPlanItem; plan: StoryPlan; skuRoot: string; image: StoryImage; imageGenRoot: string; owners: Map<string, string>; toolkitPath: string }): Promise<void> {
  const { item, plan, skuRoot, image, imageGenRoot, owners, toolkitPath } = options;
  requireStory(image.file === storyFiles[0] && image.role === 'product' && image.provenance?.kind === 'retained-reviewed-studio', 'Only the exact previous studio may use retained provenance');
  const record = item.retainedStudio;
  requireStory(record.exists && record.acceptedInOldReceipt && !!record.sha256, 'There is no accepted original studio to retain');
  const oldJobRoot = await realpath(plan.oldJobRoot);
  const oldSkuRoot = await realpath(join(oldJobRoot, 'skus', item.sku));
  const oldReceiptPath = await realpath(record.oldReceiptPath);
  const proof = image.provenance;
  requireStory(proof.oldJobRoot && await realpath(proof.oldJobRoot) === oldJobRoot && proof.oldSkuRoot && await realpath(proof.oldSkuRoot) === oldSkuRoot && proof.oldReceiptPath && await realpath(proof.oldReceiptPath) === oldReceiptPath, 'Retained studio points to a different source job or SKU');
  requireStory(dirname(oldReceiptPath) === oldSkuRoot, 'Original studio receipt is outside its exact SKU');
  const oldReceipt = await readStoryJson<{ sku: string; images: GalleryReceiptImage[]; sourceArtworkReview?: SourceArtworkReview }>(oldReceiptPath);
  requireStory(oldReceipt.sku === item.sku, 'Original studio receipt SKU mismatch');
  const oldImage = oldReceipt.images.find(entry => entry.file === storyFiles[0]);
  requireStory(oldImage?.qa?.accepted === true && isDeepStrictEqual(proof.oldImage, oldImage), 'Retained studio metadata differs from its actual accepted original');
  requireStory(image.originalPath && oldImage.originalPath && await realpath(image.originalPath) === await realpath(oldImage.originalPath), 'Retained studio raw ImageGen path mismatch');
  const oldBytes = await readFile(record.path);
  requireStory(await realpath(record.path) === await realpath(join(oldSkuRoot, image.file)), 'Retained studio is not the actual old canonical studio');
  requireStory(sha256(oldBytes) === record.sha256 && sha256(await readFile(join(skuRoot, image.file))) === record.sha256, 'Retained studio pixels changed');
  await validateGalleryProvenance({ jobRoot: oldJobRoot, skuRoot: oldSkuRoot, sku: item.sku, image: oldImage, imageGenRoot, toolkitPath, artworkReview: oldReceipt.sourceArtworkReview, owners });
}

/** A newly discovered studio label error needs a separate, hash-bound root review. */
export async function validateStoryStudioCorrection(options: { jobRoot: string; item: StoryPlanItem; plan: StoryPlan; skuRoot: string; image: StoryImage; imageGenRoot: string; owners: Map<string, string>; toolkitPath: string }): Promise<void> {
  const { jobRoot, item, plan, skuRoot, image } = options;
  requireStory(image.file === storyFiles[0] && image.role === 'product' && image.provenance?.kind === 'source-preserving-story-composite', 'Studio correction requires the source-photo composite contract');
  const approval = await readStoryJson<{
    schema_version: string; approved: boolean; reviewedBy: string; reviewedAt: string; sku: string;
    owner: string; ownerThreadId: string; method: string; nativeStudioCallsAllowed: number;
    oldStudioSha256: string; sourcePath: string; sourceSha256: string;
    issueEvidenceFile: string; issueEvidenceSha256: string; userAuthorizationSha256: string; reason: string;
  }>(join(skuRoot, 'studio-correction-authorization.json'));
  requireStory(approval.schema_version === 'tuscanini-reviewed-studio-correction/v1' && approval.approved === true && approval.reviewedBy === '/root'
    && Number.isFinite(Date.parse(approval.reviewedAt)) && approval.sku === item.sku && approval.owner === item.owner.taskName && approval.ownerThreadId === item.owner.threadId
    && approval.method === 'source-photo-only-existing-native-studio' && approval.nativeStudioCallsAllowed === 0 && !!approval.reason?.trim(), 'Missing exact-SKU root authorization for the discovered studio error');
  const authorizationPath = join(jobRoot, 'user-authorization.json');
  const authorization = await readStoryJson<{ approved: boolean; approvedBy: string }>(authorizationPath);
  requireStory(authorization.approved === true && authorization.approvedBy === 'user' && sha256(await readFile(authorizationPath)) === approval.userAuthorizationSha256, 'Studio correction lost the user commission authorization');
  const source = await realpath(item.sourceAuthority.primaryReferencePath);
  requireStory(await realpath(approval.sourcePath) === source && sha256(await readFile(source)) === approval.sourceSha256, 'Studio correction primary source changed');
  const evidence = await realpath(resolve(skuRoot, approval.issueEvidenceFile));
  requireStory(insideStoryRoot(await realpath(skuRoot), evidence) && (await readFile(evidence)).length > 0 && sha256(await readFile(evidence)) === approval.issueEvidenceSha256, 'Studio correction issue evidence changed or escapes its SKU');
  requireStory(approval.oldStudioSha256 === item.retainedStudio.sha256 && sha256(await readFile(item.retainedStudio.path)) === approval.oldStudioSha256, 'Studio correction original accepted pixels changed');
  const oldSkuRoot = await realpath(join(plan.oldJobRoot, 'skus', item.sku));
  const oldReceipt = await readStoryJson<{ images: GalleryReceiptImage[] }>(item.retainedStudio.oldReceiptPath);
  const oldImage = oldReceipt.images.find(entry => entry.file === storyFiles[0]);
  requireStory(oldImage?.originalPath && await realpath(image.originalPath) === await realpath(oldImage.originalPath), 'Studio correction must reuse the original native studio without another generation');
  await validateRetainedStoryStudio({ ...options, skuRoot: oldSkuRoot, image: { ...image, provenance: { kind: 'retained-reviewed-studio', oldJobRoot: plan.oldJobRoot, oldSkuRoot, oldReceiptPath: item.retainedStudio.oldReceiptPath, oldImage } } });
  requireStory(sha256(await readFile(join(skuRoot, image.file))) !== approval.oldStudioSha256, 'Unchanged studio must retain its original provenance');
}
