import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import { categories } from "../../data/products";
import { isMissingProductImage } from "../../lib/productImage";
import CategoryProducts from "./CategoryProducts";

function Location() {
  return <output data-testid="location">{useLocation().search}</output>;
}

const pasta = categories.find((category) => category.slug === "pasta-gnocchi")!;
const withPhotos = pasta.products.filter(
  (product) => !isMissingProductImage(product.image),
);

function renderAt(search = "") {
  render(
    <MemoryRouter initialEntries={[`/category/pasta-gnocchi${search}`]}>
      <CategoryProducts category={pasta} />
      <Location />
    </MemoryRouter>,
  );
}

describe("CategoryProducts", () => {
  afterEach(cleanup);

  it("opens on the shelf with every product and its shelf tag", () => {
    renderAt();
    expect(screen.getByRole("button", { name: "Shelf" })).toHaveAttribute("aria-pressed", "true");
    const shelf = screen.getByRole("region", { name: "Pasta & Gnocchi shelf" });
    const links = within(shelf).getAllByRole("link");
    expect(links).toHaveLength(withPhotos.length);
    expect(links[0]).toHaveAttribute("href", `/product/${withPhotos[0].id}`);
    expect(links[0]).toHaveTextContent(withPhotos[0].name);
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("restores grid from a shared link and switches back to the shelf", async () => {
    const user = userEvent.setup();
    renderAt("?view=grid");
    expect(screen.getByRole("button", { name: "Grid" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("region", { name: "Pasta & Gnocchi shelf" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Shelf" }));
    expect(screen.getByTestId("location").textContent).toBe("");
    expect(screen.getByRole("region", { name: "Pasta & Gnocchi shelf" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Grid" }));
    expect(screen.getByTestId("location").textContent).toBe("?view=grid");
  });
});
