import { kaycoSnapshot } from '../src/data/kayco-catalog.generated';
import { isKaycoImage, type KaycoProduct } from '../src/data/kayco-catalog';

const itemsUrl = 'https://kayco-planning-dashboard.clondinski1234.workers.dev/api/v1/items?range=Tuscanini';
const nonRetail = /\b(?:BULK|FOODSERVICE|SHIPPER|EMPTY|DUMP|CLUB|COSTCO|CANADA)\b|AR-TUSCANINI/i;
type SourceItem = Record<string, unknown>;

export function publicCatalog(payload: unknown): KaycoProduct[] {
  if (!payload || typeof payload !== 'object' || !('data' in payload) || !Array.isArray(payload.data)) {
    throw new Error('Invalid catalog response');
  }
  const eligible = new Map<string, SourceItem>();
  for (const value of payload.data) {
    if (!value || typeof value !== 'object') continue;
    const item = value as SourceItem;
    if (typeof item.id !== 'string' || typeof item.name !== 'string'
      || item.range !== 'Tuscanini' || item.status !== 'A' || nonRetail.test(item.name)
      || !isKaycoImage(item.imageUrl)) continue;
    if (eligible.has(item.id)) throw new Error('Duplicate catalog item');
    eligible.set(item.id, item);
  }
  // Only reviewed SKU mappings are exposed. Unknown SKUs require a route rebuild.
  const products = kaycoSnapshot.flatMap(definition => {
    const item = eligible.get(definition.sku);
    if (!item) return [];
    const sourceName = item.name as string;
    const size = sourceName.match(/(?<![\d.])(?:\d+\s*x\s*)?(?:\d+(?:\.\d+)?|\.\d+)\s*(?:FL\s*OZ|OZ|ML|KG|LB|LT|L|PT)\b/i)?.[0]
      .replace(/(\d)([a-z])/ig, '$1 $2').replace(/\s*x\s*/gi, ' × ').toLowerCase();
    return [{
      id: definition.id, sku: definition.sku, name: definition.name,
      categoryId: definition.categoryId, size: size || definition.size,
      image: item.imageUrl as string, madeInItaly: item.countryOfOriginCode === 'IT',
      frozen: definition.frozen, existing: definition.existing,
    }];
  });
  if (products.length === 0) throw new Error('Empty catalog response');
  return products;
}

export async function fetchKaycoCatalog(apiKey: string, fetcher: typeof fetch = fetch): Promise<KaycoProduct[]> {
  const response = await fetcher(itemsUrl, {
    headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(8_000),
    redirect: 'error',
  });
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Catalog source is unavailable');
  }
  return publicCatalog(await response.json());
}

let cached: { data: KaycoProduct[]; expires: number } | undefined;
let pending: Promise<KaycoProduct[]> | undefined;

export async function catalogResponse(method: string, apiKey = process.env.KAYCO_API_KEY): Promise<Response> {
  if (method !== 'GET' && method !== 'HEAD') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  let data = kaycoSnapshot;
  let source = 'snapshot';
  if (apiKey) {
    try {
      if (!cached || cached.expires <= Date.now()) {
        pending ??= fetchKaycoCatalog(apiKey).finally(() => { pending = undefined; });
        cached = { data: await pending, expires: Date.now() + 300_000 };
      }
      data = cached.data;
      source = 'live';
    } catch {
      // Never send upstream errors, raw payloads, or credentials to a visitor.
      data = cached?.data ?? kaycoSnapshot;
      source = cached ? 'cached' : 'snapshot';
    }
  }
  return new Response(method === 'HEAD' ? null : JSON.stringify({ data, meta: { source, count: data.length } }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
