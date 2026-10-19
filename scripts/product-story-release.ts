import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { sha256 } from './gallery-provenance';
import { productGalleries } from '../src/data/product-galleries.generated';
import { readStoryJson, requireStory } from './product-story-contract';

interface Asset {
  sku: string; productId: string; productionVersion: string; src: string; thumbnail: string; label: string;
  sha256: string; bytes: number; thumbnailSha256: string; thumbnailBytes: number;
}
interface Snapshot {
  schema: string; name: string; origin: string; generatedAt: string; targetSkus: number; targetImages: number;
  readySkus: number; readyImages: number; readySkuList: string[]; totalDisplayedSkus: number;
  finalReleaseValidated: boolean; verifiedAcceptedSets: boolean; images: Asset[];
}
const jobRoot = resolve('output/tuscanini-product-stories-20261019');
const [command, name] = process.argv.slice(2);
requireStory(['freeze', 'verify'].includes(command) && /^[a-z0-9-]+$/.test(name ?? ''), 'Usage: product-story-release.ts freeze|verify IMMUTABLE-RELEASE-NAME');
const directory = join(jobRoot, 'releases');
await mkdir(directory, { recursive: true });
const snapshotPath = join(directory, `${name}.snapshot.json`);
const canonical = 'https://tuscanini-site.vercel.app';

function validateSnapshot(snapshot: Snapshot) {
  requireStory(snapshot.schema === 'tuscanini-product-story-release/v1' && snapshot.origin === canonical && snapshot.targetSkus === 207 && snapshot.targetImages === 828 && snapshot.verifiedAcceptedSets === true, 'Unexpected or unverified product-story release');
  requireStory(snapshot.readySkus > 0 && snapshot.readySkus <= 207 && snapshot.readyImages === snapshot.readySkus * 4 && snapshot.readySkuList.length === snapshot.readySkus && new Set(snapshot.readySkuList).size === snapshot.readySkus, 'New-role accepted-set coverage does not match the snapshot');
  requireStory(snapshot.images.length === snapshot.totalDisplayedSkus * 4 && snapshot.totalDisplayedSkus <= 207, 'Displayed gallery coverage does not match the snapshot');
  const groups = new Map<string, Asset[]>();
  for (const image of snapshot.images) {
    const prefix = `/assets/products/generated/${image.sku}/`;
    requireStory(/^\d{6}$/.test(image.sku) && image.src.startsWith(prefix) && image.thumbnail.startsWith(prefix) && !image.src.includes('..') && !image.thumbnail.includes('..') && /^[a-f0-9]{64}$/.test(image.sha256) && /^[a-f0-9]{64}$/.test(image.thumbnailSha256) && image.bytes > 0 && image.thumbnailBytes > 0, 'Invalid exact-SKU asset in release');
    const isNew = snapshot.readySkuList.includes(image.sku);
    requireStory(image.productionVersion === (isNew ? 'product-stories-v1' : 'legacy'), 'Legacy gallery counted as a new product story');
    groups.set(image.sku, [...groups.get(image.sku) ?? [], image]);
  }
  requireStory(groups.size === snapshot.totalDisplayedSkus, 'Repeated or missing displayed SKU');
  for (const [sku, images] of groups) {
    requireStory(images.length === 4 && new Set(images.map(image => image.src)).size === 4 && new Set(images.map(image => image.productId)).size === 1, 'A release must contain complete ordered exact-SKU galleries');
    if (snapshot.readySkuList.includes(sku)) requireStory(images.map(image => image.label).join(',') === 'Product,In use,Occasion,Product family', 'New gallery role order is incorrect');
  }
  requireStory(snapshot.readySkuList.every(sku => groups.has(sku)), 'Accepted new set missing from deployed snapshot');
  if (snapshot.finalReleaseValidated) requireStory(snapshot.readySkus === 207 && snapshot.readyImages === 828 && groups.size === 207 && snapshot.images.every(image => image.productionVersion === 'product-stories-v1'), 'Final release requires all 207 revised sets; no network requests made');
  return groups;
}

if (command === 'freeze') {
  const evidence = await readStoryJson<Snapshot & { productionVersion: string; pendingSkus: string[]; blocked: unknown[] }>(join(jobRoot, 'gallery-assets.json'));
  requireStory(evidence.productionVersion === 'product-stories-v1' && evidence.blocked.length === 0, 'Only a clean verified new-role import may be frozen');
  const latest = await readStoryJson<{ generatedAt: string; blocked: unknown[]; readySkuList: string[] }>(join(jobRoot, 'import-report.json'));
  requireStory(latest.blocked.length === 0 && latest.generatedAt === evidence.generatedAt && JSON.stringify(latest.readySkuList) === JSON.stringify(evidence.readySkuList), 'The latest import failed or no longer matches this asset manifest');
  try {
    const holds = await readStoryJson<{ holds: Array<{ sku: string; status: string }> }>(join(jobRoot, 'release-holds.json'));
    requireStory(!holds.holds.some(hold => hold.status === 'held' && evidence.readySkuList.includes(hold.sku)), 'A current coordinator hold excludes an accepted gallery from publication');
  } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  const snapshot: Snapshot = { schema: 'tuscanini-product-story-release/v1', name, origin: canonical, generatedAt: new Date().toISOString(), targetSkus: 207, targetImages: 828, readySkus: evidence.readySkus, readyImages: evidence.readyImages, readySkuList: evidence.readySkuList, totalDisplayedSkus: evidence.totalDisplayedSkus, finalReleaseValidated: evidence.finalReleaseValidated, verifiedAcceptedSets: evidence.verifiedAcceptedSets, images: evidence.images };
  const groups = validateSnapshot(snapshot);
  requireStory(Object.keys(productGalleries).length === groups.size && [...groups].every(([sku, images]) => productGalleries[sku]?.length === 4 && images.every((image, index) => productGalleries[sku][index].src === image.src && productGalleries[sku][index].thumbnail === image.thumbnail && productGalleries[sku][index].label === image.label)), 'Current site gallery index differs from the verified asset manifest');
  for (const image of snapshot.images) {
    const full = await readFile(resolve('public', image.src.slice(1))), thumbnail = await readFile(resolve('public', image.thumbnail.slice(1)));
    requireStory(full.length === image.bytes && sha256(full) === image.sha256 && thumbnail.length === image.thumbnailBytes && sha256(thumbnail) === image.thumbnailSha256, 'Local derivative changed after verified import');
  }
  await writeFile(snapshotPath, JSON.stringify(snapshot, null, 2) + '\n', { flag: 'wx' });
  const code = ['docs/cms-integration.md', 'scripts/source-preserving-stories-v2.py', 'scripts/test_source_preserving_stories_v2.py', 'scripts/family-provenance.ts', 'scripts/family-provenance.test.ts', 'scripts/product-story-contract.ts', 'scripts/product-story-contract.test.ts', 'scripts/prepare-product-story-approval.ts', 'scripts/source-component-qualification.ts', 'scripts/source-component-qualification.test.ts', 'scripts/import-product-stories.ts', 'scripts/product-story-release.ts', 'src/data/product-galleries.generated.ts'];
  const paths = [...new Set([...code, ...snapshot.images.flatMap(image => [`public${image.src}`, `public${image.thumbnail}`])])];
  await writeFile(join(directory, `${name}.stage-paths.nul`), paths.join('\0') + '\0', { flag: 'wx' });
  console.log(JSON.stringify({ snapshotPath, snapshotSha256: sha256(await readFile(snapshotPath)), revisedSets: snapshot.readySkus, displayedSets: snapshot.totalDisplayedSkus, finalReleaseValidated: snapshot.finalReleaseValidated }));
} else {
  const snapshot = await readStoryJson<Snapshot>(snapshotPath);
  const groups = validateSnapshot(snapshot);
  const report = { startedAt: new Date().toISOString(), origin: canonical, revisedSets: snapshot.readySkus, revisedImages: snapshot.readyImages, displayedSets: snapshot.totalDisplayedSkus, fullGoalComplete: snapshot.finalReleaseValidated, snapshotSha256: sha256(await readFile(snapshotPath)), assets: [] as unknown[], products: [] as unknown[], failures: [] as Array<{ path: string; error: string }>, passed: false, completedAt: '' };
  async function request(path: string) {
    const response = await fetch(new URL(path, canonical), { signal: AbortSignal.timeout(45_000), redirect: 'follow' });
    requireStory(response.ok && new URL(response.url).origin === canonical, `HTTP ${response.status} or external redirect: ${path}`);
    return response;
  }
  async function pool<T extends { path: string }>(items: T[], operation: (item: T) => Promise<void>) {
    let next = 0, finished = 0;
    await Promise.all(Array.from({ length: 6 }, async () => {
      while (next < items.length) {
        const item = items[next++];
        try { await operation(item); } catch (error) { report.failures.push({ path: item.path, error: error instanceof Error ? error.message : String(error) }); }
        finished++;
        if (finished % 100 === 0 || finished === items.length) console.log(JSON.stringify({ finished, total: items.length, failures: report.failures.length }));
      }
    }));
  }
  const requests = snapshot.images.flatMap(image => [{ sku: image.sku, path: image.src, sha256: image.sha256, bytes: image.bytes }, { sku: image.sku, path: image.thumbnail, sha256: image.thumbnailSha256, bytes: image.thumbnailBytes }]);
  await pool(requests, async item => {
    const response = await request(item.path);
    requireStory(response.headers.get('content-type')?.includes('image/webp'), 'Expected WebP content');
    const bytes = Buffer.from(await response.arrayBuffer());
    requireStory(bytes.length === item.bytes && sha256(bytes) === item.sha256, 'Deployed image differs from the exact approved derivative');
    report.assets.push({ ...item, verified: true });
  });
  const flatten = (value: unknown): Array<Record<string, unknown>> => Array.isArray(value) ? value.flatMap(flatten) : value && typeof value === 'object' ? [value as Record<string, unknown>, ...flatten((value as Record<string, unknown>)['@graph'])] : [];
  await pool([...groups.entries()].map(([sku, images]) => ({ sku, images, path: `/product/${encodeURIComponent(images[0].productId)}` })), async item => {
    const response = await request(item.path);
    requireStory(response.headers.get('content-type')?.includes('text/html'), 'Expected product HTML');
    const html = await response.text();
    const nodes = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap(match => flatten(JSON.parse(match[1])));
    const expected = item.images.map(image => new URL(image.src, canonical).href);
    requireStory(nodes.some(node => (node['@type'] === 'Product' || Array.isArray(node['@type']) && node['@type'].includes('Product')) && JSON.stringify(node.image) === JSON.stringify(expected)), 'Product metadata does not list its exact four images in order');
    const og = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => match[0]).filter(tag => /property=["']og:image["']/i.test(tag));
    requireStory(og.some(tag => tag.includes(`content="${expected[0]}"`) || tag.includes(`content='${expected[0]}'`)), 'Main social image is not the exact approved studio');
    report.products.push({ sku: item.sku, path: item.path, images: expected, productionVersion: item.images[0].productionVersion, verified: true });
  });
  report.completedAt = new Date().toISOString();
  report.passed = !report.failures.length && report.assets.length === requests.length && report.products.length === groups.size;
  await writeFile(join(directory, `${name}.live-verification.json`), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ passed: report.passed, revisedSets: snapshot.readySkus, fullAndThumbnailAssets: report.assets.length, productPages: report.products.length, failures: report.failures.length, fullGoalComplete: report.fullGoalComplete }));
  if (!report.passed) process.exitCode = 1;
}
