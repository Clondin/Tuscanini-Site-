import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import { categories } from "../../data/products";
import { isMissingProductImage } from "../../lib/productImage";
import CatalogBrowser, { CATALOG_PAGE_SIZE } from "./CatalogBrowser";

const SHOW_MORE = /^Show more products$/;

function Location() {
  return <output data-testid="location">{useLocation().search}</output>;
}
beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("catalog filters", () => {
  const pasta = categories.find(
    (category) => category.slug === "pasta-gnocchi",
  )!;

  it.each([
    ["", true],
    ["?view=shelf", true],
    ["?view=grid", false],
  ])("restores the category view from %s", (search, shelf) => {
    render(
      <MemoryRouter initialEntries={[`/category/pasta-gnocchi${search}`]}>
        <CatalogBrowser categories={categories} category={pasta} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("button", { name: "Shelf" })).toHaveAttribute(
      "aria-pressed",
      String(shelf),
    );
    expect(screen.getByRole("button", { name: "Grid" })).toHaveAttribute(
      "aria-pressed",
      String(!shelf),
    );
    if (shelf)
      expect(
        screen.getByRole("region", { name: "Pasta & Gnocchi shelf" }),
      ).toBeInTheDocument();
    else
      expect(
        screen.queryByRole("region", { name: "Pasta & Gnocchi shelf" }),
      ).not.toBeInTheDocument();
  });

  it("keeps Grid selected when clearing filters and returns to the default Shelf", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/category/pasta-gnocchi"]}>
        <CatalogBrowser categories={categories} category={pasta} />
        <Location />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "Grid" }));
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Storage" }),
      "frozen",
    );
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByTestId("location").textContent).toBe("?view=grid");
    expect(screen.getByRole("button", { name: "Grid" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Shelf" }));
    expect(screen.getByTestId("location").textContent).toBe("");
    expect(
      screen.getByRole("region", { name: "Pasta & Gnocchi shelf" }),
    ).toBeInTheDocument();
  });
  it("restores filters from a shareable URL and clears them without losing products", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter
        initialEntries={["/products?format=frozen&diet=gluten-free"]}
      >
        <CatalogBrowser categories={categories} />
        <Location />
      </MemoryRouter>,
    );
    expect(screen.getByRole("checkbox", { name: "Gluten-free" })).toBeChecked();
    expect(
      screen.getByRole("link", { name: /Frozen Gluten Free Potato Gnocchi/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Bronze Cut Spaghetti/ }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByTestId("location").textContent).toBe("");
    let more = screen.queryByRole("button", { name: SHOW_MORE });
    while (more) {
      await user.click(more);
      more = screen.queryByRole("button", { name: SHOW_MORE });
    }
    expect(
      screen.getByRole("link", { name: /Bronze Cut Spaghetti/ }),
    ).toBeInTheDocument();
  });
  it("reveals the catalog in pages and moves focus to the first new product", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/products"]}>
        <CatalogBrowser categories={categories} />
      </MemoryRouter>,
    );
    const productLinks = () =>
      screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href")?.startsWith("/product/"));
    expect(productLinks()).toHaveLength(CATALOG_PAGE_SIZE);
    await user.click(
      screen.getByRole("button", { name: SHOW_MORE }),
    );
    expect(productLinks().length).toBeGreaterThan(CATALOG_PAGE_SIZE);
    expect(document.activeElement).toBe(productLinks()[CATALOG_PAGE_SIZE]);
  });
  it("filters by collection chip and toggles back to all", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/products"]}>
        <CatalogBrowser categories={categories} />
        <Location />
      </MemoryRouter>,
    );
    const group = screen.getByRole("group", { name: "Filter by collection" });
    const chip = Array.from(group.querySelectorAll("button")).find(
      (button) => button.textContent === "Pasta & Gnocchi",
    )!;
    const count = pasta.products.filter(
      (product) => !isMissingProductImage(product.image),
    ).length;
    await user.click(chip);
    expect(screen.getByTestId("location").textContent).toBe(
      "?category=pasta-gnocchi",
    );
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(`${count} products`, { selector: "p" })).toBeInTheDocument();
    await user.click(chip);
    expect(screen.getByTestId("location").textContent).toBe("");
  });
  it("updates URL state while searching and supports a useful empty state", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CatalogBrowser categories={categories} />
        <Location />
      </MemoryRouter>,
    );
    await user.type(screen.getByRole("searchbox"), "no-such-food");
    expect(screen.getByTestId("location")).toHaveTextContent("q=no-such-food");
    expect(
      screen.getByRole("heading", { name: "No products found" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Browse all collections" }),
    ).toHaveAttribute("href", "/products?view=collections");
  });
});
