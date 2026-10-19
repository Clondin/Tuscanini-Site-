import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rename, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import type { ProductGalleryImage } from '../src/data/product-galleries';
import { galleryFiles, validateCompositeArtworkReview, validateGalleryProvenance, type GalleryReceiptImage, type SourceArtworkReview } from './gallery-provenance';

interface JobItem { sku: string; id: string; name: string; sourceImage: string }
interface Receipt {
  sku: string;
  status: string;
  images: GalleryReceiptImage[];
  detailReferenceReview?: { status: string; reviewedImages?: string[] };
  sourceArtworkReview?: SourceArtworkReview;
}

const jobRoot = resolve(process.argv.find(arg => !arg.startsWith('-') && arg !== process.argv[0] && arg !== process.argv[1]) ?? 'output/tuscanini-imagegen-20261016');
const requireComplete = process.argv.includes('--require-complete');
const verifyReady = requireComplete || process.argv.includes('--verify-ready');
const imageGenRoot = resolve(process.env.CODEX_HOME || join(homedir(), '.codex'), 'generated_images');
const manifest = JSON.parse(await readFile(join(jobRoot, 'manifest.json'), 'utf8')) as { items: JobItem[] };
let artworkPilotSkus = new Set<string>();
try {
  const artwork = JSON.parse((await readFile(join(jobRoot, 'source-artwork-pilots.json'), 'utf8')).replace(/^\uFEFF/, '')) as { pilots: Array<{ sku: string }> };
  artworkPilotSkus = new Set(artwork.pilots.map(pilot => pilot.sku));
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  if (verifyReady) throw new Error('Verified imports require source-artwork-pilots.json; recovered-artwork review cannot be skipped.', { cause: error });
}
const files = galleryFiles;
const labels = ['Product', 'Kitchen', 'At the table', 'Inspiration'];
const descriptions = ['enhanced original product photograph', 'in a kitchen setting', 'in a table setting', 'in a lifestyle setting'];
const galleries: Record<string, ProductGalleryImage[]> = {};
const pending: string[] = [];
const blocked: Array<{ sku: string; reason: string }> = [];
const seen = new Set<string>();
const rawImageOwners = new Map<string, string>();

async function preparedDerivative(path: string, width: number, height: number): Promise<boolean> {
  try {
    if ((await stat(path)).size === 0) return false;
    const metadata = await sharp(path).metadata();
    return metadata.format === 'webp' && metadata.width === width && metadata.height === height;
  } catch {
    return false;
  }
}

for (const item of manifest.items) {
  if (!/^\d{6}$/.test(item.sku) || seen.has(item.sku)) throw new Error(`Invalid or repeated SKU: ${item.sku}`);
  seen.add(item.sku);
  const skuRoot = join(jobRoot, 'skus', item.sku);
  let receipt: Receipt;
  try {
    receipt = JSON.parse(await readFile(join(skuRoot, 'receipt.json'), 'utf8')) as Receipt;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') blocked.push({ sku: item.sku, reason: String(error) });
    else pending.push(item.sku);
    continue;
  }
  if (receipt.status !== 'ready') { pending.push(item.sku); continue; }
  try {
    if (receipt.sku !== item.sku || !Array.isArray(receipt.images) || receipt.images.length !== 4) throw new Error('Receipt identity or image count does not match');
    if (receipt.images.some(image => image.provenance)) await validateCompositeArtworkReview(skuRoot, receipt.sourceArtworkReview);
    const referenceFiles = await readdir(skuRoot);
    if (verifyReady && artworkPilotSkus.has(item.sku)) {
      const review = receipt.sourceArtworkReview;
      if (!review || !['matched', 'matched-components', 'different-revision'].includes(review.status)
        || !files.every(file => review.reviewedImages?.includes(file))) {
        throw new Error('Final comparison of all four images against recovered package artwork is not recorded');
      }
    }
    if (verifyReady && referenceFiles.some(name => name.startsWith('source-detail-'))) {
      const review = receipt.detailReferenceReview;
      if (!review || !['matched', 'different-revision'].includes(review.status)
        || !files.every(file => review.reviewedImages?.includes(file))) {
        throw new Error('Final visual comparison against the sharper company reference is not recorded');
      }
    }
    const sourceFile = referenceFiles.find(name => /^source\.(png|webp|jpe?g)$/.test(name));
    if (!sourceFile) throw new Error('Original package reference is missing');
    const apiReference = referenceFiles.find(name => /^api-reference\.(png|webp|jpe?g)$/.test(name));
    if (!apiReference) throw new Error('Exact API package reference is missing');
    const originalIsTransparent = !(await sharp(join(skuRoot, apiReference)).stats()).isOpaque;
    const images: ProductGalleryImage[] = [];
    for (const [index, file] of files.entries()) {
      const approved = receipt.images.filter(image => image.file === file && image.qa?.accepted === true);
      if (approved.length !== 1) throw new Error(`Missing visual acceptance for ${file}`);
      const source = join(skuRoot, file);
      const info = await stat(source);
      if (!info.isFile() || info.size === 0) throw new Error(`Empty image: ${file}`);
      const bytes = await readFile(source);
      const rawHash = createHash('sha256').update(bytes).digest('hex');
      const hash = rawHash.slice(0, 16);
      await validateGalleryProvenance({
        jobRoot, skuRoot, sku: item.sku, image: approved[0], imageGenRoot,
        toolkitPath: resolve('scripts/source-preserving-composite.py'),
        artworkReview: receipt.sourceArtworkReview, owners: rawImageOwners,
      });
      const metadata = await sharp(bytes).metadata();
      if (!metadata.width || !metadata.height || Math.max(metadata.width, metadata.height) < 1024 || metadata.width * metadata.height < 655_360) throw new Error(`Image too small: ${file}`);
      if (index === 0 && originalIsTransparent && (await sharp(bytes).stats()).isOpaque) throw new Error('Enhanced original lost source transparency');
      const outputRoot = resolve('public/assets/products/generated', item.sku);
      await mkdir(outputRoot, { recursive: true });
      const stem = file.replace('.png', '');
      const fullName = `${stem}-${hash}.webp`;
      const thumbName = `${stem}-${hash}-320.webp`;
      const fullPath = join(outputRoot, fullName);
      const thumbPath = join(outputRoot, thumbName);
      const fullScale = Math.min(1600 / metadata.width, 1600 / metadata.height, 1);
      const thumbScale = Math.min(320 / metadata.width, 320 / metadata.height, 1);
      let fullWidth = Math.round(metadata.width * fullScale);
      let fullHeight = Math.round(metadata.height * fullScale);
      // The source hash is part of both filenames, so unchanged accepted assets can be reused.
      // Re-encoding hundreds of existing images on every incremental import slows production.
      if (!(await preparedDerivative(fullPath, fullWidth, fullHeight))) {
        const full = await sharp(bytes).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90 }).toBuffer({ resolveWithObject: true });
        await writeFile(fullPath, full.data);
        fullWidth = full.info.width;
        fullHeight = full.info.height;
      }
      if (!(await preparedDerivative(thumbPath, Math.round(metadata.width * thumbScale), Math.round(metadata.height * thumbScale)))) {
        await sharp(bytes).rotate().resize({ width: 320, height: 320, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(thumbPath);
      }
      const prefix = `/assets/products/generated/${item.sku}/`;
      images.push({ src: prefix + fullName, thumbnail: prefix + thumbName, alt: `${item.name} — ${descriptions[index]}`, label: labels[index], width: fullWidth, height: fullHeight });
    }
    if (new Set(images.map(image => image.src.match(/-([a-f0-9]{16})\.webp$/)?.[1])).size !== 4) throw new Error('The four output files are not distinct');
    galleries[item.sku] = images;
  } catch (error) {
    blocked.push({ sku: item.sku, reason: error instanceof Error ? error.message : String(error) });
  }
}

const report = { generatedAt: new Date().toISOString(), totalSkus: manifest.items.length, readySkus: Object.keys(galleries).length, readyImages: Object.keys(galleries).length * 4, pendingSkus: pending, blocked };
await writeFile(join(jobRoot, 'import-report.json'), JSON.stringify(report, null, 2) + '\n');
if (requireComplete && (pending.length || blocked.length)) throw new Error(`Release incomplete: ${pending.length} pending SKUs and ${blocked.length} blocked SKUs. See import-report.json.`);
if (blocked.length) throw new Error(`Invalid ready receipts for ${blocked.length} SKUs. See import-report.json.`);
const target = resolve('src/data/product-galleries.generated.ts');
const content = `// Generated by scripts/import-product-galleries.ts from reviewed SKU receipts.\nimport type { ProductGalleryImage } from './product-galleries';\n\nexport const productGalleries: Record<string, ProductGalleryImage[]> = ${JSON.stringify(galleries, null, 2)};\n`;
await writeFile(target + '.tmp', content);
await rename(target + '.tmp', target);
const assetEvidence = [];
for (const [sku, images] of Object.entries(galleries)) {
  const productId = manifest.items.find(item => item.sku === sku)?.id;
  for (const image of images) {
    const [fullBytes, thumbnailBytes] = await Promise.all([
      readFile(resolve('public', image.src.replace(/^\/+/, ''))),
      readFile(resolve('public', image.thumbnail.replace(/^\/+/, ''))),
    ]);
    assetEvidence.push({
      sku, productId, label: image.label, src: image.src,
      sha256: createHash('sha256').update(fullBytes).digest('hex'), bytes: fullBytes.length,
      thumbnail: image.thumbnail,
      thumbnailSha256: createHash('sha256').update(thumbnailBytes).digest('hex'), thumbnailBytes: thumbnailBytes.length,
      width: image.width, height: image.height,
    });
  }
}
await writeFile(join(jobRoot, 'gallery-assets.json'), JSON.stringify({
  generatedAt: report.generatedAt, publicationStatus: 'local-only', verifiedAcceptedSets: verifyReady, finalReleaseValidated: requireComplete,
  readySkus: report.readySkus, readyImages: report.readyImages, images: assetEvidence,
}, null, 2) + '\n');
console.log(JSON.stringify({ totalSkus: report.totalSkus, readySkus: report.readySkus, readyImages: report.readyImages, pendingSkus: pending.length }));
