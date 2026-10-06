import { describe, expect, it } from 'vitest';
import { mergeKaycoCatalog } from './kayco-catalog';
import { kaycoSnapshot } from './kayco-catalog.generated';
import { bundledCategories } from './products';

describe('combined Kayco catalog', () => {
  it('keeps flour aliases on one retail page after overlaying the snapshot', () => {
    const products = mergeKaycoCatalog(bundledCategories, kaycoSnapshot).flatMap(category => category.products);
    for (const id of ['all-purpose-flour-2-2lb', 'high-gluten-flour-5lb', 'spelt-white-flour-5lb']) {
      expect(products.filter(product => product.id === id)).toHaveLength(1);
    }
    expect(products.some(product => ['all-purpose-flour-1kg', 'high-gluten-flour-2-27kg', 'spelt-white-flour-2-27kg'].includes(product.id))).toBe(false);
  });

  it('replaces all four fries placeholders with their reviewed Kayco photos', () => {
    const products = mergeKaycoCatalog(bundledCategories, kaycoSnapshot).flatMap(category => category.products);
    for (const id of ['fries-gondola', 'fries-crinkle-cut', 'fries-shoestring', 'fries-straight-cut']) {
      expect(products.find(product => product.id === id)?.image).toMatch(/^https:\/\/kayco-planning-dashboard\.pages\.dev\/product-images\/[a-f0-9]+\.webp$/);
    }
  });
});
