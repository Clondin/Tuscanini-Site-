import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { Product } from "../../data/products";
import { opaquePackShots } from "../../data/opaque-pack-shots.generated";
import PackFan from "./PackFan";

const product = (id: string, image: string): Product => ({
  id,
  name: id,
  description: "",
  image,
  categoryId: "beverages",
});

describe("PackFan", () => {
  afterEach(cleanup);
  const opaque = [...opaquePackShots][0];
  const products = [
    product("opaque", opaque),
    product("clear-a", "/assets/clear-a.png"),
    product("clear-b", "/assets/clear-b.png"),
  ];
  const front = (container: HTMLElement) =>
    container.querySelector("img:last-of-type")?.getAttribute("src");

  it("puts a transparent pack in front on colored panels", () => {
    const { container } = render(<PackFan products={products} onColor />);
    expect(front(container)).toBe("/assets/clear-a.png");
  });

  it("keeps catalog order on light panels", () => {
    const { container } = render(<PackFan products={products} />);
    expect(front(container)).toBe(opaque);
  });
});
