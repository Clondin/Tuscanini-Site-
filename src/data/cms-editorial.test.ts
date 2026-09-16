import { describe, expect, it } from "vitest";
import { mapCatalog, mapRecipes } from "./cms";

describe("published editorial fields", () => {
  it("accepts existing CMS recipe directions as a list or multiline text and tolerates older entries", () => {
    const base = { slug: "recipe", title: "Pasta", description: null };
    const rows = mapRecipes([
      {
        ...base,
        data: { instructions: ["Boil water.", "  "], ingredients: ["Pasta"] },
      },
      {
        ...base,
        slug: "multiline",
        data: { instructions: "Boil water.\nCook pasta." },
      },
      { ...base, slug: "legacy", data: {} },
    ]);
    expect(rows[0].instructions).toEqual(["Boil water."]);
    expect(rows[1].instructions).toEqual(["Boil water.", "Cook pasta."]);
    expect(rows[2].instructions).toEqual([]);
    expect(rows[0].servings).toBeUndefined();
    expect(rows[2].servings).toBeUndefined();
  });
  it("maps preparation and nutrition fields without creating missing facts", () => {
    const category = {
      slug: "pasta",
      title: "Pasta",
      description: "",
      data: {},
    };
    const product = {
      slug: "pasta",
      title: "Pasta",
      description: "",
      data: {
        category_slug: "pasta",
        storage: "Keep frozen.",
        prep: ["Boil | Cook as directed."],
        nfp_image: "https://example.com/label.png",
        nutrition_calories: 0,
        nutrition_facts: ["Protein | 4g"],
      },
    };
    const mapped = mapCatalog([category], [product])[0].products[0];
    expect(mapped.storage).toBe("Keep frozen.");
    expect(mapped.preparation).toEqual(["Boil | Cook as directed."]);
    expect(mapped.nutritionCalories).toBe("0");
    expect(mapped.nutritionFacts).toEqual(["Protein | 4g"]);
    expect(mapped.ingredients).toBe("");
  });
});
