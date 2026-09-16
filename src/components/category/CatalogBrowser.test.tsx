import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import { categories } from "../../data/products";
import CatalogBrowser from "./CatalogBrowser";

function Location() {
  return <output data-testid="location">{useLocation().search}</output>;
}
afterEach(cleanup);
describe("catalog filters", () => {
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
    expect(
      screen.getByRole("link", { name: /Bronze Cut Spaghetti/ }),
    ).toBeInTheDocument();
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
      screen.getByRole("heading", { name: "No products match just yet" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Explore all collections" }),
    ).toHaveAttribute("href", "/products?view=collections");
  });
});
