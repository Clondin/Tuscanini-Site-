import { describe, expect, it } from "vitest";
import { getProductPurchaseLink } from "./productPurchaseLink";

describe("product purchase destinations", () => {
  it("identifies a shared Amazon store and its affiliate relationship", () => {
    const link = getProductPurchaseLink({ id: "basil-pesto", categoryId: "pesto" });

    expect(new URL(link.href).pathname).toContain("/stores/Tuscanini/");
    expect(new URL(link.href).searchParams.get("tag")).toBe("kaycopromo-20");
    expect(link.label).toBe("Visit our Amazon store");
    expect(link.sponsored).toBe(true);
  });

  it("does not describe a brand homepage as a store locator", () => {
    const link = getProductPurchaseLink({ id: "fries-gondola", categoryId: "bread-frozen-appetizers" });

    expect(link.href).toBe("https://tuscaninifoods.com");
    expect(link.label).toBe("Visit Tuscanini Foods");
    expect(link.sponsored).toBe(false);
  });

  it.each([
    ["all-purpose-flour-2-2lb", "B0FLZ52TXC"],
    ["high-gluten-flour-5lb", "B0FLZQTYFG"],
    ["spelt-white-flour-5lb", "B0FLZFRDTL"],
  ])("opens the verified SKU destination for %s", (id, asin) => {
    const link = getProductPurchaseLink({ id, categoryId: "flour-baking" });

    expect(link.href).toBe(`https://www.amazon.com/dp/${asin}`);
    expect(link.label).toBe("View product on Amazon");
    expect(new URL(link.href).searchParams.has("tag")).toBe(false);
    expect(link.sponsored).toBe(false);
  });
});
