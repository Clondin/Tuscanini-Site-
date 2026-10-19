import { describe, expect, it } from "vitest";
import { AMAZON_ASSOCIATE_TAG, getProductPurchaseLink } from "./productPurchaseLink";

describe("product purchase destinations", () => {
  it("identifies a shared Amazon store and its affiliate relationship", () => {
    const link = getProductPurchaseLink({ id: "unmapped-test-product", categoryId: "pesto" });

    expect(new URL(link.href).pathname).toContain("/stores/Tuscanini/");
    expect(new URL(link.href).searchParams.get("tag")).toBe(AMAZON_ASSOCIATE_TAG);
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

    expect(new URL(link.href).pathname).toBe(`/dp/${asin}`);
    expect(link.label).toBe("Buy on Amazon");
    expect(new URL(link.href).searchParams.get("tag")).toBe(AMAZON_ASSOCIATE_TAG);
    expect(link.sponsored).toBe(true);
  });
});
