import { describe, expect, it } from "vitest";
import {
  extractSkuClues,
  matchProduct,
  matchProducts,
  normalizeTitle,
  stripSupabaseUuidPrefix,
} from "./matcher";

const uuid = "550e8400-e29b-41d4-a716-446655440000";

describe("Kayco product matcher", () => {
  it("strips a Supabase UUID prefix without changing the useful filename", () => {
    expect(
      stripSupabaseUuidPrefix(
        `https://example.test/site-media/tuscanini/${uuid}-730400.png`,
      ),
    ).toBe("https://example.test/site-media/tuscanini/730400.png");
  });

  it("extracts SKU clues but not numeric fragments from an upload UUID", () => {
    expect(
      extractSkuClues(
        `https://example.test/${uuid}-Tuscanini-Olive-Oil-730400.png`,
        "Item 730400 / UPC 71006931470",
      ),
    ).toEqual(["730400", "71006931470"]);
  });

  it("normalizes brand, accents, punctuation, entities, SKU, and extension", () => {
    expect(normalizeTitle("Tuscanini® Rosé &amp; Balsamic—730400.PNG")).toBe(
      "rose and balsamic",
    );
  });

  it("does not let an image-derived SKU override strongly conflicting titles", () => {
    const skuMatch = { title: "Different product", skuClue: "730400" };
    const titleMatch = { title: "Extra Virgin Olive Oil", skuClue: "730401" };
    const result = matchProduct(
      { title: "Extra Virgin Olive Oil", image: `/uploads/${uuid}-730400.png` },
      [titleMatch, skuMatch],
    );

    expect(result.match).toBeNull();
    expect(result.method).toBe("sku");
    expect(result.status).toBe("ambiguous");
    expect(result.suggestions[0]?.product).toBe(skuMatch);
    expect(result.reason).toContain("conflicts with the product titles");
    expect(result.requiresReview).toBe(true);
    expect(result.autoPublish).toBe(false);
  });

  it("accepts an image-derived SKU when reordered product titles corroborate it", () => {
    const candidate = { title: "Pesto Basil 6.7Oz Tuscanini", skuClue: "730400" };
    const result = matchProduct(
      { title: "Basil Pesto", image: `/uploads/${uuid}-730400.png` },
      [candidate],
    );

    expect(result.status).toBe("matched");
    expect(result.method).toBe("sku");
    expect(result.match?.product).toBe(candidate);
  });

  it("marks an exact image SKU ambiguous when package sizes materially conflict", () => {
    const candidate = {
      title: "Vinegar Balsamic Of Modena 8.45Oz Tuscanini",
      skuClue: "730400",
    };
    const result = matchProduct(
      {
        title: "Balsamic Vinegar of Modena 500ml",
        size: "16.9 oz (500ml)",
        image: `/uploads/${uuid}-730400.png`,
      },
      [candidate],
    );

    expect(result.status).toBe("ambiguous");
    expect(result.match).toBeNull();
    expect(result.suggestions[0]?.product).toBe(candidate);
    expect(result.reason).toContain("CMS size");
  });

  it("accepts equivalent package sizes expressed in different units", () => {
    const candidate = {
      title: "Oil Olive Extra Light 1L Tuscanini",
      skuClue: "730401",
    };
    const result = matchProduct(
      {
        title: "Extra Light Olive Oil 1L",
        size: "33.8 oz (1L)",
        image: `/uploads/${uuid}-730401.png`,
      },
      [candidate],
    );

    expect(result.status).toBe("matched");
    expect(result.match?.product).toBe(candidate);
  });

  it("marks an exact title ambiguous when current-image and explicit SKUs conflict", () => {
    const candidate = { title: "Extra Virgin Olive Oil", skuClue: "730401" };
    const result = matchProduct(
      {
        title: "Extra Virgin Olive Oil",
        imageUrl: `/uploads/${uuid}-730400.png`,
      },
      [candidate],
    );

    expect(result.status).toBe("ambiguous");
    expect(result.method).toBe("title");
    expect(result.match).toBeNull();
    expect(result.suggestions[0]?.product).toBe(candidate);
    expect(result.reason).toContain("SKU evidence");
  });

  it("does not match shared incidental numbers in nested image metadata", () => {
    const result = matchProduct(
      {
        title: "Extra Virgin Olive Oil",
        image: { id: 730499, width: 730499, height: 730499 },
      },
      [{
        title: "Tomato Sauce",
        image: { id: 730499, width: 730499, height: 730499 },
      }],
    );

    expect(result.status).toBe("unmatched");
    expect(result.method).toBe("none");
    expect(result.match).toBeNull();
  });

  it("matches a valid exact explicit SKU", () => {
    const candidate = { title: "Organic Balsamic Glaze", skuClue: "730402" };
    const result = matchProduct(
      { title: "Balsamic Vinegar", sku: "730402" },
      [candidate],
    );

    expect(result.status).toBe("matched");
    expect(result.method).toBe("sku");
    expect(result.match?.product).toBe(candidate);
    expect(result.match?.clues).toEqual(["730402"]);
  });

  it("does not treat nested image dimensions or media ids as SKU clues", () => {
    const result = matchProduct(
      { title: "A different item", imageUrl: "/uploads/730400.png" },
      [{
        title: "Wrong item",
        skuClue: "730401",
        image: { id: 730400, width: 730400, sourceUrl: "/uploads/730401.png" },
      }],
    );

    expect(result.match).toBeNull();
    expect(result.method).not.toBe("sku");
  });

  it("does not choose among ambiguous exact matches", () => {
    const result = matchProduct(
      { title: "Tuscanini Tomato Sauce", sku: "730200" },
      [
        { title: "Tomato Sauce 24 oz", skuClue: "730200" },
        { title: "Tomato Sauce Foodservice", skuClue: "730200" },
      ],
    );

    expect(result.status).toBe("ambiguous");
    expect(result.method).toBe("sku");
    expect(result.match).toBeNull();
    expect(result.suggestions).toHaveLength(2);
  });

  it("ignores placeholder Kayco images even when their SKU is exact", () => {
    const result = matchProduct(
      { title: "Olive Oil", sku: "730400" },
      [
        {
          title: "Olive Oil",
          skuClue: "730400",
          image: { filename: "pack-shot-pending.svg" },
          placeholder: true,
        },
      ],
    );

    expect(result.status).toBe("unmatched");
    expect(result.match).toBeNull();
    expect(result.suggestions).toEqual([]);
  });

  it("keeps fuzzy matches review-only and flags a close runner-up", () => {
    const first = { title: "Organic Tomato Basil Sauce" };
    const second = { title: "Organic Tomato Garlic Sauce" };
    const result = matchProduct(
      { title: "Organic Tomato Pasta Sauce" },
      [first, second],
      { fuzzyThreshold: 0.4, runnerUpMargin: 0.2 },
    );

    expect(result.method).toBe("fuzzy");
    expect(result.status).toBe("ambiguous");
    expect(result.match).toBeNull();
    expect(result.suggestions[0].product).toBe(first);
    expect(result.runnerUp?.product).toBe(second);
    expect(result.autoPublish).toBe(false);
  });

  it("rejects one exact Kayco record selected by two CMS products", () => {
    const kayco = { title: "Sparkling Lemonade", skuClue: "730380" };
    const results = matchProducts(
      [
        { title: "Sparkling Lemonade", sku: "730380" },
        { title: "Lemonade", sku: "730380" },
      ],
      [kayco],
    );

    expect(results.map(({ status }) => status)).toEqual(["ambiguous", "ambiguous"]);
    expect(results.every(({ match }) => match === null)).toBe(true);
  });
});
