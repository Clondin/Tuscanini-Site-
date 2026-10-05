import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import type { Product } from "../../data/products";
import ProductDossier from "./ProductDossier";

const product: Product = {
  id: "basil-pesto",
  categoryId: "pesto",
  name: "Basil Pesto",
  description: "Classic basil pesto.",
  image: "/assets/Pesto/730231.png",
  size: "250ml",
  madeInItaly: true,
};

describe("ProductDossier", () => {
  afterEach(cleanup);

  it("uses the product's origin flag and formats its size without a bottling claim", () => {
    const view = render(
      <MemoryRouter>
        <ProductDossier product={product} categoryName="Pesto" categorySlug="pesto" siblings={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Origin").parentElement).toHaveTextContent("Made in Italy");
    expect(screen.getByText("Format").parentElement).toHaveTextContent("250 mL");
    expect(screen.queryByText(/bottled/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Visit our Amazon store" })).toHaveAttribute(
      "rel", "sponsored noopener noreferrer",
    );

    view.rerender(
      <MemoryRouter>
        <ProductDossier product={{ ...product, madeInItaly: false }} categoryName="Pesto" categorySlug="pesto" siblings={[]} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Origin")).not.toBeInTheDocument();
    expect(screen.queryByText("Made in Italy")).not.toBeInTheDocument();
  });

  it("identifies unavailable photos and offers zoom only for real images", () => {
    render(
      <MemoryRouter>
        <ProductDossier
          product={{ ...product, image: "/assets/placeholders/pack-shot-pending.svg" }}
          categoryName="Pesto"
          categorySlug="pesto"
          siblings={[{ ...product, id: "pending", name: "Pending product", image: "/assets/placeholders/pack-shot-pending.svg" }]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Product image unavailable")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /view larger image/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Pending product" })).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
