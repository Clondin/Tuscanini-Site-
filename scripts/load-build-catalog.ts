import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { bundledCategories, type Category } from '../src/data/products';
import { mapCatalog } from '../src/data/cms';
import { mergeKaycoCatalog } from '../src/data/kayco-catalog';
import { kaycoSnapshot } from '../src/data/kayco-catalog.generated';
import { fetchKaycoCatalog } from '../server/kayco-catalog';

interface Entry { slug: string; title: string; description: string | null; data: Record<string, unknown> }
const artifact = resolve('.artifacts/catalog-build.json');

async function listAll(baseUrl: string, type: string): Promise<Entry[]> {
  const items: Entry[] = [];
  const cursors = new Set<string>();
  let cursor: string | null = null;
  do {
    const query = new URLSearchParams({ limit: '100' });
    if (cursor) query.set('cursor', cursor);
    const response = await fetch(`${baseUrl}/sites/tuscanini/content/${type}?${query}`, { signal: AbortSignal.timeout(8_000) });
    if (!response.ok) throw new Error('CMS unavailable');
    const payload = await response.json() as { data: Entry[]; meta: { nextCursor: string | null } };
    if (!Array.isArray(payload.data)) throw new Error('Invalid CMS response');
    items.push(...payload.data);
    cursor = payload.meta.nextCursor;
    if (cursor && cursors.has(cursor)) throw new Error('Repeated CMS cursor');
    if (cursor) cursors.add(cursor);
  } while (cursor);
  return items;
}

/** Persist one catalog so sitemap and generated route metadata use the same data. */
export async function prepareBuildCatalog(): Promise<Category[]> {
  const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
  const apiUrl = (env.VITE_KAYCO_CONTENT_API_URL || 'https://qkatfirzwukmgdrytbue.supabase.co/functions/v1/content-api').replace(/\/+$/, '');
  const [cmsResult, kaycoResult] = await Promise.allSettled([
    Promise.all([listAll(apiUrl, 'category'), listAll(apiUrl, 'product')]),
    env.KAYCO_API_KEY ? fetchKaycoCatalog(env.KAYCO_API_KEY) : Promise.resolve(kaycoSnapshot),
  ]);
  let base = bundledCategories;
  if (cmsResult.status === 'fulfilled') {
    const mapped = mapCatalog(...cmsResult.value);
    if (mapped.some(category => category.products.length > 0)) base = mapped;
  } else {
    console.warn('CMS unavailable during build; using bundled editorial content.');
  }
  const products = kaycoResult.status === 'fulfilled' ? kaycoResult.value : kaycoSnapshot;
  const catalog = mergeKaycoCatalog(base, products);
  await mkdir(resolve('.artifacts'), { recursive: true });
  await writeFile(artifact, JSON.stringify(catalog), 'utf8');
  return catalog;
}

export async function readBuildCatalog(): Promise<Category[]> {
  return JSON.parse(await readFile(artifact, 'utf8')) as Category[];
}
