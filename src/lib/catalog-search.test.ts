import { describe, expect, it } from "vitest";
import { categories, type Category } from "../data/products";
import { collectionGroups } from "../data/collection-groups";
import {
  isFrozenProduct,
  normalizeSearch,
  searchCatalog,
} from "./catalog-search";

describe("catalog discovery", () => {
  it("recovers a pistachio misspelling without replacing the search query", () => {
    const matches = searchCatalog(categories, "pistacio");
    expect(matches.length).toBeGreaterThan(0);
    expect(
      matches.some(
        ({ product, approximate }) =>
          /pistachio/i.test(product.name) && approximate,
      ),
    ).toBe(true);
  });
  it("normalizes accents, hyphens, and common oil shorthand", () => {
    expect(normalizeSearch("Rosé Gluten-Free EVOO")).toBe(
      "rose gluten free extra virgin olive oil",
    );
    expect(
      searchCatalog(categories, "gluten-free").map((item) => item.product.id),
    ).toEqual(
      searchCatalog(categories, "gluten free").map((item) => item.product.id),
    );
  });
  it("finds frozen pizza and gnocchi from attributes and returns more than ten matches", () => {
    const matches = searchCatalog(categories, "frozen");
    expect(matches.length).toBeGreaterThan(10);
    expect(matches.some((item) => item.category.slug === "pizza")).toBe(true);
    expect(matches.some((item) => /gnocchi/i.test(item.product.name))).toBe(
      true,
    );
    expect(matches.every((item) => isFrozenProduct(item.product))).toBe(true);
  });
  it("searches size and SKU without displaying imageless products", () => {
    const fixture: Category[] = [
      {
        id: "test",
        slug: "test",
        name: "Pantry",
        description: "",
        tagline: "",
        heroImage: "",
        products: [
          {
            id: "with",
            name: "Olive Oil",
            description: "",
            categoryId: "test",
            image: "/oil.webp",
            size: "750 ml",
            sku: "730405",
          },
          {
            id: "without",
            name: "Olive Oil",
            description: "",
            categoryId: "test",
            image: "",
            size: "750 ml",
          },
        ],
      },
    ];
    expect(
      searchCatalog(fixture, "750 ml").map((item) => item.product.id),
    ).toEqual(["with"]);
    expect(searchCatalog(fixture, "730405")).toHaveLength(1);
    expect(searchCatalog(fixture, "unfindableword")).toHaveLength(0);
  });
  it("places every collection in one navigation family, including unknown CMS collections", () => {
    const newCategory = { ...categories[0], id: "future", slug: "future" };
    const grouped = collectionGroups([...categories, newCategory]).flatMap(
      (group) => group.items.map((category) => category.slug),
    );
    expect(new Set(grouped).size).toBe(categories.length + 1);
    expect(grouped).toHaveLength(categories.length + 1);
    expect(
      collectionGroups(categories)
        .find((group) => group.label === "Snacks & Sweets")!
        .items.some((category) => category.slug === "tuna-seafood"),
    ).toBe(false);
  });
});
