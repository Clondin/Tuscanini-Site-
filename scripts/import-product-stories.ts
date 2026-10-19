import { mkdir, readFile, realpath, rename, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';
import type { ProductGalleryImage } from '../src/data/product-galleries';
import { productGalleries as currentGalleries } from '../src/data/product-galleries.generated';
import { sha256 } from './gallery-provenance';
import { validateStoryCompositeProvenance, type StoryCompositeImage } from './family-provenance';
import { insideStoryRoot, readStoryJson, requireStory, storyFiles, storyRoles, validateRetainedStoryStudio, validateStoryReview, validateStoryStudioCorrection, validateStoryAcceptedSets, type StoryAcceptanceSnapshot, type StoryPlan, type StoryReceipt } from './product-story-contract';

const jobRoot = resolve(process.argv.find(arg => !arg.startsWith('-') && arg !== process.argv[0] && arg !== process.argv[1]) ?? 'output/tuscanini-product-stories-20261019');
const requireComplete = process.argv.includes('--require-complete');
const imageGenRoot = await realpath(resolve(process.env.CODEX_HOME || join(homedir(), '.codex'), 'generated_images'));
const plan = await readStoryJson<StoryPlan>(join(jobRoot, 'production-plan.json'));
const authorization = await readStoryJson<{ approved: boolean; approvedBy: string; skuCount: number; imagesPerSku: number; roles: string[] }>(join(jobRoot, 'user-authorization.json'));
requireStory(authorization.approved === true && authorization.approvedBy === 'user' && authorization.skuCount === 207 && authorization.imagesPerSku === 4 && authorization.roles.join(',') === storyRoles.join(','), 'Missing approved four-role production authorization');
requireStory(plan.items.length === 207 && new Set(plan.items.map(item => item.sku)).size === 207, 'Approved production plan must contain exactly 207 unique SKUs');
const baselinePath = join(jobRoot, 'baseline-galleries.json');
let baseline: Record<string, ProductGalleryImage[]>;
try { baseline = await readStoryJson<Record<string, ProductGalleryImage[]>>(baselinePath); }
catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  baseline = currentGalleries;
  await writeFile(baselinePath, JSON.stringify(baseline, null, 2) + '\n', { flag: 'wx' });
}
for (const [sku, images] of Object.entries(baseline)) {
  const prefix = `/assets/products/generated/${sku}/`;
  requireStory(plan.items.some(item => item.sku === sku) && images.length === 4 && images.every(image => image.src.startsWith(prefix) && image.thumbnail.startsWith(prefix) && !image.src.includes('..') && !image.thumbnail.includes('..')), 'Invalid preserved baseline gallery');
}
const galleries = { ...baseline };
const ready: string[] = [], pending: string[] = [], blocked: Array<{ sku: string; reason: string }> = [];
const acceptedSets: StoryAcceptanceSnapshot[] = [];
const owners = new Map<string, string>();
let heldSkus: Array<{ sku: string; status: string; reason: string }> = [];
try {
  const holds = await readStoryJson<{ schema_version: string; reviewedBy: string; holds: typeof heldSkus }>(join(jobRoot, 'release-holds.json'));
  requireStory(holds.schema_version === 'tuscanini-product-story-release-holds/v1' && holds.reviewedBy === '/root' && Array.isArray(holds.holds), 'Invalid coordinator release-hold registry');
  requireStory(holds.holds.every(hold => plan.items.some(item => item.sku === hold.sku) && ['held', 'cleared'].includes(hold.status) && !!hold.reason?.trim()) && new Set(holds.holds.map(hold => hold.sku)).size === holds.holds.length, 'Invalid or duplicate release hold');
  heldSkus = holds.holds.filter(hold => hold.status === 'held');
} catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
const labels = ['Product', 'In use', 'Occasion', 'Product family'];
const descriptions = ['enhanced original product photograph', 'being prepared, served or enjoyed', 'in a relevant dining or lifestyle occasion', 'with related Tuscanini products'];

for (const item of plan.items) {
  if (heldSkus.some(hold => hold.sku === item.sku)) { pending.push(item.sku); continue; }
  const skuRoot = join(jobRoot, 'skus', item.sku);
  let receipt: StoryReceipt;
  let receiptSha256: string;
  try {
    const receiptBytes = await readFile(join(skuRoot, 'receipt.json'));
    receiptSha256 = sha256(receiptBytes);
    receipt = JSON.parse(receiptBytes.toString('utf8').replace(/^\uFEFF/, '')) as StoryReceipt;
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') pending.push(item.sku);
    else blocked.push({ sku: item.sku, reason: String(error) });
    continue;
  }
  if (receipt.status !== 'ready') { pending.push(item.sku); continue; }
  try {
    await validateStoryReview({ jobRoot, skuRoot, item, plan, receipt });
    const images: ProductGalleryImage[] = [];
    const hashes = new Set<string>();
    const finalHashes = {} as StoryAcceptanceSnapshot['finalHashes'];
    for (const [index, file] of storyFiles.entries()) {
      const image = receipt.images.find(entry => entry.file === file)!;
      const path = await realpath(join(skuRoot, file));
      requireStory(insideStoryRoot(await realpath(skuRoot), path), 'Final image escapes its exact SKU folder');
      const bytes = await readFile(path), hash = sha256(bytes);
      finalHashes[file] = hash;
      const originalPath = await realpath(image.originalPath);
      requireStory(insideStoryRoot(imageGenRoot, originalPath) && dirname(originalPath) === join(imageGenRoot, item.owner.threadId), 'Generated image does not belong to the original SKU agent');
      if (index === 0 && item.retainedStudio.acceptedInOldReceipt && image.provenance?.kind !== 'source-preserving-story-composite') {
        await validateRetainedStoryStudio({ item, plan, skuRoot, image, imageGenRoot, owners, toolkitPath: resolve('scripts/source-preserving-composite.py') });
      } else if (image.provenance?.kind === 'source-preserving-story-composite') {
        if (index === 0 && item.retainedStudio.acceptedInOldReceipt) await validateStoryStudioCorrection({ jobRoot, item, plan, skuRoot, image, imageGenRoot, owners, toolkitPath: resolve('scripts/source-preserving-composite.py') });
        await validateStoryCompositeProvenance({ jobRoot, skuRoot, sku: item.sku, role: storyRoles[index], image: image as StoryCompositeImage, imageGenRoot, toolkitPath: resolve('scripts/source-preserving-stories-v2.py'), owners, artworkReview: receipt.sourceArtworkReview, expectedFiles: [...storyFiles] });
      } else {
        requireStory(!image.provenance, 'Unknown or misplaced story provenance');
        requireStory(sha256(await readFile(originalPath)) === hash, 'A pure ImageGen final differs from its recorded original');
        requireStory(!owners.has(hash) || owners.get(hash) === item.sku, 'Generated final reused across SKUs');
        owners.set(hash, item.sku);
      }
      requireStory(!hashes.has(hash), 'The four images must be distinct');
      hashes.add(hash);
      const metadata = await sharp(bytes).metadata();
      requireStory(metadata.format === 'png' && metadata.width && metadata.height && Math.max(metadata.width, metadata.height) >= 1024 && metadata.width * metadata.height >= 655_360, `Invalid or undersized final: ${file}`);
      if (index === 0) {
        const sourceIsOpaque = (await sharp(item.sourceAuthority.primaryReferencePath).stats()).isOpaque;
        requireStory(sourceIsOpaque || !(await sharp(bytes).stats()).isOpaque, 'Product photo lost original source transparency');
      }
      const outputRoot = resolve('public/assets/products/generated', item.sku);
      await mkdir(outputRoot, { recursive: true });
      const stem = `${file.replace('.png', '')}-${hash.slice(0, 16)}`;
      const fullName = `${stem}.webp`, thumbnailName = `${stem}-320.webp`;
      const fullPath = join(outputRoot, fullName), thumbnailPath = join(outputRoot, thumbnailName);
      const scale = Math.min(1600 / metadata.width, 1600 / metadata.height, 1);
      const width = Math.round(metadata.width * scale), height = Math.round(metadata.height * scale);
      async function existsWithSize(filePath: string, expectedWidth: number, expectedHeight: number) {
        try { const data = await sharp(filePath).metadata(); return (await stat(filePath)).size > 0 && data.format === 'webp' && data.width === expectedWidth && data.height === expectedHeight; }
        catch { return false; }
      }
      if (!await existsWithSize(fullPath, width, height)) await sharp(bytes).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90 }).toFile(fullPath);
      const thumbScale = Math.min(320 / metadata.width, 320 / metadata.height, 1);
      if (!await existsWithSize(thumbnailPath, Math.round(metadata.width * thumbScale), Math.round(metadata.height * thumbScale))) await sharp(bytes).rotate().resize({ width: 320, height: 320, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(thumbnailPath);
      const prefix = `/assets/products/generated/${item.sku}/`;
      images.push({ src: prefix + fullName, thumbnail: prefix + thumbnailName, label: labels[index], alt: `${item.name} — ${descriptions[index]}`, width, height });
    }
    galleries[item.sku] = images;
    ready.push(item.sku);
    acceptedSets.push({ sku: item.sku, receiptSha256, finalHashes });
  } catch (error) { blocked.push({ sku: item.sku, reason: error instanceof Error ? error.message : String(error) }); }
}

const report = { generatedAt: new Date().toISOString(), productionVersion: 'product-stories-v1', targetSkus: 207, targetImages: 828, readySkus: ready.length, readyImages: ready.length * 4, readySkuList: ready, acceptedSets, pendingSkus: pending, heldSkus, blocked, totalDisplayedSkus: Object.keys(galleries).length, preservedLegacySkus: Object.keys(galleries).filter(sku => !ready.includes(sku)), finalReleaseValidated: requireComplete && ready.length === 207 && !pending.length && !blocked.length };
await writeFile(join(jobRoot, 'import-report.json'), JSON.stringify(report, null, 2) + '\n');
if (blocked.length || (requireComplete && ready.length !== 207)) throw new Error(`Story release held: ${ready.length}/207 new sets, ${blocked.length} invalid ready receipts. See import-report.json.`);
requireStory(ready.length > 0, 'No new complete product story is ready; preserved index was not changed');
const evidence = [];
for (const [sku, images] of Object.entries(galleries)) for (const image of images) {
  const full = await readFile(resolve('public', image.src.replace(/^\/+/, '')));
  const thumbnail = await readFile(resolve('public', image.thumbnail.replace(/^\/+/, '')));
  evidence.push({ sku, productId: plan.items.find(item => item.sku === sku)!.id, productionVersion: ready.includes(sku) ? 'product-stories-v1' : 'legacy', ...image, sha256: sha256(full), bytes: full.length, thumbnailSha256: sha256(thumbnail), thumbnailBytes: thumbnail.length });
}
await writeFile(join(jobRoot, 'gallery-assets.json'), JSON.stringify({ ...report, publicationStatus: 'local-only', verifiedAcceptedSets: true, images: evidence }, null, 2) + '\n');
const target = resolve('src/data/product-galleries.generated.ts');
await writeFile(target + '.tmp', `// Generated from complete reviewed galleries by scripts/import-product-stories.ts.\nimport type { ProductGalleryImage } from './product-galleries';\n\nexport const productGalleries: Record<string, ProductGalleryImage[]> = ${JSON.stringify(galleries, null, 2)};\n`);
try {
  await validateStoryAcceptedSets({ jobRoot, acceptedSets, readySkuList: ready });
} catch (error) {
  report.finalReleaseValidated = false;
  blocked.push({ sku: 'publication-recheck', reason: error instanceof Error ? error.message : String(error) });
  await writeFile(join(jobRoot, 'import-report.json'), JSON.stringify(report, null, 2) + '\n');
  throw new Error('Story index was not replaced: receipt acceptance or canonical pixels changed during import.', { cause: error });
}
await rename(target + '.tmp', target);
console.log(JSON.stringify({ newReadySkus: ready.length, newReadyImages: ready.length * 4, totalDisplayedSkus: report.totalDisplayedSkus, finalReleaseValidated: report.finalReleaseValidated }));
