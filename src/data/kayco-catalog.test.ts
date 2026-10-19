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

  it('uses the reviewed fries galleries while preserving their API photo references', () => {
    const products = mergeKaycoCatalog(bundledCategories, kaycoSnapshot).flatMap(category => category.products);
    for (const [id, sku] of [
      ['fries-gondola', '730020'], ['fries-crinkle-cut', '730021'],
      ['fries-shoestring', '730022'], ['fries-straight-cut', '730023'],
    ]) {
      const product = products.find(product => product.id === id);
      expect(product?.sku).toBe(sku);
      expect(product?.imageGallery).toHaveLength(4);
      expect(product?.image).toBe(product?.imageGallery?.[0].src);
      expect(product?.image).toMatch(new RegExp(`^/assets/products/generated/${sku}/01-studio-[a-f0-9]{16}\\.webp$`));
      expect(kaycoSnapshot.find(item => item.sku === sku)?.image).toMatch(/^https:\/\/kayco-planning-dashboard\.pages\.dev\/product-images\/[a-f0-9]+\.webp$/);
    }
  });
});
