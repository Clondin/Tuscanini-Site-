import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { sha256 } from './gallery-provenance';
import { storyFiles, storyRoles, validateRetainedStoryStudio, validateStoryReview, type StoryImage, type StoryPlan, type StoryPlanItem, type StoryReceipt } from './product-story-contract';

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
});
