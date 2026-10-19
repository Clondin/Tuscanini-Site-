import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { sha256 } from './gallery-provenance';
import { storyFiles, storyRoles, validateRetainedStoryStudio, validateStoryReview, validateStoryStudioCorrection, validateStoryAcceptanceCoverage, validateStoryAcceptanceSnapshot, validateStoryAcceptedSets, type StoryAcceptanceSnapshot, type StoryImage, type StoryPlan, type StoryPlanItem, type StoryReceipt } from './product-story-contract';

const roots: string[] = [];
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); });
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'product-story-contract-'));
  roots.push(root);
  const jobRoot = join(root, 'new'), oldJobRoot = join(root, 'old'), skuRoot = join(jobRoot, 'skus', '730100');
  const imageGenRoot = join(root, 'generated_images'), rawRoot = join(imageGenRoot, 'original-owner-thread');
  await Promise.all([mkdir(skuRoot, { recursive: true }), mkdir(rawRoot, { recursive: true })]);
  const items: StoryPlanItem[] = [];
  for (const sku of ['730100', '730101', '730102']) {
    const oldSkuRoot = join(oldJobRoot, 'skus', sku);
    await mkdir(oldSkuRoot, { recursive: true });
    const source = join(oldSkuRoot, 'source.png');
    await writeFile(source, `actual-source-${sku}`);
    items.push({ sku, id: `product-${sku}`, name: `Product ${sku}`, owner: { taskName: `/root/sku_${sku}`, threadId: 'original-owner-thread' }, creative: { companions: [] }, retainedStudio: { path: join(oldSkuRoot, '01-studio.png'), exists: true, sha256: null, acceptedInOldReceipt: true, oldReceiptPath: join(oldSkuRoot, 'receipt.json') }, sourceAuthority: { primaryReferencePath: source } });
  }
  const item = items[0], plan: StoryPlan = { oldJobRoot, items };
  item.creative.companions = items.slice(1).map(member => ({ sku: member.sku, name: member.name, sourcePath: member.sourceAuthority.primaryReferencePath }));
  const originalPath = join(rawRoot, 'original.png');
  const oldStudio = Buffer.from('accepted-original-studio');
  await Promise.all([writeFile(originalPath, oldStudio), writeFile(item.retainedStudio.path, oldStudio)]);
  item.retainedStudio.sha256 = sha256(oldStudio);
  const oldImage = { file: '01-studio.png', originalPath, qa: { accepted: true, visuallyInspected: true } };
  await writeFile(item.retainedStudio.oldReceiptPath, JSON.stringify({ sku: item.sku, images: [oldImage] }));
  const owner = item.owner.taskName, reviewedAt = '2026-10-19T20:00:00Z';
  const images: StoryImage[] = [];
  for (const [index, file] of storyFiles.entries()) {
    const bytes = index === 0 ? oldStudio : Buffer.from(`distinct-new-image-${file}`);
    await writeFile(join(skuRoot, file), bytes);
    const references = [];
    for (const member of index === 3 ? items : [item]) references.push({ sku: member.sku, path: member.sourceAuthority.primaryReferencePath, sha256: sha256(await readFile(member.sourceAuthority.primaryReferencePath)), status: 'matched' as const, notes: 'Actual source package revision compared with the visible final.' });
    images.push({ file, role: storyRoles[index], originalPath, qa: { accepted: true, visuallyInspected: true }, labelReview: { reviewedBy: owner, reviewedAt, visiblePackageTextMatched: true, references, notes: 'Readable package identity and size match the original source.' } });
  }
  images[0].provenance = { kind: 'retained-reviewed-studio', oldJobRoot, oldSkuRoot: join(oldJobRoot, 'skus', item.sku), oldReceiptPath: item.retainedStudio.oldReceiptPath, oldImage };
  const hashes = Object.fromEntries(await Promise.all(storyFiles.map(async file => [file, sha256(await readFile(join(skuRoot, file)))])));
  const evidenceFile = join(skuRoot, 'actual-final-review.json');
  await writeFile(evidenceFile, JSON.stringify({ owner, rolesViewed: storyRoles, reviewedAt }));
  const receipt: StoryReceipt = { schema_version: 'tuscanini-product-story-receipt/v1', sku: item.sku, status: 'ready', images,
    sourceArtworkReview: { status: 'matched', reviewedBy: owner, evidenceFile, reviewedImages: [...storyFiles], reviewedImageHashes: { ...hashes } },
    creativeReview: { status: 'accepted', reviewedBy: owner, reviewedAt, evidenceFile, reviewedImages: [...storyFiles], reviewedImageHashes: { ...hashes }, companionSkus: ['730101', '730102'], checks: { productIdentifiable: true, meaningfulUseAction: true, foodOrUseLeads: true, distinctOccasion: true, realProductFamily: true, heroLeadsFamily: true, distinctThumbnailRoles: true } },
  };
  return { root, jobRoot, oldJobRoot, skuRoot, imageGenRoot, item, plan, receipt };
}

async function correctionFixture() {
  const options = await fixture();
  const authorizationPath = join(options.jobRoot, 'user-authorization.json');
  await writeFile(authorizationPath, JSON.stringify({ approved: true, approvedBy: 'user' }));
  const evidenceFile = join(options.skuRoot, 'studio-label-issue.json');
  await writeFile(evidenceFile, JSON.stringify({ sourceCompared: true, wrongCaptionObserved: true }));
  const approval = {
    schema_version: 'tuscanini-reviewed-studio-correction/v1', approved: true, reviewedBy: '/root', reviewedAt: '2026-10-19T21:00:00Z',
    sku: options.item.sku, owner: options.item.owner.taskName, ownerThreadId: options.item.owner.threadId,
    method: 'source-photo-only-existing-native-studio', nativeStudioCallsAllowed: 0,
    oldStudioSha256: options.item.retainedStudio.sha256, sourcePath: options.item.sourceAuthority.primaryReferencePath,
    sourceSha256: sha256(await readFile(options.item.sourceAuthority.primaryReferencePath)), issueEvidenceFile: evidenceFile,
    issueEvidenceSha256: sha256(await readFile(evidenceFile)), userAuthorizationSha256: sha256(await readFile(authorizationPath)),
    reason: 'Root viewed source and studio crops and confirmed a newly discovered caption mismatch.',
  };
  const approvalPath = join(options.skuRoot, 'studio-correction-authorization.json');
  await writeFile(approvalPath, JSON.stringify(approval));
  const image = { ...options.receipt.images[0], provenance: { kind: 'source-preserving-story-composite' } };
  await writeFile(join(options.skuRoot, storyFiles[0]), 'new-source-photo-studio-candidate');
  return { ...options, image, approval, approvalPath, owners: new Map<string, string>(), toolkitPath: join(options.root, 'unused-pure-image-toolkit.py') };
}

describe('new product stories', () => {
  it('accepts the four new roles with all three actual family sources', async () => {
    await expect(validateStoryReview(await fixture())).resolves.toBeUndefined();
  });
  it('rejects old environmental file names even with ready status', async () => {
    const options = await fixture();
    options.receipt.images[1].file = '02-kitchen.png';
    await expect(validateStoryReview(options)).rejects.toThrow('four new canonical');
  });
  it('rejects final pixels changed after source and creative review', async () => {
    const options = await fixture();
    await writeFile(join(options.skuRoot, storyFiles[2]), 'later-edited-pixels');
    await expect(validateStoryReview(options)).rejects.toThrow('pixels changed');
  });
  it('does not treat a different owner as the original producer', async () => {
    const options = await fixture();
    options.receipt.creativeReview.reviewedBy = '/root/sku_730101';
    await expect(validateStoryReview(options)).rejects.toThrow('same-owner creative');
  });
  it('requires each real family member label comparison', async () => {
    const options = await fixture();
    options.receipt.images[3].labelReview.references.pop();
    await expect(validateStoryReview(options)).rejects.toThrow('actual visible product family');
  });
  it('refuses substitutions outside the approved product family', async () => {
    const options = await fixture();
    options.receipt.creativeReview.companionSkus[1] = '730103';
    await expect(validateStoryReview(options)).rejects.toThrow('approved real companions');
  });
  it('requires the approved primary photograph rather than an arbitrary same-SKU file', async () => {
    const options = await fixture();
    const alternative = join(options.oldJobRoot, 'skus', options.item.sku, 'source-detail-other.png');
    await writeFile(alternative, 'different-revision-source');
    options.receipt.images[1].labelReview.references[0] = { ...options.receipt.images[1].labelReview.references[0], path: alternative, sha256: sha256(await readFile(alternative)) };
    await expect(validateStoryReview(options)).rejects.toThrow('approved primary photograph');
  });
  it('accepts an own-SKU preservation alias only when it is byte-identical to the primary', async () => {
    const options = await fixture();
    const alias = join(options.oldJobRoot, 'skus', options.item.sku, 'source-original.png');
    await writeFile(alias, await readFile(options.item.sourceAuthority.primaryReferencePath));
    options.receipt.images[1].labelReview.references[0].path = alias;
    await expect(validateStoryReview(options)).resolves.toBeUndefined();
  });
  it('rejects a companion photo declared as the hero source', async () => {
    const options = await fixture();
    options.receipt.images[1].labelReview.references.push({ ...options.receipt.images[3].labelReview.references[1], sku: options.item.sku });
    await expect(validateStoryReview(options)).rejects.toThrow('declared source SKU');
  });
  it('rejects a known incorrect API reference even inside the hero folder', async () => {
    const options = await fixture();
    const path = join(options.oldJobRoot, 'skus', options.item.sku, 'api-reference.webp');
    await writeFile(path, 'wrong-pasta-api-image');
    options.item.sourceAuthority.excludedApiReferencePath = path;
    options.receipt.images[1].labelReview.references.push({ ...options.receipt.images[1].labelReview.references[0], path, sha256: sha256(await readFile(path)) });
    await expect(validateStoryReview(options)).rejects.toThrow('Known incorrect API');
  });
  it('validates retained exact studio bytes against its actual old raw chain', async () => {
    const options = await fixture();
    await expect(validateRetainedStoryStudio({ ...options, image: options.receipt.images[0], owners: new Map(), toolkitPath: join(options.root, 'unused-pure-image-toolkit.py') })).resolves.toBeUndefined();
  });
  it('rejects a changed studio instead of transferring old acceptance', async () => {
    const options = await fixture();
    await writeFile(join(options.skuRoot, storyFiles[0]), 'newly-replaced-studio');
    await expect(validateRetainedStoryStudio({ ...options, image: options.receipt.images[0], owners: new Map(), toolkitPath: join(options.root, 'unused-pure-image-toolkit.py') })).rejects.toThrow('pixels changed');
  });
  it('allows a root-reviewed source-photo studio correction while validating its full original chain', async () => {
    await expect(validateStoryStudioCorrection(await correctionFixture())).resolves.toBeUndefined();
  });
  it('refuses studio correction approval borrowed from another SKU', async () => {
    const options = await correctionFixture();
    await writeFile(options.approvalPath, JSON.stringify({ ...options.approval, sku: '730101' }));
    await expect(validateStoryStudioCorrection(options)).rejects.toThrow('exact-SKU root authorization');
  });
  it('rejects changing the original accepted studio behind a correction authorization', async () => {
    const options = await correctionFixture();
    await writeFile(options.item.retainedStudio.path, 'modified-old-evidence');
    await expect(validateStoryStudioCorrection(options)).rejects.toThrow('original accepted pixels changed');
  });
  it('rejects changed issue evidence and additional native studio generations', async () => {
    const options = await correctionFixture();
    await writeFile(options.approvalPath, JSON.stringify({ ...options.approval, issueEvidenceSha256: '0'.repeat(64) }));
    await expect(validateStoryStudioCorrection(options)).rejects.toThrow('issue evidence changed');
    await writeFile(options.approvalPath, JSON.stringify(options.approval));
    const otherRaw = join(options.imageGenRoot, options.item.owner.threadId, 'another-native-studio.png');
    await writeFile(otherRaw, 'different-native-generation');
    options.image.originalPath = otherRaw;
    await expect(validateStoryStudioCorrection(options)).rejects.toThrow('reuse the original native studio');
  });
});

async function acceptanceFixture() {
  const options = await fixture();
  const receiptPath = join(options.skuRoot, 'receipt.json');
  const saveReceipt = () => writeFile(receiptPath, JSON.stringify(options.receipt, null, 2));
  await saveReceipt();
  const snapshot: StoryAcceptanceSnapshot = {
    sku: options.item.sku, receiptSha256: sha256(await readFile(receiptPath)),
    finalHashes: { ...options.receipt.creativeReview.reviewedImageHashes } as StoryAcceptanceSnapshot['finalHashes'],
  };
  const repinReceipt = async () => { await saveReceipt(); snapshot.receiptSha256 = sha256(await readFile(receiptPath)); };
  return { ...options, receiptPath, snapshot, saveReceipt, repinReceipt };
}

describe('publication acceptance snapshots', () => {
  it('accepts the exact receipt bytes and four source/creative-reviewed canonical hashes without writes', async () => {
    const f = await acceptanceFixture();
    const paths = [f.receiptPath, ...storyFiles.map(file => join(f.skuRoot, file))];
    const before = await Promise.all(paths.map(path => readFile(path)));
    await expect(validateStoryAcceptedSets({ jobRoot: f.jobRoot, acceptedSets: [f.snapshot], readySkuList: [f.item.sku] })).resolves.toBeUndefined();
    expect(await Promise.all(paths.map(path => readFile(path)))).toEqual(before);
  });
  it('blocks owner revocation to producing even when all four pixels stay identical', async () => {
    const f = await acceptanceFixture();
    f.receipt.status = 'producing'; await f.saveReceipt();
    await expect(validateStoryAcceptanceSnapshot(f)).rejects.toThrow('receipt changed or was revoked');
  });
  it('refuses a non-ready receipt even if a caller tries to rebind its bytes', async () => {
    const f = await acceptanceFixture();
    f.receipt.status = 'producing'; await f.repinReceipt();
    await expect(validateStoryAcceptanceSnapshot(f)).rejects.toThrow('ready four-image set');
  });
  it('requires exact imported bytes rather than silently re-accepting a semantically equivalent receipt', async () => {
    const f = await acceptanceFixture();
    await writeFile(f.receiptPath, JSON.stringify(f.receipt));
    await expect(validateStoryAcceptanceSnapshot(f)).rejects.toThrow('receipt changed or was revoked');
  });
  it('rejects receipt substitution from another SKU even with a rebound hash', async () => {
    const f = await acceptanceFixture(); f.receipt.sku = '730101'; await f.repinReceipt();
    await expect(validateStoryAcceptanceSnapshot(f)).rejects.toThrow('ready four-image set');
  });
  it('blocks canonical pixels changed after import with the accepted receipt unchanged', async () => {
    const f = await acceptanceFixture(); await writeFile(join(f.skuRoot, storyFiles[0]), 'studio-corrected-after-import');
    await expect(validateStoryAcceptanceSnapshot(f)).rejects.toThrow('canonical pixels or source/creative review hash');
  });
  it('rejects a new PNG hash with stale source and creative reviews', async () => {
    const f = await acceptanceFixture(); const path = join(f.skuRoot, storyFiles[1]); await writeFile(path, 'new-use-image');
    f.snapshot.finalHashes[storyFiles[1]] = sha256(await readFile(path));
    await expect(validateStoryAcceptanceSnapshot(f)).rejects.toThrow('source/creative review hash');
  });
  it('rejects a stale creative-review hash even when source review agrees', async () => {
    const f = await acceptanceFixture(); f.receipt.creativeReview.reviewedImageHashes[storyFiles[2]] = '0'.repeat(64); await f.repinReceipt();
    await expect(validateStoryAcceptanceSnapshot(f)).rejects.toThrow('source/creative review hash');
  });
  it('rejects a stale source-review hash even when creative review agrees', async () => {
    const f = await acceptanceFixture(); f.receipt.sourceArtworkReview.reviewedImageHashes![storyFiles[2]] = '0'.repeat(64); await f.repinReceipt();
    await expect(validateStoryAcceptanceSnapshot(f)).rejects.toThrow('source/creative review hash');
  });
  it('rejects revoked creative acceptance with unchanged PNGs', async () => {
    const f = await acceptanceFixture(); f.receipt.creativeReview.status = 'held'; await f.repinReceipt();
    await expect(validateStoryAcceptanceSnapshot(f)).rejects.toThrow('source/creative review was revoked');
  });
  it('rejects revoked image QA with unchanged PNGs', async () => {
    const f = await acceptanceFixture(); f.receipt.images[3].qa.accepted = false; await f.repinReceipt();
    await expect(validateStoryAcceptanceSnapshot(f)).rejects.toThrow('visual review was revoked');
  });
  it('requires snapshots for every ready SKU', async () => {
    const f = await acceptanceFixture();
    expect(() => validateStoryAcceptanceCoverage([], [f.item.sku])).toThrow('coverage');
    expect(() => validateStoryAcceptanceCoverage([f.snapshot], [f.item.sku, '730101'])).toThrow('coverage');
  });
  it('rejects duplicated or unexpected accepted SKUs', async () => {
    const f = await acceptanceFixture();
    expect(() => validateStoryAcceptanceCoverage([f.snapshot, f.snapshot], [f.item.sku, '730101'])).toThrow('Duplicate');
    expect(() => validateStoryAcceptanceCoverage([f.snapshot], ['730101'])).toThrow('unexpected');
    expect(() => validateStoryAcceptanceCoverage([f.snapshot, f.snapshot], [f.item.sku, f.item.sku])).toThrow('coverage');
  });
  it('requires exactly the four canonical hash bindings', async () => {
    const f = await acceptanceFixture();
    const missing = { ...f.snapshot, finalHashes: { '01-studio.png': f.snapshot.finalHashes['01-studio.png'] } };
    expect(() => validateStoryAcceptanceCoverage([missing], [f.item.sku])).toThrow('all four canonical');
    const extra = { ...f.snapshot, finalHashes: { ...f.snapshot.finalHashes, '02-kitchen.png': '0'.repeat(64) } };
    expect(() => validateStoryAcceptanceCoverage([extra], [f.item.sku])).toThrow('all four canonical');
  });
  it('rejects invalid receipt or canonical SHA bindings', async () => {
    const f = await acceptanceFixture();
    expect(() => validateStoryAcceptanceCoverage([{ ...f.snapshot, receiptSha256: 'not-a-sha' }], [f.item.sku])).toThrow('all four canonical');
    f.snapshot.finalHashes[storyFiles[3]] = 'not-a-sha';
    expect(() => validateStoryAcceptanceCoverage([f.snapshot], [f.item.sku])).toThrow('all four canonical');
  });
  it('does not adopt a fresh owner acceptance behind an old imported snapshot', async () => {
    const f = await acceptanceFixture();
    const path = join(f.skuRoot, storyFiles[0]); await writeFile(path, 'actually-repaired-studio');
    const digest = sha256(await readFile(path));
    f.receipt.sourceArtworkReview.reviewedImageHashes![storyFiles[0]] = digest;
    f.receipt.creativeReview.reviewedImageHashes[storyFiles[0]] = digest; await f.saveReceipt();
    await expect(validateStoryAcceptedSets({ jobRoot: f.jobRoot, acceptedSets: [f.snapshot], readySkuList: [f.item.sku] })).rejects.toThrow('receipt changed or was revoked');
  });
});
