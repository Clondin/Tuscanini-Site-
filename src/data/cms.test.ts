import { afterEach, describe, expect, it, vi } from "vitest";

const flourCategory = {
  slug: "flour-baking",
  title: "Flour & Baking",
  description: "Italian flour",
  data: { hero_image: "/flour.webp" },
};

function publishedProduct(id: string, title: string) {
  return {
    slug: id,
    title,
    description: "All purpose flour",
    data: { source_id: id, category_slug: "flour-baking", image: "/flour.webp", size: "1 kg (2.2 lb)" },
  };
}

function mockContent(products: ReturnType<typeof publishedProduct>[]) {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    const type = new URL(url).pathname.split("/").at(-1);
    const data = type === "category" ? [flourCategory] : type === "product" ? products : type === "recipe" ? [{
      slug: "bread",
      title: "Bread",
      description: "Bake bread",
      data: { related_products: ["all-purpose-flour-1kg", "all-purpose-flour-2-2lb"] },
    }] : [];
    return new Response(JSON.stringify({ data, meta: { nextCursor: null } }));
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("published catalog flour aliases", () => {
  it("keeps an old-only published SKU reachable at the permanent redirect target", async () => {
    vi.resetModules();
    mockContent([publishedProduct("all-purpose-flour-1kg", "Published flour")]);
    const cms = await import("./cms");
    const catalog = await import("./products");

    expect(await cms.initializeCmsContent()).toBe(true);
    expect(catalog.getProductById("all-purpose-flour-2-2lb")?.name).toBe("Published flour");
    expect(catalog.getProductById("all-purpose-flour-1kg")?.id).toBe("all-purpose-flour-2-2lb");
    const { recipes } = await import("./recipes");
    expect(recipes[0].products).toEqual(["all-purpose-flour-2-2lb"]);
  });

  it("shows one SKU and prefers its canonical published entry when both versions exist", async () => {
    vi.resetModules();
    mockContent([
      publishedProduct("all-purpose-flour-1kg", "Old metric entry"),
      publishedProduct("all-purpose-flour-2-2lb", "Canonical entry"),
    ]);
    const cms = await import("./cms");
    const catalog = await import("./products");

    await cms.initializeCmsContent();
    expect(catalog.categories[0].products).toHaveLength(1);
    expect(catalog.categories[0].products[0].name).toBe("Canonical entry");
  });

  it("retains the complete bundled catalog if the published product request fails", async () => {
    vi.resetModules();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    mockContent([]);
    const fetchMock = vi.mocked(fetch);
    const normalFetch = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation(async (url, options) => String(url).includes("/product?")
      ? new Response("Unavailable", { status: 503 })
      : normalFetch(url, options));
    const cms = await import("./cms");
    const catalog = await import("./products");
    const bundledCatalog = catalog.categories;

    expect(await cms.initializeCmsContent()).toBe(false);
    expect(catalog.categories).toBe(bundledCatalog);
    expect(catalog.getProductById("all-purpose-flour-2-2lb")).toBeDefined();
  });
});
