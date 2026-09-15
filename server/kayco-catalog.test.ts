import { describe, expect, it } from 'vitest';
import { catalogResponse, fetchKaycoCatalog, publicCatalog } from './kayco-catalog';
import { kaycoSnapshot } from '../src/data/kayco-catalog.generated';
import { isKaycoImage, mergeKaycoCatalog } from '../src/data/kayco-catalog';
import { bundledCategories } from '../src/data/products';

const sample = kaycoSnapshot.find(item => !item.existing)!;
const source = {
  id: sample.sku, name: `${sample.sku} SPARKLING BEV LEMONADE LARGE 25.3OZ TUSCANINI`,
  range: 'Tuscanini', status: 'A', imageUrl: sample.image, countryOfOriginCode: 'IT',
  netSalesRaw: 123456, unitCostRaw: 22, buyer: 'Private buyer', onHand: 999,
};

describe('public product boundary', () => {
  it('returns only reviewed public fields, never sales, costs, or raw internal names', () => {
    const [product] = publicCatalog({ data: [source] });
    expect(Object.keys(product).sort()).toEqual(['id', 'sku', 'name', 'categoryId', 'size', 'image', 'madeInItaly', 'frozen', 'existing'].sort());
    expect(product.name).toBe(sample.name);
    expect(JSON.stringify(product)).not.toMatch(/Private buyer|netSales|unitCost|onHand|SPARKLING BEV/);
  });

  it.each([
    { imageUrl: null }, { status: 'I' }, { status: 'W' }, { range: 'Other brand' },
    { name: 'TUSCANINI EMPTY DISPLAY SHIPPER' }, { name: 'TUSCANINI BULK 20LB' },
    { name: 'TUSCANINI COSTCO CLUB' }, { imageUrl: 'https://untrusted.example/image.webp' },
    { imageUrl: `${sample.image}?token=private` }, { id: 'unreviewed-sku' },
  ])('rejects ineligible additions: %j', patch => {
    expect(() => publicCatalog({ data: [{ ...source, ...patch }] })).toThrow('Empty catalog');
  });

  it('rejects malformed and duplicate upstream responses', () => {
    expect(() => publicCatalog('<html>dashboard</html>')).toThrow('Invalid catalog');
    expect(() => publicCatalog({ data: [source, source] })).toThrow('Duplicate');
  });

  it('never follows an authenticated redirect or forwards upstream errors', async () => {
    let options: RequestInit | undefined;
    const fetcher = (async (_url: unknown, init: RequestInit) => {
      options = init;
      return new Response('secret upstream error', { status: 403 });
    }) as typeof fetch;
    await expect(fetchKaycoCatalog('test-only-key', fetcher)).rejects.toThrow('Catalog source is unavailable');
    expect(options?.redirect).toBe('error');
    expect(options?.headers).toEqual({ Authorization: 'Bearer test-only-key', Accept: 'application/json' });
  });

  it('serves the public snapshot without a key and rejects write methods', async () => {
    const response = await catalogResponse('GET', '');
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.meta.source).toBe('snapshot');
    expect(payload.data.length).toBeGreaterThan(0);
    expect((await catalogResponse('POST', '')).status).toBe(405);
    expect(await (await catalogResponse('HEAD', '')).text()).toBe('');
  });
});

describe('catalog and stable links', () => {
  it('preserves every existing route and requires an image for all new products', () => {
    const originalIds = bundledCategories.flatMap(category => category.products.map(product => product.id));
    const result = mergeKaycoCatalog(bundledCategories, kaycoSnapshot);
    const products = result.flatMap(category => category.products);
    expect(originalIds.every(id => products.some(product => product.id === id))).toBe(true);
    expect(new Set(products.map(product => product.id)).size).toBe(products.length);
    const added = products.filter(product => !originalIds.includes(product.id));
    expect(added.length).toBe(67);
    expect(added.every(product => isKaycoImage(product.image))).toBe(true);
    expect(added.every(product => product.kosher === undefined)).toBe(true);
  });

  it('retains the original image when an API image is missing', () => {
    const existing = kaycoSnapshot.find(product => product.existing)!;
    const before = bundledCategories.flatMap(category => category.products).find(product => product.id === existing.id)!;
    const merged = mergeKaycoCatalog(bundledCategories, [{ ...existing, image: '' }, { ...sample, image: '' }]);
    expect(merged.flatMap(category => category.products).find(product => product.id === before.id)?.image).toBe(before.image);
    expect(merged.flatMap(category => category.products).some(product => product.id === sample.id)).toBe(false);
  });

  it('keeps CMS editorial content while refreshing the mapped product image and format', () => {
    const original = bundledCategories[0];
    const first = original.products[0];
    const merged = mergeKaycoCatalog([{ ...original, products: [{ ...first, description: 'CMS story', ingredients: 'CMS ingredients' }] }], kaycoSnapshot);
    const product = merged[0].products.find(item => item.id === first.id)!;
    expect(product.description).toBe('CMS story');
    expect(product.ingredients).toBe('CMS ingredients');
    expect(isKaycoImage(product.image)).toBe(true);
    expect(product.id).toBe(first.id);
  });
});
