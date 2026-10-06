import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { categories, setCatalogCategories } from "../../data/products";
import CollectionsGrid from "./CollectionsGrid";

const bundledCatalog = categories;

afterEach(() => {
  cleanup();
  setCatalogCategories(bundledCatalog);
});

describe("CollectionsGrid", () => {
  it("reveals every collection promised by the action", () => {
    render(<MemoryRouter><CollectionsGrid /></MemoryRouter>);
    expect(screen.getAllByRole("link")).toHaveLength(9);

    const action = screen.getByRole("button", { name: `All ${bundledCatalog.length} collections →` });
    fireEvent.click(action);

    expect(action).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("link")).toHaveLength(bundledCatalog.length);
    expect(screen.getAllByRole("link").map((link) => link.getAttribute("href")).sort())
      .toEqual(bundledCatalog.map((category) => `/category/${category.slug}`).sort());
  });

  it("uses the published catalog instead of linking to removed hardcoded collections", () => {
    setCatalogCategories([{
      ...bundledCatalog[0],
      name: "New Collection",
      slug: "new-collection",
      tagline: "Published collection tagline",
      heroImage: "https://example.com/published-image.webp",
      products: [],
    }]);
    render(<MemoryRouter><CollectionsGrid /></MemoryRouter>);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/category/new-collection");
    expect(screen.getByAltText("New Collection")).toHaveAttribute("src", "https://example.com/published-image.webp");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
