import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { categories, setCatalogCategories } from "../../data/products";
import CollectionsGrid from "./CollectionsGrid";
const bundledCatalog = categories;
afterEach(() => { cleanup(); setCatalogCategories(bundledCatalog); });
describe("CollectionsGrid", () => {
 it("links to the complete collection browser from featured categories", () => {
  render(<MemoryRouter><CollectionsGrid /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'All collections →' })).toHaveAttribute('href', '/products?view=collections');
  expect(screen.getByRole('link', { name: 'See every collection' })).toHaveAttribute('href', '/products?view=collections');
  const featured = screen.getAllByRole('link').filter(link => link.getAttribute('href')?.startsWith('/category/'));
  expect(featured).toHaveLength(6);
  for (const link of featured) expect(bundledCatalog.some(category => `/category/${category.slug}` === link.getAttribute('href'))).toBe(true);
 });
 it("does not link to removed categories when published content replaces the catalog", () => {
  setCatalogCategories([{ ...bundledCatalog[0], name: 'New Collection', slug: 'new-collection', products: [] }]);
  render(<MemoryRouter><CollectionsGrid /></MemoryRouter>);
  expect(screen.getAllByRole('link').every(link => link.getAttribute('href') === '/products?view=collections')).toBe(true);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
 });
});
