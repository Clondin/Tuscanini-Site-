import type { Category, Product } from './products';
import { canonicalProductId } from '../lib/productAliases';

/** The only product fields allowed across the private API boundary. */
export interface KaycoProduct {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  size: string;
  image: string;
  madeInItaly: boolean;
  frozen: boolean;
  existing: boolean;
}

const additionalCategories: Record<string, Pick<Category, 'name' | 'tagline' | 'description'>> = {
  'crackers-breadsticks': {
    name: 'Crackers & Breadsticks',
    tagline: 'A Little Crunch',
    description: 'Parchment crackers for cheese boards, antipasti, and everyday snacking.',
  },
  gelato: {
    name: 'Gelato & Sorbetto',
    tagline: 'Something Refreshing',
    description: 'A frozen finish to your favorite meal.',
  },
  'dessert-sauces': {
    name: 'Dessert Sauces',
    tagline: 'The Finishing Touch',
    description: 'Chocolate, caramel, and raspberry sauces for your favorite desserts.',
  },
};

export function isKaycoImage(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.origin === 'https://kayco-planning-dashboard.pages.dev'
      && /^\/product-images\/[a-f0-9]+\.webp$/.test(url.pathname)
      && !url.search && !url.hash && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function isKaycoProduct(value: unknown): value is KaycoProduct {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(item.id)
    && typeof item.sku === 'string' && /^\d{6}$/.test(item.sku)
    && typeof item.name === 'string' && item.name.length > 0
    && typeof item.categoryId === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(item.categoryId)
    && typeof item.size === 'string' && isKaycoImage(item.image)
    && typeof item.madeInItaly === 'boolean' && typeof item.frozen === 'boolean'
    && typeof item.existing === 'boolean';
}

export function mergeKaycoCatalog(base: Category[], products: KaycoProduct[]): Category[] {
  const result = base.map(category => ({ ...category, products: [...category.products] }));
  const seen = new Set<string>();
  for (const source of [...products].sort((a, b) => Number(a.id !== canonicalProductId(a.id)) - Number(b.id !== canonicalProductId(b.id)))) {
    const item = { ...source, id: canonicalProductId(source.id) };
    // An image is mandatory for every API addition; keep originals on missing data.
    if (!isKaycoImage(item.image)) continue;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    let category = result.find(entry => entry.products.some(product => product.id === item.id));
    category ??= result.find(entry => entry.slug === item.categoryId);
    if (!category) {
      const copy = additionalCategories[item.categoryId];
      if (!copy) continue;
      category = { ...copy, id: item.categoryId, slug: item.categoryId, heroImage: item.image, products: [] };
      result.push(category);
    }
    const index = category.products.findIndex(product => product.id === item.id);
    const previous = category.products[index];
    const product: Product = {
      ...previous,
      id: item.id,
      name: item.name,
      categoryId: category.slug,
      description: previous?.description || `${item.name}${item.size ? ` in a ${item.size} pack` : ''}.`,
      image: item.image,
      size: item.size || previous?.size,
      madeInItaly: item.madeInItaly,
      frozen: item.frozen,
      sku: item.sku,
    };
    if (index >= 0) category.products[index] = product;
    else category.products.push(product);
  }
  return result;
}
