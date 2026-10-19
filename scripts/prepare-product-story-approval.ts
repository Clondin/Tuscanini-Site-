import { access, mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { galleryFiles, sha256 } from './gallery-provenance';
import { readStoryJson, requireStory, type StoryPlan } from './product-story-contract';

const jobRoot = resolve('output/tuscanini-product-stories-20261019');
const version = process.argv[2];
requireStory(/^\d{3}$/.test(version ?? ''), 'Pass a new three-digit immutable approval version');
const outputPath = join(jobRoot, 'approvals', `source-preserving-stories-approval-${version}.json`);
try { await access(outputPath); throw new Error('Approval version already exists; do not overwrite it'); }
catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
const plan = await readStoryJson<StoryPlan & { approvedCreativePlanPath: string }>(join(jobRoot, 'production-plan.json'));
const authorizationPath = join(jobRoot, 'user-authorization.json');
const authorization = await readStoryJson<{ approved: boolean; approvedBy: string; approvedAt: string }>(authorizationPath);
requireStory(authorization.approved === true && authorization.approvedBy === 'user', 'Missing user authorization');
type Qualification = { path: string; sha256: string; scope: string; status: string; reviewer: string; notes: string };
const sourceCatalog: Record<string, Qualification[]> = {}, sourceRoots: Record<string, string> = {}, componentRoots: Record<string, string> = {}, owners: Record<string, string> = {};
const missingSources: string[] = [];
for (const item of plan.items) {
  const owner = `/root/sku_${item.sku}`;
  requireStory(item.owner.taskName === owner, 'Original source owner mismatch');
  owners[item.sku] = owner;
  sourceRoots[item.sku] = await realpath(join(plan.oldJobRoot, 'skus', item.sku));
  const sourcePath = await realpath(item.sourceAuthority.primaryReferencePath);
  const sourceHash = sha256(await readFile(sourcePath));
  let primaryNotes: string | undefined;
  if (item.retainedStudio.acceptedInOldReceipt) {
    const oldReceipt = await readStoryJson<{ sku: string; images: Array<{ file: string; qa?: { accepted?: boolean } }> }>(item.retainedStudio.oldReceiptPath);
    requireStory(oldReceipt.sku === item.sku && oldReceipt.images.some(image => image.file === '01-studio.png' && image.qa?.accepted === true), 'Primary source qualification lost its original accepted studio');
    primaryNotes = `Existing original-owner package authority for ${item.name}; primary reference recorded in production-plan.json and retained accepted studio ${item.retainedStudio.sha256}. This qualifies source identity/revision only; the new hero owner must inspect every final label and source.`;
  } else {
    try {
      const review = await readStoryJson<{ sku: string; reviewedBy: string; reviewedAt: string; status: string; path: string; sha256: string; notes: string }>(join(jobRoot, 'skus', item.sku, 'source-identity-review.json'));
      requireStory(review.sku === item.sku && review.reviewedBy === owner && Number.isFinite(Date.parse(review.reviewedAt)) && review.status === 'matched' && await realpath(review.path) === sourcePath && review.sha256 === sourceHash && !!review.notes?.trim(), 'Fresh primary source qualification does not match the actual original owner/source');
      primaryNotes = review.notes;
    } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  }
  const references: Qualification[] = [];
  async function add(reference: Qualification) {
    if (reference.reviewer !== owner || !['matched', 'matched-components'].includes(reference.status) || !['exact-package', 'qualified-component'].includes(reference.scope) || !reference.notes?.trim()) return;
    const path = await realpath(reference.path);
    if (item.sourceAuthority.excludedApiReferencePath && path === await realpath(item.sourceAuthority.excludedApiReferencePath)) return;
    const expectedHash = reference.sha256.toLowerCase();
    requireStory(/^[a-f0-9]{64}$/.test(expectedHash) && sha256(await readFile(path)) === expectedHash, `Previously qualified source hash changed: ${path}`);
    if (!references.some(entry => entry.path === path)) references.push({ ...reference, path, sha256: expectedHash });
  }
  if (primaryNotes) await add({ path: sourcePath, sha256: sourceHash, scope: 'exact-package', status: 'matched', reviewer: owner, notes: primaryNotes });
  const prior = await readStoryJson<{ detailReferenceReview?: { status: string; candidate?: string; sha256?: string; reviewedImages?: string[]; findings?: string; reviewedBy?: string }; images?: Array<{ provenance?: { reviewedSources?: Qualification[]; parentImage?: { provenance?: { reviewedSources?: Qualification[] } } } }> }>(item.retainedStudio.oldReceiptPath);
  const detail = prior.detailReferenceReview;
  if (detail?.status === 'matched' && detail.candidate && basename(detail.candidate) === detail.candidate
    && /^(source(?:-original)?\.(png|webp|jpe?g)|api-reference\.(png|webp|jpe?g)|source-detail-.+\.(png|webp|jpe?g))$/i.test(detail.candidate)
    && detail.sha256 && galleryFiles.every(file => detail.reviewedImages?.includes(file))) {
    requireStory(!detail.reviewedBy || detail.reviewedBy === owner, 'Matched sharper reference was reviewed by a different source owner');
    const detailPath = join(sourceRoots[item.sku], detail.candidate);
    await add({ path: detailPath, sha256: detail.sha256, scope: 'exact-package', status: 'matched', reviewer: owner,
      notes: `Original source owner recorded a matched package-revision comparison against this exact higher-resolution candidate and all four earlier final images. ${detail.findings ?? 'Preserve actual package artwork, variant and printed weight.'}` });
  }
  for (const image of prior.images ?? []) {
    for (const reference of image.provenance?.reviewedSources ?? []) await add(reference);
    for (const reference of image.provenance?.parentImage?.provenance?.reviewedSources ?? []) await add(reference);
  }
  sourceCatalog[item.sku] = references;
  if (!primaryNotes) missingSources.push(item.sku);
  const components = join(plan.oldJobRoot, 'artwork-source-recovery', item.sku);
  try { componentRoots[item.sku] = await realpath(components); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
}
const pin = async (path: string) => ({ path: await realpath(path), sha256: sha256(await readFile(path)) });
const approval = {
  schema_version: 'source-preserving-stories-approval/v2', approved: true, approvedBy: 'user', approvedAt: authorization.approvedAt,
  method: 'deterministic-original-photo-homography-v2', toolkit: await pin(resolve('scripts/source-preserving-stories-v2.py')),
  renderer: await pin(resolve('scripts/source-preserving-composite.py')), creativePlan: await pin(plan.approvedCreativePlanPath),
  authorization: await pin(authorizationPath), skus: plan.items.map(item => item.sku), owners, sourceRoots, componentRoots, sourceCatalog,
};
requireStory(approval.renderer.sha256 === 'a93724364d50bbf3ff8eb37466e2cb2540a417002f08bfb3dd65d0791a7506da', 'Original pinned renderer changed');
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(approval, null, 2) + '\n', { flag: 'wx' });
const pointer = { ...await pin(outputPath), qualifiedPrimarySkus: plan.items.length - missingSources.length, pendingSourceQualifications: missingSources, generatedAt: new Date().toISOString() };
await writeFile(join(jobRoot, 'active-compositing-approval.json'), JSON.stringify(pointer, null, 2) + '\n');
console.log(JSON.stringify(pointer));
