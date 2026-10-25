import { describe, expect, it } from "vitest";
import { AMAZON_ASSOCIATE_TAG, getAmazonCartLink, getProductPurchaseLink } from "./productPurchaseLink";

describe("product purchase destinations", () => {
  it("sends a product with no verified listing to a tagged Amazon search", () => {
    const link = getProductPurchaseLink({ id: "unmapped-test-product", categoryId: "pesto", name: "Basil Pesto", size: "6.7 oz" });

    expect(link.href).toBe(`https://www.amazon.com/s?k=Tuscanini+Basil+Pesto+6.7+oz&tag=${AMAZON_ASSOCIATE_TAG}`);
    expect(link.label).toBe("Find on Amazon");
    expect(link.kind).toBe("search");
    expect(link.sponsored).toBe(true);
  });

  it("gives frozen products the same Amazon search instead of a link back to this site", () => {
    const link = getProductPurchaseLink({ id: "fries-gondola", categoryId: "bread-frozen-appetizers", name: "Fries Gondola" });

    expect(new URL(link.href).pathname).toBe("/s");
    expect(new URL(link.href).searchParams.get("k")).toBe("Tuscanini Fries Gondola");
    expect(new URL(link.href).searchParams.get("tag")).toBe(AMAZON_ASSOCIATE_TAG);
  });

  it("builds one add-to-cart link for the verified products only", () => {
    const cart = getAmazonCartLink([{ id: "spaghetti" }, { id: "unmapped-test-product" }, { id: "penne" }]);

    expect(cart?.href).toBe(
      `https://www.amazon.com/gp/aws/cart/add.html?ASIN.1=B089B6L5HH&Quantity.1=1&ASIN.2=B089LV833X&Quantity.2=1&AssociateTag=${AMAZON_ASSOCIATE_TAG}`,
    );
    expect(getAmazonCartLink([{ id: "unmapped-test-product" }])).toBeNull();
  });

  it.each([
    ["all-purpose-flour-2-2lb", "B0FLZ52TXC"],
    ["high-gluten-flour-5lb", "B0FLZQTYFG"],
    ["spelt-white-flour-5lb", "B0FLZFRDTL"],
  ])("opens the verified SKU destination for %s", (id, asin) => {
    const link = getProductPurchaseLink({ id, categoryId: "flour-baking", name: "Flour" });

    expect(new URL(link.href).pathname).toBe(`/dp/${asin}`);
    expect(link.label).toBe("Buy on Amazon");
    expect(new URL(link.href).searchParams.get("tag")).toBe(AMAZON_ASSOCIATE_TAG);
    expect(link.sponsored).toBe(true);
  });
});
