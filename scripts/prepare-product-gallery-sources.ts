import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const jobRoot = resolve(process.argv[2] ?? 'output/tuscanini-imagegen-20261016');
const manifest = JSON.parse(await readFile(join(jobRoot, 'manifest.json'), 'utf8')) as { items: Array<{ sku: string; sourceImage: string; name: string }> };
let next = 0;
let prepared = 0;
const failures: Array<{ sku: string; reason: string }> = [];

async function download(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (Number(response.headers.get('content-length')) > 32 * 1024 * 1024) throw new Error('Image exceeds 32 MiB');
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length || bytes.length > 32 * 1024 * 1024) throw new Error('Invalid image size');
  return bytes;
}

async function worker() {
  while (next < manifest.items.length) {
    const item = manifest.items[next++];
    const directory = join(jobRoot, 'skus', item.sku);
    await mkdir(directory, { recursive: true });
    if ((await readdir(directory)).some(name => /^source\.(png|webp|jpe?g)$/.test(name))) { prepared++; continue; }
    try {
      let sourceUrl = item.sourceImage;
      try {
        const response = await fetch(`https://www.kayco.com/wp-json/kayco-product-images/v1/products/${item.sku}`, { signal: AbortSignal.timeout(12_000) });
        if (response.ok) {
          const product = await response.json() as { sku?: string; image_url?: string };
          if (product.sku === item.sku && product.image_url?.startsWith('https://www.kayco.com/wp-content/uploads/')) sourceUrl = product.image_url;
        }
      } catch { /* The reviewed existing image remains the fallback. */ }
      let bytes: Buffer;
      try { bytes = await download(sourceUrl); }
      catch (error) { if (sourceUrl === item.sourceImage) throw error; sourceUrl = item.sourceImage; bytes = await download(sourceUrl); }
      const metadata = await sharp(bytes).metadata();
      if (!['png', 'webp', 'jpeg'].includes(metadata.format ?? '')) throw new Error('Unsupported reference format');
      const path = join(directory, `source.${metadata.format === 'jpeg' ? 'jpg' : metadata.format}`);
      await writeFile(path, bytes, { flag: 'wx' });
      await writeFile(join(directory, 'source.json'), JSON.stringify({ sku: item.sku, name: item.name, sourceUrl, catalogReference: item.sourceImage, path, width: metadata.width, height: metadata.height, bytes: bytes.length, visuallyVerified: false }, null, 2) + '\n');
      prepared++;
      console.log(`${item.sku}: reference ready (${metadata.width}x${metadata.height})`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') { prepared++; continue; }
      failures.push({ sku: item.sku, reason: error instanceof Error ? error.message : String(error) });
    }
  }
}

await Promise.all(Array.from({ length: 6 }, worker));
await writeFile(join(jobRoot, 'source-preparation.json'), JSON.stringify({ prepared, total: manifest.items.length, failures }, null, 2) + '\n');
console.log(JSON.stringify({ prepared, total: manifest.items.length, failures }));
